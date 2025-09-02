import { NextResponse } from "next/server";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
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

    const stsClient = new STSClient(clientConfig);
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);

    return NextResponse.json({
      accountId: response.Account || "Unknown",
      region,
      accountType: "Production", // You might want to determine this based on account ID or tags
      organizationUnit: "Core Infrastructure", // Could be fetched from Organizations API
      billingContact: "billing@company.com", // Could be fetched from account settings
      status: "Active",
      userId: response.UserId,
      arn: response.Arn,
      assumedRoleUser: response.Arn?.includes("assumed-role") ? "Yes" : "No",
    });
  } catch (error) {
    console.error("Error fetching account info:", error);

    // Return mock data if AWS API fails
    return NextResponse.json({
      accountId: "123456789012",
      region:
        process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
      accountType: "Development (Mock)",
      organizationUnit: "Mock Infrastructure",
      billingContact: "mock@company.com",
      status: "Active",
      error: "AWS API unavailable - using mock data",
    });
  }
}
