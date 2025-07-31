# sdm-backend

A backend service built using **Hono.js** for routing, **MongoDB + Mongoose** for database interactions, **Cloudinary** for image uploads, **Razorpay** as the payment gateway and **Nodemailer** for sending emails.

## 🛠 Tech Stack

* [Hono.js](https://hono.dev/) – Lightweight web framework for building APIs
* [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) – NoSQL database with a flexible schema layer
* [Cloudinary](https://cloudinary.com/) – Image hosting and transformation
* [Razorpay](https://razorpay.com/) – Payment gateway integration
* [Nodemailer](https://nodemailer.com/) – Email sending

## 📦 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB URI
* Cloudinary credentials
* Razorpay API keys
* Email keys

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/glRajkumar/sdm-matrimony-backend.git
cd sdm-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following:

```env
MONGODB_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

FRONTEND_URL=

EMAIL_ID=
EMAIL_PASS=
EMAIL_HOST=
```

### Running the server

Start the development server:

```bash
npm run dev
```

The API will be available at: `http://localhost:PORT` (default: `5000`)

## 📁 Project Structure

```
sdm-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Middleware functions
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── test/                # http test files for testing api routes using rest client
├── .env                 # Environment variables
├── package.json
└── README.md
```
