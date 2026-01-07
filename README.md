# PViewer

Data viewer.

## Setup (one time)

1. Get GitHub token: https://github.com/settings/tokens/new
   - Select: `repo` scope
   - Copy the token

2. Edit `updater.html` line 152:
   ```javascript
   const GITHUB_TOKEN = 'paste_your_token_here';
   ```

## Usage

Open `updater.html` in browser on computer with VPN.
Leave tab open - auto-updates every minute.

View result: https://aiidiot.github.io/pviewer/
