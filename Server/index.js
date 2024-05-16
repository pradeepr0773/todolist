const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json())
app.use(cors())
//let todos = [];
//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description: String,
})

//creating model
const Todo = mongoose.model("Todo", todoSchema);

 // connection
 mongoose.connect("mongodb://localhost:27017/todos")
 .then(()=>{
    console.log("connected to db")
 })
 .catch(()=>{
    console.log("error")
 })

//create todo
app.post('/todos',async(req, res)=>{
    const {title, description}=req.body;
    //const newTodo ={
    //id:todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try{
    const newTodo = new Todo ({title, description})
    await newTodo.save()
    res.status(201).json(newTodo)
    }
    catch(err){ 
        console.log(error);
        res.status(500).json({message : error.message});
    }

})

//get all todos
app.get('/todos',async (req, res)=>{
    try{
       const todos = await Todo.find();
       res.json(todos);
    } catch(error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
   

})

//update
app.put("/todos/:id",async (req, res)=>{
    try{
    const {title, description}=req.body;
    const id = req.params.id;
    const updatedTodo=await Todo.findByIdAndUpdate(
        id,
        {title,description },
        {new : true}
    )
        if(!updatedTodo){
            return res.status(404).json({message :"todo not found"})
        }
    res.json(updatedTodo)
}catch{
    console.log(error);
    res.status(500).json({message : error.message});
}
})

//delete

app.delete("/todos/:id",async(req,res)=>{
    try{
    const id = req.params.id;
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
    } catch{
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

const port =3001;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    })