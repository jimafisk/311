import React from 'react';
import { css } from 'glamor';

const STYLE = {
  nav: css({
    backgroundColor: 'black',
    color: 'white',
    textTransform: 'uppercase',
    padding: 10,
    display: 'flex',
    justifyContent: 'flex-end',

    '& a': {
      color: 'white',
      textDecoration: 'none',
      margin: '0 10px',
    },
  }),
};

export default function Nav() {
  return (
    <div className={`nav ft-ll ${STYLE.nav}`}>
      <a>Report a problem</a>
      <a>Case look up</a>
      <a>311 on the go</a>
      <a>FAQ</a>
    </div>
  );
}
