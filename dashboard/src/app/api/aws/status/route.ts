import { NextResponse } from "next/server";

export async function GET() {
  const profile = process.env.AWS_PROFILE;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

  const isRealAWS = !!(
    profile ||
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    region
  );

  return NextResponse.json({
    mode: isRealAWS ? "Real AWS" : "Mock",
    profile,
    region,
    hasCredentials: isRealAWS,
  });
}
