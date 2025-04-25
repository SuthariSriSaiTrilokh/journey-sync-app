
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTrip } from '../../contexts/TripContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { 
  DollarSign, 
  PlusCircle, 
  User, 
  CalendarIcon, 
  X,
  PieChart
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Expenses: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip, addExpense } = useTrip();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Find the trip with the given ID
  const trip = tripId ? trips.find((t) => t.id === tripId) : currentTrip;

  if (!trip || !user) {
    return <div>Trip not found</div>;
  }

  const handleAddExpense = () => {
    if (!expenseName || !expenseAmount) {
      toast({
        title: 'Error',
        description: 'Please provide a name and amount for the expense.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Ensure at least one member is selected to split with
      const splitWith = selectedMembers.length > 0
        ? trip.members.filter(member => selectedMembers.includes(member.id))
        : trip.members;

      const newExpense = {
        name: expenseName,
        description: expenseDescription,
        amount: parseFloat(expenseAmount),
        date: expenseDate,
        paidBy: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        splitWith
      };

      addExpense(newExpense);
      
      toast({
        title: 'Success',
        description: 'Expense added successfully.',
      });
      
      // Reset form
      setExpenseName('');
      setExpenseDescription('');
      setExpenseAmount('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setSelectedMembers([]);
      setShowAddExpenseModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Calculate total expenses
  const totalExpenses = trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate expenses by person
  const expensesByPerson = trip.expenses.reduce((acc, expense) => {
    const paidById = expense.paidBy.id;
    if (!acc[paidById]) {
      acc[paidById] = {
        name: expense.paidBy.name,
        avatar: expense.paidBy.avatar,
        total: 0
      };
    }
    acc[paidById].total += expense.amount;
    return acc;
  }, {} as Record<string, { name: string; avatar?: string; total: number }>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">{trip.name} - Expenses</h2>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Expense
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Number of Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{trip.expenses.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average per Person</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ${(totalExpenses / trip.members.length).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Expenses by Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(expensesByPerson).map(([personId, data]) => (
                  <div key={personId} className="bg-tripmates-lightGray rounded-lg p-4 flex items-center">
                    <div className="mr-3">
                      <div className="friend-avatar">
                        {data.avatar ? (
                          <img src={data.avatar} alt={data.name} className="w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            {data.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{data.name}</p>
                      <p className="text-lg font-bold">${data.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">All Expenses</h3>
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={24} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-6">Add your first expense to start tracking costs.</p>
                <button 
                  onClick={() => setShowAddExpenseModal(true)}
                  className="btn-primary flex items-center mx-auto"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Expense
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid By
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Split With
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trip.expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{expense.name}</div>
                          {expense.description && (
                            <div className="text-sm text-gray-500">{expense.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="friend-avatar-sm mr-2">
                              {expense.paidBy.avatar ? (
                                <img src={expense.paidBy.avatar} alt={expense.paidBy.name} className="w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                  {expense.paidBy.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            {expense.paidBy.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex -space-x-2">
                            {expense.splitWith.slice(0, 3).map((person) => (
                              <div key={person.id} className="friend-avatar-sm ring-2 ring-white">
                                {person.avatar ? (
                                  <img src={person.avatar} alt={person.name} className="w-full h-full" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                    {person.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            ))}
                            {expense.splitWith.length > 3 && (
                              <div className="friend-avatar-sm bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium">
                                +{expense.splitWith.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Add Expense</h2>
              <button 
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="expense-name" className="block text-sm font-medium text-gray-700">
                    Expense Name
                  </label>
                  <input
                    id="expense-name"
                    type="text"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                    placeholder="Dinner, Museum tickets, etc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <input
                    id="expense-description"
                    type="text"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                    placeholder="Add details about this expense"
                  />
                </div>
                
                <div>
                  <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="expense-amount"
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="expense-date"
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="block w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split with
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {trip.members.map((member) => (
                      <div 
                        key={member.id}
                        className={`p-2 border rounded-md cursor-pointer flex items-center ${
                          selectedMembers.includes(member.id) ? 'bg-tripmates-lightBlue border-tripmates-blue' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleMemberSelection(member.id)}
                      >
                        <div className="friend-avatar-sm mr-2">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedMembers.length === 0 
                      ? "If no one is selected, the expense will be split with all members." 
                      : `Selected ${selectedMembers.length} of ${trip.members.length} members.`
                    }
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddExpense}
                  className="btn-primary flex justify-center"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Expenses;
