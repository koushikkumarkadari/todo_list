const mongoose=require("mongoose")


const TodoSchema=new mongoose.Schema({
    newTodo:String,
    done:{
        type:Boolean,
        default:false
    },
})

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todoList:[TodoSchema]
  });
  
const User = mongoose.model('User', userSchema);
module.exports=User