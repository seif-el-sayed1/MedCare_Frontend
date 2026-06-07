# 🏥 Clinic Management System — Frontend

A frontend for managing a medical clinic, built with **React**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Getting Started

```bash
git clone https://github.com/seif-el-sayed1/MedCare_Frontend.git
npm run dev
```

---

## 🛠️ Tech Stack

- React
- Vite
- Tailwind CSS
- Zustand
- React Hook Form
- Recharts
- Lucide React
- HTML5 QR Code

---

## ✨ Features

### 👥 User Panel

- Register, login, and verify account via OTP
- Forget & reset password
- Upload profile picture
- Multi-language support (Arabic / English)

### 🩺 Doctor Browsing

- Browse doctors by specialization
- View doctor profile, rating, and available slots
- Rate and review doctors after appointments

### 📅 Appointment Booking

- Book appointments in available time slots
- Choose partial or full payment
- Cancel appointments
- Track appointment status (Pending → Confirmed → Completed / Absent)
- Download PDF report for each appointment
- QR Code scanner for clinic check-in

### 💳 Payment

- Integrated payment flow with Paymob
- Payment status tracking

### ⏳ Waiting List

- Join a waiting list for a fully-booked doctor
- Get notified automatically when a slot opens

### 🔔 Notifications

- Real-time push notifications (FCM)
- Mark notifications as seen (single or all)

### ⭐ Ratings & Reviews

- Rate doctors after appointments
- Edit or delete your own rating

### 📊 Admin Dashboard

- Overview stats (users, appointments, revenue)
- Charts: appointments, revenue, new users, specializations, payment status
- Top doctors by rating
- Recent appointments and payments

### 👨‍💼 Admin Management

- Manage doctors (add, update, soft delete)
- Set doctor working hours and leaves
- Manage appointments and payment status
- Scan QR code for patient check-in

### 🩺 Doctor Panel

- View own appointments
- Write diagnosis for each appointment
- View own ratings and profile
- Update profile and picture

### 🔐 Role-Based UI

- 3 separate panels: User, Doctor, Admin
- Each panel shows only what's relevant to the role
