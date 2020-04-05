import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { ProductsContext } from '../ProductsContext';
import { CasesContext } from '../CasesContext';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import Search from '../components/Search';
import CaseOverview from '../components/CaseOverview';

import styled from 'styled-components';

const StyledProductImage = styled.img`
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 5px auto;
`

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



