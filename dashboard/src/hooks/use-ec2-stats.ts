"use client";

import { useState, useEffect } from "react";
import { EC2Stats, LoadingState } from "@/types";
import { awsDataService } from "@/services";

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
        const data = await awsDataService.getEC2Stats();
        setEC2Stats(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch EC2 stats",
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
        const data = await awsDataService.getEC2Stats();
        setEC2Stats(data);
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch EC2 stats",
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
