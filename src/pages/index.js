import React, { Component } from "react";
import ReactDOM from "react-dom";
import Scanner from "../components/Scanner";
import Result from "../components/ScanResult";
import "../styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.scannerRef = React.createRef();
  }
  state = {
    scanning: false,
    results: []
  };

  _scan = () => {
    console.log("scanning")
    this.setState({ scanning: !this.state.scanning });
  };

  _onDetected = (result) => {
    console.log('detected');
    this.setState({
      results: this.state.results.concat([result]),
      scanning: false
    });
  };

  render() {
    return (
      <div>
        <button onClick={this._scan}>
          {this.state.scanning ? "Stop" : "Start"}
        </button>
        <ul className="results">
          <Result results={this.state.results} />
        </ul>
        <div ref={this.scannerRef}>
          <div className="anim-box">
            <div></div>
            <div className="scanner"></div>

            <Scanner
              scannerRef={this.scannerRef}
              onDetected={this._onDetected}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
