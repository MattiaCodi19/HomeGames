let players = [];
let currentPlayer = 0;

// 📚 DATABASE GRANDI
const database = {
    generale: [
        "cane","gatto","pizza","telefono","mare","sole","computer","libro","penna","sedia",
        "tavolo","scarpa","porta","finestra","macchina","strada","montagna","fiume","albero","fiore",
        "pane","latte","formaggio","uovo","borsa","zaino","quaderno","scuola","università","lavoro",
        "spiaggia","isola","barca","treno","aereo","stazione","negozio","supermercato","ristorante","hotel",
        "chiave","luce","lampada","specchio","letto","cuscino","coperta","doccia","bagno","sapone",
        "bicchiere","forchetta","coltello","piatto","bicicletta","motorino","televisione","film","musica","gioco",
        "tempo","giorno","notte","mese","anno","amico","famiglia","bambino","adulto","città",
        "villaggio","telefono","internet","social","email","lettera","foto","video","arte","sport",
        "energia","acqua","fuoco","aria","terra","vento","pioggia","neve","ghiaccio","tempesta"
    ],

    calcio: [
        "Messi","Ronaldo","Maradona","Pelé","Zidane","Ronaldinho","Buffon","Del Piero","Totti","Maldini",
        "Neymar","Mbappé","Haaland","Baggio","Pirlo","Iniesta","Xavi","Kaká","Beckham","Ribery",
        "Juventus","Milan","Inter","Napoli","Roma","Lazio","Atalanta","Fiorentina",
        "Real Madrid","Barcellona","Chelsea","Arsenal","Liverpool","Manchester City","PSG","Bayern Monaco",
        "Champions League","Europa League","Mondiale","Serie A","Premier League","Liga","Bundesliga",
        "San Siro","Camp Nou","Bernabeu","Allianz Stadium","Old Trafford","Anfield","Parco dei Principi", "San Nicola"
    ],

    cinema: [
        "Titanic","Avatar","Inception","Interstellar","Gladiatore","Matrix","Joker","Batman",
        "Superman","Avengers","Spiderman","Harry Potter","Il Signore degli Anelli","Star Wars",
        "Horror","Commedia","Thriller","Dramma","Fantascienza","Animazione",
        "Regista","Attore","Attrice","Oscar","Cinema","Film","Serie TV","Netflix","Disney+"
    ],

    geografia: [
        "Italia","Francia","Germania","Spagna","Portogallo","Grecia","Olanda","Belgio",
        "Roma","Parigi","Londra","Madrid","Berlino","Amsterdam","Bruxelles",
        "Europa","Asia","Africa","America","Oceania",
        "Alpi","Himalaya","Sahara","Watussi","Nilo","Danubio","Po","Tevere",
        "Oceano","Mare","Lago","Fiume","Isola","Penisola","Continente"
    ],

    altro: [
        "Minecraft","Fortnite","Call of Duty","FIFA","GTA","League of Legends","Zinco",
        "YouTube","TikTok","Instagram","Twitch","Discord",
        "PlayStation","Xbox","Nintendo","PC","Streaming","Influencer","Podcast", "Fistola",
    ]
};

// 🔒 LIMITE 3 + SALVATAGGIO NOMI
document.addEventListener("DOMContentLoaded", () => {
    createNameInputs();

    const savedNames = JSON.parse(localStorage.getItem("playerNames") || "[]");
    savedNames.forEach((name, i) => {
        const input = document.getElementById("name" + i);
        if (input) input.value = name;
    });

    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const checked = document.querySelectorAll("input[type=checkbox]:checked");
            if (checked.length > 3) {
                cb.checked = false;
                alert("Massimo 3 categorie!");
            }
        });
    });
});

// 👤 CREA INPUT
function createNameInputs() {
    const num = document.getElementById("players").value;
    const container = document.getElementById("names");
    container.innerHTML = "";

    for (let i = 0; i < num; i++) {
        const div = document.createElement("div");

        div.innerHTML = `
            <input type="text" id="name${i}" placeholder="Giocatore ${i + 1}">
        `;

        container.appendChild(div);
    }
}

// ▶️ START
function startGame() {
    const numPlayers = +document.getElementById("players").value;
    const numImpostors = +document.getElementById("impostors").value;
    const numInfiltrates = +document.getElementById("infiltrates").value;

    const selectedCategories = Array.from(
        document.querySelectorAll("input[type=checkbox]:checked")
    ).map(el => el.value);

    if (selectedCategories.length === 0) {
        alert("Seleziona almeno una categoria");
        return;
    }

    let names = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById("name" + i).value || ("Giocatore " + (i + 1));
        names.push(name);
    }

    localStorage.setItem("playerNames", JSON.stringify(names));

    let wordPool = [];
    selectedCategories.forEach(cat => {
        wordPool.push(...database[cat]);
    });

    const mainWord = random(wordPool);
    const infiltrateWord = random(wordPool.filter(w => w !== mainWord));

    players = names.map(n => ({
        name: n,
        role: "innocente",
        word: mainWord
    }));

    shuffle(players);

    for (let i = 0; i < numImpostors; i++) {
        players[i].role = "impostore";
        players[i].word = "IMPOSTORE";
    }

    for (let i = numImpostors; i < numImpostors + numInfiltrates; i++) {
        players[i].role = "infiltrato";
        players[i].word = infiltrateWord;
    }

    shuffle(players);

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";

    updateTurn();
}

// 🔄 TURNO
function updateTurn() {
    document.getElementById("playerTurn").innerText =
        players[currentPlayer].name;
    document.getElementById("word").innerText = "";
}

function showWord() {
    document.getElementById("word").innerText =
        players[currentPlayer].word;
}

function nextPlayer() {
    currentPlayer++;

    if (currentPlayer >= players.length) {
        startVote();
        return;
    }

    updateTurn();
}

// 🗳️ VOTAZIONE (SOLO RUOLO)
function startVote() {
    document.getElementById("game").style.display = "none";
    document.getElementById("vote").style.display = "block";

    const container = document.getElementById("voteButtons");
    container.innerHTML = "";

    players.forEach((p) => {
        const btn = document.createElement("button");
        btn.innerText = p.name;

        btn.onclick = () => {
            alert(`${p.name} è: ${p.role}`);
        };

        container.appendChild(btn);
    });
}

function endVote() {
    location.reload();
}

// UTIL
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// NOMI
function clearNames() {
    localStorage.removeItem("playerNames");

    const inputs = document.querySelectorAll("#names input");
    inputs.forEach((input, i) => {
        input.value = "";
        input.placeholder = "Giocatore " + (i + 1);
    });

    alert("Nomi cancellati!");
}