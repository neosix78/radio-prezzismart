# 🎵 Radio Prezzismart App

Una Progressive Web App (PWA) per ascoltare Radio Prezzismart in streaming su web e Android.

## 📱 Caratteristiche

- ✅ **Un click per riprodurre** - Interfaccia super semplice
- ✅ **Funziona su Web** - Da qualsiasi browser moderno
- ✅ **Installabile su Android** - Come una vera app nativa
- ✅ **Background audio** - Continua a riprodurre con schermo spento
- ✅ **Controlli notifica** - Play/Pause dalla barra notifiche
- ✅ **Volume salvato** - Ricorda le tue preferenze
- ✅ **Visualizzatore audio** - Animazione durante la riproduzione
- ✅ **Modalità offline** - Interfaccia disponibile anche senza connessione

## 🚀 Come usarla

### Versione Web (immediata)
1. Apri il file `index.html` in un browser
2. Clicca il pulsante arancione per riprodurre
3. Enjoy! 🎵

### Su Android (come app)
1. Apri il sito in Chrome
2. Clicca **"Installa App"** (o vai in menu → "Aggiungi a schermata Home")
3. L'app si installerà e sarà disponibile come qualsiasi altra app

## 📂 Struttura del progetto

```
radio-prezzismart/
├── index.html          # Interfaccia principale
├── style.css           # Stili e tema
├── app.js              # Logica del player
├── sw.js               # Service Worker (offline)
├── manifest.json       # Configurazione PWA
├── icon.svg            # Logo vettoriale
├── icon-72.png         # Icona 72x72
├── icon-96.png         # Icona 96x96
├── icon-128.png        # Icona 128x128
├── icon-144.png        # Icona 144x144
├── icon-152.png        # Icona 152x152
├── icon-192.png        # Icona 192x192
├── icon-384.png        # Icona 384x384
├── icon-512.png        # Icona 512x512
├── favicon.png         # Favicon 32x32
└── generate_icons.py   # Script per rigenerare icone
```

## 🔧 Configurazione Stream

L'URL dello stream è configurato in `app.js`:

```javascript
const STREAM_URL = 'https://pmv7dwxlyd914zpz.myfritz.net/listen/radio_prezzismart/radio.mp3';
```

## 🌐 Hosting

Per il funzionamento completo (PWA + installazione), l'app deve essere servita via HTTPS:

### Opzioni gratuite:
- **GitHub Pages** - Push su GitHub, attiva Pages nelle impostazioni
- **Netlify** - Drag & drop della cartella
- **Vercel** - `npx vercel --prod`
- **Firebase Hosting** - `firebase deploy`

### Test locale:
Puoi usare Python per un server locale:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Poi apri: http://localhost:8000

## 🎨 Personalizzazione

### Cambiare colori
Modifica le variabili CSS in `style.css`:
```css
:root {
    --primary: #ff6b00;        /* Colore principale */
    --primary-dark: #e65100;   /* Colore scuro */
    --bg-dark: #1a1a2e;        /* Sfondo */
}
```

### Cambiare nome radio
Modifica in `index.html`:
```html
<h1>Radio Prezzismart</h1>
```

E in `manifest.json`:
```json
"name": "Radio Prezzismart",
"short_name": "RadioPrezzi"
```

## 📋 Requisiti

- Browser moderno con supporto:
  - ES6+ JavaScript
  - Service Workers
  - Media Session API
- HTTPS per installazione PWA (su hosting online)

## 🐛 Risoluzione problemi

| Problema | Soluzione |
|----------|-----------|
| Non si sente audio | Controlla volume dispositivo e mute |
| L'app non si installa | Usa Chrome/Edge e HTTPS |
| Buffering continuo | Verifica connessione internet |
| Audio si ferma | Ricarica la pagina, riprova |

## 📄 Licenza

Libero uso per Radio Prezzismart.
