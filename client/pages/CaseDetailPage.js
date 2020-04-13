import React, { useContext } from 'react';
import CaseDetail from '../components/CaseDetail'
import { CasesContext } from '../CasesContext';

const CaseDetailPage = ({ caseId }) => {

  const { cases } = useContext(CasesContext);

  const theCase = cases.data.find(c => c.id === caseId);

  return (
    <div className="p-4">
      <h4 className="text-muted font-weight-light text-uppercase mb-4">{theCase.name}</h4>
      <CaseDetail theCase={theCase} />
    </div>
  );
};

export default CaseDetailPage;
