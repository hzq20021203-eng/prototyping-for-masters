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
  const date = searchParams.get("date");
  const unit = searchParams.get("unit") || "metric";

  if (!lat || !lon || !date) {
    return NextResponse.json(
      { error: "Missing required parameters: lat, lon, and date are required." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch historical Day Summary via One Call 3.0 API
    const daySummaryUrl = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&date=${encodeURIComponent(date)}&units=${encodeURIComponent(
      unit
    )}&appid=${encodeURIComponent(apiKey.trim())}`;

    const res = await fetch(daySummaryUrl);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const status = res.status;

      if (status === 401 || status === 403) {
        return NextResponse.json(
          {
            error: `One Call 3.0 Subscription Required (HTTP ${status})`,
            details:
              errJson.message ||
              "Your API key does not have an active 'One Call by Call' subscription on OpenWeatherMap. Please activate the free tier (1,000 calls/day) in your OpenWeather dashboard.",
          },
          { status }
        );
      } else if (status === 429) {
        return NextResponse.json(
          {
            error: "OpenWeatherMap daily rate limit exceeded. Please wait a moment.",
          },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          {
            error: errJson.message || `OpenWeatherMap historical query failed (HTTP ${status})`,
          },
          { status }
        );
      }
    }

    const summaryData = await res.json();

    // 2. Fetch midday snapshot for condition description & icon code (Optional snapshot)
    let conditionMain = "Clear";
    let conditionDesc = "Clear sunny skies";
    let iconCode = "01d";

    try {
      const middayTimestamp = Math.floor(new Date(`${date}T12:00:00Z`).getTime() / 1000);
      const timemachineUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&dt=${middayTimestamp}&units=${encodeURIComponent(
        unit
      )}&appid=${encodeURIComponent(apiKey.trim())}`;

      const tmRes = await fetch(timemachineUrl);
      if (tmRes.ok) {
        const tmData = await tmRes.json();
        if (tmData.data && tmData.data.length > 0 && tmData.data[0].weather && tmData.data[0].weather.length > 0) {
          const w = tmData.data[0].weather[0];
          conditionMain = w.main || conditionMain;
          conditionDesc = w.description || conditionDesc;
          iconCode = w.icon || iconCode;
        }
      }
    } catch {
      // Fallback heuristics based on summary metrics
      if (summaryData.precipitation?.total > 2) {
        conditionMain = "Rain";
        conditionDesc = "Precipitation recorded";
        iconCode = "10d";
      } else if (summaryData.cloud_cover?.afternoon > 60) {
        conditionMain = "Clouds";
        conditionDesc = "Overcast skies";
        iconCode = "04d";
      }
    }

    return NextResponse.json({
      summary: summaryData,
      condition: {
        main: conditionMain,
        description: conditionDesc.charAt(0).toUpperCase() + conditionDesc.slice(1),
        icon: iconCode,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Server network error while retrieving historical weather.",
        details: err instanceof Error ? err.message : "Internal error",
      },
      { status: 500 }
    );
  }
}
