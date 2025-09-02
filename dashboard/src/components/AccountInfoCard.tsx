"use client";

import { useAccountInfo } from "@/hooks";
import { DashboardUtils } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AccountInfoCard() {
  const { accountInfo, isLoading, error } = useAccountInfo();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
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
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading account information: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!accountInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Account ID
              </label>
              <p className="text-lg font-mono text-foreground">
                {accountInfo.accountId}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Region
              </label>
              <p className="text-lg text-foreground">{accountInfo.region}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Billing Contact
              </label>
              <p className="text-lg text-foreground">
                {accountInfo.billingContact}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="flex items-center">
                <Badge
                  variant={
                    accountInfo.status === "Active" ? "default" : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  <div
                    className={`w-2 h-2 ${DashboardUtils.getStatusIndicatorColor(
                      accountInfo.status
                    )} rounded-full`}
                  />
                  {accountInfo.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
