"use client";

import { AccountInfoCard } from "./AccountInfoCard";
import { EC2Overview } from "./EC2Overview";
import { QuickActions } from "./QuickActions";
import { AWSStatusIndicator } from "./AWSStatusIndicator";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AWS DevOps Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage your AWS resources
              </p>
            </div>
            <AWSStatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="lg:col-span-2">
            <AccountInfoCard />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>

          {/* EC2 Overview */}
          <div className="lg:col-span-3">
            <EC2Overview />
          </div>
        </div>
      </main>
    </div>
  );
}
