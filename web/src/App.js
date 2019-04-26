import React, { Component } from "react";
import "./App.css";
import Routes from "./Routes";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";


class App extends Component {
  render() {
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Secret Bar Crawl</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/bars"><NavItem>Bars</NavItem></LinkContainer>
              <LinkContainer to="/rules"><NavItem>Rules</NavItem></LinkContainer>
              <LinkContainer to="/challenges"><NavItem>Challenges</NavItem></LinkContainer>
              <LinkContainer to="/teams"><NavItem>Teams</NavItem></LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes />
      </div>
    );
  }
}

export default App;
