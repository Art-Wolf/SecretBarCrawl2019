import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Teams.css";
import {config} from "../config";
import "./Home.css";

export default class Home extends Component {
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
            json.sort((a, b) => parseInt(b.totalScore ? b.totalScore  : 0) - parseInt(a.totalScore ? a.totalScore  : 0));
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
              <ListGroupItem
                header={team.name.trim().split("\n")[0]}
                bsStyle={ i == 1 ? team.totalScore ? 'warning': '' : ''}
                >
                <Badge>{team.totalScore ? team.totalScore : 0 }</Badge>
              </ListGroupItem>
            </LinkContainer>
          : ''
    );
  }

  renderTeams() {
    return (
      <div className="teams">
        {this.state.isLoading ? 'Loading teams...' : this.renderTeamsList(this.state.teams)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Fencing Alumni Secret Bar Crawl</h1>
          <p>Don't forget to check the challenges!</p>
          {this.renderTeams()}
        </div>
      </div>
    );
  }
}
