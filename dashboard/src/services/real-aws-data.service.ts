import {
  EC2Client,
  DescribeInstancesCommand,
  DescribeSecurityGroupsCommand,
} from "@aws-sdk/client-ec2";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import type { AccountInfo } from "./aws-data.service";

// Simple in-memory cache implementation
class Cache {
  private cache = new Map<string, { value: any; expiry: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }
}

// AWS configuration helper
const awsConfig = {
  getConfig: () => ({
    region: process.env.AWS_REGION || "us-east-1",
  }),
};

// Ensure this class is only instantiated on the server
export class RealAWSDataService implements AWSDataService {
  private ec2Client: EC2Client;
  private s3Client: S3Client;
  private stsClient: STSClient;
  private cache = new Cache();

  constructor() {
    // This should only run on the server
    if (typeof window !== "undefined") {
      throw new Error("RealAWSDataService should only be used server-side");
    }

    const region = process.env.AWS_REGION || "us-east-1";
    this.ec2Client = new EC2Client({ region });
    this.s3Client = new S3Client({ region });
    this.stsClient = new STSClient({ region });
  }

  /**
   * Fetches AWS account information using STS GetCallerIdentity.
   * Results are cached for 10 minutes to reduce API calls.
   * @returns {Promise<AccountInfo>} The AWS account info object.
   */
  async getAccountInfo(): Promise<AccountInfo> {
    const cacheKey = "aws:account:info";
    const cached = this.cache.get<AccountInfo>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const command = new GetCallerIdentityCommand({});
      const response = await this.stsClient.send(command);

      const config = awsConfig.getConfig();

      const accountInfo: AccountInfo = {
        accountId: response.Account || "Unknown",
        region: config.region,
        billingContact: "billing@company.com", // Could be fetched from account settings
        status: "Active",
        userId: response.UserId || "Unknown",
        arn: response.Arn || "Unknown",
        assumedRoleUser: response.Arn?.includes("assumed-role") ? "Yes" : "No",
      };

      // Cache for 10 minutes (account info rarely changes)
      this.cache.set(cacheKey, accountInfo, 600);
      return accountInfo;
    } catch (error) {
      console.error("Error fetching account info:", error);
      throw new Error(`Failed to fetch account information: ${error}`);
    }
  }

  /**
   * Fetches EC2 statistics and instance details using DescribeInstances.
   * Results are cached for 2 minutes to balance freshness with performance.
   * @returns {Promise<EC2Stats>} The EC2 statistics object.
   */
  async getEC2Stats(): Promise<EC2Stats> {
    const cacheKey = "aws:ec2:stats";
    const cached = this.cache.get<EC2Stats>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const response = await this.fetchEC2Instances();
      const instances = this.processEC2Reservations(response.Reservations);
      const stats = this.calculateInstanceStats(instances);

      const ec2Stats: EC2Stats = {
        ...stats,
        instances,
      };

      // Cache for 2 minutes (EC2 instances can change more frequently)
      this.cache.set(cacheKey, ec2Stats, 120);
      return ec2Stats;
    } catch (error) {
      console.error("Error fetching EC2 stats:", error);
      throw new Error(`Failed to fetch EC2 statistics: ${error}`);
    }
  }

  /**
   * Fetches raw EC2 instance data from AWS API.
   * @returns The raw EC2 describe instances response.
   * @private
   */
  private async fetchEC2Instances() {
    const command = new DescribeInstancesCommand({});
    return await this.ec2Client.send(command);
  }

  /**
   * Processes EC2 reservations and transforms them into instance objects.
   * @param reservations - Array of EC2 reservation objects from AWS API.
   * @returns Array of processed EC2 instance objects.
   * @private
   */
  private processEC2Reservations(reservations?: unknown[]): EC2Instance[] {
    const instances: EC2Instance[] = [];

    reservations?.forEach((reservation: unknown) => {
      const reservationObj = reservation as { Instances?: unknown[] };
      reservationObj.Instances?.forEach((instance: unknown) => {
        const instanceObj = instance as { InstanceId?: string };
        if (!instanceObj.InstanceId) return;

        const processedInstance = this.transformEC2Instance(instance);
        instances.push(processedInstance);
      });
    });

    return instances;
  }

  /**
   * Transforms a raw AWS EC2 instance object into our typed EC2Instance format.
   * @param instance - Raw EC2 instance object from AWS API.
   * @returns Typed EC2Instance object.
   * @private
   */
  private transformEC2Instance(instance: unknown): EC2Instance {
    const instanceObj = instance as {
      InstanceId?: string;
      InstanceType?: string;
      State?: { Name?: string };
      Platform?: string;
      PlatformDetails?: string;
      LaunchTime?: Date;
      PrivateDnsName?: string;
      PublicDnsName?: string;
      Tags?: unknown[];
    };

    const state = (instanceObj.State?.Name as InstanceState) || "stopped";
    const platform = this.determinePlatform(
      instanceObj.Platform,
      instanceObj.PlatformDetails
    );

    return {
      instanceId: instanceObj.InstanceId || "",
      instanceType: instanceObj.InstanceType || "unknown",
      state,
      platform,
      launchTime: instanceObj.LaunchTime || new Date(),
      privateDnsName: instanceObj.PrivateDnsName,
      publicDnsName: instanceObj.PublicDnsName,
      tags: this.processTags(
        instanceObj.Tags as Array<{ Key?: string; Value?: string }>
      ),
    };
  }

  /**
   * Calculates aggregate statistics from a collection of EC2 instances.
   * @param {EC2Instance[]} instances - Array of EC2 instance objects.
   * @returns {Object} Statistics object with counts by state and platform.
   * @private
   */
  private calculateInstanceStats(instances: EC2Instance[]) {
    return instances.reduce(
      (stats, instance) => {
        stats.total++;

        // Count by state
        switch (instance.state) {
          case "running":
            stats.running++;
            break;
          case "stopped":
            stats.stopped++;
            break;
          case "pending":
            stats.pending++;
            break;
          case "stopping":
            stats.stopping++;
            break;
          case "terminated":
            stats.terminated++;
            break;
        }

        // Count by platform
        if (instance.platform === "windows") {
          stats.windows++;
        } else if (instance.platform === "linux") {
          stats.linux++;
        }

        return stats;
      },
      {
        total: 0,
        running: 0,
        stopped: 0,
        pending: 0,
        stopping: 0,
        terminated: 0,
        windows: 0,
        linux: 0,
      }
    );
  }

  /**
   * Returns a list of available quick actions for real AWS operations.
   * @returns {Promise<QuickAction[]>} Array of quick action objects.
   */
  async getQuickActions(): Promise<QuickAction[]> {
    const config = awsConfig.getConfig();

    return [
      {
        id: "launch-instance",
        title: "Launch Instance",
        description: "Start a new EC2 instance",
        icon: "rocket", // Using string instead of React component for server-side compatibility
        color: "bg-blue-500 hover:bg-blue-600",
        action: this.launchInstance.bind(this),
        enabled: true,
      },
      {
        id: "view-snapshots",
        title: "View Snapshots",
        description: "Manage EBS snapshots",
        icon: "camera",
        color: "bg-green-500 hover:bg-green-600",
        action: this.viewSnapshots.bind(this),
        enabled: true,
      },
      {
        id: "volume-management",
        title: "Volume Management",
        description: "Manage EBS volumes",
        icon: "hard-drive",
        color: "bg-purple-500 hover:bg-purple-600",
        action: this.manageVolumes.bind(this),
        enabled: true,
      },
      {
        id: "backup-status",
        title: "Backup Status",
        description: "Check backup status",
        icon: "refresh",
        color: "bg-orange-500 hover:bg-orange-600",
        action: this.checkBackupStatus.bind(this),
        enabled: true,
      },
      {
        id: "cost-analysis",
        title: "Cost Analysis",
        description: `View cost breakdown (${config.region})`,
        icon: "dollar-sign",
        color: "bg-yellow-500 hover:bg-yellow-600",
        action: this.viewCostAnalysis.bind(this),
        enabled: true,
      },
      {
        id: "security-groups",
        title: "Security Groups",
        description: "Manage firewall rules",
        icon: "lock",
        color: "bg-red-500 hover:bg-red-600",
        action: this.manageSecurityGroups.bind(this),
        enabled: true,
      },
    ];
  }

  /**
   * Determines the operating system platform from AWS instance metadata.
   * @param {string} platform - The platform field from EC2 instance data
   * @param {string} platformDetails - The platformDetails field from EC2 instance data
   * @returns {OperatingSystem} The detected operating system
   */
  private determinePlatform(
    platform?: string,
    platformDetails?: string
  ): OperatingSystem {
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

  /**
   * Processes AWS EC2 instance tags into a key-value record.
   * @param {Array<{ Key?: string; Value?: string }>} tags - The tags array from EC2 instance data
   * @returns {Record<string, string>} A key-value mapping of tags
   */
  private processTags(
    tags?: Array<{ Key?: string; Value?: string }>
  ): Record<string, string> {
    const tagMap: Record<string, string> = {};
    tags?.forEach((tag) => {
      if (tag.Key && tag.Value) {
        tagMap[tag.Key] = tag.Value;
      }
    });
    return tagMap;
  }

  // Action handlers - these can be implemented to perform real AWS operations

  /**
   * Generic handler for AWS operations that are not yet fully implemented.
   * Logs the operation and shows a placeholder alert.
   * @param {string} operationName - The name of the operation being performed.
   * @param {string} alertMessage - The message to show in the alert.
   * @returns {Promise<void>} Promise that resolves when the operation is complete.
   * @private
   */
  private async handlePlaceholderOperation(
    operationName: string,
    alertMessage: string
  ): Promise<void> {
    console.log(operationName);
    console.log(alertMessage); // Changed from alert() to console.log for server-side compatibility
  }

  /**
   * Launches a new EC2 instance with configurable parameters.
   * @returns {Promise<void>} Promise that resolves when the launch operation is complete
   */
  private async launchInstance(): Promise<void> {
    // Example implementation:
    // const command = new RunInstancesCommand({
    //   ImageId: 'ami-0abcdef1234567890', // Replace with actual AMI ID
    //   MinCount: 1,
    //   MaxCount: 1,
    //   InstanceType: 't3.micro'
    // });
    // await this.ec2Client.send(command);

    await this.handlePlaceholderOperation(
      "Launching new EC2 instance...",
      "Launch Instance functionality would be implemented here"
    );
  }

  /**
   * Views and manages EBS snapshots for the AWS account.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async viewSnapshots(): Promise<void> {
    await this.handlePlaceholderOperation(
      "Viewing EBS snapshots...",
      "Snapshot management would be implemented here"
    );
  }

  /**
   * Opens the EBS volume management interface.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async manageVolumes(): Promise<void> {
    await this.handlePlaceholderOperation(
      "Opening volume management...",
      "Volume management would be implemented here"
    );
  }

  /**
   * Checks the status of AWS backup operations and displays results.
   * @returns {Promise<void>} Promise that resolves when the check is complete
   */
  private async checkBackupStatus(): Promise<void> {
    await this.handlePlaceholderOperation(
      "Checking backup status...",
      "Backup status check would be implemented here"
    );
  }

  /**
   * Opens the cost analysis dashboard for reviewing AWS spending.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async viewCostAnalysis(): Promise<void> {
    await this.handlePlaceholderOperation(
      "Opening cost analysis...",
      "Cost analysis would be implemented here"
    );
  }

  /**
   * Opens the security group management interface for configuring network access rules.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async manageSecurityGroups(): Promise<void> {
    await this.handlePlaceholderOperation(
      "Managing security groups...",
      "Security group management would be implemented here"
    );
  }
}
