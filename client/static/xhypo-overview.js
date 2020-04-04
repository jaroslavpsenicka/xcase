class XHypoOverview extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Premium services for the super-rich!'
  }
}

//register the new custom element
customElements.define('xhypo-overview', XHypoOverview)
