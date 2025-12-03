import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseList from "../../components/Expense/ExpenseList";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import toast from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";

const Expense = () => {
   useUserAuth(); // This hook is your access key! It not only grabs user data but also checks your token, securely opening the door to the protected route (page) for you.

   const [expenseData, setExpenseData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
   });
   const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

   // Fetch Expense details
   const fetchExpenseDetails = async () => {
      if (loading) return;

      setLoading(true);

      try {
         const response = await axiosInstance.get(
            `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
         );

         if (response.data) {
            setExpenseData(response.data);
         }
      } catch (error) {
         console.error("Something went wrong. Please try again.", error);
      } finally {
         setLoading(false);
      }
   };

   const deleteExpense = async (id) => {
      try {
         await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

         toast.success("Expense detail deleted successfully");
         setOpenDeleteAlert({ show: false, data: null });
         fetchExpenseDetails();
      } catch (error) {
         console.error(
            "Error deleting expense:",
            error.response?.data?.message || error.message
         );
      }
   };

   const handleAddExpense = async (expense) => {
      const { category, amount, date, icon } = expense;

      if (!category.trim()) {
         toast.error("Category is required");
         return;
      }

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
         toast.error("Amount should be a valid number greater than 0");
         return;
      }

      if (!date) {
         toast.error("Date is required");
         return;
      }

      try {
         await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
            category,
            amount,
            date,
            icon,
         });

         setOpenAddExpenseModal(false);
         toast.success("Expense added successfully");
         fetchExpenseDetails();
      } catch (error) {
         toast.error(
            "Error adding expense:",
            error.response?.data?.message || error.message
         );
      }
   };

   const handleDownloadExpenseDetails = async () => {};

   useEffect(() => {
      fetchExpenseDetails();

      return () => {};
   }, []);

   return (
      <DashboardLayout>
         <div className="mx-auto my-5">
            <div className="grid grid-cols-1 gap-6">
               <div className="">
                  <ExpenseOverview
                     transactions={expenseData}
                     onAddExpense={() => setOpenAddExpenseModal(true)}
                  />
               </div>

               <ExpenseList
                  transactions={expenseData}
                  onDelete={(expenseId) => {
                     setOpenDeleteAlert({
                        show: true,
                        data: expenseId,
                     });
                  }}
                  onDownload={handleDownloadExpenseDetails}
               />

               <Modal
                  isOpen={openAddExpenseModal}
                  onClose={() => setOpenAddExpenseModal(false)}
                  title="Add Expense"
               >
                  <AddExpenseForm onAddExpense={handleAddExpense} />
               </Modal>
            </div>

            <Modal
               isOpen={openDeleteAlert.show}
               onClose={() => setOpenDeleteAlert({ show: false, data: null })}
               title="Delete Expense"
            >
               <DeleteAlert
                  content="Are you sure you want to delete this expense detail?"
                  onDelete={() => deleteExpense(openDeleteAlert.data)}
               />
            </Modal>
         </div>
      </DashboardLayout>
   );
};
export default Expense;
