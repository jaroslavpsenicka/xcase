import React, { useContext } from 'react';
import { ProductsContext } from '../ProductsContext';
import Row from 'react-bootstrap/Row';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';

const ProductDetailPage = ({ name }) => {

  const [ products ] = useContext(ProductsContext);

  const Product = ({ name }) => {
    const product = products.data.find(p => p.name === name);
    if (!product) return <NoSuchProduct />;
    return <>
      <h4 className="text-muted font-weight-light text-uppercase mb-4">PRODUCTS / {product.spec.label}</h4>
      <div className="row">
        <div className="col-md-3 text-secondary">Name</div>
        <div className="col-md-9">{product.spec.name}</div>
        <div className="col-md-3 text-secondary">Label</div>
        <div className="col-md-9">{product.spec.label}</div>
        <div className="col-md-3 text-secondary">Description</div>
        <div className="col-md-9">{product.spec.description}</div>
        <div className="col-md-3 text-secondary">Icon URL</div>
        <div className="col-md-9">
          <a href={product.spec.icon} target="_new">{product.spec.icon}</a>
        </div>

        <h5 className="col-md-12 mt-4 mb-4">Components</h5>
        <div className="col-md-3 text-secondary">Overview URL</div>
        <div className="col-md-9">
          <a href={product.spec.overviewComponentUrl} target="_new">{product.spec.overviewComponentUrl}</a>
        </div>
        <div className="col-md-3 text-secondary">Create URL</div>
        <div className="col-md-9">
          <a href={product.spec.createComponentUrl} target="_new">{product.spec.createComponentUrl}</a>
        </div>
        <div className="col-md-3 text-secondary">Detail URL</div>
        <div className="col-md-9">
          <a href={product.spec.detailComponentUrl} target="_new">{product.spec.detailComponentUrl}</a>
        </div>

        <h5 className="col-md-12 mt-4 mb-0">Actions</h5>
        <div className="col-md-12">
          { product.spec.actions ? <ActionTable actions={product.spec.actions} /> : <div className="text-secondary">There are no actions</div> }
        </div>
      </div>
    </>
  }
  
  const ActionTable = ({actions}) => (
    <>
      <div className="container ml-0">
        <Row className="p-1 text-secondary">
          <div className="col-md-3"></div>
          <div className="col-md-4 pl-0">Component</div>
          <div className="col-md-5 pl-0">Description</div>
        </Row>
      </div>
      { actions.map(a => <Action key={a.name} action={a}/>) }
    </>
  )

  const Action = ({action}) => (
    <div className="container ml-0">
      <Row className="p-1 bg-white text-primary">
        <div className="col-md-3 pl-1">{action.label}</div>
        <div className="col-md-4 pl-0"><a href={action.componentUrl} target="_new">{action.componentUrl}</a></div>
        <div className="col-md-5 pl-0">{action.description}</div>
      </Row>
    </div>
  )

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



