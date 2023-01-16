import React from "react";

import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {
  const saveExpenseHandler = (expense) => {
    const expenseData = {
      ...expense,
      id: Math.random().toString()
    };
    props.onAdd(expenseData);
  };

  return (
    <div className="new-expense">
      <ExpenseForm onSave={saveExpenseHandler} />
    </div>
  );
};

export default NewExpense;
