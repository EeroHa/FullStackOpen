import { useState, useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};

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
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const successNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const errorNotification = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

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
        personService
          .edit(p.id, newContact)
          .then(() => {
            const copy = persons.map((person) =>
              person.name !== newName ? person : newContact
            );
            setPersons(copy);
            successNotification(`Changed ${newName} number to ${newNumber}`);
          })
          .catch((error) => {
            errorNotification(
              `Error: ${error} when editing contact ${newName}`
            );
          });
      }
    } else {
      personService
        .create({
          name: newName,
          number: newNumber,
        })
        .then(() => {
          const copy = [...persons, { name: newName, number: newNumber }];
          setPersons(copy);
          successNotification(`Added ${newName} to contacts`);
        })
        .catch((error) => {
          errorNotification(`Error: ${error} when adding contact ${newName}`);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  const deleteContact = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          successNotification(`Deleted contact ${person.name}`);
        })
        .catch((error) => {
          errorNotification(
            `Error: ${error} when deleting contact ${person.name}`
          );
        });
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
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
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
