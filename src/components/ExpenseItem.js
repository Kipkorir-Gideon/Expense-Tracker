import './ExpenseItem.css';


function ExpenseIten() {
  return (
    <div className="expense-item">
      <div> 16 Dec 2022 </div> 
      <div className="expense-item__description">
        <h2> Fare </h2> 
        <div className="expense-item__price"> KES 80 </div>
      </div>
    </div>
  );
}

export default ExpenseIten;
