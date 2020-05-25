class StringField extends HTMLElement {

  fieldDescriptor;
  fieldValue;

  set myField(value) {
    this.fieldDescriptor = value;
    this.render();
  }

  set myValue(value) {
    this.fieldValue = value;
    this.render();
  }

  connectedCallback () {
    this.render();
  }

  render () {

    if (!this.fieldDescriptor || !this.fieldValue) return;

    const name = this.fieldDescriptor.name;
    const label = this.fieldDescriptor.label;
    const visible = this.getAttribute('visible') || true;
    const editable = this.getAttribute('editable') || true;

    this.innerHTML = `
      <div class="form-group ${ visible ? 'row' : 'd-none' }">
        <label htmlFor="${name}" class="${label ? 'col-md-2 col-form-label' : 'd-none'}">${label}</label>
        <div class="${label ? 'col-md-10' : 'col-md-12' }">
          <div class="input-group">
            <input id="${name}" disabled="${!editable}" type="text" class="form-control" 
              aria-describedBy="${name}-type" value="${this.fieldValue.value}"/>
            <div class="input-group-append">
              <span class="input-group-text" title="${name}" id="${name}-type>">ST</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('string-field', StringField);