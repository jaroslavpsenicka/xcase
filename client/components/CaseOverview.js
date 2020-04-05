import React from 'react';

const CaseOverview = ({theCase}) => {
  const CustomOverviewTag = `${theCase.product}-overview`;
  return theCase.overview ? <div className="mt-2 ml-5 text-secondary">
    <CustomOverviewTag />
  </div> : null;
}

export default CaseOverview;