StopTheDrip — Autonomous Financial Leak Audit Engine

Hackathon team repository for StopTheDrip - [hackindia-team:ai-first-startup-hackathon-build-a-startup-using-ai-only:stopthedrip]

StopTheDrip isolates forgotten subscriptions, hidden platform fees, and dormant recurrent charges from bank statements (PDF or CSV) using a dual-agent Google Gemini AI pipeline, backed by real 256-bit AES-GCM in-browser encryption and zero-disk data storage.

🔗 Live App: heharsh123.vercel.app 🔗 Live Backend: hyu-3lqa.onrender.com

Credits

Developed by Harshil Goyal 📧 arveharshil@gmail.com

Key Features
Dual-Agent AI Financial Engine:
Agent 1 (Pattern Classification): Detects recurring merchant signatures, calculates payment frequency, classifies charges (subscription, recurring_bill, uncertain), assigns confidence scores, and tallies annual/monthly leakage.
Agent 2 (Cancellation Guide Generator): Concurrently generates friendly merchant names, 1-sentence descriptions, concise 3-step actionable cancellation workflows, and difficulty ratings.
Real Free 256-Bit Local Encryption:
Client-Side: Utilizes the native Web Crypto API (window.crypto.subtle) to encrypt statement buffers via 256-bit AES-GCM before transmission.
RAM In-Memory Decryption: The backend processes statements strictly in memory (BytesIO) using Python's standard cryptography library.
Zero-Storage Guarantee: Zero files written to persistent disk or database.
High-Fidelity Interface:
Built with React and Tailwind CSS following the approved financial ledger aesthetic (Newsreader serif, Inter, dark obsidian tones, and hairline dividers).
Dynamic interactive accordions, spend-by-category breakdown bars, and instant CSV/PDF export.
Project Structure
.
├── frontend/                # React + Tailwind frontend (Vercel-ready)
│   ├── src/
│   │   ├── App.jsx          # Main audit interface (upload -> analyzing -> results)
│   │   ├── crypto.js        # Web Crypto API 256-bit AES-GCM client encryption
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json          # Vercel configuration for frontend/ directory
│   └── .env.example
├── backend/                 # FastAPI backend (Render / Railway-ready)
│   ├── main.py              # POST /analyze, GET /health, GET /sample
│   ├── analyzer.py          # Dual-agent Gemini AI pipeline
│   ├── parser.py            # In-memory PDF (pdfplumber) & CSV parser
│   ├── crypto.py            # AES-256-GCM zero-storage in-memory decryption
│   ├── sample_statement.csv # Bundled 142-transaction realistic statement
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml          # Render Blueprint deployment
│   ├── Procfile             # Railway / Heroku deployment
│   └── tests/               # Pytest suite (crypto, parser, API)
├── vercel.json              # Monorepo root Vercel configuration
├── package.json             # Root monorepo scripts
├── .gitignore
└── README.md
Local Development
1. Backend Setup
bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Set Gemini API key
export GEMINI_API_KEY="your_api_key_here"
# On Windows PowerShell:
$env:GEMINI_API_KEY="your_api_key_here"

# Run tests
pytest tests -v

# Start FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
2. Frontend Setup
bash
cd frontend
npm install
npm run dev

Visit http://127.0.0.1:3000 (or http://localhost:5173) in your browser.

Deployment Guide
Deploying the Backend (Render or Railway)
Render:
Connect this repository to Render.
Create a new Blueprint (uses backend/render.yaml).
Set the environment variable:
GEMINI_API_KEY: Your Google AI Studio API key.
Render deploys the backend at https://your-backend.onrender.com.
Railway:
Create a new project on Railway from GitHub.
Select the backend folder as the root directory.
Add GEMINI_API_KEY under Variables.
Expose public networking port 8000.
Deploying the Frontend (Vercel)
Import this repository into Vercel.
If setting Root Directory, you can leave it as root (uses root vercel.json) or specify frontend.
Set Environment Variable:
VITE_API_URL: Your deployed backend URL (e.g. https://your-backend.onrender.com).
Click Deploy. Vercel will build and serve the production static bundle.
Live Deployment
Service	URL
Frontend	https://heharsh123.vercel.app/
Backend	https://hyu-3lqa.onrender.com/

Developed by Harshil Goyal — arveharshil@gmail.com
