import React, { Component } from "react";
// import PropTypes from "prop-types";
import "./Room.scss";
import Modal from "@material-ui/core/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class Room extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  openModal = () => {
    this.props.onClick();
    if (this.props.index === this.props.opened) {
      this.setState({ showModal: true });
    }
  };

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleRezervation() {
    alert("rezervovano");
  }

  render() {
    let room = null;
    const beds = this.props.beds - this.props.available;
    const filterBeds = this.props.filterBeds;
    const filterAvailability = this.props.filterAvailability;
    let availability;

    if (beds === 0) {
      room = <div className="free" onClick={this.openModal}></div>;
      availability = 0;
    } else if (0 < beds && beds < this.props.beds) {
      room = <div className="occupied" onClick={this.openModal}></div>;
      availability = 1;
    } else if (beds === this.props.beds) {
      room = <div className="full" onClick={this.openModal}></div>;
      availability = 2;
    }

    if (filterBeds !== "" && filterBeds !== this.props.beds) {
      room = <div className="filtred" />;
    }
    if (filterAvailability !== "" && filterAvailability !== availability) {
      room = <div className="filtred" />;
    }
    if (this.props.beds === undefined || this.props.available === undefined) {
      room = null;
    }

    return (
      <div className="default">
        {room}
        <Modal open={this.state.showModal} onClose={this.handleCloseModal}>
          <div className="modal">
            <div className="modal_header">
              <h4>Pokoj {this.props.id}</h4>
              <FontAwesomeIcon
                className="modal_header_close"
                icon={faTimes}
                onClick={this.handleCloseModal}
              />
            </div>
            <div className="modal_body">
              <p>info o pokoji</p>
              <p>cena pokoje</p>
              <p>obsazenost</p>
            </div>
            <div className="modal_footer">
              <button className="modal_button" onClick={this.handleCloseModal}>
                Zavřít
              </button>
              <button className="modal_button" onClick={this.handleRezervation}>
                Rezervovat
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

// Room.propTypes = {
//   available: PropTypes.isRequired,
// };

export default Room;
