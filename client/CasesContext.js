import React, { useState, useEffect, createContext } from 'react';
import Axios from 'axios';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '';
const CasesContext = createContext([{}, () => {}]);

const CasesProvider = ({children}) => {

  const [cases, setCases] = useState({ loading: true });
  const [loading, setLoading] = useState();

  const load = (caseId) => {
    if (caseId) {
      setLoading(caseId);
      setTimeout(checkLoading, 2000, caseId);
    }
  }

  const checkLoading = (caseId) => {
    Axios.get(SERVICE_URL + '/api/loading/' + caseId)
      .then(response => loaded(response.data))
      .catch(err => setTimeout(checkLoading, 1000));
  }

  const loaded = (newCase) => {
    setLoading(false);
    setCases({ ...cases, data: [newCase, ...cases.data]})  
  }

  useEffect(() => {
    setCases(prev => { return { ...prev, loading: true }});
    Axios.get(SERVICE_URL + '/api/cases')
      .then(response => setCases({ loading: false, data: response.data }))
      .catch(err => setCases({ loading: false, error: err }));
  }, []);

  return (
    <CasesContext.Provider value={{cases, setCases, loading, load}}>{children}</CasesContext.Provider>
  );
}

export { CasesContext, CasesProvider };