const express =require("express");
const mongoose=require("mongoose");
const cors=require("cors");
import TodoModel from  './models/Todo'

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/todoList")

app.post("/add",(req,res)=>{
    const newTodo=req.body.newTodo
    TodoModel.create({
        newTodo:newTodo
    })
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

app.listen(3001,()=>{
    console.log("server is running")
})