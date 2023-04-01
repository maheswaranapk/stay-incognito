import React from 'react';

import { timeSince } from '../../../../util/date.util';

const SendView = ({ data, date }: { data: string; date: Date }) => {
  return (
    <div className="sent-parent d-flex flex-column pt-2 align-items-end">
      <div className="sent-msg">{data}</div>
      <div className="time-date">{timeSince(date)}</div>
    </div>
  );
};

export default SendView;
