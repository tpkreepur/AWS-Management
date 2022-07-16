import boto3


class EC2Snapshots:
    def __init__(self):
        self.ec2 = boto3.resource("ec2")
        self.snapshots = self.ec2.snapshots.filter(OwnerIds=["self"])

    def get_total_snapshot_count(self) -> int:
        """Returns the total number of snapshots"""
        snaps = [s for s in self.snapshots]
        print("Total number of snapshots:", len(snaps))

        return len(snaps)

    def get_snapshot_by_volume_id(self, volume_id: str) -> list:
        """Returns a list of snapshots owned by the user"""
        snapshots = []
        for s in self.snapshots:
            if s.get("VolumeId") == volume_id:
                snapshots.append(s)
        return snapshots

    def describe_owned_snapshots(self):
        """Returns a list of snapshots owned by the user"""
        for s in self.snapshots:
            print(
                "Snapshot ID:",
                s.get("SnapshotId"),
                "\nVolume ID:",
                s.get("VolumeId"),
                "\nState:",
                s.get("State"),
            )
        return self.snapshots

    def get_snapshots(self) -> list:
        """Returns a list of snapshots owned by the user"""
        snapshots = []
        for s in self.snapshots:
            snapshots.append(s)
        return snapshots


def main():
    ec2_snapshots = EC2Snapshots()
    ec2_snapshots.get_total_snapshot_count()


if __name__ == "__main__":
    main()
