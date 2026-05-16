# BINLADIIN II VTU - COMPLETE DEPLOYMENT GUIDE

## Table of Contents
1. [Backend Deployment (Render)](#backend-deployment)
2. [Database Setup (MongoDB Atlas)](#database-setup)
3. [VTU API Setup](#vtu-api-setup)
4. [Payment Integration (Paystack)](#paystack-integration)
5. [Flutter App Configuration](#flutter-app)
6. [Google Play Store Deployment](#play-store)

---

## STEP 1: Backend Deployment (Render)

### 1.1 Create Render Account
- Visit: https://render.com
- Sign up with GitHub
- Connect your GitHub account

### 1.2 Deploy Backend
1. Go to Render Dashboard: https://dashboard.render.com
2. Click **New +**
3. Select **Web Service**
4. Connect your GitHub repository: `usamaauwalu2017-ship-it/Binladiin-VTU`
5. Fill in the deployment form:
   - **Name:** `binladiin-vtu-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### 1.3 Add Environment Variables (CRITICAL)
In the Render dashboard, go to **Environment** and add:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/binladiin
JWT_SECRET=your_super_secret_key_here_12345
VTU_API_KEY=your_vtu_api_key
VTU_API_URL=https://vtu-provider-api.com/api
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### 1.4 Deploy
Click **Create Web Service** and wait for deployment (3-5 minutes)

### 1.5 Get Your Backend URL
After deployment, you'll get a URL like:
```
https://binladiin-vtu-backend.onrender.com
```

**SAVE THIS URL - You'll need it for the Flutter app!**

---

## STEP 2: Database Setup (MongoDB Atlas)

### 2.1 Create MongoDB Account
- Visit: https://www.mongodb.com/cloud/atlas
- Sign up with email
- Create free account

### 2.2 Create a Cluster
1. Click **Build a Cluster**
2. Choose **FREE** tier
3. Select your region (closest to you)
4. Click **Create Cluster**

### 2.3 Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (SAVE THESE!)
4. Click **Add User**

### 2.4 Get Connection String
1. Go to **Clusters**
2. Click **Connect**
3. Choose **Connect your application**
4. Copy the connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/binladiin?retryWrites=true&w=majority
```

### 2.5 Add to Render Environment
Replace in the `MONGO_URI` environment variable:
- `username` with your database username
- `password` with your database password

### 2.6 Allow Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

---

## STEP 3: VTU API Setup

### 3.1 Choose VTU Provider
Popular options:
- **VTpass**: https://vtpass.com
- **Clubkonnect**: https://clubkonnect.com
- **Irecharge**: https://irecharge.com

### 3.2 Register on VTpass (Recommended)
1. Go to https://vtpass.com
2. Click **Sign Up**
3. Fill in details and verify email
4. Complete KYC verification
5. Go to **Settings > API**
6. Copy your **API Key** and **API Secret**

### 3.3 Add to Render Environment
```
VTU_API_KEY=your_api_key_from_vtpass
VTU_API_URL=https://api.vtpass.com/api
```

### 3.4 Test API Connection
Once deployed, test with Postman:
```
POST https://binladiin-vtu-backend.onrender.com/api/data/buy
Headers:
- Authorization: your_jwt_token
- Content-Type: application/json

Body:
{
  "network": "mtn",
  "phone": "08012345678",
  "amount": 500,
  "plan": "500MB"
}
```

---

## STEP 4: Paystack Integration

### 4.1 Create Paystack Account
- Visit: https://paystack.com
- Sign up and verify email
- Complete business verification

### 4.2 Get API Keys
1. Go to **Settings > API Keys & Webhooks**
2. Copy your:
   - **Public Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 4.3 Add to Render Environment
```
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

### 4.4 Test Payment
Use test card: `4111 1111 1111 1111`
PIN: `000`
OTP: Any 6 digits

---

## STEP 5: Flutter App Configuration

### 5.1 Create Flutter Project
```bash
flutter create binladiin_vtu_app
cd binladiin_vtu_app
```

### 5.2 Update pubspec.yaml
Add these dependencies:
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.0.15
  provider: ^6.0.0
  paystack_flutter: ^1.0.0
  flutter_dotenv: ^5.1.0
```

### 5.3 Create .env File in Flutter Project
```
BACKEND_URL=https://binladiin-vtu-backend.onrender.com
PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

### 5.4 Update main.dart
```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  await dotenv.load();
  runApp(const MyApp());
}
```

### 5.5 Create API Service
Create `lib/services/api_service.dart`:
```dart
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:convert';

class ApiService {
  static final String baseUrl = dotenv.env['BACKEND_URL'] ?? '';
  
  static Future<Map> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Login failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
  
  static Future<Map> register(String fullname, String email, String phone, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'fullname': fullname,
          'email': email,
          'phone': phone,
          'password': password,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Registration failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
  
  static Future<Map> buyData(String token, String network, String phone, int amount, String plan) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/data/buy'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: jsonEncode({
          'network': network,
          'phone': phone,
          'amount': amount,
          'plan': plan,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Purchase failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
  
  static Future<Map> buyAirtime(String token, String network, String phone, int amount) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/airtime/buy'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: jsonEncode({
          'network': network,
          'phone': phone,
          'amount': amount,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Purchase failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
```

---

## STEP 6: Build APK/AAB for Google Play Store

### 6.1 Generate Signed Key
```bash
keytool -genkey -v -keystore ~/my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 6.2 Create key.properties
Create `android/key.properties`:
```
storePassword=your_password
keyPassword=your_password
keyAlias=my-key-alias
storeFile=/path/to/my-release-key.keystore
```

### 6.3 Build AAB (Recommended for Play Store)
```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

### 6.4 Or Build APK
```bash
flutter build apk --release
```

Output: `build/app/outputs/apk/release/app-release.apk`

---

## STEP 7: Google Play Store Submission

### 7.1 Create Google Play Developer Account
- Visit: https://play.google.com/console
- Pay one-time fee: $25 USD
- Complete account setup

### 7.2 Create App
1. Click **Create app**
2. Fill in:
   - **App name:** BINLADIIN II VTU
   - **Default language:** English
   - **App or game:** App
   - **Category:** Finance
3. Click **Create app**

### 7.3 Fill in App Details
1. **App Access:** Select appropriate access level
2. **Ads:** Specify if you use ads
3. **Content Rating:** Fill questionnaire
4. **Target Audience:** Select age group

### 7.4 Create Release
1. Go to **Release** section
2. Click **Create new release**
3. Upload your `.aab` file
4. Add release notes

### 7.5 Add Store Listing
1. Go to **Store listing**
2. Add:
   - **App title:** BINLADIIN II VTU
   - **Short description** (80 characters)
   - **Full description** (4000 characters)
   - **Screenshots** (min 2, max 8)
   - **Feature graphic** (1024 x 500 px)
   - **App icon** (512 x 512 px)

### 7.6 Privacy Policy
1. Create privacy policy at: https://www.termsfeed.com
2. Host it online (e.g., GitHub Pages, Netlify)
3. Add URL to **Privacy policy** section

### 7.7 Content Rating
1. Fill Google Play Content Rating questionnaire
2. Save rating

### 7.8 Submit for Review
1. Click **Review and rollout**
2. Select **10% rollout** (recommended for first release)
3. Click **Rollout to production**
4. Wait for review (1-7 days)

---

## VERIFICATION CHECKLIST

- [ ] MongoDB cluster created and user added
- [ ] Connection string working
- [ ] Backend deployed on Render
- [ ] Environment variables added to Render
- [ ] Backend URL accessible
- [ ] VTU API account created
- [ ] VTU API keys added
- [ ] Paystack account created
- [ ] Paystack keys added
- [ ] Flutter app created
- [ ] API service configured
- [ ] Backend URL in Flutter .env
- [ ] APK/AAB built
- [ ] Google Play Developer account created
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Screenshots uploaded
- [ ] Privacy policy added
- [ ] Submitted for review

---

## QUICK REFERENCE

**Backend URL:** `https://binladiin-vtu-backend.onrender.com`

**API Endpoints:**
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/data/buy` - Buy data
- POST `/api/airtime/buy` - Buy airtime
- POST `/api/wallet/fund` - Fund wallet

**Test Credentials:**
- Email: test@example.com
- Password: test123

---

## TROUBLESHOOTING

### Backend won't deploy
- Check environment variables are complete
- Ensure MongoDB connection string is correct
- Check Render logs for errors

### API calls failing
- Verify backend URL in Flutter app
- Check JWT token is being sent
- Verify VTU API credentials

### Payment not working
- Check Paystack keys are correct
- Ensure using test mode keys
- Test with test card provided

### App won't build
- Run `flutter pub get`
- Run `flutter clean`
- Run `flutter pub upgrade`
- Check Dart SDK version

---

## SUPPORT

For issues, check:
1. Render logs: https://dashboard.render.com
2. MongoDB Atlas: https://cloud.mongodb.com
3. VTU Provider documentation
4. Paystack documentation: https://paystack.com/developers

---

**Your app is now ready for production! 🚀**
