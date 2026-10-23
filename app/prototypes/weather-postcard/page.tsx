"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { instrumentSans } from "../../fonts";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface CityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface CurrentWeatherData {
  date: string;
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  temp: {
    current: number;
    feels_like: number;
    min: number;
    max: number;
  };
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg?: number;
  clouds: number;
  precipitation: number;
  conditionMain: string;
  conditionDesc: string;
  iconCode: string;
}

interface CityPreset {
  id: string;
  label: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  icon: string;
  tagColor: string;
}

const CITY_PRESETS: CityPreset[] = [
  {
    id: "tokyo",
    label: "Tokyo",
    city: "Tokyo",
    country: "JP",
    lat: 35.6762,
    lon: 139.6503,
    icon: "🌸",
    tagColor: "#36C383",
  },
  {
    id: "paris",
    label: "Paris",
    city: "Paris",
    country: "FR",
    lat: 48.8566,
    lon: 2.3522,
    icon: "🥐",
    tagColor: "#FF6B97",
  },
  {
    id: "new-york",
    label: "New York",
    city: "New York",
    country: "US",
    lat: 40.7128,
    lon: -74.006,
    icon: "🗽",
    tagColor: "#88C9F9",
  },
  {
    id: "london",
    label: "London",
    city: "London",
    country: "GB",
    lat: 51.5074,
    lon: -0.1278,
    icon: "🫖",
    tagColor: "#FFDE38",
  },
  {
    id: "sydney",
    label: "Sydney",
    city: "Sydney",
    country: "AU",
    lat: -33.8688,
    lon: 151.2093,
    icon: "🏄‍♀️",
    tagColor: "#FF8024",
  },
  {
    id: "reykjavik",
    label: "Reykjavik",
    city: "Reykjavik",
    country: "IS",
    lat: 64.1466,
    lon: -21.9426,
    icon: "❄️",
    tagColor: "#88C9F9",
  },
  {
    id: "honolulu",
    label: "Honolulu",
    city: "Honolulu",
    country: "US",
    lat: 21.3069,
    lon: -157.8583,
    icon: "🌺",
    tagColor: "#FF6B97",
  },
  {
    id: "cairo",
    label: "Cairo",
    city: "Cairo",
    country: "EG",
    lat: 30.0444,
    lon: 31.2357,
    icon: "☀️",
    tagColor: "#FFDE38",
  },
];

// ============================================================================
// Procedural Web Audio Synthesizer (Resilient Zero-Dependency Audio)
// ============================================================================

class PostcardAudio {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private init() {
    try {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // audio error fallback
    }
  }

  tick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(850, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.035);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
      // audio fallback
    }
  }

  generate() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.22);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.45);

      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    } catch {
      // audio fallback
    }
  }

  delivery() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = t + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    } catch {
      // audio fallback
    }
  }
}

const audio = new PostcardAudio();

// ============================================================================
// Handmade Irregular Paper-Cut SVG Components (Pure Graphic Art)
// ============================================================================

// 1. Irregular Handmade Cut-Paper Sun
function HandmadeSun({ size = 320, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" className={className} style={{ overflow: "visible" }}>
      <g className={styles.sunRaysOrganic}>
        <rect x="138" y="6" width="24" height="52" rx="2" fill="#FFDE38" />
        <rect x="136" y="242" width="28" height="50" rx="2" fill="#FFDE38" />
        <rect x="6" y="136" width="54" height="26" rx="2" fill="#FFDE38" />
        <rect x="240" y="138" width="52" height="24" rx="2" fill="#FFDE38" />

        <rect x="48" y="48" width="24" height="48" rx="2" fill="#FFDE38" transform="rotate(-48 60 72)" />
        <rect x="224" y="44" width="26" height="46" rx="2" fill="#FFDE38" transform="rotate(42 237 67)" />
        <rect x="44" y="208" width="26" height="48" rx="2" fill="#FFDE38" transform="rotate(46 57 232)" />
        <rect x="226" y="206" width="24" height="46" rx="2" fill="#FFDE38" transform="rotate(-44 238 229)" />

        <rect x="88" y="16" width="20" height="42" rx="2" fill="#FFDE38" transform="rotate(-22 98 37)" />
        <rect x="192" y="18" width="22" height="40" rx="2" fill="#FFDE38" transform="rotate(24 203 38)" />
        <rect x="86" y="244" width="22" height="42" rx="2" fill="#FFDE38" transform="rotate(22 97 265)" />
        <rect x="194" y="242" width="20" height="42" rx="2" fill="#FFDE38" transform="rotate(-24 204 263)" />
      </g>
      <path
        d="M150,55 C198,52 242,88 245,142 C248,196 208,245 152,248 C96,251 52,208 48,154 C44,98 94,57 150,55 Z"
        fill="#FFDE38"
      />
      <path
        d="M150,68 C190,66 226,96 228,140 C230,184 198,225 152,228 C106,230 70,195 67,151 C64,104 105,70 150,68 Z"
        fill="#FFE600"
      />
    </svg>
  );
}

