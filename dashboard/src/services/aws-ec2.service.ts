import { EC2Stats } from "@/types";
import { awsHttpClient } from "@/lib/http-client";

/**
 * Service responsible for EC2 resource management and statistics
 */
export class AWSEC2Service {
  /**
   * Fetches EC2 statistics from the API route.
   * @returns {Promise<EC2Stats>} The EC2 statistics object.
   */
  async getEC2Stats(): Promise<EC2Stats> {
    return awsHttpClient.get<EC2Stats>("/ec2", "EC2 statistics");
  }
}

/**
 * Singleton instance of AWSEC2Service
 */
export const awsEC2Service = new AWSEC2Service();
