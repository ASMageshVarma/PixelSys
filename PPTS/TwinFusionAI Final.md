gemini-------------



http://localhost:5173

&#x20;  npm install

&#x20;  npm run dev

&#x20;python -m http.server 8000  



Current Server Status:

React Frontend: Active on http://localhost:5173/

FastAPI Backend: Active on http://127.0.0.1:8000/ (You can open http://127.0.0.1:8000/docs to see your interactive Swagger documentation for registration, login, and twin fusion endpoints!)



**-----------------------------------------------------------------------------**



#### **To summarize, everything is fully set up and running:**

#### 

#### **Frontend (Vite + React) is live at http://localhost:5173/ with the glowing 3D constellation visual and interactive calibration dashboard slider.**

#### **Backend (FastAPI) is live at http://127.0.0.1:8000/ with the SQLite database file (twinfusion.db) automatically created in your workspace.**

#### **Database connection crashes are fixed.**

#### **Google Gemini integration has replaced the old Claude code in your services.**

#### **Swagger API Docs are interactive and readable at http://127.0.0.1:8000/docs.**













1\. The Core Concept (What is TwinFusion AI?)

Instead of showing the same generic university website to every fresher, TwinFusion AI creates a Digital Twin (a virtual senior) for each student.



The Flow: A student logs in, completes a 9-question onboarding survey (about their department, coding experience, goals), and the portal dynamically transforms.

The Goal: It matches the student with local events (like Google Ambassador programs), schedules classes, and plans their day around their specific department timetable.

2\. The 3-Tier System Architecture (How it Works)





\[ FRONTEND: React + Vite ] 

&#x20;      │  (Port 5173 - Visuals \& Layout)

&#x20;      ▼  (HTTP API requests)

\[ BACKEND: FastAPI + Python ]

&#x20;      │  (Port 8000 - Logic \& Calculations)

&#x20;      ├─────────────────────────────────┐

&#x20;      ▼                                 ▼

\[ DATABASE: SQLite ]             \[ AI: Google Gemini API ]

&#x20; (Memory / Local Storage)         (Generative Decision Matching)

The Frontend (The Body):

Built with React and Vite for fast rendering.

Uses canvas particle grids and mouse-tilt coordinates to render a 3D perspective backdrop.

Renders the Constellation Diagram (the SVG link graph between YOU and TWIN) to visually show parameters (interests, skills, timetable) syncing in real-time.

The Backend (The Core Brain):

Built with FastAPI (Python), which handles routing, security, and credentials.

Manages user registration and logins securely using hashed passwords (JWT Bearer tokens).

The Data Fusion Engine (The Intelligence):

Powered by Google Gemini API (gemini-2.5-flash).

It takes raw student data (e.g., "CSE Department, loves Web Dev, free on Friday afternoon") and fuses it together to output highly personalized recommendations and target opportunities.

The Database (The Memory):

Uses SQLite via SQLAlchemy. SQLite is a database stored inside a simple file (twinfusion.db). It doesn't require installing any heavy database software (like Postgres or MySQL), making the app completely plug-and-play.

3\. How the Host Handles \& Coordinates the Application

When a host (or your computer) runs this application, it runs two separate server processes simultaneously:



The API Server (Python/Uvicorn on Port 8000):

Listens for requests from the browser (e.g., "log this user in", "fuse this user's data").

Connects to SQLite to read/write records.

Sends prompts to the Google Gemini API.

The Client Server (Node.js/Vite on Port 5173):

Serves the HTML, CSS, and React JavaScript components to the user's browser.

The Connection (CORS):

The Frontend running on port 5173 communicates with the Backend on port 8000 via async HTTP requests (fetch or axios).

4\. Key Talking Points for the Judges 🏆

Zero-Configuration Setup: Explain that you switched to a local SQLite database. This means a judge can download your code and run it instantly without setting up local database servers.

