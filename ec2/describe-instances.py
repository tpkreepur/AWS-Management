"""
describe-instances.py

Describe EC2 instances
Functions:
    EC2 Instances:
        total_instances()
        total_running_instances()
        total_stopped_instances()
        describe_instances()
        describe_running_instances()
        describe_stopped_instances()
        describe_all_instances()
        describe_instances_by_region()
        describe_instances_by_tag()
        describe_instances_by_tag_value()
    EC2 Volumes:
        total_volumes()
        total_volumes_in_use()
        total_volumes_available()
        describe_volumes()
        describe_volumes_by_size()
        describes_volumes_by_attachment()
        describe_volumes_by_region()
        describe_volumes_by_tag()
    EC2 Snapshots:
        total_snapshots()
        total_snapshots_by_instance()
        total_snapshots_by_volume()
        describe_snapshots()
        describe_snapshots_by_instance()
        describe_snapshots_by_size()
        describe_snapshots_by_region()
        describe_snapshots_by_tag()
        describe_snapshots_older_than()
"""
import boto3
import sys


def total_instances():
    """
    Total number of EC2 instances
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.all()
    return len(instances)


def total_running_instances():
    """
    Total number of EC2 instances that are running
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.filter(
        Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
    )
    return len(instances)


def total_stopped_instances():
    """
    Total number of EC2 instances that are stopped
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.filter(
        Filters=[{"Name": "instance-state-name", "Values": ["stopped"]}]
    )
    return len(instances)


def describe_instances():
    """
    Describe all EC2 instances
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.all()
    for instance in instances:
        print(instance.id, instance.instance_type, instance.state, instance.placement)


def describe_running_instances():
    """
    Describe all EC2 instances that are running
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.filter(
        Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
    )
    for instance in instances:
        print(instance.id, instance.instance_type, instance.state, instance.placement)


def describe_stopped_instances():
    """
    Describe all EC2 instances that are stopped
    """

    ec2 = boto3.resource("ec2")
    instances = ec2.instances.filter(
        Filters=[{"Name": "instance-state-name", "Values": ["stopped"]}]
    )
    for instance in instances:
        print(instance.id, instance.instance_type, instance.state, instance.placement)


def main():
    instanceCount = total_instances()
    print("Total EC2 instances:", instanceCount)


if __name__ == "__main__":
    main()
