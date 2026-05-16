# BINLADIIN II VTU - Backend API

Complete Node.js/Express backend for VTU (Virtual Top-Up) application with data and airtime purchase functionality.

## Features

✅ User Authentication (JWT)
✅ MongoDB Integration
✅ Wallet System
✅ Buy Data API
✅ Airtime Purchase API
✅ Transaction Logs
✅ Secure Password Hashing
✅ CORS Enabled
✅ Production Ready

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs (Password hashing)
- Axios (HTTP requests)

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/usamaauwalu2017-ship-it/Binladiin-VTU.git
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
VTU_API_KEY=your_vtu_api_key
VTU_API_URL=your_vtu_api_url
```

### 4. Run Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/fund` - Fund wallet
- `GET /api/wallet/transactions` - Get transactions

### Data
- `POST /api/data/buy` - Buy data bundle
- `GET /api/data/plans` - Get available data plans

### Airtime
- `POST /api/airtime/buy` - Buy airtime

## Request Examples

### Register
```json
POST /api/auth/register
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Buy Data
```json
POST /api/data/buy
Headers: Authorization: Bearer <token>
{
  "network": "MTN",
  "phone": "08012345678",
  "amount": 500,
  "plan": "500MB"
}
```

### Buy Airtime
```json
POST /api/airtime/buy
Headers: Authorization: Bearer <token>
{
  "network": "MTN",
  "phone": "08012345678",
  "amount": 1000
}
```

## Database Schema

### User Model
- fullname (String)
- email (String, unique)
- phone (String, unique)
- password (String, hashed)
- wallet (Number, default: 0)
- role (String, enum: ['user', 'admin'])
- isVerified (Boolean)
- timestamps

### Transaction Model
- userId (ObjectId, ref: User)
- type (String: data, airtime, wallet_fund)
- network (String)
- phone (String)
- amount (Number)
- status (String: pending, successful, failed)
- reference (String)
- timestamps

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Create account on [Render](https://render.com)
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variables
6. Deploy

### Deploy to Railway

1. Push code to GitHub
2. Create account on [Railway](https://railway.app)
3. Connect GitHub
4. Deploy

## Testing

Use Postman or Thunder Client to test endpoints.

## Security

- Passwords hashed with bcryptjs
- JWT token authentication
- CORS enabled
- Environment variables for sensitive data

## Support

For issues, create a GitHub issue or contact support.

## License

ISC
