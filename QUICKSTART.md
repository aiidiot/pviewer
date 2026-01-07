# Quick Start - PViewer

Szybki przewodnik wdrożenia aplikacji PViewer na Vercel.

## Szybkie Kroki

### 1. Utwórz repo na GitHub
```bash
# Na GitHub: github.com/new
# Nazwa: pviewer
# Pozostaw puste (bez README, bez .gitignore)
```

### 2. Wypchnij kod
```bash
cd /home/r/pviewer

# Zamień TWOJE_KONTO na swoją nazwę użytkownika GitHub
git remote add origin https://github.com/TWOJE_KONTO/pviewer.git
git push -u origin main
```

### 3. Deploy na Vercel
```
1. Przejdź na vercel.com
2. Zaloguj się przez GitHub
3. Kliknij "Add New... > Project"
4. Wybierz repozytorium "pviewer"
5. Kliknij "Deploy"
6. Poczekaj ~2 minuty
7. Gotowe! Otrzymasz URL: https://pviewer-xxx.vercel.app
```

## Testowanie

### Lokalnie
```bash
cd /home/r/pviewer
npm run dev
# Otwórz http://localhost:4321
```

### Build Test
```bash
npm run build
npm run preview
```

## Po Wdrożeniu

1. Otwórz URL z Vercel
2. Połącz się z VPN
3. Kliknij "Odśwież"
4. Zobacz dane z SWIV

## Aktualizacje

Każdy push do `main` automatycznie deployuje:

```bash
# Zrób zmiany w kodzie
git add .
git commit -m "Twoja wiadomość"
git push
# Vercel automatycznie deployuje!
```

## Potrzebujesz Pomocy?

Zobacz pełną dokumentację w [DEPLOYMENT.md](DEPLOYMENT.md)
