import React, { Component } from "react";
import { PageHeader, ListGroup } from "react-bootstrap";
import "./Bar.css";
import {config} from "../config";

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: props.match.params.id
    };
  }

  componentDidMount() {
    this.bar(this.props.match.params.id);
  }

  async componentDidUpdate(prevProps) {
    let storedId = this.state.id; // this is a reference, not a copy...
    if (storedId !== this.props.match.params.id) {
      try {
        await this.bar(this.props.match.params.id);
        let id = this.props.match.params.id;
        return this.setState({id});
      } catch (e) {
        alert(e);
      }
    }
  }

  bar(id) {
    fetch(config.apiUrl + "bars/" + id, {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            this.setState({ isLoading: false })
            console.log('Bar info: ', json)
            this.setState({ bar: json })
            console.log('State: ', this.state)
        });
  }

  renderBarDetails(id) {
      return (
        <div>
          <PageHeader>Bar: {this.state.bar ? this.state.bar.name : ''}</PageHeader>
          <p>Stuff</p>
        </div>
      );
  }

  renderBar() {
    return (
      <div className="bar">
        {this.state.isLoading ? '' : this.renderBarDetails(this.state.id)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderBar()}
      </div>
    );
  }
}
