# CashNova

CashNova is an AI-powered personal finance tracker built with modern web technologies. "Your Finances. Reimagined."

## Features

### Authentication & Security
- **Dual Authentication**: Google OAuth and email/password support
- **Account Linking**: Users can link multiple authentication methods
- **Rate Limiting**: Protection against brute force attacks
- **Password Reset Flow**: Secure token-based password recovery
- **Session Management**: "Remember Me" with configurable session duration
- **Protected Routes**: Middleware-based route protection

### User Interface
- **Fully Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: User preference-based theming
- **Streamlined Settings**: Consolidated account and security management
- **Modern Components**: Clean, accessible UI components

### Data Management
- **MongoDB Integration**: Scalable NoSQL database with Mongoose ODM
- **Comprehensive User Profiles**: Detailed user preferences and settings
- **Session Information**: Transparent session duration and status
- **Bank Connection Support**: Infrastructure for financial account linking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth and Credentials providers
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Resend API for transactional emails
- **Security**: bcryptjs for password hashing, rate limiting, CSRF protection

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Infinity-Studioz/cashnova.git
   cd cashnova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Authentication
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Database
   MONGODB_URI=your_mongodb_uri

   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM="CashNova <noreply@yourdomain.com>"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── components/         # Reusable UI components
│   ├── api/               # API routes (authentication, etc.)
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── settings/          # User settings and account management
│   └── dashboard/         # Main application dashboard
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB/Mongoose schemas
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
```

## Current Implementation Status

### ✅ Completed Features
- Complete authentication system (Google OAuth + Email/Password)
- User registration and login with validation
- Password reset with email verification
- Rate limiting and security measures
- Responsive settings page with account management
- Session management with "Remember Me" functionality
- Account linking (link/unlink authentication methods)

### 🚧 In Development
- Transaction management system
- Budget creation and tracking
- Financial analytics and reporting
- AI-powered insights and recommendations

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.