import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const isConfigured = Boolean(
    apiKey &&
    apiKey.trim() !== "" &&
    apiKey !== "your_openweathermap_api_key_here"
  );

  return NextResponse.json({
    configured: isConfigured,
  });
}
