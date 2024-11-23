import React from "react";
import ReactDOM from "react-dom";

export class Jam {
  root: any;

  constructor() {
    this.root = undefined;
  }

  init() {
    const root = document.getElementById("root");

    if (!root) {
      const jamRoot = document.createElement("div");
      jamRoot.id = "root";
      document.body.append(jamRoot);
    }

    // @ts-expect-error test
    const reactRoot = ReactDOM.createRoot(document.getElementById("root"));

    this.root = reactRoot;
  }

  render(component: React.FC, props: any) {
    this.root.render(React.createElement(component, props));
  }
}
