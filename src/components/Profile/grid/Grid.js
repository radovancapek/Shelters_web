import React, { Component } from "react";
import "./Grid.scss";

class Grid extends Component {
  render() {
    return (
      <div className="container">
        <div className="block block--1">Header</div>
        <div className="block block--2">Small box 1</div>
        <div className="block block--3">Small box 2</div>
        <div className="block block--4">Small box 3</div>
        <div className="block block--5">Sidebar</div>
        <div className="block block--6">Main Content</div>
        <div className="block block--7">Footer</div>
      </div>
    );
  }
}

export default Grid;
