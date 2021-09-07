const query = require("../database/query");
const pool = require("../database/db");

module.exports = {
    flights: 
        async (req, res) => {
            try {    
            const avflight = await pool.query(query.queryGetFlights);
            res.json(avflight.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 
    countries: 
        async (req, res) => {
            try {
                const world_list = await pool.query(query.getCountries);
                res.json(world_list.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    ,
    aircrafts: 
        async (req, res) => {
            try {
                const aircrafts = await pool.query(query.getAircrafts);
                res.json(aircrafts.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    ,
    airports: 
        async (req, res) => {
            try {
                const airports = await pool.query(query.getAirports);
                res.json(airports.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    ,
}