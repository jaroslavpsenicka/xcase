class CalcAddon extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'This addon contains calculators of all kinds.';
  }
}

customElements.define('calc-addon', CalcAddon)
