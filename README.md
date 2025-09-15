# CashNova

CashNova is an AI-powered personal finance management platform specifically designed for the Nigerian market. Built with modern web technologies and powered by intelligent automation, CashNova reimagines how Nigerians manage their finances with cultural context and economic awareness.

**"Your Finances. Reimagined."**

## Project Status & Launch Timeline

**Current Phase:** API Integration & Enhancement 
**Launch Target:** October 2025  
**Development Progress:** 85% Complete - Production Ready Core Features  
**Current Sprint:** Budget Screen API Integration & Smart Goals Theme Optimization

## Key Features

### ✅ Authentication & Security (COMPLETE)
- **Dual Authentication System**: Google OAuth and email/password with seamless account linking
- **Enhanced Security**: Rate limiting, CSRF protection, secure session management  
- **Password Recovery**: Token-based reset flow with email verification
- **Session Flexibility**: Configurable session duration (7-day default, 30-day extended)
- **Protected Routes**: Middleware-based authentication with comprehensive security

### ✅ Comprehensive Transaction Management (COMPLETE)
- **Smart Transaction Recording**: AI-powered categorization with Nigerian merchant recognition
- **Intelligent Categorization**: Automatic recognition of GTBank, Shoprite, Uber, DSTV, and 100+ local merchants
- **Recurring Transaction Detection**: Automatic identification of salary, rent, and bill patterns
- **Advanced Filtering & Search**: Filter by date range, category, amount, merchant, payment method with URL persistence
- **Real-time Transaction Updates**: Instant transaction creation with optimistic UI feedback
- **Enhanced Transaction History**: Advanced filtering, export functionality, AI insights panel
- **Nigerian Context Integration**: Family support, church/mosque, school fees, and transport optimization
- **Budget Impact Tracking**: Real-time warnings when transactions affect budget limits
- **Duplicate Detection**: Smart warnings for similar transactions
- **Quick-Add Shortcuts**: One-click common Nigerian transactions (Transport, Food, Data/Airtime, Fuel)

### ✅ Intelligent Budget Management (API READY)
- **Complete Budget Planner**: 5 comprehensive screens for complete budget control
  - Monthly Overview with real-time spending vs budget comparisons
  - Category Budgets with transfer capabilities between categories
  - Smart Budget Assistant with AI-powered budget generation
  - Budget Alerts & Reminders with real-time notifications
  - Budget Calendar with daily spending visualization
- **Nigerian Economic Context**: Salary cycle optimization (25th-28th), school fees planning (Jan/Sept), festive season adjustments
- **Dynamic Budget Categories**: Traditional Nigerian spending categories with cultural awareness
- **Real-time Budget Tracking**: Live utilization monitoring with intelligent threshold alerts
- **Budget Transfers**: Seamless reallocation between categories with impact analysis

### ✅ AI-Powered Financial Intelligence (COMPLETE)
- **Personalized Insights**: Contextual spending analysis with actionable recommendations
- **Nigerian Market Awareness**: Inflation adjustments, fuel price volatility, economic seasonal patterns
- **Predictive Analytics**: Cash flow forecasting and overspending prevention
- **Smart Categorization**: Automatic merchant recognition and pattern learning (95% confidence for known merchants)
- **Cultural Financial Advice**: Family support budgeting, religious giving optimization
- **Economic Volatility Planning**: Inflation buffers and emergency fund prioritization
- **Real-time AI Analysis**: Transaction categorization with confidence scores and insights

### ✅ Advanced Notification System (COMPLETE)
- **Real-time Alerts**: Smart notifications for budget thresholds, spending patterns, and milestones
- **Nigerian Context Notifications**: Salary cycle reminders, school fee season alerts, festive warnings
- **Priority-based Alerts**: Urgent, high, medium, and low priority notifications with visual indicators
- **Customizable Preferences**: User-controlled notification types and delivery methods (Email, SMS, Push, In-app)
- **Achievement Celebrations**: Milestone notifications for budget goals and savings achievements
- **Interactive Notifications**: Click-to-action notifications that route to relevant screens
- **Nigerian Economic Alerts**: Transport price alerts, salary day reminders, school fee season notifications

### 🎯 Comprehensive Goals System (UI COMPLETE - API READY)
- **Nigerian-Specific Goals**: Emergency fund (3-6 months), school fees savings, rent advance planning
- **Smart Goal Templates**: Pre-configured goals based on Nigerian financial patterns
- **Milestone Tracking**: Automatic progress tracking at 25%, 50%, 75%, and 100% completion
- **Contribution Management**: Manual and automatic savings with salary cycle integration
- **Progress Visualization**: Interactive progress bars with on-track status indicators
- **Achievement System**: Celebration notifications and progress sharing capabilities
- **Theme Integration**: Full light/dark mode support with smooth transitions
- **Nigerian Market Intelligence**: Real-time insights and seasonal recommendations

