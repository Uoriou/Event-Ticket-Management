import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ACCESS_TOKEN} from './Constants';
import axios from 'axios';

//Top level ticket management,which consists of create, delete, update and  get tickets
const Ticket = ()=> {

    // When the book button is pressed, navigate to this page instead of booking.tsx
    //Once the user selected the ticket, then navigate to booking page 

    return(
        <>
        </>
    )
}