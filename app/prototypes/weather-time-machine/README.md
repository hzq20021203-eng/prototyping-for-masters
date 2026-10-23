# 🕰️ Weather Time Machine Prototype

An interactive, playful weather time machine that lets you travel to any date in the past (from **1979 to present**) across any global city and reconstructs that day's atmosphere with live historical weather data from OpenWeatherMap.

---

## ✨ Features

- **Global City Geocoding**: Search for any city worldwide with real-time autocompletion.
- **Historical Temporal Dial**: Pick any date from January 2, 1979 up to yesterday.
- **Curated Historic Epochs**: Quick-jump presets to iconic moments in weather history (e.g. *Fall of Berlin Wall 1989*, *Millennium Eve 1999*, *Great Blizzard of '96*, *Solar Eclipse 1999*, *Tokyo Cherry Blossom Spring 1993*, *Record Heatwave 2022*).
- **The Atmospheric Chronosphere (Animated Diorama)**:
  - **Dynamic Sky Palette**: Sky colors adapt smoothly to real temperatures and conditions (frosty lavender blues, golden sunlight, rainy slate, molten heatwave amber, or electric tempest).
  - **Kinetic Elements**: Rotating sun rays, floating procedural clouds, responsive wind turbines spinning at real wind speed, animated rain streaks, and snowflake flurries.
- **Archival Meteorological Telegram**: Detailed metrics for daytime temperature, min/max range, morning/afternoon/evening/night breakdown, humidity, pressure, wind velocity, and cloud cover.
- **Time Traveler's Field Notes**: Playful commentary with attire suggestions and atmospheric vibe analysis.
- **Procedural Web Audio**: Retro synthesizer sound effects synthesized directly in the browser with the Web Audio API.

---

## 🔑 OpenWeatherMap API Setup & Subscription Requirements

This prototype uses real historical weather data from **OpenWeatherMap One Call API 3.0**.

### 1. Endpoints Used
- **Geocoding API**: `https://api.openweathermap.org/geo/1.0/direct` (Free)
- **One Call 3.0 Day Summary**: `https://api.openweathermap.org/data/3.0/onecall/day_summary` (Aggregated historical records)
- **One Call 3.0 Timemachine**: `https://api.openweathermap.org/data/3.0/onecall/timemachine` (Hourly condition snapshots)

### 2. How to get your API Key (1,000 Free Calls / Day)
1. Sign up or log in at [openweathermap.org](https://home.openweathermap.org/users/sign_up).
2. Copy your API Key from your account dashboard.
3. In the OpenWeather dashboard, subscribe to the **"One Call by Call"** plan.
   - **Cost**: The first **1,000 calls per day are 100% free**.
   - **Safety Cap**: You can configure a daily call limit (e.g. 500 calls/day) in your account settings to guarantee you never incur overage fees.
4. Click **Set API Key** in the prototype header or paste it into the setup modal.
5. Alternatively, create a `.env.local` file in the root of the project:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

---

## 🛠️ Tech Stack & Conventions

- **Next.js 15 (App Router)** & **React 19**
- **TypeScript** with strict type definitions
- **CSS Modules** with scoped class names
- **Web Audio API** for zero-dependency sound synthesis
- Tested and compliant with all project guidelines in `AGENTS.md`.
