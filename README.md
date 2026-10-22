# ClaimShield AI — Multimodal Claim Verification & Real-Time Fact-Checking Platform

> **Academic Review Production System**  
> A multi-tier full-stack system built to verify viral news, social media posts, and forwarded image infographics in real-time using Google Fact Check Tools API, Gemini 1.5 Multimodal Vision OCR, Serper/Tavily Live Web Search, NewsAPI ingestion, and MongoDB persistence.

---

## 🏗️ System Architecture

```text
[ React Frontend (Vite + Tailwind CSS) :5173 ]
                   │
                   ▼  (JWT Bearer Token Authentication)
[ Express.js Gateway & Auth Service :5000 ] ───► [ MongoDB (Users & Audit History) ]
                   │
                   ▼  (POST /analyze & POST /extract-image)
[ Python FastAPI Microservice :8000 ] ───► [ Gemini Vision + Google FactCheck + Live Web + NewsAPI ]
```

---

## 🎨 Color Palette & Design System
- **Theme Style**: Deep Blue & Tan Cyberpunk Enterprise
- **Primary Canvas**: `#050811` (Deep Midnight Blue)
- **Card Surfaces**: `#0C152B` / `#111D3B` (Navy Glassmorphic panels)
- **Primary Accents**: `#E0A96D` / `#D4A373` (Warm Sand & Tan Gold)
- **Status Indicators**:
  - `Authentic`: Emerald Green `#10B981`
  - `Likely False`: Crimson Rose `#F43F5E`
  - `Unverified`: Amber Warning `#F59E0B`

---

## 🔑 Environment & API Key Configuration

ClaimShield supports multiple live data providers with automatic fallback:

| API Provider | Purpose | Where to Obtain (Free Tiers) | Variable Name |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** *(Recommended)* | Multimodal Vision OCR & Fact Grounding | [Google AI Studio](https://aistudio.google.com/app/apikey) | `GEMINI_API_KEY` |
| **Google Fact Check Tools API** | Real-time ClaimReview queries | [Google Cloud Console](https://toolbox.google.com/factcheck/apis) | `GOOGLE_FACT_CHECK_API_KEY` |
| **Serper.dev / Tavily** | Live Google web & news search | [Serper.dev](https://serper.dev) / [Tavily.com](https://tavily.com) | `SERPER_API_KEY` / `TAVILY_API_KEY` |
| **NewsAPI.org** | Global media wire ingestion | [NewsAPI.org](https://newsapi.org) | `NEWS_API_KEY` |

> [!TIP]
> You can also configure all API keys dynamically in the UI by clicking the **"Live APIs"** button in the top navigation bar!

### `ai-service/.env`
```env
GEMINI_API_KEY=
GOOGLE_FACT_CHECK_API_KEY=
SERPER_API_KEY=
TAVILY_API_KEY=
NEWS_API_KEY=
PORT=8000
```

### `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/claimshield
JWT_SECRET=claimshield_jwt_super_secret_key_2026_review_demo
AI_SERVICE_URL=http://127.0.0.1:8000
```

---

## 🚀 Quick Start Guide (Running All Services)

Open **3 separate terminal windows** inside the root project directory:

### 1. Python AI Microservice (Port 8000)
```powershell
# Navigate to ai-service directory
cd ai-service

# (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Microservice available at: `http://127.0.0.1:8000` (Swagger docs at `/docs`)*

---

### 2. Express Gateway & Auth Backend (Port 5000)
```powershell
# Navigate to backend directory
cd backend

# Install node dependencies
npm install

# Start Express server on port 5000
npm start
```
*API Gateway running at: `http://127.0.0.1:5000`*

---

### 3. React Frontend (Port 5173)
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```
*Frontend UI will open at: `http://127.0.0.1:5173`*

---

## 🧪 Live Demo Guide (Presentation Steps)

1. Open `http://127.0.0.1:5173/login`.
2. Click **"Fill Academic Demo Credentials"** to log in instantly.
3. **Test Text Claim Verification**:
   - Test preset claims (e.g. *Microwave Radiation Hoax*, *NASA Artemis Mission*, *Garlic Cancer Hoax*).
   - Observe the 5-step real-time verification scanner.
   - Inspect the **Verification Index**, **Google Fact Check ClaimReview cards**, and **Citations**.
4. **Test Image & Screenshot Forensics**:
   - Switch to the **"Image & Screenshot Forensics (OCR)"** tab.
   - Drag & drop an image, paste from clipboard (`Ctrl+V`), or click a preset sample infographic.
   - Watch the glowing laser scan animation analyze typography and tamper risk.
   - Click **"Verify Extracted Claim"** to check the visual claim across live portals.
5. Click **"Live APIs"** in the topbar to inspect active provider connections or configure new API keys.
6. Click **"Audits"** to inspect the permanent verification audit trail.
