# AWS Profile Integration Guide

## Overview

Your AWS Dashboard now supports both mock data and real AWS data based on your AWS profile configuration. The application automatically detects your AWS credentials and switches between modes.

## Setup Guide

### 1. Install AWS CLI (if not already installed)

```bash
# On macOS
brew install awscli

# On Ubuntu/Debian
sudo apt install awscli

# On Windows
# Download from: https://aws.amazon.com/cli/
```

### 2. Configure AWS Profile

```bash
# Configure default profile
aws configure

# Or configure a named profile
aws configure --profile my-production-account
```

You'll be prompted for:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key  
- **Default region name**: e.g., `us-east-1`, `us-west-2`
- **Default output format**: `json` (recommended)

### 3. Verify Profile Setup

```bash
# List configured profiles
aws configure list-profiles

# Test profile access
aws sts get-caller-identity --profile my-production-account
```

## Using Profiles with the Dashboard

### Method 1: Set AWS_PROFILE Environment Variable

```bash
# For a single session
export AWS_PROFILE=my-production-account
npm run dev

# Or run in one command
AWS_PROFILE=my-production-account npm run dev
```

### Method 2: Set Region Only

```bash
# Use default profile with specific region
export AWS_REGION=us-west-2
npm run dev
```

### Method 3: Use Environment Variables

```bash
# Set credentials directly (less secure for local development)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
npm run dev
```

## Environment Variable Reference

The dashboard checks for these environment variables (in order of precedence):

1. `AWS_PROFILE` - Named profile to use
2. `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` - Direct credentials
3. `AWS_REGION` or `AWS_DEFAULT_REGION` - AWS region

## Dashboard Modes

### 🧪 Mock Mode (Default)
- **When**: No AWS credentials detected
- **Features**: 
  - Static mock data
  - Disabled action buttons
  - Yellow status indicator
  - "(Mock)" labels on components

### 🔗 Real AWS Mode 
- **When**: Valid AWS credentials found
- **Features**:
  - Live AWS API data
  - Functional action buttons
  - Green status indicator
  - Real account info and EC2 statistics

## Visual Indicators

The dashboard header shows your current mode:

- 🟡 **Mock Mode**: "Mock (Set AWS_PROFILE for real data)"
- 🟢 **Real AWS**: "Real AWS Profile: profile-name Region: us-east-1"

## Testing the Integration

### 1. Start in Mock Mode
```bash
# Clear any AWS environment variables
unset AWS_PROFILE AWS_REGION AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
npm run dev
```
You should see mock data with yellow status indicator.

### 2. Switch to Real AWS Mode
```bash
# Set your AWS profile
export AWS_PROFILE=your-profile-name
npm run dev
```
The dashboard will refresh and show real AWS data with green status indicator.

## Supported AWS Services

Currently integrated:
- **STS (Security Token Service)**: Account identity information
- **EC2**: Instance statistics and management

## Security Best Practices

### For Development
✅ **Use AWS profiles** (`aws configure --profile name`)
✅ **Use environment variables for testing**
✅ **Never commit credentials to code**

### For Production
✅ **Use IAM roles** when deploying to AWS
✅ **Use AWS IAM Identity Center** for federated access
✅ **Follow principle of least privilege**

## Required IAM Permissions

Your AWS user/role needs these minimum permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity",
        "ec2:DescribeInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **"AWS is not defined" errors**
   - Install AWS SDK: `npm install @aws-sdk/client-ec2 @aws-sdk/client-sts`

2. **Credential errors in browser**
   - AWS credentials work in Node.js server-side only
   - Dashboard fetches data through API routes

3. **Permission denied errors**
   - Check IAM permissions for your user/role
   - Verify profile is active: `aws sts get-caller-identity`

4. **Wrong region data**
   - Set correct region: `export AWS_REGION=us-east-1`
   - Or configure in profile: `aws configure --profile name`

### Debug Mode

Enable detailed AWS SDK logging:

```bash
export AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=true
export DEBUG=aws-sdk*
npm run dev
```

## Example Configurations

### Personal Development Account
```bash
aws configure --profile personal
export AWS_PROFILE=personal
npm run dev
```

### Company Production Account  
```bash
aws configure --profile company-prod
export AWS_PROFILE=company-prod
export AWS_REGION=us-west-2
npm run dev
```

### Multi-Account Setup
```bash
# Configure multiple profiles
aws configure --profile dev-account
aws configure --profile staging-account  
aws configure --profile prod-account

# Switch between them
export AWS_PROFILE=dev-account      # Development
export AWS_PROFILE=staging-account  # Staging
export AWS_PROFILE=prod-account     # Production
```

Your dashboard will automatically adapt to show data from the selected AWS account!
