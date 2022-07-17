from distutils.log import INFO
from instances import EC2Instances
from snapshots import EC2Snapshots
from volumes import EC2Volumes
from datetime import datetime

"""
TODO:
List volume count per instance
List snapshot count per volume

"""


class EC2Manager:
    def __init__(self):
        self.instances = EC2Instances()
        self.volumes = EC2Volumes()
        self.snapshots = EC2Snapshots()

    def get_total_instance_count(self) -> int:
        """Returns the total number of instances"""
        return self.instances.get_total_instance_count()

    def get_total_volume_count(self) -> int:
        """Returns the total number of volumes"""
        return self.volumes.get_total_volume_count()

    def get_total_volume_size(self):
        """Returns the total volume size"""
        return self.volumes.get_total_volume_size()

    def get_attached_volumes(self):
        """Returns a list of volumes that are attached to an instance"""
        return self.volumes.get_attached_volumes()

    def get_unattached_volumes(self):
        """Returns a list of unattached volumes"""
        return self.volumes.get_unattached_volumes()

    def get_attached_volume_count(self):
        """Returns the total number of volumes that are attached to an instance"""
        return len(self.volumes.get_attached_volumes())

    def get_unattached_volume_count(self):
        """Returns the total number of unattached volumes"""
        if self.volumes.get_unattached_volumes() != None:
            return len(self.volumes.get_unattached_volumes())
        else:
            return "No unattached volumes"

    def get_total_snapshot_count(self):
        """Returns the total number of snapshots"""
        return self.snapshots.get_total_snapshot_count()

    def get_total_running_windows_instances(self):
        """Returns the total number of windows instances"""
        print("Windows Instances: " + str(self.instances.get_total_windows_instances()))
        return self.instances.get_total_windows_instances()

    def get_total_running_linux_instances(self):
        """Returns the total number of linux instances"""
        return self.instances.get_total_linux_instances()

    def get_volume_ids(self):
        """Returns a list of volume IDs"""
        return self.volumes.get_volume_ids()

    def describe_instances(self):
        """Describes all instances"""
        for instance in self.instances:
            print("-Instance Name: " + instance.tags[0].get("Value"))
            print("|\tID: " + instance.id)
            print("|\tType: " + instance.instance_type)
            print("|\tState: " + instance.state.get("Name"))
            print("|\tPublic DNS: " + str(instance.public_dns_name))
            print("|\tPublic IP: " + instance.public_ip_address)
            print("|\tPrivate DNS: " + instance.private_dns_name)
            print("|\tPrivate IP: " + instance.private_ip_address)
            print("|\tLaunch Time: " + str(instance.launch_time))
            print("|\tPlacement: " + instance.placement.get("AvailabilityZone"))
            print("|\tVPC ID: " + instance.vpc_id)
            print("|\tSubnet ID: " + instance.subnet_id)

    def describe_volumes(self):
        """Describes all volumes"""
        for volume in self.volumes:
            print("-Volume Name: " + volume.tags[0].get("Value"))
            print("|\tID: " + volume.id)
            print("|\tSize: " + str(volume.size) + "GB")
            print("|\tState: " + volume.state)
            print("|\tType: " + volume.volume_type)
            print("|\tIops: " + str(volume.iops))
            print("|\tEncrypted: " + str(volume.encrypted))
            print("|\tAttachments:")
            for attachment in volume.attachments:
                print("|\t\t- Instance: " + attachment.get("InstanceId"))
            print("|\tAvailability Zone: " + volume.availability_zone)
            print("|\tTags: " + str(volume.tags))

    def describe_snapshots(self):
        """Describes all snapshots"""
        for snapshot in self.snapshots:
            print("-Snapshot Name: " + snapshot.get("Tags")[0].get("Value"))
            print("|\tID: " + snapshot.get("SnapshotId"))
            print("|\tVolume ID: " + snapshot.get("VolumeId"))
            print("|\tState: " + snapshot.get("State"))
            print("|\tStart Time: " + str(snapshot.get("StartTime")))
            print("|\tProgress: " + snapshot.get("Progress"))
            print("|\tVolume Size: " + str(snapshot.get("VolumeSize")) + "GB")
            print("|\tDescription: " + snapshot.get("Description"))
            print("|\tOwner ID: " + snapshot.get("OwnerId"))
            print("|\tTags: " + str(snapshot.get("Tags")))

    def list_snapshot_count_by_volume(self, volume_id):
        """Lists snapshots by volume ID"""
        volumeIDs = self.volumes.get_volume_ids()

        for id in volumeIDs:
            print("-Volume ID: " + id)
            [
                print(
                    "total snapshots: "
                    + str(self.snapshots.get_snapshot_count_by_volume_id(id))
                )
            ]


