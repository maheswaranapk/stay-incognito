import React, { FC } from 'react';
import './Credit.scss';

const Credit: FC<{}> = () => (
  <div className="credit mb-3">
    <span>Made with</span>
    <span aria-label="love-emoji" className="ml-1 mr-2" role="img">
      ❤️
    </span>
    <span>
      by{' '}
      <a href="http://appybot.in" rel="noopener noreferrer" target="_blank">
        AppyBot.in
      </a>
    </span>
  </div>
);

export default Credit;
