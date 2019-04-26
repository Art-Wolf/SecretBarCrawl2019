import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Bars.css";
import {config} from "../config";

export default class Bars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.bars();
  }

  bars() {
    fetch(config.apiUrl + "bars/", {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('Bars list: ', json)
            json.sort((a, b) => parseInt(a.id ? a.id  : 0) - parseInt(b.id ? b.id  : 0));
            this.setState({ bars: json })
            this.setState({ isLoading: false })
        });
  }

  renderBarsList(bars) {
    return [{}].concat(bars).map(
      (bar, i) =>
        i !== 0
          ? <LinkContainer
              key={bar.id}
              to={`/bar/${bar.id}`}
            >
              <ListGroupItem header={bar.name.trim().split("\n")[0]}/>
            </LinkContainer>
          : ''
    );
  }

  renderBars() {
    return (
      <div className="bars">
        {this.state.isLoading ? 'Loading bars data...' : this.renderBarsList(this.state.bars)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <PageHeader>Bars</PageHeader>
        {this.renderBars()}
      </div>
    );
  }
}
