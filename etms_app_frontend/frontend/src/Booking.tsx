import React, { useEffect, useState } from 'react';
import { Form, useParams } from 'react-router-dom';
import { FormControl, Input,InputLabel,FormHelperText,TextField,Button } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Login from './Login';
import App from './App';

interface Event{

    id:number;
    name:string;
    image:string;
    description:string;
    date:string;
    venue:string;
    availability:boolean;  
    price:number;
    participant:number;
}


const Booking = ({access}:any) =>{ // Just testing props, access it a user id

    const { id } = useParams<{ id: string }>();
    const [event,setParticipant] = useState<Event>();
    const [userId,setUserId] = useState<string[]>([]);
    const [error,setError] = useState<boolean | null>(null);
    const [open,setOpen] = React.useState(false);
    
    function fetchEvent(){
        axios.get<Event>(`http://127.0.0.1:9000/etms/event_clicked/${id}`)
        .then(response => {
            setParticipant(response.data);
        })
        .catch(() =>{
            alert("Could not fetch the data")
        })
        
    }

    async function fetchId(){
        
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            console.error("No access token found");// Dont forget to remove it 
            return;
        }
        //To prevent so many try and catch, put them inside useEffect directly ?
        try{
            const res = await axios.get("http://127.0.0.1:9000/etms/user_id/",{
                headers: {
                    "Authorization": `Bearer ${accessToken || ''}`
                },

            }); 
            setUserId(res.data as string[]);
            console.log(res.data)
        }catch(error){
            alert("Please log in ");
        }    
        console.log(access); // how come it is undefined ?    
    }

    async function handleSubmit(e:React.SyntheticEvent){
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            console.error("No access token found");// Dont forget to remove it 
            return;
        }

        e.preventDefault(); 
        if (event) {
              
            try{
                //Here also update the attendee event info by posting to Django separately
                const formData = new FormData()
                formData.append("user",userId.toString()); //Confusion with ID
                formData.append("eventId", event.id.toString())
                axios.post("http://127.0.0.1:9000/etms/update_attendee_event/",formData,{
                    headers:{
                        "Content-Type":"multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                    },
                }).then(() => {
                    setError(false);
                    //setOpen(true);
                })
                //Update the sales db by posting to crow
            } catch (e) {
                alert(e);
                setError(true);
                return ; // Just testing  
            }

            try{
                const salesData = {
                    eventId: event.id.toString(),
                    price: event.price.toString(),
                    participants: event.participant.toString(), 
                };
                
                //Send to the backend; updates the corresponding sales records
                // ! ERROR -> make sure that an event organizer can not book an event
                // ! sending to Express.js and not formData but JSON !
                if(event.id === Number(id)){ // ! Error prone 
                    await axios.put(`http://localhost:4000/book_event/`,salesData,{
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                    },
                }).then(() => {
                    setError(false);
                    setOpen(true);
                    console.log("Saving the sales record to the backend")
                }).catch(error => {
                    console.error("Axios error:", error);
                });
                }
                

            }catch(e){
                alert("Could not book the event / something wrong with your booking")
            }
        }else{
            alert("Event data is not available");
            setError(true);
            return;
        }
        
    }

    const handleClose = (event: React.SyntheticEvent<any>, reason?: SnackbarCloseReason) => {
        setOpen(false);
    };

    useEffect(()=>{
        fetchEvent();
        fetchId();
    },[])

    return (
        <>
        {localStorage.getItem("username") ? <div style={{ textAlign: "center" }}>

            <h1>Booking event : {event?.name} </h1>
            <p>{event?.description}</p>
            <form onSubmit={handleSubmit} >


                <TextField id="outlined-basic" label="How many people ?" variant="outlined"
                    type="text"
                    value={event?.participant || ""}
                    onChange={(e) =>
                        setParticipant((prevEvent:any) => {
                            if (!prevEvent){
                                return prevEvent; 
                            } 
                            return {
                                ...prevEvent,
                                participant: Number(e.target.value),
                            } 
                        })
                    }
                /> 
            </form>
            <Button variant="contained" color="success" onClick={handleSubmit}>
                Book
            </Button>
                   
            </div>:<div style= {{textAlign: "center"}}><h1>Please log in first</h1><Login/></div>}
            
            {error === false ? (
                <Snackbar open={open} autoHideDuration={5000} >
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    > 
                    Booking Completed
                    </Alert>
                </Snackbar>
            ) : null}    
        </>
    );
};

export default Booking;