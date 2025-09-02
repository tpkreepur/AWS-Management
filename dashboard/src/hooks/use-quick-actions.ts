"use client";

import { useState, useEffect } from "react";
import { QuickAction, LoadingState } from "@/types";
import { awsDataService } from "@/services";

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
        const data = await awsDataService.getQuickActions();
        setQuickActions(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch quick actions",
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchQuickActions();
  }, []);

  const executeAction = async (actionId: string) => {
    const action = quickActions.find((a) => a.id === actionId);
    if (action) {
      try {
        await action.action();
      } catch (error) {
        console.error(`Failed to execute action ${actionId}:`, error);
      }
    }
  };

  const refetch = async () => {
    const fetchQuickActions = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsDataService.getQuickActions();
        setQuickActions(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch quick actions",
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
