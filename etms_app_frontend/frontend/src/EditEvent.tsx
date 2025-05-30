import React, { useEffect, useState } from 'react';
import {useParams,useLocation,Link} from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
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
                        <p>Name: {event.name}</p>
                        <p>{event.description}</p>
                        <p>Venue: {event.venue}</p>
                        <p>Date: {event.date}</p>
                        <p>Price € {event.price}</p>
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