# 💻 Environment & Model Constraints

## File Editing (Strict)
- **Gemma Preference**: When running Gemma (any version), ALWAYS prefer the `single_find_and_replace` tool for edits. This is the most reliable method for this environment.
- **Mac Constraint**: The `edit_existing_file` tool is currently UNRELIABLE on this Mac. If `single_find_and_replace` is not applicable, do NOT attempt a full-file edit.
- **Required Fallback**:
    1. Attempt `single_find_and_replace` first.
    2. If the tool fails or isn't suitable, provide the **full updated code block** in the chat.
    3. Explicitly state: "I am providing the full code block as a fallback because direct file editing is restricted."

## Implementation Context
- **Gemma Models**: These models should prioritize atomic, targeted edits using the find-and-replace logic to avoid context loss during large file rewrites.
- **Other Models (Qwen, etc.)**: Follow the same fallback logic if their native editing tools fail.