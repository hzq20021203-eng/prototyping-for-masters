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
  const q = searchParams.get("q");
  const limit = searchParams.get("limit") || "6";

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      q.trim()
    )}&limit=${encodeURIComponent(limit)}&appid=${encodeURIComponent(apiKey.trim())}`;

    const res = await fetch(geoUrl);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errJson.message || `Geocoding lookup failed (HTTP ${res.status})`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Network error occurred while fetching location coordinates.",
        details: err instanceof Error ? err.message : "Internal error",
      },
      { status: 500 }
    );
  }
}
