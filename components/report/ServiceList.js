// @flow
import React from 'react';
import { css } from 'glamor';
import { Link } from 'react-router-dom';

import type { ServiceSummary } from '../../server/services/Open311';

const STYLES = {
  list: css({
    margin: '0.75em 0',
    padding: '0 1em',
    listStyle: 'none',
  }),

  item: css({
    ':before': {
      content: '""',
      borderColor: 'transparent #111',
      borderStyle: 'solid',
      borderWidth: '0.35em 0 0.35em 0.45em',
      display: 'block',
      height: 0,
      width: 0,
      left: '-1em',
      top: '0.9em',
      position: 'relative',
    },
  }),

  link: css({
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: '#37a0e7',
    fontWeight: 500,
    fontSize: 15,
  }),
};

export default class ServiceList extends React.Component {
  props: {
    summaries: ServiceSummary[],
    onCodeChosen: (string) => void,
  }

  handleServiceClick = (ev: SyntheticInputEvent) => {
    ev.preventDefault();
    this.props.onCodeChosen(ev.target.value);
  }

  render() {
    const { summaries } = this.props;
    return (
      <ul className={STYLES.list}>{ summaries.map(this.renderServiceButton) }</ul>
    );
  }

  renderServiceButton = ({ service_name: name, service_code: code }: ServiceSummary) => (
    <li className={STYLES.item} key={code}>
      <Link to={`/report/${code}`} className={STYLES.link}>{name}</Link>
    </li>
  );
}
