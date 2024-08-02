'use client'
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase";
import { Box, Button, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, getDocs, setDoc, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Update expenses from Firestore
  const updateExpenses = async () => {
    const snapshot = await getDocs(collection(firestore, 'expenses'));
    const expensesList = [];

    snapshot.forEach((doc) => {
      expensesList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setExpenses(expensesList);
  };

  // Add a new expense
  const addExpense = async () => {
    const trimmedName = expenseName.trim();
    const amount = parseFloat(expenseAmount);

    if (!trimmedName || isNaN(amount) || amount <= 0) {
      console.error("Invalid expense name or amount.");
      return;
    }

    const docRef = doc(collection(firestore, 'expenses'), trimmedName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newAmount = (data.amount || 0) + amount;
      await setDoc(docRef, { name: trimmedName, amount: newAmount });
    } else {
      await setDoc(docRef, { name: trimmedName, amount });
    }

    setExpenseName('');
    setExpenseAmount('');
    await updateExpenses();
  };

  // Remove an expense
  const removeExpense = async (id) => {
    await deleteDoc(doc(firestore, 'expenses', id));
    await updateExpenses();
  };

  useEffect(() => {
    updateExpenses();
  }, []);

  // Calculate the total amount spent
  const totalAmount = expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="black"
      color="white"
      padding={2}
    >
      <Typography variant="h2" marginBottom={2}>
        Expense Tracker
      </Typography>
      <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
        <TextField
          label="Expense Name"
          variant="outlined"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          sx={{ 
            input: { color: 'black' }, 
            label: { color: 'black' },
            bgcolor: 'white',
            borderRadius: 1
          }}
        />
        <TextField
          label="Amount"
          variant="outlined"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          sx={{ 
            input: { color: 'black' }, 
            label: { color: 'black' },
            bgcolor: 'white',
            borderRadius: 1
          }}
        />
        <Button
          variant="contained"
          onClick={addExpense}
        >
          +
        </Button>
      </Box>
      <Box 
        display="flex" 
        flexDirection="column" 
        gap={2} 
        marginTop={2} 
        width="100%" 
        maxWidth="600px"
        maxHeight="400px" // Set a max height to make the box scrollable
        overflow="auto"  // Enable scrolling when content overflows
      >
        {expenses.map(({ id, name, amount }) => (
          <Box
            key={id}
            display="flex"
            alignItems="center"
            bgcolor="#333"
            color="white"
            padding={1}
            borderRadius={1}
            boxShadow={2}
            width="100%"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unnamed Expense'}
            </Typography>
            <Typography variant="h6">
              ${amount.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => removeExpense(id)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
      <Box 
        position="absolute" 
        bottom={0} 
        width="100%" 
        bgcolor="#333" 
        padding={2} 
        display="flex" 
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5">
          Total Amount Spent: ${totalAmount.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
