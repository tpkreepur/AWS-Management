// AWS-related type definitions
import * as React from "react";

export interface AccountInfo {
  accountId: string;
  region: string;
  billingContact: string;
  status: "Active" | "Inactive" | "Suspended";
  // Additional AWS-specific fields
  userId?: string;
  arn?: string;
  assumedRoleUser?: string;
}

export interface EC2Instance {
  instanceId: string;
  instanceType: string;
  state: InstanceState;
  platform: OperatingSystem;
  launchTime: Date;
  privateDnsName?: string;
  publicDnsName?: string;
  tags?: Record<string, string>;
}

export interface EC2Stats {
  total: number;
  running: number;
  stopped: number;
  windows: number;
  linux: number;
  // Additional stats
  pending?: number;
  stopping?: number;
  terminated?: number;
  instances?: EC2Instance[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void | Promise<void>;
  enabled?: boolean;
}

export interface DashboardData {
  accountInfo: AccountInfo;
  ec2Stats: EC2Stats;
  quickActions: QuickAction[];
}

export type InstanceState =
  | "running"
  | "stopped"
  | "pending"
  | "stopping"
  | "starting"
  | "terminated";
export type OperatingSystem = "windows" | "linux" | "unknown";
export type AccountStatus = "Active" | "Inactive" | "Suspended";

// AWS API Error types
export interface AWSError {
  code: string;
  message: string;
  requestId?: string;
}
