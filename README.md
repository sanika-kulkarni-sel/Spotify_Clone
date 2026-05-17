# 🎵 Premium Spotify Clone

A high-fidelity, interactive, and responsive **Spotify Web Player Clone** built with modern frontend best practices. This project replicates the authentic dark-themed Spotify design language, complete with full music playback capabilities, dynamic view routing, real-time search, playlist management, persistent likes, and an authentic multi-page authentication (Sign-Up / Login) flow.

---

## ✨ Features

### 🎧 Core Music Player
- **Fully Interactive Audio Engine**: Real-time play, pause, next, previous, dynamic progress bar seeking, and volume adjustment.
- **Dynamic Track Metadata**: Displays album artwork, song titles, and artist details dynamically in the now-playing bar.
- **Custom Local Tracks**: Loaded from `/js/data.js` with high-quality cover images.

### 🧭 Advanced Single Page Application (SPA) Routing
- Seamless view transition without page reloads using a customized state manager.
- Fully operational sidebar links to toggle between:
  - **Home View**: Displays personalized greeting grids and curated recommendations.
  - **Search View**: Features **real-time filtering** to search for tracks by title or artist.
  - **Your Library**: Tracks user-created playlists and custom collections.
  - **Liked Songs View**: Dynamic playlist containing all liked songs.

### 📁 Playlists & Local Persistence
- **Create Playlists**: Add custom playlists instantly that save directly to the left sidebar and Your Library.
- **Add to Playlist Modal**: Dedicated pop-up modal to append any song to any user playlist via the `+` button.
- **Liked Songs Toggle**: Instantly like/unlike songs with high-fidelity heart transitions.
- **Persistent State**: Full playlist structures, liked songs, and user credentials persist across browser sessions using `localStorage`.

### 🔐 Authentic Authentication Flow
- **Standalone Sign-Up (`signup.html`)**: Pixel-perfect Spotify registration screen validating email addresses and passwords with custom interactive inputs.
- **Standalone Login (`login.html`)**: Spotify-styled login card showcasing an authentic black container over a subtle dark background gradient.
- **Interactive Profile Pill & Dropdown**: Once logged in, the player header dynamically replaces authentication links with a user avatar pill and dropdown menu featuring a functional **Log Out** button.

---

## 🛠️ Tech Stack

- **Markup & Structure**: Semantic HTML5
- **Styling & Layout**: Modern Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, transitions, custom scrollbars)
- **Logic & Interactions**: Modern ES6+ JavaScript (DOM Manipulation, State Management, Local Storage API, HTML5 Audio API)
- **Icons**: FontAwesome v6.4.0

---

## 📂 Project Structure

```directory
Spotify-Clone/
├── index.html          # Main Web Player (SPA Shell)
├── signup.html         # Authentic Sign-Up Page
├── login.html          # Authentic Login Page
├── css/
│   ├── style.css       # Core layout styling for the player
│   └── signup.css      # Styling for sign-up/login authentication
├── js/
│   ├── app.js          # Core JavaScript application logic
│   └── data.js         # Central track metadata and file paths
├── images/             # Album covers & asset graphics
└── Songs/              # Local audio file assets
```

---

## 🚀 Getting Started

To run this application locally, you can serve it using any simple static web server. 

### 1. Clone the repository
```bash
git clone https://github.com/sanika-kulkarni-sel/Spotify_Clone.git
cd Spotify_Clone
```

### 2. Run a local development server

**Using Python 3:**
```bash
python3 -m http.server 3000
```

**Using Node.js (`http-server`):**
```bash
npm install -g http-server
http-server -p 3000
```

### 3. Open the application
Open your web browser and navigate to:
```text
http://localhost:3000
```

---

## 💡 How to Use

1. **Listen to Music**: Click on any play button in the Home grids or song lists. Use the bottom bar controls to play, pause, adjust volume, and skip tracks.
2. **Like a Song**: Click the heart button on any track card or list row. Check the **Liked Songs** sidebar view to see all liked tracks in real time.
3. **Manage Playlists**:
   - Click **Create Playlist** on the sidebar to instantly create a new custom list.
   - Click the `+` button on any song card to trigger the add modal, then select the playlist you want to add the song to.
4. **Sign Up & Log In**:
   - Click **Sign up** or **Log in** in the top right.
   - Enter your email and create a password to experience the dynamic authentication UI update, showing your custom user avatar and active dropdown logout functionality.
