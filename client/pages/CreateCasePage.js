import React, { useContext } from 'react';
import CaseCreate from '../components/CaseCreate'
import { ProductsContext } from '../ProductsContext';

const CreateCasePage = ({ productName }) => {

  const [ products ] = useContext(ProductsContext);

  const product = products.data.find(p => p.name === productName);

  return (
    <div className="p-4">
      <h4 className="text-muted font-weight-light text-uppercase mb-4">Create {product.spec.label}</h4>
      <CaseCreate product={product} />
    </div>
  );
};

export default CreateCasePage;
