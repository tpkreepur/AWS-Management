# Install the latest version of SSM Agent
# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ssm-agent.html
# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ssm-agent.html#amazon-ssm-agent-install-prerequisites

#Download the latest version of the SSM Agent to current user's desktop
$progressPreference = 'silentlyContinue'
Invoke-WebRequest `
    https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/windows_amd64/AmazonSSMAgentSetup.exe `
    -OutFile $env:USERPROFILE\Desktop\SSMAgent_latest.exe

Start-Process `
-FilePath $env:USERPROFILE\Desktop\SSMAgent_latest.exe `
-ArgumentList "/S"

Remove-Item -Force $env:USERPROFILE\Desktop\SSMAgent_latest.exe

Restart-Service AmazonSSMAgent