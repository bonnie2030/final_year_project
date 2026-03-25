const express = require('express');
const PaymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes (for dashboard)
router.get('/', PaymentController.getAllPaymentsPublic);
router.post('/', PaymentController.simulatePayment);
router.post('/initiate', PaymentController.initiatePayment);
router.post('/initiate-payment', PaymentController.initiatePayment);
router.post('/mpesa-callback', PaymentController.mpesaCallback);
router.post('/mpesa/callback', PaymentController.mpesaCallback);
router.post('/:paymentId/send-ticket-whatsapp', PaymentController.sendTicketToWhatsApp);
router.get('/:paymentId', PaymentController.getPaymentStatus);

// FR2: M-Pesa Payment Simulation (simulate STK Push, mock success)
router.post('/simulate', PaymentController.simulatePayment);

// Protected routes below
router.use(authMiddleware);

// Get previous phone numbers for current user
router.get('/previous-phones', PaymentController.getPreviousPhoneNumbers);

// Admin stats
router.get('/stats', PaymentController.getPaymentStats);

module.exports = router;
