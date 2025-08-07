import React, { useEffect, useState } from 'react';
import { useNavigate, Link,useLocation,useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { LineChart, PieChart } from '@mui/x-charts'; 
import axios from 'axios';

interface SalesInfo{
    id:number,
    event_id:number, // Ive just changed this from event_id
    sales:number,
    quantity:number,
}

interface User{
    id:number,
    username:string,
    is_superuser:string,
    is_staff:string,

}
// Sales Dashboard frontend 
// A sales recording processes is not happening here, instead this is just to display data
const Sales = ({event}:any)=>{

    const [salesReport,setSalesReport] = useState<SalesInfo[]>([]);
    const location = useLocation();
    const { value } = location.state || {};  //useLocation, useful in props 
    let sumArr: number[] = []; // To show cumulative sales value 
    // Fetch the sales data from C++ backend : `http://localhost:9999/get_sales/`
    async function fetchSales(){
        // Fetching the sales record from express.js 
        await axios.get<SalesInfo[]>(`http://localhost:4000/sales`) // changed from c++ to express
        .then(response => {
            setSalesReport(response.data); // Write the logic to extract the organizer
            console.log(response.data)
        })
        .catch(() =>{
            alert("Could not fetch the data")
        })
    }
    // A helper function for total sales calculation and a pie chart display
    const sum = salesReport.reduce((accumulator, i) => {
        sumArr.push(accumulator + Number(i.sales));
        return accumulator + Number(i.sales) // Sum the values in the array using reduce()
    }, 0);

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
                <Item>
                    <h2>Total sales: {sum}€ <ArrowCircleUpIcon sx={{ color: '#228B22' }}/></h2>
                </Item> 
            </Grid>

            <Grid size={4} >
                
                 
                <Item>
                    Cumulative Sales Chart: {sum}€
                    <LineChart
                        xAxis={[{ data: [1,2,3,4,5,6,8,9,10,11,12] }]}
                        series={[
                            {
                                data: sumArr,
                                showMark: true,
                            },
                        ]}
                        height={300}
                    />
                </Item> 
            </Grid>

            {/*Shoe monthly sales next */}

           {salesReport && event ? (
                <PieChart
                    series={[
                        {
                            data: salesReport.map((i) => {
                            const matchedEvent = event.find((j: any) => Number(i.event_id) === j.id);
                            return {
                                id: i.event_id,
                                value: i.sales,
                                label: matchedEvent?.name || `Event ${i.event_id} `,
                            };
                            }),
                        },
                    ]}
                    width={200}
                    height={200}
                />
                ) : (
                <p>Loading data...</p>
            )}
        </Box>

        </>
    )
}

export default Sales;