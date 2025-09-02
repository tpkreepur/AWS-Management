import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { handleAPIError, createAPISuccessResponse } from "@/lib/api-error-handler";
import { awsConfig } from "@/services/aws-config.service";

export async function GET() {
  try {
    // Use the centralized AWS config service
    const ec2Client = awsConfig.getEC2Client();
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

    const ec2Data = {
      total,
      running,
      stopped,
      windows,
      linux,
      pending,
      stopping,
      terminated,
    };

    return createAPISuccessResponse(ec2Data, 'aws');
  } catch (error) {
    // Return mock data if AWS API fails
    const mockData = {
      total: 5,
      running: 3,
      stopped: 2,
      windows: 2,
      linux: 3,
      pending: 0,
      stopping: 0,
      terminated: 0,
    };

    return handleAPIError(error, mockData, 'EC2 endpoint');
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
