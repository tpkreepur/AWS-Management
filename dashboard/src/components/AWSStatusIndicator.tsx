"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface AWSStatus {
  isConnected: boolean;
  profile?: string;
  region?: string;
  error?: string;
}

export default function AWSStatusIndicator() {
  const [status, setStatus] = useState<AWSStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAWSStatus = async () => {
      try {
        const response = await fetch("/api/aws/status");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({
          isConnected: false,
          error: "Failed to check AWS status",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAWSStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AWS Connection</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Checking...</div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AWS Connection</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">Error</div>
          <p className="text-xs text-muted-foreground mt-1">
            Unable to check status
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AWS Connection</CardTitle>
        {status.isConnected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Badge variant={status.isConnected ? "default" : "destructive"}>
            {status.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        {status.isConnected && (
          <div className="mt-2 space-y-1">
            {status.profile && (
              <p className="text-xs text-muted-foreground">
                Profile: {status.profile}
              </p>
            )}
            {status.region && (
              <p className="text-xs text-muted-foreground">
                Region: {status.region}
              </p>
            )}
          </div>
        )}
        {status.error && (
          <p className="text-xs text-destructive mt-1">{status.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
