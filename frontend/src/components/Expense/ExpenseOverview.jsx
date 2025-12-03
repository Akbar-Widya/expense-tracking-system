import { LuPlus } from "react-icons/lu"

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
         <div className="">
            <h5 className="text-lg">Expense Overview</h5>
            <p className="text-xs">
               Track your expense over time and analyze your spending habits
            </p>
         </div>

         <button className="card-btn" onClick={onAddExpense}>
            <LuPlus className="text-lg" />
            Add Expense
         </button>
      </div>
    </div>
  )
}
export default ExpenseOverview