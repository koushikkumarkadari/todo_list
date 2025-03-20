const mongoose=require("mongoose")


const TodoSchema=new mongoose.Schema({
    newTodo:String,
    done:{
        type:Boolean,
        default:false
    },
})

const TodoModel=mongoose.model("todoList",TodoSchema)
module.exports=TodoModel