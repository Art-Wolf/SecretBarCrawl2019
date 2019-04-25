import React, { Component } from "react";
import { PageHeader, ListGroup } from "react-bootstrap";
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
            this.setState({ isLoading: false })
            console.log('Teams list: ', json)
            this.setState({ teams: json })
        });
  }

  renderTeamsDetails() {
      return (
        <div>
          <PageHeader>Teams</PageHeader>
          <p>Stuff</p>
        </div>
      );
  }

  renderTeams() {
    return (
      <div className="team">
        {this.state.isLoading ? 'Data not loading...' : this.renderTeamsDetails()}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderTeams()}
      </div>
    );
  }
}
