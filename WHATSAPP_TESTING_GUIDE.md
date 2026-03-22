# WhatsApp Ticket Sending - Comprehensive Testing Guide

## Current Status
- ✅ Frontend: Payment completion flow with WhatsApp choice prompt
- ✅ Backend: API endpoint for sending tickets via WhatsApp
- ✅ Logging: Comprehensive logs added at every step
- ❌ Issue: Messages not actually being sent through Twilio

## Important: Twilio WhatsApp Sandbox Requirement

**THIS IS LIKELY THE ISSUE:** Twilio's WhatsApp service operates in a **sandbox mode** for testing. Users must be added to the sandbox before they can receive messages.

### Step 1: Get Your Twilio WhatsApp Sandbox Details

1. Open browser and go to: https://www.twilio.com/console/sms/whatsapp/learn
2. Sign in with your Twilio account (the one with credentials in backend/.env)
3. You should see a message like: **"Send join {WORD} to +1 415 523 8886"**
4. The {WORD} is specific to your account (e.g., "join break-additional")

### Step 2: Join the Sandbox

**Using WhatsApp on your phone:**

1. Open WhatsApp on the phone number you want to test with
2. Start a chat with the Twilio WhatsApp number: **+1 415 523 8886**
3. Send the exact message shown in your Twilio console (e.g., **"join break-additional"**)
4. Wait for confirmation message from Twilio
5. You should receive: "You have joined the WhatsApp Sandbox for MatatuConnect"

**IMPORTANT:** After joining, you have **72 hours** to test. After that, you need to rejoin.

### Step 3: Run a Test Payment Flow

1. **Start the frontend dev server:**
   ```powershell
   cd frontend
   npm run dev
   ```

2. **Verify backend is running** (you should see logs showing database connection)

3. **In the app:**
   - Navigate to the Driver Dashboard (if testing)
   - Complete a payment flow (click "Pay Ticket")
   - Enter phone number in format: **0712345678** or **254712345678**
   - Simulate payment completion
   - When asked "Send ticket to WhatsApp?", click **"Yes Send Now"**

4. **Check backend logs immediately** - Look for lines starting with:
   - `[DigitalTicket]` - Frontend calling the API
   - `[PaymentController.sendTicketToWhatsApp]` - Backend receiving request
   - `✓ WhatsApp message sent via Twilio:` - Successful send
   - `✗ WhatsApp sending failed:` - Error details

### Step 4: Read Backend Logs

The backend should output one of these scenarios:

**SCENARIO A: Success** (WhatsApp message sends)
```
[PaymentController.sendTicketToWhatsApp] Called with paymentId: 123
[PaymentController] Found payment: { id: 123, status: completed, phone: 0712345678 }
[PaymentController] Sending WhatsApp to normalized phone: 254712345678
✓ WhatsApp message sent via Twilio: { phone: whatsapp:+254712345678, sid: SMxxxxxxxx }
[PaymentController] WhatsApp ticket sent successfully to: 254712345678
```

**SCENARIO B: User Not in Sandbox** (Most likely)
```
[PaymentController.sendTicketToWhatsApp] Called with paymentId: 123
[PaymentController] Found payment: { id: 123, status: completed, phone: 0712345678 }
[PaymentController] Sending WhatsApp to normalized phone: 254712345678
✗ WhatsApp sending failed: { 
  error: "The destination phone number is not a valid WhatsApp user",
  code: 63007
}
⚠️ User not in WhatsApp sandbox. They need to join first.
```
→ **Solution:** Follow Step 2 above to join sandbox

**SCENARIO C: Invalid Phone Format**
```
[PaymentController] Could not normalize phone number: invalid_number
```
→ **Solution:** Use format 0712345678 in the payment form

**SCENARIO D: Payment Not Completed**
```
[PaymentController] Payment not completed, status: pending
```
→ **Solution:** Complete payment properly before requesting WhatsApp send

**SCENARIO E: Twilio Credentials Error**
```
Twilio WhatsApp credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN...
```
→ **Solution:** Check backend/.env has correct credentials

## How to Monitor Logs in Real-Time

**Option 1: Watch backend startup (already running)**
```powershell
cd "c:\Users\Peter Muriithi\projects\final_year_project\backend"
node server.js
```

**Option 2: Clear terminal and follow logs**
```powershell
Clear-Host
# Terminal shows new logs as they happen
```

**Option 3: Search for specific patterns**
- `[PaymentController]` - All payment controller actions
- `✓` - Successful operations
- `✗` - Failures
- `⚠️` - Warnings (like sandbox requirement)

## Frontend Issue Checking

In browser DevTools Console (F12):

Look for logs like:
```javascript
[DigitalTicket] handleSendToWhatsApp called with paymentId: 123
[DigitalTicket] API response received
```

## Troubleshooting Decision Tree

```
Flow started?
├─ YES: See backend logs
│   └─ Logs show "WhatsApp message sent"?
│       ├─ YES: Check Your WhatsApp - message should arrive in 5-10 seconds
│       └─ NO: Error code?
│           ├─ 63007: Need to join sandbox (Step 2 above)
│           ├─ "Not configured": Check .env credentials
│           └─ Other: Report the exact error code from logs
└─ NO: Check browser console for [DigitalTicket] logs
```

## Complete Test Checklist

- [ ] Backend running and shows "Socket.IO initialized"
- [ ] Phone number in Twilio sandbox (joined in last 72 hours)
- [ ] Payment amount entered correctly
- [ ] Payment marked as "completed" in database
- [ ] "Yes Send Now" button clicked on WhatsApp prompt
- [ ] Backend logs show `[PaymentController.sendTicketToWhatsApp]` called
- [ ] No error codes (or error code clearly identified)
- [ ] Check WhatsApp for message within 10 seconds

## What to Share When Debugging

If it's not working, please share:

1. **Backend logs** - Copy entire output from `[PaymentController.sendTicketToWhatsApp]` until the response
2. **Phone number tested** - In format (0712345678 or 254712345678)
3. **Confirmation** - Did you join the Twilio sandbox and receive the confirmation message?
4. **When** - Timestamp or message type that failed

## Next Steps

After testing:
- ✅ If WhatsApp sends: Test complete! Feature is working.
- ❌ If WhatsApp doesn't send: Share the backend logs from Step 4 above, and we'll identify the exact issue and fix it.
