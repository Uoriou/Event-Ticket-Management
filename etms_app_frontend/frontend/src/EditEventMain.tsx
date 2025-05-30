import React, { useEffect, useState } from 'react';
import {useParams,useLocation} from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from 'axios';


interface Event{
    id:number;
    name:string;
    image:string | File;
    description:string;
    date:string;
    venue:string;
    availability:boolean;  
    price:number;
}


const EditEventMain = ({userInitializer}:any) =>{


    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        name: "",
        organizer: "",
        image: "" as string | File,
        description: "",
        date: "",
        venue: "",
        availability: "", // boolean
        price: 0,
        participants: 0
    });


    async function fetchEventToEdit(){
        //Host name should be localhost when testing locally 
        axios.get<Event[]>(`http://localhost:9000/etms/event/${id}`) 
        .then(response => {
            if (response.data && response.data.length > 0) {
                setFormData({
                    name: response.data[0].name || "",
                    organizer: "", // Set this appropriately if available
                    image: response.data[0].image || "",
                    description: response.data[0].description || "",
                    date: response.data[0].date || "",
                    venue: response.data[0].venue || "",
                    availability: response.data[0].availability ? "true" : "false",
                    price: response.data[0].price || 0,
                    participants: 0 // Set this appropriately if available
                });
            }
        })
        .catch(() =>{
            alert("Could not fetch the data")
        })
    }

    function onButtonClicked(){
       // Check the python backend format
        axios.put(`http://localhost:9000/etms/update/${id}`, formData,{
            headers:{
                "Content-Type":"multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
            },
        }).then(() => {
            alert('Event updated successfully');
               
        }).catch(err => console.error('Failed to update the event:', err));
        
    }

    //Image handler 
    function handleOnChangeFile(e:React.FormEvent<HTMLInputElement>){
    
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        if(target.files){
            // console.log('File', target.files[0].name);
            console.log('File', target.files);
            setFormData({ ...formData, image: target.files[0] });
        }
    }


    return (
        <>

            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
            
            <form style={{width: '60%', margin: 'auto', marginTop: '50px'}} onSubmit={onButtonClicked}>
                <h1>Update an event</h1>
                <div className="form-group">
                    <label htmlFor="name">The name of an event</label>
                    <p className="help-block">Provide the name of an event</p>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Name" value = {formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required/>
                </div>

                <div className="form-group">
                        <label htmlFor="organizer">Organizer name</label>
                        <p className="help-block">Select your organizer name</p>
                        <select
                            className="form-control"
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                                Select an organizer
                            </option>
                            <option >
                               {userInitializer} {/* I just changed this from localstorage("username")*/}
                            </option>
                        </select>
                    </div>
                <div>
                    <label htmlFor="des">Description</label>
                    <textarea className="form-control" rows={3} name = "description" value = {formData.description} onChange={e => setFormData({ ...formData, name: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={formData.date}
                       onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.venue}
                       onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required/>
                </div>

                    <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                        className="form-control"
                        id="availability"
                        name="availability"
                        value={formData.availability ? "true" : "false"}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>

                <div className="form-group form-group-md">
                    <label className="col-sm-2 control-label" htmlFor="initial">Base Ticket Price €</label>
                    <div className="col-sm-10">
                    <input className="form-control" 
                        type="number" id="startingPrice" 
                        name = "startingPrice" placeholder="Initial Price" 
                        value={formData.price} onChange={e => setFormData({ ...formData, name: e.target.value })}/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <p className="help-block">Please submit an image of the event</p>
                    <div className='col-image'>
                    {/*How to handle image ? */}
                    <input type="file" id="image" onChange={handleOnChangeFile}/>
                    </div>
                </div>

                
            </form>
        </>
    )
    
}

export default EditEventMain;