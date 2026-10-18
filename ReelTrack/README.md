# ReelTrack — MERN Stack

A personal watchlist management app for tracking movies, TV series, web series, and anime. Add titles to your watchlist, update their status and ratings, search your collection, and manage everything through a simple React interface.

## Features

- Add movies, TV series, web series, and anime to your watchlist
- View all saved titles
- Update media details, status, and ratings
- Delete titles from your watchlist
- Search for titles by name
- Filter titles by type or watching status
- Track ratings and watchlist statistics
- React frontend with a simple, responsive interface
- REST API built with Node.js and Express
- MongoDB database with Mongoose
- No login or signup required

## Technologies Used

- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **API:** REST API

## Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas account
- A web browser

## Setup

1. Open the project folder in VS Code.

2. Open a terminal and navigate to the backend folder:

   ```bash
   cd backend
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file inside the `backend` folder and add your MongoDB connection string:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB URI.

5. Start the backend server:

   ```bash
   npm run dev
   ```

6. Open a **second terminal** and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

7. Install frontend dependencies:

   ```bash
   npm install
   ```

8. Start the React development server:

   ```bash
   npm run dev
   ```

9. Open the frontend URL shown in the terminal, usually [http://localhost:5173](http://localhost:5173).

Keep both terminals running while using the application.

## Backend API

Base URL: `http://localhost:5000`

### Main API Routes

- `GET /api/media` — retrieve all saved media
- `POST /api/media` — add a new movie or series
- `PUT /api/media/:id` — update an existing media entry
- `DELETE /api/media/:id` — delete a media entry

## CRUD Operations

- **Create:** Add a new title to your watchlist.
- **Read:** Display saved titles from MongoDB.
- **Update:** Edit a title's details, status, or rating.
- **Delete:** Remove a title from the watchlist.

## Project Structure

```text
ReelTrack/
├── backend/
│   ├── models/
│   │   └── Media.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── index.html
└── README.md
```

*Note: The exact files and folders may vary depending on your project.*

## Important Note

ReelTrack does not require login or signup. The application uses a shared collection of media entries, so anyone who can access the backend API may be able to add, update, or delete entries. This setup is suitable for a local project or classroom demonstration. Authentication and authorization should be added before exposing the application publicly.

## Future Improvements

- Add user accounts and personal watchlists
- Add movie posters and trailers
- Integrate a movie database API
- Add sorting by rating and release year
- Improve mobile responsiveness

 

 