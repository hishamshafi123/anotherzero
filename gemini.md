
# Anothezero CRM - Project Explanation

## 1. Project Overview

This project is a single-tenant CRM web application designed for managing Instagram and Facebook direct messages and comments, running bulk DM campaigns, and tracking user engagement and purchases. The application is built with Next.js, React, TypeScript, and Tailwind CSS. The backend is currently simulated with mock data, with plans to integrate with Supabase for the database and n8n for orchestration.

## 2. Project Structure

```
crm-dashboard-nextjs/
├── .next/              # Next.js build output
├── node_modules/       # Project dependencies
├── public/             # Static assets (images, fonts)
├── src/                # Application source code
│   ├── app/            # Next.js App Router pages
│   │   ├── globals.css # Global stylesheets
│   │   ├── layout.tsx  # Root application layout
│   │   └── page.tsx    # Home page component
│   ├── components/     # Reusable React components
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── CardContent.tsx
│   │   ├── CardHeader.tsx
│   │   ├── CardTitle.tsx
│   │   ├── ChannelSwitch.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FilterPill.tsx
│   │   ├── Kpi.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarLink.tsx
│   │   ├── StepNumber.tsx
│   │   ├── TemplateCard.tsx
│   │   └── Topbar.tsx
│   └── data/             # Mock data
│       └── mockData.ts
├── .gitignore
├── next.config.mjs     # Next.js configuration
├── package.json        # Project metadata and dependencies
├── postcss.config.mjs  # PostCSS configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 3. Component Breakdown

### `app/layout.tsx`

This is the root layout of the application. It sets up the HTML structure, includes the global stylesheet, and defines the main layout, which consists of a `Sidebar`, a `Topbar`, and the main content area.

### `app/page.tsx`

This is the home page of the application. It renders the `Dashboard` component.

### `components/`

This directory contains all the reusable React components.

*   **`Dashboard.tsx`**: The main component that assembles the entire dashboard UI, including KPIs, charts, and tables.
*   **`Sidebar.tsx`**: The left-hand navigation panel, providing links to different sections of the application.
*   **`Topbar.tsx`**: The header of the application, containing a search bar and filter controls.
*   **`Card.tsx`, `CardHeader.tsx`, `CardTitle.tsx`, `CardContent.tsx`**: A set of components for creating card-based UI elements.
*   **`Kpi.tsx`**: Displays a single Key Performance Indicator (KPI) in a card.
*   **`Badge.tsx`**: A component for displaying small status indicators.
*   **`SectionTitle.tsx`**: A component for displaying a title for a section of the dashboard.
*   **`FilterPill.tsx`**: A button used for filtering data by a specific time range (e.g., 7d, 30d, 90d).
*   **`ChannelSwitch.tsx`**: A component that allows switching between different channels (e.g., All, Instagram, Facebook).
*   **`StepNumber.tsx`**: A component for displaying a numbered step in a sequence.
*   **`TemplateCard.tsx`**: A card component for displaying message templates.
*   **`SidebarLink.tsx`**: A single link item used within the `Sidebar`.

## 4. Data

### `data/mockData.ts`

This file contains all the mock data used to simulate a functional backend. It includes data for:

*   **`purchasesByDay`**: An array of objects representing daily purchases and revenue.
*   **`campaignCTr`**: An array of objects representing the Click-Through Rate (CTR) for different campaigns.
*   **`channelSplit`**: An array of objects representing the distribution of contacts between Instagram and Facebook.
*   **`campaigns`**: An array of objects representing different marketing campaigns.
*   **`abTests`**: An array of objects representing A/B test data.
*   **`recentContacts`**: An array of objects representing recently active contacts.

## 5. Running the Application

To run the application in a local development environment, navigate to the `crm-dashboard-nextjs` directory and run the following command:

```bash
npm run dev
```

This will start the development server, and the application will be available at `http://localhost:3000`.

## 6. Deployment

To deploy the application to a live server, it is recommended to use Vercel, the creators of Next.js.

1.  **Push to a Git Repository:** Upload the `crm-dashboard-nextjs` directory to a GitHub, GitLab, or Bitbucket account.
2.  **Import to Vercel:**
    *   Sign up for a free account at [vercel.com](https://vercel.com).
    *   From your Vercel dashboard, click "Add New..." -> "Project".
    *   Import the Git repository you just created.
3.  **Deploy:** Vercel will automatically detect that it's a Next.js application and configure the build settings for you. Simply click the "Deploy" button.

Vercel will then build and deploy your application, providing you with a live URL.
