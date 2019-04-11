import React, {Component} from 'react';
import {
  Button,
  Col,
  Collapse,
  Container,
  Jumbotron,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';

class App extends Component {
  constructor (props) {
    super (props);

    this.toggle = this.toggle.bind (this);
    this.state = {
      isOpen: false,
    };
  }
  toggle () {
    this.setState ({
      isOpen: !this.state.isOpen,
    });
  }
  render () {
    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Welcome to React</h1>
                <p>
                  <Button
                    tag="a"
                    color="success"
                    size="large"
                    href="http://reactstrap.github.io"
                    target="_blank"
                  >
                    View Reactstrap Docs
                  </Button>
                </p>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <Navbar fixed="bottom" color="dark" dark>
          <Nav pills fill justified>
            <NavItem>
              <NavLink href="#" active>Bar 1</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{color: '#fff'}}>Bar 2</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{color: '#fff'}}>Bar 3</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{color: '#fff'}}>Bar 4</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{color: '#fff'}}>Bar 5</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default App;
