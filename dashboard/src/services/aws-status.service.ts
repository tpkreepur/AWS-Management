import { awsHttpClient } from "@/lib/http-client";

/**
 * Service responsible for AWS service status and configuration information
 */
export class AWSStatusService {
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
      return await awsHttpClient.get('/status', 'service configuration');
    } catch (error) {
      console.error("Error fetching service info:", error);
      return {
        mode: "Mock",
        hasCredentials: false,
      };
    }
  }

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
 * Singleton instance of AWSStatusService
 */
export const awsStatusService = new AWSStatusService();
