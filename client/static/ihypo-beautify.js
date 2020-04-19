class IHypoBeautify extends HTMLElement {

  connectedCallback () {

    this.innerHTML = `<form>
      <div class="form-row">
        <div class="form-group col-md-12">
          <label for="description">Let's start with the name</label>
          <div class="input-group">
            <input id="description" type="text" class="form-control" placeholder="František Novák, dům u lesa" value="František Novák, dům u lesa">
          </div>
        </div>
      </div>
      <div class="mt-4 float-right">
        <button id="cancelButton" type="cancel" class="btn btn-secondary ml-2">Cancel</button>
        <button id="submitButton" type="submit" class="btn btn-primary ml-2">Beautify!</button>
      </div>
    </form>`;
    
    const cancelButton = document.getElementById('cancelButton');
    cancelButton.onclick = (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("cancel"));
    }; 

    const submitButton = document.getElementById('submitButton');
    submitButton.onclick = (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("submit"));
    }; 
  }
}

//register the new custom element
customElements.define('ihypo-beautify', IHypoBeautify)
