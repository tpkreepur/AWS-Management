import { NextResponse } from "next/server";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { fromIni } from "@aws-sdk/credential-provider-ini";

interface ClientConfig {
  region: string;
  credentials?: ReturnType<typeof fromIni>;
}

export async function GET() {
  try {
    const region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
    const profile = process.env.AWS_PROFILE;

    const clientConfig: ClientConfig = { region };

    // Use AWS profile if specified
    if (profile) {
      clientConfig.credentials = fromIni({ profile });
    }

    const ec2Client = new EC2Client(clientConfig);
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);

    let total = 0;
    let running = 0;
    let stopped = 0;
    let pending = 0;
    let stopping = 0;
    let terminated = 0;
    let windows = 0;
    let linux = 0;

    response.Reservations?.forEach((reservation) => {
      reservation.Instances?.forEach((instance) => {
        if (!instance.InstanceId) return;

        const state = instance.State?.Name || "unknown";
        const platform = determinePlatform(
          instance.Platform,
          instance.PlatformDetails
        );

        total++;

        // Count by state
        switch (state) {
          case "running":
            running++;
            break;
          case "stopped":
            stopped++;
            break;
          case "pending":
            pending++;
            break;
          case "stopping":
            stopping++;
            break;
          case "terminated":
            terminated++;
            break;
        }

        // Count by platform
        if (platform === "windows") {
          windows++;
        } else if (platform === "linux") {
          linux++;
        }
      });
    });

    return NextResponse.json({
      total,
      running,
      stopped,
      windows,
      linux,
      pending,
      stopping,
      terminated,
    });
  } catch (error) {
    console.error("Error fetching EC2 stats:", error);

    // Return mock data if AWS API fails
    return NextResponse.json({
      total: 5,
      running: 3,
      stopped: 2,
      windows: 2,
      linux: 3,
      pending: 0,
      stopping: 0,
      terminated: 0,
      error: "AWS API unavailable - using mock data",
    });
  }
}

function determinePlatform(
  platform?: string,
  platformDetails?: string
): string {
  if (
    platform === "windows" ||
    platformDetails?.toLowerCase().includes("windows")
  ) {
    return "windows";
  }
  if (platformDetails?.toLowerCase().includes("linux") || !platform) {
    return "linux";
  }
  return "unknown";
}
