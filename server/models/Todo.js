const mongoose=require('mongoose')

const TodoSchema=new mongoose.Schema({
    newTodo:String,
})

const TodoModel=mongoose.model("todoList",TodoSchema)
export default TodoModel