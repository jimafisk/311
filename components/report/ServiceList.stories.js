// @flow

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ServiceList from './ServiceList';
import FormDialog from '../common/FormDialog';

const SERVICE_SUMMARIES = [
  {
    service_name: 'General Request',
    service_code: 'SRTV-00000054',
    metadata: true,
  },
  {
    service_name: 'Needle Removal',
    service_code: 'SRTV-00000057',
    metadata: true,
  },
  {
    service_name: 'Park Lighting Issues',
    service_code: 'SRTV-00000066',
    metadata: true,
  },
  {
    service_name: 'Illegal Vending',
    service_code: 'SRTV-00000080',
    metadata: true,
  },
  {
    service_name: 'Empty Litter Basket',
    service_code: 'SRTV-00000086',
    metadata: true,
  },
  {
    service_name: 'Sidewalk Repair',
    service_code: 'SRTV-00000092',
    metadata: true,
  },
  {
    service_name: 'Missed Trash, Recycling, Yard Waste, Bulk Item',
    service_code: 'SRTV-00000100',
    metadata: true,
  },
  {
    service_name: 'Animal Control Generic',
    service_code: 'SRTV-00000132',
    metadata: true,
  },
  {
    service_name: 'DEMO SERVICE TYPE',
    service_code: 'SRTV-00000146',
    metadata: true,
  },
];

storiesOf('ServiceList', module)
  .add('List', () => (
    <FormDialog>
      <ServiceList summaries={SERVICE_SUMMARIES} onCodeChosen={action('Code Chosen')} />
    </FormDialog>
  ));
