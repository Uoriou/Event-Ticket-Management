import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import axios from 'axios';



interface Attendee {
    is_attendee: boolean,
}

interface Organizer{
    is_organizer:boolean,
}

type ControlProps = {
  onRender?: () => void;
};

//const Control = () =>{
// OK MOVE THIS WHOLE LOGIC INSIDE createEvent.tsx to make life simple
const Control = ({onRender}:ControlProps) =>{

    const [attendee,setAttendee] = useState<Attendee>();
    const [organizer,setOrganizer] = useState<Organizer>();

    useEffect(() => {
        async function fetchAccessInfo(){
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            if (!accessToken) {
                console.error("No access token found");// Change it to alert
                return ;
            }
            try{
                const responseAccess  =await axios.get<any>("http://127.0.0.1:9000/etms/get_access_info/",{
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                });
                if(responseAccess.data[0]["is_attendee"]){
                    console.log("It is  attendee");
                    setAttendee({ is_attendee: responseAccess.data[0]["is_attendee"] });
            
                }
                if(responseAccess.data[0]["is_organizer"]){
                    setOrganizer({ is_organizer: responseAccess.data[0]["is_organizer"] });
                }
            }catch{
                alert("Access control failed")
            }
        }
        fetchAccessInfo()
       
    },[]);

    useEffect(() => {
        if(onRender)onRender();
    }, []);
    
    return(
        <>  
            {attendee ? <h1>Register as an event organizer to list an event</h1>:<div>You can create ! </div>}
        </>
    );
};

export default Control;

