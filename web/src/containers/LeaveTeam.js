import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./CreateTeam.css";
import {config} from "../config";
import { Redirect } from 'react-router-dom'

export default class LeaveTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: false,
      id: props.match.params.id,
      memberId: props.match.params.memberId
    };
  }

   handleSubmit = async event => {
     event.preventDefault();

     this.setState({ isLoading: true });

     try {
        await this.leaveTeam({
          id: this.state.id,
          memberId: this.state.memberId
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  leaveTeam(team) {
    fetch(config.apiUrl + "teams/" + team.id + "/members/" + team.memberId, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify(team)
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            this.setState({ redirect: true })
            console.log('New Team info: ', json)
            this.setState({ team: json })
        });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={`/team/${this.state.id}`} />
    }
  }

  render() {
    return (
      <div className="Login">
        {this.renderRedirect()}
        <form onSubmit={this.handleSubmit}>
          <Button
            block
            bsSize="large"
            type="submit"
            >
            Leave Team
          </Button>
        </form>
      </div>
    );
  }
}
