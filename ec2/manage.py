from instances import EC2Instances
from snapshots import EC2Snapshots
from volumes import EC2Volumes

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
        return self.instances.total_instances()

    def get_total_volume_count(self) -> int:
        """Returns the total number of volumes"""
        return self.volumes.get_total_volume_count()

    def get_total_snapshot_count(self):
        """Returns the total number of snapshots"""
        return self.snapshots.get_total_snapshot_count()

    def get_total_windows_instances(self):
        """Returns the total number of windows instances"""
        return self.instances.get_total_windows_instances()

    def get_total_linux_instances(self):
        """Returns the total number of linux instances"""
        return self.instances.get_total_linux_instances()

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

    def list_snapshots_by_volume(self):
        """Lists snapshots by volume ID"""
        volumeIDs = self.volumes.get_volume_ids()
        for id in volumeIDs:
            print("-Volume ID: " + id)
            print("|\tSnapshots:")
            for snapshot in self.snapshots.get_snapshots_by_volume(id):
                print(len())


def main():
    man = EC2Manager()
    man.list_snapshots_by_volume()


if __name__ == "__main__":
    main()
