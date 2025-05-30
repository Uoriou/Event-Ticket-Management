import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ACCESS_TOKEN} from './Constants';
import axios from 'axios';


interface Event{
    id:number;
    name:string;
    image:string;
    description:string;
    date:string;
    venue:string;
    availability:boolean;  
    price:number;
}



const DeleteEvent = ({propEvents}:any) =>{

    const { id } = useParams<{ id: string }>();
    const[events,setEvents] = useState<Event[]>([]);
    const [deleted,setDeleted] = useState(Boolean);


    function fetchEvents(){

        //Nonono !!! Show only the asscociated event 
        axios.get<Event[]>("http://127.0.0.1:9000/etms/events/")
        .then(response => {
            setEvents(response.data);
        })
        .catch(() =>{
            alert("Could not fetch the data")
        })
    }

    function onButtonClicked(id: number){
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (confirmDelete) {
            axios.delete(`http://localhost:9000/etms/delete/${id}`, {
                 headers:{
                    "Content-Type":"multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                },
            })
            .then(() => {
                alert('Event deleted successfully');
                setDeleted(true);
            })
            .catch(err => console.error('Failed to delete the event:', err));
        }
    }
    

    useEffect(() => {
        fetchEvents();
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            console.error("No access token found");// Change it to alert     
            return ;
        }
    },[]);

    return(
        <>
            <h2>
                Select an event to delete
            </h2>
            <div style = {{
                textAlign: 'center',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                padding: '10px'
            }}> { /* */}
            {propEvents?.map((event: Event) => (

                <div key={event.id}>
                    <p>Name: {event.name}</p>
                    <p>{event.description}</p>
                    <p>Venue: {event.venue}</p>
                    <p>Date: {event.date}</p>
                    <p>Price € {event.price}</p>
                    {/*Access control */}
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => onButtonClicked(event.id)}
                    >
                        Delete
                    </Button>
                </div>
            ))}
            </div>
        </>
    )

}
export default DeleteEvent;