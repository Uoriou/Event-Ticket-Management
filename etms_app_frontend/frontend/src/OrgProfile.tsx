import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Profile from './Profile';
//Call props 


const OrgProfile = ()=>{
    return (
        <Profile route = "/etms/users/" method = "Organizer"></Profile>
    )
}

export default OrgProfile;