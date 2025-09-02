import { AccountInfo, EC2Stats, QuickAction } from "@/types";
import { awsAccountService } from "./aws-account.service";
import { awsEC2Service } from "./aws-ec2.service";
import { awsQuickActionsService } from "./aws-quick-actions.service";
import { awsStatusService } from "./aws-status.service";

// Client-side AWS data service that delegates to specialized services
export class AWSDataService {
  /**
   * Fetches AWS account information via the account service.
   * @returns {Promise<AccountInfo>} The AWS account info object.
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return awsAccountService.getAccountInfo();
  }

  /**
   * Fetches EC2 statistics via the EC2 service.
   * @returns {Promise<EC2Stats>} The EC2 statistics object.
   */
  async getEC2Stats(): Promise<EC2Stats> {
    return awsEC2Service.getEC2Stats();
  }

  /**
   * Returns a list of available quick actions via the quick actions service.
   * @returns {Promise<QuickAction[]>} Array of quick action objects.
   */
  async getQuickActions(): Promise<QuickAction[]> {
    return awsQuickActionsService.getQuickActions();
  }

  /**
   * Gets current service configuration info via the status service.
   * @returns {Promise<{mode: string; profile?: string; region?: string; hasCredentials: boolean}>} Service info object.
   */
  async getServiceInfo(): Promise<{
    mode: string;
    profile?: string;
    region?: string;
    hasCredentials: boolean;
  }> {
    return awsStatusService.getServiceInfo();
  }

  /**
   * Checks if the app is using real AWS via the status service.
   * @returns {Promise<boolean>} True if using real AWS, false otherwise.
   */
  async isUsingRealAWS(): Promise<boolean> {
    return awsStatusService.isUsingRealAWS();
  }

  /**
   * Executes a quick action by ID via the quick actions service.
   * @param {string} actionId - The ID of the action to execute.
   * @returns {Promise<void>} Promise that resolves when action is complete.
   */
  async executeQuickAction(actionId: string): Promise<void> {
    return awsQuickActionsService.executeAction(actionId);
  }
}

/**
 * Singleton instance of AWSDataService for use throughout the app.
 */
export const awsDataService = new AWSDataService();
