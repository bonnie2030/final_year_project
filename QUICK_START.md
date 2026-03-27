# 🚀 Quick Start - Mobile Access

## Access from Mobile (3 Steps)

### 1️⃣ Find Your IP
Run on your development machine:
```bash
hostname -I | awk '{print $1}'
```
Example output: `192.168.43.6`

### 2️⃣ Connect Mobile to Same Network
- Same WiFi as your dev machine
- Or connect to your mobile hotspot

### 3️⃣ Open in Mobile Browser
```
https://[YOUR_IP]:8080
```
Example: `https://192.168.43.6:8080`

**Accept SSL warning** (first time only) → Done! ✅

---

## Works On ANY Network! 🌐

- ✅ Home WiFi → No config needed
- ✅ Mobile hotspot → No config needed  
- ✅ Office WiFi → No config needed
- ✅ Friend's WiFi → No config needed
- ✅ Coffee shop → No config needed

**Switch networks = Zero configuration! Just use the new IP.**

---

## Troubleshooting

### Can't connect?
```bash
# 1. Check services running
netstat -tuln | grep -E "5000|8080"

# 2. Check firewall
sudo ufw allow 8080/tcp

# 3. Restart backend
cd backend && npm run dev
```

### Still getting CORS errors?
```bash
# Run the test script
./test-cors.sh

# Check configuration
grep CORS_ORIGIN backend/.env
# Should show: CORS_ORIGIN=auto
```

---

## That's It! 🎉

**Current Access URLs:**
- Mobile: `https://192.168.43.6:8080`
- Browser: `https://localhost:8080`

For full docs, see: **CORS_FINAL_SOLUTION.md**
