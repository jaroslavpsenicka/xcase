class ProductDescriptorValidationError extends Error {  
  constructor (message) {
    super(message)
  }
}

class AuthError extends Error {  
  constructor (message) {
    super(message)
  }
}

module.exports = { ProductDescriptorValidationError, AuthError }   