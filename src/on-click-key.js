export default function(e) {
  let inputting = this.state.ongoingInput;
  let inputAccumulator = this.state.accumulatedInput;
  if (/[/*\-+]/.test(e.target.innerText) && this.state.result !== null) {
    const output = this.state.result.toString().split("");
    let numberAndOperator = [...output, e.target.innerText];
    inputting = /*[...output, e.target.innerText]*/ numberAndOperator;
    inputAccumulator = /*[...output, e.target.innerText]*/ numberAndOperator;
    this.setState(
      state => {
        return {
          toShow: state.accumulatedInput.join("")
        };
      },
      this.setState(state => {
        return {
          accumulatedInput: inputAccumulator,
          ongoingInput: numberAndOperator,
          result: null
        };
      })
    );
  } else {
    //sets result to null if clicked no-operator
    if (/[/*\-+]/.test(e.target.innerText) == false) {
      this.setState(state => {
        return {
          result: null
        };
      });
    }
    //zeroes inputs if number goes immediately after result
    if (/[\d.]/.test(e.target.innerText) && this.state.result !== null) {
      inputting = ["0"];
      inputAccumulator = ["0"];
      this.setState({
        ongoingInput: ["0"],
        accumulatedInput: ["0"]
      });
    }
    //clear inputting on the beginning of number
    if (
      /[/*\-+]/.test(inputting[inputting.length - 1]) &&
      inputting.length > 1 &&
      /[\d.]/.test(e.target.innerText) //has '.' to be here?
    ) {
      if (/[.]/.test(e.target.innerText)) {
        inputting = ["0"];
        inputAccumulator = [...inputAccumulator, "0"];
        this.setState(state => {
          return {
            ongoingInput: inputting
          };
        });
      } else {
        inputting = [];
        this.setState(state => {
          return {
            ongoingInput: inputting
          };
        });
      }
    }
    //manages two points situation
    if (e.target.innerText === "." && inputting.includes(".")) {
      return /*alert('The number can contain only one decimal element "."')*/;
    }

    //manages first operator situation;
    if (
      (/[/*+]/.test(e.target.innerText) &&
        this.state.result === null &&
        inputting.length === 1 &&
        inputting[0] === "0") ||
      (/[/*+\-]/.test(e.target.innerText) &&
        this.state.result === null &&
        inputting.length === 2 &&
        inputting[0] === "0" &&
        inputting[1] === ".")
    ) {
      return alert("Put some number first");
    }
    //manages first operator situation with '-'
    if (
      inputting[0] === "-" &&
      inputting.length === 1 &&
      /[/*+]/.test(e.target.innerText)
    ) {
      return alert("Put the number first");
    }
    //manages multiply first zeroes
    if (
      inputting[0] === "0" &&
      inputting.length === 1 &&
      e.target.innerText !== "."
    ) {
      inputting = [];
      inputAccumulator.pop();
    }
    inputting = [...inputting, e.target.innerText];
    while (
      /[/*+\-]/.test(inputting[inputting.length - 1]) &&
      /[+\-]/.test(inputting[inputting.length - 2])
    ) {
      inputting.splice(inputting.length - 2, 1);
      let actualizedInputting = inputting;
      inputAccumulator.splice(inputAccumulator.length - 1);
      let actualizedInputAccumulator = inputAccumulator;
      this.setState(state => {
        return {
          ongoingInput: actualizedInputting,
          accumulatedInput: actualizedInputAccumulator
        };
      });
    }
    while (
      /[/*+]/.test(inputting[inputting.length - 1]) &&
      /[/*]/.test(inputting[inputting.length - 2])
    ) {
      inputting.splice(inputting.length - 2, 1);
      let actualizedInputting = inputting;
      inputAccumulator.splice(inputAccumulator.length - 1);
      let actualizedInputAccumulator = inputAccumulator;
      this.setState(state => {
        return {
          ongoingInput: actualizedInputting,
          accumulatedInput: actualizedInputAccumulator
        };
      });
    }
    inputAccumulator = [...inputAccumulator, e.target.innerText];

    this.setState(
      state => {
        return {
          toShow: state.accumulatedInput.join("")
        };
      },
      this.setState(
        state => {
          return {
            accumulatedInput: inputAccumulator
          };
        },
        this.setState(state => {
          return {
            ongoingInput: inputting
          };
        })
      )
    );
  }
}
