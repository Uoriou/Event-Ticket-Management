import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from './Constants';
import { BrowserRouter as Router, Routes, Route, Link,Navigate,} from 'react-router-dom';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';


interface IsAttendee {
	id:number,
    is_attendee: boolean,
}

interface IsOrganizer{
	id:number,
    is_organizer:boolean,
}

export default function EventManagement() {

  	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [messageOpen,setMessageOpen] = useState(false);
	const [error,setError] = useState<boolean | null>(null);
	const [attendee,setAttendee] = useState<IsAttendee>();
	const [organizer,setOrganizer] = useState<IsOrganizer>();
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	useEffect(() => {
		async function fetchAccessInfo(){
				const accessToken = localStorage.getItem(ACCESS_TOKEN);
				if (!accessToken) {
					console.error("No access token found");
					return ;
				}
				try{
					const responseAccess  =await axios.get<any>("http://127.0.0.1:9000/etms/get_access_info/",{
						headers: {
							"Authorization": `Bearer ${accessToken}`
						},
					});
					if(responseAccess.data[0]["is_attendee"]){
						console.log("Attendee Event management top level");
						setAttendee({ id: responseAccess.data[0]["id"], is_attendee: responseAccess.data[0]["is_attendee"] })
					
					}
					if(responseAccess.data[0]["is_organizer"]){
                    	setOrganizer({  id: responseAccess.data[0]["id"],is_organizer: responseAccess.data[0]["is_organizer"] });
                }
				}catch(error){
					setMessageOpen(true);
					setError(true);
				}
		}
		fetchAccessInfo()
	},[]);
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
	
		<div>
			<Button
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				Event Management
			</Button>
		
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			> 	{/* Yeah it works*/}
				{ organizer ? (
					<MenuItem component={Link} to="/add-event/" state={{ value: attendee?.is_attendee }} onClick={handleClose}>Add</MenuItem>
				) : (
					<MenuItem disabled>
						Please register as an event organizer <HowToRegIcon />
					</MenuItem>
				)}
				{ organizer && (<MenuItem onClick={handleClose} component={Link} to="/edit">Edit </MenuItem>)}
				{ organizer && (<MenuItem onClick={handleClose} component={Link} to="/delete-event/">Delete</MenuItem>)}
				{ organizer && (<MenuItem onClick={handleClose} component={Link} to= '/sales' state = {{value:attendee?.id}}>Sales </MenuItem>)}
				
			</Menu>

			{error === false && (
				<Snackbar open={open} autoHideDuration={5000} >
					<Alert
						onClose={handleClose}
						severity="error"
						variant="filled"
						sx={{ width: '100%' }}
					> 
					Please log in 
					</Alert>
				</Snackbar>
			)}    
		</div>
	);
}