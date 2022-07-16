from distutils.debug import DEBUG
from unicodedata import name
import boto3
import sys
import json


class EC2Instances:
    def __init__(self):
        """
        Initialize EC2Instances class
        """

        self.client = boto3.client("ec2")
        self.resource = boto3.resource("ec2")
        self.instances = [instance for instance in self.resource.instances.all()]

    def print_raw_response_to_json(self) -> None:
        """
        Print the raw response from the describe_instances() function
        """
        print("Printing raw response to a JSON file")
        response = self.client.describe_instances()
        response_json = json.dumps(response, indent=4, sort_keys=True, default=str)
        with open("ec2_instances.json", "w") as f:
            f.write(response_json)
        print("JSON file created")

    def get_total_windows_instances(self) -> int:
        """
        Total number of EC2 instances that are running on Windows
        """

        win = self.client.describe_instances(
            Filters=[{"Name": "platform", "Values": ["windows"]}]
        )
        print(
            "Total number of EC2 instances that are running on Windows: ",
            len(win["Reservations"]),
        )
        return len(win["Reservations"])

    def get_total_linux_instances(self) -> int:
        """
        Total number of EC2 instances that are running on Linux
        """
        linuxCount = 0
        for instance in self.instances:
            """If platform in not windows, print instance details"""
            if instance.platform != "windows":
                linuxCount += 1
                print(instance.platform, instance.instance_id)

        print("Total number of EC2 instances that are running on Linux: ", linuxCount)

    def get_instances(self) -> list:
        """
        Get all EC2 instances and return the results.
        """
        instances = []
        for i in self.instances:
            instances.append(i)
        return instances

    def get_total_instances(self) -> int:
        """
        Total number of EC2 instances
        """
        print("Total number of EC2 instances: ", len(self.instances))
        return len(self.instances)

    def get_total_running_instances(self) -> int:
        """
        Total number of EC2 instances that are running
        """

        running_instances = self.client.describe_instances(
            Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
        )

        return len(running_instances["Reservations"])

    def get_total_stopped_instances(self) -> int:
        """
        Total number of EC2 instances that are stopped
        """

        stopped_instances = self.client.describe_instances(
            Filters=[{"Name": "instance-state-name", "Values": ["stopped"]}]
        )
        return len(stopped_instances["Reservations"])

    def describe_all_instances(self) -> list:
        """Describe all EC2 instances and return the results."""

        instances = self.client.describe_instances()

        return instances["Reservations"]

    def describe_running_instances(self) -> list:
        """Describe all EC2 instances that are running and return the Name tag value, instance id, private ip address, state, instance type, and platform."""

        instances = self.client.describe_instances(
            Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
        )
        instance_list = []
        for reservation in instances["Reservations"]:
            for instance in reservation["Instances"]:
                instance_list.append(
                    {
                        "Name": instance["Tags"][0]["Value"],
                        "Instance ID": instance["InstanceId"],
                        "Private IP": instance["PrivateIpAddress"],
                        "State": instance["State"]["Name"],
                        "Instance Type": instance["InstanceType"],
                        "Platform Details": instance["PlatformDetails"],
                    }
                )

        return instance_list

    def describe_stopped_instances(self) -> list:
        """
        Describe all EC2 instances that are stoppped and return the Name tag value, instance id, private ip address, state, instance type, and platform.

        """

        instances = self.client.describe_instances(
            Filters=[{"Name": "instance-state-name", "Values": ["stopped"]}]
        )
        instance_list = []
        for reservation in instances["Reservations"]:
            for instance in reservation["Instances"]:
                instance_list.append(
                    {
                        "Name": instance["Tags"][0]["Value"],
                        "Instance ID": instance["InstanceId"],
                        "Private IP": instance["PrivateIpAddress"],
                        "State": instance["State"]["Name"],
                        "Instance Type": instance["InstanceType"],
                        "Platform Details": instance["PlatformDetails"],
                    }
                )

        return instance_list

    def print_ec2_instances_info(self) -> None:
        """
        Print all EC2 instances to the console
        """

        response = self.client.describe_instances()

        instances = response["Reservations"]
        print("*******************************************************")
        print("Total EC2 instances:", len(instances))
        for reservation in instances:
            print("-------------------------------------------------")
            for instance in reservation["Instances"]:
                print(
                    "|\tName:",
                    instance["Tags"][0]["Value"],
                    "\n|\tInstance ID:",
                    instance["InstanceId"],
                    "\n|\tPrivate IP:",
                    instance["PrivateIpAddress"],
                    "\n|\tState:",
                    instance["State"]["Name"],
                    "\n|\tInstance Type:",
                    instance["InstanceType"],
                    "\n|\tPlatform Details:",
                    instance["PlatformDetails"],
                    "\n|\tVolume Details:",
                    "\n|\t\tTotal Attached Volumes:",
                    len(instance["BlockDeviceMappings"]),
                )

                for volume in instance["BlockDeviceMappings"]:
                    print(
                        "|\t\t\t- Volume ID:",
                        volume["Ebs"]["VolumeId"],
                        "\n|\t\t\t- Device Name:",
                        volume["DeviceName"],
                    )
                print("-------------------------------------------------"),
        print("*******************************************************")

    def print_ec2_instances_to_csv(self) -> None:
        """
        Print all EC2 instances to a CSV file
        """

        response = self.client.describe_instances()

        instances = response["Reservations"]
        with open("ec2_instances.csv", "w") as f:
            f.write(
                "Name,Instance ID,Private IP,State,Instance Type,Platform Details,Volume Details,Total Attached Volumes\n"
            )
            for reservation in instances:
                for instance in reservation["Instances"]:
                    f.write(
                        "{},{},{},{},{},{},{},{}\n".format(
                            instance["Tags"][0]["Value"],
                            instance["InstanceId"],
                            instance["PrivateIpAddress"],
                            instance["State"]["Name"],
                            instance["InstanceType"],
                            instance["PlatformDetails"],
                            instance["BlockDeviceMappings"],
                            len(instance["BlockDeviceMappings"]),
                        )
                    )

    def describe_instances(self) -> list:
        """
        Describe all EC2 instances and return the results.
        """
        instanceList = []
        for instance in self.resource.instances.all():
            for tag in instance.tags:
                if tag["Key"] == "Name":
                    print(tag["Value"])
                    name = tag["Value"]
            i = {
                "Name": name,
                "ID": instance.id,
                "Private IP": instance.private_ip_address,
                "State": instance.state,
                "Instance Type": instance.instance_type,
                "Platform Details": instance.platform,
                "Volume Details": instance.block_device_mappings,
            }
        instanceList.append(i)
        return instanceList


