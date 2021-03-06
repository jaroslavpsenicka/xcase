const Hashids = require('hashids/cjs');
const ObjectId = require('mongoose').Types.ObjectId; 
const Product = require('./model/product');
const Case = require('./model/case');
const Ajv = require('ajv');
const Axios = require('axios');
const swagger = require('express-swagger-generator');
const config = require('./config');
const log4js = require('log4js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

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

const assistant = new AssistantV2({
	authenticator: new IamAuthenticator({ apikey: config.assistant.apikey }),
	url: config.assistant.url,
	version: config.assistant.version
});

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
			detailComponentUrl: '/ihypo-detail.js',
			actions: [{
				name: 'beautify',
				label: 'Beautify',
				description: 'Beautify the case',
				view: 'standard',
				componentUrl: '/ihypo-beautify.js'
			}, {
				name: 'download',
				label: 'Download',
				description: 'Download as PDF',
				view: 'window',
				componentUrl: '${SERVICE_URL}/api/cases/${CASE_ID}/download'
			}, {
				view: 'separator',
			}, {
				name: 'remove',
				label: 'Remove',
				description: 'Remove the case',
				view: 'dialog',
				componentUrl: '/ihypo-remove.js'
			}]
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
		createdAt: new Date(2000),
		status: 'SENT',
		data: {
			loanAmount: 2100000
		}
	});	
	Case.create({ _id: case2, 
		id: hash.encodeHex(case2.toHexString()),  
		product: 'xhypo', 
		name: 'Mary Vomaczkowa, hacienda grande', 
		createdAt: new Date(1000),
		status: 'SENT'
	});	
});

const validate = (json, baseUrl) => {

	// validate against JSON schema

	if (!ajv.validate('product', json)) {
		const path = ajv.errors[0].dataPath ? ajv.errors[0].dataPath.substring(1) + ": " : "";
		throw new ProductDescriptorValidationError(path + ajv.errors[0].message);
	}

	// validate component URLs

	return Promise.all([
		requestGet(json.overviewComponentUrl, baseUrl), 
		requestGet(json.createComponentUrl, baseUrl), 
		requestGet(json.detailComponentUrl, baseUrl)
	])
}