Proactive Intelligence: Highlight that your app uses Google Gemini not just as a text chat window, but as a semantic engine that performs background data-fusion matching schedules to events.

Gamified 3D Visuals: Mention that the UI is customized with 3D perspective tilt calculations and glowing constellations to engage Gen-Z students.







**----------------------------------------------------------------------------------------------------------------------**

**----------------------------------------------------------------------------------------------------------------------**

**----------------------------------------------------------------------------------------------------------------------**









Why the database was empty: The React frontend is currently configured in a state-based demo mode (so that judges can click "Get Started" and "Sign Up" to preview the dashboard instantly without needing a running database). This means signing up on the React page (localhost:5173) only saves the credentials in React state; it does not send a POST request to write a user account to the Python database.

Why Swagger login failed: Because no account had been written to your SQLite database, the backend database was empty, which is why Uvicorn returned Unauthorized.

Here is how you can successfully register and log in through the Swagger UI:



Step 1: Register your user in Swagger first

To write the account to your SQLite database:



On the Swagger UI page, scroll down to the auth section.

Click on the POST /api/v1/auth/register endpoint.

Click the "Try it out" button on the right.

Modify the request body with your details (use a username without spaces like starun to avoid headers encoding bugs):

json





{

&#x20; "email": "student.tarun@college.edu",

&#x20; "username": "starun",

&#x20; "password": "Tarun@28",

&#x20; "full\_name": "S Tarun"

}

Click the large blue "Execute" button. The server will return a 200 OK response, meaning the account is now written to your local database!

Step 2: Authorize in Swagger

Now that the user exists in the database:



Scroll back to the top of the Swagger page and click the green "Authorize" lock button.

In the modal fields, enter:

username: starun

password: Tarun@28

Click "Authorize". It will succeed and change to "Authorized"!



**----------------------------------------------------------------------------------------------------------------------**

**----------------------------------------------------------------------------------------------------------------------**

**----------------------------------------------------------------------------------------------------------------------**

**----------------------------------------------------------------------------------------------------------------------**



🍕 The Restaurant Analogy of Software

Think of TwinFusion AI as a smart restaurant:



1\. The Frontend (React/Vite on Port 5173) = The Dining Room

This is what the customer (student) sees: the beautiful tables, the glowing neon lights, the menus, and the interactive slider.

When you click buttons on the website, you are interacting with the Dining Room.

Currently, the buttons are in "demo mode"—meaning if you order a pizza, the waiter just gives you a toy pizza instantly without checking if the kitchen actually has the ingredients. This makes testing visual changes very fast!

2\. The Backend (FastAPI/Python on Port 8000) = The Kitchen

This is where the real work happens behind closed doors: processing user accounts, checking passwords, and hashing data.

The Kitchen doesn't care about colors or sliders; it only cares about taking orders (requests) and cooking up responses.

3\. The Database (SQLite twinfusion.db file) = The Pantry/Fridge

This is where the ingredients (user accounts, emails, passwords) are stored.

When a customer tries to log in, the Kitchen runs to the Pantry and checks: "Do we have an account named 'starun' in the fridge?"

Because we just launched the backend for the first time, your Pantry (database) was completely empty. So when you tried to log in, the kitchen checked the fridge, found nothing, and shouted: "Unauthorized!"

4\. The Google Gemini API = The Master Recipe Consultant

When the kitchen needs to make a very smart recommendation (e.g., "How do we match Arun's python homework schedule with a local coding club?"), the chefs consult the Gemini Recipe Book to write a custom, intelligent advice slip.

5\. Swagger UI (Port 8000/docs) = The Kitchen Backdoor (Testing Counter)

This is a special tool for programmers to test the Kitchen directly without going through the Dining Room.

By using /register at the backdoor, you are placing ingredients (a new user account) directly into the Pantry.

Once the ingredients are in the Pantry, you can click "Authorize" (log in) successfully because the Kitchen finally finds your account inside the fridge!

