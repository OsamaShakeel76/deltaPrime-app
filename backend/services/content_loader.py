import os

ALLOWED_EXT = (".md", ".txt", ".tsx", ".ts")

def load_website_content(root_paths):
    docs = []
    for root in root_paths:
        for dirpath, _, filenames in os.walk(root):
            for fn in filenames:
                if fn.endswith(ALLOWED_EXT):
                    fp = os.path.join(dirpath, fn)
                    try:
                        with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                            text = f.read().strip()
                        if text:
                            docs.append({
                                "source": fp.replace("\\", "/"),
                                "content": text
                            })
                    except Exception:
                        pass
    return docs
