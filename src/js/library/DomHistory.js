
class DomHistory {

  constructor(...args) {
    this._history = [];
  }

  get history() {
    return this._history.pop();
  }

  set history(h) {
    this._history.push(h);
  }

}

export default DomHistory;