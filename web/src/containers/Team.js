import React, { Component } from "react";
import { PageHeader, ListGroup } from "react-bootstrap";
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
            this.setState({ isLoading: false })
            console.log('Team info: ', json)
            this.setState({ team: json })
        });
  }

  renderTeamDetails(id) {
      return (
        <div>
          <PageHeader>Team: {this.state.team ? this.state.team.name : ''}</PageHeader>
          <p>Stuff</p>
        </div>
      );
  }

  renderTeam() {
    return (
      <div className="team">
        {this.state.isLoading ? 'No data to load...' : this.renderTeamDetails(this.state.id)}
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
