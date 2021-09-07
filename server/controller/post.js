const query = require("../database/query");
const pool = require("../database/db");
const transactions = require("../database/transaction"); 
function Generate_book_ref(flight_id, pass_id) {
    return (
      flight_id.substr(flight_id.length - 2) +
      pass_id.substr(pass_id.length - 4)
    );
}

async function populate_seats(flight) {
    let noSeats = await pool.query(query.getNumSeats, [flight.flight_id]);
    noSeats = Number(noSeats.rows[0].seats_available);
    const getSeats = await pool.query(query.getAllSeats);
    let insertSeat = "";
    getSeats.rows.forEach(async (seat, index) => {
        try {
        if (index < noSeats) {
            insertSeat = await pool.query(query.insertSeat, [
            flight.flight_id,
            `${seat.seat_no}`,
            ]);
        }
        } catch (err) {
        console.log("already exists");
        }
    });
}

module.exports = {
    booking: 
        async (req, res) => {
            try {
            const pars = req.body;
            const no_ticket = pars.no_ticket;
            const flight_id = pars.flight_id;
            const flight = await pool.query(query.getFlightByID, [
                flight_id,
                pars.pass.length,
            ]);
            const flights = flight.rows;
            let book_ref = Generate_book_ref(flight_id, pars.pass[0].id_no);
            const response = await pool
                .query("START TRANSACTION")
                .then((res) => {
                return pool.query(transactions.queryInsertBook, [
                    book_ref,
                    flight_id,
                    new Date(),
                    no_ticket,
                    pars.cont.ctname,
                    pars.cont.ct_nom,
                    pars.cont.ct_email,
                ]);
                })
                .then(async (res) => {
                let ans = "";
                //for each passenger
                for (pass of pars.pass) {
                    //insert them in to pass
                    ans += await pool.query(transactions.queryInsertPass, [
                    pass.id_no,
                    pass.prefix + "_" + pass.fname + "_" + pass.lname,
                    pass.DOB,
                    pass.nation,
                    ]);
        
                    //insert them into ticket
                    ans += await pool.query(transactions.queryInsertTick, [
                    book_ref,
                    pass.id_no,
                    ]);
                }
                return ans;
                })
                .then((res) => {
                return pool.query(transactions.queryInsertPay, [
                    book_ref,
                    700,
                    no_ticket,
                    pars.pay.c_nom,
                    0,
                ]);
                })
                .then(async (res) => {
                let ans = await pool.query(transactions.queryUpdateAS, [
                    pars.pass.length,
                    flight_id,
                ]);
                return ans;
                })
                .then((res) => {
                console.log("commited");
                pool.query("commit");
                return book_ref;
                })
                .catch((err) => {
                console.log("rolledback " + err.message);
                pool.query("rollback");
                return "";
                });
        
            res.json(response);
            } catch (err) {
            console.log(err.message);
            }
        }
    ,
    boarding: 
        async (req, res) => {
            try {
            const { passengers } = req.body;
            const { flight_id } = req.body;
        
            //Change seat status to occupied
            const response = await pool
                .query("START TRANSACTION")
                .then(async (res) => {
                let status = true;
                let seat_availability;
                //for each passenger
                for (pass of passengers) {
                    //check if seat is available
                    seat_availability = await pool.query(transactions.queryCheckSeat, [
                    flight_id,
                    pass.seat,
                    ]);
                    //if seat is not available
                    if (seat_availability.rowCount == 0) {
                    //set status = false without changing seat status
                    status = false;
                    } else {
                    //if seat is available, change status to 'occupied'
                    seat_availability = await pool.query(transactions.queryOccupySeat, [
                        flight_id,
                        pass.seat,
                    ]);
                    }
                }
                if (!status) {
                    throw new Error({ Error: "seat already taken" });
                }
                })
                .then(async (res) => {
                for (pass of passengers) {
                    res += await pool.query(transactions.postBoardingPass, [
                    pass.ticket_no,
                    pass.seat,
                    pass.bags,
                    pass.meal,
                    ]);
                }
                return res;
                })
                .then((res) => {
                console.log("commited");
                pool.query("COMMIT");
                return "success";
                })
                .catch((err) => {
                console.log("rolledback " + err.message);
                pool.query("ROLLBACK");
                return "error";
                });
        
            //post booking to boarding passes
            console.log(response);
            res.json(response);
            } catch (err) {
            console.log(err.message);
            }
        }
    ,
    flight:
        async (req, res) => {
            try {
                const { flight } = req.body;
                
                // Transaction to insert flight to db.
                const response = await pool
                .query(`START TRANSACTION`)
                .then(async (res) => {
                    res = await pool.query(transactions.queryInsertFlight, [
                    flight.flight_id,
                    flight.scheduled_departure,
                    flight.scheduled_arrival,
                    flight.departure_airport,
                    flight.arrival_airport,
                    flight.aircraft_code,
                    flight.available_seats,
                    ]);
                })
                .then(async (res) => {
                    res = await pool.query(transactions.queryInsertFlightBoard, [
                    flight.flight_id,
                    flight.scheduled_boarding,
                    flight.depart_gate,
                    flight.bag_claim,
                    ]);
                })
                .then(async (res) => {
                    await populate_seats(flight);
                })
                .then((res) => {
                    console.log("commited");
                    pool.query("COMMIT");
                    return { success: "added" };
                })
                .catch((err) => {
                    console.log("rolledback " + err.message);
                    pool.query("ROLLBACK");
                    if (
                    err.message ==
                    'duplicate key value violates unique constraint "flights_pkey"'
                    ) {
                    return { Error: "duplicate" };
                    }
                    return { Error: "error" };
                });
                console.log(response);
        
                res.json(response);
            } catch (err) {
                // Rollback if incorrect input is given.
        
                console.log("err", err.message);
            }
        }
    , 
}