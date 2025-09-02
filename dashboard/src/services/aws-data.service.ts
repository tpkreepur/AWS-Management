import { AccountInfo, EC2Stats, QuickAction } from "@/types";

// Client-side AWS data service that calls API routes
export class AWSDataService {
  private baseUrl = "/api/aws";

  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/account`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching account info:", error);
      throw new Error(`Failed to fetch account information: ${error}`);
    }
  }

  async getEC2Stats(): Promise<EC2Stats> {
    try {
      const response = await fetch(`${this.baseUrl}/ec2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching EC2 stats:", error);
      throw new Error(`Failed to fetch EC2 statistics: ${error}`);
    }
  }

  async getQuickActions(): Promise<QuickAction[]> {
    // Get service status to determine if actions should be enabled
    const status = await this.getServiceInfo();
    const isRealAWS = status.mode === "Real AWS";

    return [
      {
        id: "view-snapshots",
        title: isRealAWS ? "View Snapshots" : "View Snapshots (Mock)",
        description: isRealAWS
          ? "Manage EBS snapshots"
          : "Mock: Manage EBS snapshots",
        icon: "📸",
        color: "bg-green-500 hover:bg-green-600",
        action: this.viewSnapshots.bind(this),
        enabled: isRealAWS,
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
  async getServiceInfo(): Promise<{
    mode: string;
    profile?: string;
    region?: string;
    hasCredentials: boolean;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching service info:", error);
      return {
        mode: "Mock",
        hasCredentials: false,
      };
    }
  }

  // Public method to check if using real AWS
  async isUsingRealAWS(): Promise<boolean> {
    const info = await this.getServiceInfo();
    return info.mode === "Real AWS";
  }
}

// Create a singleton instance
export const awsDataService = new AWSDataService();
