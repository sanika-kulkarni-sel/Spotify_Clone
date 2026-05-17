document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    // Views
    const viewHome = document.getElementById('view-home');
    const viewSearch = document.getElementById('view-search');
    const viewLibrary = document.getElementById('view-library');
    const viewPlaylist = document.getElementById('view-playlist');
    const views = [viewHome, viewSearch, viewLibrary, viewPlaylist];

    // Nav
    const navHome = document.getElementById('nav-home');
    const navSearch = document.getElementById('nav-search');
    const navLibrary = document.getElementById('nav-library');
    const navCreatePlaylist = document.getElementById('nav-create-playlist');
    const navLikedSongs = document.getElementById('nav-liked-songs');
    const sidebarPlaylists = document.getElementById('sidebar-playlists');
    const userAuthContainer = document.getElementById('user-auth-container');

    // Content Containers
    const greetingsGrid = document.getElementById('greetings-grid');
    const madeForYouGrid = document.getElementById('made-for-you-grid');
    const searchInput = document.getElementById('search-input');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const libraryGrid = document.getElementById('library-grid');
    const playlistTitle = document.getElementById('playlist-title');
    const playlistTracks = document.getElementById('playlist-tracks');

    // Audio Player Elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBarBg = document.getElementById('progress-bar-bg');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const volumeBarBg = document.getElementById('volume-bar-bg');
    const volumeBarFill = document.getElementById('volume-bar-fill');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const npCover = document.getElementById('np-cover');
    const npTitle = document.getElementById('np-title');
    const npArtist = document.getElementById('np-artist');
    const npHeartBtn = document.querySelector('.now-playing .heart-btn');

    // Modal Elements
    const playlistModal = document.getElementById('playlist-modal');
    const modalPlaylistList = document.getElementById('modal-playlist-list');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    let targetSongIndexForPlaylist = null;

    // --- State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let currentContext = songs.map((_, i) => i); // Array of song indices currently being played (playlist, album, etc)
    
    // Load from local storage
    let likedSongs = new Set(JSON.parse(localStorage.getItem('likedSongs')) || []);
    let userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];

    // --- Modal Logic ---
    function openAddToPlaylistModal(songIndex) {
        targetSongIndexForPlaylist = songIndex;
        modalPlaylistList.innerHTML = '';
        
        if (userPlaylists.length === 0) {
            modalPlaylistList.innerHTML = '<li style="text-align:center; color:var(--text-subdued);">No playlists created yet.</li>';
        } else {
            userPlaylists.forEach((playlist) => {
                const li = document.createElement('li');
                li.textContent = playlist.name;
                li.addEventListener('click', () => {
                    if (!playlist.tracks.includes(targetSongIndexForPlaylist)) {
                        playlist.tracks.push(targetSongIndexForPlaylist);
                        saveState();
                        if (!viewLibrary.classList.contains('hidden')) renderLibrary();
                        if (!viewPlaylist.classList.contains('hidden') && playlistTitle.textContent === playlist.name) {
                            openPlaylistView(playlist.name, playlist.tracks);
                        }
                    }
                    closeModal();
                });
                modalPlaylistList.appendChild(li);
            });
        }
        playlistModal.classList.remove('hidden');
    }

    function closeModal() {
        playlistModal.classList.add('hidden');
        targetSongIndexForPlaylist = null;
    }

    modalCloseBtn.addEventListener('click', closeModal);
    playlistModal.addEventListener('click', (e) => {
        if (e.target === playlistModal) closeModal();
    });

    // --- Initialization ---
    function init() {
        // Check for Email Login
        const email = localStorage.getItem('user_email');
        if (email && userAuthContainer) {
            const userName = email.split('@')[0];
            const pictureUrl = `https://ui-avatars.com/api/?name=${userName}&background=random`;
            userAuthContainer.innerHTML = `
                <div style="position: relative;">
                    <div id="profile-pill" style="display:flex; align-items:center; gap:8px; background-color:rgba(0,0,0,0.7); padding:4px 12px 4px 4px; border-radius:500px; cursor:pointer; transition: background-color 0.2s;">
                        <img src="${pictureUrl}" alt="${userName}" style="width:28px; height:28px; border-radius:50%;">
                        <span style="font-weight:700; font-size:14px;">${userName}</span>
                        <i class="fas fa-caret-down" style="margin-left:4px; margin-right:4px;"></i>
                    </div>
                    <div id="profile-dropdown" style="display:none; position:absolute; top:40px; right:0; background-color:#282828; border-radius:4px; padding:4px; min-width:160px; box-shadow: 0 4px 14px rgba(0,0,0,.5); z-index:1000;">
                        <button id="logout-btn" style="width:100%; text-align:left; background:none; border:none; color:#fff; padding:12px; cursor:pointer; font-size:14px; border-radius:2px;">Log out</button>
                    </div>
                </div>
            `;

            const profilePill = document.getElementById('profile-pill');
            const profileDropdown = document.getElementById('profile-dropdown');
            const logoutBtn = document.getElementById('logout-btn');

            // Add hover effect via JS since it's inline styled
            profilePill.addEventListener('mouseenter', () => profilePill.style.backgroundColor = '#282828');
            profilePill.addEventListener('mouseleave', () => profilePill.style.backgroundColor = 'rgba(0,0,0,0.7)');

            profilePill.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', (e) => {
                if (!userAuthContainer.contains(e.target)) {
                    profileDropdown.style.display = 'none';
                }
            });

            logoutBtn.addEventListener('mouseenter', () => logoutBtn.style.backgroundColor = '#3E3E3E');
            logoutBtn.addEventListener('mouseleave', () => logoutBtn.style.backgroundColor = 'transparent');

            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('user_email');
                window.location.reload();
            });
        }

        // Set initial volume
        audioPlayer.volume = 0.5;
        volumeBarFill.style.width = '50%';
        
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = `.volume-bar-bg::after { left: 50%; }`;
        
        renderSidebarPlaylists();
        renderGreetings();
        renderMadeForYou();
        loadSong(currentSongIndex);
        switchView('home');
    }

    function saveState() {
        localStorage.setItem('likedSongs', JSON.stringify(Array.from(likedSongs)));
        localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
    }

    // --- Routing ---
    function switchView(viewName) {
        views.forEach(v => v.classList.add('hidden'));
        [navHome, navSearch, navLibrary].forEach(n => n.classList.remove('active'));

        if (viewName === 'home') {
            viewHome.classList.remove('hidden');
            navHome.classList.add('active');
        } else if (viewName === 'search') {
            viewSearch.classList.remove('hidden');
            navSearch.classList.add('active');
            searchInput.focus();
        } else if (viewName === 'library') {
            viewLibrary.classList.remove('hidden');
            navLibrary.classList.add('active');
            renderLibrary();
        } else if (viewName === 'playlist') {
            viewPlaylist.classList.remove('hidden');
        }
    }

    // --- Rendering ---
    function createSongCard(songIndex) {
        const song = songs[songIndex];
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${song.cover_url}" alt="${song.title}">
                <button class="play-btn-small" aria-label="Play ${song.title}">
                    <i class="fas fa-play"></i>
                </button>
                <button class="play-btn-small add-btn-card" aria-label="Add ${song.title}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        `;
        card.addEventListener('click', () => {
            currentSongIndex = songIndex;
            loadSong(currentSongIndex);
            playSong();
        });

        const addBtn = card.querySelector('.add-btn-card');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAddToPlaylistModal(songIndex);
        });

        return card;
    }

    function renderGreetings() {
        const greetingsSongs = [0, 1, 2, 3, 4, 5]; // First 6
        greetingsGrid.innerHTML = '';
        greetingsSongs.forEach((songIndex) => {
            if (!songs[songIndex]) return;
            const song = songs[songIndex];
            const card = document.createElement('div');
            card.className = 'greeting-card';
            card.innerHTML = `
                <img src="${song.cover_url}" alt="${song.title}">
                <span>${song.title}</span>
                <button class="play-btn-small" aria-label="Play ${song.title}">
                    <i class="fas fa-play"></i>
                </button>
                <button class="play-btn-small add-btn-card" aria-label="Add ${song.title}">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            card.addEventListener('click', () => {
                currentContext = greetingsSongs;
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                playSong();
            });

            const addBtn = card.querySelector('.add-btn-card');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openAddToPlaylistModal(songIndex);
            });

            greetingsGrid.appendChild(card);
        });
    }

    function renderMadeForYou() {
        madeForYouGrid.innerHTML = '';
        songs.forEach((_, index) => {
            madeForYouGrid.appendChild(createSongCard(index));
        });
    }

    function renderSidebarPlaylists() {
        sidebarPlaylists.innerHTML = '';
        userPlaylists.forEach((playlist, index) => {
            const li = document.createElement('li');
            li.textContent = playlist.name;
            li.addEventListener('click', () => openPlaylistView(playlist.name, playlist.tracks));
            sidebarPlaylists.appendChild(li);
        });
    }

    function renderLibrary() {
        libraryGrid.innerHTML = '';
        
        // Liked Songs Card
        const likedCard = document.createElement('div');
        likedCard.className = 'song-card';
        likedCard.style.background = 'linear-gradient(135deg, #450af5, #c4efd9)';
        likedCard.innerHTML = `
            <div class="card-img-container" style="display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-heart" style="font-size: 64px; color: white;"></i>
                <button class="play-btn-small">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="song-title">Liked Songs</div>
            <div class="song-artist">${likedSongs.size} liked songs</div>
        `;
        likedCard.addEventListener('click', () => openPlaylistView('Liked Songs', Array.from(likedSongs)));
        libraryGrid.appendChild(likedCard);

        // User Playlists
        userPlaylists.forEach(playlist => {
            const pCard = document.createElement('div');
            pCard.className = 'song-card';
            pCard.innerHTML = `
                <div class="card-img-container" style="background:#282828;display:flex;align-items:center;justify-content:center;">
                    <i class="fas fa-music" style="font-size: 64px; color: #b3b3b3;"></i>
                    <button class="play-btn-small">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="song-title">${playlist.name}</div>
                <div class="song-artist">By You</div>
            `;
            pCard.addEventListener('click', () => openPlaylistView(playlist.name, playlist.tracks));
            libraryGrid.appendChild(pCard);
        });
    }

    function openPlaylistView(title, trackIndices) {
        switchView('playlist');
        playlistTitle.textContent = title;
        playlistTracks.innerHTML = '';
        
        if (trackIndices.length === 0) {
            playlistTracks.innerHTML = '<p style="color:var(--text-subdued)">No tracks here yet.</p>';
            return;
        }

        trackIndices.forEach((songIndex, i) => {
            const song = songs[songIndex];
            const trackEl = document.createElement('div');
            trackEl.className = 'track-item';
            
            const isLiked = likedSongs.has(songIndex);
            
            trackEl.innerHTML = `
                <div style="width: 30px; color: var(--text-subdued);">${i + 1}</div>
                <img src="${song.cover_url}" alt="Cover">
                <div class="track-info">
                    <div class="track-title">${song.title}</div>
                    <div class="track-artist">${song.artist}</div>
                </div>
                <div class="track-actions">
                    <button class="heart-btn-list ${isLiked ? 'liked-active' : ''}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="add-btn" aria-label="Add">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            
            // Double click to play
            trackEl.addEventListener('dblclick', () => {
                currentContext = trackIndices;
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                playSong();
            });

            // Like toggle
            const heartBtn = trackEl.querySelector('.heart-btn-list');
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(songIndex);
                heartBtn.classList.toggle('liked-active');
                if (currentSongIndex === songIndex) {
                    updatePlayerHeart();
                }
            });

            const addBtn = trackEl.querySelector('.add-btn');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openAddToPlaylistModal(songIndex);
            });

            playlistTracks.appendChild(trackEl);
        });
    }

    // --- Search ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchResultsGrid.innerHTML = '';
        if (query.trim() === '') return;

        const results = songs.map((s, i) => ({...s, index: i}))
                             .filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
        
        if (results.length === 0) {
            searchResultsGrid.innerHTML = '<p style="color:var(--text-subdued)">No results found.</p>';
            return;
        }

        results.forEach(res => {
            searchResultsGrid.appendChild(createSongCard(res.index));
        });
    });

    // --- Features ---
    function toggleLike(songIndex) {
        if (likedSongs.has(songIndex)) {
            likedSongs.delete(songIndex);
        } else {
            likedSongs.add(songIndex);
        }
        saveState();
    }

    function updatePlayerHeart() {
        if (likedSongs.has(currentSongIndex)) {
            npHeartBtn.classList.add('liked-active');
        } else {
            npHeartBtn.classList.remove('liked-active');
        }
    }

    npHeartBtn.addEventListener('click', () => {
        toggleLike(currentSongIndex);
        updatePlayerHeart();
    });

    navCreatePlaylist.addEventListener('click', () => {
        const name = prompt("Enter Playlist Name:");
        if (name && name.trim()) {
            userPlaylists.push({ name: name.trim(), tracks: [] });
            saveState();
            renderSidebarPlaylists();
            if(!viewLibrary.classList.contains('hidden')) {
                renderLibrary();
            }
        }
    });

    // --- Nav Listeners ---
    navHome.addEventListener('click', () => switchView('home'));
    navSearch.addEventListener('click', () => switchView('search'));
    navLibrary.addEventListener('click', () => switchView('library'));
    navLikedSongs.addEventListener('click', () => openPlaylistView('Liked Songs', Array.from(likedSongs)));

    // --- Audio Player Logic ---
    function loadSong(index) {
        const song = songs[index];
        audioPlayer.src = song.audio_url;
        npCover.src = song.cover_url;
        npTitle.textContent = song.title;
        npArtist.textContent = song.artist;
        updatePlayerHeart();
        
        progressBarFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }

    function togglePlay() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function nextSong() {
        // Use currentContext for looping if playing a playlist
        let currentIndexInContext = currentContext.indexOf(currentSongIndex);
        if (currentIndexInContext === -1) {
            // Fallback
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        } else {
            currentIndexInContext++;
            if (currentIndexInContext >= currentContext.length) {
                currentIndexInContext = 0;
            }
            currentSongIndex = currentContext[currentIndexInContext];
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function prevSong() {
        let currentIndexInContext = currentContext.indexOf(currentSongIndex);
        if (currentIndexInContext === -1) {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        } else {
            currentIndexInContext--;
            if (currentIndexInContext < 0) {
                currentIndexInContext = currentContext.length - 1;
            }
            currentSongIndex = currentContext[currentIndexInContext];
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        
        if (!isNaN(duration)) {
            const currentMin = Math.floor(currentTime / 60);
            let currentSec = Math.floor(currentTime % 60);
            if (currentSec < 10) currentSec = `0${currentSec}`;
            currentTimeEl.textContent = `${currentMin}:${currentSec}`;
            
            const totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if (totalSec < 10) totalSec = `0${totalSec}`;
            totalTimeEl.textContent = `${totalMin}:${totalSec}`;
        }

        const progressPercent = (currentTime / duration) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        progressBarBg.style.setProperty('--progress', `${progressPercent}%`);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volumePercent = (clickX / width);
        audioPlayer.volume = volumePercent;
        volumeBarFill.style.width = `${volumePercent * 100}%`;
        volumeBarBg.style.setProperty('--volume', `${volumePercent * 100}%`);
    }

    // Player Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    progressBarBg.addEventListener('click', setProgress);
    volumeBarBg.addEventListener('click', setVolume);

    // Start
    init();
});
