import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const styledLoadingImage = {
  width: '20px !important',
  height: '20px',
  margin: '12px auto'
}

const Loading = ({text}) => (
  <div className="mt-5 text-center text-secondary d-flex flex-column flex-grow-1">
    <FontAwesomeIcon icon={faSpinner} className="fa-pulse mb-3 d-block" style={styledLoadingImage}/>
    { text ? text : 'Loading...'}
  </div>
)

export default Loading;