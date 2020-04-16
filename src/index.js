import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
library.add(faBackspace);
const Display = props => {
  return (
    <div id="display" dangerouslySetInnerHTML={{ __html: props.toShow }}></div>
  );
};
const FigureKey = props => {
  return (
    <div className="keys figureKeys" id={props.id} onClick={props.onClick}>
      {props.figure}
    </div>
  );
};
const OperatorKey = props => {
  return (
    <div className="keys operatorKeys" id={props.id} onClick={props.onClick}>
      {props.inner}
    </div>
  );
};
const BackspaceKey = props => {
  return (
    <div className="keys" id="backspace" onClick={props.onClick}>
      <FontAwesomeIcon icon="backspace" />
    </div>
  );
};
const PointKey = props => {
  return (
    <div className="keys" id="decimal" onClick={props.onClick}>
      .
    </div>
  );
};
const ClearKey = props => {
  return (
    <div className="keys" id="clear" onClick={props.onClick}>
      C
    </div>
  );
};
class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ongoingInput: ["0"],
      accumulatedInput: ["0"],
      result: null,
      toShow: "0",
      EqualsKey: null,
      importedOnClickKey: null
    };
    this.figureKeysCreator = this.figureKeysCreator.bind(this);
    this.operatorKeysCreator = this.operatorKeysCreator.bind(this);
    this.onClickEquals = this.onClickEquals.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
    this.onClickRemoveLast = this.onClickRemoveLast.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  figureKeysCreator() {
    const keys = this.props.figureKeyIds.map(item => {
      return (
        <FigureKey
          id={item}
          figure={this.props.figureKeyIds.indexOf(item)}
          onClick={this.state.importedOnClickKey}
        />
      );
    });
    return keys;
  }
  operatorKeysCreator() {
    const keys = this.props.operatorKeyProperties.map(item => {
      return (
        <OperatorKey
          id={item.id}
          inner={item.inner}
          onClick={this.state.importedOnClickKey}
        />
      );
    });
    return keys;
  }
  onKeyDown(e) {
    for (let node of document.getElementsByClassName("keys")) {
      if (e.key === node.innerText) {
        node.click();
      }
    }
    if (e.key === "c" || e.keyCode === 27) {
      document.getElementById("clear").click();
    }
    if (e.keyCode === 8) {
      document.getElementById("backspace").click();
    }
    if (e.keyCode === 13) {
      document.getElementById("equals").click();
    }
  }
  componentDidMount() {
    import(/*webpackChunkName: 'equalsKey'*/ "./equal-key").then(equalsKey => {
      this.setState({ EqualsKey: equalsKey.default });
    });
    import(/*webpackChunkName: 'impOnClickKey'*/ "./on-click-key").then(
      impOnClickKey => {
        this.setState({
          importedOnClickKey: impOnClickKey.default.bind(this)
        });
      }
    );
    document.addEventListener("keydown", this.onKeyDown);
  }

  onClickEquals() {
    let calculations = this.state.accumulatedInput;
    calculations = calculations.join("");
    calculations = eval(calculations);
    calculations = Math.round(calculations * 100000) / 100000;
    this.setState(
      state => {
        return {
          toShow: state.result
        };
      },
      this.setState(state => {
        return {
          result: calculations
        };
      })
    );
  }
  onClickClear() {
    this.setState({
      ongoingInput: ["0"],
      accumulatedInput: ["0"],
      result: null,
      toShow: "0"
    });
  }
  onClickRemoveLast() {
    if (this.state.result !== null) {
      alert("can't apply it to a result");
      return;
    }
    if (this.state.accumulatedInput.length === 1) {
      document.getElementById("clear").click();
    } else {
      let correctedOngoingInput = this.state.ongoingInput.slice(
        0,
        this.state.ongoingInput.length - 1
      );
      let correctedAccumulatedInput = this.state.accumulatedInput.slice(
        0,
        this.state.accumulatedInput.length - 1
      );
      this.setState(
        state => {
          return {
            toShow: state.accumulatedInput.join("")
          };
        },
        this.setState(state => {
          return {
            ongoingInput: correctedOngoingInput,
            accumulatedInput: correctedAccumulatedInput
          };
        })
      );
    }
  }
  render() {
    return (
      <div id="calculator">
        {Display({ toShow: this.state.toShow })}
        <div id="allKeysContainer">
          <ClearKey onClick={this.onClickClear} />
          <BackspaceKey onClick={this.onClickRemoveLast} />

          {this.figureKeysCreator()}

          {this.operatorKeysCreator()}
          <PointKey onClick={this.state.importedOnClickKey} />
          {this.state.EqualsKey ? (
            <this.state.EqualsKey onClick={this.onClickEquals} />
          ) : (
            <p>there it goes</p>
          )}
        </div>
      </div>
    );
  }
}
const calculator = (
  <Project
    figureKeyIds={[
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine"
    ]}
    operatorKeyProperties={[
      { id: "divide", inner: "/" },
      { id: "multiply", inner: "*" },
      { id: "subtract", inner: "-" },
      { id: "add", inner: "+" }
    ]}
  />
);
ReactDOM.render(calculator, document.getElementById("for-react-content"));
