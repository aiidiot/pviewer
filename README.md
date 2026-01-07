# PViewer - Monitor Danych

Prosta aplikacja webowa do monitorowania dwóch wartości z systemu SWIV Grupy WP.

## Szybki Start

**Nowy użytkownik?** Zobacz [QUICKSTART.md](QUICKSTART.md) dla skróconej instrukcji wdrożenia.

## Dokumentacja

- [QUICKSTART.md](QUICKSTART.md) - Szybki przewodnik wdrożenia (5 minut)
- [DEPLOYMENT.md](DEPLOYMENT.md) - Pełna instrukcja wdrożenia na Vercel
- [GIT_COMMANDS.md](GIT_COMMANDS.md) - Przewodnik po komendach Git
- [TESTING.md](TESTING.md) - Instrukcje testowania aplikacji

## Opis

Aplikacja pobiera dane bezpośrednio z przeglądarki użytkownika (client-side fetch), dzięki czemu działa tylko gdy użytkownik jest zalogowany na VPN służbowym. Wyświetla dwie wartości `measure-label` w kolorowych kartach:

- **Wartość 1** (zielona): Pierwsza wartość measure-label
- **Wartość 2** (niebieska): Druga wartość measure-label

## Wymagania

- Połączenie VPN z dostępem do `swiv.grupawp.pl`
- Konto GitHub
- Konto Vercel

## Instalacja lokalna

```bash
# Sklonuj repozytorium
git clone https://github.com/TWOJE_KONTO/pviewer.git
cd pviewer

# Zainstaluj zależności
npm install

# Uruchom serwer developerski
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:4321`

## Deployment na Vercel

### Metoda 1: Przez GitHub (zalecana)

1. **Wypchnij kod na GitHub:**
   ```bash
   # W katalogu projektu
   git init
   git add .
   git commit -m "Initial commit: PViewer application"
   git branch -M main
   git remote add origin https://github.com/TWOJE_KONTO/pviewer.git
   git push -u origin main
   ```

2. **Wdróż na Vercel:**
   - Przejdź na [vercel.com](https://vercel.com)
   - Zaloguj się przez GitHub
   - Kliknij "Add New Project"
   - Wybierz repozytorium `pviewer`
   - Vercel automatycznie wykryje Astro
   - Kliknij "Deploy"

### Metoda 2: Przez Vercel CLI

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy na produkcję
vercel --prod
```

## Użycie

1. Otwórz aplikację w przeglądarce
2. Upewnij się, że jesteś połączony z VPN
3. Aplikacja automatycznie pobierze dane przy pierwszym załadowaniu
4. Użyj przycisku "Odśwież" aby zaktualizować dane

## Technologie

- **Astro 5** - Framework webowy (zero-JS by default)
- **Vanilla JavaScript** - Client-side fetching i parsowanie HTML
- **CSS3** - Stylizacja, animacje i responsywność
- **Vercel** - Hosting i deployment

## Uwagi

- Aplikacja działa tylko gdy użytkownik jest połączony z VPN służbowym
- Dane są pobierane bezpośrednio z przeglądarki (client-side), nie przez serwer
- Automatyczne odświeżanie co 5 minut jest zakomentowane (linia 300 w `src/pages/index.astro`)
- URL źródłowy jest zakodowany w aplikacji (linia 215)

## Struktura projektu

```text
pviewer/
├── src/
│   └── pages/
│       └── index.astro    # Główna strona aplikacji
├── public/                # Pliki statyczne
├── package.json           # Zależności npm
├── astro.config.mjs       # Konfiguracja Astro
├── vercel.json            # Konfiguracja Vercel
└── README.md              # Ten plik
```

## Funkcjonalności

- Automatyczne pobieranie danych przy starcie
- Przycisk odświeżania danych
- Skeleton loading podczas ładowania
- Obsługa błędów z informacjami dla użytkownika
- Responsywny design (działa na desktop i mobile)
- Formatowanie liczb z separatorami tysięcy
- Timestamp ostatniej aktualizacji

## Rozwiązywanie problemów

**Problem: "Nie można pobrać danych"**
- Sprawdź czy jesteś połączony z VPN
- Upewnij się że masz dostęp do swiv.grupawp.pl
- Sprawdź konsolę przeglądarki (F12) dla szczegółów błędu

**Problem: "Nie znaleziono wymaganych elementów"**
- Struktura HTML źródłowego może się zmienić
- Sprawdź czy elementy `.measure-label` nadal istnieją na stronie

## Licencja

MIT
