const { Pool } = require('pg');

const pool = new Pool({
  user: 'mario',
  password: 'mariopassword',
  host: 'db', 
  port: 5432, // default Postgres port
  database: 'etms'
});

//A function to check if the selected db exist
//pass in the actual field event_id, and eventId var from the frontend
async function check(eventId){
    
    try{
        const checkQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM etms_app_sale
                WHERE event_id= $1
            );`;
        const res = await pool.query(checkQuery,[eventId]);
        return res.rows[0].exists; 
    } catch (err) {
        //console.log('Error checking table existence:', err);
        return false;
    }
}
//Export both the check function and the generic query method
module.exports = {
    check,
    query: (text, params) => pool.query(text, params)
};

