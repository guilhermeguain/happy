import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Landing from './pages/Landing';
import Loading from './pages/Loading';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';
import EditOrphanage from './pages/EditOrphanage';
import DeleteOrphanage from './pages/DeleteOrphanage';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';

import { useAuth } from './contexts/auth';

const PrivateRoute = ({ component : Component, ...rest }: any) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <Route {...rest} render={props => (
      signed ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    )} />
  );
};

function Routes() { 
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/app" component={OrphanagesMap} />
        <Route path="/orphanages/create" component={CreateOrphanage} />
        <Route path="/orphanages/edit/:id" component={EditOrphanage} />
        <Route path="/orphanages/remove/:id" component={DeleteOrphanage} />
        <Route path="/orphanages/:id" component={Orphanage} />
        
        <Route path="/login" component={SignIn} />
        
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;