FrontEnd at:  http://localhost:3000.

Run Redis, MongoDB, then:
- cd server -->> npm install -->> node index.js
- cd client -->> npm install -->> npm run dev
####Key Logic and Architecture Decisions####
1. Technology Stack
Backend: Node.js + Express –> simple and scalable for API and background processing.

Database: MongoDB –> ideal for storing job listings and logs due to its flexibility.

Queue: BullMQ + Redis –> handles asynchronous, fault-tolerant background processing of job data.

Frontend: Next.js –> supports SSR and API routes; great for admin dashboards.

WebSocket: Socket.IO –> enables real-time updates to the UI when imports complete.

2. Scalable Job Import Design
Job feeds are pulled from XML APIs.

The XML is parsed into JSON using xml2js.

Each job feed is added to a BullMQ queue.

A worker processes jobs in the background, storing or updating them in MongoDB using upsert.

Each import creates a log entry with totals and errors.

This architecture is scalable:

You can add more feeds easily to the array.

Workers can scale horizontally.

Queues can retry or delay jobs if needed.

3. Real-Time Notifications
After each import, the backend emits a WebSocket event using Socket.IO.

The frontend listens for import_log events and updates the log table live, without refreshing.

This improves UX and reflects production-grade feedback loops.

4. Error Handling
Job imports catch and log each individual failure (e.g., DB validation errors).

Failed jobs are saved in the failedJobs array in each log entry for debugging.

5. UI/UX Design Decisions
Frontend uses Tailwind CSS for rapid styling and a clean futuristic theme.

Dashboard is intentionally kept lightweight with:

Glassmorphism-inspired cards

Color-coded status indicators (green/new, yellow/updated, red/failed)

Mobile-friendly responsive layout

Admin can trigger imports manually or wait for hourly cron jobs.

6. Local Setup
App runs fully locally: uses local Redis, MongoDB, and localhost API calls.
Easily extensible to deployment on Render/Vercel if needed later.
