class IHypoOverview extends HTMLElement {
  connectedCallback () {
    const amount = this.getAttribute('loanamount');
    const amountFmt = amount < 1000000 ? amount/1000 + 'K' : amount/1000000 + 'M';
    this.innerHTML = `Mortgage, ${amountFmt} CZK, 15 years, 2 applicants`;
  }
}

//register the new custom element
customElements.define('ihypo-overview', IHypoOverview)
