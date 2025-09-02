"use client";

import { useState, useEffect } from "react";
import { awsStatusService } from "@/services";
import { Badge } from "@/components/ui/badge";

interface ServiceInfo {
  mode: string;
  profile?: string;
  region?: string;
  hasCredentials: boolean;
}

/**
 * Displays the current AWS connection status (real or mock) as a badge, including profile and region info.
 * Fetches service info using awsStatusService.
 * @returns {JSX.Element} The rendered status indicator badge.
 */
export function AWSStatusIndicator() {
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    mode: "Loading...",
    hasCredentials: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        const info = await awsStatusService.getServiceInfo();
        setServiceInfo(info);
      } catch (error) {
        console.error("Error fetching service info:", error);
        setServiceInfo({
          mode: "Error",
          hasCredentials: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceInfo();
  }, []);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <div className="w-2 h-2 rounded-full mr-2 bg-muted-foreground/50" />
        Loading...
      </Badge>
    );
  }

  const isRealAWS = serviceInfo.mode === "Real AWS";

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isRealAWS ? "default" : "secondary"}
        className={`flex items-center gap-2 ${
          isRealAWS
            ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isRealAWS ? "bg-green-500" : "bg-yellow-500"
          }`}
        />

        <span className="font-medium">{serviceInfo.mode}</span>

        {serviceInfo.profile && (
          <span className="text-xs opacity-75">
            Profile: {serviceInfo.profile}
          </span>
        )}

        {serviceInfo.region && (
          <span className="text-xs opacity-75">
            Region: {serviceInfo.region}
          </span>
        )}

        {!isRealAWS && (
          <span className="text-xs opacity-75">
            (Set AWS_PROFILE for real data)
          </span>
        )}
      </Badge>
    </div>
  );
}
