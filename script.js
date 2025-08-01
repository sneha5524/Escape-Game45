const clues = {
  // Room 1
  bed: { question: "What do you sleep on?", answer: "bed" },
  nightstand: { question: "What do you keep beside your bed at night?", answer: "nightstand" },
  wardrobe: { question: "What do you store clothes in?", answer: "wardrobe" },
  mirror: { question: "What object reflects your image?", answer: "mirror" },
  plant: { question: "What is green and grows in a pot?", answer: "plant" },
  // Room 2
  desk: { question: "What do you work at?", answer: "desk" },
  bookshelf: { question: "What holds many books?", answer: "bookshelf" },
  chair: { question: "What do you sit on while working?", answer: "chair" },
  lamp: { question: "What gives you light to read at night?", answer: "lamp" },
  globe: { question: "Which object shows the world map?", answer: "globe" }
};

let score = 0;
let currentRoom = 1;
let answeredCount = 0;
let retry = false;
let timer = null;
let seconds = 0;


function $(id) {
  return document.getElementById(id);
}


function startGame() {
  hideAllScreens();
  $("room-1").classList.add("active");
  currentRoom = 1;
  score = 0;
  answeredCount = 0;
  retry = false;
  updateStats();
  resetRoomProgress(1);
  resetRoomProgress(2);
  setupClueClicks();
}

function hideAllScreens() {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
}


function updateStats() {
  $("score").textContent = score;
  $("current-room").textContent = currentRoom;
  $("questions-answered").textContent = answeredCount;
}


function resetRoomProgress(roomNum) {
  $(`room-${roomNum}-count`).textContent = `0/5 clues found`;
  $(`room-${roomNum}-progress`).style.width = "0%";
  document.querySelectorAll(`#room-${roomNum} .room-object`).forEach(el => {
    el.classList.remove("found");
    el.onclick = null;
  });
  if (roomNum === 1) $("to-room-2").disabled = true;
}


function setupClueClicks() {
  document.querySelectorAll(`#room-${currentRoom} .room-object:not(.found)`).forEach(obj => {
    obj.onclick = () => showModal(obj.getAttribute("data-clue"));
  });
}


function showModal(clueKey) {
  const clue = clues[clueKey];
  $("modal-title").textContent = "Question Found!";
  $("question-text").textContent = clue.question;
  $("retry-indicator").classList.add("hidden");
  $("answer-options").innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type your answer";
  input.className = "answer-input";
  input.onkeydown = (e) => {
    if (e.key === "Enter") submit.click();
  };

  const submit = document.createElement("button");
  submit.textContent = "Submit";
  submit.className = "submit-btn";
  submit.onclick = () => checkAnswer(input.value.trim().toLowerCase(), clue.answer, clueKey);

  $("answer-options").appendChild(input);
  $("answer-options").appendChild(submit);

  $("question-modal").classList.add("active");
  setTimeout(() => input.focus(), 100);

  startTimer();
}

function startTimer() {
  stopTimer();
  seconds = 10;
  $("timer-text").textContent = seconds;
  timer = setInterval(() => {
    seconds--;
    $("timer-text").textContent = seconds;
    if (seconds <= 0) {
      stopTimer();
      if (!retry) {
        retry = true;
        $("retry-indicator").classList.remove("hidden");
        startTimer();
      } else {
        closeModal();
        alert("Time is up! Try the next clue.");
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}


function checkAnswer(userAns, correctAns, clueKey) {
  stopTimer();
  if (userAns === correctAns) {
    score++;
    answeredCount++;
    markClueFound(clueKey);
    updateStats();
    closeModal();
    checkRoomProgress();
  } else if (!retry) {
    retry = true;
    alert("This answer is wrong, try again!");
    $("retry-indicator").classList.remove("hidden");
    startTimer();
  } else {
    closeModal();
    alert("The answer is wrong again, find the next clue!");
  }
}


function markClueFound(clueKey) {
  const el = document.querySelector(`#room-${currentRoom} .room-object[data-clue="${clueKey}"]`);
  if (el) {
    el.classList.add("found");
    el.onclick = null;
  }
  const foundCount = document.querySelectorAll(`#room-${currentRoom} .room-object.found`).length;
  $(`room-${currentRoom}-count`).textContent = `${foundCount}/5 clues found`;
  $(`room-${currentRoom}-progress`).style.width = `${foundCount * 20}%`;
}


function checkRoomProgress() {
  const found = document.querySelectorAll(`#room-${currentRoom} .room-object.found`).length;
  if (found === 5) {
    if (currentRoom === 1) {
      $("to-room-2").disabled = false;
    } else {
      endGame(true);
    }
  }
}


function closeModal() {
  retry = false;
  $("question-modal").classList.remove("active");
}


function endGame(won) {
  stopTimer();
  hideAllScreens();
  $("game-over-screen").classList.add("active");
  $("game-result").innerHTML = won
    ? `<h2>🎉 You Escaped!</h2><p>Your Score: ${score}/10</p>`
    : `<h2>💀 Game Over!</h2><p>Try Again!</p>`;
}


window.onload = function () {
  hideAllScreens();
  $("welcome-screen").classList.add("active");

  $("start-game").onclick = startGame;

  $("to-room-2").onclick = () => {
    $("room-1").classList.remove("active");
    $("room-2").classList.add("active");
    currentRoom = 2;
    updateStats();
    setupClueClicks();
  };

  $("back-to-room-1").onclick = () => {
    $("room-2").classList.remove("active");
    $("room-1").classList.add("active");
    currentRoom = 1;
    updateStats();
    setupClueClicks();
  };

  $("restart-game").onclick = () => window.location.reload();
};
