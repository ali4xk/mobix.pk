# 🛒 Mobix.pk

**Pakistan's trusted marketplace for buying and selling used mobile phones and electronics.**

Mobix.pk is a niche, trust-focused alternative to generic classifieds like OLX — built specifically for electronics. Every listing goes through condition grading, and the platform is designed from the ground up to make used-device transactions safer and more transparent in Pakistan.

---

## 🚀 Features

- 📱 **Electronics-only listings** — mobiles, laptops, tablets, accessories, gaming gear
- 🔍 **Advanced search & filters** — by brand, model, price range, city, and condition
- ✅ **Standardized condition grading** — Like New / Excellent / Good / Fair / For Parts
- 🔐 **Seller verification** — phone OTP, CNIC check, and IMEI blacklist verification
- 💬 **In-app messaging** — buyers and sellers chat directly on the platform
- ⭐ **Reviews & ratings** — build trust through transaction history
- 🏷️ **Mobix Verified badge** — listings inspected by partner repair shops
- 🛡️ **Buyer protection** — escrow payments and dispute resolution *(coming soon)*
- 🔔 **Wishlist & alerts** — get notified when a matching listing is posted

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Flask (Python) |
| Database | PostgreSQL |
| Authentication | JWT + Google OAuth |
| Image Storage | Cloudinary |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Payments *(Phase 2)* | JazzCash / Easypaisa |

---

## 📁 Project Structure

```
mobix.pk/
├── backend/          # Flask REST API
│   ├── app/
│   │   ├── models/   # Database models
│   │   ├── routes/   # API endpoints
│   │   └── utils/    # Helpers and validators
│   ├── migrations/   # Database migrations
│   ├── .env.example
│   └── run.py
├── frontend/         # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\Activate       # Windows
pip install -r requirements.txt
```

Create a `.env` file (see `.env.example`):
```
DATABASE_URL=postgresql://mobix_user:mobix123@localhost:5432/mobix
JWT_SECRET_KEY=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
```

Run migrations and start the server:
```bash
flask db upgrade
flask run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🗺️ Roadmap

- [x] Project setup & database schema
- [x] Flask backend — auth, listings, image upload
- [x] React frontend — home, browse, listing detail
- [x] User dashboard — create and manage listings
- [x] In-app messaging
- [ ] Reviews & reports
- [ ] Admin panel
- [ ] IMEI verification & CNIC check
- [ ] Escrow payments
- [ ] Dealer onboarding

---

## 👤 Author/Developer:

**Muhammad Ali** — [@ali4xk](https://github.com/ali4xk)

---

## 📄 License

This project is public for portfolio purposes only. See LICENSE — all rights reserved.
