import React, { useState, useEffect, createContext } from 'react';
import Axios from 'axios';

const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || '';
const CasesContext = createContext([{}, () => {}]);

const CasesProvider = ({children}) => {

  const [cases, setCases] = useState({ loading: true });

  useEffect(() => {
    setCases(prev => { return { ...prev, loading: true }});
    Axios.get(SERVICE_URL + '/api/cases')
      .then(response => setCases({ loading: false, data: response.data }))
      .catch(err => setCases({ loading: false, error: err }));
  }, []);

  return (
    <CasesContext.Provider value={[cases, setCases]}>{children}</CasesContext.Provider>
  );
}

export { CasesContext, CasesProvider };