const requestGet = (url, baseUrl) => {
	return Axios.get(url.startsWith('http') ? url : (baseUrl + url));
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
			const payload = JSON.parse(fs.readFileSync(req.file.path).toString());
			validate(payload, req.body.baseUrl).then(() => {
				const nid = new ObjectId();
				Product.create({
					_id: nid,
					id: hash.encodeHex(nid.toHexString()), 			
				id: hash.encodeHex(nid.toHexString()), 			
					id: hash.encodeHex(nid.toHexString()), 			
					name: payload.name,
					revision: 1,
					createdAt: new Date(),
					spec: payload
				}, (err, model) => {
					if (err) throw err;
					res.status(201).send(model);
				});
			}).catch(err => {
				logger.error('error registering the product', err);
				return res.status(400).json({
					error: err.config.url ? err.message + ', ' + err.config.url : err.message
				});
			});
		} catch (err) {
			if (err instanceof ProductDescriptorValidationError) {
				return res.status(400).json({error: err.message});
			} else return res.status(500).json({error: err.message});
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
		Case.find({})
			.sort([['updatedAt', -1], ['createdAt', -1]])
			.exec((err, cases) => {
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
				product: product.name,
				data: data
			}, (err, caseObject) => {
				if (err) throw err;
				return res.status(201).json({ ...caseObject._doc });
			});	
		});
	});

	app.get('/api/cases/:id/download', (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename= ' + req.params.id + '.json');
    res.setHeader('Content-type', 'application/json');
    res.write('{}', function (err) {
			if (err) throw err;
			res.end();
    });
	});

	app.get('/api/creating/:id', (req, res) => {
		const caseId = new ObjectId();	
		Case.create({ 
			_id: caseId, 
			id: hash.encodeHex(caseId.toHexString()),  
			name: 'František Novák, dům u lesa', 
			revision: 1, 
			starred: false,
			createdAt: new Date(),
			product: 'ihypo', 
			data: {
				loanAmount: 2000000
			}
		}, (err, caseObject) => {
			if (err) throw err;
			return res.status(200).json({ ...caseObject._doc });
		});	
	});

	app.get('/api/updating/:id', (req, res) => {
		Case.findOne({ id: req.params.id }, (err, caseObject) => {
			if (err) throw err;
			caseObject.name = 'František Novák, dům u paseky';
			caseObject.updatedAt = new Date();
			caseObject.save((err, caseObject) => {
				if (err) throw err;
				return res.status(200).json({ ...caseObject._doc });
			});
		});
	});

	// Addons

	app.get('/api/addons', (req, res) => {
		return res.status(200).json([{  
			name: 'docs',
			label: 'Documents',
			description: 'Shows links to important documents',
			iconUrl: '/addon-docs.svg',
			iconSelectedUrl: '/addon-docs-selected.svg',
			componentUrl: '/addon-docs.js'
		}, {  
			name: 'calc',
			label: 'Calculators',
			description: 'Contains more or less interesting calculators',
			iconUrl: '/addon-calc.svg',
			iconSelectedUrl: '/addon-calc-selected.svg',
			componentUrl: '/addon-calc.js'
		}, {  
			name: 'chat',
			label: 'Chat',
			description: 'Chat with a bot',
			iconUrl: '/addon-chat.svg',
			iconSelectedUrl: '/addon-chat-selected.svg',
			componentUrl: '/addon-chat.js'
		}]);
	});

	// Assistant routes

	app.post('/api/assistant', (req, res) => {
		if (!config.assistant.id) {
			return res.status(503).json({ error: 'service not available' });
		} 
		
		const payload = { assistantId: config.assistant.id };
		assistant.createSession(payload).then(response => {
			return res.status(200).json(response.result);
		}).catch(err => {
			console.log(err);
			return res.status(500).json({ error: err.message });
		});
	});

	app.post('/api/assistant/:session/message', (req, res) => {
		const payload = { 
			assistantId: config.assistant.id, 
			sessionId: req.params.session, 
			input: req.body.input, 
			context: req.body.context
		};
		assistant.message(payload, (err, response) => {
			if (err) throw err;
      return res.json({ ...response.result, timestamp: Date.now() });
		});
	});

	app.delete('/api/assistant/:sesion', (req, res) => {
		const payload = { assistantId: config.assistant.id, sessionId: req.params.session };
		assistant.deleteSession(payload, (err, response) => {
			if (err) throw err;
      return res.json(response);
		});
	});

	// Editors

	app.get('/api/editors', (req, res) => {
		return res.status(200).json([{  
			name: 'string-field',
			componentUrl: '/string-field.js'
		}, {  
			name: 'togglegroup-field',
			componentUrl: '/togglegroup-field.js'
		}, {  
			name: 'recordlist-field',
			componentUrl: '/recordlist-field.js'
		}]);
	});

	// Requests 

	app.get('/api/requests', (req, res) => {
		return res.status(200).json([{  
			cidla: "SC0000000002040924",
			casePhase: null,
			caseStatus: "ACTIVATED",
			caseType: "CT103",
			completedAt: null,
			createdAt: 1579183654679,
			createdBy: "yxf04349",
			label: "Cenová vyjímka",
			loadedAttributes: null,
			modifiedAt: Date.now() - 1000000,
			presentationSubject: "Oleh Nahirnyy, RČ 6704302451",
			urged: false
		}, {
			cidla: "SC0000000000000001",
			casePhase: null,
			caseStatus: 'COMPLETED',
			caseType: "CT001",
			completedAt: null,
			createdAt: 1579182654679,
			createdBy: "yxf04349",
			label: 'General question',
			loadedAttributes: null,
			modifiedAt: 1579182066315,
			presentationSubject: 'About this damn industry as such.',
			urged: true
		}]);
	});

	app.get('/api/requests/:id', (req, res) => {
		fs.readFile(path.join(__dirname, `data/${req.params.id}.json`), 'utf-8', (err, data) => {
			if (err) throw err;
      return res.json(JSON.parse(data));
		});
	})

	// Tasks 

	app.get('/api/tasks', (req, res) => {
		return res.status(200).json([{  
			id: '001',
			label: 'Mary Vomaczkowa, missing documents',
			description: 'Birth certificate seems to be a bit weird',
			severity: 'medium',
			status: 'in-progress',
			createdAt: Date.now() - 100000				
		}, {  
			id: '002',
			label: 'John Novák, general question',
			description: 'About this damn industry as such.',
			status: 'completed',
			updatedAt: new Date(1580263805128).getTime()
		}]);
	});
	
	// Misc routes

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
