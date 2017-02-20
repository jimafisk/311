// https://chime.social/

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import { makeStore } from '../data/store';

import Nav from '../components/common/Nav';
import LocationMap from '../components/common/LocationMap';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.store = makeStore();
  }

  render() {
    return (
      <Provider store={this.store}>
        <div>
          <Helmet
            link={[
              { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Lora:400,400i|Montserrat:400,700' },
              { rel: 'stylesheet', type: 'text/css', href: 'https://patterns.boston.gov/css/public.css' },
            ]}
            style={[
              { type: 'text/css', cssText: `
                /* Add any new styles here to storybook/head.html as well */
                body {
                  margin: 0;
                  padding: 0;
                  overflow-x: hidden;
                  font-family: Montserrat, Arial, sans-serif;
                }

                * {
                  box-sizing: border-box
                }
              ` },
            ]}
          />
          <Nav />
          <LocationMap />
          <Switch>
            <Route path="/" exact module="./report.js" />
            <Route path="/report/:code" module="./service.js" />
          </Switch>
        </div>
      </Provider>
    );
  }
}
