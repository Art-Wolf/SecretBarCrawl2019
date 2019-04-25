import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./CreateTeam.css";
import {config} from "../config";
import { Redirect } from 'react-router-dom'

export default class CreateTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: false
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
        await this.createTeam({
          name: this.state.name
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createTeam(team) {
    fetch(config.apiUrl + "teams/", {
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
      return <Redirect to='/teams' />
    }
  }

  render() {
    return (
      <div className="Login">
        {this.renderRedirect()}
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Team Name</ControlLabel>
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
            Create Team
          </Button>
        </form>
      </div>
    );
  }
}
