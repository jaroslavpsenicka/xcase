import React, { useState, useEffect, createContext } from 'react';
import Axios from 'axios';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '';
const ProductsContext = createContext([{}, () => {}]);

const ProductsProvider = ({children}) => {

  const [products, setProducts] = useState({ loading: true });

  const handleProducts = (response) => {
    setProducts({ loading: false, data: response.data });
    response.data
      .filter(p => p.spec && p.spec.overviewComponentUrl)
      .map(p => registerWebComponent(p.spec.overviewComponentUrl));
  }

  const registerWebComponent = (url) => {
    console.log('Registering web component ', url);
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.body.appendChild(script);  
  }

  useEffect(() => {
    setProducts(prev => { return { ...prev, loading: true }});
    Axios.get(SERVICE_URL + '/api/products')
      .then(response => handleProducts(response))
      .catch(err => setProducts({ loading: false, error: err }));
  }, []);
  
  return (
    <ProductsContext.Provider value={[products, setProducts, registerWebComponent]}>{children}</ProductsContext.Provider>
  );
}

export { ProductsContext, ProductsProvider };