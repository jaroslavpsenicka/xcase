import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge';
import { faStar, faAngleDown, faAngleUp, faPlus, faComment } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutline, faComment as faCommentOutline} from '@fortawesome/free-regular-svg-icons'
import Axios from 'axios'
import { navigate } from 'hookrouter';
import { CasesContext } from '../CasesContext';

import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import Search from '../components/Search';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '';

const CasesPage = () => {

  const [ cases, setCases ] = useContext(CasesContext);

  const setCaseOverview = (id, value) => {
    setCases(prev => { 
      return { ...prev, data: prev.data.map((row) => {
        return row.id === id ? {...row, overview: value} : row
      })}
    });
  }

  const toggleOverview = (thecase) => {
    if (thecase.overview) {
      setCaseOverview(thecase.id, null);
    } else {
      setCaseOverview(thecase.id, { loading: true });
      Axios.get(SERVICE_URL + '/api/cases/' + thecase.id + '/overview')
        .then(response => setCaseOverview(thecase.id, { loading: false, data: response.data }))
        .catch(err => setCaseOverview(thecase.id, { loading: false, error: err }));
    }
  }
      
  const NoCases = () => (
    <div className="mt-5 text-center text-secondary">No, there are no cases of this kind.</div>
  )

  const CaseStateAndActions = ({theCase}) => (
    <Row className="mr-2 float-right">
      <h5 className="ml-3"><Badge variant="secondary">{theCase.state}</Badge></h5>
      <FontAwesomeIcon icon={theCase.overview ? faAngleUp : faAngleDown} size="lg" 
        className="ml-3 cursor-pointer"
        onClick={() => toggleOverview(theCase)}/>
    </Row>
  )

  const CaseOverview = ({theCase}) => {
    return !theCase.overview ? null :
      theCase.overview.loading ? <Loading /> :
      theCase.overview.error ? <LoadingError /> : (
      <div className="pt-3 text-secondary">
        { theCase.overview.data.map(n => 
          <CaseOverviewProperty name={n.name} value={n.value} key={n.name} />) }
      </div>
    )
  }

  const CaseRow = ({theCase}) => (
    <div className="p-2 pl-3 mb-1 bg-white text-dark">
      <CaseStateAndActions theCase={theCase} />
      <div>
        <h5 className="text-primary text-ellipsis pr-3 mr-5">{theCase.name}</h5>
        <div className="text-secondary">{theCase.description ? theCase.description : 'No description.'}</div>
      </div>
      <CaseOverview theCase={theCase} />
    </div>
  )

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



