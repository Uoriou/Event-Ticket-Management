import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LineChart, PieChart } from '@mui/x-charts'; 

import axios from 'axios';



interface SalesInfo{
    id:number,
    eventId:number, // Ive just changed this from event_id
    sales:number,
    quantity:number,
}

interface User{
    id:number,
    username:string,
    is_superuser:string,
    is_staff:string,

}

const Sales = ({event}:any)=>{

    const [salesReport,setSalesReport] = useState<SalesInfo[]>([]);
    const location = useLocation();
    const { value } = location.state || {};  //useLocation, useful in props 
    const [total,setTotal] = useState(0);

    async function fetchSales(){
 
            await axios.get<SalesInfo[]>(`http://localhost:9999/get_sales/`) // it was without id 
            .then(response => {
                setSalesReport(response.data); // Write the logic to extract the organizer
                console.log(response.data)
                console.log(event);
                
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
       
       
    
        <Box display="flex" gap={2}>
            <Grid size={4} >
                {/* Calculate total sales using reduce !!  */}
                <Item>
                    <h2>Total sales: {salesReport.reduce((sum, i) => sum + i.sales, 0)}€</h2>
                </Item> 
            </Grid>

            <Grid size={4} >
                {/* Calculate total sales using reduce !!  */}
                <Item>
                    Sales Chart: {salesReport.reduce((sum, i) => sum + i.sales, 0)}€
                    <LineChart
                        xAxis={[{ data: [1,2,3] }]}
                        series={[
                            {
                                data: salesReport ? [salesReport.reduce((sum, i) => sum + i.sales, 0)] : [],
                            },
                        ]}
                        height={300}
                    />
                </Item> 
            </Grid>
            
            {salesReport && event ? (
                salesReport.map((i) => {
                    const matchedEvent = event.find((j: any) => Number(i.eventId) === j.id);
                    {/*I need to pass array inside the Piechart props */}
                    return (
                        <div key={i.eventId}>
                            <h2>Event</h2>
                            <p>Sales: {i.sales}</p>
                            <p>Name: {matchedEvent?.name || 'Unknown Event'}</p>

                            <PieChart
                            series={[
                                {
                                data: [
                                
                                    { id: i.eventId, value: i.sales, label: "event"},
                                   
                                ],
                                },
                            ]}
                            width={200}
                            height={200}
                            />
                        </div>
                    );
                })
                ) : (
                <p>Loading data...</p>
            )}
        </Box>

        </>
    )
}

export default Sales;