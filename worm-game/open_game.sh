#!/bin/zsh

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Move to the script's directory so we can use relative paths from the root
cd "$SCRIPT_DIR/.."

# Default version if none provided
DEFAULT_VERSION="gemma4-26b-pc"

# Get the version from the first argument, or use default
VERSION=${1:-$DEFAULT_VERSION}

# Search for the index.html that matches the version name
TARGET_FILE=$(find worm-game -name "index.html" -path "*${VERSION}*" | head -n 1)

if [ -z "$TARGET_FILE" ]; then
    echo "Error: Could not find index.html for version '$VERSION'"
    echo "Available versions found in worm-game/:"
    # Find all index.html files and print their directory relative to worm-game
    find worm-game -name "index.html" -exec dirname {} \; | sed 's|worm-game/||'
    echo ""
    echo "Usage: $0 [version_folder]"
    echo "Example: $0 gemma4-26b-mac"
    exit 1
fi

echo "Launching: $TARGET_FILE"

# Open the file using the system default opener
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$TARGET_FILE"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$TARGET_FILE" || echo "Please open $TARGET_FILE manually in your browser."
else
    echo "Please open $TARGET_FILE manually in your browser."
fi