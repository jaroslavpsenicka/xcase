import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import { CasesContext } from '../CasesContext';
import { ProductsContext } from '../ProductsContext';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import Search from '../components/Search';

const CasesPage = () => {

  const [ cases, setCases ] = useContext(CasesContext);
  const [ products ] = useContext(ProductsContext);

  const toggleOverview = (thecase) => {
    setCases(prev => { 
      return { ...prev, data: prev.data.map((row) => {
        return row.id === thecase.id ? {...row, overview: !thecase.overview} : row
      })}
    });
  }
   
  const NoCases = () => (
    <div className="mt-5 text-center text-secondary">No, there are no cases of this kind.</div>
  )

  const CaseStateAndActions = ({theCase, enabled}) => (
    <Row className="mr-2 float-right">
      <FontAwesomeIcon icon={theCase.overview ? faAngleUp : faAngleDown} size="lg" 
        className="ml-3 cursor-pointer"
        onClick={() =>  toggleOverview(theCase)}/>
    </Row>
  )

  const CaseOverview = ({theCase}) => {
    const CustomOverviewTag = `${theCase.product.toLowerCase()}-overview`;
    return !theCase.overview ? null : <div className="mt-2">
      <CustomOverviewTag />
    </div>
  }

  const CaseRow = ({theCase}) => {
    const enabled = products.data && products.data.find(p => p.name === theCase.product);
    const labelClass = `text-ellipsis pr-3 mr-5 ${enabled ? 'text-primary' : 'text-secondary'}`
    return (
      <div className="p-2 pl-3 mb-1 bg-white text-dark">
        { enabled ? <CaseStateAndActions theCase={theCase} /> : null }
        <div>
          <h5 className={labelClass}>{theCase.name}</h5>
          <div className="text-secondary">{theCase.description ? theCase.description : 'No description.'}</div>
        </div>
        <CaseOverview theCase={theCase} className="mt-2"/>
      </div>
    )
  }

  const Cases = ({ cases }) => {
    return cases.map(c => <CaseRow theCase={c} key={c.id} />);
  }
  
  return (
    <div className="p-4">
      <h4 className="text-muted font-weight-light text-uppercase mb-4">Cases</h4>
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



