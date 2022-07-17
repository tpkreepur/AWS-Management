import boto3

ec2 = boto3.resource("ec2")
volumes = ec2.volumes.all()
instances = ec2.instances.all()


def get_all_volume_ids():
    """Returns a list of all volume IDs"""

    volume_ids = []
    for volume in volumes:
        volume_ids.append(volume.id)
    return volume_ids


def get_volume_tags(volume_id):
    """Returns a list of tags for a volume"""
    volume = ec2.Volume(volume_id)
    return volume.tags


def get_all_volume_tags():
    """Returns a list of all volume tags"""
    volumes = ec2.volumes.all()
    volume_tags = []
    for volume in volumes:
        volume_tags.append(volume.tags)
    return volume_tags


def set_volume_tag(volume_id, tag_key, tag_value):
    """Sets a tag on a volume"""
    volume = ec2.Volume(volume_id)
    volume.create_tags(Tags=[{"Key": tag_key, "Value": tag_value}])
    return volume.tags


def main():
    """Main function"""
    oldBackupPolicy = None
    newSnapshotPolicy = None
    for volume in get_all_volume_ids():
        print(volume)
        for tag in [tag for tag in get_volume_tags(volume)]:
            if tag["Key"].lower() == "backup":
                print("Backup: ", tag["Value"])
                oldBackupPolicy = True
            if tag["Key"].lower() == "snapshot":
                print("Snapshot: ", tag["Value"])
                newSnapshotPolicy = True
        if oldBackupPolicy and newSnapshotPolicy:
            print("Backups are set")
            backups = True
        else:
            print("Backups are not set")
            backups = False


if __name__ == "__main__":
    main()
