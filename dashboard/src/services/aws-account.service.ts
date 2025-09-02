import { AccountInfo } from "@/types";
import { awsHttpClient } from "@/lib/http-client";

/**
 * Service responsible for AWS account information management
 */
export class AWSAccountService {
  /**
   * Fetches AWS account information from the API route.
   * @returns {Promise<AccountInfo>} The AWS account info object.
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return awsHttpClient.get<AccountInfo>('/account', 'account information');
  }
}

/**
 * Singleton instance of AWSAccountService
 */
export const awsAccountService = new AWSAccountService();
