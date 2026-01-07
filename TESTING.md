# Testowanie Aplikacji PViewer

## Testy Lokalne

### 1. Test Development Server

```bash
cd /home/r/pviewer
npm run dev
```

Aplikacja powinna uruchomić się na `http://localhost:4321`

**Co sprawdzić:**
- [ ] Strona się załadowała
- [ ] Widoczne dwie karty (zielona i niebieska)
- [ ] Przycisk "Odśwież" jest widoczny
- [ ] Gradient w tle wyświetla się poprawnie
- [ ] Responsywność - zmień szerokość okna

### 2. Test Build

```bash
cd /home/r/pviewer
npm run build
```

**Oczekiwany output:**
```
✓ Completed in XXms.
✓ built in XXms
1 page(s) built in X.XXs
Complete!
```

**Co sprawdzić:**
- [ ] Build zakończył się sukcesem
- [ ] Folder `dist/` został utworzony
- [ ] Plik `dist/index.html` istnieje

### 3. Test Preview Build

```bash
npm run preview
```

Otwórz `http://localhost:4321`

**Co sprawdzić:**
- [ ] Strona działa identycznie jak w dev mode
- [ ] CSS jest poprawnie załadowany
- [ ] JavaScript działa

## Testy Funkcjonalne

### Test 1: Ładowanie bez VPN

**Kroki:**
1. Upewnij się że NIE jesteś na VPN
2. Otwórz aplikację
3. Kliknij "Odśwież"

**Oczekiwany rezultat:**
- Komunikat błędu: "Nie można pobrać danych. Sprawdź czy jesteś połączony z VPN..."
- Wartości pokazują "Błąd"
- Czerwony box z błędem

### Test 2: Ładowanie z VPN

**Kroki:**
1. Połącz się z VPN służbowym
2. Otwórz aplikację lub odśwież jeśli już otwarta
3. Poczekaj na załadowanie

**Oczekiwany rezultat:**
- Skeleton loading przez moment
- Wartości się załadowały (liczby z formatowaniem)
- Zielony komunikat "Dane zaktualizowane: [timestamp]"

### Test 3: Przycisk Odśwież

**Kroki:**
1. Będąc na VPN, kliknij "Odśwież"

**Oczekiwany rezultat:**
- Przycisk zmienia się na "Ładowanie..." z animacją
- Przycisk jest disabled podczas ładowania
- Wartości pokazują skeleton
- Po załadowaniu - nowe dane i timestamp

### Test 4: Responsywność

**Kroki:**
1. Otwórz DevTools (F12)
2. Włącz Device Toolbar (Ctrl+Shift+M)
3. Testuj różne rozdzielczości:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Oczekiwany rezultat:**
- Karty układają się w kolumnie na mobile
- Karty obok siebie na desktop
- Wszystko jestczytelne
- Nie ma overflow

### Test 5: Konsola Przeglądarki

**Kroki:**
1. Otwórz DevTools (F12)
2. Przejdź do zakładki "Console"
3. Kliknij "Odśwież" w aplikacji

**Sprawdź:**
- [ ] Brak błędów JavaScript (czerwonych)
- [ ] Jeśli błąd fetch - komunikat jest jasny
- [ ] Logi są czytelne (można zobaczyć response)

## Testy Browser Compatibility

### Desktop
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)

### Mobile
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)

## Testy Performance

### Lighthouse (Chrome DevTools)

```bash
# Zbuduj aplikację
npm run build
npm run preview
```

**Kroki:**
1. Otwórz aplikację w Chrome
2. F12 > Lighthouse tab
3. Wybierz "Desktop" lub "Mobile"
4. Kliknij "Analyze page load"

**Oczekiwane wyniki:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

### Bundle Size

```bash
npm run build
ls -lh dist/*.js dist/*.css 2>/dev/null || echo "No bundles (good!)"
```

**Oczekiwany rezultat:**
- Brak lub minimalne pliki JS (Astro zero-JS)
- Inline CSS w HTML

## Test Deployment

### Pre-deployment Checklist

Przed pushem na GitHub/Vercel:

- [ ] `npm run build` działa bez błędów
- [ ] `npm run preview` pokazuje poprawną stronę
- [ ] Wszystkie testy funkcjonalne przeszły
- [ ] Kod jest scommitowany
- [ ] Git log wygląda dobrze (`git log --oneline`)

### Post-deployment Checklist

Po deploymencie na Vercel:

- [ ] Deployment zakończył się sukcesem
- [ ] URL aplikacji działa
- [ ] Test ładowania z VPN działa
- [ ] Test ładowania bez VPN pokazuje błąd
- [ ] Wszystkie funkcjonalności działają jak lokalnie

## Debugging

### Problem: Fetch nie działa

**Sprawdź w konsoli:**
```javascript
// Otwórz Console i wklej:
fetch('https://swiv.grupawp.pl/#olap_serwisy/4/...')
  .then(r => r.text())
  .then(html => console.log(html.substring(0, 500)))
  .catch(e => console.error(e))
```

### Problem: Parsowanie HTML nie działa

**Test parsera:**
```javascript
// W konsoli:
const parser = new DOMParser();
const doc = parser.parseFromString('<div class="measure-label">123</div>', 'text/html');
const labels = doc.querySelectorAll('.measure-label');
console.log(labels.length, labels[0]?.textContent);
```

### Problem: CORS errors

To jest normalne! Sprawdź:
- Czy jesteś na VPN?
- Czy server odpowiada?
- Network tab w DevTools - jaki status HTTP?

## Automated Tests (przyszłość)

Możliwość dodania w przyszłości:

```bash
# Playwright dla E2E testów
npm install -D @playwright/test

# Vitest dla unit testów
npm install -D vitest
```

## Log Testing Session

Zapisz wyniki testów:

```
Data: _____________
Tester: ___________
VPN: TAK / NIE

Test 1 - Dev Server:     ✓ / ✗
Test 2 - Build:          ✓ / ✗
Test 3 - Preview:        ✓ / ✗
Test 4 - Fetch bez VPN:  ✓ / ✗
Test 5 - Fetch z VPN:    ✓ / ✗
Test 6 - Odśwież:        ✓ / ✗
Test 7 - Responsywność:  ✓ / ✗
Test 8 - Konsola:        ✓ / ✗

Notatki:
_______________________
_______________________
```
