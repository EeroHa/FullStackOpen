import { useState } from "react";

const Person = (props) => {
  return (
    <p>
      {props.name} {props.number}
    </p>
  );
};

const Persons = (props) => {
  const personsToShow = props.persons;
  return (
    <div>
      {personsToShow.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

const Filter = (props) => {
  return (
    <form>
      <div>
        filter shown with
        <input value={props.value} onChange={props.onChange} />
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAll, setShowAll] = useState(true);

  const submitDetails = (event) => {
    event.preventDefault();
    if (persons.some((p) => p.name === newName)) {
      window.alert(`${newName} is already added to phonebook`);
      return;
    }
    const copy = [...persons, { name: newName, number: newNumber }];
    setPersons(copy);
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    const val = event.target.value;
    setSearchInput(val);
    setShowAll(val === "");
  };

  const personsToShow = showAll
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(searchInput.toLowerCase())
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <h3>add a new contact</h3>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={submitDetails}>
            add
          </button>
        </div>
      </form>
      <h3>Contacts</h3>
      <Filter value={searchInput} onChange={handleSearchChange} />
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
