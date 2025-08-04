const express = require('express')
const cors = require('cors');
const app = express()
const port = 4000

//CRUD operations for tickets
const db = require('./db');

app.use(cors({
    origin: '*', // any origin can access the resource
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    //credentials: true // only if you're using cookies or Authorization headers
}));

// Parse JSON bodies
app.use(express.json());
app.get('/tickets', async (req, res) => {
    
    try {
        const result = await db.query('SELECT * FROM etms_app_ticket');
        console.log(result.rows); // Log the result to the console
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/create_ticket', async (req, res) => {
    const { title, description } = req.body;

    try {
        const result = await db.query(
            //event is a foreign key to etms_app_event
            //Do i have to do inner join here ?
            'INSERT INTO etms_app_ticket (description,event) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);


// Get a single ticket by ID
app.get('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM etms_app_ticket WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Update a ticket by ID
app.put('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { description, event } = req.body;
    try {
        const result = await db.query(
            'UPDATE etms_app_ticket SET description = $1, event = $2 WHERE id = $3 RETURNING *',
            [description, event, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Delete a ticket by ID
app.delete('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM etms_app_ticket WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.json({ message: 'Ticket deleted', ticket: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Booking an event, since C++ didnt work 
app.put('/book_event/', async (req, res) => {
    console.log(req.header);
    const { eventId,price,participants } = req.body; 
    // If the sakes recorded for the first time, insert else add it to the db 
    if(db.check(eventId) === 0){
        //insert a new record as 0 means that the eventId does not exist in the sales table
        try {
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
    }else if(db.check(eventId) === 1){
        //update the existing record as 1 means that the eventId exists in the sales table
        //But  add the sales to what is already there
        //Retrieve the existing sales and quantity, then update
        try {
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
