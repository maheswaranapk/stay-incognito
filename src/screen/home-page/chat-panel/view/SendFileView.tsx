/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import download from 'downloadjs';

import { ChatFile } from '../../../../hooks/useChat';
import { timeSince } from '../../../../util/date.util';

const SendView = ({ data, date }: { data: ChatFile; date: Date }) => {
  const downloadBlob = () => {
    download(data.file, data.filename, data.filetype);
  };
  return (
    <div className="d-flex flex-column pt-2 align-items-end">
      <div className="sent-msg d-flex flex-row justify-content-between">
        <div className="flex-grow-1">{data.filename}</div>
        <i
          className="fas fa-arrow-down cursor-pointer text-primary p-1"
          onClick={downloadBlob}
          role="button"
        />
      </div>
      <div className="time-date">{timeSince(date)}</div>
    </div>
  );
};

export default SendView;
