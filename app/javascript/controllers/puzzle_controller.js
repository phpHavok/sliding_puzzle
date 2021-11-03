import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="puzzle"
export default class extends Controller {
  static targets = ["tile"];
  static values = {
    state: Array,
    spacer: Number,
    rows: Number,
    cols: Number,
    szpx: Number,
  };

  connect() {
    this.refresh();
  }

  refresh() {
    let spacerIdx = this.stateValue.indexOf(this.spacerValue);
    this.tileTargets.forEach((tile, tileIdx) => {
      let tilePosition = this.stateValue.indexOf(tileIdx + 1);
      let row = Math.floor(tilePosition / this.colsValue);
      let col = tilePosition % this.colsValue;
      tile.style.top = row * this.szpxValue + "px";
      tile.style.left = col * this.szpxValue + "px";
      tile.classList.toggle("moveable", this.adjacent(tilePosition, spacerIdx));
    });
  }

  move(event) {
    let clickedIdx = this.stateValue.indexOf(
      parseInt(event.target.textContent)
    );
    let spacerIdx = this.stateValue.indexOf(this.spacerValue);
    if (this.adjacent(clickedIdx, spacerIdx)) {
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
}