// 2. Irregular Organic Cut-Paper Cloud
function HandmadeCloud({
  color = "#FFFFFF",
  width = 280,
  height = 150,
  className,
}: {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 280 150" className={className} fill="none">
      <path
        d="M52 135 C28 135 12 118 12 94 C12 72 28 55 50 51 C60 24 88 8 122 8 C158 8 186 26 198 56 C210 48 228 46 242 52 C270 60 284 84 284 110 C284 128 272 135 254 135 L52 135 Z"
        fill={color}
      />
    </svg>
  );
}

// 3. Irregular Organic Cut-Paper Rainbow
function HandmadeRainbow({ size = 300, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 260 160" className={className} fill="none">
      <path d="M26 150 A104 104 0 0 1 234 150" stroke="#FF6A13" strokeWidth="24" strokeLinecap="butt" />
      <path d="M50 150 A80 80 0 0 1 210 150" stroke="#FFDE38" strokeWidth="24" strokeLinecap="butt" />
      <path d="M74 150 A56 56 0 0 1 186 150" stroke="#FF6B97" strokeWidth="24" strokeLinecap="butt" />
      <path d="M98 150 A32 32 0 0 1 162 150" stroke="#36C383" strokeWidth="24" strokeLinecap="butt" />
    </svg>
  );
}

// 4. Patterned Cut-Paper Umbrellas

// Umbrella 1: Pink Floral with White Daisies
function PinkDaisyUmbrella({ size = 180, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 90 L90 160 C90 176 70 182 58 168" stroke="#1E3A8A" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M14 102 C30 8 150 8 166 102 C148 92 128 104 112 96 C98 104 76 92 62 98 C44 92 30 104 14 102 Z"
        fill="#FF6B97"
      />
      <g fill="#FFFFFF">
        <circle cx="56" cy="58" r="5" />
        <circle cx="56" cy="48" r="4" />
        <circle cx="56" cy="68" r="4" />
        <circle cx="46" cy="58" r="4" />
        <circle cx="66" cy="58" r="4" />
        <circle cx="56" cy="58" r="2.2" fill="#1E293B" />

        <circle cx="90" cy="44" r="5" />
        <circle cx="90" cy="34" r="4" />
        <circle cx="90" cy="54" r="4" />
        <circle cx="80" cy="44" r="4" />
        <circle cx="100" cy="44" r="4" />
        <circle cx="90" cy="44" r="2.2" fill="#1E293B" />

        <circle cx="124" cy="62" r="5" />
        <circle cx="124" cy="52" r="4" />
        <circle cx="124" cy="72" r="4" />
        <circle cx="114" cy="62" r="4" />
        <circle cx="134" cy="62" r="4" />
        <circle cx="124" cy="62" r="2.2" fill="#1E293B" />
      </g>
    </svg>
  );
}

// Umbrella 2: Mint Green with White Polka Dots
function GreenPolkaUmbrella({ size = 170, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 90 L90 164 C90 180 108 184 118 170" stroke="#FF6B97" strokeWidth="13" strokeLinecap="round" />
      <path d="M87 8 L93 8 L90 0 Z" fill="#FF6B97" />
      <path
        d="M16 102 C30 12 150 12 164 102 C148 94 130 104 114 96 C98 104 80 94 64 100 C46 94 32 104 16 102 Z"
        fill="#36C383"
      />
      <g fill="#FFFFFF">
        <circle cx="52" cy="60" r="6" />
        <circle cx="78" cy="40" r="6.5" />
        <circle cx="108" cy="42" r="6.5" />
        <circle cx="134" cy="64" r="6" />
        <circle cx="66" cy="78" r="6" />
        <circle cx="94" cy="72" r="6.5" />
        <circle cx="120" cy="78" r="6" />
      </g>
    </svg>
  );
}

