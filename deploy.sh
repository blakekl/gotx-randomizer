#!/bin/bash

# Deploy script using system-installed rclone
SOURCE="./dist/"
DEST="ftp-retrohandhelds:randomizer.retrohandhelds.gg"

# Check if rclone is installed
if ! command -v rclone &> /dev/null; then
    echo "Error: rclone is not installed. Please install it first."
    echo "Visit https://rclone.org/install/ for installation instructions."
    exit 1
fi

# Check if the FTP remote is configured
if ! rclone listremotes | grep -q "ftp-retrohandhelds:"; then
    echo "Error: ftp-retrohandhelds remote is not configured in rclone."
    echo "Please run 'rclone config' to set up the FTP remote with the following settings:"
    echo "- Type: ftp"
    echo "- Host: randomizer.retrohandhelds.gg"
    echo "- User: your-username"
    echo "- Pass: your-password"
    exit 1
fi

# Check if source directory exists
if [ ! -d "$SOURCE" ]; then
    echo "Error: Source directory $SOURCE does not exist."
    echo "Please run 'npm run build' first to create the dist directory."
    exit 1
fi

echo "*** Starting deployment... ***"
echo "\t$SOURCE --> $DEST"

echo "\tUploading new files..."
rclone copy "$SOURCE" "$DEST" --progress

echo "\tRemoving old files that no longer exist in the source..."
rclone sync "$SOURCE" "$DEST" --progress

echo "*** Deployment completed successfully! ***"