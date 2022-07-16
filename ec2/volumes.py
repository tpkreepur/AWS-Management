import boto3


class EC2Volumes:
    def __init__(self):
        self.ec2 = boto3.resource("ec2")
        self.volumes = [vol for vol in self.ec2.volumes.all()]

    def describe_volumes(self):
        """Prints all volume information with the following columns:
        Volume ID, Volume Type, Volume Size, Volume State, Volume Availability Zone, Volume Encrypted, Volume Snapshot ID, Volume Iops, Volume Tags"""
        print("All Volume Information:")
        print("-----------------------------------------------------------")
        for volume in self.volumes:
            print("|Volume Name: {}".format(volume.tags[0]["Value"]))
            print(
                "|\tID: {} \n|\tType: {} \n|\tSize: {} GB\n|\tState: {} \n|\tAvailability Zone: {} \n|\tEncrypted: {} \n|\tSnapshot ID: {} \n|\tIops: {}".format(
                    volume.id,
                    volume.volume_type,
                    volume.size,
                    volume.state,
                    volume.availability_zone,
                    volume.encrypted,
                    volume.snapshot_id,
                    volume.iops,
                )
            )
            print("-----------------------------------------------------------")

    def print_all_volumes_to_csv(self):
        """Prints all volume information to a csv file"""
        print("Printing all volume information to csv file")
        with open("volumes.csv", "w") as f:
            f.write(
                "Volume Name,Volume ID,Volume Type,Volume Size(GB),Volume State,Volume Availability Zone,Volume Encrypted,Volume Snapshot ID,Volume Iops,Volume Tags\n"
            )
            for volume in self.volumes:
                f.write(
                    "{},{},{},{},{},{},{},{},{},{}\n".format(
                        volume.tags[0]["Value"],
                        volume.id,
                        volume.volume_type,
                        volume.size,
                        volume.state,
                        volume.availability_zone,
                        volume.encrypted,
                        volume.snapshot_id,
                        volume.iops,
                        volume.tags,
                    )
                )
        print("Done printing to csv file")

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
        print(volumes)
        return volumes

    def get_total_volume_count(self) -> int:
        """Returns the total number of volumes"""
        print("Total number of volumes: ", len(self.volumes))
        return len(self.volumes)


def test_print_functions():
    ec2_volumes = EC2Volumes()
    for volume in ec2_volumes.get_volumes():
        print(volume.tags[0]["Value"])

    print(len(ec2_volumes.get_volumes()))


def main():
    ec2_volumes = EC2Volumes()
    print(ec2_volumes.get_volumes_by_instance_id("i-02820785140c08eb5"))


if __name__ == "__main__":
    main()
    exit(0)