### ✅ Enhanced Settings & Account Management (COMPLETE)
- **Complete Profile Management**: Editable user profiles with image upload support
- **Account Linking System**: Seamless Google OAuth and email/password dual authentication
- **Advanced Security Settings**: App lock, biometric login, 2FA setup, PIN management
- **Bank Account Integration**: Nigerian bank connections (GTBank, First Bank, Zenith, Access, UBA)
- **Comprehensive Preferences**: Currency (NGN default), language, theme, date format selection
- **Nigerian Context Settings**: Salary reminders, school fee alerts, festive warnings, transport alerts
- **Notification Preferences**: Granular control over alert types, delivery methods, and timing
- **Real-time Settings Sync**: Instant preference updates with backend persistence

### ✅ Advanced Analytics & Reporting (COMPLETE)
- **Interactive Dashboards**: Real-time financial overview with customizable widgets and drill-down capabilities
- **Visual Data Representation**: Charts and graphs optimized for Nigerian spending patterns
- **Category Performance**: Detailed breakdown of spending efficiency with budget comparisons
- **Weekly/Monthly Trends**: Automated financial summaries with trend analysis
- **Clickable Analytics**: Drill-down from charts to filtered transaction views
- **Savings Progress Tracking**: Visual progress indicators for financial goals with achievement tracking
- **AI-Powered Insights**: Smart recommendations based on spending patterns and Nigerian economic context

### ✅ Nigerian Market Specialization (COMPLETE)
- **Local Merchant Database**: Recognition of Nigerian banks, retailers, and service providers
- **Salary Cycle Intelligence**: End-of-month payment pattern optimization and reminders
- **School Fee Planning**: January and September budget adjustments with goal tracking
- **Festive Season Budgeting**: December/January increased spending accommodation
- **Cultural Categories**: Family support, church/mosque, extended family obligations
- **Economic Context**: Naira volatility awareness and purchasing power analysis
- **Transport Intelligence**: Uber, Bolt, BRT, Danfo, Okada recognition and optimization

### ✅ User Experience & Design (COMPLETE)
- **Mobile-First Design**: Responsive layout optimized for Nigerian mobile usage patterns
- **Dark/Light Themes**: User preference-based theming with system integration and smooth transitions
- **Progressive Web App**: Native app-like experience with offline capability
- **Accessibility**: WCAG 2.1 compliant design with screen reader support
- **Interactive Elements**: Clickable charts, actionable insights, and seamless navigation
- **Real-time Updates**: Live data refresh with auto-sync capabilities
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## Tech Stack

### Frontend
- **Next.js 14**: App Router with TypeScript for type safety and performance
- **Tailwind CSS**: Utility-first styling with custom Nigerian market themes and dark/light mode support
- **Chart.js**: Interactive data visualizations optimized for financial data
- **React Hook Form**: Optimized form handling with comprehensive validation
- **Sonner**: Toast notifications for real-time user feedback
- **FontAwesome**: Comprehensive icon system with Nigerian context icons

### ✅ Backend & APIs (FULLY IMPLEMENTED)
- **Next.js API Routes**: RESTful endpoints with comprehensive error handling
- **MongoDB**: Scalable NoSQL database with Mongoose ODM
- **NextAuth.js**: Authentication with multiple providers and account linking
- **Real-time Notifications**: Complete notification system with priority management
- **Advanced Aggregation**: Optimized database queries for dashboard analytics

### ✅ Security & Infrastructure (COMPLETE)
- **bcryptjs**: Password hashing with salt rounds
- **Rate Limiting**: API protection against abuse with intelligent throttling
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Monitoring**: Structured logging and error tracking
- **Session Management**: Secure session handling with configurable duration

### External Integrations
- **Resend API**: Transactional email service for notifications
- **Nigerian Banking APIs**: Integration ready for major local banks (Mono/Okra)
- **SMS Services**: Local Nigerian SMS providers for notifications
- **Currency APIs**: Real-time exchange rates with Naira optimization

## Project Architecture

