# BajetKita 💰

BajetKita (Expenses Tracker) is a modern, beautiful, and fully-featured full-stack web application designed to help you effortlessly manage your personal finances. 

Track your expenses, monitor your income, and actively manage your savings goals with a stunning user interface.

## ✨ Key Features

- **Comprehensive Dashboard**: Get a birds-eye view of your net balance, total expenses, income, and savings in real-time.
- **Interactive Visualizations**: View your financial data through beautiful Donut Charts, Line Charts, and an Interactive Calendar Heatmap.
- **Savings Goals**: Create dedicated savings plans, contribute funds, and watch your progress grow without affecting your daily expense reports.
- **Light & Dark Mode**: A meticulously designed theme system featuring deep darks, crisp lights, and vibrant accent colors (BajetKita Purple, Pink, Yellow, and Lime Green).
- **User Profiles**: Secure authentication with customizable profiles, including inline username editing and local profile picture uploads.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices with touch-optimized interfaces.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS 4
- Recharts (Data Visualization)
- CSS Doodle (Animated Logo)

**Backend:**
- Laravel 11
- PHP 8.2+
- Laravel Sanctum (API Authentication)
- MySQL / SQLite

## 🚀 Getting Started

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL or SQLite

### Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your environment file:
   ```bash
   cp .env.example .env
   ```
   *Note: Update the `.env` file with your database credentials.*
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
6. Link the storage directory (for profile pictures):
   ```bash
   php artisan storage:link
   ```
7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The API will be available at `http://localhost:8000`*

### Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
