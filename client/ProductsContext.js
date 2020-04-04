import React, { useState, useEffect, createContext } from 'react';
import Axios from 'axios';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '';
const ProductsContext = createContext([{}, () => {}]);

const ProductsProvider = ({children}) => {

  const [products, setProducts] = useState({ loading: true });

  useEffect(() => {
    setProducts(prev => { return { ...prev, loading: true }});
    Axios.get(SERVICE_URL + '/api/products')
      .then(response => setProducts({ loading: false, data: response.data }))
      .catch(err => setProducts({ loading: false, error: err }));
  }, []);
  
  return (
    <ProductsContext.Provider value={[products, setProducts]}>{children}</ProductsContext.Provider>
  );
}

export { ProductsContext, ProductsProvider };