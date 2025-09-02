import { GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import {
  AccountClient,
  GetAccountInformationCommand,
  GetContactInformationCommand,
} from "@aws-sdk/client-account";
import {
  handleAPIError,
  createAPISuccessResponse,
} from "@/lib/api-error-handler";
import { awsConfig } from "@/services/aws-config.service";

export async function GET() {
  try {
    // Use the centralized AWS config service
    const stsClient = awsConfig.getSTSClient();
    const config = awsConfig.getConfig();

    // Initialize Account client with the same configuration
    const accountClient = new AccountClient({
      region: config.region,
      ...(config.profile && {
        credentials: awsConfig.getSTSClient().config.credentials,
      }),
    });

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
    const accountData = {
      accountId: callerIdentityResponse.Account || "Unknown",
      region: config.region,
      billingContact,
      status: "Active" as const, // Default to Active for successful AWS calls
      // Include additional AWS-specific fields for reference
      userId: callerIdentityResponse.UserId,
      arn: callerIdentityResponse.Arn,
      assumedRoleUser: callerIdentityResponse.Arn?.includes("assumed-role")
        ? "Yes"
        : "No",
    };

    return createAPISuccessResponse(accountData, "aws");
  } catch (error) {
    // Define fallback mock data
    const config = awsConfig.getConfig();
    const mockData = {
      accountId: "123456789012",
      region: config.region,
      billingContact: "Mock User",
      status: "Active" as const,
    };

    return handleAPIError(error, mockData, "account endpoint");
  }
}
