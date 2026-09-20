# MeetMindAI

### AI-Powered Meeting Intelligence Platform

MeetMindAI is a full-stack AI meeting intelligence platform that transforms meeting transcripts, notes, and audio recordings into structured and actionable information.

It uses AI to generate meeting summaries, extract action items, identify responsibilities and decisions, create tasks, perform semantic search, and answer questions about previous meetings using Retrieval-Augmented Generation (RAG).

---

## 🚀 Live Demo

**Frontend:** https://meetmind-ai-rust.vercel.app/

**Backend:** https://meetmind-ai-3gwn.onrender.com/

**GitHub:** https://github.com/GayatriSatram3/meetmind-ai

---

## ✨ Features

### 🔐 Authentication & Workspace Management

- User registration and login
- JWT-based authentication
- Workspace-based access control
- Workspace member management
- Role-based workspace membership

### 📝 Meeting Intelligence

Create meetings from:

- Meeting transcripts
- Meeting notes
- Audio recordings

Automatically extract:

- Meeting summaries
- Action items
- Task owners
- Deadlines
- Decisions
- Responsibilities

### 🎙️ Audio Processing

Upload meeting audio and automatically convert it into a transcript using Whisper.

```text
Audio Upload
     ↓
FFmpeg Processing
     ↓
16 kHz Mono WAV
     ↓
Whisper Speech-to-Text
     ↓
Meeting Transcript
     ↓
AI Analysis

🤖 AI Meeting Analysis
The AI analyzes meeting content and extracts structured information:
Summary
Action Items
Decisions
Responsibilities
Deadlines
Action items are automatically converted into workspace tasks.

🔎 Semantic Meeting Search
Meeting content is converted into vector embeddings using a local MiniLM model.
Meeting Content
      ↓
MiniLM Embedding
      ↓
384-dimensional Vector
      ↓
PostgreSQL
      ↓
Cosine Similarity
      ↓
Relevant Meetings

This enables semantic search based on meaning rather than exact keyword matching.

💬 RAG-based AI Assistant
Users can ask questions about their previous meetings.
User Question
      ↓
Question Embedding
      ↓
Semantic Retrieval
      ↓
Relevant Meetings
      ↓
Context Construction
      ↓
LLM
      ↓
Grounded Answer
      ↓
Source Meetings

The assistant retrieves relevant meetings from the user's workspace and uses them as context to generate grounded answers.

📊 Workspace Analytics
The analytics dashboard provides insights into:
- Total meetings
- Meeting duration
- Action items
- Completed tasks
- Pending tasks
- Meeting activity
- AI-generated workspace insights

📋 Task Management
AI-extracted action items are automatically converted into tasks.
Tasks support:
- Pending
- In Progress
- Completed
Users can update task status and navigate back to the meeting where the task originated.

🏗️ System Architecture
                         ┌──────────────────────┐
                         │        User          │
                         │   Browser / React    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │     React + Vite     │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Render         │
                         │  Node.js + Express   │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌──────────────┐      ┌──────────────┐
       │    Neon     │       │  OpenRouter  │      │ Transformers │
       │ PostgreSQL  │       │     LLM      │      │   / Whisper  │
       └──────┬──────┘       └──────────────┘      └──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │       Prisma        │
       │        ORM          │
       └─────────────────────┘

                  Semantic Search / RAG
                            │
                            ▼
                 ┌─────────────────────┐
                 │ MiniLM Embeddings   │
                 │ 384-dimensional     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Cosine Similarity   │
                 │     Retrieval       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    RAG Pipeline     │
                 │ Retrieve → Context  │
                 │ → LLM → Answer      │
                 └─────────────────────┘
🛠️ Tech Stack
Frontend
- React.js
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- CSS
Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- Multer
- FFmpeg
Database
- PostgreSQL
- Prisma ORM
- Neon PostgreSQL
AI / ML
- OpenRouter
- Whisper
- Transformers.js
- Xenova/all-MiniLM-L6-v2
- Retrieval-Augmented Generation (RAG)
- Cosine Similarity
- Local Embeddings
Deployment
- Vercel
- Render
- Neon
Development Tools
- Git
- GitHub
- VS Code
- Thunder Client

🔄 Application Workflow
1. Create a Meeting
Users can create meetings using:
- Transcript
- Notes
- Audio
2. Process Meeting Content
For audio:
Audio
  ↓
FFmpeg
  ↓
Whisper
  ↓
Transcript
For transcripts and notes:
Transcript / Notes
       ↓
  AI Analysis
3. Generate Meeting Intelligence
The AI extracts:
Summary
Action Items
Decisions
Responsibilities
Deadlines
4. Store Meeting Data
Meeting information, AI analysis, tasks, and embeddings are persisted in PostgreSQL.
5. Generate Embeddings
Meeting content is converted into local MiniLM embeddings.
6. Search Meetings
Search queries are converted into embeddings and compared with stored meeting embeddings using cosine similarity.
7. Ask AI
The RAG assistant retrieves relevant meetings and provides them as context to the LLM before generating the answer.

🔐 Authentication & Authorization
MeetMindAI uses JWT-based authentication and workspace-level authorization.
User Login
    ↓
JWT Token
    ↓
Authorization Header
    ↓
Authentication Middleware
    ↓
User Identity
    ↓
Workspace Membership Check
    ↓
Protected Resource

Workspace authorization ensures that users can access only the meetings, tasks, search results, and AI context belonging to their workspace.

🧠 RAG Implementation
MeetMindAI implements a workspace-scoped Retrieval-Augmented Generation pipeline.

Retrieval
1. Convert the user's question into an embedding.
2. Retrieve meetings belonging to the user's workspace.
3. Compare the question embedding with meeting embeddings.
4. Rank meetings using cosine similarity.
5. Select the most relevant meetings.

Context Construction
Relevant meetings provide context containing:
- Meeting title
- Transcript or description
- AI summary
- Action items
- Decisions

Generation
The retrieved context is provided to the LLM to generate the final answer.
The system instructs the model to use the retrieved meeting information as the factual source and avoid inventing information.

🗄️ Database Design
MeetMindAI uses PostgreSQL with Prisma ORM.
Core entities include:
User
 │
 ├── WorkspaceMember
 │
 └── Meeting
         │
         └── Task


Workspace
 │
 ├── WorkspaceMember
 ├── Meeting
 └── Task

Meetings store:
- AI summary
- Action items
- Decisions
- Responsibilities
- Embeddings
Embeddings are stored as JSON vectors and compared using cosine similarity in the application layer.

📡 API Structure
Authentication
POST /api/auth/register
POST /api/auth/login

Workspaces
POST /api/workspaces
GET  /api/workspaces

Meetings
POST /api/meetings
GET  /api/meetings/:meetingId
GET  /api/meetings/workspace/:workspaceId

Tasks
POST  /api/tasks
GET   /api/tasks/:workspaceId
PATCH /api/tasks/:taskId/status

Audio
POST /api/audio/:workspaceId

Semantic Search
GET /api/search/semantic/:workspaceId?q=<query>
RAG / Ask AI
POST /api/rag/:workspaceId

Analytics
GET /api/analytics/:workspaceId
GET /api/analytics/:workspaceId/ai-summary

🎯 Key Engineering Decisions
Local Embeddings
MeetMindAI uses a local MiniLM embedding model through Transformers.js instead of depending on a paid embedding API.
This provides:
- Local embedding generation
- No per-request embedding API cost
- 384-dimensional vectors
- Consistent semantic search

PostgreSQL + Prisma
PostgreSQL provides relational persistence for:
- Users
- Workspaces
- Meetings
- Tasks
- Workspace memberships
Prisma provides type-safe database access and simplifies schema and migration management.

RAG

A general-purpose LLM does not automatically know the contents of a user's meetings.
RAG allows MeetMindAI to:
Retrieve relevant meeting information
              ↓
Provide it as context
              ↓
Generate a meeting-specific answer

🚀 Deployment

The application is deployed using:
Frontend  → Vercel
Backend   → Render
Database  → Neon PostgreSQL
Environment-specific secrets such as database credentials, JWT secrets, and API keys are stored outside the source code.

💻 Local Development
Prerequisites
- Node.js
- PostgreSQL
- Git

Clone Repository
git clone https://github.com/GayatriSatram3/meetmind-ai.git
cd meetmind-ai

Backend Setup
cd backend
npm install

Create a .env file:
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173

Run Prisma:
npx prisma generate
npx prisma migrate dev

Start the backend:
npm run dev

Backend:
http://localhost:5000

Frontend Setup
Open another terminal:
cd frontend
npm install
npm run dev

Frontend:
http://localhost:5173

🔮 Future Improvements

- Real-time collaborative meeting notes
- Calendar integration
- Email notifications for deadlines
- More advanced meeting analytics
- Dedicated vector database integration
- Support for additional audio formats and languages
- Team-level AI insights

👩‍💻 Author
Satram Gayatri
Computer Science and Engineering
GitHub: https://github.com/GayatriSatram3

⭐ Project Highlights

MeetMindAI combines:
Full-Stack Development
        +
Artificial Intelligence
        +
Speech-to-Text
        +
RAG
        +
Semantic Search
        +
PostgreSQL
        +
Cloud Deployment
        +
Authentication
        +
Workspace Authorization
into a single end-to-end AI meeting intelligence platform.
