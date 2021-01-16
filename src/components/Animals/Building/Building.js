import React, { Component } from "react";
import Floor from "../../../containers/Floor/Floor";
import "./Building.scss";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import DataBuilding from "../../data/data";
import Chooser from "./Chooser";

class Building extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: [],
      dataBuilding: {},
      mounted: false,
      filterBeds: "",
      filterAvailability: "",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.isSomeStateActiv = this.isSomeStateActiv.bind(this);
    this.close = this.close.bind(this);

    //this.setState({ dataBuilding: DataBuilding.buildingA });
  }

  componentDidUpdate() {
    if (this.state.dataBuilding.id !== this.props.match.params.id) {
      this.setDataBuilding();
    }
    if (this.state.dataBuilding.floors) {
      const activList = [];
      this.state.dataBuilding.floors.map((floor, i) => {
        activList[i] = false;
        return true;
      });
      if (this.state.active.length === 0) {
        this.setState({ active: activList });
      }
    }
  }

  componentDidMount() {
    this.setDataBuilding();
    this.setState({ mounted: true });
  }

  setDataBuilding() {
    const building = DataBuilding.find(
      (building) => building.id === this.props.match.params.id
    );
    this.setState({ dataBuilding: building });
  }
  //   componentDidMount() {
  //     axios.get("adresa/building").then((response) => {
  //       this.setState({ data: response.data });
  //     });
  //     }

  handleClick(index) {
    this.close();
    let items = this.state.active.slice();
    items.forEach((item, i) => {
      if (i === index) {
        items[i] = true;
      } else {
        items[i] = false;
      }
    });
    this.setState({ active: items });
  }

  isSomeStateActiv() {
    let isActive = false;
    this.state.active.forEach((item) => {
      if (item === true) {
        isActive = true;
      }
    });
    return isActive;
  }

  close() {
    this.setState({
      active: [false, false, false, false, false],
    });
  }

  handleClickOutside(event) {
    this.close();
  }

  handleChooserCount(number) {
    this.setState({ filterBeds: number });
  }

  handleChooserAvailability(number) {
    this.setState({ filterAvailability: number });
  }

  render() {
    const mounted = this.state.mounted;
    let floorsDivs;

    const filterCountOfBeds = [
      { value: 1, label: "Jednolůžkový pokoj" },
      { value: 2, label: "Dvoulůžkový pokoj" },
      { value: 3, label: "Třílůžkový pokoj" },
    ];
    const filterAvailability = [
      { value: 0, label: "Volný" },
      { value: 1, label: "Částečně volný" },
      { value: 2, label: "Obsazený" },
    ];

    if (this.state.dataBuilding.floors) {
      floorsDivs = this.state.dataBuilding.floors.map((floor, i) => {
        return (
          <Floor
            onClick={() => this.handleClick(i)}
            active={this.state.active[i]}
            listOfRooms={floor}
            key={i}
            filterBeds={this.state.filterBeds}
            filterAvailability={this.state.filterAvailability}
          ></Floor>
        );
      });
    }

    return (
      <div className="Wrapper">
        <div className="Building">
          <div className="Building_title">Blok A</div>
          <div className="Chooser">
            <Chooser
              label="Počet lůžek"
              list={filterCountOfBeds}
              handle={(number) => this.handleChooserCount(number)}
            />
            <Chooser
              label="Obsazenost"
              list={filterAvailability}
              handle={(number) => this.handleChooserAvailability(number)}
            />
          </div>
          <div>
            {mounted ? (
              <ClickAwayListener onClickAway={this.handleClickOutside}>
                <div className="Building_floors">{floorsDivs}</div>
              </ClickAwayListener>
            ) : (
              <div>loading</div>
            )}
          </div>
        </div>
        {this.isSomeStateActiv()}
        {this.state.filter}
        <div className={this.isSomeStateActiv() ? "Opened" : null}></div>
        <div className="Building_hint">
          <div className="Building_hint_circle free" />
          <p>Volno</p>
          <div className="Building_hint_circle occupied" />
          <p>Z části volno</p>
          <div className="Building_hint_circle full" />
          <p>Obsazeno</p>
        </div>
      </div>
    );
  }
}

export default Building;
