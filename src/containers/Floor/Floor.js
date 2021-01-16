import React, { Component } from "react";
import Room from "../../components/Animals/Room/Room";

import "./Floor.scss";

class Floor extends Component {
  constructor() {
    super();
    this.state = {
      openedModal: 0,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  countFreeRooms = () => {
    this.countLeft = 0;
    this.countRight = 0;
    this.props.listOfRooms.left.forEach((object) => {
      if (object.freeBeds === object.beds) {
        this.countLeft = this.countLeft + 1;
      }
    });

    this.props.listOfRooms.right.forEach((object) => {
      if (object.freeBeds === object.beds) {
        this.countRight = this.countRight + 1;
      }
    });
    return this.countLeft + this.countRight;
  };

  handleOpenModal(index) {
    if (this.props.active) {
      this.setState({ openedModal: index });
      console.log(this.state);
    }
  }

  render() {
    return (
      <div
        className={this.props.active ? "Floor floor_opened" : "Floor"}
        onClick={this.props.onClick}
      >
        <div
          className={
            this.props.active ? "Floor_object object_opened" : "Floor_object"
          }
        >
          <div className="Floor_object_left">
            {this.props.listOfRooms.left.map((object, i) => (
              <Room
                available={object.freeBeds}
                beds={object.beds}
                key={i}
                index={i + "L"}
                opened={this.state.openedModal}
                onClick={() => this.handleOpenModal(i + "L")}
                filterBeds={this.props.filterBeds}
                filterAvailability={this.props.filterAvailability}
              />
            ))}
          </div>
          <div className="Floor_object_corridor"></div>
          <div className="Floor_object_right">
            {this.props.listOfRooms.right.map((object, i) => (
              <Room
                available={object.freeBeds}
                beds={object.beds}
                key={i}
                index={i + "R"}
                room={object}
                opened={this.state.openedModal}
                onClick={() => this.handleOpenModal(i + "R")}
                filterBeds={this.props.filterBeds}
                filterAvailability={this.props.filterAvailability}
              >
                {object.id}
              </Room>
            ))}
          </div>
        </div>
        <div
          className={
            this.props.active ? "Floor_text text_opened" : "Floor_text"
          }
        >
          {this.countFreeRooms()} volných pokojů
        </div>
      </div>
    );
  }
}

export default Floor;
