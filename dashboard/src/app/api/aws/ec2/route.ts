import { NextRequest, NextResponse } from "next/server";
import { RealAWSDataService } from "@/services/real-aws-data.service";

// This ensures the route handler runs server-side only
export async function GET(request: NextRequest) {
  try {
    const awsService = new RealAWSDataService();
    const ec2Stats = await awsService.getEC2Stats();

    return NextResponse.json(ec2Stats);
  } catch (error) {
    console.error("Error fetching EC2 instances:", error);
    return NextResponse.json(
      { error: "Failed to fetch EC2 instances" },
      { status: 500 }
    );
  }
}
