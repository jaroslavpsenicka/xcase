const request = require('request');
const expect  = require('chai').expect;
const validProduct = require('./product');

const file = (value) => {
  return {
    url: 'http://localhost:8080/api/products', 
    formData: {
      baseUrl: "http://localhost:8080", 
      file: {
        value: JSON.stringify(value),
        options: {
          filename: 'file.json',
          contentType: 'application/json'
        }
      }
    }
  }
}

describe('Actions', () => {

  var product;

  it('query products', (done) => {
    request.get('http://localhost:8080/api/products' , (error, response) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('upload product, missing name', (done) => {
    const invalidProduct = JSON.parse(JSON.stringify(validProduct));
    invalidProduct.actions = [{ label: "", componentUrl: "/api/cases" }];
    request.post(file(invalidProduct), (error, response, body) => {
      expect(response.statusCode).to.equal(400);
      product = JSON.parse(body);
      expect(JSON.parse(body).error).to.equal('actions[0]: should have required property \'name\'');
      done();
    });
  });

});