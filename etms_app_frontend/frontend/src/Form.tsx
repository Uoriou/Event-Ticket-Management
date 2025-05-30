import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { ACCESS_TOKEN,REFRESH_TOKEN } from './Constants';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FormControl, Input,InputLabel,FormHelperText,TextField } from '@mui/material';
import { useNavigate, Link,useLocation } from 'react-router-dom';

//This is extended dynamically to register and login components
//props
const Form = ({route,method}:any) =>{

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [open,setOpen] = React.useState(false);
    const [accessControl,setAccessControl] = useState("");
    const [error,setError] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [regDirect,setRegDirect] = useState<boolean | null>(null);
    const sleep = (ms:any) =>{
        return new Promise(r => setTimeout(r, ms));
    } 
 
    const handleOnSubmit = async(e:React.SyntheticEvent) =>{
        e.preventDefault();
        try{
            
            if(method === "Register"){
                
                const formData = new FormData();
                formData.append("username",username);
                formData.append("password",password);
                formData.append("email",email);
                formData.append("access",accessControl);
               //The page is django Restframework default user creation page 
                const response = await axios.post("http://localhost:9000/etms/handle_access_control/",formData,{
                    //if it doesnt work, i uncomment the below
                    //headers:{
                        //"Content-Type":"multipart/form-data",
                    //},
                })
                
                setError(false);
                await sleep(3000)
                navigate("/events");
            }
        }catch{
            setError(true);
            
        }

        try{

            if(method === "Login"){

                interface TokenResponse {
                    access: string;
                    refresh: string;
                }
                //Problem is that the password is not hashed for the non admins
                const res = await axios.post<TokenResponse>("http://localhost:9000/etms/token/",{
                    username: username,
                    password: password,
                });
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN,res.data.refresh);
                localStorage.setItem("username",username);
                console.log(localStorage.getItem("username"));
            
                setError(false);
                await sleep(3000)
                navigate("/events");
            }
        
        }catch(error){
            setError(true)
            //alert("Please provide the correct credentials / Are you registered ? ")
        }
            
    }

    const handleClose = (event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,) =>{
        setOpen(false);
    }

    useEffect(() => {
        if(method === "Login"){
            setRegDirect(true);
        }else{
            setRegDirect(false);
        }
    },[method])

    function redirectRegister(){
        var link = <a href={"/register"}>here</a>;
        return <div> {link}</div>;
    }
    
    return(
        <div style = {{textAlign: 'center'}}>
            <h1>{method === "Login" ? "Login" : "Register"}</h1> 
            <h1>{method === "Register" ? "Welcome" : null}</h1>
            <form onSubmit = {handleOnSubmit}>

                <input type="text" placeholder='Name' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                {method === "Register" ? (
                    <>
                    <label htmlFor="email">Email address:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </>
                ):null}
                {method === "Register" ? <select
                    className="form-control"
                    id="organizer"
                    name="organizer"
                    value={accessControl}
                    onChange={(e) =>setAccessControl(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select who you are
                    </option>
                    
                    {["Event Organizer","Attendee"].map((i, index) => (
                        <option key={index} value={i}>
                            {i}
                        </option>
                    ))}
                   
                </select>:null}
                <Button variant="contained" color="primary" type="submit" onClick={(e) => setOpen(true)}>Submit</Button>
            </form>
            
            <br/>
            {regDirect && <div>Don't have an account yet? Create one</div>}
            {redirectRegister()}
            
            {error === false ? (
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                > 
                {method} success ! Redirecting...  
                </Alert>
            </Snackbar>
            ) : null}
            {error === true ? (
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                > 
                Please provide the correct credentials / Are you registered ?   
                </Alert>
            </Snackbar>
            ) : null}
        </div>
    )
}

export default Form;
