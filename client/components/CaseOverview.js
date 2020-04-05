import React from 'react';

const CaseOverview = ({theCase}) => {
  const CustomOverviewTag = `${theCase.product}-overview`;
  return theCase.overview ? <div className="mt-2 ml-5 mr-2 text-secondary">
    <CustomOverviewTag {...theCase.data} />
  </div> : null;
}

export default CaseOverview;