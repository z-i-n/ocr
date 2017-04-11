import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../configureStore';
//import AsyncApp from './AsyncApp';
import App from '../components/App.js';
import Index from '../components/Index.js';
import NoMatch from '../components/NoMatch.js';
import Edit from '../components/edit/Edit.js';
import UploadImage from '../components/upload/UploadImage.js';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

export default class Root extends Component {

  componentDidMount() {
    // console.log("Root componentDidMount");
    // console.log(jQuery);
  }

  render() {
    return (
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={Index}/>
              <Route path="edit" component={Edit}/>
              <Route path="upload" component={UploadImage}/>
              <Route path="inbox" component={Inbox}>
                <Route path="messages/:id" component={Message} />
              </Route>
              <Route path="*" component={NoMatch}/>
            </Route>
          </Router>
        </Provider>
    );
  }
}

const About = React.createClass({
  render() {
    return <h3>About</h3>;
  }
});

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || 'Welcome to your Inbox'}
      </div>
    );
  }
});

const Message = React.createClass({
  render() {
    return <h3>Message {this.props.params.id}</h3>;
  }
});
