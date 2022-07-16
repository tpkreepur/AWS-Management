import os
from re import S
import boto3
from dotenv import load_dotenv

load_dotenv()


class EC2Snapshots:
    def __init__(self):
        self.RESOURCE = boto3.resource("ec2")
        self.STS = boto3.client("sts")
        self.ACCOUNT_ID = self.STS.get_caller_identity()["Account"]
        self.snapshots = self.RESOURCE.snapshots.filter(OwnerIds=[self.ACCOUNT_ID])

    def get_total_snapshot_count(self) -> int:
        """Returns the total number of snapshots"""
        snapshots = [snap for snap in self.snapshots]
        return len(snapshots)

    def get_snapshot_count_by_volume_id(self, volume_id: str) -> int:
        """Returns the number of snapshots for a volume"""
        snapshots = [snap for snap in self.snapshots if snap.volume_id == volume_id]
        return len(snapshots)

    def get_snapshots(self) -> list:
        """Returns a list of snapshots owned by the user"""
        snapshots = [snap for snap in self.snapshots]
        for snapshot in snapshots:
            print(
                "Snapshot ID: ",
                snapshot.id,
                "\nVolume ID: ",
                snapshot.volume_id,
                "\nState: ",
                snapshot.state,
                "\nStart Time: ",
                snapshot.start_time,
                "\nProgress: ",
                snapshot.progress,
                "\nDescription: ",
                snapshot.description,
            )
        return snapshots


def main():
    print(os.environ["AWS_ACCOUNT_ID"])
    S = EC2Snapshots()


if __name__ == "__main__":
    main()
