// @flow

import React from 'react';
import { css } from 'glamor';
import FormDialog from '../common/FormDialog';

import type { ServiceSummary, ServiceMetadata } from '../../server/services/Open311';

export type Props = {
  summary: ?ServiceSummary,
  metadata: ?ServiceMetadata,
}

const STYLE = {
  textTextarea: css({
    width: '100%',
    height: 180,
  }),
};

function getTitle(summary) {
  if (summary) {
    return summary.service_name;
  } else {
    return 'Service not found';
  }
}

function renderInformationalAttribute(attribute) {
  return (
    <p key={attribute.code}>{attribute.description}</p>
  );
}

function renderTextAttribute(attribute) {
  return (
    <label key={attribute.code}>
      <p>{attribute.description}</p>
      <textarea className={STYLE.textTextarea} />
    </label>
  );
}

function renderPicklistAttribute(attribute) {
  return (
    <label key={attribute.code}>
      <p>{attribute.description}</p>
      <select name={attribute.code}>
        {(attribute.values || []).map(({ key, name }) => <option value={key} key={key}>{name}</option>)}
      </select>
    </label>
  );
}

function renderAttribute(attribute) {
  switch (attribute.datatype) {
    case 'Informational':
      return renderInformationalAttribute(attribute);
    case 'Text':
      return renderTextAttribute(attribute);
    case 'Picklist':
      return renderPicklistAttribute(attribute);
    default:
      return null;
  }
}

function selectAttributes(metadata) {
  if (metadata && metadata.attributes) {
    return metadata.attributes;
  } else {
    return [];
  }
}

function renderContent(metadata) {
  if (metadata) {
    return <div> {selectAttributes(metadata).map(renderAttribute)} </div>;
  } else {
    return null;
  }
}

export default function ServiceFormDialog({ summary, metadata }: Props) {
  return (
    <FormDialog title={getTitle(summary)}>
      { renderContent(metadata) }
    </FormDialog>
  );
}
