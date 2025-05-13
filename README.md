# 👨‍🍳 Chef App

A full-stack Chef Recipe Management Platform that allows users to explore, interact, and manage recipes while giving chefs and admins enhanced control over content and users.

---

## 🌐 Live URL

> [Live Link](https://chef-app-ulf5.onrender.com)

---

## 📦 Repository

**GitHub**: [https://github.com/elvinjoy/chef-app.git](https://github.com/elvinjoy/chef-app.git)

---

## 🔥 Features

### 👤 User Features

- View all recipes
- View specific recipe details
- View count tracking for each recipe
- Like / Dislike system
- Comment system  
  - Edit/Delete own comment  
  - Only **one comment per user per recipe**
- Ratings system  
  - Leave rating and see average
- Bookmark recipes
- Authentication required for interactions

### 👨‍🍳 Chef Features

- Add new recipes with:
  - Title, Description, Cooking Time
  - Up to 3 images
  - Step-by-step preparation instructions
  - Category & Tags (e.g., *chicken curry*, *breakfast*, etc.)
- Full CRUD (Create, Read, Update, Delete) functionality

---

## 🧠 Admin Features

- Admin Dashboard with:
  - Total number of recipes
  - View count display (Top 5 ascending order)
  - Most commented recipes
  - Latest added recipes
  - Top 5 liked recipes
- Category & Tag Management
- User Management:
  - Activate/Delete users
- Comment Management:
  - Delete comments from any user

---

## 🧰 Tech Stack

**Backend**:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (for image upload)
- Validator

---

## 🛠 Installation & Setup

### 📁 Clone Repository

```sh
git clone https://github.com/elvinjoy/chef-app.git

cd chef-app

npm install
