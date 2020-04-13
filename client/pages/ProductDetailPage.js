import React, { useContext } from 'react';
import { ProductsContext } from '../ProductsContext';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';

const ProductDetailPage = ({ name }) => {

  const [ products ] = useContext(ProductsContext);

  const Product = ({ name }) => {
    const product = products.data.find(p => p.name === name);
    if (!product) return <NoSuchProduct />;
    return <>
      <h4 className="text-muted font-weight-light text-uppercase mb-4">{product.spec.label}</h4>
      <div className="row">
        <div className="col-md-3 text-secondary">Name</div>
        <div className="col-md-9">{product.spec.name}</div>
        <div className="col-md-3 text-secondary">Label</div>
        <div className="col-md-9">{product.spec.label}</div>
        <div className="col-md-3 text-secondary">Description</div>
        <div className="col-md-9">{product.spec.description}</div>
        <div className="col-md-3 text-secondary">Icon URL</div>
        <div className="col-md-9">{product.spec.icon}</div>

        <h5 className="col-md-12 mt-3 mb-2">Components</h5>
        <div className="col-md-3 text-secondary">Overview URL</div>
        <div className="col-md-9"><a href={product.spec.overviewComponentUrl} target="_new">{product.spec.overviewComponentUrl}</a></div>
        <div className="col-md-3 text-secondary">Create URL</div>
        <div className="col-md-9"><a href={product.spec.createComponentUrl} target="_new">{product.spec.createComponentUrl}</a></div>
        <div className="col-md-3 text-secondary">Detail URL</div>
        <div className="col-md-9"><a href={product.spec.detailComponentUrl} target="_new">{product.spec.detailComponentUrl}</a></div>
      </div>
    </>
  }
  
  const NoSuchProduct = () => (
    <div className="mt-5 text-center text-secondary">No, there is no such product.</div>
  )

  return (
    <div className="p-4">
      {
        products.loading ? <Loading /> : 
        products.error ? <LoadingError error = { products.error }/> :  
        products.data ? <Product name={name}/> : <NoSuchProduct />
      }
    </div>  
  )
};

export default ProductDetailPage;



