import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia image={`http://127.0.0.1:9000/${event.image}`}  sx={{ height: 140 }} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {event.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {event.description}
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    Venue: {event.venue}
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    Date: {new Date(event.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                            
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    Price € {event.price} per person
                                </Typography>
                                
                            </CardContent>
                            <CardActions>
                                <Button size="small" 
                                    variant="contained" 
                                    component={Link}
                                    to={`/event/${event.id}`}
                                    color="primary"
                                >
                                    To book
                                </Button> 
                                <Button size="small" >Learn More</Button>
                            </CardActions>
                        </Card>
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