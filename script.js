// ==================== CONSTANTES ====================
const AZERTY = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "⌫"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["M", "W", "X", "C", "V", "B", "N"],
];

const QWERTY = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "⌫"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

// ==================== UTILITAIRES ====================
const randomLetter = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const isValidLetter = (letter) => /^[A-Z]$/.test(letter);

function getLastUsedLetterBox(attemptLine) {
  const boxes = attemptLine.querySelectorAll(".lettre");
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (boxes[i].dataset.unused === "false") return boxes[i];
  }
  return null;
}

function getCurrentLetterBox(attemptLine) {
  return attemptLine.querySelector(".lettre[data-unused='true']");
}

function getCurrentAttemptLine(container) {
  return container.querySelector(".tentative[data-unused='true']");
}

function getWordFromAttempt(attemptLine) {
  let word = "";
  attemptLine.querySelectorAll(".lettre").forEach((box) => {
    word += box.textContent;
  });
  return word;
}

// ==================== LOGIQUE WORD ====================
function checkWord(attempt, word) {
  if (!word || attempt.length !== word.length) {
    throw new Error("Longueur invalide ou mot manquant");
  }

  const result = Array(attempt.length).fill("absent");
  const letterCount = {};

  for (let letter of word) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < attempt.length; i++) {
    if (attempt[i] === word[i]) {
      result[i] = "correct";
      letterCount[attempt[i]]--;
    }
  }

  for (let i = 0; i < attempt.length; i++) {
    if (result[i] === "correct") continue;

    if (letterCount[attempt[i]] > 0) {
      result[i] = "present";
      letterCount[attempt[i]]--;
    }
  }

  return result;
}

function customAlert(message, type = "error", time=3) {
  const alertContainer = document.getElementById("alert");
  alertContainer.textContent = message;
  alertContainer.style.display = "block";
  alertContainer.classList.remove("success", "error");
  alertContainer.classList.add(type);
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, time * 1000);
}

// ==================== API ====================
function checkIfWordExists(word) {
  return fetch(`check.php?mot=${word}`)
    .then((res) => res.json())
    .then((data) => data.exists)
    .catch(() => false);
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    startBtn: document.getElementById("start-button"),
    letterInput: document.getElementById("letter"),
    sizeInput: document.getElementById("taille"),
    attemptsInput: document.getElementById("tentatives"),
    keyboardSelect: document.getElementById("clavier-select"),
    keyboardContainer: document.getElementById("clavier"),
    attemptsContainer: document.getElementById("tentative-container"),
    validateButton: document.getElementById("valid-button"),
    nbTentative: 0,
  };

  updateKeyboard(elements);

  elements.keyboardSelect.addEventListener("change", () => {
    updateKeyboard(elements);
  });

  elements.startBtn.addEventListener("click", () => {
    startGame(getGameConfig(elements), elements);
    updateKeyboard(elements);
  });

  const config = getGameConfig(elements);
  startGame(config, elements);

  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    if (key.textContent === "⌫") {
      key.addEventListener("click", () => {
        let line = getCurrentAttemptLine(elements.attemptsContainer);
        if (!line) return;

        let box = getLastUsedLetterBox(line);
        if (box) {
          box.textContent = "";
          box.dataset.unused = "true";
        }
      });
    } else {
      key.addEventListener("click", () => {
        let line = getCurrentAttemptLine(elements.attemptsContainer);
        if (!line) return;

        let box = getCurrentLetterBox(line);
        if (box) {
          box.textContent = key.textContent.toUpperCase();
          box.dataset.unused = "false";
        }
      });
    }
  });

  // clavier physique
  document.addEventListener("keydown", (e) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      let line = getCurrentAttemptLine(elements.attemptsContainer);
      if (!line) return;

      let box = getCurrentLetterBox(line);
      if (box) {
        box.textContent = e.key.toUpperCase();
        box.dataset.unused = "false";
      }
    }

    if (e.key === "Backspace") {
      let line = getCurrentAttemptLine(elements.attemptsContainer);
      if (!line) return;

      let box = getLastUsedLetterBox(line);
      if (box) {
        box.textContent = "";
        box.dataset.unused = "true";
      }
    }

    if (e.key === "Enter") {
      elements.validateButton.click();
    }
  });

  // ==================== VALIDATION ====================
  elements.validateButton.addEventListener("click", async () => {
    const line = getCurrentAttemptLine(elements.attemptsContainer);

    if (!line) return;

    // Vérifie le nombre de tentatives
    if (elements.nbTentative >= elements.attemptsInput) {
      customAlert(`Le mot était : ${elements.word}`, "error");
      return;
    }

    // Vérifie si toutes les lettres sont remplies
    for (const box of line.querySelectorAll(".lettre")) {
      if (box.dataset.unused === "true") {
        customAlert("Remplis toutes les lettres");
        return;
      }
    }

    // Récupération du mot tenté
    const attemptedWord = getWordFromAttempt(line).toLowerCase();

    // Vérifie si le mot existe
    const exists = await checkIfWordExists(attemptedWord);

    if (!exists) {
      customAlert("Mot invalide");
      return;
    }

    // Vérifie les lettres
    const result = checkWord(attemptedWord, elements.word.toLowerCase());

    line.dataset.unused = "false";

    const boxes = line.querySelectorAll(".lettre");

    boxes.forEach((box, i) => {
      // Nettoyage des anciennes classes
      box.classList.remove("absent", "present", "correct");

      // Ajout du résultat
      box.classList.add(result[i]);

      // Mise à jour du clavier
      const key = box.textContent.toUpperCase();
      const keyEl = document.getElementById(`key-${key}`);

      if (keyEl) {
        // Évite d'écraser une touche déjà correcte
        if (keyEl.classList.contains("correct")) return;

        // Évite d'écraser "present" par "absent"
        if (keyEl.classList.contains("present") && result[i] === "absent")
          return;

        keyEl.classList.remove("absent", "present", "correct");
        keyEl.classList.add(result[i]);
      }
    });

    elements.nbTentative++;

    // Victoire
    if (result.every((r) => r === "correct")) {
      customAlert("Félicitations !", "success");

      elements.nbTentative = 0;

      return;
    }

    // Défaite
    if (elements.nbTentative >= elements.attemptsInput.value) {
      customAlert(`Perdu ! Le mot était : ${elements.word}`, "error", 10);
    }
  });
});

