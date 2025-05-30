import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
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

const Events = () => {

    const[events,setEvents] = useState<Event[]>([]);
    const navigate = useNavigate();

    function fetchEvents(){
        //Host name should be localhost when testing locally 
        axios.get<Event[]>("http://localhost:9000/etms/events/") 
        .then(response => {
            setEvents(response.data);
        })
        .catch(() =>{
            alert("Could not fetch the data")
        })
    }

    useEffect(() => {
        fetchEvents();
    },[]);

    return(
        <>
            <h1>All Events</h1>

            <div style = {{
                textAlign: 'center',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                padding: '10px'
            }}>
            {events && events.length > 0 ? (
                events.map(event => (
                    <div key={event.id}>
                        <p>Name: {event.name}</p>
                        <Link to={`/event/${event.id}`}>
                            <img src={`http://127.0.0.1:9000/${event.image}`} alt={event.name} width={250} />
                        </Link>
                        <p>{event.description}</p>
                        <p>Venue: {event.venue}</p>
                        <p>Date: {event.date}</p>
                        <p>Price € {event.price}</p>
                    </div>
                ))
            ) : (
                <h1>No event listed</h1>
            )}
            </div>
        </>
    )
}

export default Events;