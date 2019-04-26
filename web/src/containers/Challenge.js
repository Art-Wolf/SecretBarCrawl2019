import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Challenge.css";
import {config} from "../config";

export default class Challenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChallengeLoading: true,
      isTeamsLoading: true,
      id: props.match.params.id,
      teams: []
    };
  }

  componentDidMount() {
    this.challenge(this.props.match.params.id)
    this.teams()
  }

  async componentDidUpdate(prevProps) {
    let storedId = this.state.id; // this is a reference, not a copy...
    if (storedId !== this.props.match.params.id) {
      try {
        await this.challenge(this.props.match.params.id);
        let id = this.props.match.params.id;
        return this.setState({id});
      } catch (e) {
        alert(e);
      }
    }
  }

  challenge(id) {
    fetch(config.apiUrl + "challenges/" + id, {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            console.log('Challenge info: ', json)
            this.setState({ challenge: json })
            this.setState({ isChallengeLoading: false })
        });
  }

  teams() {
    fetch(config.apiUrl + "teams/", {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            console.log('Teams list: ', json)
            this.setState({ teams: json })
            this.setState({ isTeamsLoading: false })
        });
  }

  renderTeamsList(teams) {
    return [{}].concat(teams).map(
      (team, i) =>
        i !== 0
          ? <LinkContainer
              key={team.id}
              to={`/challenges/${this.state.id}/team/${team.id}`}
            >
              <ListGroupItem header={team.name.trim().split("\n")[0]}>
              </ListGroupItem>
            </LinkContainer>
          : ''
    );
  }

  renderTeams() {
    return (
      <div className="teams">
        {this.state.isTeamsLoading ? 'Loading teams...' : this.renderTeamsList(this.state.teams)}
      </div>
    );
  }

  renderChallengeDetails() {
      return (
        <div>
          <PageHeader>Challenege: {this.state.challenge ? this.state.challenge.name : ''}</PageHeader>
          <p>{this.state.challenge.description ? this.state.challenge.description : 'Loading challenge...' }</p>
          {this.renderTeams()}
        </div>
      );
  }

  renderChallenge() {
    return (
      <div className="bar">
        {this.state.isChallengeLoading ? 'Loading challenge details..' : this.renderChallengeDetails()}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderChallenge()}
      </div>
    );
  }
}
