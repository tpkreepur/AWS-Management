import boto3


class EC2Volumes:
    def __init__(self):
        self.ec2 = boto3.resource("ec2")
        self.volumes = [vol for vol in self.ec2.volumes.all()]

    def describe_volumes(self) -> list:
        """Prints all volume information with the following columns:
        Volume ID, Volume Type, Volume Size, Volume State, Volume Availability Zone, Volume Encrypted, Volume Snapshot ID, Volume Iops, Volume Tags"""
        volumes = self.ec2.volumes.all()
        print([volume for volume in volumes])
        volumeList = []
        for volume in volumes:
            if volume.tags:
                vol = volume.tags[0]["Value"]
            else:
                vol = volume.id

            vol = {
                "Name": vol.upper(),
                "ID": volume.id,
                "Type": volume.volume_type,
                "Size": volume.size,
                "State": volume.state,
                "Availability Zone": volume.availability_zone,
                "Encrypted": volume.encrypted,
                "Snapshot ID": volume.snapshot_id,
                "Iops": volume.iops,
                "Tags": volume.tags,
            }

            print(vol)
            volumeList.append(vol)

        return volumeList

    def print_all_volumes_to_csv(self):
        """Prints all volume information to a csv file"""
        

    def get_volumes(self) -> list:
        """Returns a list of all volumes"""
        volume = []
        for v in self.volumes:
            volume.append(v)
        return volume

    def get_volumes_by_instance_id(self, instance_id: str) -> list:
        """Returns a list of volumes attached to an instance"""
        volumes = []
        for v in self.volumes:
            if v.attachments[0]["InstanceId"] == instance_id:
                volumes.append(v)

        return volumes

    def get_total_volume_count(self) -> int:
        """Returns the total number of volumes"""
        print("Total number of volumes: ", len(self.volumes))
        return len(self.volumes)

    def get_volume_ids(self) -> list:
        """Returns a list of all volume IDs"""
        volume_ids = []
        for v in self.volumes:
            volume_ids.append(v.id)

        return volume_ids

    def get_volume_name(self, volume_id: str) -> str:
        """Returns the name of a volume"""
        for v in self.ec2.volumes.all():
            for tag in v.tags:
                if tag["Key"] == "Name" and v.id == volume_id:
                    return tag["Value"]

    def get_volume_size(self, volume_id: str) -> int:
        """Returns the size of a volume"""
        for v in self.volumes:
            if v.id == volume_id:
                return f"{v.size} GB"

    def get_total_volume_size(self) -> int:
        """Returns the total size of all volumes"""
        total_size = 0
        for v in self.volumes:
            total_size += v.size
        return total_size

    def get_attached_volumes(self) -> list:
        """Returns a list of all volumes attached to an instance"""
        volumes = []

        for v in self.volumes:
            if v.attachments:
                volumes.append(v)

        return volumes

    def get_unattached_volumes(self) -> list:
        """Returns a list of all volumes unattached to an instance"""
        if self.volumes:
            volumes = []
            for v in self.volumes:
                if not v.attachments:
                    volumes.append(v)

            return volumes
        else:
            return None


def test_print_functions():
    ec2_volumes = EC2Volumes()
    for volume in ec2_volumes.get_volumes():
        print(volume.tags[0]["Value"])

    print(len(ec2_volumes.get_volumes()))


def main():
    ec2_volumes = EC2Volumes()
    print(ec2_volumes.get_unattached_volumes())


if __name__ == "__main__":
    main()
    exit(0)
