class XHypoCustom extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Hic sunt leones.';
  }
}

customElements.define('xhypo-custom', XHypoCustom)