// Umbrella 3: Yellow with Diagonal Black Stripes
function YellowStripeUmbrella({ size = 165, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 90 L90 162 C90 178 72 182 60 168" stroke="#36C383" strokeWidth="13" strokeLinecap="round" />
      <g>
        <path
          d="M16 102 C32 14 148 14 164 102 C148 94 130 104 114 96 C98 104 80 94 64 100 C46 94 32 104 16 102 Z"
          fill="#FFDE38"
        />
        <path
          d="M34 52 L108 112 M58 34 L132 94 M82 20 L156 80 M108 16 L168 60"
          stroke="#0F172A"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

// Umbrella 4: Sage Green with Horizontal Stripes
function SageStripeUmbrella({ size = 160, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 90 L90 160 C90 176 108 180 116 166" stroke="#FFA756" strokeWidth="13" strokeLinecap="round" />
      <g>
        <path d="M16 94 C20 40 160 40 164 94 L16 94 Z" fill="#8DA399" />
        <line x1="20" y1="56" x2="160" y2="56" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        <line x1="16" y1="72" x2="164" y2="72" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        <line x1="16" y1="88" x2="164" y2="88" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Umbrella 5: Orange with Yellow Horizontal Stripes
function OrangeStripeUmbrella({ size = 160, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 85 L90 165" stroke="#1E3A8A" strokeWidth="14" strokeLinecap="round" />
      <path d="M87 8 L93 8 L90 0 Z" fill="#1E3A8A" />
      <g>
        <path
          d="M18 100 C32 16 148 16 162 100 C146 94 130 102 114 96 C98 102 82 96 66 100 C50 96 34 102 18 100 Z"
          fill="#FF6A13"
        />
        <line x1="28" y1="58" x2="152" y2="58" stroke="#FFDE38" strokeWidth="7" strokeLinecap="round" />
        <line x1="20" y1="76" x2="160" y2="76" stroke="#FFDE38" strokeWidth="7" strokeLinecap="round" />
        <line x1="18" y1="92" x2="162" y2="92" stroke="#FFDE38" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Umbrella 6: Periwinkle Scalloped with Radiating Ribs
function BlueScallopUmbrella({ size = 165, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" className={className} fill="none">
      <path d="M90 90 L90 164 C90 180 108 184 118 170" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" />
      <path d="M90 152 L90 164 C90 180 108 184 118 170" stroke="#FFDE38" strokeWidth="13" strokeLinecap="round" />
      <path d="M86 10 L94 10 L90 0 Z" fill="#FFDE38" />
      <path
        d="M16 108 Q90 12 164 108 C154 94 144 112 130 100 C114 112 104 94 90 104 C76 94 66 112 52 100 C38 112 26 94 16 108 Z"
        fill="#88C9F9"
      />
      <path d="M90 14 L52 100 M90 14 L90 104 M90 14 L130 100 M90 14 L16 108 M90 14 L164 108" stroke="#FFDE38" strokeWidth="4.5" />
    </svg>
  );
}

// 5. Jagged Cut-Paper Lightning Bolt
function HandmadeLightning({ size = 90, color = "#FFDE38", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 60 96" className={className} fill="none">
      <path d="M36 2 L6 52 L28 52 L16 94 L54 40 L34 40 L44 2 Z" fill={color} />
    </svg>
  );
}

// ============================================================================
// Main Application Component
// ============================================================================

export default function WeatherPostcard() {
  const [isServerKeyConfigured, setIsServerKeyConfigured] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Search
  const [cityInput, setCityInput] = useState<string>("Tokyo");
  const [selectedCity, setSelectedCity] = useState<CityResult>({
    name: "Tokyo",
    country: "JP",
    lat: 35.6762,
    lon: 139.6503,
  });
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Weather Query State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Check server-side API Key configuration status on mount
  const checkServerKeyStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/status");
      if (res.ok) {
        const data = await res.json();
        setIsServerKeyConfigured(Boolean(data.configured));
      }
    } catch {
      // status check fallback
    }
  }, []);

  useEffect(() => {
    checkServerKeyStatus();
  }, [checkServerKeyStatus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.muted = nextMuted;
  };

  // Secure Server-Side Geocoding Autocomplete Search
  const searchCity = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearchingCity(true);
    try {
      const res = await fetch(`/api/weather/geo?q=${encodeURIComponent(query.trim())}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted: CityResult[] = data.map((item: { name: string; country: string; state?: string; lat: number; lon: number }) => ({
            name: item.name,
            country: item.country,
            state: item.state,
            lat: item.lat,
            lon: item.lon,
          }));
          setSearchResults(formatted);
          setShowSearchResults(true);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSearchingCity(false);
    }
  }, []);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCityInput(val);
    if (val.length >= 2) {
      searchCity(val);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectCity = (city: CityResult) => {
    setSelectedCity(city);
    setCityInput(`${city.name}, ${city.country}`);
    setShowSearchResults(false);
    audio.tick();
    // Automatically trigger postcard generation when city is picked from dropdown
    triggerFetchCurrentWeather(city.lat, city.lon, city.name, city.country);
  };

  const handleSelectPreset = (preset: CityPreset) => {
    audio.tick();
    const newCity: CityResult = {
      name: preset.city,
      country: preset.country,
      lat: preset.lat,
      lon: preset.lon,
    };
    setSelectedCity(newCity);
    setCityInput(`${preset.city}, ${preset.country}`);
    setShowSearchResults(false);
    triggerFetchCurrentWeather(preset.lat, preset.lon, preset.city, preset.country);
  };

  // Secure Server-Side Fetch for Real Current Weather Data (Free OpenWeatherMap 2.5 API)
  const triggerFetchCurrentWeather = async (
    targetLat?: number,
    targetLon?: number,
    targetCityName?: string,
    targetCountry?: string
  ) => {
    setErrorMessage(null);
    setErrorDetails(null);
    setIsLoading(true);
    setIsGenerating(true);

    try {
      audio.generate();
    } catch {
      // Audio fallback
    }

    try {
      let lat = targetLat ?? selectedCity.lat;
      let lon = targetLon ?? selectedCity.lon;
      let cityName = targetCityName ?? selectedCity.name;
      let country = targetCountry ?? selectedCity.country;

      // If lat/lon wasn't provided directly, verify whether cityInput requires on-the-fly geocoding
      if (targetLat === undefined || targetLon === undefined) {
        const rawInput = cityInput.trim();
        const inputFirstWord = rawInput.split(",")[0].trim().toLowerCase();
        const selectedFirstWord = selectedCity.name.toLowerCase();

        if (inputFirstWord.length >= 2 && inputFirstWord !== selectedFirstWord) {
          try {
            const geoRes = await fetch(`/api/weather/geo?q=${encodeURIComponent(rawInput)}&limit=1`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (Array.isArray(geoData) && geoData.length > 0) {
                lat = geoData[0].lat;
                lon = geoData[0].lon;
                cityName = geoData[0].name;
                country = geoData[0].country;
                setSelectedCity({
                  name: cityName,
                  country,
                  state: geoData[0].state,
                  lat,
                  lon,
                });
              }
            }
          } catch {
            // Geocoding fallback
          }
        }
      }

      if (!lat || !lon) {
        throw new Error("Please enter a valid city destination to generate a postcard.");
      }

      const currentUrl = `/api/weather/current?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
        lon
      )}&unit=${encodeURIComponent(unit)}`;

      const res = await fetch(currentUrl);
      const resJson = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 500 && resJson.error?.includes("missing")) {
          setIsServerKeyConfigured(false);
          throw new Error("OPENWEATHER_API_KEY is missing in your .env.local file. Please add it to start.");
        }
        throw new Error(resJson.error || `Failed to fetch current weather (HTTP ${res.status})`);
      }

      setIsServerKeyConfigured(true);

      const todayFormatted = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const parsedData: CurrentWeatherData = {
        date: todayFormatted,
        cityName: resJson.city || cityName,
        country: resJson.country || country,
        lat,
        lon,
        temp: {
          current: Math.round(resJson.temp ?? 20),
          feels_like: Math.round(resJson.feels_like ?? resJson.temp ?? 20),
          min: Math.round(resJson.temp_min ?? resJson.temp ?? 18),
          max: Math.round(resJson.temp_max ?? resJson.temp ?? 22),
        },
        humidity: resJson.humidity ?? 50,
        pressure: resJson.pressure ?? 1013,
        windSpeed: resJson.wind_speed ?? 3.5,
        windDeg: resJson.wind_deg ?? 180,
        clouds: resJson.cloud_cover ?? 10,
        precipitation: resJson.precipitation ?? 0,
        conditionMain: resJson.condition?.main || "Clear",
        conditionDesc: resJson.condition?.description || "Clear skies",
        iconCode: resJson.condition?.icon || "01d",
      };

      setTimeout(() => {
        setWeatherData(parsedData);
        setIsLoading(false);
        setIsGenerating(false);
        try {
          audio.delivery();
        } catch {
          // Audio fallback
        }
      }, 350);
    } catch (err: unknown) {
      setIsLoading(false);
      setIsGenerating(false);
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setErrorMessage(msg);
      if (msg.includes(".env.local")) {
        setErrorDetails("Open your .env.local file in the project root and ensure OPENWEATHER_API_KEY is set.");
      }
    }
  };

  const formatTemp = (tempVal?: number) => {
    if (tempVal === undefined || tempVal === null) return "--";
    const rounded = Math.round(tempVal);
    return `${rounded}°${unit === "metric" ? "C" : "F"}`;
  };

  const convertSpeed = (speed: number) => {
    if (unit === "metric") {
      return `${speed.toFixed(1)} m/s`;
    }
    return `${(speed * 2.237).toFixed(1)} mph`;
  };

  // Weather Condition Classification for Dedicated Full-Composition Poster Art
  const isRainy =
    weatherData &&
    (weatherData.conditionMain.toLowerCase().includes("rain") ||
      weatherData.conditionMain.toLowerCase().includes("drizzle") ||
      (weatherData.precipitation ?? 0) > 0.5);
  const isStormy =
    weatherData && weatherData.conditionMain.toLowerCase().includes("thunder");
  const isSnowy =
    weatherData &&
    (weatherData.conditionMain.toLowerCase().includes("snow") ||
      (unit === "metric" ? weatherData.temp.current <= 0 : weatherData.temp.current <= 32));
  const isCloudy =
    weatherData &&
    !isRainy &&
    !isStormy &&
    !isSnowy &&
    (weatherData.conditionMain.toLowerCase().includes("cloud") ||
      weatherData.conditionMain.toLowerCase().includes("mist") ||
      weatherData.conditionMain.toLowerCase().includes("fog") ||
      weatherData.clouds >= 50);
  const isHeatwave =
    weatherData &&
    !isRainy &&
    !isStormy &&
    ((unit === "metric"
      ? weatherData.temp.current >= 30
      : weatherData.temp.current >= 86));
  const isSunny =
    !weatherData ? false : !isRainy && !isStormy && !isSnowy && !isCloudy;

  return (
    <div className={`${styles.posterCanvas} ${instrumentSans.className}`}>
      {/* Tactile SVG Paper Grain Filter */}
      <svg className={styles.grainFilterSvg} aria-hidden="true">
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>

      {/* TOP EDITORIAL MASTHEAD */}
      <header className={styles.posterMasthead}>
        <div className={styles.mastheadLeft}>
          <Link href="/" className={styles.backLink}>
            ← Workspace
          </Link>
          <div className={styles.titleWrapper}>
            <span className={styles.starGraphic}>✦</span>
            <h1 className={styles.mainTitle}>Weather Postcard</h1>
            <span className={styles.editionPill}>Paper Collage No. 1</span>
          </div>
        </div>

        <div className={styles.mastheadRight}>
          <div className={styles.unitToggleGroup}>
            <button
              type="button"
              className={`${styles.unitToggleBtn} ${unit === "metric" ? styles.unitToggleBtnActive : ""}`}
              onClick={() => {
                setUnit("metric");
                audio.tick();
              }}
            >
              °C
            </button>
            <button
              type="button"
              className={`${styles.unitToggleBtn} ${unit === "imperial" ? styles.unitToggleBtnActive : ""}`}
              onClick={() => {
                setUnit("imperial");
                audio.tick();
              }}
            >
              °F
            </button>
          </div>

          <button
            type="button"
            className={styles.soundToggleBtn}
            onClick={toggleMute}
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          <button
            type="button"
            className={`${styles.keyStatusBtn} ${isServerKeyConfigured ? styles.keyStatusActive : styles.keyStatusMissing}`}
            onClick={() => {
              setShowKeyModal(true);
              audio.tick();
            }}
          >
            <span>{isServerKeyConfigured ? "● .env.local Active" : "▲ Setup .env.local"}</span>
          </button>
        </div>
      </header>

      {/* GRAPHIC CONTROLS STRIP */}
      <section className={styles.graphicControls}>
        <div className={styles.controlsRow}>
          {/* City Autocomplete */}
          <div className={styles.controlFieldBox} ref={searchContainerRef}>
            <span className={styles.fieldLabel}>01 / City Destination</span>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.paperTextInput}
                placeholder="Search global city (e.g. Tokyo, Paris, New York, London)..."
                value={cityInput}
                onChange={handleCityInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setShowSearchResults(false);
                    triggerFetchCurrentWeather();
                  }
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchResults(true);
                }}
                autoComplete="off"
              />
              {isSearchingCity && <span className={styles.inputSpinner}>Searching...</span>}
            </div>

            {/* City Autocomplete Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={styles.cityDropdownMenu}>
                {searchResults.map((city, idx) => (
                  <button
                    key={`${city.lat}-${city.lon}-${idx}`}
                    type="button"
                    className={styles.cityDropdownRow}
                    onClick={() => handleSelectCity(city)}
                  >
                    <span className={styles.cityName}>
                      {city.name}{city.state ? `, ${city.state}` : ""}
                    </span>
                    <span className={styles.countryBadge}>{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Postcard Action Button */}
          <button
            type="button"
            className={`${styles.travelActionBtn} ${isGenerating ? styles.travelActionWarping : ""}`}
            onClick={() => triggerFetchCurrentWeather()}
            disabled={isLoading}
          >
            {isLoading ? "Printing Postcard..." : "Generate Postcard 📮"}
          </button>
        </div>

        {/* Global City Postcard Presets */}
        <div className={styles.stampsRow}>
          <span className={styles.stampsHeader}>Quick Postcards:</span>
          <div className={styles.stampsList}>
            {CITY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`${styles.stampBtn} ${
                  selectedCity.name === preset.city && !cityInput.includes(",")
                    ? styles.stampBtnActive
                    : selectedCity.name === preset.city
                    ? styles.stampBtnActive
                    : ""
                }`}
                style={{ "--stamp-accent": preset.tagColor } as React.CSSProperties}
                onClick={() => handleSelectPreset(preset)}
                title={`Generate postcard for ${preset.city}, ${preset.country}`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className={styles.errorBanner}>
          <span className={styles.errorSign}>⚠️</span>
          <div className={styles.errorBody}>
            <strong>Access Notice:</strong> {errorMessage}
            {errorDetails && <span className={styles.errorSubDetails}>{errorDetails}</span>}
          </div>
          {!isServerKeyConfigured && (
            <button
              type="button"
              className={styles.errorActionBtn}
              onClick={() => setShowKeyModal(true)}
            >
              Setup .env.local →
            </button>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* THE FULL-COMPOSITION PAPER-CUT WEATHER POSTCARD ARTWORK */}
      {/* ================================================================= */}
      <section
        className={`${styles.fullPosterArtwork} ${
          isGenerating ? styles.artworkWarpShake : ""
        }`}
      >
        {/* POSTER CANVAS FRAME */}
        <div className={styles.posterArtStage}>
          {/* ============================================================= */}
          {/* 1. RAIN / DRIZZLE POSTER (Tapestry with Umbrellas) */}
          {/* ============================================================= */}
          {isRainy && (
            <div className={styles.sceneRainTapestry}>
              {/* Overlapping Patterned Umbrellas */}
              <div className={`${styles.rainUmbrella} ${styles.posPinkTop}`}>
                <PinkDaisyUmbrella size={210} />
              </div>
              <div className={`${styles.rainUmbrella} ${styles.posGreenTopRight}`}>
                <GreenPolkaUmbrella size={190} />
              </div>
              <div className={`${styles.rainUmbrella} ${styles.posYellowMid}`}>
                <YellowStripeUmbrella size={180} />
              </div>
              <div className={`${styles.rainUmbrella} ${styles.posSageBottomLeft}`}>
                <SageStripeUmbrella size={175} />
              </div>
              <div className={`${styles.rainUmbrella} ${styles.posBlueBottomRight}`}>
                <BlueScallopUmbrella size={185} />
              </div>
              <div className={`${styles.rainUmbrella} ${styles.posOrangeBottomCenter}`}>
                <OrangeStripeUmbrella size={170} />
              </div>

              {/* Jagged Lightning Cuts */}
              <div className={`${styles.rainLightning} ${styles.lightningPos1}`}>
                <HandmadeLightning size={80} color="#8DA399" />
              </div>
              <div className={`${styles.rainLightning} ${styles.lightningPos2}`}>
                <HandmadeLightning size={90} color="#FFDE38" />
              </div>
              <div className={`${styles.rainLightning} ${styles.lightningPos3}`}>
                <HandmadeLightning size={75} color="#FFE600" />
              </div>

              {/* Dense Cascading Teardrop Rain */}
              <div className={styles.rainTapestryDrops}>
                {[...Array(36)].map((_, i) => {
                  const colors = ["#88C9F9", "#FFFFFF", "#1E3A8A", "#60A5FA", "#D6EBFF", "#8DA399"];
                  const dropColor = colors[i % colors.length];
                  return (
                    <div
                      key={i}
                      className={styles.tapestryRainDrop}
                      style={{
                        left: `${(i * 2.8) % 96 + 2}%`,
                        top: `${(i * 14) % 85}%`,
                        animationDelay: `${(i * 0.1) % 1.6}s`,
                        animationDuration: `${0.7 + (i % 4) * 0.12}s`,
                      }}
                    >
                      <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
                        <path d="M12 2 C12 2 2 19 2 26 A10 10 0 0 0 22 26 C22 19 12 2 12 2 Z" fill={dropColor} />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 2. SUNNY / CLEAR POSTER (Giant Radiant Sun Composition) */}
          {/* ============================================================= */}
          {(isSunny || isHeatwave) && (
            <div className={styles.sceneSunnyPoster}>
              {/* Massive Handmade Sun */}
              <div className={styles.giantHeroSun}>
                <HandmadeSun size={isHeatwave ? 420 : 360} />
              </div>

              {/* Organic Cloud Masses */}
              <div className={`${styles.sunnyCloud} ${styles.sunnyCloudWhite}`}>
                <HandmadeCloud color="#FFFFFF" width={320} height={160} />
              </div>
              <div className={`${styles.sunnyCloud} ${styles.sunnyCloudNavy}`}>
                <HandmadeCloud color="#1E3A8A" width={280} height={140} />
              </div>

              {/* Chunky Rainbow Arch */}
              {!isHeatwave && (
                <div className={styles.sunnyRainbow}>
                  <HandmadeRainbow size={340} />
                </div>
              )}

              {/* Wavy Wind Paper Ribbons */}
              <div className={styles.sunnyWindStreamers}>
                <svg width="100%" height="100" viewBox="0 0 700 100" fill="none">
                  <path d="M10 30 C140 5 240 55 380 30 C520 5 600 45 690 25" stroke="#36C383" strokeWidth="7" strokeLinecap="round" />
                  <path d="M40 60 C170 35 270 85 410 60 C550 35 630 75 700 55" stroke="#88C9F9" strokeWidth="7" strokeLinecap="round" />
                  <path d="M0 90 C120 65 220 115 360 90 C500 65 580 105 670 85" stroke="#36C383" strokeWidth="7" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 3. STORMY / THUNDERSTORM POSTER */}
          {/* ============================================================= */}
          {isStormy && (
            <div className={styles.sceneStormyPoster}>
              <div className={`${styles.stormCloud} ${styles.stormCloudNavy1}`}>
                <HandmadeCloud color="#1E3A8A" width={360} height={180} />
              </div>
              <div className={`${styles.stormCloud} ${styles.stormCloudNavy2}`}>
                <HandmadeCloud color="#0F172A" width={320} height={160} />
              </div>
              <div className={`${styles.stormCloud} ${styles.stormCloudWhite}`}>
                <HandmadeCloud color="#FFFFFF" width={280} height={140} />
              </div>

              <div className={`${styles.stormBolt} ${styles.stormBolt1}`}>
                <HandmadeLightning size={120} color="#FFDE38" />
              </div>
              <div className={`${styles.stormBolt} ${styles.stormBolt2}`}>
                <HandmadeLightning size={95} color="#FFE600" />
              </div>
              <div className={`${styles.stormBolt} ${styles.stormBolt3}`}>
                <HandmadeLightning size={80} color="#8DA399" />
              </div>

              <div className={`${styles.stormUmbrella} ${styles.stormUmbrellaPink}`}>
                <PinkDaisyUmbrella size={190} />
              </div>
              <div className={`${styles.stormUmbrella} ${styles.stormUmbrellaYellow}`}>
                <YellowStripeUmbrella size={170} />
              </div>

              <div className={styles.stormRainContainer}>
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.stormRainDrop}
                    style={{
                      left: `${(i * 3.5) % 94 + 3}%`,
                      animationDelay: `${(i * 0.12) % 1.4}s`,
                      animationDuration: `${0.6 + (i % 3) * 0.1}s`,
                    }}
                  >
                    <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
                      <path d="M11 2 C11 2 2 18 2 24 A9 9 0 0 0 20 24 C20 18 11 2 11 2 Z" fill="#88C9F9" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 4. SNOWY / FREEZING POSTER */}
          {/* ============================================================= */}
          {isSnowy && (
            <div className={styles.sceneSnowyPoster}>
              <div className={`${styles.snowCloud} ${styles.snowCloudWhite}`}>
                <HandmadeCloud color="#FFFFFF" width={340} height={170} />
              </div>
              <div className={`${styles.snowCloud} ${styles.snowCloudBlue}`}>
                <HandmadeCloud color="#88C9F9" width={300} height={150} />
              </div>
              <div className={`${styles.snowCloud} ${styles.snowCloudNavy}`}>
                <HandmadeCloud color="#1E3A8A" width={260} height={130} />
              </div>

              <div className={styles.snowAsteriskField}>
                {[...Array(32)].map((_, i) => {
                  const scales = [34, 26, 20, 16];
                  const currentSize = scales[i % scales.length];
                  return (
                    <div
                      key={i}
                      className={styles.snowAsteriskItem}
                      style={{
                        left: `${(i * 3.1) % 94 + 3}%`,
                        top: `${(i * 12) % 85}%`,
                        animationDelay: `${(i * 0.18) % 3}s`,
                        animationDuration: `${2.2 + (i % 3) * 0.5}s`,
                      }}
                    >
                      <svg width={currentSize} height={currentSize} viewBox="0 0 28 28" fill="none">
                        <path
                          d="M14 2 L14 26 M2 14 L26 14 M5.5 5.5 L22.5 22.5 M22.5 5.5 L5.5 22.5"
                          stroke="#FFFFFF"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>

              <div className={styles.snowdriftWave}>
                <svg width="100%" height="90" viewBox="0 0 800 90" fill="none" preserveAspectRatio="none">
                  <path d="M0 45 C150 15 320 65 480 35 C640 10 720 50 800 35 L800 90 L0 90 Z" fill="#88C9F9" />
                  <path d="M0 60 C180 35 340 75 520 45 C660 25 740 65 800 50 L800 90 L0 90 Z" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 5. CLOUDY / OVERCAST POSTER (Matisse Cutout Tapestry) */}
          {/* ============================================================= */}
          {isCloudy && (
            <div className={styles.sceneCloudyPoster}>
              <div className={styles.cloudyPeekingSun}>
                <HandmadeSun size={280} />
              </div>

              <div className={`${styles.cloudyCloud} ${styles.cloudyLayer1}`}>
                <HandmadeCloud color="#FFFFFF" width={360} height={180} />
              </div>
              <div className={`${styles.cloudyCloud} ${styles.cloudyLayer2}`}>
                <HandmadeCloud color="#1E3A8A" width={320} height={160} />
              </div>
              <div className={`${styles.cloudyCloud} ${styles.cloudyLayer3}`}>
                <HandmadeCloud color="#88C9F9" width={300} height={150} />
              </div>
              <div className={`${styles.cloudyCloud} ${styles.cloudyLayer4}`}>
                <HandmadeCloud color="#FF6B97" width={260} height={130} />
              </div>
              <div className={`${styles.cloudyCloud} ${styles.cloudyLayer5}`}>
                <HandmadeCloud color="#FFDE38" width={220} height={110} />
              </div>

              <div className={styles.cloudyWindRibbons}>
                <svg width="100%" height="80" viewBox="0 0 600 80" fill="none">
                  <path d="M10 25 C140 5 260 45 400 25 C520 5 600 35 680 20" stroke="#36C383" strokeWidth="6" strokeLinecap="round" />
                  <path d="M40 55 C160 30 280 75 420 50 C540 30 620 60 700 45" stroke="#88C9F9" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 6. STANDBY INTRO POSTER */}
          {/* ============================================================= */}
          {!weatherData && (
            <div className={styles.sceneStandbyShowcase}>
              <div className={styles.standbySun}>
                <HandmadeSun size={290} />
              </div>
              <div className={styles.standbyRainbow}>
                <HandmadeRainbow size={310} />
              </div>
              <div className={`${styles.standbyCloud} ${styles.standbyCloudWhite}`}>
                <HandmadeCloud color="#FFFFFF" width={290} height={150} />
              </div>
              <div className={`${styles.standbyCloud} ${styles.standbyCloudNavy}`}>
                <HandmadeCloud color="#1E3A8A" width={260} height={130} />
              </div>
              <div className={`${styles.standbyUmbrella} ${styles.standbyUmbrellaPink}`}>
                <PinkDaisyUmbrella size={190} />
              </div>
              <div className={`${styles.standbyUmbrella} ${styles.standbyUmbrellaGreen}`}>
                <GreenPolkaUmbrella size={170} />
              </div>
              <div className={styles.standbyDrops}>
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.standbyDropItem}
                    style={{
                      left: `${(i * 6.2) % 94 + 3}%`,
                      top: `${(i * 16) % 80}%`,
                    }}
                  >
                    <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
                      <path d="M11 2 C11 2 2 18 2 24 A9 9 0 0 0 20 24 C20 18 11 2 11 2 Z" fill="#88C9F9" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* INTEGRATED EDITORIAL TYPOGRAPHY & HERO DATA CALLOUT */}
          {/* ============================================================= */}
          <div className={styles.posterEditorialOverlay}>
            <div className={styles.editorialMetaRow}>
              <span className={styles.editorialCityPill}>
                {weatherData ? `${weatherData.cityName}, ${weatherData.country}` : `${selectedCity.name}, ${selectedCity.country}`}
              </span>
              <span className={styles.editorialDatePill}>
                {weatherData
                  ? weatherData.date
                  : new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
              </span>
            </div>

            <div className={styles.editorialHeroReadout}>
              <span className={styles.heroTempDegrees}>
                {isLoading ? "..." : weatherData ? formatTemp(weatherData.temp.current) : "--"}
              </span>
              <span className={styles.heroConditionPhrase}>
                {isLoading
                  ? "Printing Postcard..."
                  : weatherData
                  ? weatherData.conditionDesc
                  : "Awaiting Generation"}
              </span>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* METEOROLOGICAL POSTCARD DATA STRIP */}
        {/* =============================================================== */}
        {weatherData ? (
          <div className={styles.posterArchivalBand}>
            <div className={styles.metricsFlatGrid}>
              <div className={`${styles.metricFlatChip} ${styles.chipColorYellow}`}>
                <span className={styles.chipMetaLabel}>Min / Max</span>
                <span className={styles.chipStatNumber}>
                  {formatTemp(weatherData.temp.min)} / {formatTemp(weatherData.temp.max)}
                </span>
              </div>

              <div className={`${styles.metricFlatChip} ${styles.chipColorMint}`}>
                <span className={styles.chipMetaLabel}>Feels Like</span>
                <span className={styles.chipStatNumber}>{formatTemp(weatherData.temp.feels_like)}</span>
              </div>

              <div className={`${styles.metricFlatChip} ${styles.chipColorBlue}`}>
                <span className={styles.chipMetaLabel}>Wind Velocity</span>
                <span className={styles.chipStatNumber}>{convertSpeed(weatherData.windSpeed)}</span>
              </div>

              <div className={`${styles.metricFlatChip} ${styles.chipColorPink}`}>
                <span className={styles.chipMetaLabel}>Humidity</span>
                <span className={styles.chipStatNumber}>{weatherData.humidity}%</span>
              </div>

              <div className={`${styles.metricFlatChip} ${styles.chipColorOrange}`}>
                <span className={styles.chipMetaLabel}>Cloud Cover</span>
                <span className={styles.chipStatNumber}>{weatherData.clouds}%</span>
              </div>

              <div className={`${styles.metricFlatChip} ${styles.chipColorWhite}`}>
                <span className={styles.chipMetaLabel}>Pressure</span>
                <span className={styles.chipStatNumber}>{weatherData.pressure} hPa</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.standbyGuideStrip}>
            <span className={styles.guideSpark}>✦</span>
            <p className={styles.guideInstruction}>
              Search any global city or pick a quick postcard stamp and press{" "}
              <strong>Generate Postcard 📮</strong> to fetch live atmospheric data and render a handmade paper-cut collage!
            </p>
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* SECURE API KEY INSTRUCTIONS MODAL */}
      {/* ================================================================= */}
      {showKeyModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowKeyModal(false)}>
          <div className={styles.editorialPaperModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeaderBar}>
              <div className={styles.modalTitleWrap}>
                <span className={styles.modalStar}>✦</span>
                <h3 className={styles.modalHeading}>Secure .env.local Configuration</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={() => setShowKeyModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalInnerBody}>
              <p className={styles.modalBodyText}>
                Following security best practices, your API key is stored <strong>server-side only</strong> in{" "}
                <code>.env.local</code> and is never exposed in browser JavaScript or client network requests.
              </p>

              <div className={styles.guideCard}>
                <h4 className={styles.guideCardTitle}>How to configure your key:</h4>
                <ol className={styles.guideOrderedList}>
                  <li>
                    Open your local file: <code>.env.local</code> (in the project root directory).
                  </li>
                  <li>
                    Paste your OpenWeatherMap key:
                    <pre className={styles.codeSnippetBox}>
                      OPENWEATHER_API_KEY=your_key_here
                    </pre>
                  </li>
                  <li>
                    Uses the <strong>100% free Current Weather API</strong> (no paid tier required).
                  </li>
                  <li>
                    Save <code>.env.local</code> and click <strong>Generate Postcard 📮</strong>!
                  </li>
                </ol>
              </div>

              <div className={styles.securityCheckBadge}>
                🔒 <code>.env.local</code> is excluded from Git via <code>.gitignore</code> and will never be committed.
              </div>
            </div>

            <div className={styles.modalFooterBar}>
              <button
                type="button"
                className={styles.modalSaveAction}
                onClick={() => {
                  checkServerKeyStatus();
                  setShowKeyModal(false);
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
