//Create a todo app that lets users store the todos on the server

const express = require('express')
const { log } = require('node:console')
const { todo } = require('node:test')

const {v4: uuidv4} = require('uuid')

const app = express() //THis must be always at the top if ain't the server crashes

// Parse JSON bodies (ESSENTIAL for POST/PUT requests)
app.use(express.json())

// Parse URL-encoded bodies (forms)
app.use(express.urlencoded({ extended: true }));


let todos = [
  {
    id: uuidv4(),
    text: 'Lets learn express',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

app.get('/todos', (req,res) => {
  res.send(todos)
})

app.post('/todos',(req,res) => {

  // 1. Get data from request body (express.json() already parsed it)
  const { text } = req.body

  // 2. Validate
  if(!text || text.trim() == ''){
    return res.status(400).json({error: 'todo is required'})
  }

  //create a new todo
  const newtodo = {
    id: uuidv4(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  }

  //Add to storage
  todos.push(newtodo)

  //respond with created todo
  res.status(200).json(newtodo)
})

app.put('/todos/:id', (req, res) => {
  // 1. Extract ID from URL params
  const { id } = req.params;
  
  // 2. Extract update data from request body
  const { text, completed } = req.body;
  
  // 3. Find the todo by ID
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  // 4. Check if todo exists
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // 5. Get the existing todo
  const existingTodo = todos[todoIndex];
  
  // 6. Update properties (keep existing values if not provided)
  const updatedTodo = {
    ...existingTodo,  // Keep all existing properties
    text: text !== undefined ? text.trim() : existingTodo.text,
    completed: completed !== undefined ? completed : existingTodo.completed,
    updatedAt: new Date().toISOString()  // Add timestamp
  };
  
  // 7. Validate text if it's being updated
  if (text !== undefined && (!text || text.trim() === '')) {
    return res.status(400).json({ error: 'Todo text cannot be empty' });
  }
  
  // 8. Replace the todo in the array
  todos[todoIndex] = updatedTodo;
  
  // 9. Return the updated todo
  res.status(200).json(updatedTodo);
});

app.delete('/todos/:id', (req, res) => {
  // 1. Extract ID from URL params
  const { id } = req.params;
  
  // 2. Find the todo index
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  // 3. Check if todo exists
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // 4. Get the todo before deleting (optional, for response)
  const deletedTodo = todos[todoIndex];
  
  // 5. Remove the todo from array
  todos.splice(todoIndex, 1);
  
  // 6. Return success response
  res.status(200).json({ 
    message: 'Todo deleted successfully',
    deletedTodo: deletedTodo  // Optional: return what was deleted
  });
});



app.listen(3000,() => {
  console.log(`Listening on PORT 3000`);
})
