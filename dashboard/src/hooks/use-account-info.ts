"use client";

import { useState, useEffect } from "react";
import { AccountInfo, LoadingState } from "@/types";
import { awsDataService } from "@/services";

export function useAccountInfo() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsDataService.getAccountInfo();
        setAccountInfo(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch account info",
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchAccountInfo();
  }, []);

  const refetch = async () => {
    const fetchAccountInfo = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsDataService.getAccountInfo();
        setAccountInfo(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch account info",
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    await fetchAccountInfo();
  };

  return {
    accountInfo,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    refetch,
  };
}
