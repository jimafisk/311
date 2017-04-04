// @flow

import type { Service } from '../types';
import type { SubmitRequestMutationVariables } from './graphql/types';
import SubmitRequestGraphql from './graphql/SubmitRequest.graphql';

import { AppStore } from '../store';

import submitRequest from './submit-request';

const COSMIC_SERVICE: Service = {
  name: 'Cosmic Incursion',
  code: 'CSMCINC',
  contactRequired: true,
  locationRequired: true,
  attributes: [{
    required: false,
    type: 'TEXT',
    code: 'ST-CMTS',
    description: 'Please provide any other relevant information:',
    values: null,
    conditionalValues: null,
    dependencies: null,
  }, {
    required: false,
    type: 'INFORMATIONAL',
    code: 'INFO-NEDRMV1',
    description: '**All cosmic incursion cases should be followed up with a phone call to Alpha Flight.**',
    values: null,
    conditionalValues: null,
    dependencies: null,
  }, {
    required: true,
    type: 'SINGLEVALUELIST',
    code: 'SR-AVENG',
    description: 'Which Avengers team do you need?',
    values: [{ key: 'mcu', name: 'Cinematic' }, { key: 'great-lakes', name: 'Great Lakes' }, { key: 'us-avengers', name: 'US Avengers' }],
    conditionalValues: [],
    dependencies: null,
  }, {
    required: false,
    type: 'MULTIVALUELIST',
    code: 'MR-WHO',
    description: 'Who would you like?',
    values: [
      { key: 'anyone', name: 'Anyone' },
    ],
    conditionalValues: [{
      dependentOn: {
        clause: 'AND',
        conditions: [{ attribute: 'SR-AVENG', op: 'eq', value: { type: 'STRING', string: 'mcu', array: null, number: null } }],
      },
      values: [
        { key: 'iron-man', name: 'Iron Man' },
        { key: 'thor', name: 'Thor' },
        { key: 'hulk', name: 'Hulk' },
        { key: 'black-widow', name: 'Black Widow' },
        { key: 'captain-america', name: 'Captain America' },
        { key: 'hawkeye', name: 'Hawkeye' },
      ],
    }, {
      dependentOn: {
        clause: 'AND',
        conditions: [{ attribute: 'SR-AVENG', op: 'eq', value: { type: 'STRING', string: 'great-lakes', array: null, number: null } }],
      },
      values: [
        { key: 'flatman', name: 'Flatman' },
        { key: 'big-bertha', name: 'Big Bertha' },
        { key: 'doorman', name: 'Doorman' },
        { key: 'mr-invincible', name: 'Mr. Invincible' },
        { key: 'good-boy', name: 'Good Boy' },
      ],
    }, {
      dependentOn: {
        clause: 'AND',
        conditions: [{ attribute: 'SR-AVENG', op: 'eq', value: { type: 'STRING', string: 'us-avengers', array: null, number: null } }],
      },
      values: [
        { key: 'citizen-v', name: 'Citizen V' },
        { key: 'red-hulk', name: 'Red Hulk' },
        { key: 'squirrel-girl', name: 'Squirrel Girl' },
        { key: 'cannonball', name: 'Cannonball' },
        { key: 'iron-patriot', name: 'Iron Patriot' },
        { key: 'enigma', name: 'Enigma' },
      ],
    }],
    dependencies: null,
  }, {
    required: true,
    type: 'STRING',
    code: 'SR-CAP',
    description: 'Which Captain America are you looking for?',
    dependencies: {
      clause: 'AND',
      conditions: [{ attribute: 'MR-WHO', op: 'in', value: { type: 'STRING', string: 'captain-america', array: null, number: null } }],
    },
    values: null,
    conditionalValues: null,
  }],
};

test('submitRequest', async () => {
  // We use a store to build up questions and such for us.
  const store = new AppStore();
  store.currentService = COSMIC_SERVICE;

  const requestForm = store.requestForm;
  requestForm.description = 'Things are bad';
  requestForm.contactInfo.firstName = 'Carol';
  requestForm.contactInfo.lastName = 'Danvers';
  requestForm.contactInfo.email = 'marvel@alphaflight.gov';

  requestForm.questions[0].value = 'Thanos is here';
  requestForm.questions[2].value = 'us-avengers';
  // This should get filtered to Squrrel Girl and Enigma
  requestForm.questions[3].value = ['thor', 'squirrel-girl', 'enigma'];
  // This should not appear at all because Captain America is not picked
  requestForm.questions[4].value = 'Danielle Cage';

  requestForm.mediaUrl = 'https://pbs.twimg.com/media/C22X9ODXgAABGKS.jpg';

  const loopbackGraphql = jest.fn().mockReturnValue({});

  await submitRequest(loopbackGraphql, {
    service: COSMIC_SERVICE,
    description: requestForm.description,
    contactInfo: requestForm.contactInfo,
    locationInfo: requestForm.locationInfo,
    questions: requestForm.questions,
    mediaUrl: requestForm.mediaUrl,
  });

  const mutationVariables: SubmitRequestMutationVariables = {
    code: 'CSMCINC',
    description: 'Things are bad',
    firstName: 'Carol',
    lastName: 'Danvers',
    email: 'marvel@alphaflight.gov',
    phone: '',
    address: '',
    location: null,
    mediaUrl: 'https://pbs.twimg.com/media/C22X9ODXgAABGKS.jpg',
    attributes: [
      { code: 'ST-CMTS', value: 'Thanos is here' },
      { code: 'SR-AVENG', value: 'us-avengers' },
      { code: 'MR-WHO', value: 'squirrel-girl' },
      { code: 'MR-WHO', value: 'enigma' },
    ],
  };

  expect(loopbackGraphql).toHaveBeenCalledWith(SubmitRequestGraphql, mutationVariables);
});
