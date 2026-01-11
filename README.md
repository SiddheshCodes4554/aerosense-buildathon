# 🌬️ AeroSense AI

**AeroSense AI** is a cutting-edge, AI-powered environmental monitoring and health intelligence platform. It leverages live sensor data and Large Language Models (LLMs) to provide users with deep insights into their air quality, carbon footprint, and personal health.

---

## ✨ Key Features

### 🧠 AI Intelligence Layer (Powered by Groq & Llama 3.1)
- **Personal Health Guide**: Bio-dynamic analysis of AQI data tailored to your health profile (Asthma, Elderly, etc.).
- **Decision Advisor**: Real-time activity recommendations—know exactly when to go outside or wear a mask.
- **Atmospheric Analysis**: Deep-learning reasoning that identifies stagnation, inversions, and weather-driven pollution patterns.
- **Chemical Fingerprint**: High-accuracy molecular source inference (Traffic, Industrial Smog, Dust).
- **Eco-Audit**: Instant carbon footprint analysis with AI-generated lifestyle swaps.

### 📊 Environmental Monitoring
- **Global AQI Coverage**: Real-time data fusion from WAQI and OpenWeatherMap.
- **Molecular Breakdown**: Precise tracking of PM2.5, PM10, NO2, O3, SO2, and CO.
- **Smart Forecast**: 24-hour predictive air quality modeling.
- **Visual Mapping**: Interactive maps showing local and global pollution heatmaps.

### 🛡️ Wellness & Sustainability Tools
- **Breathing Coach**: Adaptive breathing exercises designed to mitigate the effects of poor air quality.
- **Solar Efficiency AI**: Real-time solar energy potential analysis based on current atmospheric conditions.
- **Exposure Calculator**: Track your cumulative pollutant intake over time.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **AI Engine**: Groq SDK (Llama 3.1-8b-instant)
- **Backend Services**: Firebase (Authentication & Data)
- **APIs**: World Air Quality Index (WAQI), OpenWeatherMap
- **UI Components**: Lucide React, Recharts, React-Leaflet

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- API Keys for: [Groq](https://console.groq.com), [WAQI](https://aqicn.org/api/), [OpenWeatherMap](https://openweathermap.org/api), and [Firebase](https://firebase.google.com).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SiddheshCodes4554/aerosense-buildathon.git
   cd aerosense-buildathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_key_here
   VITE_WAQI_API_KEY=your_key_here
   VITE_GROQ_API_KEY=your_key_here
   VITE_FIREBASE_API_KEY=your_key_here
   ...and other firebase config
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📐 Project Structure

```text
src/
├── components/         # AI & UI Components
│   ├── tools/          # Specialized analysis tools
│   ├── cv/             # Computer Vision features
│   └── solar/          # Solar intelligence
├── services/           # API & External service layers (Groq, Firebase)
├── store/              # State management (Zustand)
├── hooks/              # Custom React hooks (Air Quality logic)
└── utils/              # Calculation & pollutant helpers
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the **AeroSense Buildathon**.
