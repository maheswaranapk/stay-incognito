import React, { useState } from 'react';

import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const WarningModal = ({ onRejectTerms }) => {
  const [modal, setModal] = useState(true);

  const toggle = () => setModal(false);

  return (
    <Modal isOpen={modal}>
      <ModalBody>
        You are connected to your partner via peer to peer communication. If
        connection is lost, you cannot be able to connect back with the already
        used link.
        <br />
        <br />
        <div className="alert alert-warning" role="alert">
          Stay Incognito is created for learning purposes. Don&apos;t use it for
          illegal activities.
        </div>
        <br />
        <div className="alert alert-warning" role="alert">
          Do not use Stay Incognito, if you are under 13. If you are under 18,
          use it only with your parent/guardian&apos;s permission. Don&apos;t
          transmit nudity & child pornography, harass anyone, make statements
          that defame or libel anyone, and violate intellectual property rights.
        </div>
        By clicking on <b>Accept</b>, you are accepting above Terms
      </ModalBody>
      <ModalFooter>
        <Button
          color="link"
          onClick={() => {
            toggle();
            onRejectTerms();
          }}
        >
          Reject
        </Button>
        <Button color="primary" onClick={toggle}>
          Accept
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WarningModal;
