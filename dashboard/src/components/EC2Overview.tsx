"use client";

import React, { useMemo } from "react";
import { useEC2Stats } from "@/hooks";
import { DashboardUtils } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadialChart } from "@/components/ui/radial-chart";

/**
 * Statistics card component for individual metrics.
 * Memoized to prevent unnecessary re-renders.
 */
const StatCard = React.memo<{
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
}>(({ value, label, bgColor, textColor }) => (
  <div className={`text-center p-4 ${bgColor} rounded-lg`}>
    <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-sm ${textColor} font-medium`}>{label}</div>
  </div>
));

StatCard.displayName = "StatCard";

/**
 * Loading skeleton for EC2 overview.
 * Memoized to prevent unnecessary re-renders.
 */
const EC2OverviewSkeleton = React.memo(() => (
  <Card>
    <CardHeader>
      <CardTitle>EC2 Instance Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="text-center p-4 bg-muted/20 rounded-lg">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-64 h-64 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="w-64 h-64 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

EC2OverviewSkeleton.displayName = "EC2OverviewSkeleton";

/**
 * Error display for EC2 overview.
 * Memoized to prevent unnecessary re-renders.
 */
const EC2OverviewError = React.memo<{ error: string }>(({ error }) => (
  <Card>
    <CardHeader>
      <CardTitle>EC2 Instance Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert variant="destructive">
        <AlertDescription>
          Error loading EC2 statistics: {error}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
));

EC2OverviewError.displayName = "EC2OverviewError";

/**
 * Displays EC2 instance overview statistics and charts.
 * Shows instance counts by state, OS type, and detailed breakdowns.
 * Optimized with React.memo and useMemo to prevent unnecessary re-renders.
 * @returns {JSX.Element} The rendered EC2 overview card with statistics and charts.
 */
const EC2Overview = React.memo(() => {
  const { ec2Stats, isLoading, error } = useEC2Stats();

  // Memoize computed values to prevent recalculation on every render
  const runningPercentage = useMemo(() => {
    return ec2Stats ? DashboardUtils.calculateRunningPercentage(ec2Stats) : 0;
  }, [ec2Stats]);

  const windowsPercentage = useMemo(() => {
    return ec2Stats ? DashboardUtils.calculateWindowsPercentage(ec2Stats) : 0;
  }, [ec2Stats]);

  // Memoize chart data to prevent recreation on every render
  const instanceStateData = useMemo(() => {
    if (!ec2Stats) return [];
    return [
      {
        name: "Running",
        value: ec2Stats.running,
        color: "hsl(var(--chart-2))", // Green
      },
      {
        name: "Stopped",
        value: ec2Stats.stopped,
        color: "hsl(var(--chart-1))", // Red
      },
    ];
  }, [ec2Stats]);

  const osTypeData = useMemo(() => {
    if (!ec2Stats) return [];
    return [
      {
        name: "Windows",
        value: ec2Stats.windows,
        color: "hsl(var(--chart-4))", // Purple
      },
      {
        name: "Linux",
        value: ec2Stats.linux,
        color: "hsl(var(--chart-3))", // Orange
      },
    ];
  }, [ec2Stats]);

  if (isLoading) {
    return <EC2OverviewSkeleton />;
  }

  if (error) {
    return <EC2OverviewError error={error} />;
  }

  if (!ec2Stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EC2 Instance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            value={ec2Stats.total}
            label="Total Instances"
            bgColor="bg-blue-50 dark:bg-blue-950/20"
            textColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            value={ec2Stats.running}
            label="Running"
            bgColor="bg-green-50 dark:bg-green-950/20"
            textColor="text-green-600 dark:text-green-400"
          />
          <StatCard
            value={ec2Stats.stopped}
            label="Stopped"
            bgColor="bg-red-50 dark:bg-red-950/20"
            textColor="text-red-600 dark:text-red-400"
          />
          <StatCard
            value={ec2Stats.windows}
            label="Windows"
            bgColor="bg-purple-50 dark:bg-purple-950/20"
            textColor="text-purple-600 dark:text-purple-400"
          />
          <StatCard
            value={ec2Stats.linux}
            label="Linux"
            bgColor="bg-orange-50 dark:bg-orange-950/20"
            textColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Radial Charts */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instance State Chart */}
          <div className="flex items-center space-x-4">
            <div className="w-64 h-64">
              <RadialChart data={instanceStateData} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-3">Instance State</h3>
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-green-600">
                  {runningPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
              <div className="space-y-3">
                {instanceStateData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operating System Chart */}
          <div className="flex items-center space-x-4">
            <div className="w-64 h-64">
              <RadialChart data={osTypeData} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-3">Operating System</h3>
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-purple-600">
                  {windowsPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Windows</div>
              </div>
              <div className="space-y-3">
                {osTypeData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EC2Overview.displayName = "EC2Overview";

export default EC2Overview;
