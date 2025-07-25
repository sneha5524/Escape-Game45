const clues = {
  bed: { question: "What do you sleep on?", answer: "bed" },
  nightstand: { question: "What do you keep beside your bed at night?", answer: "nightstand" },
  wardrobe: { question: "What do you store clothes in?", answer: "wardrobe" },
  mirror: { question: "What object reflects your image?", answer: "mirror" },
  plant: { question: "What is green and grows in a pot?", answer: "plant" },
  desk: { question: "What do you work at?", answer: "desk" },
  bookshelf: { question: "What holds many books?", answer: "bookshelf" },
  chair: { question: "What do you sit on while working?", answer: "chair" },
  lamp: { question: "What gives you light to read at night?", answer: "lamp" },
  globe: { question: "Which object shows the world map?", answer: "globe" }
};

let score = 0;
let answered = 0;
let currentRoom = 1;

function get(check) {
  return document.getElementById(check);
}

function showScreen(check) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  get(check).classList.add("active");
}

function updateStats() {
  get("score").textContent = score;
  get("current-room").textContent = currentRoom;
  get("questions-answered").textContent = answered;
}

function startGame() {
  score = 0;
  answered = 0;
  currentRoom = 1;
  showScreen("room-1");
  updateStats();
  enableClick("room-1");
  get("to-room-2").disabled = false;
}

function enableClick(roomId) {
  document.querySelectorAll(`#${roomId} .room-object`).forEach(el => {
    if (!el.classList.contains("found")) {
      el.onclick = () => askQuestion(el);
    }
  });
}

function askQuestion(el) {
  const clueKey = el.dataset.clue;
  const clue = clues[clueKey];

  let answer = prompt(clue.question)?.toLowerCase().trim();

  if (answer === clue.answer) {
    correct(el);
  } else {
    answer = prompt("❌ Wrong! Try once more:")?.toLowerCase().trim();
    if (answer === clue.answer) {
      correct(el);
    } else {
      wrong(el);
    }
  }

  updateStats();
  if (answered === 10) showResult();
}

function correct(el) {
  el.classList.add("found");
  el.onclick = null;
  score++;
  answered++;
  alert("✅ Correct!");
}

function wrong(el) {
  el.classList.add("found");
  el.onclick = null;
  answered++;
  alert("❌ Wrong again!");
}

function showResult() {
  showScreen("game-over-screen");
  get("game-result").innerHTML =
    score >= 7
      ? `<h2>🎉 You Escaped!</h2><p>Your Score: ${score}/10</p>`
      : `<h2>💀 Game Over!</h2><p>Your Score: ${score}/10<br>Try Again!</p>`;
}

window.onload = () => {
  get("start-game").onclick = startGame;

  get("to-room-2").onclick = () => {
    showScreen("room-2");
    currentRoom = 2;
    updateStats();
    enableClick("room-2");
  };

  get("back-to-room-1").onclick = () => {
    showScreen("room-1");
    currentRoom = 1;
    updateStats();
    enableClick("room-1");
  };

  get("restart-game").onclick = () => location.reload();
};
