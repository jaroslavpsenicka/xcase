import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const TasksPage = () => {

  return (
    <div className="p-4">
      <h4 className="text-muted font-weight-light text-uppercase mb-4">
        <FontAwesomeIcon icon={faPlus} className="mr-2 float-right cursor-pointer text-success"
          title="Create task"/>
        Tasks
      </h4>
      <div className="text-secondary">The page shows list of tasks either you or someone else created.</div>
      <img className="mx-auto d-block mt-100px" src="/job-done.png"/>
    </div>  
  )
};

export default TasksPage;
