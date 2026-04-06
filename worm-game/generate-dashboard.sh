#!/bin/bash

# Target output file
OUTPUT="index.html"

# Generate the top half of the HTML with Retro Arcade CSS
cat << 'EOF' > "$OUTPUT"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Developer Arena - Dashboard</title>
    <style>
        :root {
            --neon-cyan: #00ffff;
            --neon-magenta: #ff00ff;
            --neon-yellow: #ffff00;
            --bg-color: #0a0a0c;
        }
        body {
            background-color: var(--bg-color);
            color: var(--neon-cyan);
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            padding: 40px;
            text-shadow: 0 0 5px var(--neon-cyan);
        }
        .scanlines {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            z-index: 100;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        h1 {
            text-align: center;
            color: var(--neon-magenta);
            text-shadow: 0 0 10px var(--neon-magenta), 0 0 20px var(--neon-magenta);
            text-transform: uppercase;
            font-size: 2.5em;
            margin-bottom: 50px;
            border: 2px solid var(--neon-magenta);
            padding: 15px;
            box-shadow: inset 0 0 10px var(--neon-magenta), 0 0 10px var(--neon-magenta);
        }
        h2 {
            color: var(--neon-yellow);
            text-shadow: 0 0 8px var(--neon-yellow);
            border-bottom: 2px dashed var(--neon-yellow);
            padding-bottom: 10px;
            margin-top: 40px;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin: 15px 0;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
        }
        li::before {
            content: "▶";
            margin-right: 10px;
            color: var(--neon-magenta);
            animation: blink 1s step-end infinite;
        }
        a {
            color: var(--neon-cyan);
            text-decoration: none;
            transition: all 0.2s;
            padding: 5px 10px;
            border: 1px solid transparent;
        }
        a:hover {
            color: #fff;
            text-shadow: 0 0 10px #fff, 0 0 20px var(--neon-cyan);
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid var(--neon-cyan);
            border-radius: 4px;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .family-badge {
            font-size: 0.8em;
            background: rgba(255, 0, 255, 0.2);
            color: var(--neon-magenta);
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 10px;
            border: 1px solid var(--neon-magenta);
        }
    </style>
</head>
<body>
    <div class="scanlines"></div>
    <div class="container">
        <h1>👾 Arena Dashboard 👾</h1>
EOF

# Helper function to generate list items for a specific category
generate_category() {
    local suffix=$1
    local title=$2

    echo "        <h2>$title</h2>" >> "$OUTPUT"
    echo "        <ul>" >> "$OUTPUT"

    # Find all directories at depth 2 (e.g., ./gemma/gemma4-26b-mac) that end with the suffix
    # Sort them alphabetically
    find . -mindepth 2 -maxdepth 2 -type d -name "*${suffix}" | sort | while read -r dir; do
        # Clean the directory path (remove the leading ./)
        clean_dir="${dir#./}"

        # Extract the model family (folder level 1) and specific model (folder level 2)
        family=$(echo "$clean_dir" | cut -d'/' -f1 | tr '[:lower:]' '[:upper:]')
        model=$(echo "$clean_dir" | cut -d'/' -f2)

        # Write the HTML link (pointing to the index.html inside that folder)
        echo "            <li><span class=\"family-badge\">$family</span> <a href=\"$clean_dir/index.html\">$model</a></li>" >> "$OUTPUT"
    done

    echo "        </ul>" >> "$OUTPUT"
}

# Scan and generate sections
generate_category "-mac" "🍎 Mac Environments (M4 Max)"
generate_category "-pc" "💻 PC Environments (RTX 5070 Ti)"

# Close out the HTML file
cat << 'EOF' >> "$OUTPUT"
    </div>
</body>
</html>
EOF

echo "✅ Generated retro dashboard at $OUTPUT"