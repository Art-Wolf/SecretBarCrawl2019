import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Bar.css";
import {config} from "../config";

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBarLoading: true,
      isTeamsLoading: true,
      id: props.match.params.id,
      teams: []
    };
  }

  componentDidMount() {
    this.bar(this.props.match.params.id)
    this.teams()
  }

  async componentDidUpdate(prevProps) {
    let storedId = this.state.id; // this is a reference, not a copy...
    if (storedId !== this.props.match.params.id) {
      try {
        await this.bar(this.props.match.params.id);
        let id = this.props.match.params.id;
        return this.setState({id});
      } catch (e) {
        alert(e);
      }
    }
  }

  bar(id) {
    fetch(config.apiUrl + "bars/" + id, {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            console.log('Bar info: ', json)
            this.setState({ bar: json })
            this.setState({ isBarLoading: false })
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
              to={`/bar/${this.state.id}/team/${team.id}`}
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

  renderBarDetails(id) {
      return (
        <div>
          <PageHeader>Bar: {this.state.bar ? this.state.bar.name : ''}</PageHeader>
          <p>{this.state.bar.rule ? this.state.bar.rule : 'Loading rules...' }</p>
          {this.renderTeams()}
        </div>
      );
  }

  renderBar() {
    return (
      <div className="bar">
        {this.state.isBarLoading ? '' : this.renderBarDetails(this.state.id)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderBar()}
      </div>
    );
  }
}
