# 🏆 Tournament Management System (Swiss Pairing)

A full-stack web application designed to manage racquet sports tournaments (specifically Pickleball). Built using the **MEAN Stack** (MongoDB, Express, Angular, Node.js), this system handles team registration, automated round generation using **Swiss Pairing logic**, score validation, and real-time leaderboard tracking.

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage Workflow](#-usage-workflow)
- [Project Architecture](#-project-architecture)
- [API Documentation](#-api-documentation)

---

##  Features

###  Team Management
- **Registration:** Add teams with a team name and player names.
- **CRUD Operations:** Edit team details or remove teams before the tournament starts.

###  Tournament Logic
- **Round 1 (Random):** The first round randomly shuffles teams to create initial pairings.
- **Swiss Pairing System:** Subsequent rounds automatically pair teams with similar win records (e.g., winners play winners) to ensure competitive balance.
- **Bye System:** Automatically handles odd numbers of teams by assigning a "Bye" (automatic win) to the leftover team.

###  Scoring & Validation
- **Rule Enforcement:**
  - Games must be played to at least **11 points**.
  - A team must win by a margin of **2 points**.
- **Real-time Updates:** Scores are validated on the frontend before being sent to the backend.

###  Analytics & Leaderboard
- **Live Leaderboard:** Tracks Wins, Losses, and Points For each round.
- **Winner Declaration:** Calculates the tournament champion based on total wins and aggregate scores.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Angular (v14+) | Component-based UI, HttpClient, Routing |
| **Backend** | Node.js & Express | RESTful API, Route handling |
| **Database** | MongoDB | NoSQL database for storing Teams, Rounds, and Matches |
| **ODM** | Mongoose | Schema modeling for MongoDB |
| **Styling** | CSS3 | Custom responsive styling |

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
1.  **Node.js** (v14 or higher)
2.  **npm** (Node Package Manager)
3.  **MongoDB** (Local instance running on `127.0.0.1:27017`)
4.  **Angular CLI** (`npm install -g @angular/cli`)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
clone repo
git clone https://github.com/ranju763/FSD-Tournaments.git
cd FSD-Tournaments

Run backend
cd backend
npm run dev

run Frontend
cd frontend
ng serve
