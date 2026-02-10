# Fingerprint Authentication System

Web app for fingerprint capture, storage, and verification using SecuGen Hamster Pro 20.

## Tech Stack

- **Backend**: Django + REST Framework
- **Frontend**: React + Tailwind CSS  
- **Database**: PostgreSQL (finger_db)

## Quick Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000

## Database Configuration

Update `backend/fingerprint_api/settings.py` with your PostgreSQL credentials:
```python
DATABASES = {
    'default': {
        'NAME': 'finger_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
    }
}
```

## API Endpoints

### Users
- `POST /api/users/` - Create user (emp_id, name)
- `GET /api/users/` - List users
- `DELETE /api/users/{id}/` - Delete user

### Fingerprints
- `POST /api/fingerprints/capture/` - Store fingerprint
- `POST /api/fingerprints/verify/` - Verify fingerprint
- `GET /api/fingerprints/user/{user_id}/` - Get user fingerprints

## SecuGen SDK Integration

### Backend
1. Place SDK files in `backend/secugen/`
2. Update `backend/fingerprints/services.py` with actual SDK calls

### Frontend
1. Place WebAPI files in `frontend/public/secugen/`
2. Update `frontend/src/services/secugen.js` with actual WebAPI calls

Currently uses mock data for development.

## Features

- User registration with fingerprint capture
- Fingerprint verification (1:N matching)
- User management dashboard
- Modern responsive UI
- Real-time device status

## Notes

- Update SECRET_KEY before production
- Enable HTTPS in production
- Encrypt fingerprint templates
- Replace mock matching with actual SDK
