"use client";

import React, { useCallback } from "react";
import { useQuickActions, useDebounce } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Loading skeleton for quick actions.
 * Memoized to prevent unnecessary re-renders.
 */
const QuickActionsSkeleton = React.memo(() => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-9 w-9 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

QuickActionsSkeleton.displayName = "QuickActionsSkeleton";

/**
 * Error display for quick actions.
 * Memoized to prevent unnecessary re-renders.
 */
const QuickActionsError = React.memo<{ error: string }>(({ error }) => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert variant="destructive">
        <AlertDescription>
          Error loading quick actions: {error}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
));

QuickActionsError.displayName = "QuickActionsError";

/**
 * Renders a panel of quick action buttons for AWS operations.
 * Each action is loaded dynamically and can be executed via the useQuickActions hook.
 * Action clicks are debounced to prevent rapid successive calls.
 * Optimized with React.memo and useCallback to prevent unnecessary re-renders.
 * @returns {JSX.Element} The rendered quick actions card with action buttons.
 */
export const QuickActions = React.memo(() => {
  const { quickActions, isLoading, error, executeAction } = useQuickActions();

  // Debounce action execution to prevent rapid clicks (500ms delay)
  const debouncedExecuteAction = useDebounce(executeAction, 500);

  // Memoize click handler to prevent recreation on every render
  const handleActionClick = useCallback(
    async (actionId: string) => {
      await debouncedExecuteAction(actionId);
    },
    [debouncedExecuteAction]
  );

  if (isLoading) {
    return <QuickActionsSkeleton />;
  }

  if (error) {
    return <QuickActionsError error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={`w-full justify-start h-auto p-3 ${action.color}`}
                variant="default"
              >
                <div className="flex items-center">
                  <IconComponent className="text-lg mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = "QuickActions";
