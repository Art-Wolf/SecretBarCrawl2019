import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Bars from "./containers/Bars";
import Bar from "./containers/Bar";
import BarScore from "./containers/BarScore";
import CreateTeam from "./containers/CreateTeam";
import JoinTeam from "./containers/JoinTeam";
import LeaveTeam from "./containers/LeaveTeam";
import Team from "./containers/Team";
import Teams from "./containers/Teams";
import Rules from "./containers/Rules";
import Challenges from "./containers/Challenges";
import Challenge from "./containers/Challenge";
import BonusPoint from "./containers/BonusPoint";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/rules" exact component={Rules} />

    <Route path="/challenges" exact component={Challenges} />
    <Route path="/challenges/:id" exact component={Challenge} />
    <Route path="/challenges/:id/team/:teamId" exact component={BonusPoint} />

    <Route path="/teams" exact component={Teams} />
    <Route path="/newteam" exact component={CreateTeam} />
    <Route path="/team/:id" exact component={Team} />
    <Route path="/team/:id/join" exact component={JoinTeam} />
    <Route path="/team/:id/members/:memberId" exact component={LeaveTeam} />

    <Route path="/bars" exact component={Bars} />
    <Route path="/bar/:id" exact component={Bar} />
    <Route path="/bar/:id/team/:teamId" exact component={BarScore} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
