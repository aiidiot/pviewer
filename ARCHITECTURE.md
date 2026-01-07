# Architektura PViewer

## Przegląd

PViewer to Single Page Application (SPA) zbudowana w Astro 5, która pobiera i wyświetla dane z systemu SWIV.

## Diagram Przepływu Danych

```
┌─────────────┐
│   Browser   │ (użytkownik z VPN)
│  (Client)   │
└──────┬──────┘
       │
       │ 1. Otwiera aplikację
       │
       ▼
┌─────────────────────────────┐
│  Vercel (Static Hosting)    │
│  https://pviewer-xxx.app    │
│                              │
│  ┌────────────────────────┐ │
│  │   index.html           │ │
│  │   (Astro built)        │ │
│  │   - HTML structure     │ │
│  │   - Inline CSS         │ │
│  │   - Vanilla JS         │ │
│  └────────────────────────┘ │
└──────┬──────────────────────┘
       │ 2. Ładuje stronę
       │
       ▼
┌─────────────────────────────┐
│  Browser - JavaScript       │
│                              │
│  fetchData() {              │
│    fetch(TARGET_URL)        │◄───────┐
│      .then(parse)           │        │
│      .then(display)         │        │
│  }                          │        │
└──────┬──────────────────────┘        │
       │ 3. Wysyła request              │
       │    (credentials: include)      │
       │                                │
       ▼                                │
┌─────────────────────────────┐        │
│      VPN Network            │        │
│                              │        │
│  swiv.grupawp.pl            │        │
│  ┌────────────────────────┐ │        │
│  │  HTML Response         │ │        │
│  │  <div class=           │ │        │
│  │    "measure-label">    │ │        │
│  │    1995782             │ │        │
│  │  </div>                │ │        │
│  │  <div class=           │ │        │
│  │    "measure-label">    │ │        │
│  │    907457              │ │        │
│  │  </div>                │ │        │
│  └────────────────────────┘ │        │
└──────┬──────────────────────┘        │
       │ 4. Zwraca HTML                 │
       └────────────────────────────────┘

       5. Parse i wyświetl

       ▼
┌─────────────────────────────┐
│  Browser - Display          │
│                              │
│  ┌──────────────────────┐   │
│  │  Wartość 1           │   │
│  │  1 995 782           │   │ (zielona)
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  Wartość 2           │   │
│  │  907 457             │   │ (niebieska)
│  └──────────────────────┘   │
│                              │
│  [  Odśwież  ]              │
└─────────────────────────────┘
```

## Komponenty Systemu

### 1. Frontend (Astro)

**Lokalizacja:** `/home/r/pviewer/src/pages/index.astro`

**Technologie:**
- Astro 5 (build-time framework)
- HTML5 (semantic markup)
- CSS3 (inline, no external files)
- Vanilla JavaScript (no framework)

**Funkcje:**
- Renderowanie statycznego HTML
- Styling z gradient background
- Responsive grid layout
- Client-side data fetching

### 2. JavaScript Client

**Funkcje:**
```javascript
fetchData()           // Główna funkcja pobierająca dane
formatNumber(num)     // Formatowanie liczb z separatorami
```

**Flow:**
1. Auto-execute przy załadowaniu strony
2. Fetch z credentials (dla VPN auth)
3. Parse HTML z DOMParser
4. Znajdź .measure-label elements
5. Wyświetl wartości
6. Obsłuż błędy

### 3. Deployment (Vercel)

**Build Process:**
```bash
npm install        # Instalacja zależności
npm run build      # Astro build → static files
# Output: dist/index.html (single file)
```

**Hosting:**
- Static Site Hosting
- Global CDN
- Automatic HTTPS
- Git integration (auto-deploy on push)

## Przepływ Request/Response

### Udany Request (z VPN)

```
1. Browser:  GET https://pviewer-xxx.vercel.app
2. Vercel:   200 OK (index.html)
3. Browser:  Wykonuje JavaScript
4. Browser:  fetch(swiv.grupawp.pl) + credentials
5. VPN:      Autoryzacja OK
6. SWIV:     200 OK + HTML content
7. Browser:  DOMParser.parseFromString(html)
8. Browser:  querySelector('.measure-label')
9. Browser:  Wyświetla wartości
10. Status:  "Dane zaktualizowane: 18:30:45"
```

### Nieudany Request (bez VPN)

```
1. Browser:  GET https://pviewer-xxx.vercel.app
2. Vercel:   200 OK (index.html)
3. Browser:  Wykonuje JavaScript
4. Browser:  fetch(swiv.grupawp.pl)
5. Network:  CORS error / Timeout
6. Browser:  catch(error)
7. Browser:  Wyświetla "Błąd"
8. Status:   "Sprawdź czy jesteś połączony z VPN"
```

## Security

### CORS (Cross-Origin Resource Sharing)

**Problem:**
- Aplikacja hostowana na `vercel.app`
- Dane z `swiv.grupawp.pl`
- Cross-origin request

**Rozwiązanie:**
```javascript
fetch(url, {
  mode: 'cors',
  credentials: 'include'  // Wysyła cookies (VPN auth)
})
```

### Authentication

