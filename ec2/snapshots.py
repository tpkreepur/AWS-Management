import os
import boto3
from dotenv import load_dotenv

load_dotenv()


class EC2Snapshots:
    def __init__(self):
        self.ec2 = boto3.resource("ec2")
        self.client = boto3.client("ec2")
        self.snapshots = self.client.describe_snapshots(
            OwnerIds=[os.environ["AWS_ACCOUNT_ID"]]
        )

    def get_total_snapshot_count(self) -> int:
        """Returns the total number of snapshots"""
        print("Total number of snapshots:", len(self.snapshots["Snapshots"]))
        return len(self.snapshots["Snapshots"])

    def get_snapshot_count_by_volume_id(self, volume_id: str) -> int:
        """Returns the number of snapshots for a volume"""
        snapshots = self.get_snapshots_by_volume_id(volume_id)
        return len(snapshots)

    def get_snapshots_by_volume_id(self, volume_id: str) -> list:
        """Returns a list of snapshots for a volume"""
        snapshots = []
        for s in self.snapshots:
            if s["VolumeId"] == volume_id:
                snapshots.append(s)
            print("Snapshot ID:", s["SnapshotId"])
        return snapshots

    def get_snapshots(self) -> list:
        """Returns a list of snapshots owned by the user"""
        snapshots = []
        for s in self.snapshots:
            snapshots.append(s)
        return snapshots


def main():
    print(os.environ["AWS_ACCOUNT_ID"])
    ec2_snapshots = EC2Snapshots()
    ec2_snapshots.get_snapshots_by_volume_id("vol-060cf2a35e5dfcfce")


if __name__ == "__main__":
    main()
