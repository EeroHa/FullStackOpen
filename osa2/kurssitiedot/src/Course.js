import React from "react";

const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  const parts = props.parts.map((part) => (
    <Part key={part.name} name={part.name} exercises={part.exercises} />
  ));
  return <div>{parts}</div>;
};

const Total = (props) => {
  const { parts } = props;
  const sum = parts.reduce((s, p) => s + p.exercises, 0);
  return <b>Total of {sum} exercises</b>;
};

const Course = (props) => {
  const { course } = props;
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
