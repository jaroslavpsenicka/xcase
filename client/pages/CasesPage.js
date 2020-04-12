import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faAngleDown, faAngleUp, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ProductsContext } from '../ProductsContext';
import { CasesContext } from '../CasesContext';
import { navigate } from 'hookrouter';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import Search from '../components/Search';
import CaseOverview from '../components/CaseOverview';
import CreateCaseDialog from '../components/CreateCaseDialog';

import styled from 'styled-components';

const StyledProductImage = styled.img`
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 5px auto;
`
const StyledLoadingImage = styled(FontAwesomeIcon)`
  position: absolute;
  width: 20px !important;
  height: 20px;
  margin: 12px 5px;
`

const CasesPage = () => {

  const { cases, setCases, loading } = useContext(CasesContext);
  const [ products ] = useContext(ProductsContext);
  const [ showCreateCaseDialog, setShowCreateCaseDialog ] = useState(false);

  const toggleOverview = (thecase) => {
    setCases(prev => { 
      return { ...prev, data: prev.data.map((row) => {
        return row.id === thecase.id ? {...row, overview: !thecase.overview} : row
      })}
    });
  }
   
  const createCase = (product) => {
    setShowCreateCaseDialog(false);
    navigate('/create-case/' + product.name);
  }

  const NoCases = () => (
    <div className="mt-5 text-center text-secondary">No, there are no cases of this kind.</div>
  )

  const CaseStateAndActions = ({theCase, enabled}) => (
    <div className="mr-2 float-right cursor-pointer" onClick={() => toggleOverview(theCase)}>
      <FontAwesomeIcon icon={theCase.overview ? faAngleUp : faAngleDown} size="lg" />
    </div>
  )

  const CaseRow = ({theCase}) => {
    const product = products.data && products.data.find(p => p.name === theCase.product);
    const labelClass = `text-ellipsis pr-3 ml-5 mb-0 ${product ? 'text-primary' : 'text-secondary'}`
    return (
      <div className="p-2 pl-3 mb-1 bg-white text-secondary">
        { product ? <CaseStateAndActions theCase={theCase} /> : null }
        <div className="mr-5">
          <StyledProductImage src={ product ? product.spec.icon : '/none.svg'} />
          <h5 className={labelClass}>{theCase.name}</h5>
          <div className="text-secondary ml-5">{theCase.description ? theCase.description : 'No description.'}</div>
        </div>
        <CaseOverview theCase={theCase} className="mt-2"/>
      </div>
    )
  }

  const LoadingCaseRow = () => (
    <div className="p-2 pl-3 mb-1 bg-white text-secondary">
      <div className="mr-5">
        <StyledLoadingImage icon={faSpinner} className="fa-pulse" />
        <h5 className="text-ellipsis pr-3 ml-5 mb-0 text-secondary">The case is being created...</h5>
        <div className="text-secondary ml-5">Please wait while the case detail is loading.</div>
      </div>
    </div>
  )

  const Cases = ({ cases }) => {
    const caseRows = cases.map(c => <CaseRow theCase={c} key={c.id} />);
    if (loading) caseRows.unshift(<LoadingCaseRow key="loading"/>)
    return caseRows;
  }
  
  return (
    <div className="p-4">
      <h4 className="text-muted font-weight-light text-uppercase mb-4">
        <FontAwesomeIcon icon={faPlus} className="mr-2 float-right cursor-pointer text-success"
          onClick={() => setShowCreateCaseDialog(true)}/>
        Cases
      </h4>
      <CreateCaseDialog 
        products={products ? products.data : undefined}
        show={showCreateCaseDialog} 
        onAdd={(product) => createCase(product)} 
        onCancel={() => setShowCreateCaseDialog(false)}/>      
      <Search/>
      {
        cases.loading ? <Loading /> : 
        cases.error ? <LoadingError error = { cases.error }/> :  
        cases.data ? <Cases cases={cases.data}/> : 
        <NoCases />
      }
    </div>  
  )
};

export default CasesPage;
