// Re-export client-side services only
export * from "./aws-data.service";

// New segregated services
export * from "./aws-account.service";
export * from "./aws-ec2.service";  
export * from "./aws-quick-actions.service";
export * from "./aws-status.service";

// Configuration service
export * from "./aws-config.service";
