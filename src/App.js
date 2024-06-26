import { useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  const [num, setNum] = useState(0);

  const [attributes, setAttributes] = useState(() =>
    Object.fromEntries(
      ATTRIBUTE_LIST.map((attribute) => [attribute, { value: 10, modifier: 0 }])
    )
  );

  const [skills, setSkills] = useState(() =>
    Object.fromEntries(
      SKILL_LIST.map((skill) => [
        skill.name,
        { attributeModifier: skill.attributeModifier, value: 0 },
      ])
    )
  );

  const totalAttributes = Object.keys(attributes).reduce(
    (acc, attribute) => acc + attributes[attribute].value,
    0
  );

  const changeAttributeValue = (attribute, value) => {
    const calculateModifier = (value) => {
      if (value < 8) {
        return -2;
      } else if (value < 9) {
        return -1;
      } else {
        return Math.floor((value - 10) / 2);
      }
    };

    if (Number(totalAttributes + 1) <= 70) {
      setAttributes({
        ...attributes,
        [attribute]: { value, modifier: calculateModifier(value) },
      });
    } else {
      alert("Please decrease one attribute. Max is 70")
    }
  };

  const changeSkillValue = (skill, value) => {
    setSkills({ ...skills, [skill]: { ...skills[skill], value } });
  };

  const saveData = async () => {
    await fetch("https://recruiting.verylongdomaintotestwith.ca/api/angeloald", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attributes,
        skills,
      }),
    })
    alert("Saved character data")
  }

  const loadData = async () => {
    const res = await fetch("https://recruiting.verylongdomaintotestwith.ca/api/angeloald")
    const data = res.json()
    setAttributes(data.attributes)
    setSkills(data.skills)
  }

  const maxSkillPoints = 10 + 4 * attributes["Intelligence"].modifier;

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
        <button onClick={loadData}>Load character</button>
        <button onClick={saveData}>Save character</button>
      </section>

      <section>
        <AttributesPanel
          attributes={attributes}
          onAttributeValueChange={changeAttributeValue}
        />
      </section>
      <section>
        <ClassesPanel attributes={attributes} />
      </section>
      <section>
        <SkillsPanel
          attributes={attributes}
          skills={skills}
          maxSkillPoints={maxSkillPoints}
          onSkillValueChange={changeSkillValue}
        />
      </section>
    </div>
  );
}

export default App;

const AttributesPanel = ({ attributes, onAttributeValueChange }) => {
  return (
    <>
      <h2>Attributes</h2>
      {Object.keys(attributes).map((attribute) => (
        <div key={attribute}>
          {attribute} Modifier({attributes[attribute].modifier}):
          {attributes[attribute].value}
          <button
            onClick={() =>
              onAttributeValueChange(attribute, attributes[attribute].value + 1)
            }
          >
            +
          </button>
          <button
            onClick={() =>
              onAttributeValueChange(attribute, attributes[attribute].value - 1)
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
          style={{
            marginRight: 10,
            backgroundColor: calculatedClass.isSatisfied ? "green" : "red",
          }}
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

const SkillsPanel = ({
  skills,
  attributes,
  maxSkillPoints,
  onSkillValueChange,
}) => {
  const [skillPointsConsumed, setSkillPointsConsumed] = useState(0);

  const addSkillPoint = (skill) => {
    setSkillPointsConsumed(skillPointsConsumed + 1);
    onSkillValueChange(skill, skills[skill].value + 1);
  };

  const removeSkillPoint = (skill) => {
    setSkillPointsConsumed(skillPointsConsumed - 1);
    onSkillValueChange(skill, skills[skill].value - 1);
  };

  return (
    <>
      <h2>Skills</h2>
      <p>Max skill points: {maxSkillPoints}</p>
      {Object.keys(skills).map((skill) => {
        return (
          <div key={skill}>
            {skill}: {skills[skill].value} (Modifier:{" "}
            {skills[skill].attributeModifier}):{" "}
            {attributes[skills[skill].attributeModifier].modifier}
            <button
              style={{ marginRight: 3 }}
              onClick={() => addSkillPoint(skill)}
            >
              +
            </button>
            <button
              style={{ marginRight: 3 }}
              onClick={() => removeSkillPoint(skill)}
            >
              -
            </button>
            total:{" "}
            {attributes[skills[skill].attributeModifier].modifier +
              skills[skill].value}
          </div>
        );
      })}
    </>
  );
};
