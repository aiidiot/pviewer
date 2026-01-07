const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

const SOURCE_URL = 'https://swiv.grupawp.pl/#olap_serwisy/4/N4IgbglgzgrghgGwgLzgFwgewHYgFwgDmAThACYgA0408SqGOAygKZobaFT7YwILUMAWxbIcLfCACiMYpgAOLAPQAFOKW7UAZhARoWxbngDaoNAE9Fk4ROrEWWyQH0nNqiBsqDWMkdMgyWXQsXAIVAEYAEXcofXl8cMFLCQItBExMewoAXwBdbMozZMlY0k53e0cCKAh9J2w4EXc4AGNGUJAIXGowRBgWPxAhcXMAOnkEdx0G7CgWUYB3eXHJ3OpsTDR8LUQ56ghCDfsAYTg57d2WPOooCdq/IqtqtDLCdzIIEVmQktqWesathAUEyWzwoEqknkYHcFiewO8A3eEHsbR+BDIAxaLGwH3K1EUpEwFAIIAKICQQlqCQADHTrgjSEiTBCHAYcdioTDtJkhOh8I8UgEHHA+Fsen0hWSkvCRGdZBICqytOzsJyCDAYFNefzwR5ihiRWL3L0EP1JNL9bKWPL7GS1iB5F1sCwyJFPjiajg/A6ndgXWQmKCuWSgA';

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
        https.get(SOURCE_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const parsed = parseHTML(data);
                if (parsed) {
                    resolve(parsed);
                } else {
                    reject(new Error('Data not found'));
                }
            });
        }).on('error', reject);
    });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function generateHTML(data) {
    return `<!DOCTYPE html>
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
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
            position: relative;
        }
        .card:hover {
            transform: translateY(-5px);
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
            background-clip: text;
        }
        .card.blue .card-value {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .timestamp {
            text-align: center;
            color: white;
            opacity: 0.8;
            font-size: 0.9rem;
        }
        .refresh-info {
            text-align: center;
            color: white;
            opacity: 0.6;
            font-size: 0.85rem;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="cards">
            <div class="card green">
                <div class="card-label">Wartość 1</div>
                <div class="card-value">${formatNumber(data.value1)}</div>
            </div>
            <div class="card blue">
                <div class="card-label">Wartość 2</div>
                <div class="card-value">${formatNumber(data.value2)}</div>
            </div>
        </div>
        <div class="timestamp">
            Ostatnia aktualizacja: ${new Date(data.timestamp).toLocaleString('pl-PL')}
        </div>
        <div class="refresh-info">
            Odśwież stronę aby zobaczyć nowe dane
        </div>
    </div>
</body>
</html>`;
}

function pushToGitHub(html) {
    try {
        // Zapisz HTML
        fs.writeFileSync('index.html', html);

        // Git operations
        execSync('git add index.html', { stdio: 'inherit' });

        const timestamp = new Date().toLocaleString('pl-PL');
        execSync(`git commit -m "Update data ${timestamp}"`, { stdio: 'inherit' });

        // Push z tokenem
        const token = execSync('gh auth token').toString().trim();
        execSync(`git remote set-url origin https://${token}@github.com/aiidiot/pviewer.git`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        execSync('git remote set-url origin https://github.com/aiidiot/pviewer.git', { stdio: 'inherit' });

        console.log(`✅ Zaktualizowano: ${timestamp}`);
    } catch (err) {
        console.error('❌ Błąd Git:', err.message);
    }
}

async function update() {
    try {
        console.log('Pobieram dane...');
        const data = await fetchData();
        console.log(`Dane: ${data.value1} / ${data.value2}`);

        const html = generateHTML(data);
        pushToGitHub(html);
    } catch (err) {
        console.error('❌ Błąd:', err.message);
    }
}

// Główna pętla
console.log('🚀 PViewer updater uruchomiony');
console.log('📱 Strona: https://aiidiot.github.io/pviewer/');
console.log('🔄 Aktualizacja co 1 minutę\n');

// Pierwsza aktualizacja od razu
update();

// Potem co minutę
setInterval(update, 60000);
