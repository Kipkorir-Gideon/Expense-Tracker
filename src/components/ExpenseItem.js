import './ExpenseItem.css';


function ExpenseIten(props) {

  return (
    <div className="expense-item">
      <div> {props.date.toISOString()} </div> 
      <div className="expense-item__description">
        <h2> {props.title} </h2> 
        <div className="expense-item__price"> KES {props.amount} </div>
      </div>
    </div>
  );
}

export default ExpenseIten;
