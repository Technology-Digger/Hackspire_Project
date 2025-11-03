import subprocess
import os

# Run FastAPI app (main.py) using uvicorn
if __name__ == "__main__":
    # Get the port from Hugging Face environment
    port = int(os.environ.get("PORT", 7860))
    # Run uvicorn on that port
    subprocess.run(["uvicorn", "main:app", "--host", "0.0.0.0", "--port", str(port)])
