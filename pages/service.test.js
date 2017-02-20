// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import Service from './service';

const MOCK_SERVICE_SUMMARY = {
  service_name: 'Needle Pickup',
  service_code: 'needles',
  metadata: true,
};

const MOCK_SERVICE_METADATA = {
  attributes: [{
    required: false,
    datatype: 'Text',
    code: 'ST-CMTS',
    description: 'Please provide any other relevant information:',
  }, {
    required: false,
    datatype: 'Informational',
    code: 'INFO-NEDRMV1',
    description: '**All needle pickup cases should be followed up with a phone call to one of the below agencies.**',
  }, {
    required: true,
    datatype: 'Picklist',
    code: 'SR-NEDRMV1',
    description: 'How many needles are at the location?',
    values: [{ key: 'One', name: 'One' }, { key: 'Two', name: 'Two' }, { key: 'Three', name: 'Three' }, { key: 'More than Three', name: 'More than Three' }],
  }],
};

test('service page', async () => {
  const data = {
    summary: MOCK_SERVICE_SUMMARY,
    metadata: MOCK_SERVICE_METADATA,
  };

  const component = renderer.create(<Service data={data} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
