/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const confirmModal = ({
  message,
  title,
  onlyOkButton = false,
}: {
  message: string;
  title: string;
  onlyOkButton?: boolean;
}): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    let el: HTMLDivElement | null = document.createElement('div');

    const handleResolve = (result) => {
      if (el) unmountComponentAtNode(el);
      el = null;
      resolve(result);
    };

    render(
      <Modal isOpen toggle={() => handleResolve(false)}>
        {title && (
          <ModalHeader toggle={() => handleResolve(false)}>
            {title || null}
          </ModalHeader>
        )}
        <ModalBody>
          <span className="confirmation-message">{message}</span>
          <i
            className=" cn-icon-cross cursor-pointer"
            onClick={() => handleResolve(false)}
            role="button"
          />
        </ModalBody>
        <ModalFooter>
          {onlyOkButton ? (
            <Button color="primary" onClick={() => handleResolve(false)}>
              OK
            </Button>
          ) : (
            <>
              <Button color="link" onClick={() => handleResolve(false)}>
                No
              </Button>{' '}
              <Button color="primary" onClick={() => handleResolve(true)}>
                Yes
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>,
      el,
    );
  });

export default confirmModal;
