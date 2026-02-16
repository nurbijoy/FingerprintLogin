# SecuGen Fingerprint Authentication System

Complete fingerprint authentication system with SecuGen scanner, Django backend, and React frontend.

## ✅ Status: FULLY WORKING

All critical issues resolved:
- ✅ Fingerprint capture working perfectly
- ✅ Template creation fixed (ViewNumber corrected)
- ✅ Quality thresholds optimized
- ✅ Brightness auto-configured
- ✅ LED feedback enabled
- ✅ User verification working

## 🚀 Quick Start

### Prerequisites
- Windows 10/11
- SecuGen fingerprint scanner (USB)
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production) or SQLite (for testing)

### One-Click Startup

1. **Double-click** `start-fingerprint-system.bat`
2. Wait for all services to start (10-15 seconds)
3. Browser opens automatically at http://localhost:5173
4. Connect your SecuGen scanner
5. Start capturing fingerprints!

### Manual Setup (First Time Only)

**1. Install Python Dependencies**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

**2. Install Node Dependencies**
```bash
cd frontend
npm install
```

**3. Start All Services**
```bash
start-fingerprint-system.bat
```

## 📖 Documentation

- **[FINGERPRINT_CAPTURE_GUIDE.md](FINGERPRINT_CAPTURE_GUIDE.md)** - Complete guide for capturing fingerprints, troubleshooting, and best practices

## 🎯 Features

- **User Registration** - Register users with fingerprint templates
- **Fingerprint Capture** - Capture high-quality fingerprint images
- **Template Storage** - Store encrypted fingerprint templates
- **Verification** - 1:N verification against all stored templates
- **User Management** - View and manage registered users
- **Quality Feedback** - Real-time quality scores and tips

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ :5173
│   (Vite + React)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Django Backend  │ :8000
│  (REST API)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ SecuGen Bridge  │ :8080
│ (Python + Flask)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ SecuGen Scanner │ (USB)
│  (FDx SDK Pro)  │
└─────────────────┘
```

## 🔧 Configuration

### Backend (Django)
- **Database**: `backend/db.sqlite3` (default) or PostgreSQL
- **Port**: 8000
- **API**: http://localhost:8000/api/

### Frontend (React)
- **Port**: 5173
- **Dev Server**: Vite
- **API Endpoint**: http://localhost:8000

### SecuGen Bridge
- **Port**: 8080
- **SDK Path**: `secugen/FDx SDK Pro for Windows v4.3.1_J1.12/`
- **DLL**: Auto-detects x64 or win32

## 📝 API Endpoints

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `GET /api/users/{id}/` - Get user details
- `DELETE /api/users/{id}/` - Delete user

### Fingerprints
- `POST /api/fingerprints/capture/` - Capture and store fingerprint
- `POST /api/fingerprints/verify/` - Verify fingerprint
- `GET /api/fingerprints/user/{user_id}/` - Get user's fingerprints

### SecuGen Bridge
- `POST /api/device/info` - Get device information
- `POST /api/device/capture` - Capture fingerprint
- `POST /api/device/match` - Match two templates

## 🐛 Troubleshooting

### Device Not Found
1. Check USB connection
2. Verify device in Windows Device Manager
3. Reinstall SecuGen drivers
4. Try different USB port
5. Run bridge service as Administrator

### Low Quality Captures
1. Clean scanner with soft cloth
2. Ensure finger is clean and dry
3. Press firmly and keep still
4. Center finger on scanner
5. Wait for LED to light up

### Template Creation Failed
1. Recapture with better placement
2. Check quality score (aim for 50+)
3. Adjust brightness if needed
4. Try a different finger

See **[FINGERPRINT_CAPTURE_GUIDE.md](FINGERPRINT_CAPTURE_GUIDE.md)** for detailed troubleshooting.

## 🔐 Security Notes

- Templates are stored as binary data in database
- SG400 format is encrypted by default
- No raw fingerprint images stored (only templates)
- Templates cannot be reverse-engineered to images
- Use HTTPS in production
- Implement proper authentication/authorization

## 📦 Project Structure

```
finger/
├── backend/                 # Django REST API
│   ├── fingerprints/       # Fingerprint app
│   ├── users/              # User management
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json
├── secugen-bridge/         # Python bridge service
│   └── secugen_bridge_native.py
├── secugen/                # SecuGen SDK files
│   └── FDx SDK Pro for Windows v4.3.1_J1.12/
├── start-fingerprint-system.bat  # Startup script
├── FINGERPRINT_CAPTURE_GUIDE.md  # Complete guide
└── README.md
```

## 🚀 Deployment

### Production Checklist
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set `DEBUG = False` in Django settings
- [ ] Configure ALLOWED_HOSTS
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Set up proper CORS policies
- [ ] Configure static file serving
- [ ] Set up process manager (systemd/supervisor)
- [ ] Configure firewall rules
- [ ] Set up backup for database
- [ ] Monitor service health

## 📄 License

This project uses SecuGen FDx SDK Pro which requires a license from SecuGen Corporation.

## 🤝 Support

For issues or questions:
1. Check [FINGERPRINT_CAPTURE_GUIDE.md](FINGERPRINT_CAPTURE_GUIDE.md)
2. Review error messages in service windows
3. Test with SecuGen sample applications
4. Contact SecuGen support for SDK issues

## 🎉 Success!

Your fingerprint system is now ready to use. The critical fixes applied ensure reliable fingerprint capture and verification. Enjoy!
