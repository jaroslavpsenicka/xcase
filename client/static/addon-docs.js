class DocsAddon extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'This addon shows links to important documents.';
  }
}

customElements.define('docs-addon', DocsAddon)
