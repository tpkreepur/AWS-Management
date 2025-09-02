import { NextResponse } from "next/server";
import { AWSConfigService } from "@/services";

export async function GET() {
  try {
    const config = await AWSConfigService.getInstance();

    return NextResponse.json({
      isConnected: true,
      profile: process.env.AWS_PROFILE,
      region: config.region || process.env.AWS_REGION || "us-east-1",
    });
  } catch (error) {
    console.error("AWS Status Check Error:", error);

    return NextResponse.json(
      {
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    ); // Return 200 to avoid fetch errors in client
  }
}
