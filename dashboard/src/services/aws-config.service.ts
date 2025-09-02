import { EC2Client } from "@aws-sdk/client-ec2";
import { STSClient } from "@aws-sdk/client-sts";
import { fromIni } from "@aws-sdk/credential-provider-ini";

export interface AWSConfig {
  region: string;
  profile?: string;
}

export class AWSConfigService {
  private static instance: AWSConfigService;
  private config: AWSConfig;
  private ec2Client: EC2Client | null = null;
  private stsClient: STSClient | null = null;

  private constructor() {
    // Get configuration from environment variables
    this.config = {
      region:
        process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
      profile: process.env.AWS_PROFILE,
    };
  }

  /**
   * Returns the singleton instance of AWSConfigService.
   * @returns {AWSConfigService} The singleton instance.
   */
  public static getInstance(): AWSConfigService {
    if (!AWSConfigService.instance) {
      AWSConfigService.instance = new AWSConfigService();
    }
    return AWSConfigService.instance;
  }

  /**
   * Gets the current AWS configuration.
   * @returns {AWSConfig} The AWS configuration object.
   */
  public getConfig(): AWSConfig {
    return { ...this.config };
  }

  /**
   * Returns an EC2Client instance configured with the current AWS settings.
   * @returns {EC2Client} The EC2 client instance.
   */
  public getEC2Client(): EC2Client {
    if (!this.ec2Client) {
      const clientConfig: {
        region: string;
        credentials?: ReturnType<typeof fromIni>;
      } = {
        region: this.config.region,
      };

      // Use AWS profile if specified
      if (this.config.profile) {
        clientConfig.credentials = fromIni({ profile: this.config.profile });
      }

      this.ec2Client = new EC2Client(clientConfig);
    }
    return this.ec2Client;
  }

  /**
   * Returns an STSClient instance configured with the current AWS settings.
   * @returns {STSClient} The STS client instance.
   */
  public getSTSClient(): STSClient {
    if (!this.stsClient) {
      const clientConfig: {
        region: string;
        credentials?: ReturnType<typeof fromIni>;
      } = {
        region: this.config.region,
      };

      // Use AWS profile if specified
      if (this.config.profile) {
        clientConfig.credentials = fromIni({ profile: this.config.profile });
      }

      this.stsClient = new STSClient(clientConfig);
    }
    return this.stsClient;
  }

  /**
   * Updates the AWS configuration and resets clients to use the new config.
   * @param {Partial<AWSConfig>} newConfig - Partial AWS config to update.
   */
  public updateConfig(newConfig: Partial<AWSConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Reset clients to use new config
    this.ec2Client = null;
    this.stsClient = null;
  }
}

/**
 * Singleton instance of AWSConfigService for use throughout the app.
 */
export const awsConfig = AWSConfigService.getInstance();