```
src/
├── app/                         # Next.js App Router
│   ├── api/                     # API Routes ✅ COMPLETE
│   │   ├── transactions/        # Transaction CRUD with smart categorization
│   │   ├── budgets/            # Complete budget management APIs
│   │   ├── goals/              # Goals system with Nigerian templates
│   │   ├── alert-settings/     # Notification preferences management
│   │   ├── notifications/      # Real-time notification system
│   │   ├── settings/           # User preferences and profile management
│   │   ├── auth/               # Authentication endpoints
│   │   └── dashboard/          # Enhanced dashboard with interactions
│   ├── components/             # Reusable UI Components ✅ COMPLETE
│   │   ├── charts/             # Interactive financial visualizations
│   │   ├── PieChart.tsx        # Real data spending categories
│   │   ├── LineChart.tsx       # Weekly spending trends
│   │   ├── MainNavigation.tsx  # Enhanced with notification dropdown
│   │   ├── ToggleSwitch.tsx    # Settings toggle components
│   │   ├── AccountLinking.tsx  # Account authentication management
│   │   ├── NewGoalModal.tsx    # Goal creation with Nigerian templates
│   │   ├── ContributeModal.tsx # Goal contribution interface
│   │   └── SessionInfoCard.tsx # Session information display
│   ├── dashboard/              # Main application interface ✅ COMPLETE
│   ├── budget-planner/         # Complete 5-screen budget system 🎯 API INTEGRATION
│   │   ├── screen-1/           # Monthly Overview
│   │   ├── screen-2/           # Category Budgets
│   │   ├── screen-3/           # Smart Budget Assistant
│   │   ├── screen-4/           # Budget Alerts & Reminders
│   │   └── screen-5/           # Budget Calendar
│   ├── transactionHistory/     # Transaction management with filtering ✅ COMPLETE
│   ├── addTransaction/         # Enhanced transaction creation ✅ COMPLETE
│   ├── smartGoals/            # Goals management interface ✅ COMPLETE + THEMED
│   └── settings/               # User preferences and account ✅ COMPLETE
├── models/                     # MongoDB/Mongoose schemas ✅ COMPLETE
│   ├── User.ts                 # User profile and preferences
│   ├── Transaction.ts          # Smart transaction records with categorization
│   ├── Budget.ts               # Monthly budget management
│   ├── Goal.ts                 # Goals with milestone tracking
│   ├── AlertSettings.ts        # Notification preferences
│   ├── Notification.ts         # Generated alerts and notifications
│   ├── AIInsight.ts           # AI-powered financial insights
│   ├── Conversation.ts         # AI chat conversations
│   └── Report.ts               # Financial reports and analytics
├── lib/                        # Utility functions and configurations ✅ COMPLETE
│   └── mongodb.ts              # Database connection with optimization
├── types/                      # Shared TypeScript interfaces ✅ COMPLETE
│   └── index.ts               # Comprehensive type definitions
├── hooks/                      # Custom React hooks ✅ COMPLETE
│   └── useGoals.ts            # Goals management hook
└── utils/                      # Helper functions ✅ COMPLETE
    ├── authOptions.ts          # NextAuth configuration
    └── currency.ts             # Nigerian Naira formatting
```

## Database Models (TypeScript + Mongoose)

### ✅ Core Models (Production-Ready)

#### 1. User Model
Complete user management with dual authentication support, Nigerian preferences, and security features.

#### 2. Transaction Model
Smart transaction recording with Nigerian merchant recognition, auto-categorization, and recurring pattern detection.

#### 3. Goal Model
Comprehensive savings goals with Nigerian templates, milestone tracking, contribution management, and progress insights.

#### 4. Budget & CategoryBudget Models
AI-powered budget management with Nigerian economic context, category transfers, and seasonal adjustments.

#### 5. Supporting Models
- **Settings**: User preferences, theme, notifications with Nigerian context
- **AlertSettings**: Budget alerts, Nigerian economic notifications
- **Notification**: Rich notification system with priority management
- **AIInsight**: Financial intelligence with Nigerian market awareness
- **Conversation**: AI coach chat system
- **BankConnection**: Nigerian bank integration support
- **PasswordResetToken**: Secure password reset workflow

## Nigerian Market Specialization

### ✅ Currency & Formatting (COMPLETE)
- **Primary Currency**: Nigerian Naira (₦) exclusively
- **Format Pattern**: ₦189,999 (no decimals for whole numbers)
- **Utility Function**: formatNigerianCurrency() in shared types
- **API Standard**: All monetary responses include formattedAmount fields

### ✅ Categories (Market-Specific)
**Income Categories:**
- Salary, Freelance Work, Business Income, Side Hustle
- Gift/Family Support, Investment Returns, Rental Income

