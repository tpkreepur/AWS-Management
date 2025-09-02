"use client";

import { useState, useEffect } from "react";
import { AccountInfo, LoadingState } from "@/types";
import { awsAccountService } from "@/services";
import { createUserFriendlyErrorMessage } from "@/lib/error-messages";

/**
 * Custom React hook to fetch AWS account information and manage loading/error state.
 * @returns {{
 *   accountInfo: AccountInfo | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: () => Promise<void>
 * }} Hook state and refetch function.
 */
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
        const data = await awsAccountService.getAccountInfo();
        setAccountInfo(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, 'account'),
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
        const data = await awsAccountService.getAccountInfo();
        setAccountInfo(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, 'account'),
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
