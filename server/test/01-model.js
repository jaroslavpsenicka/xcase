const request = require('request');
const expect  = require('chai').expect;
const validProduct = require('./product');

const file = (value) => {
  return {
    url: 'http://localhost:8080/api/products', 
    formData: {
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

describe('Product', () => {

  var product;

  it('query products', (done) => {
    request.get('http://localhost:8080/api/products' , (error, response) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('upload product, empty', (done) => {
    request.post(file({}), (error, response, body) => {
      expect(JSON.parse(body).error).to.equal("should have required property \'name\'");
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('upload product, only name', (done) => {
    const contents = { name: "name" };
    request.post(file(contents), (error, response, body) => {
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(body).error).to.equal("should have required property \'overviewComponentUrl\'");
      done();
    });
  });

  it('upload valid product', (done) => {
    request.post(file(validProduct), (error, response, body) => {
      if (response.statusCode != 201) console.log(body);
      expect(response.statusCode).to.equal(201);
      product = JSON.parse(body);
      expect(product).to.not.be.null;
      done();
    });
  });

  it('get the product', (done) => {
    request.get('http://localhost:8080/api/products/HYPO', (error, response, body) => {
      if (response.statusCode != 200) console.log(body);
      expect(response.statusCode).to.equal(200);
      product = JSON.parse(body);
      expect(product).to.not.be.null;
      done();
    });
  });

  it('get unknown product', (done) => {
    request.get('http://localhost:8080/api/products/XXX', (error, response, body) => {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('delete it finally', (done) => {
    request.delete('http://localhost:8080/api/products/HYPO', (error, response, body) => {
      if (response.statusCode != 204) console.log(body);
      expect(response.statusCode).to.equal(204);
      done();
    });
  });

  it('delete unknown', (done) => {
    request.delete('http://localhost:8080/api/products/XXX', (error, response, body) => {
      if (response.statusCode != 204) console.log(body);
      expect(response.statusCode).to.equal(204);
      done();
    });
  });

});