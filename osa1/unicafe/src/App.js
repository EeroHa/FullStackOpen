import { useState } from "react";

const Button = (props) => {
  const handleClick = props.handleClick;
  return <button onClick={handleClick}>{props.prompt}</button>;
};

const StatisticLine = (props) => {
  return (
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>
  );
};

const Statistics = (props) => {
  const sum = props.bad + props.neutral + props.good;
  const points = props.good - props.bad;
  if (sum > 0) {
    return (
      <div>
        <table>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={sum} />
          <StatisticLine text="average" value={points / sum} />
          <StatisticLine
            text="positive"
            value={(props.good / sum) * 100 + " %"}
          />
        </table>
      </div>
    );
  } else {
    return <div>No feedback given</div>;
  }
};

const App = () => {
  // tallenna napit omaan tilaansa
  let [good, setGood] = useState(0);
  let [neutral, setNeutral] = useState(0);
  let [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button prompt="good" handleClick={() => setGood((good += 1))}></Button>
      <Button
        prompt="neutral"
        handleClick={() => setNeutral((neutral += 1))}
      ></Button>
      <Button prompt="bad" handleClick={() => setBad((bad += 1))}></Button>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  );
};

export default App;
