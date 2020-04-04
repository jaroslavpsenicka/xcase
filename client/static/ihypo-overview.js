class IHypoOverview extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Hello, this is ihypo overview!'
  }
}

//register the new custom element
customElements.define('ihypo-overview', IHypoOverview)
