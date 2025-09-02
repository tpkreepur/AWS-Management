"use client";

import { useState, useEffect } from "react";
import { awsDataService } from "@/services/aws-data.service";

interface ServiceInfo {
  mode: string;
  profile?: string;
  region?: string;
  hasCredentials: boolean;
}

export function AWSStatusIndicator() {
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    mode: "Loading...",
    hasCredentials: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        const info = await awsDataService.getServiceInfo();
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
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <div className="w-2 h-2 rounded-full mr-2 bg-gray-400 animate-pulse"></div>
        <span>Loading...</span>
      </div>
    );
  }

  const isRealAWS = serviceInfo.mode === "Real AWS";

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isRealAWS
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          isRealAWS ? "bg-green-500" : "bg-yellow-500"
        }`}
      ></div>

      <span className="font-medium">{serviceInfo.mode}</span>

      {serviceInfo.profile && (
        <span className="ml-2 text-xs opacity-75">
          Profile: {serviceInfo.profile}
        </span>
      )}

      {serviceInfo.region && (
        <span className="ml-2 text-xs opacity-75">
          Region: {serviceInfo.region}
        </span>
      )}

      {!isRealAWS && (
        <span className="ml-2 text-xs opacity-75">
          (Set AWS_PROFILE for real data)
        </span>
      )}
    </div>
  );
}
