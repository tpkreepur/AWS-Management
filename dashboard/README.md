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
- Account ID (currently static example)
- AWS Region
- Account Type
- Organization Unit
- Billing Contact
- Account Status

### EC2Overview
Shows EC2 instance statistics from the parent project's data:
- Total instances: 81
- Running instances: 42
- Stopped instances: 39
- Windows instances: 53
- Linux instances: 28

### QuickActions
Provides quick access buttons for common AWS management tasks:
- Launch Instance
- View Snapshots
- Volume Management
- Backup Status
- Cost Analysis
- Security Groups

## Future Enhancements

- Connect to real AWS APIs for live data
- Add authentication and user management
- Implement actual action handlers for Quick Actions
- Add more AWS service overviews (VPC, RDS, S3)
- Include cost monitoring and alerts
- Add instance filtering and search capabilities

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
