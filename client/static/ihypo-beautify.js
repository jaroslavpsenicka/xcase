class IHypoBeautify extends HTMLElement {
  connectedCallback () {
    this.innerHTML = `Do you want to update the case to be more elegant, sexy and demanding?`;
  }
}

//register the new custom element
customElements.define('ihypo-beautify', IHypoBeautify)
