import { NextResponse } from "next/server";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import {
  AccountClient,
  GetAccountInformationCommand,
  GetContactInformationCommand,
} from "@aws-sdk/client-account";

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

    // Initialize clients
    const stsClient = new STSClient(clientConfig);
    const accountClient = new AccountClient(clientConfig);

    // Get caller identity for basic account info
    const callerIdentityCommand = new GetCallerIdentityCommand({});
    const callerIdentityResponse = await stsClient.send(callerIdentityCommand);

    // Get detailed account information (for potential future use)
    const accountInfoCommand = new GetAccountInformationCommand({});
    await accountClient.send(accountInfoCommand); // We don't use the response directly but keep the call for future enhancements

    // Get contact information
    const contactInfoCommand = new GetContactInformationCommand({});
    const contactInfoResponse = await accountClient.send(contactInfoCommand);

    // Extract billing contact from contact information
    const billingContact =
      contactInfoResponse.ContactInformation?.FullName ||
      contactInfoResponse.ContactInformation?.CompanyName ||
      "Not Available";

    // Return data matching the AccountInfo interface
    return NextResponse.json({
      accountId: callerIdentityResponse.Account || "Unknown",
      region,
      billingContact,
      status: "Active" as const, // Default to Active for successful AWS calls
      // Include additional AWS-specific fields for reference
      userId: callerIdentityResponse.UserId,
      arn: callerIdentityResponse.Arn,
      assumedRoleUser: callerIdentityResponse.Arn?.includes("assumed-role")
        ? "Yes"
        : "No",
    });
  } catch (error) {
    console.error("Error fetching account info:", error);

    // Return mock data matching the AccountInfo interface
    return NextResponse.json({
      accountId: "123456789012",
      region:
        process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
      billingContact: "Mock User",
      status: "Active" as const,
      error: "AWS API unavailable - using mock data",
    });
  }
}
