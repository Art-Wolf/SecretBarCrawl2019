import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Bar from "./containers/Bar";
import Team from "./containers/Team";
import Teams from "./containers/Teams";
import Rules from "./containers/Rules";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/rules" exact component={Rules} />
    <Route path="/teams" exact component={Teams} />
    <Route path="/team/:id" exact component={Team} />
    <Route path="/bar/:id" exact component={Bar} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
