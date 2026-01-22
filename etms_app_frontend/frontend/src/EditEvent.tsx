import React, { useEffect, useState } from 'react';
import {useParams,useLocation,Link} from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


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


const EditEvent = ({propEventToEdit}:any) => { 


    useEffect(() => {
           
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            console.error("No access token found");// Change it to alert     
            return ;
        }
    },[]);

    return(

        <>

            <h2>
                Select an event to update
            </h2>
            <div style = {{
                textAlign: 'center',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                padding: '10px'
            }}> { /* */}
                {propEventToEdit?.map((event: Event) => (

                    <div key={event.id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia image={`http://127.0.0.1:9000/${event.image}`}  sx={{ height: 140 }} />
                         <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                <p>Name: {event.name}</p>
                            </Typography>
                            <Typography gutterBottom variant="h5" component="div">
                                 <p>{event.description}</p>
                            </Typography>
                            <Typography gutterBottom variant="h5" component="div">
                                <p>Venue: {event.venue}</p>
                            </Typography>
                            <Typography gutterBottom variant="h5" component="div">
                                Date: {new Date(event.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                            </Typography>
                             <Typography gutterBottom variant="h5" component="div">
                                 <p>Price € {event.price}</p>
                            </Typography>
                        </CardContent> 
                           
                           
                        </Card>       
                       
                        {/*Possibly navigate to EditEventMain ... */}
                        <Link to={`${event.id}`}>
                            <Button
                                variant="outlined"
                                startIcon={<ModeEditIcon />}
                            >
                                Update
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )

}
export default EditEvent;