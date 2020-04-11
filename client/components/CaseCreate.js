import React from 'react';
import { adapt } from "webcomponents-in-react"
import { navigate } from 'hookrouter';

const CaseCreate = ({product}) => {

const CustomOverviewTag = adapt(`${product.name}-create`);
  return <CustomOverviewTag {...product} onSubmit={({detail}) => navigate('/loading/' + detail)}/>
}

export default CaseCreate;