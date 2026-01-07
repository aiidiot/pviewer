const http = require('http');
const https = require('https');

const SOURCE_URL = 'https://swiv.grupawp.pl/#olap_serwisy/4/N4IgbglgzgrghgGwgLzgFwgewHYgFwgDmAThACYgA0408SqGOAygKZobaFT7YwILUMAWxbIcLfCACiMYpgAOLAPQAFOKW7UAZhARoWxbngDaoNAE9Fk4ROrEWWyQH0nNqiBsqDWMkdMgyWXQsXAIVAEYAEXcofXl8cMFLCQItBExMewoAXwBdbMozZMlY0k53e0cCKAh9J2w4EXc4AGNGUJAIXGowRBgWPxAhcXMAOnkEdx0G7CgWUYB3eXHJ3OpsTDR8LUQ56ghCDfsAYTg57d2WPOooCdq/IqtqtDLCdzIIEVmQktqWesathAUEyWzwoEqknkYHcFiewO8A3eEHsbR+BDIAxaLGwH3K1EUpEwFAIIAKICQQlqCQADHTrgjSEiTBCHAYcdioTDtJkhOh8I8UgEHHA+Fsen0hWSkvCRGdZBICqytOzsJyCDAYFNefzwR5ihiRWL3L0EP1JNL9bKWPL7GS1iB5F1sCwyJFPjiajg/A6ndgXWQmKCuWSgA';

let cachedData = null;
let lastFetch = 0;
const CACHE_TIME = 30000; // 30 sekund cache

function parseHTML(html) {
    const matches = html.match(/<div class="measure-label">(\d+)<\/div>/g);
    if (!matches || matches.length < 2) {
        return null;
    }

    const values = matches.map(m => m.match(/(\d+)/)[1]);
    return {
        value1: values[0],
        value2: values[1],
        timestamp: new Date().toISOString()
    };
}

function fetchData() {
    return new Promise((resolve, reject) => {
        // Sprawdź cache
        const now = Date.now();
        if (cachedData && (now - lastFetch) < CACHE_TIME) {
            console.log('Zwracam z cache');
            return resolve(cachedData);
        }

        console.log('Pobieram świeże dane...');

        https.get(SOURCE_URL, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const parsed = parseHTML(data);
                if (parsed) {
                    cachedData = parsed;
                    lastFetch = Date.now();
                    resolve(parsed);
                } else {
                    reject(new Error('Nie znaleziono danych'));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

const server = http.createServer((req, res) => {
    // CORS - pozwól na dostęp z telefonu
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/api/data') {
        fetchData()
            .then(data => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            })
            .catch(err => {
                console.error('Błąd:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            });
    } else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PViewer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            width: 100%;
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
        }
        .card.green {
            border-top: 5px solid #38ef7d;
        }
        .card.blue {
            border-top: 5px solid #00f2fe;
        }
        .card-label {
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            opacity: 0.6;
            color: #333;
        }
        .card-value {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .card.green .card-value {
            background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .card.blue .card-value {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .button-container {
            text-align: center;
        }
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        button:hover {
            transform: scale(1.05);
        }
        button:active {
            transform: scale(0.95);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .timestamp {
            text-align: center;
            margin-top: 20px;
            color: white;
            opacity: 0.8;
            font-size: 0.9rem;
        }
        .error {
            background: rgba(255, 59, 48, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .loading .card-value {
            animation: pulse 1.5s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="error" class="error" style="display: none;"></div>

        <div class="cards" id="cards">
            <div class="card green">
                <div class="card-label">Wartość 1</div>
                <div class="card-value" id="value1">---</div>
            </div>
            <div class="card blue">
                <div class="card-label">Wartość 2</div>
                <div class="card-value" id="value2">---</div>
            </div>
        </div>

        <div class="button-container">
            <button id="refreshBtn" onclick="refreshData()">🔄 Odśwież</button>
        </div>

        <div class="timestamp">
            Ostatnia aktualizacja: <span id="time">nigdy</span>
        </div>
    </div>

    <script>
        function formatNumber(num) {
            return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
        }

        function showError(msg) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        function refreshData() {
            const cards = document.getElementById('cards');
            const btn = document.getElementById('refreshBtn');

            cards.classList.add('loading');
            btn.disabled = true;
            btn.textContent = '⏳ Ładowanie...';

            fetch('/api/data')
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }

                    document.getElementById('value1').textContent = formatNumber(data.value1);
                    document.getElementById('value2').textContent = formatNumber(data.value2);

                    const time = new Date(data.timestamp).toLocaleTimeString('pl-PL');
                    document.getElementById('time').textContent = time;

                    cards.classList.remove('loading');
                    btn.disabled = false;
                    btn.textContent = '🔄 Odśwież';
                })
                .catch(err => {
                    console.error('Błąd:', err);
                    showError('Błąd pobierania danych: ' + err.message);
                    cards.classList.remove('loading');
                    btn.disabled = false;
                    btn.textContent = '🔄 Odśwież';
                });
        }

        // Automatyczne odświeżenie przy starcie
        refreshData();

        // Auto-refresh co minutę
        setInterval(refreshData, 60000);
    </script>
</body>
</html>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║         Serwer działa!                 ║
╠════════════════════════════════════════╣
║  Lokalnie:     http://localhost:${PORT}  ║
║  W sieci:      http://[TWOJE_IP]:${PORT} ║
╠════════════════════════════════════════╣
║  Endpoint API: /api/data               ║
║  Frontend:     /                       ║
╚════════════════════════════════════════╝

Aby znaleźć swoje IP w sieci:
  Linux/Mac: hostname -I | awk '{print $1}'
  Windows:   ipconfig | findstr IPv4

Otwórz na telefonie: http://[TWOJE_IP]:${PORT}
    `);
});
