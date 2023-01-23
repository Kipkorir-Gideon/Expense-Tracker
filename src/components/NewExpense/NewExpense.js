import React, {useState} from "react";

import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const saveExpenseHandler = (expense) => {
    const expenseData = {
      ...expense,
      id: Math.random().toString()
    };
    props.onAdd(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  }

  const stopEditingHandler = () => {
    setIsEditing(false);
  }

  return (
    <div className="new-expense">
      {!isEditing && <button onClick={startEditingHandler}>Add New Expense</button>}
      {isEditing && <ExpenseForm onSave={saveExpenseHandler} onCancel={stopEditingHandler} />}
    </div>
  );
};

export default NewExpense;
