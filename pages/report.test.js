// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import Report from './report';

const MOCK_SERVICE_SUMMARIES = [{
  service_name: 'Needle Pickup',
  service_code: 'needles',
  metadata: true,
}];

test('request flow', async () => {
  const data = {
    serviceSummaries: MOCK_SERVICE_SUMMARIES,
  };

  const component = renderer.create(<Report data={data} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
