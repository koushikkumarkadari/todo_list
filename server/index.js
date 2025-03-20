import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import TodoModel from  './models/Todo.js'

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/todoList")

app.get("/get",(req,res)=>{
    TodoModel.find()
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

app.post("/add",(req,res)=>{
    const newTodo=req.body.newTodo
    TodoModel.create({
        newTodo:newTodo
    })
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

app.put('/update/:id',(req,res)=>{
    const {id}=req.params
    TodoModel.findByIdAndUpdate({_id:id},{done:true})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

app.delete('/delete/:id',(req,res)=>{
    const {id}=req.params
    TodoModel.findByIdAndDelete({_id:id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

app.put('/edit?:id',(req,res)=>{
    const{id}=req.params
    TodoModel.findByIdAndUpdate({_id:id},{newTodo:req.body.newTodo})
    .then(result=>res.json(result))
    .then(err=>err.json(err))
})

app.listen(3001,()=>{
    console.log("😎server is running✅")
})