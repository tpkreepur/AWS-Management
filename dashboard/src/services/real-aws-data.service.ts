import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import {
  FaRocket,
  FaCamera,
  FaHdd,
  FaSync,
  FaDollarSign,
  FaLock,
} from "react-icons/fa";
import {
  AccountInfo,
  EC2Stats,
  QuickAction,
  EC2Instance,
  InstanceState,
  OperatingSystem,
} from "@/types";
import { awsConfig } from "./aws-config.service";

export class RealAWSDataService {
  private ec2Client: EC2Client;
  private stsClient: STSClient;

  constructor() {
    this.ec2Client = awsConfig.getEC2Client();
    this.stsClient = awsConfig.getSTSClient();
  }

  /**
   * Fetches AWS account information using STS GetCallerIdentity.
   * @returns {Promise<AccountInfo>} The AWS account info object.
   */
  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const command = new GetCallerIdentityCommand({});
      const response = await this.stsClient.send(command);

      const config = awsConfig.getConfig();

      return {
        accountId: response.Account || "Unknown",
        region: config.region,
        billingContact: "billing@company.com", // Could be fetched from account settings
        status: "Active",
        userId: response.UserId,
        arn: response.Arn,
        assumedRoleUser: response.Arn?.includes("assumed-role") ? "Yes" : "No",
      };
    } catch (error) {
      console.error("Error fetching account info:", error);
      throw new Error(`Failed to fetch account information: ${error}`);
    }
  }

  /**
   * Fetches EC2 statistics and instance details using DescribeInstances.
   * @returns {Promise<EC2Stats>} The EC2 statistics object.
   */
  async getEC2Stats(): Promise<EC2Stats> {
    try {
      const command = new DescribeInstancesCommand({});
      const response = await this.ec2Client.send(command);

      const instances: EC2Instance[] = [];
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

          const state = (instance.State?.Name as InstanceState) || "unknown";
          const platform = this.determinePlatform(
            instance.Platform,
            instance.PlatformDetails
          );

          instances.push({
            instanceId: instance.InstanceId,
            instanceType: instance.InstanceType || "unknown",
            state,
            platform,
            launchTime: instance.LaunchTime || new Date(),
            privateDnsName: instance.PrivateDnsName,
            publicDnsName: instance.PublicDnsName,
            tags: this.processTags(instance.Tags),
          });

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

      return {
        total,
        running,
        stopped,
        windows,
        linux,
        pending,
        stopping,
        terminated,
        instances,
      };
    } catch (error) {
      console.error("Error fetching EC2 stats:", error);
      throw new Error(`Failed to fetch EC2 statistics: ${error}`);
    }
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
        icon: FaRocket,
        color: "bg-blue-500 hover:bg-blue-600",
        action: this.launchInstance.bind(this),
        enabled: true,
      },
      {
        id: "view-snapshots",
        title: "View Snapshots",
        description: "Manage EBS snapshots",
        icon: FaCamera,
        color: "bg-green-500 hover:bg-green-600",
        action: this.viewSnapshots.bind(this),
        enabled: true,
      },
      {
        id: "volume-management",
        title: "Volume Management",
        description: "Manage EBS volumes",
        icon: FaHdd,
        color: "bg-purple-500 hover:bg-purple-600",
        action: this.manageVolumes.bind(this),
        enabled: true,
      },
      {
        id: "backup-status",
        title: "Backup Status",
        description: "Check backup status",
        icon: FaSync,
        color: "bg-orange-500 hover:bg-orange-600",
        action: this.checkBackupStatus.bind(this),
        enabled: true,
      },
      {
        id: "cost-analysis",
        title: "Cost Analysis",
        description: `View cost breakdown (${config.region})`,
        icon: FaDollarSign,
        color: "bg-yellow-500 hover:bg-yellow-600",
        action: this.viewCostAnalysis.bind(this),
        enabled: true,
      },
      {
        id: "security-groups",
        title: "Security Groups",
        description: "Manage firewall rules",
        icon: FaLock,
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
   * Launches a new EC2 instance with configurable parameters.
   * @returns {Promise<void>} Promise that resolves when the launch operation is complete
   */
  private async launchInstance(): Promise<void> {
    console.log("Launching new EC2 instance...");
    // Example implementation:
    // const command = new RunInstancesCommand({
    //   ImageId: 'ami-0abcdef1234567890', // Replace with actual AMI ID
    //   MinCount: 1,
    //   MaxCount: 1,
    //   InstanceType: 't3.micro'
    // });
    // await this.ec2Client.send(command);
    alert("Launch Instance functionality would be implemented here");
  }

  /**
   * Views and manages EBS snapshots for the AWS account.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async viewSnapshots(): Promise<void> {
    console.log("Viewing EBS snapshots...");
    alert("Snapshot management would be implemented here");
  }

  /**
   * Opens the EBS volume management interface.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async manageVolumes(): Promise<void> {
    console.log("Opening volume management...");
    alert("Volume management would be implemented here");
  }

  /**
   * Checks the status of AWS backup operations and displays results.
   * @returns {Promise<void>} Promise that resolves when the check is complete
   */
  private async checkBackupStatus(): Promise<void> {
    console.log("Checking backup status...");
    alert("Backup status check would be implemented here");
  }

  /**
   * Opens the cost analysis dashboard for reviewing AWS spending.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async viewCostAnalysis(): Promise<void> {
    console.log("Opening cost analysis...");
    alert("Cost analysis would be implemented here");
  }

  /**
   * Opens the security group management interface for configuring network access rules.
   * @returns {Promise<void>} Promise that resolves when the operation is complete
   */
  private async manageSecurityGroups(): Promise<void> {
    console.log("Managing security groups...");
    alert("Security group management would be implemented here");
  }
}
