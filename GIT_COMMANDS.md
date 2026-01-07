# Komendy Git dla PViewer

## Przygotowanie do wysłania na GitHub

### Opcja 1: HTTPS (zalecane dla nowych użytkowników)

```bash
cd /home/r/pviewer

# Dodaj remote (ZAMIEŃ "TWOJE_KONTO" na swoją nazwę użytkownika GitHub!)
git remote add origin https://github.com/TWOJE_KONTO/pviewer.git

# Wypchnij kod
git push -u origin main
```

Podczas pierwszego pusha GitHub poprosi o:
- Username: twoja nazwa użytkownika GitHub
- Password: **Personal Access Token** (NIE hasło do konta!)

#### Jak utworzyć Personal Access Token:
1. Przejdź na GitHub.com
2. Kliknij na swój avatar (prawy górny róg)
3. Settings > Developer settings > Personal access tokens > Tokens (classic)
4. Generate new token (classic)
5. Nazwij token: "pviewer-deployment"
6. Wybierz scope: zaznacz `repo` (wszystkie pod nim)
7. Kliknij "Generate token"
8. **SKOPIUJ TOKEN!** (nie zobaczysz go ponownie)
9. Użyj tego tokena jako "password" podczas `git push`

### Opcja 2: SSH (dla zaawansowanych)

Jeśli masz skonfigurowany SSH key:

```bash
cd /home/r/pviewer

# Dodaj remote przez SSH
git remote add origin git@github.com:TWOJE_KONTO/pviewer.git

# Wypchnij kod
git push -u origin main
```

## Sprawdzenie konfiguracji

```bash
# Sprawdź czy remote jest dodany
git remote -v

# Powinno wyświetlić:
# origin  https://github.com/TWOJE_KONTO/pviewer.git (fetch)
# origin  https://github.com/TWOJE_KONTO/pviewer.git (push)
```

## Jeśli coś poszło nie tak

### Usunięcie błędnego remote
```bash
git remote remove origin
```

### Dodanie ponownie
```bash
git remote add origin https://github.com/POPRAWNE_KONTO/pviewer.git
```

### Zmiana URL remote
```bash
git remote set-url origin https://github.com/NOWE_KONTO/pviewer.git
```

## Przydatne komendy

```bash
# Zobacz status
git status

# Zobacz historię commitów
git log --oneline

# Zobacz jakie pliki są w repo
git ls-files

# Zobacz ostatnie zmiany
git show

# Zobacz branch
git branch
```

## Aktualizacje w przyszłości

Po pierwszym pushu, do wysyłania zmian wystarczy:

```bash
# Zrób zmiany w plikach...

# Dodaj wszystkie zmienione pliki
git add .

# Lub dodaj konkretny plik
git add src/pages/index.astro

# Commituj
git commit -m "Opis zmian"

# Wypchnij
git push
```

## Konfiguracja użytkownika (opcjonalnie)

Git może wyświetlać ostrzeżenia o konfiguracji. Możesz je ustawić:

```bash
git config --global user.name "Twoje Imię"
git config --global user.email "twoj.email@example.com"
```

To ustawienie jest globalne dla wszystkich repozytoriów na tym komputerze.

## Przykładowy workflow

```bash
# 1. Zrób zmiany w kodzie
# ... edycja plików ...

# 2. Zobacz co się zmieniło
git status
git diff

# 3. Dodaj zmiany
git add .

# 4. Commituj z opisem
git commit -m "Zaktualizowano kolory kart"

# 5. Wypchnij na GitHub
git push

# 6. Vercel automatycznie deployuje!
# Sprawdź status na vercel.com/dashboard
```

## Pomoc

Jeśli masz problemy:
- Zobacz pełną dokumentację: [DEPLOYMENT.md](DEPLOYMENT.md)
- GitHub Docs: https://docs.github.com
- Git Tutorial: https://git-scm.com/docs/gittutorial
