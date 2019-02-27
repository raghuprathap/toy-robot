import React, { Component } from "react";
import ActionView from "./components/ActionView";
import "./App.css";

const orientation = {
  NORTH: { x: 0, y: 1 },
  SOUTH: { x: 0, y: -1 },
  WEST: { x: -1, y: 0 },
  EAST: { x: 1, y: 0 }
};

const direction = {
  x: {
    "0": {
      y: {
        "1": "NORTH",
        "-1": "SOUTH"
      }
    },
    "1": {
      y: {
        "0": "EAST"
      }
    },
    "-1": {
      y: {
        "0": "WEST"
      }
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      location: null,
      facing: { x: 0, y: 0 },
      placed: false,
      actions: []
    };

    this.handlePress = this.handlePress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset(event) {
    this.setState({
      value: "",
      location: null,
      facing: { x: 0, y: 0 },
      placed: false,
      actions: []
    });
  }

  
  handlePress(event) {
    if (event.key === "Enter") {
      
      const inputLine = this.state.value.split(/[\s,]+/);
      
      var command = inputLine[0];
      if (command === "PLACE") {
        if (inputLine.length === 4) {
          const x = parseInt(inputLine[1], 10),
            y = parseInt(inputLine[2], 10),
            f = inputLine[3];
          const facing = orientation[f];
          
          if (x > -1 && x < 5 && y > -1 && y < 5 && facing) {
            this.setState({
              location: { x, y },
              facing,
              placed: true,
              actions: [...this.state.actions, `PLACE ${x},${y},${f}`]
            });
          }
        }
      }
      
      if (this.state.placed) {
        if (command === "MOVE") {
          const moveX = this.state.facing.x;
          const moveY = this.state.facing.y;
          // Make sure the robot won't fall off the table
          const nextX = this.state.location.x + moveX;
          const nextY = this.state.location.y + moveY;
          if (nextX > -1 && nextX < 5 && nextY > -1 && nextY < 5) {
            this.setState({
              location: { x: nextX, y: nextY },
              actions: [...this.state.actions, "MOVE"]
            });
          }
        } else if (command === "LEFT") {
          const x = this.state.facing.x;
          const y = this.state.facing.y;
          this.setState({
            facing: { x: -y, y: x },
            actions: [...this.state.actions, "LEFT"]
          });
        } else if (command === "RIGHT") {
          const x = this.state.facing.x;
          const y = this.state.facing.y;
          this.setState({
            facing: { x: y, y: -x },
            actions: [...this.state.actions, "RIGHT"]
          });
        } else if (command === "REPORT") {
          const location = this.state.location;
          var report = `Output: ${location.x},${location.y},${
            direction.x[this.state.facing.x.toString()].y[
              this.state.facing.y.toString()
            ]
          }`;
          this.setState({ actions: [...this.state.actions, "REPORT", report] });
        }
      }
      // Reset value in input
      this.setState({ value: "" });
    }
  }

  handleChange(event) {
    const value = event.target.value.toUpperCase();
    this.setState({ value });
  }

  render() {
    // Iterate through our actions to print to screen
    const actions = this.state.actions.map((elem, index) => (
      <ActionView key={index} value={elem} />
    ));

    return (
      <div className="container my-2">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h1 className="text-center">Toy Robot</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="input-group">
              <input
                onKeyPress={this.handlePress}
                onChange={this.handleChange}
                value={this.state.value}
                className="form-control"
                placeholder="Enter move here..."
              />
              {this.state.placed ? (
                <button
                  onClick={this.handleReset}
                  className="btn btn-danger btn-block mt-2"
                >
                  Reset
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {this.state.placed ? (
          <div className="row mt-2">
            <div className="col-md-8 offset-md-2">
              <ul className="list-group">{actions}</ul>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
