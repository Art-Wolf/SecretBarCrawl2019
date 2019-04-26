import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";
import "./Rules.css";

export default class Rules extends Component {
  render() {
    return (
      <div className="Home">
          <PageHeader>General Scoring Rules</PageHeader>
              <ul>
                <li>At the beginning of each Bar, each team wagers a cap on the amount of points they wish to drink.</li>
                <li>Caps must be given before starting to drink</li>
                <li>If a team drinks over their point cap, no additional points are awarded</li>
                <li>If a team fails to make their point cap, the amount of points will be cut in half, rounding down</li>
                <li>Each bar has a special drink rule that will double your points per drink</li>
                <li>A normal drink is 1pt, this is any single serving drink including water and non-alcoholic drinks (Hydrate before you die-drate!).</li>
                <li>Mixed drinks with multiple shots in them count double.</li>
                <li>A “special” drink is 2pts</li>
                <li>Pitchers are worth 6pts</li>
                <li>Record your points on the site at the end of each bar!</li>
              </ul>
      </div>
    );
  }
}
