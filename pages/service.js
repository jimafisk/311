// @flow
/* eslint react/prefer-stateless-function: 0, global-require: 0 */

import React from 'react';
import { initial } from 'rakt';
import ServiceFormDialog from '../components/service/ServiceFormDialog';
import type { ServiceSummary, ServiceMetadata } from '../server/services/Open311';

@initial(async ({ req, done }) => {
  try {
    require('dotenv').config();

    const code = req.params[0].split('/')[1];

    const Open311 = require('../server/services/Open311').default;
    const open311 = new Open311(process.env['311_ENDPOINT'], process.env['311_KEY']);
    const summary = open311.serviceSummary(code);
    const metadata = open311.serviceMetadata(code);

    if (await summary) {
      done(null, {
        summary: await summary,
        metadata: await metadata,
      });
    } else {
      done(null, { service: null, metadata: null });
    }
  } catch (e) {
    done(e);
  }
})

export default class Service extends React.Component {
  props: {
    /* eslint-disable react/no-unused-prop-types */
    data: {
      summary: ServiceSummary,
      metadata: ServiceMetadata,
    }
    /* eslint-enable */
  }
  render() {
    return (
      <div>
        <ServiceFormDialog {...this.props.data} />
      </div>
    );
  }
}
