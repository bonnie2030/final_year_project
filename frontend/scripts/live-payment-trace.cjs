const { io } = require('socket.io-client');

const base = 'http://127.0.0.1:5000';
const start = Date.now();
const t = () => Date.now() - start;

async function run() {
  const routesRes = await fetch(base + '/api/routes');
  const routesData = await routesRes.json();
  const routes = Array.isArray(routesData) ? routesData : (routesData.routes || []);
  if (!routes.length) throw new Error('No routes found for payment test');

  const routeId = Number(routes[0].id);
  const socket = io(base, { transports: ['websocket', 'polling'] });

  await new Promise((resolve, reject) => {
    socket.once('connect', () => {
      console.log('Socket connected at', t() + 'ms');
      resolve();
    });
    socket.once('connect_error', (error) => {
      reject(new Error('socket connect failed: ' + error.message));
    });
    setTimeout(() => reject(new Error('socket connect timeout')), 10000);
  });

  let socketEventAt = null;
  let socketPayload = null;

  const paymentRes = await fetch(base + '/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeId, amount: 50, phoneNumber: '0712345678' })
  });

  const paymentData = await paymentRes.json();
  if (!paymentRes.ok) throw new Error('simulate failed: ' + JSON.stringify(paymentData));

  const paymentId = Number(paymentData?.payment?.id);
  if (!paymentId) throw new Error('No payment id in response');

  console.log('Payment created id=', paymentId, 'at', t() + 'ms');
  socket.emit('join', 'payment_' + paymentId);
  console.log('Socket joined room at', t() + 'ms');

  await new Promise((resolve) => {
    socket.on('payment.statusUpdated', (payload) => {
      if (Number(payload?.payment_id) !== paymentId) return;
      if (socketEventAt === null) {
        socketEventAt = t();
        socketPayload = payload;
        console.log('Socket status event at', socketEventAt + 'ms status=' + payload.status);
        if (payload.status === 'completed' || payload.status === 'failed') {
          resolve();
        }
      }
    });

    setTimeout(resolve, 12000);
  });

  let pollResolvedAt = null;
  let pollStatus = 'pending';
  let paymentFinal = null;

  for (let i = 0; i < 20; i++) {
    const r = await fetch(base + '/api/payments/' + paymentId + '?refresh=1');
    const d = await r.json();
    const payment = d.payment || d;
    pollStatus = payment?.status || 'unknown';
    if (pollStatus === 'completed' || pollStatus === 'failed') {
      pollResolvedAt = t();
      paymentFinal = payment;
      break;
    }
    await new Promise((res) => setTimeout(res, 500));
  }

  console.log(JSON.stringify({
    paymentId,
    socketEventAt,
    pollResolvedAt,
    pollStatus,
    socketPayload,
    paymentFinalStatus: paymentFinal?.status || null
  }, null, 2));

  socket.disconnect();
}

run()
  .catch((e) => {
    console.error('TEST_ERROR', e.message);
    process.exit(1);
  })
  .finally(() => {
    setTimeout(() => process.exit(0), 100);
  });
