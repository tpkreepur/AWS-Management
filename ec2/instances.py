from re import I
import boto3
import sys
import json


class EC2Instances:
    def __init__(self):
        """
        Initialize EC2Instances class
        """

        self.ec2 = boto3.resource("ec2")

    def print_raw_response_to_json(self) -> None:
        """
        Print the raw response from the describe_instances() function
        """
        print("Printing raw response to a JSON file")
        response = self.ec2.describe_instances()
        response_json = json.dumps(response, indent=4, sort_keys=True, default=str)
        with open("ec2_instances.json", "w") as f:
            f.write(response_json)
        print("JSON file created")

    def get_platform_counts(self) -> dict:
        """If platform detail is windows, add to windows counter"""
        windows = 0
        for i in self.get_all_platform_details():
            if i == "Windows":
                windows += 1
        """If platform detail string contains any variant of linux, debian, or amazon, add to linux counter"""
        linux = 0
        for i in self.get_all_platform_details():
            if "linux" in i.lower() or "debian" in i.lower() or "amazon" in i.lower():
                linux += 1
        platformCounts = {"Windows": windows, "Linux": linux}
        return platformCounts

    def get_instances(self) -> list:
        """
        Get all EC2 instances and return the results.
        """
        return self.ec2.instances.all()

    def get_instance_ids(self) -> list:
        """
        Get all EC2 instance IDs and return the results.
        """
        instanceIds = []
        for instance in self.ec2.instances.all():
            instanceIds.append(instance.id)
        return instanceIds

    def get_instance_name_by_id(self, instanceId: str) -> str:
        """
        Get the name of an EC2 instance by ID
        """
        for instance in self.ec2.instances.all():
            if instance.id == instanceId:
                for tag in instance.tags:
                    if tag["Key"] == "Name":
                        return tag["Value"]

    def get_total_instance_count(self) -> int:
        """
        Total number of EC2 instances
        """
        instances = [instance for instance in self.ec2.instances.all()]

        return len(instances)

    def get_total_running_instances(self) -> str:
        """
        Total number of EC2 instances that are running
        """
        running = self.ec2.instances.filter(
            Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
        )
        list = [instance for instance in running]

        return str(len(list))

    def get_total_stopped_instances(self) -> str:
        """
        Total number of EC2 instances that are stopped
        """

        stopped_instances = self.ec2.instances.filter(
            Filters=[{"Name": "instance-state-name", "Values": ["stopped"]}]
        )
        list = [instance for instance in stopped_instances]
        return str(len(list))

    def get_instances_object(self):
        """
        Get all EC2 instances and return the results.
        """
        return self.ec2.instances.all()

    def get_all_platform_details(self) -> list:
        """
        Get all EC2 instances and return the results.
        """
        platformDetails = []
        for instance in self.ec2.instances.all():
            platformDetails.append(instance.platform_details)
        return platformDetails

    def print_ec2_instances_to_csv(self) -> None:
        """
        Print all EC2 instances to a CSV file
        """
        print("Printing EC2 instances to a csv file")
        instanceList = self.describe_instances()
        with open("ec2_instances.csv", "w") as f:
            f.write(
                "Name,ID,Private IP,State,Instance Type,Platform Details,Volume Details\n"
            )
            for i in instanceList:
                f.write(
                    f"{i['Name']},{i['ID']},{i['Private IP']},{i['State']},{i['Instance Type']},{i['Platform Details']},{i['Volume Details']}\n"
                )

    def describe_instances(self) -> list:
        """
        Describe all EC2 instances and return the results.
        """
        instanceList = []
        for instance in self.ec2.instances.all():
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

    def describe_running_windows_instances(self) -> list:
        """
        Describe all EC2 instances that are running and return the results.
        """
        instanceList = []
        for instance in self.ec2.instances.all():
            if instance.state["Name"] == "running":
                if instance.platform_details == "Windows":
                    for tag in instance.tags:
                        if tag["Key"] == "Name":
                            name = tag["Value"]
                    if instance.state["Name"] == "running":
                        state = instance.state["Name"]
                    i = {
                        "Name": name,
                        "ID": instance.id,
                        "Private IP": instance.private_ip_address,
                        "State": state,
                        "Instance Type": instance.instance_type,
                        "Platform Details": instance.platform_details,
                        "Volume Details": instance.block_device_mappings,
                    }
                    instanceList.append(i)
        return instanceList

    def describe_running_linux_instances(self) -> list:
        """
        Describe all EC2 instances that are running and return the results.
        """
        instanceList = []
        for instance in self.ec2.instances.all():
            if instance.state["Name"] == "running":
                if (
                    "linux" in instance.platform_details.lower()
                    or "debian" in instance.platform_details.lower()
                    or "amazon" in instance.platform_details.lower()
                ):
                    for tag in instance.tags:
                        if tag["Key"] == "Name":
                            name = tag["Value"]
                    if instance.state["Name"] == "running":
                        state = instance.state["Name"]
                    i = {
                        "Name": name,
                        "ID": instance.id,
                        "Private IP": instance.private_ip_address,
                        "State": state,
                        "Instance Type": instance.instance_type,
                        "Platform Details": instance.platform_details,
                        "Volume Details": instance.block_device_mappings,
                    }
                    instanceList.append(i)
        return instanceList

    def describe_stopped_instances(self) -> list:
        """
        Describe all EC2 instances that are stopped and return the results.
        """
        instanceList = []
        for instance in self.ec2.instances.all():
            if instance.state["Name"] == "stopped":
                for tag in instance.tags:
                    if tag["Key"] == "Name":
                        name = tag["Value"]
                if instance.state["Name"] == "stopped":
                    state = instance.state["Name"]
                i = {
                    "Name": name,
                    "ID": instance.id,
                    "Private IP": instance.private_ip_address,
                    "State": state,
                    "Instance Type": instance.instance_type,
                    "Platform Details": instance.platform,
                    "Volume Details": instance.block_device_mappings,
                }
                instanceList.append(i)
        return instanceList

    def report(self) -> list:

        REPORT_DETAILS = []
        TOTAL_INSTANCE_COUNT = self.get_total_instance_count()
        print("TOTAL_INSTANCE_COUNT:", self.get_total_instance_count())
        INSTANCES = []
        for i in self.get_instances_object():
            print("INSTANCE_ID:", i.id)
            ID = i.id
            for tag in i.tags:
                if tag["Key"] == "Name":
                    print("NAME:", tag["Value"])
                    NAME = tag["Value"]
            print("INSTANCE_TYPE:", i.instance_type)
            TYPE = i.instance_type
            print("ARCHITECTURE:", i.architecture)
            ARCH = i.architecture
            print("PLATFORM_DETAILS:", i.platform_details)
            PLATFORM = i.platform_details
            print("PRIVATE_IP:", i.private_ip_address)
            PRIVATE_IP = i.private_ip_address
            if i.public_ip_address:
                print("PUBLIC_IP:", i.public_ip_address)
                PUBLIC_IP = i.public_ip_address
            else:
                print("PUBLIC_IP:", "None")
                PUBLIC_IP = "N/A"
            print("STATE:", i.state["Name"])
            STATE = i.state
            print("VOLUMES:", f"{len([volume for volume in i.volumes.all()])}")
            iVolumes = []
            for volume in i.volumes.all():
                print("\t-VOLUME_ID:", volume.id)
                VOLUME_ID = volume.id
                print("\t-VOLUME_SIZE:", volume.size)
                VOLUME_SIZE = volume.size
                for tag in volume.tags:
                    if tag["Key"] == "Name":
                        print("\t-VOLUME_NAME:", tag["Value"])
                        VOLUME_NAME = tag["Value"]
                iVolumes.append(
                    {
                        "Volume ID": VOLUME_ID,
                        "Volume Size": VOLUME_SIZE,
                        "Volume Name": VOLUME_NAME,
                    }
                )
            INSTANCES.append(
                {
                    "ID": ID,
                    "Name": NAME,
                    "Instance Type": TYPE,
                    "Architecture": ARCH,
                    "Platform Details": PLATFORM,
                    "Private IP": PRIVATE_IP,
                    "Public IP": PUBLIC_IP,
                    "State": STATE,
                    "Volumes": iVolumes,
                }
            )
        REPORT_DETAILS.append({"total": TOTAL_INSTANCE_COUNT, "instances": INSTANCES})
        return REPORT_DETAILS


def main():
    """
    Main function
    """
    ec2 = EC2Instances()
    win = ec2.get_platform_counts()
    print(win)


if __name__ == "__main__":
    main()
