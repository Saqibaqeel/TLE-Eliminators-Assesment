# Coding Contests App Documentation(for TLE Eliminators assignment)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Details](#technical-details)
  - [Contest Listing](#contest-listing)
  - [Bookmarking](#bookmarking)
  - [Dark Mode & LocalStorage](#dark-mode--localstorage)
  - [Filtering Contests](#filtering-contests)
  - [API Integration](#api-integration)
  - [Updating Contest Solution URLs](#updating-contest-solution-urls)
  - [Viewing Solutions](#viewing-solutions)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Coding Contests App** is a full-stack web application designed to help coding contest enthusiasts track, filter, and interact with contests. The app aggregates contest data from an API and provides a modern, responsive interface with features such as filtering, bookmarking, dark mode toggling, updating solution URLs, and viewing embedded YouTube playlists for solutions.

---

## Features

- **Contest Listing:** Displays contest details including contest name, platform, start/end times, status, and countdown timers.
- **Bookmarking:** Users can bookmark contests for quick access. Bookmarks are stored in the browser’s localStorage, ensuring they persist across sessions.
- **Dark Mode:** Toggle between dark and light themes. The selected theme is saved in localStorage and applied throughout the app.
- **Filtering:** Filter contests by platform (e.g., Leetcode, Codechef, Codeforces) and contest status (upcoming, running, past).
- **Update Contest Solution URL:** Authorized team members can update the solution URL for a contest (typically a YouTube playlist URL) via a dedicated route (`/update/:contestId`).
- **View Solutions:** Users can view all available solution URLs for a contest and see an embedded YouTube playlist on a dedicated page (`/solution/:id`).

---

## Technical Details

### Contest Listing

- **Data Fetching:** Contests are fetched from an API endpoint (e.g., `GET /api/contests/`) using Axios and displayed as cards.
- **Contest Timing:** The application calculates the remaining time until a contest starts (or indicates if it has already started) by comparing the contest's start time with the current time.

### Bookmarking

- **State Management:** A `bookmarks` state variable holds an array of contest IDs. Clicking the bookmark icon toggles a contest's bookmark status.
- **LocalStorage Persistence:** Bookmarks are saved to localStorage to persist across browser sessions:

```js
useEffect(() => {
  localStorage.setItem('contestBookmarks', JSON.stringify(bookmarks));
}, [bookmarks]);
```

### Dark Mode & LocalStorage

- **Implementation:** A `darkMode` state variable tracks the current theme. Users toggle dark mode with a button, and the UI updates accordingly.
- **Persistence:** The dark mode setting is saved in localStorage:

```js
const [darkMode, setDarkMode] = useState(() => {
  const storedMode = localStorage.getItem('darkMode');
  return storedMode ? JSON.parse(storedMode) : false;
});

useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);
```

### Filtering Contests

- **State Variables:** Two state variables, `filterPlatform` and `filterStatus`, hold the current filter values.
- **Filtering Logic:** Contests are filtered using these variables:

```js
const filteredContests = contests.filter((contest) => {
  const platformMatch = filterPlatform ? contest.platform === filterPlatform : true;
  const statusMatch = filterStatus ? contest.status === filterStatus : true;
  return platformMatch && statusMatch;
});
```

### API Integration

- **Fetching Contests:** Axios is used to fetch contest data from the API endpoint.
- **Updating Solution URLs:** The `UpdateContestForm` component sends a PUT request to update a contest’s solution URL:

```js
await axios.put(`http://localhost:8000/api/contests/update/${contestId}`, { solutionUrl });
```

- **Viewing Solutions:** The `ViewSolutions` component fetches solution data via a GET request. If the API returns a single solution as a string, the component wraps it in an array for consistency.

### Updating Contest Solution URLs

- **Route:** Available at `/update/:contestId`.
- **Component:** The `UpdateContestForm` component renders a form where authorized users can enter a new solution URL. Upon successful submission, the user is redirected to the contest list, and the new URL is added to a list of available solutions.

### Viewing Solutions

- **Route:** Available at `/solution/:id` (with `:id` being the MongoDB document ID).
- **Component:** The `ViewSolutions` component fetches the solution data, processes it to create an embeddable YouTube URL, and displays the solutions. A helper function converts a standard YouTube playlist URL into an embeddable URL:

```js
const embedPlaylist = (playlistUrl) => {
  try {
    const url = new URL(playlistUrl);
    const playlistId = url.searchParams.get("list");
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  } catch (error) {
    return playlistUrl;
  }
};
```

---

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm or Yarn

### Clone the Repository

```bash
git clone https://github.com/your-username/coding-contests-app.git
cd coding-contests-app
```

### Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

---

## Usage

### Running the Frontend
```bash
cd frontend
npm run dev
```
The development server (e.g., Vite) will run on `http://localhost:5173`.

### Running the Backend
```bash
cd backend
npm start
```
Your Express API server will run on `http://localhost:8000`.

### Navigating the App
- **Home Page (`/`)**: Displays the contest list with filtering, dark mode toggling, and bookmarking features.
- **Update Contest (`/update/:contestId`)**: Authorized users can update the solution URL for a contest.
- **View Solutions (`/solution/:id`)**: Displays all available solution URLs for a contest along with embedded YouTube playlists.
 ### NOTE
 it will aoumatically fetch letest data from apis using node-corn

---



