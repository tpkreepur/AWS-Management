"use client";

import { useAccountInfo } from "@/hooks";
import { DashboardUtils } from "@/lib";

export function AccountInfoCard() {
  const { accountInfo, isLoading, error } = useAccountInfo();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h2>
        <div className="text-red-600 text-sm">
          <p>Error loading account information: {error}</p>
        </div>
      </div>
    );
  }

  if (!accountInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Account Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Account ID
            </label>
            <p className="text-lg font-mono text-gray-900">
              {accountInfo.accountId}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Region</label>
            <p className="text-lg text-gray-900">{accountInfo.region}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Billing Contact
            </label>
            <p className="text-lg text-gray-900">
              {accountInfo.billingContact}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 ${DashboardUtils.getStatusIndicatorColor(
                  accountInfo.status
                )} rounded-full mr-2`}
              ></div>
              <span
                className={`text-lg ${DashboardUtils.getStatusColor(
                  accountInfo.status
                )} font-medium`}
              >
                {accountInfo.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
