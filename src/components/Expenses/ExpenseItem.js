import React, { useState } from 'react';

import ExpenseDate from './ExpenseDate';
import Card from '../UI/Card';
import "./ExpenseItem.css";

const ExpenseIten = (props) => {
  const [title, setTitle] = useState(props.title);

  const handleClick = () => {
    setTitle('Updated!')
    console.log(title);
  }

  return (
    <Card className="expense-item">
      <ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2> {title} </h2>
        <div className="expense-item__price"> KES {props.amount} </div>
      </div>
      <button onClick={handleClick}>Change Title</button>
    </Card>
  );
}

export default ExpenseIten;
