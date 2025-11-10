# Housery POS System

A comprehensive Point of Sale (POS) system with full inventory management, customer/supplier tracking, and payment management capabilities.

## Features

- **Dashboard**: Real-time stats, alerts, and quick actions
- **Sales Management**: Create sales with flexible customer options (walk-in, saved, or new)
- **Stock Management**: Hierarchical inventory system (Category → Brand → Type → Size)
- **Customer Management**: Track customer transactions and receivable payments
- **Supplier Management**: Manage supplier purchases and payable payments
- **Payment Tracking**: Centralized view of all receivables and payables
- **Alerts System**: Low stock alerts and payment reminders

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API with localStorage

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone or download the project**
   \`\`\`bash
   # If using git
   git clone <repository-url>
   cd housery-pos-system
   
   # Or download and extract the ZIP file
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

## Running Locally

1. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Login**
   
   Enter the default PIN: **1234**

## Default Configuration

- **Default PIN**: 1234 (can be changed in `lib/auth-context.tsx`)
- **Sample Data**: The app comes with mock data for demonstration purposes
- **Storage**: Uses browser localStorage for authentication state

## Project Structure

\`\`\`
housery-pos-system/
├── app/                      # Next.js app router pages
│   ├── alerts/              # Alerts page
│   ├── customers/           # Customer management
│   ├── login/               # Login page
│   ├── payments/            # Payment tracking
│   ├── sales/               # Sales interface
│   ├── stock/               # Inventory management
│   ├── suppliers/           # Supplier management
│   └── page.tsx             # Dashboard
├── components/              # React components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Navigation and layout
│   ├── sales/               # POS components
│   ├── stock/               # Stock management components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities and core logic
│   ├── auth-context.tsx     # Authentication
│   ├── data-store.ts        # Mock data store
│   └── types.ts             # TypeScript types
└── README.md
\`\`\`

## Using the System

### Making a Sale
1. Navigate to **Sales** → **New Sale**
2. Select items from the inventory
3. Choose quantity in dozens
4. Select customer type (Walk-in, Saved, or New)
5. Enter payment amount (can be partial)
6. Complete the sale

### Managing Stock
1. Go to **Stock** page
2. Filter by category, brand, type, or size
3. Add new items using the "Add Stock" button
4. Set low stock thresholds for alerts

### Managing Payments
1. View all payments in the **Payments** page
2. Filter by type (Receivable/Payable) and status
3. Record payments from **Customers** or **Suppliers** pages

### Viewing Alerts
1. Check the **Dashboard** for quick alert overview
2. Visit **Alerts** page for detailed notifications
3. Alerts include low stock and upcoming/overdue payments

## Customization

### Changing the PIN
Edit `lib/auth-context.tsx` and modify the `CORRECT_PIN` constant:
\`\`\`typescript
const CORRECT_PIN = "1234"; // Change to your desired PIN
\`\`\`

### Adding Database Integration
The app uses a mock data store (`lib/data-store.ts`). To connect to a real database:
1. Set up your preferred database (Supabase, Neon, etc.)
2. Replace the mock functions in `lib/data-store.ts` with actual API calls
3. Update the types in `lib/types.ts` as needed

## Mobile Responsive

The application is fully mobile responsive and works seamlessly on:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

This project is proprietary software for Housery business operations.
