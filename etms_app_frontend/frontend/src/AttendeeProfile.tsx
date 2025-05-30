import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Profile from './Profile';
//Call props


const AttendeeProfile = () =>{
    return (
        <Profile route = "/profile-attendee" method = "Attendee"></Profile>
    )
}

export default AttendeeProfile;