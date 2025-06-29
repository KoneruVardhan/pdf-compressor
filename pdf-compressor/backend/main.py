
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from uuid import uuid4
from pathlib import Path
import subprocess
import os
import time
import threading

app = FastAPI()
TEMP_DIR = Path("temp_files")
TEMP_DIR.mkdir(exist_ok=True)

def delete_file_later(path: Path, delay: int = 600):  # 10 min delay
    def delayed():
        time.sleep(delay)
        if path.exists():
            path.unlink()
    threading.Thread(target=delayed).start()

@app.post("/compress")
async def compress_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    level: str = Form(...)
):
    quality_map = {
        "low": "/screen",
        "medium": "/ebook",
        "high": "/printer"
    }
    quality = quality_map.get(level, "/ebook")

    input_path = TEMP_DIR / f"{uuid4()}.pdf"
    output_path = TEMP_DIR / f"{uuid4()}_compressed.pdf"

    # Save uploaded file
    with open(input_path, "wb") as f:
        f.write(await file.read())

    # Compress using Ghostscript
    command = [
        "gs",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={quality}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        str(input_path)
    ]
    subprocess.run(command, check=True)

    # Schedule deletion
    delete_file_later(input_path)
    delete_file_later(output_path)

    return FileResponse(output_path, media_type="application/pdf", filename="compressed.pdf")
