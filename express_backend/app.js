const express = require('express')
const cors = require('cors');
const app = express()
const port = 4000

// Import db.js module
const db = require('./db');

app.use(cors({
    origin: '*', // any origin can access the resource
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    //credentials: true // only if you're using cookies or Authorization headers
}));

// Parse JSON bodies
app.use(express.json());

app.get('/sales', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM etms_app_sale');
        // return the result as JSON
        res.json(result.rows);
        return result.rows; 
    }catch (err) {
        res.status(500).send('Internal Server Error');
        return null; 
    }
})

// A function to allow a user to book an event, thus updating the sales record
// It will update the sales record of the event managed by an event organizer
app.put('/book_event/', async (req, res) => {
    const { eventId,price,participants } = req.body; 
    // If the sales recorded for the first time, insert else add it to the db 
    console.log("DB status " , await db.check(eventId)); // 
    if(await db.check(eventId) !== true){
        //insert a new record as 0 means that the eventId does not exist in the sales table
        try {
            console.log("Inserting new sales record for eventId:");
            const sales = price * participants;
            const result = await db.query(
                'INSERT INTO etms_app_sale (event_id, sales, quantity) VALUES ($1, $2, $3) RETURNING *',
                [eventId, sales, participants]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }else if(await db.check(eventId)){
        //update the existing record as 1 means that the eventId exists in the sales table
        //But  add the sales to what is already there
        //Retrieve the existing sales and quantity, then update
        try {
            console.log("Updating existing sales record for eventId:");
            const existingSale = await db.query(
                'SELECT sales, quantity FROM etms_app_sale WHERE event_id = $1',
                [eventId]
            );
            if (existingSale.rows.length === 0) {
                return res.status(404).send('Failed to fetch the sales record for the event');
            }
            console.log(existingSale.rows[0]);
            const existingSales = existingSale.rows[0].sales;
            const existingQuantity = existingSale.rows[0].quantity;
            const sales = price * participants + existingSales;
            const quantity = participants + existingQuantity;

            const result = await db.query(
                'UPDATE etms_app_sale SET sales = $1, quantity = $2 WHERE event_id = $3 RETURNING *',
                [sales, quantity, eventId]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } 
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`) // Looks like php variable
});
