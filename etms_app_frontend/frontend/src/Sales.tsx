import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import { ACCESS_TOKEN} from './Constants';
import axios from 'axios';



interface SalesInfo{
    id:number,
    event_id:number,
    sales:number,
    quantity:number,
}

interface User{
    id:number,
    username:string,
    is_superuser:string,
    is_staff:string,

}

const Sales = ({username}:any)=>{

    const [salesReport,setSalesReport] = useState<SalesInfo[]>([]);
    //const { id } = useParams<{ id: string }>();
    //const id = 
    console.log(username); // why it is undefined
    const location = useLocation();
    const { value } = location.state || {}; 

    async function fetchSales(){

        
            //Host name should be localhost when testing locally 
            await axios.get<SalesInfo[]>(`http://localhost:9999/get_sales/`) // it was without id 
            .then(response => {
                setSalesReport(response.data); // Write the logic to extract the organizer
                console.log(response.data)
                
            })
            .catch(() =>{
                alert("Could not fetch the data")
            })
            
        }

     useEffect(() => {
        fetchSales();
    },[]);

    return(
        <>

        <h1>Sales Dashboard</h1>
        {salesReport? salesReport.map((i) => (
            <div key={i.id}>
                <p>Total Sales of the event €: {i.sales}</p>
            </div>
        )) : (<p>Loading data</p>)}
        
        </>
    )
}

export default Sales;