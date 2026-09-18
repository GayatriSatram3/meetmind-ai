# MeetMindAI 🧠

> AI-powered Meeting Intelligence Platform that transforms meeting transcripts into structured insights, actionable tasks, decisions, and searchable knowledge.

## 🎯 Problem

Important information from meetings is often scattered across long conversations, making it difficult to remember:

- What was discussed?
- What decisions were made?
- Who is responsible for each task?
- What are the deadlines?
- What was discussed in previous meetings?

MeetMindAI solves this by using AI to automatically analyze meetings and turn unstructured conversation into useful, searchable information.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes

### 👥 Team Workspaces
- Create workspaces
- Add and remove members
- Workspace roles: Owner, Admin, Member
- Workspace-level authorization

### 📝 Meeting Intelligence
- Create meetings using transcripts
- AI-generated meeting summaries
- Extract action items
- Identify task owners
- Extract deadlines
- Extract decisions
- Identify responsibilities

### ✅ Task Management
- Automatically create tasks from AI-extracted action items
- Track task status
- Update tasks between:
  - Pending
  - In Progress
  - Completed

### 🔎 Smart Search
- Keyword-based meeting search
- Semantic search using embeddings
- Search within a workspace
- Rank meetings using cosine similarity

### 🤖 Ask AI
- Ask natural-language questions about meetings
- Retrieval-Augmented Generation (RAG)
- Conversation history support
- Answers grounded in meeting data
- Meeting sources included with responses

### 📊 Analytics
- Meeting statistics
- Task statistics
- Meeting activity insights
- AI-generated analytics summaries

---

## 🧠 AI & RAG Architecture

MeetMindAI combines traditional backend development with AI and Retrieval-Augmented Generation.

```text
                Meeting Transcript
                       │
                       ▼
                ┌──────────────┐
                │  AI Analysis │
                └──────┬───────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Summary     Action Items   Decisions
                       │
                       ▼
                     Tasks


Meeting Data
     │
     ▼
Local Embedding Model
     │
     ▼
384-dimensional Embedding
     │
     ▼
PostgreSQL JSON Storage
     │
     ▼
Cosine Similarity Search
     │
     ▼
Relevant Meetings
     │
     ▼
       RAG Context
          │
          ▼
     LLM / OpenRouter
          │
          ▼
     Grounded Answer