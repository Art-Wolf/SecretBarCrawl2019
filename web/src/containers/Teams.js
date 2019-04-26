import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Teams.css";
import {config} from "../config";

export default class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.teams();
  }

  teams() {
    fetch(config.apiUrl + "teams/", {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Teams list: ', json)
            this.setState({ teams: json })
            this.setState({ isLoading: false })
        });
  }

  renderTeamsList(teams) {
    return [{}].concat(teams).map(
      (team, i) =>
        i !== 0
          ? <LinkContainer
              key={team.id}
              to={`/team/${team.id}`}
            >
              <ListGroupItem header={team.name.trim().split("\n")[0]}/>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/newteam"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new Team
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderTeams() {
    return (
      <div className="teams">
        {this.state.isLoading ? 'Loading teams data...' : this.renderTeamsList(this.state.teams)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <PageHeader>Teams</PageHeader>
        {this.renderTeams()}
      </div>
    );
  }
}
