class IHypoOverview extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Mortgage, 2.1M CZK, 15 years, 2 applicants'
  }
}

//register the new custom element
customElements.define('ihypo-overview', IHypoOverview)
