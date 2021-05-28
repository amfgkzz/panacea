import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';
import './App.css';

// Components
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import UserLandingPage from '../user/UserLandingPage/UserLandingPage';
import CityPage from '../user/CityPage/CityPage';
import MedicationsPage from '../user/MedicationsPage/MedicationsPage';
import MapPage from '../user/MapPage/MapPage';
import AdminLandingPage from '../admin/AdminLandingPage/AdminLandingPage';
import CitiesPage from '../admin/CitiesPage/CitiesPage';
import CityFormPage from '../admin/CityFormPage/CityFormPage';
import OrganizationsPage from '../admin/OrganizationsPage/OrganizationsPage';
import OrganizationFormPage from '../admin/OrganizationFormPage/OrganizationFormPage';

class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            {/* User Pages */}
            <Route exact path="/" component={UserLandingPage}/>
            <Route exact path="/city/:cityName" component={CityPage}/>
            <Route exact path="/city/:cityName/medications" component={MedicationsPage}/>
            <Route exact path="/map/:cityName" component={MapPage}/>
            {/* "Not Found" Page if user attempts to search for a city not in the database */}
            {/* Admin Page */}
            <ProtectedRoute exact path="/admin" component={AdminLandingPage}/>
            <ProtectedRoute exact path="/cities" component={CitiesPage}/>
            <ProtectedRoute path="/cities/:cityName" component={CityFormPage}/>
            <ProtectedRoute exact path="/organizations" component={OrganizationsPage}/>
            <ProtectedRoute path="/organizations/:orgName/:id" component={OrganizationFormPage}/>
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
      </Router>
  )}
}

export default connect()(App);
