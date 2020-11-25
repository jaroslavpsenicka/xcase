import React from "react";
import ReactWebComponent from 'react-web-component';
import {
  MemoryRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

const Hello = () => (
    <div>Hello from React World, <Link to="/detail">see more</Link>.</div>
)

const Detail = (id) => (
  <div>This is the detail, <Link to="/">get back</Link>.</div>
)

const App = withRouter(({ history }) => (
  <div>
    <Route exact path="/" component={Hello}/>
    <Route path="/detail" component={Detail}/>
  </div>
))

class RouteContainer extends React.Component {
  render() {
    return (
      <Router>
        <App />
      </Router>
    )
  }
}

ReactWebComponent.create(<RouteContainer />, "xhypo-create", false);