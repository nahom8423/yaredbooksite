from pathlib import Path

def collect_files(root=".", exts={".md", ".py", ".js"}):
    files = Path(root).rglob("*")
    output = ""
    for f in files:
        if f.suffix in exts and "node_modules" not in str(f) and f.stat().st_size < 100_000:
            content = f.read_text(errors="ignore")
            output += f"\n\n--- FILE: {f} ---\n{content}"
    return output

context = collect_files("./your_project_folder")
with open("payload.txt", "w") as f:
    f.write(context)
