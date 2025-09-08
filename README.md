# CashNova

CashNova is an AI-powered personal finance management platform specifically designed for the Nigerian market. Built with modern web technologies and powered by intelligent automation, CashNova reimagines how Nigerians manage their finances with cultural context and economic awareness.

**"Your Finances. Reimagined."**

## Key Features

### Authentication & Security
- **Dual Authentication System**: Google OAuth and email/password with seamless account linking
- **Enhanced Security**: Rate limiting, CSRF protection, secure session management
- **Password Recovery**: Token-based reset flow with email verification
- **Session Flexibility**: Configurable session duration (7-day default, 30-day extended)
- **Protected Routes**: Middleware-based authentication with comprehensive security

### Comprehensive Transaction Management
- **Smart Transaction Recording**: AI-powered categorization with Nigerian merchant recognition
- **Intelligent Categorization**: Automatic recognition of GTBank, Shoprite, Uber, DSTV, and 100+ local merchants
- **Recurring Transaction Detection**: Automatic identification of salary, rent, and bill patterns
- **Advanced Filtering**: Search by date range, category, amount, merchant, and payment method
- **Real-time Sync**: Instant transaction updates with optimistic UI feedback
- **Nigerian Context**: Family support, church/mosque, school fees, and transport optimization

### Intelligent Budget Management
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

### AI-Powered Financial Intelligence
- **Personalized Insights**: Contextual spending analysis with actionable recommendations
- **Nigerian Market Awareness**: Inflation adjustments, fuel price volatility, economic seasonal patterns
- **Predictive Analytics**: Cash flow forecasting and overspending prevention
- **Smart Categorization**: Automatic merchant recognition and pattern learning
- **Cultural Financial Advice**: Family support budgeting, religious giving optimization
- **Economic Volatility Planning**: Inflation buffers and emergency fund prioritization

### Advanced Notification System
- **Real-time Alerts**: Smart notifications for budget thresholds, spending patterns, and milestones
- **Nigerian Context Notifications**: Salary cycle reminders, school fee season alerts, festive warnings
- **Priority-based Alerts**: Urgent, high, medium, and low priority notifications with visual indicators
- **Customizable Preferences**: User-controlled notification types and delivery methods
- **Achievement Celebrations**: Milestone notifications for budget goals and savings achievements
- **Interactive Notifications**: Click-to-action notifications that route to relevant screens

### Comprehensive Goals System
- **Nigerian-Specific Goals**: Emergency fund (3-6 months), school fees savings, rent advance planning
- **Smart Goal Templates**: Pre-configured goals based on Nigerian financial patterns
- **Milestone Tracking**: Automatic progress tracking at 25%, 50%, 75%, and 100% completion
- **Contribution Management**: Manual and automatic savings with salary cycle integration
- **Progress Visualization**: Interactive progress bars with on-track status indicators
- **Achievement System**: Celebration notifications and progress sharing capabilities

### Advanced Analytics & Reporting
- **Interactive Dashboards**: Real-time financial overview with customizable widgets and drill-down capabilities
- **Visual Data Representation**: Charts and graphs optimized for Nigerian spending patterns
- **Category Performance**: Detailed breakdown of spending efficiency with budget comparisons
- **Weekly/Monthly Trends**: Automated financial summaries with trend analysis
- **Clickable Analytics**: Drill-down from charts to filtered transaction views
- **Savings Progress Tracking**: Visual progress indicators for financial goals with achievement tracking

### Nigerian Market Specialization
- **Local Merchant Database**: Recognition of Nigerian banks, retailers, and service providers
- **Salary Cycle Intelligence**: End-of-month payment pattern optimization and reminders
- **School Fee Planning**: January and September budget adjustments with goal tracking
- **Festive Season Budgeting**: December/January increased spending accommodation
- **Cultural Categories**: Family support, church/mosque, extended family obligations
- **Economic Context**: Naira volatility awareness and purchasing power analysis

### User Experience & Design
- **Mobile-First Design**: Responsive layout optimized for Nigerian mobile usage patterns
- **Dark/Light Themes**: User preference-based theming with system integration
- **Progressive Web App**: Native app-like experience with offline capability
- **Accessibility**: WCAG 2.1 compliant design with screen reader support
- **Interactive Elements**: Clickable charts, actionable insights, and seamless navigation
- **Real-time Updates**: Live data refresh with auto-sync capabilities

## Tech Stack

