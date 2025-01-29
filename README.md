# 📦 InvenTrack Hub ( Inventory Management System )

## A combination of "Inventory" and "Tracking" for centralized management.

A full-featured inventory management system built with React, Clerk Authentication, Tailwind CSS, Material UI, Framer Motion, and Axios. It provides a seamless user experience for managing products, tracking stock levels, and monitoring sales trends.

## 🚀 Features

### 📊 Dashboard
- Displays total products, sales trends, and low-stock alerts.
- Interactive charts powered by **Recharts** for better insights.

### 📦 Inventory Management
- List all products with details such as price, stock, and sales.
- Search products dynamically.
- Download **inventory reports as PDF**.

### 💰 Sales Management
- Record new sales transactions.
- Validate stock before sale submission.
- View **sales history** with pagination and filtering.
- Generate **sales reports in PDF**.

### 🔄 Stock Updates
- Search products and update stock quantity.
- Modify purchase prices with validation.
- Live success/error **toasts for better UX**.

### 🔒 Authentication & Security
- **User authentication** powered by Clerk.
- **Role-based data access** based on user email.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Material UI, Framer Motion
- **State Management:** useState, useEffect
- **Data Fetching:** Axios (API integration)
- **Authentication:** Clerk (user management)
- **Charts & Reports:** Recharts, jsPDF (autoTable)
- **Notifications:** React Hot Toast
- **Backend:** Fast Api, Mongo DB
