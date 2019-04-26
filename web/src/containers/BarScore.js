import React, { Component } from "react";
import { Panel, PageHeader, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./CreateTeam.css";
import {config} from "../config";
import { Redirect } from 'react-router-dom'

export default class BarScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: false,
      barId: props.match.params.id,
      teamId: props.match.params.teamId,
      betValue: '',
      betAllowed: true,
      scoreValue: '',
      noScore: true,
      awardedValue: ''
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
            this.setState({ isLoading: false })
            this.findScore()
        });
  }

  findScore() {
    if (this.state.team.scores) {
      for(var i = 0; i < this.state.team.scores.length; i++) {
        var obj = this.state.team.scores[i];

        if (obj.barId && obj.barId === this.state.barId) {
          console.log("Found Bar Bet: ", obj);
          if (obj.bet) {
            this.setState({betValue: obj.bet});
            this.setState({betAllowed: false});
          }

          if (obj.score) {
            this.setState({scoreValue: obj.submittedScore});
            this.setState({awardedValue: obj.score});
            this.setState({noScore: false});
          }
        }
      }
    }
  }

  validateBetForm() {
    return this.state.betAllowed;
  }


  validateBetSubmit() {
    if (!this.state.betAllowed) {
      return false;
    }

    if (this.state.betValue) {
      if (/^\d+$/.test(this.state.betValue)) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  validateScoreForm() {
    if (this.state.betValue.length > 0 ) {
      return true;
    }

    return false;
  }

  validateScoreSubmit() {
    if (this.state.betValue.length > 0 ) {
      if (!this.state.scoreValue) {
        return true;
      }
      if (this.state.scoreValue.length > 0) {
        if (/^\d+$/.test(this.state.scoreValue)) {
          return true;
        }
      }
    }

    return false;
  }

  handleChange = event => {
     this.setState({
       [event.target.id]: event.target.value
     });
   }

   handleBetSubmit = async event => {
     event.preventDefault();

     this.setState({ isLoading: true });

     try {
        await this.createBet({
          barId: this.state.barId,
          bet: this.state.betValue
        });
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleScoreSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
       await this.updateScore({
         barId: this.state.barId,
         score: this.state.scoreValue
       });
   } catch (e) {
     alert(e);
     this.setState({ isLoading: false });
   }
 }

  createBet(bet) {
    fetch(config.apiUrl + "teams/" + this.state.teamId + "/scores" , {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(bet)
        })
        .then((response) => {
            this.setState({ redirect: true })
        });
  }

  updateScore(score) {
    fetch(config.apiUrl + "teams/" + this.state.teamId + "/scores" , {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(score)
        })
        .then((response) => {
            this.setState({ redirect: true })
        });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={`/bar/${this.state.barId}`} />
    }
  }

  renderAwarded() {
    return (
      <div className="Award">
      <h2>Points</h2>
      <Panel>
        <Panel.Body>You've been awarded <b>{this.state.awardedValue}</b> points.</Panel.Body>
      </Panel>
      </div>
    );
  }

  render() {
    return (
      <div className="Login">
        <PageHeader>Submit Bar Score</PageHeader>
        {this.renderRedirect()}
        <form onSubmit={this.handleBetSubmit}>
          <FormGroup controlId="betValue" bsSize="large">
          <ControlLabel>Bet</ControlLabel>
          <FormControl
            autoFocus
            type="name"
            value={this.state.betValue}
            disabled={!this.validateBetForm()}
            onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateBetSubmit()}
            type="submit"
            >
            Set Bet
          </Button>
        </form>
        <form onSubmit={this.handleScoreSubmit}>
          <FormGroup controlId="scoreValue" bsSize="large">
          <ControlLabel>Score</ControlLabel>
          <FormControl
            type="name"
            value={this.state.scoreValue}
            disabled={!this.validateScoreForm()}
            onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateScoreSubmit()}
            type="submit"
            >
            Submit Score
          </Button>
        </form>

        { this.state.noScore ? '' : this.renderAwarded() }
      </div>
    );
  }
}
