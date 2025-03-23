import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from './models/Todo.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/todoList")

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.send('Signup successful');
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).send('Signup failed');
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Log username

    try {
        const user = await User.findOne({ username });
       

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const expiresIn = '1h';
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn });
        res.json({
            message: 'Login successful',
            token,
            expiresIn,
        });
    } catch (error) {
        console.error('Login error:', error); // Log the entire error object
        res.status(500).json({ message: 'Login failed', error: error.message }); //send error message to the front end.
    }
});
  app.get("/get/:username",authenticateToken, async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.todoList);
    } catch (err) {
      console.error("Error getting todos:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/add/:username",authenticateToken, async (req, res) => {
    const { username } = req.params;
    const { newTodo } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.todoList.push({ newTodo: newTodo });
      await user.save();
      res.json(user.todoList);
    } catch (err) {
      console.error("Error adding todo:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

app.put('/update/:username/:id',authenticateToken, async (req, res) => {
  const { username, id } = req.params;
  const { done } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const todo = user.todoList.id(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    todo.done = done;
    await user.save();
    res.json(user.todoList);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete('/delete/:username/:id',authenticateToken, async (req, res) => {
    const { username, id } = req.params;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.todoList.id(id).deleteOne();
      await user.save();
      res.json(user.todoList);
    } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put('/edit/:username/:id',authenticateToken, async (req, res) => {
    const { username, id } = req.params;
    const { newTodo } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const todo = user.todoList.id(id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      todo.newTodo = newTodo;
      await user.save();
      res.json(user.todoList);
    } catch (err) {
      console.error("Error editing todo:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
const port=process.env.PORT || 3001
app.listen(port,()=>{
    console.log("😎server is running✅")
})