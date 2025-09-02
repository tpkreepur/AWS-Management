"use client";

import { useState, useEffect } from "react";
import { EC2Stats, LoadingState } from "@/types";
import { awsEC2Service } from "@/services";
import { createUserFriendlyErrorMessage } from "@/lib/error-messages";

/**
 * Custom React hook to fetch EC2 statistics and manage loading/error state.
 * @returns {{
 *   ec2Stats: EC2Stats | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: () => Promise<void>
 * }} Hook state and refetch function.
 */
export function useEC2Stats() {
  const [ec2Stats, setEC2Stats] = useState<EC2Stats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEC2Stats = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsEC2Service.getEC2Stats();
        setEC2Stats(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, "ec2"),
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchEC2Stats();
  }, []);

  const refetch = async () => {
    const fetchEC2Stats = async () => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await awsEC2Service.getEC2Stats();
        setEC2Stats(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: createUserFriendlyErrorMessage(error, "ec2"),
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    await fetchEC2Stats();
  };

  return {
    ec2Stats,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    refetch,
  };
}
