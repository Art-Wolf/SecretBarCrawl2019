import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./CreateTeam.css";
import {config} from "../config";
import { Redirect } from 'react-router-dom'

export default class BonusPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isTeamLoading: true,
      isChallengeLoading: true,
      redirect: false,
      challengeId: props.match.params.id,
      teamId: props.match.params.teamId,
      points: ''
    };
  }

  componentDidMount() {
    this.team(this.props.match.params.teamId);
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
            this.setState({ isTeamLoading: false })
            this.findScore()
        });
  }

  challenge(id) {
    fetch(config.apiUrl + "challenges/" + id, {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Challenge info: ', json)
            this.setState({ challenge: json })
            this.setState({ isChallengeLoading: false })
        });
  }

  validateForm() {
    return this.state.points.length > 0;
  }

  handleChange = event => {
     this.setState({
       [event.target.id]: event.target.value
     });
   }

   handleSubmit = async event => {
     event.preventDefault();

     this.setState({ isChallengeLoading: true });

     try {
        await this.addBonusPoints({
          challengeId: this.state.challengeId,
          bonusPoints: this.state.points
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  addBonusPoints(bonusPoints) {
    fetch(config.apiUrl + "teams/" + this.state.teamId + "/bonuspoints" , {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(bonusPoints)
        })
        .then((response) => {
            this.setState({ redirect: true })
        });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={`/challenges/${this.state.challengeId}`} />
    }
  }

  renderSubmitButton() {
    return (
      <Button
        block
        bsSize="large"
        disabled={!this.validateForm()}
        type="submit"
        >
        Add Bonus Points
      </Button>
    );
  }
  renderBPDetails() {
    return (
      <div className="Login">
        {this.renderRedirect()}
        <p>This challenge is worth <b>{this.state.challenge.points}</b>.</p>
        <p>How many points did your team earn?</p>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="points" bsSize="large">
          <ControlLabel>Bet</ControlLabel>
          <FormControl
            autoFocus
            type="points"
            value={this.state.points}
            onChange={this.handleChange}
            />
          </FormGroup>
          {this.state.isTeamLoading ? '' : this.renderSubmitButton()}
        </form>
      </div>
    );
  }
  renderChallenge() {
    return (
      <div className="bonusPoint">
        {this.state.isChallengeLoading ? 'Loading bonus point details...' : this.renderBPDetails()}
      </div>
    );
  }

  render() {
    return (
      <div className="Login">
        {this.renderChallenge()}
      </div>
    );
  }
}
