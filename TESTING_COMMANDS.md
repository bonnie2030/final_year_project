# Commands for Quick Testing

## Option 1: Run Backend (Watch Logs)
```powershell
cd "c:\Users\Peter Muriithi\projects\final_year_project\backend"; node server.js
```

## Option 2: Run Frontend (in new terminal)
```powershell
cd "c:\Users\Peter Muriithi\projects\final_year_project\frontend"; npm run dev
```

## Option 3: Run Backend & Log to File (optional)
```powershell
cd "c:\Users\Peter Muriithi\projects\final_year_project\backend"; node server.js 2>&1 | Tee-Object -FilePath logs.txt
# Then in another terminal:
Get-Content logs.txt -Tail -Wait
```

## Quick Filter for Important Logs
In backend terminal, after running payment:
```powershell
# Search for WhatsApp-related logs
Get-Content -Path (Get-ChildItem *.log -Latest).FullName | Select-String "WhatsApp|PaymentController"
```

## Phone Test Number Options
- **My actual test number:** +254 712 345 678
- **Format 1:** 0712345678
- **Format 2:** 254712345678
- **Format 3:** +254712345678

Use Format 1 or 2 in the app, it will auto-convert to Format 3 for Twilio.
