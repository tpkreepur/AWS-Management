"use client";

import { useEC2Stats } from "@/hooks";
import { DashboardUtils } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadialChart } from "@/components/ui/radial-chart";

export function EC2Overview() {
  const { ec2Stats, isLoading, error } = useEC2Stats();

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!ec2Stats) {
    return null;
  }

  const runningPercentage = DashboardUtils.calculateRunningPercentage(ec2Stats);
  const windowsPercentage = DashboardUtils.calculateWindowsPercentage(ec2Stats);

  return (
    <Card>
      <CardHeader>
        <CardTitle>EC2 Instance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total Instances */}
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {ec2Stats.total}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Total Instances
            </div>
          </div>

          {/* Running Instances */}
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {ec2Stats.running}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">
              Running
            </div>
          </div>

          {/* Stopped Instances */}
          <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {ec2Stats.stopped}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 font-medium">
              Stopped
            </div>
          </div>

          {/* Windows Instances */}
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {ec2Stats.windows}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Windows
            </div>
          </div>

          {/* Linux Instances */}
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {ec2Stats.linux}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              Linux
            </div>
          </div>
        </div>

        {/* Radial Charts */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instance State Chart */}
          <div className="flex items-center space-x-4">
            <div className="w-64 h-64">
              <RadialChart
                data={[
                  {
                    name: "Running",
                    value: ec2Stats.running,
                    color: "hsl(var(--chart-2))", // Green
                  },
                  {
                    name: "Stopped",
                    value: ec2Stats.stopped,
                    color: "hsl(var(--chart-1))", // Red/Orange
                  },
                ]}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-3">Instance State</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2" />
                    <span>Running</span>
                  </div>
                  <span className="font-medium">
                    {ec2Stats.running} ({runningPercentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2" />
                    <span>Stopped</span>
                  </div>
                  <span className="font-medium">
                    {ec2Stats.stopped} ({100 - runningPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operating System Chart */}
          <div className="flex items-center space-x-4">
            <div className="w-64 h-64">
              <RadialChart
                data={[
                  {
                    name: "Windows",
                    value: ec2Stats.windows,
                    color: "hsl(var(--chart-4))", // Purple
                  },
                  {
                    name: "Linux",
                    value: ec2Stats.linux,
                    color: "hsl(var(--chart-5))", // Orange
                  },
                ]}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-3">Operating System</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))] mr-2" />
                    <span>Windows</span>
                  </div>
                  <span className="font-medium">
                    {ec2Stats.windows} ({windowsPercentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))] mr-2" />
                    <span>Linux</span>
                  </div>
                  <span className="font-medium">
                    {ec2Stats.linux} ({100 - windowsPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