### Frontend
- **Next.js 14**: App Router with TypeScript for type safety and performance
- **Tailwind CSS**: Utility-first styling with custom Nigerian market themes
- **Chart.js**: Interactive data visualizations optimized for financial data
- **React Hook Form**: Optimized form handling with comprehensive validation
- **Sonner**: Toast notifications for real-time user feedback

### Backend & APIs
- **Next.js API Routes**: RESTful endpoints with comprehensive error handling
- **MongoDB**: Scalable NoSQL database with Mongoose ODM
- **NextAuth.js**: Authentication with multiple providers and account linking
- **Real-time Notifications**: Complete notification system with priority management
- **Advanced Aggregation**: Optimized database queries for dashboard analytics

### Security & Infrastructure
- **bcryptjs**: Password hashing with salt rounds
- **Rate Limiting**: API protection against abuse with intelligent throttling
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Monitoring**: Structured logging and error tracking
- **Session Management**: Secure session handling with configurable duration

### External Integrations
- **Resend API**: Transactional email service for notifications
- **Nigerian Banking APIs**: Integration ready for major local banks
- **SMS Services**: Local Nigerian SMS providers for notifications
- **Currency APIs**: Real-time exchange rates with Naira optimization

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
   Create a `.env.local` file with the following:
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
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

For production deployment, ensure proper environment variables and run:
```bash
npm run build
npm start
```

## Project Architecture

```
src/
├── app/                         # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── transactions/        # Transaction CRUD with smart categorization
│   │   ├── budgets/            # Complete budget management APIs
│   │   ├── goals/              # Goals system with Nigerian templates
│   │   ├── alert-settings/     # Notification preferences management
│   │   ├── notifications/      # Real-time notification system
│   │   └── dashboard/          # Enhanced dashboard with interactions
│   ├── components/             # Reusable UI Components
│   │   ├── charts/             # Interactive financial visualizations
│   │   ├── PieChart.tsx        # Real data spending categories
│   │   ├── LineChart.tsx       # Weekly spending trends
│   │   └── MainNavigation.tsx  # Enhanced with notification dropdown
│   ├── dashboard/              # Main application interface
│   ├── budget-planner/         # Complete 5-screen budget system
│   │   ├── screen-1/           # Monthly Overview
│   │   ├── screen-2/           # Category Budgets
│   │   ├── screen-3/           # Smart Budget Assistant
│   │   ├── screen-4/           # Budget Alerts & Reminders
│   │   └── screen-5/           # Budget Calendar
│   ├── transactionHistory/     # Transaction management with filtering
│   ├── addTransaction/         # Enhanced transaction creation
│   ├── smartGoals/            # Goals management interface
│   └── settings/               # User preferences and account
├── models/                     # MongoDB/Mongoose schemas
│   ├── User.ts                 # User profile and preferences
│   ├── Transaction.ts          # Smart transaction records
│   ├── Budget.ts               # Monthly budget management
│   ├── Goal.ts                 # Goals with milestone tracking
│   ├── AlertSettings.ts        # Notification preferences
│   └── Notification.ts         # Generated alerts and notifications
├── lib/                        # Utility functions and configurations
│   └── mongodb.ts              # Database connection with optimization
└── utils/                      # Helper functions
    ├── authOptions.ts          # NextAuth configuration
    └── currency.ts             # Nigerian Naira formatting
```

## Implementation Status

### Completed Features

#### Core Authentication System
- Dual provider authentication (Google OAuth + Email/Password)
- Account linking and unlinking capabilities
- Secure session management with configurable duration
- Password reset flow with email verification
- Rate limiting and brute force protection

#### Advanced Transaction Management
- Complete CRUD operations with real-time updates
- AI-powered smart categorization with 100+ Nigerian merchant recognition
- Recurring transaction pattern detection and suggestions
- Advanced filtering and search capabilities
- Nigerian merchant database (GTBank, Shoprite, Uber, DSTV, etc.)
- Family support, church/mosque, and school fees categorization

#### Comprehensive Budget Management (5 Complete Screens)
- **Screen 1**: Monthly Overview with real-time spending vs budget tracking
- **Screen 2**: Category Budgets with transfer capabilities and real-time updates
- **Screen 3**: Smart Budget Assistant with AI-powered Nigerian context optimization
- **Screen 4**: Budget Alerts & Reminders with customizable notification system
- **Screen 5**: Budget Calendar with daily spending visualization and bill tracking

#### Intelligent Notification System
- Real-time budget threshold alerts with priority management
- Nigerian context notifications (salary cycle, school fees, festive seasons)
- Customizable notification preferences with multiple delivery channels
- Achievement celebrations for budget milestones and goal completions
- Interactive notifications with click-to-action functionality

