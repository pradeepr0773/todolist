import { useEffect, useState } from "react";

export default function Todo() {
    const [title,setTitle]=useState("");
    const [description,setdescription]=useState("");
    
    const [todos, setTodos]= useState([]);
    const [error, setError]= useState("");
    const [message, setMessage]= useState("");
    const [editId, setEditId]= useState(-1);

    //edit
    const [EditTitle,setEditTitle]=useState("");
    const [EditDescription,setEditDescription]=useState("");

    const apiUrl = "https://todolist-vwm1.onrender.com"
    const handleSubmit =()=>{
        setError("")
            if(title.trim() !== '' && description.trim() !== ''){
                fetch(apiUrl+"/todos", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({title, description })
                            }).then((res)=>{
                                if(res.ok){
                                    setTodos([...todos, {title, description}])
                                    setTitle("");
                                    setdescription("");
                                    setMessage("Item added successfully")
                                    setTimeout(()=>{
                                        setMessage("");
                                    },3000)
                                }else{
                                    setError("unable to create item");
                                }
                }).catch(()=>{
                    setError("unable to create item");
                })
                
            }
    }
useEffect(()=>{
    getItems()
},[])
    //get item
    const getItems =()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            setTodos(res)
        })
    }
const handleEdit = (item)=> {setEditId(item._id); setEditTitle(item.title); setEditDescription(item.description)}
const handleUpdate = () =>{
    setError("")
            if(EditTitle.trim() !== '' && EditDescription.trim() !== ''){
                fetch(apiUrl+"/todos/"+editId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({title:EditTitle, description:EditDescription })
                            }).then((res)=>{
                                if(res.ok){
                                    const updateTodos=todos.map((item)=>{
                                        if(item._id === editId){
                                            item.title = EditTitle;
                                            item.description = EditDescription;
                                            }
                                                return item;
                                    })
                                    setTodos(updateTodos)
                                    setEditTitle("");
                                    setEditDescription("");
                                    setMessage("Item Update successfully")
                                   
                                    setTimeout(()=>{
                                        setMessage("");
                                    },3000)
                                    setEditId(-1)
                                }else{
                                    setError("unable to create item");
                                }
                }).catch(()=>{
                    setError("unable to create item");
                })
                
            }
}

const handledelete =(id)=>{
    if(window.confirm('Are you want Delete?')){
        fetch(apiUrl+"/todos/"+id, {
            method: 'DELETE'
                })
                .then(()=>{
                  const updateTodos=  todos.filter((item)=> item._id !== id)
                  setTodos(updateTodos)
                })
    }
}
const handleEditCancel = ()=>{
    setEditId(-1)
}
  
    return ( <><div className="row p-3 text-li bg-secondary text-white  rounded-pill text-center">
        <h1>Mini Project for Todo Project with MERN Stack</h1>
    </div>
    <div className="row mt-3">
        <h3>Add Items</h3>
       {message && <p className="text-primary">{message} </p>}
        <div className="form-group d-flex gap-2">
        <input className="form-control" onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="Title "/>
        <input className="form-control" onChange={(e)=>setdescription(e.target.value)} type="text" placeholder="description "/>
            <button className="btn btn-dark " onClick={handleSubmit}>Submit</button>
        </div>
        {error &&<p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3  ">
        <h3>List Items</h3>
        <div className="col-md-6  overflow-auto  " style={{ height: '370px' }}>
        <ul  className="list-group ">
            {
                todos.map((item)=>
            <li className="list-group-item d-flex justify-content-between bg-secondary text-white  rounded align-item-center my-2   ">
                <div className="d-flex flex-column me-2">
                    {
                        editId === -1 || editId !== item._id ? <>
                             <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </>:<>
                        <div className="form-group d-flex gap-2">
                            <input className="form-control" onChange={(e)=>setEditTitle(e.target.value)}  value={EditTitle} type="text" placeholder="Title "/>
                             <input className="form-control" onChange={(e)=>setEditDescription(e.target.value)} value={EditDescription} type="text" placeholder="description "/>
            
                         </div>
                        </>
                    }
                  
                </div>
                <div className="d-flex gap-2">
                    { editId === -1 || editId !== item._id ?<button className="btn btn-primary rounded-circle " onClick={() => handleEdit(item)}>Edit</button>:<button className="btn btn-primary rounded-circle" onClick={handleUpdate}>Update</button>}
                    { editId === -1 ?  <button className="btn btn-danger rounded-circle" onClick={()=>handledelete(item._id)}>Delete</button>:  
                    <button className="btn btn-danger rounded-circle" onClick={handleEditCancel}>Cancel</button>}              
                </div>
            </li>
            )
        }
        </ul>
        </div>
    </div>
    </>
   
    );
}
