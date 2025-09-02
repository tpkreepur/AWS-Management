"use client";

import { useState, useEffect } from "react";
import { QuickAction, LoadingState } from "@/types";
import { awsQuickActionsService } from "@/services";
import { createUserFriendlyErrorMessage } from "@/lib/error-messages";

/**
 * Custom React hook to fetch and execute quick actions, with loading/error state management.
 * @returns {{
 *   quickActions: QuickAction[],
 *   isLoading: boolean,
 *   error: string | null,
 *   executeAction: (actionId: string) => Promise<void>,
 *   refetch: () => Promise<void>
 * }} Hook state, action executor, and refetch function.
 */
export function useQuickActions() {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchQuickActions = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsQuickActionsService.getQuickActions();
        setQuickActions(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, "actions"),
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchQuickActions();
  }, []);

  const executeAction = async (actionId: string) => {
    try {
      await awsQuickActionsService.executeAction(actionId);
    } catch (error) {
      console.error(`Failed to execute action ${actionId}:`, error);
    }
  };

  const refetch = async () => {
    const fetchQuickActions = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsQuickActionsService.getQuickActions();
        setQuickActions(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, "actions"),
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    await fetchQuickActions();
  };

  return {
    quickActions,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    executeAction,
    refetch,
  };
}
