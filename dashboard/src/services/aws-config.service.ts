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

  public static getInstance(): AWSConfigService {
    if (!AWSConfigService.instance) {
      AWSConfigService.instance = new AWSConfigService();
    }
    return AWSConfigService.instance;
  }

  public getConfig(): AWSConfig {
    return { ...this.config };
  }

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

  public updateConfig(newConfig: Partial<AWSConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Reset clients to use new config
    this.ec2Client = null;
    this.stsClient = null;
  }
}

export const awsConfig = AWSConfigService.getInstance();
