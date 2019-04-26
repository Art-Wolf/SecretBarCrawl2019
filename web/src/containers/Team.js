import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Team.css";
import {config} from "../config";

export default class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: props.match.params.id
    };
  }

  componentDidMount() {
    this.team(this.props.match.params.id);
  }

  async componentDidUpdate(prevProps) {
    let storedId = this.state.id; // this is a reference, not a copy...
    if (storedId !== this.props.match.params.id) {
      try {
        await this.team(this.props.match.params.id);
        let id = this.props.match.params.id;
        return this.setState({id});
      } catch (e) {
        alert(e);
      }
    }
  }

  team(id) {
    fetch(config.apiUrl + "teams/" + id, {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Team info: ', json)
            this.setState({ team: json })
            this.setState({ isLoading: false })
        });
  }

  renderTeamMembers(members, teamId) {
    return [{}].concat(members).map(
      (member, i) =>
        i !== 0
          ? <LinkContainer
              key={member.id}
              to={`/team/${teamId}/members/${member.id}`}
            >
              <ListGroupItem header={member.name.trim().split("\n")[0]}/>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to={`/team/${teamId}/join`}
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Join the Team
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderTeamDetails(team) {
    return (
      <div>
        <PageHeader>Team: {team.name}</PageHeader>
        <div className="members">
          {this.state.team.members ? this.renderTeamMembers(this.state.team.members, this.state.team.id): <LinkContainer
              key="new"
              to={`/team/${team.id}/join`}
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Join the Team
                </h4>
              </ListGroupItem>
            </LinkContainer>}
        </div>
      </div>
    );
  }

  renderTeam() {
    return (
      <div className="team">
        {this.state.isLoading ? 'Loading team data...' : this.renderTeamDetails(this.state.team)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderTeam()}
      </div>
    );
  }
}
