const tasks = [
  "Train started moving",
  "Saw someone read a book",
  "Heard a train announcement",
  "Looked out the window",
  "Saw another train",
  "Used your phone",
  "Someone yawned",
  "Conductor walked by",
  "Passed through a tunnel",
  "Saw trees or mountains",
  "Ticket got checked",
  "You smiled at someone",
  "You’re here! ✅",
  "Saw a child on the train",
  "Train slowed down",
  "Took a picture",
  "Used headphones",
  "Bought a snack",
  "Looked at the time",
  "Someone sneezed",
  "Train whistle blew",
  "Luggage on the rack",
  "Got a window seat",
  "Heard someone laugh",
  "Waved at someone outside",
];

const board = document.getElementById("bingoBoard");
const reward = document.getElementById("reward");
let grid = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkBingoWin() {
  const size = 5;
  for (let r = 0; r < size; r++) {
    if (grid[r].every((cell) => cell.classList.contains("marked"))) return true;
  }
  for (let c = 0; c < size; c++) {
    if (
      grid
        .map((row) => row[c])
        .every((cell) => cell.classList.contains("marked"))
    )
      return true;
  }
  if (
    grid
      .map((row, i) => row[i])
      .every((cell) => cell.classList.contains("marked"))
  )
    return true;
  if (
    grid
      .map((row, i) => row[size - 1 - i])
      .every((cell) => cell.classList.contains("marked"))
  )
    return true;
  return false;
}

function loadProgress() {
  const markedIndexes = JSON.parse(
    sessionStorage.getItem("bingoMarked") || "[]"
  );
  markedIndexes.forEach((idx) => {
    if (grid.flat()[idx]) {
      grid.flat()[idx].classList.add("marked");
    }
  });
  if (checkBingoWin()) showAlert("🎉 BINGO! You unlocked a digital badge! 🎖️", "green");
}

function generateBoard() {
  const shuffled = shuffle([...tasks]);
  board.innerHTML = "";
  grid = [];

  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      const index = i * 5 + j;
      cell.className = "bingo-cell locked";
      cell.textContent = shuffled[index];
      board.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }

  grid.forEach((row, i) => {
    setTimeout(() => {
      row.forEach((cell) => cell.classList.remove("locked"));
    }, i * 15000);
  });

  setTimeout(() => {
    const startCell = grid
      .flat()
      .find((c) => c.textContent === "Train started moving");
    if (startCell) {
      startCell.classList.remove("locked");
      startCell.classList.add("marked");
      saveProgress();
      if (checkBingoWin()) showAlert("🎉 BINGO! You unlocked a digital badge! 🎖️", "green");
    }
  }, 10000);

  grid.flat().forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!cell.classList.contains("locked")) {
        cell.classList.toggle("marked");
        saveProgress();
        if (checkBingoWin()) showAlert("🎉 BINGO! You unlocked a digital badge! 🎖️", "green");
      }
    });
  });

  setTimeout(() => loadProgress(), 100); 
}

generateBoard();

function showAlert(message, color) {
  const alertDiv = document.getElementById("alertDiv");
  alertDiv.innerHTML = message;
  alertDiv.style.backgroundColor = color;
  alertDiv.style.bottom = "30px";
  alertDiv.style.opacity = "1";

  setTimeout(() => {
    alertDiv.style.bottom = "-100px";
    alertDiv.style.opacity = "0";
  }, 2000);
}
