const express = require('express')
const app = express()
const port = 4000

//CRUD operations for tickets
const db = require('./db');

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

app.listen(port, () => {
    
    console.log(`Express app listening on port ${port}`) // Looks like php variable
})