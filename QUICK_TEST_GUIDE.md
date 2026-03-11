# Quick Start: Test WhatsApp Ticket Sending

## Video: 3 Minute Test Procedure

### Phase 1: Prepare (1 minute)

1. **Open 2 PowerShell windows side by side:**
   - Window A (left): Backend logs
   - Window B (right): Commands to run

2. **In Window A - Start backend and watch logs:**
   ```powershell
   cd "c:\Users\Peter Muriithi\projects\final_year_project\backend"
   node server.js
   ```
   - Wait for: "✓ Socket.IO initialized"
   - Leave this running

3. **In Window B - Start frontend:**
   ```powershell
   cd "c:\Users\Peter Muriithi\projects\final_year_project\frontend"
   npm run dev
   ```
   - Wait for: "Local: http://localhost:5173"

### Phase 2: Join Twilio Sandbox (1 minute, one-time)

1. **On your phone (the one you'll test with):**
   - Open WhatsApp
   - Message: **+1 415 523 8886**
   - Send: **join break-additional**
   - Wait for Twilio response confirming you joined

2. **Important:** You're now in the sandbox for 72 hours

### Phase 3: Run Payment Flow (1 minute)

1. **In browser (http://localhost:5173):**
   - Navigate to Driver Dashboard (or payment page)
   - Click "Pay Ticket" (or Payment button)
   - **Enter phone:** 0712345678 (or your actual number)
   - **Enter amount:** 50 (or any amount)
   - Click "Process Payment"
   - When asked "Send to WhatsApp?", click **"Yes Send Now"**

2. **Immediately look at Window A (Backend logs):**
   - Search for magenta/bright text starting with `[PaymentController.sendTicketToWhatsApp]`
   - Copy everything from that line until you see a response line (ending with 200 or error)

3. **On your phone:**
   - WhatsApp should show a message in 5-10 seconds (or error details in logs)

## What Success Looks Like

**Backend logs will show:**
```
[PaymentController.sendTicketToWhatsApp] Called with paymentId: 123
[PaymentController] Found payment: { id: 123, status: completed, phone: 0712345678 }
[PaymentController] Sending WhatsApp to normalized phone: 254712345678
✓ WhatsApp message sent via Twilio: { phone: whatsapp:+254712345678, sid: SMxxxxxxxx }
[PaymentController] WhatsApp ticket sent successfully to: 254712345678
```

**WhatsApp will show the message:**
```
💰 Payment Confirmed
Your payment has been recorded.

📍 Route: Route 1
🚌 Vehicle: N/A
💵 Amount: KES 50
🎟️ Ticket: SIM-1234567890-abc123
📅 Date: 16 Nov 2024

Thank you for using MatatuConnect!
```

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Backend shows `Code: 63007` | **You haven't joined sandbox yet** - Follow Phase 2 |
| Backend shows `Could not normalize phone` | Use format: **0712345678** not "0.712.345.678" |
| Backend shows `Payment not completed` | Try simulated payment again, might be timing issue |
| No backend logs appear at all | Frontend API call not reaching backend - check browser console |
| Backend shows success but no WhatsApp | Twilio credentials may be invalid - check backend/.env |

## How to Share Logs for Debugging

Copy everything between these lines:
```
[PaymentController.sendTicketToWhatsApp] Called with paymentId: XXX
⬇️ COPY EVERYTHING FROM HERE
⬆️ TO HERE - The response line (either success or error)
```

## Troubleshooting Checklist

- [ ] Backend running (shows "Socket.IO initialized")
- [ ] Frontend running (shows local URL)
- [ ] Phone number 0712345678 in Twilio sandbox (joined in last 72 hours)
- [ ] Payment amount entered (e.g., 50)
- [ ] Payment status changed to "completed" (wait ~2 seconds after clicking Process)
- [ ] Clicked [Yes Send Now] button on WhatsApp prompt
- [ ] Backend logs show `[PaymentController.sendTicketToWhatsApp]` line
- [ ] Either:
  - ✅ WhatsApp message received on phone, OR
  - ❌ Error code visible in logs (63007, "not normalized", etc.)

## Next Steps

1. **Perform the test** using Phase 1-3 above
2. **Note the result:**
   - ✅ Message received? → Feature complete!
   - ❌ Error code shown? → Share logs, we'll fix it
   - ❓ No logs appearing? → Share browser console output

3. **When sharing logs, include:**
   - Backend log lines starting with `[PaymentController.sendTicketToWhatsApp]`
   - Any error messages or codes shown
   - Phone number format you used (0712345678 or other)
   - Whether you successfully joined Twilio sandbox
