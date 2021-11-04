import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="puzzle"
export default class extends Controller {
  static targets = ["tile", "console", "pid"];
  static values = {
    state: Array,
    goal: Array,
    spacer: Number,
    rows: Number,
    cols: Number,
  };

  connect() {
    this.refresh();
    this.moveCount = 0;
    this.log("Welcome to the Sliding Puzzle!");
  }

  log(message) {
    let p = document.createElement("p");
    p.textContent = message;
    this.consoleTarget.appendChild(p);
    this.consoleTarget.scrollTop = this.consoleTarget.scrollHeight;
  }

  refresh() {
    let spacerIdx = this.stateValue.indexOf(this.spacerValue);
    this.tileTargets.forEach((tile, tileIdx) => {
      let tilePosition = this.stateValue.indexOf(tileIdx + 1);
      let row = Math.floor(tilePosition / this.colsValue);
      let col = tilePosition % this.colsValue;
      tile.style.top = row * ((1 / this.rowsValue) * 100) + "%";
      tile.style.left = col * ((1 / this.colsValue) * 100) + "%";
      tile.classList.toggle("moveable", this.adjacent(tilePosition, spacerIdx));
    });
  }

  move(event) {
    let clickedIdx = this.stateValue.indexOf(
      parseInt(event.target.textContent)
    );
    let spacerIdx = this.stateValue.indexOf(this.spacerValue);
    if (this.adjacent(clickedIdx, spacerIdx)) {
      this.log(`Move #${++this.moveCount}: ${event.target.textContent}`);
      this.swap(clickedIdx, spacerIdx);
    }
  }

  stateValueChanged() {
    this.refresh();
  }

  adjacent(idxA, idxB) {
    let rowA = Math.floor(idxA / this.colsValue);
    let colA = idxA % this.colsValue;
    let rowB = Math.floor(idxB / this.colsValue);
    let colB = idxB % this.colsValue;
    let distance = Math.abs(rowA - rowB) + Math.abs(colA - colB);
    return distance == 1;
  }

  swap(idxA, idxB) {
    let newState = Array.from(this.stateValue);
    newState[idxA] = this.stateValue[idxB];
    newState[idxB] = this.stateValue[idxA];
    this.stateValue = newState;
  }

  load() {
    let newState = new Array();
    [...this.pidTarget.value].forEach((c) => {
      newState.push(parseInt(c));
    });
    let sortedState = Array.from(newState).sort();
    if (JSON.stringify(sortedState) != JSON.stringify(this.goalValue)) {
      this.log("Tried to load invalid puzzle.");
      return;
    }
    this.log(`Loaded puzzle: ${this.pidTarget.value}`);
    this.stateValue = newState;
    this.moveCount = 0;
  }

  random() {
    let newState = Array.from(this.goalValue);
    for (let i = 0; i < 1000; i++) {
      let moves = this.possible_moves(newState);
      let randomMove = Math.floor(Math.random() * moves.length);
      newState[newState.indexOf(this.spacerValue)] =
        newState[moves[randomMove]];
      newState[moves[randomMove]] = this.spacerValue;
    }
    this.log("Loaded random puzzle.");
    this.moveCount = 0;
    this.stateValue = newState;
  }

  possible_moves(arr) {
    let spacerIdx = arr.indexOf(this.spacerValue);
    let spacerRows = Math.floor(spacerIdx / this.colsValue);
    let spacerCols = spacerIdx % this.colsValue;
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
      .map((coords) => {
        return [coords[0] + spacerRows, coords[1] + spacerCols];
      })
      .filter((coords) => {
        return (
          coords[0] >= 0 &&
          coords[0] < this.rowsValue &&
          coords[1] >= 0 &&
          coords[1] < this.colsValue
        );
      })
      .map((coords) => {
        return coords[0] * this.rowsValue + coords[1];
      });
  }

  hint() {
    this.log("Hint");
  }

  solve() {
    this.log("Solve");
  }
}
