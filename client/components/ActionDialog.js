import React, { useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ActionDialog = ({product, action, show, onPerform, onCancel}) => {

  const Action = ({product, action}) => {
    const CustomOverviewTag = `${product.name}-${action.name}`;
    return <CustomOverviewTag {...action} />
  }
  
  return (  
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{action.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Action product={product} action={action} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onPerform}>Perform</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ActionDialog;