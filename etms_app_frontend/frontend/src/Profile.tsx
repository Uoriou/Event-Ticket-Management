import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Login from './Login';
//This is like Form.tsx 

interface User{
    //id:number,
    username:string,
    email:string,

}

interface Event{

    name:string,
    image:string,
    date:string
    venue:string,
}

interface Attendee {
    is_attendee: boolean,
}

interface Organizer{
    is_organizer:boolean,
}

const Profile = ({eventInfo,setEventInfo,userInfo}:any) =>{

    const [user,setUser] = useState<User>(); 
    //const [eventInfo,setEventInfo] = useState<Event[]>();
    const [attendee,setAttendee] = useState<Attendee>();
    const [organizer,setOrganizer] = useState<Organizer>();


    async function fetchUsers(){
        
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        
        try {
            /*/ Now im trying to sort this one out, can remove now 
            const responseUsers = await axios.get<User[]>(`http://localhost:9000/etms/users/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            //console.log("User is :", responseUsers.data);
            if (responseUsers.data.length > 0) {
                
                setUser(responseUsers.data[0]);
                //console.log(responseUsers.data)
            }*/
            // i can possible remove this, i moved this to app so that delete takes this 
            /*const responseEvent = await axios.get<Event[]>("http://127.0.0.1:9000/etms/get_event/",{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            if(responseEvent.data.length > 0){
                setEventInfo(responseEvent.data);
                console.log(responseEvent.data)
            } */
           console.log(eventInfo)
        }catch(error){
            //Use material UI alert message
            alert(error)
        }
        
    }

     
    useEffect(()=>{
        fetchUsers();
    },[])

    if (!userInfo) {
        return (
            <div>
                <h1>Please log in to see your profile </h1>
                <Login />
            </div>
        );
    }
    return (
        <div>
            <h1>Your profile: {userInfo}</h1>
            {/*Userinfo vars were all called method before from the props */}
            {userInfo ? (
                <div>
                    {eventInfo ? (
                        <div>
                            You have the following events
                             {/*it was just event and index  */}
                            {eventInfo.map((event: Event, index: number) => ( 
                                <div key={index}>
                                    <p>Event Name: {event.name}</p>
                                    <p>Event Date: {event.date}</p>
                                    <p>Event Venue: {event.venue}</p>
                                    <img src={event.image} alt="Event" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No event information available</p>
                    )}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default Profile;