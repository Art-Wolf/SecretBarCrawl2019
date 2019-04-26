import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Challenges.css";
import {config} from "../config";

export default class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.challenges();
  }

  challenges() {
    fetch(config.apiUrl + "challenges/", {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Challenges list: ', json)
            this.setState({ challenges: json })
            this.setState({ isLoading: false })
        });
  }

  renderChallengesList(challenges) {
    return [{}].concat(challenges).map(
      (challenge, i) =>
        i !== 0
          ? <LinkContainer
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
            >
              <ListGroupItem header={challenge.name.trim().split("\n")[0]}/>
            </LinkContainer>
          : ''
    );
  }

  renderChallenges() {
    return (
      <div className="challenges">
        {this.state.isLoading ? 'Loading challenges data...' : this.renderChallengesList(this.state.challenges)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <PageHeader>Challenges</PageHeader>
        {this.renderChallenges()}
      </div>
    );
  }
}
