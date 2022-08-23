import React, { Component } from "react";
import Quagga from "@ericblade/quagga2";

function getMedian(arr) {
  arr.sort((a, b) => a - b);
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) {
    return arr[half];
  }
  return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
  const errors = decodedCodes
    .filter((x) => x.error !== undefined)
    .map((x) => x.error);
  const medianOfErrors = getMedian(errors);
  return medianOfErrors;
}

class Scanner extends Component {
  componentDidMount() {
    console.log('mounted');
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            target: this.props.scannerRef.current,
            facingMode: "environment" // or user
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 0,
        decoder: {
          readers: ["ean_reader", "code_128_reader"]
        },
        locate: true
      },
      function (err) {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this._errorCheck);
    Quagga.onProcessed(function (result) {
      // console.log("onprocessed called");
      // var drawingCtx = Quagga.canvas.ctx.overlay,
      //   drawingCanvas = Quagga.canvas.dom.overlay;
      // if (result) {
      //   if (result.boxes) {
      //     drawingCtx.clearRect(
      //       0,
      //       0,
      //       parseInt(drawingCanvas.getAttribute("width")),
      //       parseInt(drawingCanvas.getAttribute("height"))
      //     );
      //     result.boxes
      //       .filter(function (box) {
      //         return box !== result.box;
      //       })
      //       .forEach(function (box) {
      //         Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
      //           color: "green",
      //           lineWidth: 2
      //         });
      //       });
      //   }
      //   if (result.box) {
      //     Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
      //       color: "blue",
      //       lineWidth: 2
      //     });
      //   }
      //   if (result.codeResult && result.codeResult.code) {
      //     Quagga.ImageDebug.drawPath(
      //       result.line,
      //       { x: "x", y: "y" },
      //       drawingCtx,
      //       { color: "red", lineWidth: 3 }
      //     );
      //   }
      // }
    });
  }
  componentWillUnmount() {
    console.log('unmounted');
    Quagga.offDetected(this._onDetected);
  }
  _errorCheck = (result) => {
    const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
    // if Quagga is at least 75% certain that it read correctly, then accept the code.
    if (err < 0.25) {
      this._onDetected(result);
    }
  };
  _onDetected = (result) => {
    this.props.onDetected(result);
  };
  render() {
    return (
      <div
        id="interactive"
        style={{ width: "640px", height: "240px" }}
        className="viewport"
      />
    );
  }
}
export default Scanner;
