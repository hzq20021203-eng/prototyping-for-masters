# 📮 Weather Postcard Prototype

An interactive, playful weather postcard generator that queries **real-time live current weather data** from OpenWeatherMap's free Current Weather API and renders a handmade, colorful paper-cut illustration collage.

---

## ✨ Features

- **Global City Geocoding**: Search for any city worldwide with real-time autocompletion.
- **Quick Postcard Stamps**: Quick-jump presets for major world capitals and climates (Tokyo 🌸, Paris 🥐, New York 🗽, London 🫖, Sydney 🏄‍♀️, Reykjavik ❄️, Honolulu 🌺, Cairo ☀️).
- **Full-Composition Paper-Cut Artwork**:
  - **Rain Tapestry**: Overlapping patterned umbrellas (daisy, polka dots, stripes, scalloped), jagged lightning cuts, and teardrop rain.
  - **Giant Radiant Sun**: Hand-cut organic rays, rolling cloud masses, rainbow arches, and wind ribbons.
  - **Thunderstorm**: Moody indigo cloud layers with flashing paper lightning.
  - **Snow & Freeze**: Drifting snowflake asterisks and paper snowdrift waves.
  - **Matisse Overcast**: Colorful cloud cutout tapestry.
- **Archival Meteorological Chips**: Live temperature, feels-like, min/max, wind velocity, humidity, cloud cover %, and pressure.
- **Procedural Web Audio**: Zero-dependency sound effects for clicks, postcard generation, and postal arrival.
- **Secure Server-Side Architecture**: API key stored exclusively in `.env.local` and processed through Next.js server route `/api/weather/current`.

---

## 🔑 Setup

Uses the **100% Free OpenWeatherMap Current Weather API**:
1. Add `OPENWEATHER_API_KEY=your_key_here` to `.env.local`.
2. Start or restart the dev server (`npm run dev`).
3. Open `/prototypes/weather-postcard` and click **Generate Postcard 📮**!
