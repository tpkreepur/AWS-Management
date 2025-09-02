# AWS Account Dashboard

A modern Next.js dashboard for managing AWS account information and resources.

## Features

- **Account Information Display**: Shows key account details including Account ID, Region, Account Type, Organization Unit, Billing Contact, and Status
- **EC2 Instance Overview**: Displays real-time statistics about EC2 instances with visual progress bars
- **Quick Actions**: Easy access buttons for common AWS management tasks
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Modern UI**: Built with TailwindCSS for a clean, professional interface

## Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Linting**: ESLint with Next.js configuration

## Getting Started

1. Navigate to the dashboard directory:

   ```bash
   cd dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dashboard Components

### AccountInfoCard

Displays static account information including:

- Account ID
- AWS Region
- Billing Contact
- Account Status

### EC2Overview

Shows EC2 instance statistics from the parent project's data:

- Total instances
- Running instances
- Stopped instances
- Windows instances
- Linux instances

### QuickActions

Provides quick access buttons for common AWS management tasks:

- View Snapshots


## Deployment

### Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- AWS CLI configured (for real AWS data)
- Valid AWS credentials (optional, app works with mock data)

### Environment Setup

#### For Mock Data (No AWS Required)
The app works out of the box with mock data - no additional setup needed.

#### For Real AWS Data
Set up AWS credentials using one of these methods:

1. **AWS Profile (Recommended)**:
   ```bash
   aws configure --profile your-profile-name
   export AWS_PROFILE=your-profile-name
   ```

2. **Environment Variables**:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=us-east-1
   ```

3. **EC2 Instance Role**: If deploying on EC2, attach an IAM role with necessary permissions.

### Required AWS Permissions

For real AWS data, the application needs these IAM permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus",
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}
```

### Local Deployment

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd AWS-Management/dashboard
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

### Cloud Deployment Options

#### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** (for real AWS data):
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
   - Or use `AWS_PROFILE` if using Vercel's AWS integration

#### Option 2: Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t aws-dashboard .
   docker run -p 3000:3000 \
     -e AWS_ACCESS_KEY_ID=your_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret \
     -e AWS_REGION=us-east-1 \
     aws-dashboard
   ```

#### Option 3: AWS EC2 Deployment

1. **Launch EC2 Instance** with appropriate security groups (port 3000)

2. **Install Dependencies**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Deploy Application**:
   ```bash
   git clone <repository-url>
   cd AWS-Management/dashboard
   npm install
   npm run build
   ```

4. **Set up Process Manager**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "aws-dashboard" -- start
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx** (optional, for custom domain):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Option 4: AWS Amplify

1. **Connect Repository** to AWS Amplify console
2. **Build Settings** (auto-detected for Next.js)
3. **Environment Variables**: Add AWS credentials if needed
4. **Deploy**: Automatic deployment on git push

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_PROFILE` | AWS profile name to use | No |
| `AWS_ACCESS_KEY_ID` | AWS access key | No* |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | No* |
| `AWS_REGION` | AWS region (default: us-east-1) | No |
| `AWS_DEFAULT_REGION` | Alternative to AWS_REGION | No |

*Required only for real AWS data integration

### Troubleshooting Deployment

**Build Fails**: 
- Ensure Node.js version is 18+
- Check TypeScript/ESLint errors: `npm run lint`
- Fix any compilation errors before deploying

**AWS Connection Issues**:
- Verify AWS credentials: `aws sts get-caller-identity`
- Check IAM permissions
- Confirm region availability

**Performance Issues**:
- Enable caching in production
- Consider using AWS CloudFront for static assets
- Monitor AWS API rate limits

### Security Considerations

- Never commit AWS credentials to version control
- Use environment variables or AWS IAM roles
- Implement proper CORS settings for production
- Consider VPC deployment for sensitive environments
- Regularly rotate AWS access keys

## Future Enhancements

- Connect to real AWS APIs for live data
- Add authentication and user management
- Implement actual action handlers for Quick Actions
- Add more AWS service overviews (VPC, RDS, S3)
- Include cost monitoring and alerts
- Add instance filtering and search capabilities
