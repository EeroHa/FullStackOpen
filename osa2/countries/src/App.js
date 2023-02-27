import { useState, useEffect } from 'react';
import './index.css';
import countryService from './services/countries';

const Filter = (props) => {
  return (
    <form>
      <div>
        find countries
        <input value={props.value} onChange={props.onChange} />
      </div>
    </form>
  );
};

const Languages = (props) => {
  const { languages } = props;
  return (
    <div>
      {Object.values(languages).map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
};

const Country = (props) => {
  const { country } = props;
  return (
    <div>
      <h1 key={country.name.common}>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <Languages languages={country.languages} />
      <img src={country.flags.svg} alt="new" width={200} />
    </div>
  );
};

const ListCountry = (props) => {
  const { country, onClick } = props;
  return (
    <p>
      <li>{country.name.common}</li>
      <button onClick={onClick}>show</button>
    </p>
  );
};

const Countries = (props) => {
  const { countries, onClick } = props;
  if (countries.length === 1) {
    return (
      <div>
        {countries.map((country) => (
          <Country key={country.name.common} country={country} />
        ))}
      </div>
    );
  } else if (1 < countries.length && countries.length < 11) {
    return (
      <ul>
        {countries.map((country) => (
          <ListCountry
            key={country.name.common}
            country={country}
            onClick={() => onClick(country)}
          />
        ))}
      </ul>
    );
  } else if (countries.length === 0) {
    return <p>No matches, specify another filter</p>;
  } else {
    return <p>Too many matches, specify another filter</p>;
  }
};

const App = (props) => {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    countryService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  var countriesToShow = show
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  const handleSearchChange = (event) => {
    const val = event.target.value;
    setSearchInput(val);

    if (0 < countriesToShow.length < 11) {
      setShow(true);
    }
  };

  const onClickShowCountry = (country) => {
    setSearchInput(country.name.common);
  };

  return (
    <div>
      <h1>Countries</h1>
      <Filter value={searchInput} onChange={handleSearchChange} />
      <Countries countries={countriesToShow} onClick={onClickShowCountry} />
    </div>
  );
};

export default App;

