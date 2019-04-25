import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./CreateTeam.css";
import {config} from "../config";
import { Redirect } from 'react-router-dom'

export default class JoinTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: false,
      id: props.match.params.id
    };
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  handleChange = event => {
     this.setState({
       [event.target.id]: event.target.value
     });
   }

   handleSubmit = async event => {
     event.preventDefault();

     this.setState({ isLoading: true });

     try {
        await this.joinTeam({
          id: this.state.id,
          name: this.state.name
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  joinTeam(team) {
    fetch(config.apiUrl + "teams/" + team.id + "/members", {
            method: 'POST',
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
          <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Member Name</ControlLabel>
          <FormControl
            autoFocus
            type="name"
            value={this.state.name}
            onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            >
            Join Team
          </Button>
        </form>
      </div>
    );
  }
}
