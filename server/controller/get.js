const query = require("../database/query");
const pool = require("../database/db");

module.exports = {
    
    flightsByAvail: 
        async (req, res) => {
            try {
                const { id } = req.params;
                const today = new Date(); 
                let avflight = await pool.query(query.GetFlightByAvail, [id, today]);
                res.json(avflight.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    ,
    //fix this
    flightsByLocation: 
        async (req, res) => {
            try {
            const { id } = req.params;
            const { a_city } = req.params;
            const { d_city } = req.params;
            const { a_date } = req.params;
            const { d_date } = req.params;
            const avflight = await pool.query(query.getFlightByLoc, [d_date, a_date, id, a_city, d_city]);
        
            res.json(avflight.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    ,
    seatsByFlight: 
        async (req, res) => {
            try {
            const { flight_id } = req.params;
            const { fare_condition } = req.params;
            const availSeats = await pool.query(query.seatsByFlight, [
                flight_id,
                fare_condition,
            ]);
            res.json(availSeats.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 
    seatsOfTicket: 
        async (req, res) => {
            try {
                const { tick_no } = req.params;
                const getSeat = await pool.query(query.seatByTick, [tick_no]);
                res.json(getSeat.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    , 
    ticketByPass: 
        async (req, res) => {
            try {
            const { pass_id } = req.params;
            const { book_ref } = req.params;
            const response = await pool.query(query.verifyTicket, [book_ref, pass_id]);
            res.json(response.rowCount);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 
    ticketByRef: 
        async (req, res) => {
            try {
            const { book_ref } = req.params;
            const getPassengers = await pool.query(query.getPassByBookRef, [book_ref]);
            res.json(getPassengers.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 
    paymentByRef:
        async (req, res) => {
            try {
                const { ref } = req.params;
                const getpayment = await pool.query(query.getPayByRef, [ref]);
                res.json(getpayment.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    , 
    passOnFlight:
        async (req, res) => {
            try {
                const { flight_id } = req.params;
                const getPass = await pool.query(query.passengerByFlight, [flight_id]);
                res.json(getPass.rows);
            } catch (err) {
                console.log(err.message);
            }
        }
    , 
    bookByRef: 
        async (req, res) => {
            try {
            const { book_ref } = req.params;
            const bookingInfo = await pool.query(query.getBookingInfo, [book_ref]);
            res.json(bookingInfo.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 
    flightBoardInfo: 
        async (req, res) => {
            try {
            const { flight_id } = req.params;
            const response = await pool.query(query.boardingByFlight, [flight_id]);
            console.log(response.rows);
            res.json(response.rows);
            } catch (err) {
            console.log(err.message);
            }
        }
    , 

}