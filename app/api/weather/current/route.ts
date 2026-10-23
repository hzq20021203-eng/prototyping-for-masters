import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openweathermap_api_key_here") {
    return NextResponse.json(
      {
        error: "OpenWeatherMap API key is missing.",
        details: "Please add your OPENWEATHER_API_KEY to your .env.local file in the project root.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const unit = searchParams.get("unit") || "metric";

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing required parameters: lat and lon are required." },
      { status: 400 }
    );
  }

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&units=${encodeURIComponent(
      unit
    )}&appid=${encodeURIComponent(apiKey.trim())}`;

    const res = await fetch(currentUrl);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const status = res.status;

      return NextResponse.json(
        {
          error: errJson.message || `OpenWeatherMap current weather query failed (HTTP ${status})`,
        },
        { status }
      );
    }

    const data = await res.json();

    const conditionMain = data.weather?.[0]?.main || "Clear";
    const rawDesc = data.weather?.[0]?.description || "Clear sky";
    const conditionDesc = rawDesc.charAt(0).toUpperCase() + rawDesc.slice(1);
    const iconCode = data.weather?.[0]?.icon || "01d";

    return NextResponse.json({
      city: data.name,
      country: data.sys?.country,
      temp: data.main?.temp,
      temp_min: data.main?.temp_min,
      temp_max: data.main?.temp_max,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      pressure: data.main?.pressure,
      wind_speed: data.wind?.speed,
      wind_deg: data.wind?.deg,
      cloud_cover: data.clouds?.all ?? 0,
      precipitation: (data.rain?.["1h"] || 0) + (data.snow?.["1h"] || 0),
      rain_1h: data.rain?.["1h"] || 0,
      snow_1h: data.snow?.["1h"] || 0,
      condition: {
        main: conditionMain,
        description: conditionDesc,
        icon: iconCode,
      },
      dt: data.dt,
      timezone: data.timezone,
      sys: data.sys,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Server network error while retrieving current weather.",
        details: err instanceof Error ? err.message : "Internal error",
      },
      { status: 500 }
    );
  }
}
