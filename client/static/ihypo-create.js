class IHypoCreate extends HTMLElement {

  connectedCallback () {

    this.innerHTML = `<form>
      <div class="form-row">
        <div class="form-group col-md-12">
          <label for="description">Case description</label>
          <div class="input-group">
            <input id="description" type="text" class="form-control" placeholder="František Novák, dům u lesa" value="František Novák, dům u lesa">
          </div>
        </div>
      </div>  
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="propertyPrice">Property price</label>
          <div class="input-group">
            <input id="propertyPrice" type="number" class="form-control" placeholder="2500000" value="2500000" aria-label="2500000" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">CZK</span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-4">
          <label for="savedAmount">Saved amount</label>
          <div class="input-group">
            <input id="savedAmount" type="number" class="form-control" placeholder="500000" value="500000" aria-label="500000" aria-describedby="basic-addon3">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon3">CZK</span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-4">
          <label for="inputAddress">Maturity</label>
          <div class="input-group">
            <select class="custom-select" id="inputGroupSelect02">
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15" selected>15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
            </select>
            <div class="input-group-append">
              <label class="input-group-text" for="inputGroupSelect02">years</label>
            </div>
          </div>
        </div>
      </div>
      <h4 class="mt-3 mb-2">About you</h4>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="name">Name</label>
          <div class="input-group">
            <input id="name" type="text" class="form-control" placeholder="František Novák" value="František Novák">
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="email">Email</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon6">@</span>
            </div>
            <input id="email" type="email" class="form-control" placeholder="franta@gmail.com" value="franta@gmail.com">
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="monthlyIncome">Monthly income</label>
          <div class="input-group">
            <input id="monthlyIncome" type="number" class="form-control" placeholder="50000" value="50000" aria-label="5000" aria-describedby="basic-addon5">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon5">CZK</span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-4">
          <label for="monthlyExpenses">Monthly expenses</label>
          <div class="input-group">
            <input id="monthlyExpenses" type="number" class="form-control" placeholder="10000" value="10000" aria-label="10000" aria-describedby="basic-addon6">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon6">CZK</span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-4">
          <label for="savedAmount">Age</label>
          <div class="input-group">
            <input id="savedAmount" type="number" class="form-control" placeholder="30" value="30" aria-label="30" aria-describedby="basic-addon4">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon4">years</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <button id="submitButton" type="submit" class="btn btn-primary float-right">Begin Approval</button>
      </div>
    </form>`;
    
    const uuid = () => {
      var dt = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
      });
    }

    const submitButton = document.getElementById('submitButton');
    submitButton.onclick = (event) => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("submit", { detail: uuid() }));
    } 
  }


}

//register the new custom element
customElements.define('ihypo-create', IHypoCreate)
