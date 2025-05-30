import React, { useEffect, useState } from 'react';
import {useParams,useLocation} from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Login from './Login';
//This page becomes available, once you are registered as an event organizer
//
interface Event{

    name:string;
    organizer:string; //Django user
    image:string;
    description:string;
    date:string;
    venue:string;
    availability:boolean;  
    price:number;
   
}

const defaultEvent: Event = {
   
    name:"",
    organizer:"",
    description:"",
    image:"",
    date:"",
    venue:"",
    availability:false,
    price:0

}

interface Organizer{
    //id:number,
    username:string,
    email:string

}

interface IsAttendee {
    is_attendee: boolean,
}

interface IsOrganizer{
    is_organizer:boolean,
}


const CreateEvent = ({userInitializer}:any) =>{

    type uploadStatus = 'idle' | 'pending' | 'success' | 'error';// A new alternative way to boolean  
    
    const { username } = useParams<{ username: string }>();
    const [status,setStatus] = useState<uploadStatus>('idle');
    const [name,setName] = useState("");
    const [organizer,setOrganizer] = useState<Organizer[]>([]);// Bring the Django users,
    const [description,setDescription] = useState("");
    const [file,setFile] = useState<File | undefined>();
    const [date,setDate] = useState("");
    const [venue,setVenue] = useState("");
    const [availability,setAvailability] = useState<boolean>(false);
    const [price,setPrice] = useState(0);
    const [user, setUser] = useState<Organizer[]>([]);
    const location = useLocation();
    const { value } = location.state || {}; 
    
    async function handleSubmit(e: React.SyntheticEvent){
        e.preventDefault();
        if(!file) return;
        setStatus('pending');
        
        const formData = new FormData();
        formData.append("name" ,name);
        formData.append("organizer",userInitializer); 
        formData.append("description" ,description);
        formData.append('image',file);
        formData.append("date",date);
        formData.append("venue",venue);
        formData.append("availability", availability.toString());
        formData.append("price" ,price.toString());
        console.log(userInitializer);
       

        try{
            await axios.post("http://127.0.0.1:9000/etms/add/",formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                },
            }).then( res => {
                console.log("Success",res);
                setStatus('success')
                setName(defaultEvent.name);
                setDescription(defaultEvent.description);
                setFile(undefined);
                setDate(defaultEvent.date);
                setVenue(defaultEvent.venue)
                setAvailability(defaultEvent.availability);
                setPrice(defaultEvent.price);
            });
        }catch{
            alert("Could not add an event")
        }
    }

    //Image handler 
    function handleOnChangeFile(e:React.FormEvent<HTMLInputElement>){

        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        if(target.files){
            // console.log('File', target.files[0].name);
            console.log('File', target.files);
            setFile(target.files[0]);
        }
    }
    
    useEffect(()=>{
        //fetchUsers();
        
    },[organizer])

    return(
        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
            
            {value ? <div>
                <h1>Register as an event organizer </h1>
                <Login/>   
                </div>
                 :<form style={{width: '60%', margin: 'auto', marginTop: '50px'}} onSubmit={handleSubmit}>
                <h1>Add an event info</h1>
                <div className="form-group">
                    <label htmlFor="name">The name of an event</label>
                    <p className="help-block">Provide the name of an event</p>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Name" value = {name} onChange= {(e) => setName(e.target.value)} required/>
                </div>

                <div className="form-group">
                        <label htmlFor="organizer">Organizer name</label>
                        <p className="help-block">Select your organizer name</p>
                        <select
                            className="form-control"
                            id="organizer"
                            name="organizer"
                            value={organizer.length > 0 ? organizer[0].username : ''}
                            onChange={(e) =>
                                setOrganizer([{ username: e.target.value, email: '' }])
                            }
                            required
                        >
                            
                            <option value={userInitializer}>
                               {userInitializer} {/*i want to pass in the logged in user, it always has to be a logged in user
                               This value is obtained via the prop */}
                            </option>
                        </select>
                </div>
                <div>
                    <label htmlFor="des">Description</label>
                    <textarea className="form-control" rows={3} name = "description" value = {description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required/>
                </div>

                <div className="form-group">
                    <label htmlFor="venue">Venue</label>
                    <input
                        type="text"
                        className="form-control"
                        id="venue"
                        name="venue"
                        placeholder="Venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required/>
                </div>

                    <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                        className="form-control"
                        id="availability"
                        name="availability"
                        value={availability ? "true" : "false"}
                        onChange={(e) => setAvailability(e.target.value === "true")}
                    >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>

                <div className="form-group form-group-md">
                    <label className="col-sm-2 control-label" htmlFor="initial"> Ticket Price €</label>
                    <div className="col-sm-10">
                    <input className="form-control" 
                        type="number" id="startingPrice" 
                        name = "startingPrice" placeholder="Initial Price" 
                        value={price} onChange={(e)=> setPrice(Number(e.target.value))}/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <p className="help-block">Please submit an image of the event</p>
                    <div className='col-image'>
                    <input type="file" id="image" onChange={handleOnChangeFile}/>
                    </div>
                </div>

                {file && status !== "pending" && <button type="submit" className="btn btn-primary" >List the event</button>}
            </form>}
            
        </>
    )
}

export default CreateEvent;