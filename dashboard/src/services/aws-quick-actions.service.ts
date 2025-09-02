import { QuickAction } from "@/types";
import {
  createQuickActions,
  createMockActionHandlers,
} from "@/lib/quick-actions";
import { awsStatusService } from "./aws-status.service";

/**
 * Service responsible for managing quick actions and their execution
 */
export class AWSQuickActionsService {
  /**
   * Returns a list of available quick actions, with mock or real AWS labels based on current mode.
   * @returns {Promise<QuickAction[]>} Array of quick action objects.
   */
  async getQuickActions(): Promise<QuickAction[]> {
    // Get service status to determine if actions should be enabled
    const status = await awsStatusService.getServiceInfo();
    const isRealAWS = status.mode === "Real AWS";

    // Get appropriate action handlers
    const actionHandlers = createMockActionHandlers(isRealAWS);

    return createQuickActions(isRealAWS, actionHandlers);
  }

  /**
   * Executes a specific quick action by ID
   * @param actionId - The ID of the action to execute
   * @returns Promise that resolves when action is complete
   */
  async executeAction(actionId: string): Promise<void> {
    const actions = await this.getQuickActions();
    const action = actions.find((a) => a.id === actionId);

    if (action && action.action) {
      await action.action();
    } else {
      throw new Error(
        `Action with ID "${actionId}" not found or not available`
      );
    }
  }
}

/**
 * Singleton instance of AWSQuickActionsService
 */
export const awsQuickActionsService = new AWSQuickActionsService();
