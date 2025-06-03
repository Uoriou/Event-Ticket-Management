import React, { useState,useEffect, } from 'react';
import logo from './logo.svg';
import './App.css';
import Events from './Events';
import CreateEvent  from './CreateEvent';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { AppBar, Toolbar, Select,Box, colors,Chip,Avatar,Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link,Navigate,} from 'react-router-dom';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Profile from './Profile';
import Booking from './Booking';
import DeleteEvent from './DeleteEvent';
import Sales from './Sales';
import EventManagement from './EventManagement';
import EditEvent from './EditEvent';
import EditEventMain from './EditEventMain';


interface User{
    id:number,
    username:string,
    is_superuser:string,
    is_staff:string,

}

function Logout(){
    localStorage.clear();
    return <Navigate to = "/login"/>;
}
  
function RegisterAndLogout(){
    localStorage.clear();
    return <Register />
}


function App() {

    const [user,setUser] = useState<User | null>(null); 
    const [eventInfo,setEventInfo] = useState<Event[]>();
    const [error,setError] = useState<boolean | null>(null);
    const [open,setOpen] = React.useState(false);
   
    async function fetchUsers(){ // i just changed this to async function
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            //console.error("No access token found");
            return;
        }
        try {
            await axios.get<User[]>(`http://localhost:9000/etms/users/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken|| ''}`
                },
            }).then((response)=>{
                //console.log("Currently logged in as :", response.data[0]);
                setUser(response.data.length > 0 ? response.data[0] : null); 
                setError(false);
               
            })


            const responseEvent = await axios.get<Event[]>("http://127.0.0.1:9000/etms/get_event/",{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            if(responseEvent.data.length > 0){
                setEventInfo(responseEvent.data);
                console.log(responseEvent.data)
            } 
                   
        //Not correct error handling     
        } catch (error) {
            setError(true);
            setOpen(true);
        }
    }

    const handleClose = (event: React.SyntheticEvent<any>, reason?: SnackbarCloseReason) => {
        setOpen(false);
    };


    useEffect(()=>{
        fetchUsers();  
    },[])
   
    return (

        <> {/*I just added the following now with a parent <></> */}
        {/*Snackbar it is not opening  */}
        <div>
            {error && (
                <Snackbar open={open} autoHideDuration={5000} >
                    <Alert
                        onClose={handleClose}
                        severity="warning"
                        variant="filled"
                        sx={{ width: '100%' }}
                    > 
                        The system detected an unexpected error
                    </Alert>
                </Snackbar>
                )}    

        </div>
        
        
        <Router>
            <AppBar position="static" sx={{ backgroundColor: "#14141f" }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Link data-toggle="tab" to="/events" style={{ marginRight: '12px', color: '#e6e6e6' }}>Events</Link>
                   
                    {/*Can do access control here */}
                    <EventManagement/>
                </Box>
                    {/*<Link data-toggle="tab" to="/profile" style = {{marginRight: '12px',color:"black"}}>Profile</Link>*/}
                    <Link to= {"./profile"}>
                        <Chip avatar={<Avatar>P</Avatar>} label={localStorage.getItem("username")}/> {/*Seems wrong */}
                    </Link>
                    <Link  data-toggle="tab" to="/logout" style={{ marginRight: '12px', color: '#e6e6e6' }} >Logout</Link>
            </Toolbar>
            </AppBar>
        
                <Routes>
                    <Route path="/events" element={<Events />} />
                    <Route path = "event/:id"  element={<Booking access = {user?.id}/>}/> 
                    <Route path="/register" element={<RegisterAndLogout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/add-event/" element={
                        <ProtectedRoute>
                            <CreateEvent userInitializer = {user?.username}/>
                        </ProtectedRoute>
                    } />
                    <Route path ="delete-event" element={
                        <ProtectedRoute>
                            <DeleteEvent propEvents = {eventInfo}/>
                        </ProtectedRoute>
                    }/>
                    <Route path = "/edit" element  = {<EditEvent propEventToEdit = {eventInfo}/>}/>
                    <Route path = "edit/:id"  element={<EditEventMain/>}/>
                   
                    <Route path="/sales" element={<Sales event={eventInfo} />} />
                  
                    {/*Pass in eventInfo as a prop */}
                    <Route path="/profile" element={
                        <Profile 
                            eventInfo = {eventInfo} setEventInfo = {setEventInfo}
                            userInfo={user?.username} 
                        />
                    }/>
                </Routes>
           
        </Router>

         </>

        
    );
}

export default App;