**Expense Categories:**
- Food & Dining, Transport (okada, danfo, Uber, fuel)
- Rent/Housing, Bills (NEPA, water, internet, DSTV)
- Family Support⭐, School Fees ⭐, Church/Mosque⭐
- Health/Medical, Entertainment, Shopping, Personal Care
- Emergency Fund (prioritized for economic volatility)

### ✅ Economic Context Intelligence (COMPLETE)
- **Salary Cycles**: End-of-month patterns (day 25-28)
- **School Fee Seasons**: January, September budget increases
- **Festive Seasons**: December, January spending surge
- **Transport Volatility**: Fuel price fluctuation awareness
- **Inflation Buffers**: 10-15% automatic adjustments

### ✅ Payment Methods (Local Context)
- **Cash**: Still dominant in Nigerian markets
- **POS Terminal**: Widespread for card payments
- **Bank Transfer**: Mobile banking popularity
- **Mobile Money**: Growing adoption
- **Online Payment**: E-commerce integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud)
- Google OAuth credentials
- Resend API key for email services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Infinity-Studios/cashnova.git
   cd cashnova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   # Authentication
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Email Service
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM="CashNova <noreply@cashnova.com>"

   # Future: AI Integration
   OPENAI_API_KEY=your_openai_key

   # Future: Nigerian Bank Integration
   MONO_API_KEY=your_mono_key
   OKRA_API_KEY=your_okra_key
   ```

4. **Configure Image Domains**
   Update `next.config.js`:
   ```javascript
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'lh3.googleusercontent.com',
           port: '',
           pathname: '/**',
         },
       ],
     },
   }
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   Open [http://localhost:3000](http://localhost:3000)

### Production Deployment

```bash
npm run build
npm start
```

## Implementation Status

### ✅ Completed Features (Production Ready)

#### Core Systems
- **Authentication**: Dual provider system with account linking
- **Transaction Management**: Complete CRUD with Nigerian intelligence
- **Settings & Preferences**: Full profile and notification management
- **Dashboard Analytics**: Real-time insights with drill-down capabilities
- **Notification System**: Priority-based alerts with Nigerian context

#### Nigerian Market Features
- **Merchant Recognition**: 100+ local businesses and service providers
- **Economic Intelligence**: Salary cycles, seasonal adjustments, inflation awareness
- **Cultural Categories**: Family support, religious giving, school fees optimization
- **Transport Integration**: Uber, Bolt, BRT, traditional transport recognition

### 🎯 Current Sprint (October 2025)

#### Budget System API Integration
- **Priority**: Connect 5 budget screens to existing APIs
- **Status**: APIs complete, UI-API integration in progress
- **Timeline**: 1-2 weeks

#### Smart Goals System Enhancement
- **Status**: UI complete with full theme support
- **Features**: Nigerian templates, milestone tracking, progress visualization
- **API Integration**: Ready for connection

### 🚀 Launch Preparation

#### Performance Optimization
- Database indexing for optimal query performance
- API response caching for dashboard and analytics
- Mobile optimization for Nigerian network conditions
- Loading state improvements across all interfaces

#### Comprehensive Testing
- End-to-end user journey testing
- Nigerian context scenario testing
- Mobile device optimization verification
- Error handling and edge case coverage

## API Documentation

### ✅ Core APIs (IMPLEMENTED)

#### Authentication
- `POST /api/auth/signin` - Dual provider authentication
- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/forgot-password` - Password reset flow
- `POST /api/auth/link-account` - Account linking functionality

#### Transaction Management
- `GET /api/transactions` - Advanced filtering with Nigerian intelligence
- `POST /api/transactions` - Smart categorization and pattern detection
- `PUT /api/transactions/[id]` - Update with change tracking
- `DELETE /api/transactions/[id]` - Delete with impact analysis

#### Budget Management (Ready for Integration)
- `GET /api/budgets` - Monthly budgets with Nigerian context
- `POST /api/budgets` - AI-powered budget creation
- `PUT /api/budgets/[month]` - Update with seasonal adjustments
- `POST /api/budgets/transfer` - Category reallocation
- `POST /api/budgets/ai-assistant` - AI optimization engine

#### Goals System
- `GET /api/goals` - Goals with filtering and Nigerian insights
- `POST /api/goals` - Create with templates and auto-save rules
- `PUT /api/goals/[id]` - Update goals and preferences
- `POST /api/goals/[id]/contribute` - Add contributions with celebrations

#### Settings & Notifications
- `GET /api/settings` - User preferences with Nigerian context
- `PUT /api/settings` - Real-time preference updates
- `GET /api/notifications` - Priority-based notification retrieval
- `PUT /api/alert-settings` - Notification preference management

#### Enhanced Dashboard
- `GET /api/dashboard` - Real-time overview with AI insights
- Interactive data with drill-down capabilities
- Auto-refresh with performance optimization

## Nigerian Market Intelligence

### ✅ Cultural Context (IMPLEMENTED)
- **Salary Optimization**: End-of-month payment recognition (25th-28th)
- **Educational Planning**: School fees seasons with goal tracking
- **Festive Awareness**: December/January spending pattern management
- **Family Integration**: Extended family obligation budgeting
- **Religious Consideration**: Church/mosque contribution optimization

### ✅ Economic Intelligence (IMPLEMENTED)
- **Inflation Protection**: Automatic 10-15% economic volatility buffers
- **Transport Optimization**: Fuel price fluctuation awareness
- **Emergency Prioritization**: 3-6 months expense coverage recommendations
- **Purchasing Power**: Naira volatility impact analysis

### ✅ Local Integration (IMPLEMENTED)
- **Bank Recognition**: GTBank, First Bank, Zenith, Access, UBA integration ready
- **Merchant Database**: Shoprite, Game, KFC, Uber, Bolt, DSTV, GOtv recognition
- **Payment Systems**: Cash, POS, bank transfer, mobile money support
- **Transport Intelligence**: Okada, danfo, BRT, ride-hailing optimization

## Development Standards

### Code Quality
- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Nigerian context-aware linting rules
- **Error Handling**: Comprehensive boundary and API error management
- **Security**: Input validation, rate limiting, session management

### Performance Targets
- **Page Load**: <2 seconds on 3G networks
- **API Response**: <500ms for core endpoints
- **Error Rate**: <1% on critical user paths
- **Mobile Optimization**: Nigerian network condition awareness

### Nigerian Focus
- **Cultural Context**: All features consider local financial patterns
- **Economic Awareness**: Inflation, volatility, seasonal spending integration
- **Mobile Priority**: Responsive design for Nigerian mobile usage
- **Local Banking**: Preparation for Mono/Okra API integration

## Testing Strategy

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests with Nigerian scenarios
npm run test:e2e

# Performance testing
npm run test:performance

# Test coverage
npm run test:coverage
```

## Deployment & Production

### Environment Setup
- MongoDB Atlas or optimized self-hosted MongoDB
- Resend API for transactional emails
- CDN configuration for Nigerian users
- Error tracking and performance monitoring

### Optimization
- Database indexing for Nigerian data patterns
- Caching strategy for frequent queries
- Mobile optimization for Nigerian network conditions
- Progressive loading and offline capabilities

## Launch Readiness: 85% Complete

### ✅ Production-Ready Components
- Authentication and security systems
- Transaction management with AI categorization
- Dashboard analytics with real-time insights
- Settings and notification management
- Smart Goals with full theme support

### 🎯 Final Sprint (3 Weeks to Launch)
- Budget screen API integration
- Performance optimization and testing
- Nigerian market validation
- Mobile optimization verification

## Post-Launch Roadmap

### Priority 2 Features (November 2025+)
- **Bank Integration**: Mono/Okra API connections for automatic transaction import
- **Investment Tracking**: Nigerian stock market and cryptocurrency awareness
- **Advanced Analytics**: Detailed financial intelligence and trend analysis
- **Social Features**: Family budget sharing and goal challenges

### Priority 3 Features (2026+)
- **Multi-currency Support**: International expansion preparation
- **Advanced AI**: Complex pattern recognition and predictive analytics
- **Marketplace Integration**: Nigerian e-commerce spending tracking
- **Progressive Web App**: Enhanced offline functionality

## Contributing

We welcome contributions from developers interested in improving financial technology for the Nigerian market.

### Development Process
1. Fork the repository and create your feature branch
2. Follow TypeScript and ESLint configurations
3. Write comprehensive tests for new features
4. Update documentation for API changes
5. Submit pull requests with detailed descriptions

### Nigerian Market Focus
When contributing, consider:
- Cultural context and Nigerian financial behaviors
- Economic conditions and local challenges
- Mobile optimization for Nigerian users
- Local payment systems and banking practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Nigerian developer and user feedback prioritized
- **Documentation**: Comprehensive guides in `/docs` directory

---

**CashNova** - Empowering Nigerians to take control of their financial future with AI-powered insights, cultural awareness, and intelligent automation. Built specifically for the Nigerian market with deep understanding of local financial patterns, economic challenges, and cultural context.

### 🚀 Ready for October 2025 Launch
**Core transaction management, settings, notifications, goals system, and Nigerian market features fully implemented and production-ready.**