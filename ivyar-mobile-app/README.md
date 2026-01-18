# 🇺🇦 IVYAR Mobile App - Земля для Героїв

**React Native mobile application for Ukrainian veterans to apply for and manage land grants.**

---

## 📱 Features

### ✅ 6 Complete Screens:

1. **WelcomeScreen** - Veteran login/registration
2. **ProfileScreen** - Service record & priority score display
3. **ApplyScreen** - Land grant application form
4. **LandParcelsScreen** - Browse available land parcels
5. **MyLandScreen** - View allocated land with blockchain certificate
6. **GrantStatusScreen** - Detailed application tracking

### 🎨 Design:

- **Ukrainian Language** throughout
- **Brutalist/Military aesthetic** (matching mission)
- **Blue & Yellow** color scheme (Ukrainian flag)
- **Accessible UI** - Large text, clear contrast (veteran-friendly)
- **Offline-ready architecture**

### 🔗 API Integration:

- Production API: `https://ivyar-ddr-module.vercel.app`
- Endpoints:
  - `POST /api/land/veteran-grants/apply`
  - `GET /api/land/parcels`
  - `GET /api/land/veteran-grants/:id`

---

## 🚀 Quick Start

### Prerequisites:

```bash
# Install Node.js 18+ and npm
# Install Expo CLI
npm install -g expo-cli
```

### Installation:

```bash
# 1. Navigate to app directory
cd ivyar-mobile-app

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

### Running on Device:

```bash
# iOS (requires macOS + Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Web preview
npm run web

# Or scan QR code with Expo Go app
```

---

## 📂 Project Structure

```
ivyar-mobile-app/
├── App.tsx                    # Main navigation
├── WelcomeScreen.tsx          # Login/registration
├── ProfileScreen.tsx          # Veteran profile
├── ApplyScreen.tsx            # Land grant application
├── LandParcelsScreen.tsx      # Browse parcels
├── MyLandScreen.tsx           # Allocated land view
├── GrantStatusScreen.tsx      # Application tracking
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🎯 Screen Details

### 1. WelcomeScreen.tsx
**Purpose:** Authentication and onboarding
- Phone number login
- Ukrainian greeting ("Вітаємо, Побратиме!")
- Info about blockchain security
- Ukrainian flag accent bar

### 2. ProfileScreen.tsx
**Purpose:** Veteran service record and priority display
- Priority score calculation (0-280+ points)
- Combat days, disability, service years, awards
- Application status
- Navigation to other screens

### 3. ApplyScreen.tsx
**Purpose:** Submit land grant application
- Oblast selection (7 oblasts)
- Area range (hectares)
- Land use type (agricultural, residential, mixed)
- Terms & conditions
- Real-time priority preview

### 4. LandParcelsScreen.tsx
**Purpose:** Browse available land
- Filter by oblast and status
- Real-time data from API
- Parcel details (cadastral number, area, value)
- Mark interest / apply

### 5. MyLandScreen.tsx
**Purpose:** View allocated land
- Celebration banner
- Cadastral number
- Land characteristics (soil quality, location)
- Blockchain certificate with TX hash
- Share certificate functionality

### 6. GrantStatusScreen.tsx
**Purpose:** Track application progress
- Status timeline
- Queue position
- Review notes
- Estimated wait time
- Help/support access

---

## 🔐 Security Features

- **Blockchain Integration** - All land ownership recorded on Polygon
- **Transaction Hashes** - Immutable proof of ownership
- **Anti-Corruption** - Transparent priority algorithm
- **No Human Discretion** - Math-based allocation

---

## 🎨 Design System

### Colors:
```typescript
const colors = {
  primary: '#1A1A1A',      // Dark background
  surface: '#2C2C2C',      // Cards
  accent: '#005BBB',       // Ukrainian Blue
  accentSecondary: '#FFD500', // Ukrainian Yellow
  textPrimary: '#FFFFFF',  // White text
  textSecondary: '#CCCCCC', // Gray text
  textMuted: '#999999',    // Muted text
};
```

### Typography:
- **Titles:** Arial Black, bold, uppercase
- **Body:** Arial, 14-16px
- **Mono:** Courier New (for technical data)

### Spacing:
- Base unit: 4px
- Gaps: 8px, 12px, 16px, 20px, 24px
- Padding: 16px (cards), 20px (containers)

---

## 📊 Priority Algorithm

The app calculates veteran priority based on:

| Category | Points | Details |
|----------|--------|---------|
| **Combat Service** | 0-150 | Any combat: 100 pts<br/>1+ year: +30 pts<br/>2+ years: +20 pts |
| **Disability** | 0-90 | Level 1-5: 50-90 pts |
| **Service Years** | 0-40 | 5 years: 20 pts<br/>10 years: 30 pts<br/>20 years: 40 pts |
| **Awards** | 0-100 | Hero of Ukraine: 50 pts<br/>Order of Courage: 30 pts<br/>Others: 5-25 pts |

**Total: 0-280+ points**

---

## 🌐 API Integration

### Example: Fetch Available Parcels

```typescript
const fetchParcels = async () => {
  const params = new URLSearchParams({
    oblast: 'Chernihiv',
    status: 'AVAILABLE',
  });
  
  const response = await fetch(
    `https://ivyar-ddr-module.vercel.app/api/land/parcels?${params}`
  );
  
  const data = await response.json();
  if (data.success) {
    setParcels(data.data);
  }
};
```

### Example: Submit Application

```typescript
const submitApplication = async (formData) => {
  const response = await fetch(
    'https://ivyar-ddr-module.vercel.app/api/land/veteran-grants/apply',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }
  );
  
  const result = await response.json();
  return result;
};
```

---

## 🚧 TODO / Future Enhancements

- [ ] Biometric authentication (fingerprint/face)
- [ ] Push notifications for status updates
- [ ] Offline mode with local storage
- [ ] Map integration (Google Maps / OpenStreetMap)
- [ ] Photo upload for documentation
- [ ] Chat support with ministry staff
- [ ] Digital signature integration
- [ ] Multi-language support (English, Polish, German)

---

## 📄 License

Proprietary - IVYAR LLC  
Built for Ukrainian Veterans  
**Земля героям, а не олігархам! 🇺🇦**

---

## 📞 Support

**Igor Yarmosyuk**  
Founder & CEO, IVYAR LLC  
Former Military Chaplain, Ukrainian Armed Forces

**Email:** igor@ivyar.org  
**Website:** www.ivyar.org

---

## 🙏 Acknowledgments

Built with support from:
- 🏦 World Bank
- 🇺🇸 USAID
- 🛡️ NATO DIANA
- 🇪🇺 European Commission

**Слава Україні! Героям Слава! 🇺🇦**
