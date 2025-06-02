import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts';
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

        const Item = styled(Paper)(({ theme }) => ({
            backgroundColor: '#fff',
            ...theme.typography.body2,
            padding: theme.spacing(1),
            textAlign: 'center',
            color: (theme.vars ?? theme).palette.text.secondary,
            ...theme.applyStyles('dark', {
                backgroundColor: '#1A2027',
            }),
        }));

     useEffect(() => {
        fetchSales();
    },[]);

    return(
        <>

        <h1>Sales Dashboard</h1>
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid size={4} >
                <Item>size=4</Item>
            </Grid>
        </Grid>
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                area: true,
                },
            ]}
            height={300}
        />
     
        {salesReport? salesReport.map((i) => (
            <div key={i.id}>
                <p>Total Sales of the event €: {i.sales}</p>
            </div>
        )) : (<p>Loading data</p>)}
        
        </>
    )
}

export default Sales;