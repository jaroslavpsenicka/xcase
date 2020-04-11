const Hashids = require('hashids/cjs');
const ObjectId = require('mongoose').Types.ObjectId; 
const Product = require('./model/product');
const Case = require('./model/case');
const Ajv = require('ajv');
const swagger = require('express-swagger-generator');
const config = require('./config');
const log4js = require('log4js');
const multer = require('multer');
const fs = require('fs');

const { ProductDescriptorValidationError } = require('./errors');

const hash = new Hashids();
const logger = log4js.getLogger('routes');
const disk = multer.diskStorage({
	destination: function (req, file, cb) { cb(null, '/tmp')},
  filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now())}
});
const upload = multer({ storage: disk });

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });
const commonSchema = require('./model/common.schema.json');
const productSchema = require('./model/product.schema.json');

ajv.addSchema(commonSchema, 'common');
ajv.addSchema(productSchema, 'product');

const mortgage1 = new ObjectId('000000000001');	
Product.deleteMany({}, (err) => {	
	if (err) throw err;
	Product.create({ _id: mortgage1, 
		id: hash.encodeHex(mortgage1.toHexString()),  
		name: 'ihypo', 
		revision: 1, 
		starred: true, 
		createdBy: 'Mary Doe',
		spec: {
			name: 'ihypo', 
			label: 'Mortgage',
			description: 'Customer mortgage as we love it.', 
			icon: '/ihypo.svg',
			overviewComponentUrl: '/ihypo-overview.js',
			createComponentUrl: '/ihypo-create.js',
			actions: {
				create: {},
				update: {},
				custom: {}
			} 
		}
	});	
});

const case1 = new ObjectId('000000000010');	
const case2 = new ObjectId('000000000011');	
Case.deleteMany({}, (err) => {	
	if (err) throw err;
	Case.create({ _id: case1, 
		id: hash.encodeHex(case1.toHexString()),  
		product: 'ihypo', 
		name: 'Jan Novák, byt u Muzea', 
		status: 'SENT',
		data: {
			loanAmount: 2100000
		}
	});	
	Case.create({ _id: case2, 
		id: hash.encodeHex(case2.toHexString()),  
		product: 'xhypo', 
		name: 'Mary Vomaczkowa, hacienda grande', 
		status: 'SENT'
	});	
});

const parseAndValidate = (payload) => {
	const json = JSON.parse(payload);
	if (!ajv.validate('product', json)) {
		const path = ajv.errors[0].dataPath ? ajv.errors[0].dataPath.substring(1) + ": " : "";
		throw new ProductDescriptorValidationError(path + ajv.errors[0].message);
	}

	return json;
}

/** 
 * @typedef Error
 * @property {string} error - error description
 */
module.exports = function (app) {

	swagger(app)(config.swagger);

	/**
	 * Register product.
	 * @route POST /api/products
	 * @group Products - Product operations
   * @param {file} file.required - product definition file
   * @consumes multipart/data
   * @produces application/json
	 * @returns {Product.model} 201 - successfully uploaded 
	 * @returns {Error} 500 - system error
	 */
	app.post('/api/products', upload.single("file"), (req, res) => {
		try {
			const nid = new ObjectId();
			const payload = parseAndValidate(fs.readFileSync(req.file.path).toString());
			Product.create({
				_id: nid,
				id: hash.encodeHex(nid.toHexString()), 			
				name: payload.name,
				revision: 1,
				createdAt: new Date(),
				spec: payload
			}, (err, model) => {
				if (err) throw err;
				res.status(201).send(model);
			});
		} catch (err) {
			if (err instanceof ProductDescriptorValidationError) {
				res.status(400).json({error: err.message});
			} else res.status(500).json({error: err.message});
		}
	});

	/**
	 * Get products.
	 * @route GET /api/products
	 * @group Products - Product operations
   * @produces application/json
	 * @returns {[Product.model]} 200 - An array of product information info
	 * @returns {Error} 500 - system error
	 */
	app.get('/api/products', (req, res) => {
		Product.find((err, products) => {
			if (err) throw err;
			res.status(200).send(products);
		});
	});

	/**
	 * Get product by name.
	 * @route GET /api/products/{name}
	 * @group Products - Product operations
	 * @param {string} name - product name
   * @produces application/json
	 * @returns {Product.model} 200 - Product information info
	 * @returns {Error} 404 - product not found
	 * @returns {Error} 500 - system error
	 */
	app.get('/api/products/:name', (req, res) => {
		Product.findOne({ name: req.params.name }, (err, product) => {
			if (err) throw err;
			if (product) return res.status(200).send(product);
			res.status(404).json({ error: 'product ' + req.params.name + ' is not registered'});
		});
	});

	/**
	 * Delete product by name.
	 * @route DELETE /api/products/{name}
	 * @group Products - Product operations
	 * @param {string} name - product name
   * @produces application/json
	 * @returns {Product.model} 200 - Product information info
	 * @returns {Error} 500 - system error
	 */
	app.delete('/api/products/:name', (req, res) => {
		Product.deleteOne({ name: req.params.name }, (err, product) => {
			if (err) throw err;
			if (product) return res.status(204).send();
			res.status(404).json({ error: 'product ' + req.params.name + ' is not registered'});
		});
	});
	
	/**
	 * Get cases.
	 * @route GET /api/cases
	 * @group Cases - Case operations
   * @produces application/json
	 * @returns {[Case.model]} 200 - An array of cases
	 * @returns {Error} 500 - system error
	 */
	app.get('/api/cases', (req, res) => {
		Case.find((err, cases) => {
			if (err) throw err;
			res.status(200).send(cases.map(c => c.toObject({ flattenMaps: true })));
		});
	});

		/**
	 * Create a new case.
	 * @route POST /api/models/{modelId}/cases
	 * @group Cases - Main data here
   * @produces application/json
	 * @returns {[Case.model]} 200 - An array of respective cases
	 * @returns {Error} 500 - system error
	 */
	app.post('/api/cases', (req, res) => {
		if (!req.body.product) {
			return res.status(400).json({ error: 'illegal request'});
		}

		Product.findOne({ name: req.body.product }, (err, product) => {
			if (err) throw err;
			if (!product) {
				return res.status(404).json({ error: 'product ' + req.body.product + ' is not registered'});
			}

			const data = new Map([]);
			Object.keys(req.body)
				.filter(f => f !== 'product')
				.forEach(f => data.set(f, req.body[f]));

			const caseId = new ObjectId();	
			Case.create({ _id: caseId, 
				id: hash.encodeHex(caseId.toHexString()),  
				name: "Case " + caseId, 
				revision: 1, 
				starred: false,
				createdAt: new Date(),
				product: product._id,
				data: data
			}, (err, caseObject) => {
				if (err) throw err;
				return res.status(201).json({ ...caseObject._doc, product: undefined });
			});	
		});
	});

	app.get('/swagger.json', (err, res) => {
    res.status(200).json(swagger.json());
	})

	app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));                               
	});

	app.use((err, req, res, next) => {
		if (err.message) {
			logger.error('root handler', err.message);
			const errd = config.errors[err.message];
			if (errd) {
				res.status(errd.status).json({ error: errd.message })
			} else {
				res.status(500).json({ error: err.message });
			}
		} else {
			logger.error('root handler', err);
			res.status(500).json({ error: err });
		}
	});

}	
