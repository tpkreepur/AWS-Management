"use client";

import { useEC2Stats } from "@/hooks";
import { DashboardUtils } from "@/lib";

export function EC2Overview() {
  const { ec2Stats, isLoading, error } = useEC2Stats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          EC2 Instance Overview
        </h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          EC2 Instance Overview
        </h2>
        <div className="text-red-600 text-sm">
          <p>Error loading EC2 statistics: {error}</p>
        </div>
      </div>
    );
  }

  if (!ec2Stats) {
    return null;
  }

  const runningPercentage = DashboardUtils.calculateRunningPercentage(ec2Stats);
  const windowsPercentage = DashboardUtils.calculateWindowsPercentage(ec2Stats);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        EC2 Instance Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Instances */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {ec2Stats.total}
          </div>
          <div className="text-sm text-blue-700 font-medium">
            Total Instances
          </div>
        </div>

        {/* Running Instances */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {ec2Stats.running}
          </div>
          <div className="text-sm text-green-700 font-medium">Running</div>
        </div>

        {/* Stopped Instances */}
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {ec2Stats.stopped}
          </div>
          <div className="text-sm text-red-700 font-medium">Stopped</div>
        </div>

        {/* Windows Instances */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {ec2Stats.windows}
          </div>
          <div className="text-sm text-purple-700 font-medium">Windows</div>
        </div>

        {/* Linux Instances */}
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {ec2Stats.linux}
          </div>
          <div className="text-sm text-orange-700 font-medium">Linux</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Instance State</span>
            <span>{runningPercentage}% Running</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${runningPercentage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Operating System</span>
            <span>{windowsPercentage}% Windows</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${windowsPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
