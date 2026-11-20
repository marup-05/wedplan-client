# WedPlan — Wedding Planning Platform

## Project Description
WedPlan is a wedding planning platform where customers can discover wedding services, send booking requests, and manage their bookings. Vendors can manage their services and bookings, while admins manage users, services, and platform activities.

## Important Features
- Role-based authentication for Customers and Vendors.
- Google and email/password authentication.
- Browse, search, and filter wedding services.
- Vendors can add, update, delete, and manage service availability.
- Service image uploads using ImgBB.
- Admin service approval and rejection.
- Booking request management.
- Free and Premium vendor subscription plans.
- Stripe Premium subscription integration (to be completed).
- Separate dashboards for Customers, Vendors, and Admins.

## Technology Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI:** shadcn/ui, Lucide React
- **Authentication:** Better Auth
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Hosting:** ImgBB
- **Notifications:** Sonner
- **Payment:** Stripe (planned)

## Installation Instructions

Clone the repositories:

git clone https://github.com/marup-05/wedplan-client.git
git clone https://github.com/marup-05/wedplan-server.git


Install dependencies in both folders:

npm install

Create `.env.local` in the client folder and `.env` in the server folder. Add the required environment variables.



## How to Run the Project Locally

**Start the Backend:**

cd wedplan-server
npm run dev

**Start the Frontend in another terminal:**


cd wedplan-client
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

The backend runs on port `5000` by default.