class XHypoOverview extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Premium mortgage, 74.8M CZK, 2 years'
  }
}

//register the new custom element
customElements.define('xhypo-overview', XHypoOverview)