def test_print_functions():
    EC2 = EC2Instances()
    EC2.describe_instances()


def main():

    EC2 = EC2Instances()

    print(
        "=========================================================================================="
    )
    print("Describe all EC2 instances:")
    print("|-------------------------------------------------")
    for instance in EC2.describe_all_instances():

        print("|\tName:", instance["Instances"][0]["Tags"][0]["Value"])
        print("|\tInstance ID:", instance["Instances"][0]["InstanceId"])
        print("|\tLaunch Time:", instance["Instances"][0]["LaunchTime"])
        print("|\tPlatform:", instance["Instances"][0]["PlatformDetails"])
        print("|\tState:", instance["Instances"][0]["State"]["Name"])
        print("|Volumes:", len(instance["Instances"][0]["BlockDeviceMappings"]))
        for volume in instance["Instances"][0]["BlockDeviceMappings"]:
            print("|\t\tVolume ID:", volume["Ebs"]["VolumeId"])
            print("|\t\tVolume Status:", volume["Ebs"]["Status"])
            print("|\t\tVolume Attachment Status:", volume["Ebs"]["AttachTime"])
            print("|\t\tVolume Device Name:", volume["DeviceName"])
            print("|\t\t-----")
        print(
            "|\tNetwork Interfaces:", len(instance["Instances"][0]["NetworkInterfaces"])
        )
        for privateIPAddress in instance["Instances"][0]["NetworkInterfaces"]:
            print("|\t\tPrivate IP:", privateIPAddress["PrivateIpAddress"])
        print("|-------------------------------------------------")
    print(
        "=========================================================================================="
    )
    print(
        "=========================================================================================="
    )
    print("Runnning EC2 instances:")
    print("-----------------------")
    for instance in EC2.describe_running_instances():
        print("\tName:", instance["Name"])
        print("\tInstance ID:", instance["Instance ID"])
        print("\tPrivate IP:", instance["Private IP"])
        print("\tState:", instance["State"])
        print("\tInstance Type:", instance["Instance Type"])
        print("\tPlatform:", instance["Platform Details"])
        print("-----------------------")
    print(
        "=========================================================================================="
    )

    print(
        "=========================================================================================="
    )
    print("Stopped EC2 instances:")
    print("-----------------------")
    for instance in EC2.describe_stopped_instances():
        print("\tName:", instance["Name"])
        print("\tInstance ID:", instance["Instance ID"])
        print("\tPrivate IP:", instance["Private IP"])
        print("\tState:", instance["State"])
        print("\tInstance Type:", instance["Instance Type"])
        print("\tPlatform:", instance["Platform Details"])
        print("-----------------------")
    print(
        "=========================================================================================="
    )
    print("Total EC2 instances:", EC2.total_instances())
    print("Total EC2 instances running:", EC2.total_running_instances())
    print("Total EC2 instances stopped:", EC2.total_stopped_instances())


def test_main():
    """
    Test the main function
    """
    EC2 = EC2Instances()
    EC2.describe_instances()


if __name__ == "__main__":
    test_main()
