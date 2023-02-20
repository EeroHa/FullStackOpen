import { useState, useEffect } from "react";
import personService from "./services/persons";

const Person = (props) => {
  return (
    <p>
      {props.name} {props.number}{" "}
      <button onClick={props.deleteContact}>delete</button>
    </p>
  );
};

const Persons = (props) => {
  const personsToShow = props.persons;
  const deleteOnClick = props.deleteOnClick;
  return (
    <div>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          deleteContact={() => deleteOnClick(person)}
        />
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
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const submitDetails = (event) => {
    event.preventDefault();
    if (persons.some((p) => p.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace old number with a new one?`
        )
      ) {
        const p = persons.find((p) => p.name === newName);
        const newContact = { ...p, number: newNumber };
        personService.edit(p.id, newContact);
        const copy = persons.map((person) =>
          person.name !== newName ? person : newContact
        );
        setPersons(copy);
      }
    } else {
      personService.create({
        name: newName,
        number: newNumber,
      });
      const copy = [...persons, { name: newName, number: newNumber }];
      setPersons(copy);
    }
    setNewName("");
    setNewNumber("");
  };

  const deleteContact = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deletePerson(person.id);
      setPersons(persons.filter((p) => p.id !== person.id));
    }
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
      <Persons persons={personsToShow} deleteOnClick={deleteContact} />
    </div>
  );
};

export default App;
