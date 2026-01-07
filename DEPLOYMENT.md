# Instrukcja Wdrożenia PViewer

## Krok 1: Przygotowanie Repozytorium GitHub

### 1.1 Utwórz nowe repozytorium na GitHub

1. Przejdź na [github.com/new](https://github.com/new)
2. Nazwa repozytorium: `pviewer`
3. Opis (opcjonalnie): "Monitor danych SWIV - aplikacja webowa"
4. Ustaw jako **Public** lub **Private** (według preferencji)
5. **NIE** zaznaczaj "Add a README file"
6. **NIE** zaznaczaj "Add .gitignore"
7. Kliknij "Create repository"

### 1.2 Wypchnij lokalny kod na GitHub

GitHub pokaże Ci instrukcje. Użyj tej komendy (zamień `TWOJE_KONTO` na swoją nazwę użytkownika GitHub):

```bash
cd /home/r/pviewer
git remote add origin https://github.com/TWOJE_KONTO/pviewer.git
git push -u origin main
```

Jeśli używasz SSH:
```bash
git remote add origin git@github.com:TWOJE_KONTO/pviewer.git
git push -u origin main
```

## Krok 2: Wdrożenie na Vercel

### Metoda A: Przez Interfejs Web (Zalecana)

1. **Przejdź na Vercel:**
   - Otwórz [vercel.com](https://vercel.com)
   - Kliknij "Sign Up" lub "Log In"

2. **Zaloguj się przez GitHub:**
   - Wybierz "Continue with GitHub"
   - Autoryzuj Vercel do dostępu do Twojego konta GitHub

3. **Dodaj Nowy Projekt:**
   - Po zalogowaniu kliknij "Add New..."
   - Wybierz "Project"

4. **Importuj Repozytorium:**
   - Znajdź `pviewer` na liście repozytoriów
   - Kliknij "Import"

5. **Skonfiguruj Projekt:**
   - **Framework Preset:** Vercel automatycznie wykryje "Astro"
   - **Build Command:** `npm run build` (automatycznie ustawione)
   - **Output Directory:** `dist` (automatycznie ustawione)
   - **Install Command:** `npm install` (automatycznie ustawione)
   - **Root Directory:** `./` (pozostaw domyślne)

6. **Deploy:**
   - Kliknij "Deploy"
   - Poczekaj ~1-2 minuty na zakończenie deploymentu
   - Otrzymasz URL typu: `https://pviewer-xxx.vercel.app`

### Metoda B: Przez CLI

Jeśli wolisz terminal:

```bash
# Zainstaluj Vercel CLI globalnie
npm install -g vercel

# W katalogu projektu
cd /home/r/pviewer

# Zaloguj się do Vercel
vercel login

# Deploy (pierwszy raz - preview)
vercel

# Deploy na produkcję
vercel --prod
```

Podczas pierwszego deployu CLI zapyta:

```
? Set up and deploy "~/pviewer"? [Y/n] Y
? Which scope do you want to deploy to? [Wybierz swoje konto]
? Link to existing project? [N] N
? What's your project's name? pviewer
? In which directory is your code located? ./
```

## Krok 3: Weryfikacja

1. **Otwórz URL aplikacji** (otrzymany z Vercel)
2. **Sprawdź czy:**
   - Strona się załadowała
   - Widzisz dwie karty (zielona i niebieska)
   - Przycisk "Odśwież" jest widoczny

3. **Testuj z VPN:**
   - Połącz się z VPN służbowym
   - Odśwież stronę lub kliknij "Odśwież"
   - Powinieneś zobaczyć dane z SWIV

## Krok 4: Konfiguracja Domeny (Opcjonalnie)

Jeśli chcesz własną domenę:

1. W Vercel, przejdź do projektu `pviewer`
2. Kliknij "Settings"
3. Wybierz "Domains"
4. Dodaj swoją domenę i postępuj według instrukcji

## Automatyczne Deploymenty

Po pierwszym wdrożeniu, każdy push do branch `main` automatycznie:
- Zbuduje aplikację
- Uruchomi deployment na Vercel
- Zaktualizuje aplikację produkcyjną

### Jak to działa:

```bash
# Zrób zmiany w kodzie
# Np. edytuj src/pages/index.astro

# Commituj zmiany
git add .
git commit -m "Zaktualizowano style"

# Wypchnij na GitHub
git push

# Vercel automatycznie zdeployuje nową wersję!
```

## Monitoring i Logi

1. **Panel Vercel:**
   - Przejdź na [vercel.com/dashboard](https://vercel.com/dashboard)
   - Wybierz projekt `pviewer`
   - Zobacz deployments, analytics, logi

2. **Sprawdzanie Logów:**
   - W projekcie kliknij zakładkę "Deployments"
   - Wybierz deployment
   - Zobacz szczegółowe logi budowania

## Rozwiązywanie Problemów

### Problem: Build Failed

**Sprawdź logi:**
1. Przejdź do failed deployment w Vercel
2. Zobacz szczegóły błędu w zakładce "Building"

**Najczęstsze przyczyny:**
- Błąd w kodzie (sprawdź lokalnie: `npm run build`)
- Brakujące zależności (sprawdź `package.json`)

**Rozwiązanie:**
```bash
# Lokalnie przetestuj build
cd /home/r/pviewer
npm run build

# Jeśli działa, wypchnij ponownie
git push
```

### Problem: Aplikacja nie ładuje danych

**To normalne!** Aplikacja działa tylko z VPN.

**Sprawdź:**
1. Czy jesteś połączony z VPN?
2. Czy masz dostęp do `swiv.grupawp.pl`?
3. Otwórz konsolę przeglądarki (F12) i zobacz błędy

### Problem: 404 Not Found

**Sprawdź:**
- Czy deployment się zakończył sukcesem?
- Czy URL jest poprawny?
- Czy folder `dist` został wygenerowany?

## Zmienne Środowiskowe (jeśli potrzebne w przyszłości)

Obecnie aplikacja nie wymaga zmiennych środowiskowych, ale jeśli będą potrzebne:

1. W Vercel, przejdź do Settings > Environment Variables
2. Dodaj zmienną (np. `API_URL`)
3. Redeploy projekt

## Rollback do Poprzedniej Wersji

Jeśli nowa wersja ma problemy:

1. Przejdź do projektu w Vercel
2. Kliknij "Deployments"
3. Znajdź poprzedni działający deployment
4. Kliknij "..." (three dots)
5. Wybierz "Promote to Production"

## Dodatkowe Komendy

```bash
# Zobacz status projektu
cd /home/r/pviewer
git status

# Zobacz historię commitów
git log --oneline

# Zobacz branch
git branch

# Lokalny development server
npm run dev

# Build lokalnie
npm run build

# Preview build
npm run preview
```

## Pomoc i Wsparcie

- **Vercel Docs:** https://vercel.com/docs
- **Astro Docs:** https://docs.astro.build
- **GitHub Issues:** Utwórz issue w swoim repo jeśli potrzebujesz pomocy
