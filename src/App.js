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
        <AttributesPanel
          attributes={attributes}
          onAttributeValueChange={changeAttributeValue}
        />
      </section>
      <section>
        <ClassesPanel attributes={attributes} />
      </section>
    </div>
  );
}

export default App;

const AttributesPanel = ({ attributes, onAttributeValueChange }) => {
  const calculateModifier = (value) => {
    if (value < 8) {
      return -2
    } else if (value < 9) {
      return -1
    } else {
      return Math.floor((value - 10) / 2)
    }
    
  }
  return (
    <>
      <h2>Attributes</h2>
      {Object.keys(attributes).map((attribute) => (
        <div key={attribute}>
          {attribute} Modifier({calculateModifier(attributes[attribute])}): {attributes[attribute]}
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
      ))}
    </>
  );
};

const ClassesPanel = ({ attributes }) => {
  const [classDisplayed, setClassDisplayed] = useState(null);

  const calculatedClasses = Object.keys(CLASS_LIST).map((name) => {
    let isSatisfied = true;
    Object.keys(attributes).forEach((attribute) => {
      if (attributes[attribute] < CLASS_LIST[name][attribute]) {
        isSatisfied = false;
      }
    });

    return {
      name,
      isSatisfied,
    };
  });

  return (
    <div>
      <h2>Classes</h2>
      {calculatedClasses.map((calculatedClass) => (
        <button
          key={calculatedClass.name}
          onClick={() => setClassDisplayed(calculatedClass.name)}
          style={{marginRight: 10, backgroundColor: calculatedClass.isSatisfied ? 'green' : 'red'}}
        >
          <div>
            {calculatedClass.name}:{" "}
            {calculatedClass.isSatisfied ? "Satisfied" : "Not Satisfied"}
          </div>
        </button>
      ))}
      {classDisplayed && (
        <div>
          <div>{JSON.stringify(CLASS_LIST[classDisplayed], null, 4)}</div>
          <button onClick={() => setClassDisplayed(null)}>
            Close class details
          </button>
        </div>
      )}
    </div>
  );
};
