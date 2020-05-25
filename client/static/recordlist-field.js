class RecordListField extends HTMLElement {
  connectedCallback () {
    const name = this.getAttribute('name');
    const label = this.getAttribute('label');
    const value = this.getAttribute('value') || '';
    const visible = this.getAttribute('visible') || true;
    const editable = this.getAttribute('editable') || true;

    this.innerHTML = `
      <div class="form-group ${ visible ? 'row' : 'd-none' }">
        <label htmlFor="${name}" class="${label ? 'col-md-2 col-form-label' : 'd-none'}">${label}</label>
        <div class="${label ? 'col-md-10' : 'col-md-12' }">
          <div class="input-group">
            <input id="${name}" disabled="${!editable}" type="text" class="form-control" 
              aria-describedBy="${name}-type" value="${value}"/>
            <div class="input-group-append">
              <span class="input-group-text" title="${name}" id="${name}-type>">RL</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('recordlist-field', RecordListField);