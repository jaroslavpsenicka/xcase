const expect  = require('chai').expect;
const request = require('request');

describe('Case', () => {

  var caseObject;

  it('find test product', done => {
    request.get('http://localhost:8080/api/products/IHYPO' , (error, response) => {
      if (response.statusCode != 200) console.log(response.body);
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('query cases', (done) => {
    request.get('http://localhost:8080/api/cases' , (error, response) => {
      if (response.statusCode != 200) console.log(response.body);
      expect(response.statusCode).to.equal(200);
      const json = JSON.parse(response.body);
      expect(json.length).to.greaterThan(0);
      done();
    });
  });

  it('create case, empty', (done) => {
    request.post('http://localhost:8080/api/cases', (error, response, body) => {
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(body).error).to.equal('illegal request');
      done();
    });
  });

  it('create case, missing product', (done) => {
    const contents = { name: 'XXX' };
    request.post({
      uri: 'http://localhost:8080/api/cases', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(contents)
    }, (error, response, body) => {
      if (response.statusCode != 400) console.log(response.body);
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(body).error).to.equal('illegal request');
      done();
    });
  });

  it('create case, illlegal product', (done) => {
    const contents = { product: 'XXX' };
    request.post({
      uri: 'http://localhost:8080/api/cases', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(contents)
    }, (error, response, body) => {
      if (response.statusCode != 404) console.log(response.body);
      expect(response.statusCode).to.equal(404);
      expect(JSON.parse(body).error).to.equal('product XXX is not registered');
      done();
    });
  });

  it('create case, valid request', (done) => {
    const contents = { product: 'IHYPO', loanAmount: 1000000 };
    request.post({
      uri: 'http://localhost:8080/api/cases', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(contents)
    }, (error, response, body) => {
      if (response.statusCode != 201) console.log(response.body);
      expect(response.statusCode).to.equal(201);
      caseObject = JSON.parse(body);
      expect(caseObject.starred).to.equal(false);
      expect(caseObject.revision).to.equal(1);
      expect(caseObject.createdAt).to.not.null;
      expect(caseObject.data.product).to.be.undefined;
      expect(caseObject.data.loanAmount).to.equal(1000000);
      done();
    });
  });

});
