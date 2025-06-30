# 💸 SmartSpendr AI

**SmartSpendr AI** is an intelligent expense prediction and budget planning web app powered by FastAPI, React, and Machine Learning. It helps users analyze past spending habits and generate personalized budget forecasts for the upcoming month.

<div align="center">
  <img src="./frontend/public/home_photo.png" width="120" alt="SmartSpendrAI Icon"/>
</div>

---

## 🚀 Features

- ✨ Personalized expense predictions using ML
- 🔐 JWT-based user authentication (register/login)
- 📊 Dashboard with category-wise budget forecasts
- 🧠 Predicts weekday/weekend spending separately
- 🌍 Deployed with:
  - Frontend → [Vercel](https://smart-spendr-ai.vercel.app)
  - Backend → [Render](https://smartspendrai.onrender.com)

---

## 🧱 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React + Vite + Tailwind   |
| Backend    | FastAPI + Pydantic + SQLAlchemy |
| Database   | PostgreSQL (via Render)   |
| ML Model   | scikit-learn, joblib      |
| Auth       | JWT (FastAPI JWT Auth)    |
| Deployment | Vercel (frontend), Render (backend) |
| Container  | Docker + Docker Compose   |

---

## 📦 Folder Structure

```
SmartSpendrAI/
├── app/                     # Backend (FastAPI)
│   ├── routes/              # API endpoints
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication logic
│   └── main.py              # Entry point
├── mlmodels/
│   ├── predictor.py         # Budget prediction logic
│   └── trained_models/      # .pkl files for model + encoder
├── frontend/                # React frontend
│   ├── pages/               # Page components
│   ├── assets/              # Icons, SVGs, etc.
│   └── App.jsx              # Main router
├── docker-compose.yml       # Dev container config
├── Dockerfile               # Backend container
├── requirements.txt         # Backend Python packages
└── README.md
```

---

## 🧠 Machine Learning Model

The model is trained on historical expense data to forecast budget for the upcoming month.  
Features used:
- Month
- Day of Week
- Is Weekend
- Encoded Category

Model outputs weekday and weekend spending separately and scales prediction based on calendar counts.

🧪 Model files:
- `expense_predictor.pkl`
- `category_encoder.pkl`

All stored in `mlmodels/trained_models/`

---

## 🌐 Live URLs

- **Frontend**: [https://smart-spendr-ai.vercel.app](https://smart-spendr-ai.vercel.app)
- **Backend (API)**: [https://smartspendrai.onrender.com](https://smartspendrai.onrender.com)

---

## ⚙️ Running Locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- `.env` file with your credentials (`DATABASE_URL`, JWT secrets, etc.)

---

### 🐳 Run with Docker Compose

```bash
docker-compose up --build
```

- API will be live on: `http://localhost:8000`

---

### 🖼️ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend will run on: `http://localhost:5173`

Ensure `frontend/src/utils/axios.js` (or equivalent) has:

```js
axios.defaults.baseURL = "https://smartspendrai.onrender.com"; // or your localhost
```

---

## ✍️ Contributing

Contributions welcome! Here’s how:

1. 🍴 Fork the repo
2. 🌿 Create your feature branch: `git checkout -b feat/new-feature`
3. ✅ Commit your changes: `git commit -m 'Add feature'`
4. 📤 Push to branch: `git push origin feat/new-feature`
5. 🔁 Open a pull request

---

## 🙌 Acknowledgements

- Inspired by the need for smart budgeting in personal finance.
- Powered by open-source tools and community love 💙

---

> Built with passion by [@adishawarma](https://github.com/adishawarma)