// ==================== CONFIG ====================
function getGameConfig(el) {
  return {
    letter: el.letterInput.value.toUpperCase().trim(),
    size: parseInt(el.sizeInput.value),
    attempts: parseInt(el.attemptsInput.value),
    keyboard: el.keyboardSelect.value,
  };
}

// ==================== CLAVIER ====================
function updateKeyboard(el) {
  const layout = el.keyboardSelect.value === "azerty" ? AZERTY : QWERTY;
  renderKeyboard(layout, el.keyboardContainer);
}

function renderKeyboard(layout, container) {
  container.innerHTML = "";

  layout.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("horizontal-container");

    row.forEach((key) => {
      const keyDiv = document.createElement("div");
      keyDiv.classList.add("key");
      keyDiv.textContent = key;
      keyDiv.id = `key-${key}`;
      rowDiv.appendChild(keyDiv);
    });

    container.appendChild(rowDiv);
  });
}

// ==================== BOARD ====================
function createLetterBox(letter = "") {
  const box = document.createElement("div");
  box.classList.add("lettre");

  box.textContent = letter;

  box.dataset.unused = letter === "" ? "true" : "false";

  return box;
}

function createLine(size, firstLetter) {
  const line = document.createElement("div");
  line.classList.add("tentative");
  line.dataset.unused = "true";

  for (let i = 0; i < size; i++) {
    line.appendChild(createLetterBox(i === 0 ? firstLetter : ""));
  }

  return line;
}

function renderGameBoard(letter, size, attempts, container) {
  container.innerHTML = "";

  for (let i = 0; i < attempts; i++) {
    container.appendChild(createLine(size, letter));
  }
}

// ==================== GAME ====================
async function generateWord(letter, size) {
  try {
    letter = letter.toLowerCase();
    size = String(size);

    const res = await fetch(`get_mot.php?lettre=${letter}&taille=${size}`);
    const text = await res.text();

    if (!text) return null;

    const data = JSON.parse(text);
    return data.word ? data.word.toUpperCase() : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function startGame(config, el) {
  let { letter, size, attempts } = config;

  if (!isValidLetter(letter)) {
    letter = randomLetter();
  }

  renderGameBoard(letter, size, attempts, el.attemptsContainer);

  const word = await generateWord(letter, size);
  el.word = word;
}
