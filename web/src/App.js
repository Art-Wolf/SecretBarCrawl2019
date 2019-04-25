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
              <LinkContainer to="/rules"><NavItem>Rules</NavItem></LinkContainer>
              <LinkContainer to="/teams"><NavItem>Teams</NavItem></LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes />
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Bars</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/bar/1"><NavItem>Bar 1</NavItem></LinkContainer>
              <LinkContainer to="/bar/2"><NavItem>Bar 2</NavItem></LinkContainer>
              <LinkContainer to="/bar/3"><NavItem>Bar 3</NavItem></LinkContainer>
              <LinkContainer to="/bar/4"><NavItem>Bar 4</NavItem></LinkContainer>
              <LinkContainer to="/bar/5"><NavItem>Bar 5</NavItem></LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default App;
