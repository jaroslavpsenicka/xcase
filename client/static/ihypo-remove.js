class RemoveDialog extends HTMLElement {
  connectedCallback () {
    this.innerHTML = `      
      <div>
        <div class="modal-header">
          <h5 class="modal-title">Remove the case</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Do you want to remove the case? You may miss it later.</p>
        </div>
        <div class="modal-footer">
          <button id="cancelButton" type="button" class="btn btn-secondary" data-dismiss="modal">Not yet</button>
          <button id="performButton" type="button" class="btn btn-primary">Yes please</button>
        </div>
      </div>`;

    const cancelButton = document.getElementById('cancelButton');
    cancelButton.onclick = (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("cancel"));
    } 

    const performButton = document.getElementById('performButton');
    performButton.onclick = (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("perform"));
    } 
  }
}

//register the new custom element
customElements.define('ihypo-remove', RemoveDialog)