**VPN-based:**
- Użytkownik musi być na VPN
- Cookies/session zarządzane przez przeglądarkę
- Brak tokenów w aplikacji
- Brak secrets w kodzie

## Performance

### Build Output

```
dist/
└── index.html      # ~15 KB (single file)
    ├── HTML        # ~3 KB
    ├── CSS inline  # ~3 KB
    └── JS inline   # ~2 KB
```

### Lighthouse Score (Expected)

- Performance: 95+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 85+

### Optimizations

1. **Zero external requests** (no CDN dependencies)
2. **Inline CSS** (no render blocking)
3. **Minimal JavaScript** (~2KB)
4. **Astro zero-JS** default (tylko potrzebny JS)
5. **Static Generation** (instant load)

## Error Handling

### Network Errors

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  // Wyświetl user-friendly message
  if (error.name === 'TypeError') {
    // VPN not connected
  }
}
```

### Parsing Errors

```javascript
const labels = doc.querySelectorAll('.measure-label');
if (labels.length < 2) {
  throw new Error('Nie znaleziono elementów');
}
```

## Data Flow States

```
State Machine:

  IDLE ──────────┐
    │            │
    │ click      │ auto-load
    ▼            ▼
  LOADING ────────────┐
    │                 │
    │ success         │ error
    ▼                 ▼
  SUCCESS          ERROR
    │                 │
    └─────────────────┘
            │
         5 min? (optional)
            │
    ┌───────┘
    ▼
  LOADING...
```

## Browser Compatibility

### Required APIs

- `fetch()` - ES6 (2015+)
- `DOMParser` - All modern browsers
- `querySelector()` - All modern browsers
- CSS Grid - IE11+ (with fallback)
- CSS Variables - Chrome 49+, Firefox 31+

### Tested Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment Flow

```
Local Development
    │
    │ git push
    ▼
GitHub Repository
    │
    │ webhook
    ▼
Vercel Build Server
    │
    │ npm install
    │ npm run build
    ▼
Build Success
    │
    │ deploy
    ▼
Vercel CDN (Global)
    │
    │ DNS
    ▼
User Browser
```

## File Structure Explained

```
pviewer/
│
├── src/
│   └── pages/
│       └── index.astro      # Main app (303 lines)
│                             # - HTML structure
│                             # - Inline CSS
│                             # - Client-side JS
│
├── public/
│   └── favicon.svg          # Browser icon
│
├── dist/                    # Build output (gitignored)
│   └── index.html           # Deployed file
│
├── node_modules/            # Dependencies (gitignored)
│
├── package.json             # npm configuration
├── astro.config.mjs         # Astro settings
├── tsconfig.json            # TypeScript config
├── vercel.json              # Vercel deployment config
│
└── Documentation (*.md)
    ├── README.md            # Overview
    ├── QUICKSTART.md        # Quick deploy guide
    ├── DEPLOYMENT.md        # Full deploy guide
    ├── GIT_COMMANDS.md      # Git reference
    ├── TESTING.md           # Test procedures
    ├── NEXT_STEPS.md        # User guide
    └── ARCHITECTURE.md      # This file
```

## Why This Architecture?

### Pros

1. **Simple** - Single HTML file deployment
2. **Fast** - Static generation, no server processing
3. **Secure** - No backend to hack, VPN-protected data
4. **Cheap** - Free tier on Vercel
5. **Reliable** - CDN distribution, no server downtime
6. **Maintainable** - ~300 lines of code total

### Cons

1. **VPN Required** - Only works with VPN (by design)
2. **CORS Dependent** - Relies on server CORS policy
3. **Client-side Only** - No server-side caching
4. **Limited Auth** - Depends on browser cookies

### Alternatives Considered

#### Backend Proxy (NOT used)

```
Browser → Vercel API → SWIV
```
**Why NOT:**
- More complex
- Server costs
- VPN auth complications
- Not required per user

#### Server-Side Rendering (NOT used)

```
Browser → Vercel SSR → SWIV → Render → Browser
```
**Why NOT:**
- Slower
- More complex
- VPN issues on Vercel servers
- Unnecessary for static data display

## Future Enhancements (Optional)

### Auto-Refresh

Odkomentuj linię 300 w `index.astro`:
```javascript
setInterval(fetchData, 5 * 60 * 1000); // 5 min
```

### Multiple Sources

Dodaj więcej URL:
```javascript
const SOURCES = [
  { url: '...', name: 'Source 1' },
  { url: '...', name: 'Source 2' }
];
```

### Historical Data

LocalStorage caching:
```javascript
localStorage.setItem('history', JSON.stringify({
  timestamp: Date.now(),
  values: [val1, val2]
}));
```

### Notifications

Web Notifications API:
```javascript
if (val1 > threshold) {
  new Notification('Alert!', { body: 'Value exceeded' });
}
```

## Summary

PViewer jest prostą, efektywną aplikacją która:
- Używa Astro do generowania statycznego HTML
- Pobiera dane client-side z VPN-protected source
- Wyświetla w responsywnym, accessible UI
- Deployuje automatycznie przez Vercel
- Działa bez serwera backendowego
- Jest łatwa w utrzymaniu i rozbudowie
