/**
 * Radio Prezzismart - Player App
 * Streaming audio player with PWA support
 */

// Configurazione
const STREAM_URL = 'https://pmv7dwxlyd914zpz.myfritz.net/listen/radio_prezzismart/radio.mp3';

// Elementi DOM
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = playBtn.querySelector('.play-icon');
const pauseIcon = playBtn.querySelector('.pause-icon');
const statusEl = document.getElementById('status');
const statusText = statusEl.querySelector('.status-text');
const visualizer = document.getElementById('visualizer');
const volumeSlider = document.getElementById('volumeSlider');
const installBtn = document.getElementById('installBtn');

// Stato
let isPlaying = false;
let isBuffering = false;

// Inizializzazione
function init() {
    // Configura audio
    audioPlayer.src = STREAM_URL;
    audioPlayer.volume = 0.8;
    
    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    volumeSlider.addEventListener('input', handleVolume);
    
    // Eventi audio
    audioPlayer.addEventListener('play', onPlay);
    audioPlayer.addEventListener('pause', onPause);
    audioPlayer.addEventListener('waiting', onBuffering);
    audioPlayer.addEventListener('playing', onPlaying);
    audioPlayer.addEventListener('error', onError);
    audioPlayer.addEventListener('stalled', onError);
    
    // Registra Service Worker
    registerServiceWorker();
    
    // Gestisci installazione PWA
    handleInstallPrompt();
    
    console.log('🎵 Radio Prezzismart - Pronta per lo streaming');
}

// Play / Pause
async function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        try {
            // Ricarica l'URL per evitare problemi di caching
            audioPlayer.src = STREAM_URL;
            audioPlayer.volume = volumeSlider.value / 100;
            await audioPlayer.play();
        } catch (error) {
            console.error('Errore riproduzione:', error);
            showStatus('Errore riproduzione', 'error');
        }
    }
}

// Callback play
function onPlay() {
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    visualizer.classList.add('playing');
    statusEl.classList.add('playing');
    statusEl.classList.remove('connecting');
    statusText.textContent = '🎵 In riproduzione';
    
    // Tieni schermo attivo durante la riproduzione
    requestWakeLock();
}

// Callback pause
function onPause() {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    visualizer.classList.remove('playing');
    statusEl.classList.remove('playing');
    statusText.textContent = '⏸️ In pausa';
    
    releaseWakeLock();
}

// Callback buffering
function onBuffering() {
    isBuffering = true;
    statusEl.classList.add('connecting');
    statusText.textContent = '⏳ Connessione...';
}

// Callback playing (dopo buffering)
function onPlaying() {
    isBuffering = false;
    statusEl.classList.remove('connecting');
    statusText.textContent = '🎵 In riproduzione';
}

// Gestione errori
function onError(e) {
    console.error('Errore streaming:', e);
    showStatus('❌ Errore connessione', 'error');
    visualizer.classList.remove('playing');
    statusEl.classList.remove('playing');
    
    // Prova a riconnettere dopo 3 secondi
    setTimeout(() => {
        if (isPlaying) {
            statusText.textContent = '🔄 Riconnessione...';
            audioPlayer.src = STREAM_URL;
            audioPlayer.play().catch(() => {});
        }
    }, 3000);
}

// Mostra stato temporaneo
function showStatus(message, type) {
    const originalText = statusText.textContent;
    statusText.textContent = message;
    
    if (type === 'error') {
        statusEl.style.color = '#ff5252';
    }
    
    setTimeout(() => {
        statusText.textContent = isPlaying ? '🎵 In riproduzione' : 'Pronto per riprodurre';
        statusEl.style.color = '';
    }, 3000);
}

// Gestione volume
function handleVolume(e) {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
    
    // Salva preferenza
    localStorage.setItem('radioVolume', e.target.value);
}

// Carica volume salvato
function loadSavedVolume() {
    const saved = localStorage.getItem('radioVolume');
    if (saved !== null) {
        volumeSlider.value = saved;
        audioPlayer.volume = saved / 100;
    }
}

// Wake Lock (tieni schermo attivo)
let wakeLock = null;

async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.log('Wake Lock non disponibile');
        }
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ Service Worker registrato'))
            .catch(err => console.log('❌ SW registration failed:', err));
    }
}

// Gestione prompt installazione PWA
let deferredPrompt = null;

function handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Previene il prompt automatico
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostra pulsante installa
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', showInstallPrompt);
    });
    
    // Nascondi pulsante se già installata
    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        deferredPrompt = null;
        console.log('🎉 App installata!');
    });
}

async function showInstallPrompt() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('Utente ha accettato installazione');
    }
    
    deferredPrompt = null;
    installBtn.style.display = 'none';
}

// Gestione visibilità pagina (pausa/riprendi quando cambia tab)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        // Continua a riprodurre in background
        console.log('Radio continua in background');
    }
});

// Media Session API (controlli da notifica/blocco schermo)
if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Radio Prezzismart',
        artist: 'Diretta Streaming',
        album: 'Radio Prezzismart',
        artwork: [
            { src: 'icon-96.png', sizes: '96x96', type: 'image/png' },
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
    });
    
    navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
    navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
}

// Avvio
loadSavedVolume();
init();