#### Complete Goals System
- Nigerian-specific goal templates (emergency fund, school fees, rent advance)
- Automatic milestone tracking at 25%, 50%, 75%, and 100% completion
- Smart contribution management with salary cycle integration
- Progress visualization with on-track status indicators
- Achievement notification system with celebration prompts

#### Enhanced Dashboard System
- Real-time financial overview with interactive drill-down capabilities
- Clickable category charts that filter to transaction history
- AI-powered insights with actionable recommendations and direct navigation
- Nigerian economic context integration with urgent action alerts
- Auto-refresh functionality with performance optimization

#### Nigerian Market Integration
- Automatic recognition of 100+ local merchants and service providers
- Salary cycle optimization for end-of-month payment patterns (25th-28th)
- School fees and festive season budget adjustments with goal tracking
- Cultural spending categories with intelligent recommendations
- Economic volatility considerations and inflation awareness

### Current Sprint (October 2025 Launch Preparation)

#### Goals UI Implementation
- Goal creation flow with Nigerian template selection
- Progress tracking visualization with milestone celebrations
- Contribution interface with auto-save setup
- Goal management dashboard with filtering and status indicators

#### Performance Optimization
- Database indexing for optimal query performance
- API response caching for dashboard and analytics
- Mobile optimization for Nigerian network conditions
- Loading state improvements across all interfaces

#### Comprehensive Testing
- End-to-end user journey testing
- Nigerian context scenario testing
- Mobile device optimization and testing
- Error handling and edge case coverage

## API Documentation

### Core APIs

#### Authentication
- `POST /api/auth/signin` - User authentication with dual provider support
- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/forgot-password` - Password reset with email verification

#### Transaction Management
- `GET /api/transactions` - Advanced filtering with Nigerian merchant recognition
- `POST /api/transactions` - Smart categorization and recurring detection
- `PUT /api/transactions/[id]` - Update with change tracking
- `DELETE /api/transactions/[id]` - Delete with impact analysis

#### Budget Management
- `GET /api/budgets` - Comprehensive budget data with insights
- `POST /api/budgets` - Create/generate with AI optimization
- `PUT /api/budgets/[month]` - Update with Nigerian context
- `POST /api/budgets/transfer` - Category reallocation with validation
- `POST /api/budgets/ai-assistant` - AI budget optimization

#### Goals System
- `GET /api/goals` - Goals with filtering and progress tracking
- `POST /api/goals` - Create with Nigerian templates
- `PUT /api/goals/[id]` - Update goals and preferences
- `POST /api/goals/[id]/contribute` - Add contributions with milestone tracking

#### Notification System
- `GET /api/notifications` - Retrieve with status filtering
- `POST /api/notifications` - Generate alerts and mark as read
- `GET /api/alert-settings` - User notification preferences
- `PUT /api/alert-settings` - Update notification settings

#### Enhanced Dashboard
- `GET /api/dashboard` - Real-time overview with Nigerian context
- Interactive data with drill-down capabilities
- Auto-refresh support with performance optimization

## Nigerian Market Features

### Cultural Intelligence
- **Salary Cycle Optimization**: End-of-month payment pattern recognition (25th-28th)
- **School Fee Planning**: January and September budget adjustments with goal tracking
- **Festive Season Awareness**: December/January spending patterns with warnings
- **Family Support Integration**: Extended family obligation budgeting
- **Religious Giving**: Church/mosque contribution tracking and optimization

### Economic Context
- **Inflation Buffer**: Automatic 10-15% adjustments for economic volatility
- **Transport Optimization**: Fuel price fluctuation awareness and route suggestions
- **Emergency Fund Priority**: 3-6 months expense coverage with cultural context
- **Purchasing Power Analysis**: Naira volatility impact on spending power

### Local Integration
- **Merchant Recognition**: GTBank, First Bank, Zenith, Access, UBA, Shoprite, Game, KFC, Uber, Bolt, DSTV, GOtv
- **Payment Methods**: Cash, POS, bank transfer, mobile money integration
- **Category Intelligence**: Transport (okada, danfo, Uber), Bills (NEPA, water, internet)

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

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests with Nigerian scenarios
npm run test:e2e

# Test coverage
npm run test:coverage
```

## Performance & Deployment

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Nigerian developer and user feedback prioritized
- **Documentation**: Comprehensive guides in `/docs` directory

---

**CashNova** - Empowering Nigerians to take control of their financial future with AI-powered insights, cultural awareness, and intelligent automation. Built specifically for the Nigerian market with deep understanding of local financial patterns, economic challenges, and cultural context.