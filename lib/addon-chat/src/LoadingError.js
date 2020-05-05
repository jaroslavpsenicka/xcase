import React from 'react';

const LoadingError = ({ error }) => (
  <div className="mt-5 mb-3 text-center text-secondary flex-column flex-grow-1">Oops, {error ? error.message : 'something went wrong'}.</div>  
)

export default LoadingError;   