// @flow

import React from 'react';
import { observable, action, autorun, untracked } from 'mobx';
import { observer } from 'mobx-react';
import { css } from 'glamor';

import type { AppStore } from '../../data/store';
import {
  HEADER_HEIGHT,
  MEDIA_LARGE,
  GRAY_100,
  CLEAR_FIX,
} from '../style-constants';

import LoadingIcons from '../common/LoadingIcons';
import RecentRequestRow from './RecentRequestRow';
import RecentRequestsSearchForm from './RecentRequestsSearchForm';

let Velocity;
if (typeof window !== 'undefined') {
  Velocity = require('velocity-animate');
}

const CONTAINER_STYLE = css({
  background: 'white',
  position: 'relative',

  [MEDIA_LARGE]: {
    width: '40%',
    maxWidth: '35rem',
    // lets us scroll a full height without the footer coming up. There's actually
    // a little slop because of the sticky header.
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  },

  ...CLEAR_FIX,
});

const SEARCH_CONTAINER_STYLE = css({
  display: 'none',
  borderBottom: `1px dashed ${GRAY_100}`,
  [MEDIA_LARGE]: {
    display: 'block',
  },
});

// While we would prefer to make this so that the loading spinner is vertically
// centered in the height of the empty search results area, that runs afoul of
// IE 10/11 flexbox behavior. To get the height of the empty area down to this
// element we need to flex: 1 on the column, but those browsers won't let a
// flex: 1 element grow its parent, so the column could never expand larger to
// accommodate search results.
const LOADING_CONTAINER_STYLE = css({
  marginTop: '10%',
  [MEDIA_LARGE]: {
    marginTop: '30%',
  },
});

const LOADING_WRAPPER_STYLE = css({
  display: 'flex',
  height: 120,
  marginBottom: 30,
  [MEDIA_LARGE]: {
    marginBottom: 200,
  },
});

export type Props = {|
  store: AppStore,
|};

@observer
export default class RecentRequests extends React.Component {
  props: Props;

  @observable.ref mainEl: ?HTMLElement = null;

  scrollSelectedIntoViewDisposer: ?Function;

  componentDidMount() {
    this.scrollSelectedIntoViewDisposer = autorun(this.scrollSelectedIntoView);
  }

  componentWillUnmount() {
    if (this.scrollSelectedIntoViewDisposer) {
      this.scrollSelectedIntoViewDisposer();
    }
  }

  @action.bound
  setMainEl(mainEl: ?HTMLElement) {
    this.mainEl = mainEl;
  }

  scrollSelectedIntoView = () => {
    // Keeps us from getting a dependency on props
    const { store } = untracked(() => Object.assign({}, this.props));
    const { belowMediaLarge } = store.ui;

    // don't scroll on mobile
    if (belowMediaLarge) {
      return;
    }

    const { selectedRequest, selectedSource } = store.requestSearch;

    if (selectedRequest && this.mainEl && selectedSource !== 'list') {
      const requestEl = this.mainEl.querySelector(
        `[data-request-id="${selectedRequest.id}"]`
      );
      if (Velocity && requestEl) {
        Velocity(requestEl, 'scroll', { offset: -HEADER_HEIGHT });
      }
    }
  };

  render() {
    const { store: { requestSearch, ui } } = this.props;
    const { results, loading, resultsQuery, query } = requestSearch;

    return (
      <div className={CONTAINER_STYLE} ref={this.setMainEl}>
        <div className={`p-a300 ${SEARCH_CONTAINER_STYLE.toString()}`}>
          <RecentRequestsSearchForm requestSearch={requestSearch} />
        </div>

        <h2 className="a11y--h">Search Results</h2>

        {results.length === 0 &&
          (loading || resultsQuery !== query) &&
          <div className={LOADING_CONTAINER_STYLE}>
            <div className={LOADING_WRAPPER_STYLE}>
              <LoadingIcons
                initialDelay={0}
                serverCompatible
                reduceMotion={ui.reduceMotion}
              />
            </div>
          </div>}

        {results.map(request =>
          <RecentRequestRow
            key={request.id}
            request={request}
            requestSearch={requestSearch}
            ui={ui}
          />
        )}

        {results.length === 0 &&
          !(loading || resultsQuery !== query) &&
          <div className="p-a300">
            <div className="t--intro">No results found</div>
            <div className="t--info">
              Try a different search term or move the map to search a different
              area.
            </div>
          </div>}
      </div>
    );
  }
}
