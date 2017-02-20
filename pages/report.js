// @flow
/* eslint react/prefer-stateless-function: 0, global-require: 0 */

import React from 'react';
import { initial } from 'rakt';

import FormDialog from '../components/common/FormDialog';
import ReportFormContainer from '../components/report/ReportFormContainer';

@initial(async ({ done }) => {
  try {
    require('dotenv').config();

    const Open311 = require('../server/services/Open311').default;
    const open311 = new Open311(process.env['311_ENDPOINT'], process.env['311_KEY']);
    const summaries = await open311.serviceSummaries();

    done(null, { summaries });
  } catch (e) {
    done(e);
  }
})
class Report extends React.Component {
  render() {
    const { data } = this.props;
    if (!data) {
      return <div>Loading…</div>;
    }
    const { summaries } = data;

    return (
      <div>
        <FormDialog title="311: Boston City Services">
          { <ReportFormContainer summaries={summaries} /> }
        </FormDialog>
      </div>
    );
  }
}

export default Report;
