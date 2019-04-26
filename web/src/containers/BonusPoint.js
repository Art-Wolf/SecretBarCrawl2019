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
      teamId: props.match.params.teamId
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
    fetch(config.apiUrl + "challeneges/" + id, {
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
          bonusPoints: this.state.challenge.points
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
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="betValue" bsSize="large">
          <ControlLabel>Bet</ControlLabel>
          <FormControl
            autoFocus
            type="name"
            value={this.state.challenge.points}
            disabled=true
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
