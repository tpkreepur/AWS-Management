"use client";

import React, { useMemo } from "react";
import { useAccountInfo } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Loading skeleton component for account info card.
 * Memoized to prevent unnecessary re-renders when loading state doesn't change.
 */
const AccountInfoSkeleton = React.memo(() => (
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
));

AccountInfoSkeleton.displayName = "AccountInfoSkeleton";

/**
 * Error display component for account info card.
 * Memoized to prevent unnecessary re-renders when error message doesn't change.
 */
const AccountInfoError = React.memo<{ error: string }>(({ error }) => (
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
));

AccountInfoError.displayName = "AccountInfoError";

/**
 * Displays AWS account information in a card UI, including loading and error states.
 * Fetches data using the useAccountInfo hook.
 * Optimized with React.memo and useMemo to prevent unnecessary re-renders.
 * @returns {JSX.Element | null} The rendered account info card, loading skeleton, or error alert.
 */
export const AccountInfoCard = React.memo(() => {
  const { accountInfo, isLoading, error } = useAccountInfo();

  // Memoize computed values to prevent recalculation on every render
  const statusBadgeVariant = useMemo(() => {
    if (accountInfo?.status === "Active") return "default";
    return "destructive";
  }, [accountInfo?.status]);

  const maskedAccountId = useMemo(() => {
    if (!accountInfo?.accountId) return "";
    // Mask account ID showing only first 4 and last 4 digits
    const id = accountInfo.accountId;
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}****${id.slice(-4)}`;
  }, [accountInfo?.accountId]);

  if (isLoading) {
    return <AccountInfoSkeleton />;
  }

  if (error) {
    return <AccountInfoError error={error} />;
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
                {maskedAccountId}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Region
              </label>
              <p className="text-lg text-foreground">{accountInfo.region}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div>
                <Badge variant={statusBadgeVariant}>{accountInfo.status}</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                User ID
              </label>
              <p className="text-sm font-mono text-foreground">
                {accountInfo.userId || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Billing Contact
              </label>
              <p className="text-sm text-foreground">
                {accountInfo.billingContact}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Assumed Role User
              </label>
              <p className="text-sm text-foreground">
                {accountInfo.assumedRoleUser}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AccountInfoCard.displayName = "AccountInfoCard";
