import { AccountInfo, EC2Stats, QuickAction } from "@/types";
import { awsHttpClient } from "@/lib/http-client";
import {
  FaRocket,
  FaCamera,
  FaHdd,
  FaSync,
  FaDollarSign,
  FaLock,
} from "react-icons/fa";

// Client-side AWS data service that calls API routes
export class AWSDataService {
  /**
   * Fetches AWS account information from the API route.
   * @returns {Promise<AccountInfo>} The AWS account info object.
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return awsHttpClient.get<AccountInfo>("/account", "account information");
  }

  /**
   * Fetches EC2 statistics from the API route.
   * @returns {Promise<EC2Stats>} The EC2 statistics object.
   */
  async getEC2Stats(): Promise<EC2Stats> {
    return awsHttpClient.get<EC2Stats>("/ec2", "EC2 statistics");
  }

  /**
   * Returns a list of available quick actions, with mock or real AWS labels based on current mode.
   * @returns {Promise<QuickAction[]>} Array of quick action objects.
   */
  async getQuickActions(): Promise<QuickAction[]> {
    // Get service status to determine if actions should be enabled
    const status = await this.getServiceInfo();
    const isRealAWS = status.mode === "Real AWS";

    return [
      {
        id: "launch-instance",
        title: isRealAWS ? "Launch Instance" : "Launch Instance (Mock)",
        description: isRealAWS
          ? "Launch new EC2 instance"
          : "Mock: Launch new EC2 instance",
        icon: FaRocket,
        color: "bg-blue-500 hover:bg-blue-600",
        action: this.launchInstance.bind(this),
        enabled: true,
      },
      {
        id: "view-snapshots",
        title: isRealAWS ? "View Snapshots" : "View Snapshots (Mock)",
        description: isRealAWS
          ? "Manage EBS snapshots"
          : "Mock: Manage EBS snapshots",
        icon: FaCamera,
        color: "bg-green-500 hover:bg-green-600",
        action: this.viewSnapshots.bind(this),
        enabled: true,
      },
      {
        id: "manage-volumes",
        title: isRealAWS ? "Manage Volumes" : "Manage Volumes (Mock)",
        description: isRealAWS
          ? "Manage EBS volumes"
          : "Mock: Manage EBS volumes",
        icon: FaHdd,
        color: "bg-purple-500 hover:bg-purple-600",
        action: this.manageVolumes.bind(this),
        enabled: true,
      },
      {
        id: "backup-status",
        title: isRealAWS ? "Backup Status" : "Backup Status (Mock)",
        description: isRealAWS
          ? "Check backup status"
          : "Mock: Check backup status",
        icon: FaSync,
        color: "bg-orange-500 hover:bg-orange-600",
        action: this.checkBackupStatus.bind(this),
        enabled: true,
      },
      {
        id: "cost-analysis",
        title: isRealAWS ? "Cost Analysis" : "Cost Analysis (Mock)",
        description: isRealAWS
          ? "View cost analysis"
          : "Mock: View cost analysis",
        icon: FaDollarSign,
        color: "bg-yellow-500 hover:bg-yellow-600",
        action: this.viewCostAnalysis.bind(this),
        enabled: true,
      },
      {
        id: "security-groups",
        title: isRealAWS ? "Security Groups" : "Security Groups (Mock)",
        description: isRealAWS
          ? "Manage security groups"
          : "Mock: Manage security groups",
        icon: FaLock,
        color: "bg-red-500 hover:bg-red-600",
        action: this.manageSecurityGroups.bind(this),
        enabled: true,
      },
    ];
  }

  // Action handlers
  private async launchInstance(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Launching new EC2 instance...");
      alert(
        "Launch Instance functionality would be implemented here (real AWS mode)"
      );
    } else {
      console.log("Mock: Launching new EC2 instance...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  private async viewSnapshots(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Viewing EBS snapshots...");
      alert("Snapshot management would be implemented here (real AWS mode)");
    } else {
      console.log("Mock: Viewing EBS snapshots...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  private async manageVolumes(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Opening volume management...");
      alert("Volume management would be implemented here (real AWS mode)");
    } else {
      console.log("Mock: Opening volume management...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  private async checkBackupStatus(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Checking backup status...");
      alert("Backup status check would be implemented here (real AWS mode)");
    } else {
      console.log("Mock: Checking backup status...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  private async viewCostAnalysis(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Opening cost analysis...");
      alert("Cost analysis would be implemented here (real AWS mode)");
    } else {
      console.log("Mock: Opening cost analysis...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  private async manageSecurityGroups(): Promise<void> {
    const status = await this.getServiceInfo();
    if (status.mode === "Real AWS") {
      console.log("Managing security groups...");
      alert(
        "Security group management would be implemented here (real AWS mode)"
      );
    } else {
      console.log("Mock: Managing security groups...");
      alert("Mock mode: Set AWS_PROFILE to use real AWS functionality");
    }
  }

  // Public method to get current configuration info
  /**
   * Gets current service configuration info (mode, profile, region, credentials).
   * @returns {Promise<{mode: string; profile?: string; region?: string; hasCredentials: boolean}>} Service info object.
   */
  async getServiceInfo(): Promise<{
    mode: string;
    profile?: string;
    region?: string;
    hasCredentials: boolean;
  }> {
    try {
      return await awsHttpClient.get("/status", "service configuration");
    } catch (error) {
      console.error("Error fetching service info:", error);
      return {
        mode: "Mock",
        hasCredentials: false,
      };
    }
  }

  // Public method to check if using real AWS
  /**
   * Checks if the app is using real AWS credentials and endpoints.
   * @returns {Promise<boolean>} True if using real AWS, false otherwise.
   */
  async isUsingRealAWS(): Promise<boolean> {
    const info = await this.getServiceInfo();
    return info.mode === "Real AWS";
  }
}

/**
 * Singleton instance of AWSDataService for use throughout the app.
 */
export const awsDataService = new AWSDataService();
