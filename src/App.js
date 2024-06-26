import { useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  const [num, setNum] = useState(0);
  
  const [attributes, setAttributes] = useState(() =>
    Object.fromEntries(ATTRIBUTE_LIST.map((attribute) => [attribute, 1]))
  );

  const changeAttributeValue = (attribute, value) => {
    setAttributes({ ...attributes, [attribute]: value });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      {/* <section className="App-section">
        <div>
          Value:
          {num}
          <button>+</button>
          <button>-</button>
        </div>
      </section> */}

      <section>
        <h2>Attributes</h2>
        <AttributesPanel
          attributes={attributes}
          onAttributeValueChange={changeAttributeValue}
        />
      </section>
    </div>
  );
}

export default App;

const AttributesPanel = ({ attributes, onAttributeValueChange }) => {
  return Object.keys(attributes).map((attribute) => (
    <div key={attribute}>
      {attribute}: {attributes[attribute]}
      <button
        onClick={() =>
          onAttributeValueChange(attribute, attributes[attribute] + 1)
        }
      >
        +
      </button>
      <button
        onClick={() =>
          onAttributeValueChange(attribute, attributes[attribute] - 1)
        }
      >
        -
      </button>
    </div>
  ));
};
