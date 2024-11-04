// Variabili globali per memorizzare i dati dei giocatori
let playerData = [];
let maxPlayers = 5; // Numero massimo di giocatori per il confronto
let playerCount = 1; // Contatore dei giocatori da confrontare

// Funzione per caricare il CSV con PapaParse
function loadCSV() {
    Papa.parse('/data/player_stats_24-25_complete.csv', {
        download: true,
        header: true,
        complete: function(results) {
            playerData = results.data;
        }
    });
}

// Funzione per cercare un giocatore per nome
function findPlayer(playerName) {
    return playerData.find(player => player['Giocatore'].toLowerCase() === playerName.toLowerCase());
}

// Funzione per aggiornare il radar chart e la curva di apprendimento per un singolo giocatore
function analyzeSinglePlayer(playerStats) {
    const labels = ['Goal', 'Assist', 'Tiri', 'Dribbling', 'Passaggi Riusciti', 'Tackle'];
    const playerData = [
        parseInt(playerStats['Goal']) || 0,
        parseInt(playerStats['Ass']) || 0,
        parseInt(playerStats['Tiri']) || 0,
        parseInt(playerStats['Dribb Riusciti']) || 0,
        parseInt(playerStats['Pass Riusciti']) || 0,
        parseInt(playerStats['Tackle']) || 0
    ];

    // Radar chart
    const radarCtx = document.getElementById('singlePlayerRadarChart').getContext('2d');
    new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: playerStats['Giocatore'],
                data: playerData,
                backgroundColor: 'rgba(34, 202, 236, 0.2)',
                borderColor: 'rgba(34, 202, 236, 1)',
                borderWidth: 1
            }]
        },
        options: { scale: { ticks: { beginAtZero: true } } }
    });

    // Line chart (curva di apprendimento)
    const lineCtx = document.getElementById('singlePlayerLineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: playerStats['Giocatore'],
                data: playerData,
                borderColor: 'rgba(34, 202, 236, 1)',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    document.getElementById('singlePlayerRadarChart').style.display = 'block';
    document.getElementById('singlePlayerLineChart').style.display = 'block';
}

// Funzione per aggiornare i grafici per più giocatori
function updateMultiPlayerCharts(players) {
    const labels = ['Goal', 'Assist', 'Tiri', 'Dribbling', 'Passaggi Riusciti', 'Tackle'];

    const radarCtx = document.getElementById('multiPlayerRadarChart').getContext('2d');
    const radarDatasets = players.map(player => ({
        label: player['Giocatore'],
        data: [
            parseInt(player['Goal']) || 0,
            parseInt(player['Ass']) || 0,
            parseInt(player['Tiri']) || 0,
            parseInt(player['Dribb Riusciti']) || 0,
            parseInt(player['Pass Riusciti']) || 0,
            parseInt(player['Tackle']) || 0
        ],
        fill: true,
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1
    }));

    new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: radarDatasets
        },
        options: { scale: { ticks: { beginAtZero: true } } }
    });

    const lineCtx = document.getElementById('multiPlayerLineChart').getContext('2d');
    const lineDatasets = players.map(player => ({
        label: player['Giocatore'],
        data: [
            parseInt(player['Goal']) || 0,
            parseInt(player['Ass']) || 0,
            parseInt(player['Tiri']) || 0,
            parseInt(player['Dribb Riusciti']) || 0,
            parseInt(player['Pass Riusciti']) || 0,
            parseInt(player['Tackle']) || 0
        ],
        fill: false,
        borderColor: 'rgba(34, 202, 236, 1)'
    }));

    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: lineDatasets
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    document.getElementById('multiPlayerRadarChart').style.display = 'block';
    document.getElementById('multiPlayerLineChart').style.display = 'block';
}

// Gestione del menu a scorrimento
document.getElementById('singlePlayerLink').addEventListener('click', function() {
    document.getElementById('singlePlayerSection').style.display = 'block';
    document.getElementById('multiPlayerSection').style.display = 'none';
});

document.getElementById('multiPlayerLink').addEventListener('click', function() {
    document.getElementById('singlePlayerSection').style.display = 'none';
    document.getElementById('multiPlayerSection').style.display = 'block';
});

// Aggiungi un nuovo campo per il confronto di un altro giocatore
document.getElementById('addPlayerButton').addEventListener('click', function() {
    if (playerCount < maxPlayers) {
        playerCount++;
        const newPlayerField = document.createElement('div');
        newPlayerField.classList.add('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label');
        newPlayerField.innerHTML = `
            <input class="mdl-textfield__input" type="text" id="playerSearch${playerCount}">
            <label class="mdl-textfield__label" for="playerSearch${playerCount}">Giocatore ${playerCount}...</label>
        `;
        document.getElementById('playerInputs').appendChild(newPlayerField);
        componentHandler.upgradeElement(newPlayerField); // Necessario per Material Design Lite
    }
});

// Caricamento CSV
loadCSV();
