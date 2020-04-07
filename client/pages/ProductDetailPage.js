import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row'
import { ProductsContext } from '../ProductsContext';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import Search from '../components/Search';
import CaseOverview from '../components/CaseOverview';

import styled from 'styled-components';

const ProductDetailPage = ({ name }) => {

  const [ products ] = useContext(ProductsContext);

  const ProductDetail = ({ product }) => {
    return (
      <div className="row">
        <div className="col-md-3 text-secondary">Name</div>
        <div className="col-md-9">{product.name}</div>
        <div className="col-md-3 text-secondary">Label</div>
        <div className="col-md-9">{product.label}</div>
        <div className="col-md-3 text-secondary">Description</div>
        <div className="col-md-9">{product.description}</div>
        <div className="col-md-3 text-secondary">Icon URL</div>
        <div className="col-md-9">{product.icon}</div>
        <div className="col-md-3 text-secondary">Overview URL</div>
        <div className="col-md-9">{product.overviewComponentUrl}</div>
      </div>
    )
  }

  const Product = ({ name }) => {
    const product = products.data.find(p => p.name === name);
    return product ? <>
      <h4 className="text-muted font-weight-light text-uppercase mb-4">{product.spec.label}</h4>
      <ProductDetail product={product.spec} />
    </> : null;
  }
  
  return (
    <div className="p-4">
      {
        products.loading ? <Loading /> : 
        products.error ? <LoadingError error = { products.error }/> :  
        products.data ? <Product name={name}/> : 
        <NoSuchProduct />
      }
    </div>  
  )
};

export default ProductDetailPage;



