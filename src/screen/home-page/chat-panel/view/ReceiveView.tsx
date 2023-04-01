import React from 'react';

import { timeSince } from '../../../../util/date.util';

const ReceiveView = ({ data, date }: { data: string; date: Date }) => {
  return (
    <div className="d-flex flex-column pt-2">
      <div className="received-msg">{data}</div>
      <div className="time-date">{timeSince(date)}</div>
    </div>
  );
};

export default ReceiveView;
