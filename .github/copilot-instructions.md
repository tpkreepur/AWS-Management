# AWS Management Tools

AWS Management is a Python-based toolkit for managing AWS EC2 resources including instances, volumes, and snapshots. The toolkit generates comprehensive reports and provides automation scripts for EC2 management tasks.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install Python dependencies:
  - `pip install -r requirements.txt` -- takes ~1 second if already installed, ~30 seconds fresh install. NEVER CANCEL.
- Configure AWS credentials (REQUIRED for functionality):
  - Set environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`
  - For snapshots functionality, also set: `AWS_ACCOUNT_ID`
  - Create `.env` file with credentials if using python-dotenv
- Validate setup:
  - `python3 -m py_compile ec2/*.py tasks/*.py` -- compiles all Python files (~0.04 seconds)
  - `python3 -m black --check .` -- validates code formatting (~0.15 seconds)

### Building and Testing
- Format code: `python3 -m black .` -- applies code formatting (~0.13 seconds)
- No formal test suite exists - validation is done through AWS API interaction
- CRITICAL: All functionality requires valid AWS credentials and network access to AWS APIs
- Without AWS credentials, modules will fail with NoRegionError or EndpointConnectionError
- NEVER CANCEL: AWS API operations can take 30+ seconds depending on AWS resource count and network latency

### Running the Application
- Navigate to appropriate directory before running:
  - Main reports: `cd ec2 && python3 manage.py` -- generates comprehensive AWS report
  - Individual modules: `cd ec2 && python3 instances.py` or `python3 volumes.py` or `python3 snapshots.py`
  - Tasks: `cd tasks && python3 get_volume_backup_status.py`
- CRITICAL: Application makes live AWS API calls and will fail without proper AWS credentials
- NEVER CANCEL: AWS API operations can take 30+ seconds depending on resource count

## Validation

### Manual Validation Steps
- ALWAYS validate AWS credentials are properly configured before running any scripts
- Test module imports: `cd ec2 && python3 -c "import instances; import volumes; import snapshots; import manage"`
- Run formatting check before committing: `python3 -m black --check .`
- ALWAYS validate that environment variables are set: `echo $AWS_ACCESS_KEY_ID $AWS_DEFAULT_REGION`
- Test without AWS credentials to see expected error: modules will show NoRegionError or EndpointConnectionError

### Key Workflows to Test
- Generate EC2 report: `cd ec2 && AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx AWS_DEFAULT_REGION=us-east-1 python3 manage.py`
- Check volume backup status: `cd tasks && python3 get_volume_backup_status.py`  
- Install SSM agent on instances using provided scripts in `scripts/ssm-agent-install/`
- Test script syntax: `bash -n scripts/ssm-agent-install/debian-ssm-install.sh`

### Expected Outputs
- Main report generates `report.md` with EC2 instance, volume, and snapshot information
- Individual modules can export data to CSV files
- All operations write detailed information to stdout

## Common Tasks

### Repository Structure
```
.
├── README.md
├── requirements.txt
├── .gitignore
├── .vscode/settings.json
├── ec2/
│   ├── __init__.py
│   ├── instances.py      # EC2 instance management
│   ├── volumes.py        # EBS volume management  
│   ├── snapshots.py      # EBS snapshot management
│   └── manage.py         # Main report generator
├── scripts/
│   └── ssm-agent-install/
│       ├── debian-ssm-install.sh
│       ├── redhat-ssm-install.sh
│       └── windows-ssm-install.ps1
├── tasks/
│   └── get_volume_backup_status.py
└── template-report.md
```

### Key Python Modules

#### ec2/instances.py
- Class: `EC2Instances`
- Key methods: `get_total_instance_count()`, `get_platform_counts()`, `describe_running_windows_instances()`, `describe_running_linux_instances()`
- Requires AWS credentials for instantiation

#### ec2/volumes.py  
- Class: `EC2Volumes`
- Key methods: `get_total_volume_count()`, `get_total_volume_size()`, `get_attached_volumes()`, `get_unattached_volumes()`
- Requires AWS credentials for instantiation

#### ec2/snapshots.py
- Class: `EC2Snapshots` 
- Key methods: `get_total_snapshot_count()`, `get_snapshot_count_by_volume_id()`
- Requires AWS credentials AND AWS_ACCOUNT_ID environment variable

#### ec2/manage.py
- Class: `EC2Manager` - orchestrates all EC2 operations
- Function: `print_report()` - generates comprehensive markdown report
- Main entry point for the application

### Environment Configuration

Create `.env` file with:
```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
```

### SSM Agent Installation Scripts

Located in `scripts/ssm-agent-install/`:
- `debian-ssm-install.sh` - For Debian/Ubuntu systems
- `redhat-ssm-install.sh` - For RHEL/CentOS/Amazon Linux
- `windows-ssm-install.ps1` - For Windows systems

All scripts download and install the latest SSM agent from AWS S3.

### Error Handling and Troubleshooting

Common errors:
- `NoRegionError` - Set AWS_DEFAULT_REGION environment variable
- `EndpointConnectionError` - Check AWS credentials and network connectivity  
- `ModuleNotFoundError: volumes` - Run from ec2/ directory or adjust Python path
- Missing dependencies - Run `pip install -r requirements.txt`

### Development Guidelines

- ALWAYS run from the appropriate subdirectory (ec2/ for main modules)
- ALWAYS validate AWS credentials before running any AWS-dependent code
- Use `python3 -m black .` for code formatting
- No unit tests exist - validation is through actual AWS API interaction
- All modules make immediate AWS API calls upon instantiation
- Report generation creates files in the current working directory

### Critical Notes

- ⚠️ NEVER CANCEL AWS operations - they may take 30+ seconds to complete
- ⚠️ All functionality requires valid AWS credentials and permissions
- ⚠️ Application makes live AWS API calls and can incur AWS charges
- ⚠️ No mock/test mode available - all operations are against live AWS resources
- ⚠️ Run scripts from appropriate directories to avoid import errors
- ⚠️ Generated reports contain sensitive AWS resource information
