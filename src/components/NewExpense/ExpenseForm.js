import React, { useState } from "react";

import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [isExpanded, setExpanded] = useState(false);

  // const [input, setInput] = useState({
  //   title: '',
  //   amount: '',
  //   date: '',
  // })

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
    // setInput({
    //   ...input,
    //   title: event.target.value,
    // })

    // setInput((prevState) => {
    //   return {
    //     ...prevState,
    //     title: event.target.value,
    //   }
    // })
  };

  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
    // setInput({
    //   ...input,
    //   amount: event.target.value,
    // })

    // setInput((prevState) => {
    //   return {
    //     ...prevState,
    //     amount: event.target.value,
    //   }
    // })
  };
  const dateChangeHandler = (event) => {
    setDate(event.target.value);
    // setInput({
    //   ...input,
    //   date: event.target.value,
    // })

    // setInput((prevState) => {
    //   return {
    //     ...prevState,
    //     date: event.target.value,
    //   }
    // })
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: title,
      amount: amount,
      date: new Date(date),
    };

    props.onSave(expenseData);
    setTitle("");
    setAmount("");
    setDate("");
  };

  const expandHandler = () => {
    setExpanded(true);
  };

  return (
    <form onSubmit={submitHandler}>
      {isExpanded && (
        <div>
          <div className="new-expense__controls">
            <div className="new-expense__control">
              <label>Title</label>
              <input type="text" value={title} onChange={titleChangeHandler} />
            </div>
            <div className="new-expense__control">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                min="0"
                onChange={amountChangeHandler}
              />
            </div>
            <div className="new-expense__control">
              <label>Date</label>
              <input
                type="date"
                value={date}
                min="2022-01-01"
                max="2024-12-31"
                onChange={dateChangeHandler}
              />
            </div>
          </div>

          <div className="new-expense__actions">
            <button type="submit">Add Expense</button>
          </div>
        </div>
      )}
      <div className="new-expense__actions">
        <button onClick={expandHandler}>
          Add New Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