def print_report():
    manager = EC2Manager()
    instances = manager.instances.get_all_instance_details()
    platforms = manager.instances.get_platform_counts()

    """Prints a report to a markdown file"""

    WINDOWS_RUNNING = manager.instances.describe_running_windows_instances()
    LINUX_RUNNING = manager.instances.describe_running_linux_instances()
    attachedVolCount = manager.get_attached_volume_count()
    unattachedVolCount = manager.get_unattached_volume_count()
    with open("report.md", "w") as f:
        f.write("# XATOR AWS EC2 REPORT\n\n")

        """Instance Information"""

        f.write("## INSTANCES Total: {}\n\n".format(manager.get_total_instance_count()))
        f.write("| Windows | Linux |\n|:---|:---|\n")
        f.write(f"| {platforms.get('Windows')} | {platforms.get('Linux')} |  | |\n")
        f.write(
            f"\n### INSTANCES Running Total: {manager.instances.get_total_running_instances()}\n\n---\n\n"
        )
        f.write(
            "| Instance ID | Name | Type | State | Platform | Volumes | Backed up? |\n|:---|:---|:---|:---|:---|:---|:---|\n"
        )
        for i in instances:
            f.write(
                f"| {i['ID']}| {i['NAME']} | {i['TYPE']} | {i['STATE']} | {i['PLATFORM']} | {i['VOLS']} | {i['BACKUP']} |\n"
            )
        f.write(
            f"\n### INSTANCES Stopped Total: {manager.instances.get_total_stopped_instances()}\n\n---\n\n"
        )
        if len(manager.instances.describe_stopped_instances()) > 0:
            for i in manager.instances.describe_stopped_instances():
                f.write(
                    f"| {i['Name']} | {i['ID']} | {i['Private IP']} | {i['State']} | {i['Instance Type']} | {i['Platform Details']} |\n"
                )
        else:
            f.write("No stopped instances found")
        f.write("\n\n")

        """Volume Information"""

        f.write(f"## VOLUMES Total: {manager.get_total_volume_count()}\n\n---\n\n")
        f.write(
            "| Total Storage | Volumes attached | Volumes unattached |\n|:---|:---|:---|\n"
        )
        f.write(
            f"| {manager.get_total_volume_size()} GB | {attachedVolCount} | {unattachedVolCount} |\n"
        )
        f.write("\n## VOLUMES Attached\n\n---\n\n")
        f.write("| Volume ID | Size | Availability Zone |\n|:---|:---|:---|\n")
        if attachedVolCount == 0:
            f.write("No volumes attached\n")
        else:
            if attachedVolCount > 0:
                for i in manager.get_attached_volumes():
                    f.write(f"| {i.id} | {i.size} GB | {i.availability_zone} |\n")
        f.write("\n## VOLUMES Unattached\n\n---\n\n")
        if unattachedVolCount == 0:
            f.write("No volumes unattached\n")
        else:
            if unattachedVolCount > 0:
                for i in manager.get_unattached_volumes():
                    f.write(f"| {i.id} | {i.size} GB | {i.availability_zone} |\n")

        """Snapshot Information"""

        f.write(
            f"\n## SNAPSHOTS Total: {manager.get_total_snapshot_count()}\n\n---\n\n"
        )
        f.write("| Volume ID | Snapshot Count |\n|:---|:---|\n")
        for volume in manager.get_volume_ids():
            f.write(
                f"| {volume} | {manager.snapshots.get_snapshot_count_by_volume_id(volume)} |\n"
            )
        f.write("\nDate: " + str(datetime.now()) + "\n")


def main():
    man = EC2Manager()
    print_report()


if __name__ == "__main__":
    main()
