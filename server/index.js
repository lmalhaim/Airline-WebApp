const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const transactions = require("./transaction");
const query = require("./query");
var async = require("async");
const { response } = require("express");
const { get } = require("http");
const { resolveSoa } = require("dns");

// middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES

//<--- Initialization --->
//Get world list
app.get("/world_list", async (req, res) => {
  try {
    const world_list = await pool.query(`
        SELECT * FROM location;`);
    console.log(world_list.rows);
    res.json(world_list.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/list_flights", async (req, res) => {
  try {
    const getflights = await pool.query(query.getAllflights);
    res.json(getflights.rows);

  } catch (err) {
    console.log(err.message);
  }
});

app.get("/passengers/:flight_id", async (req, res) => {
  try {
    const { flight_id } = req.params;
    const getPass = await pool.query(query.passengerByFlight, [flight_id]);
    console.log(getPass.rows); 
    res.json(getPass.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/seats/:tick_no", async (req, res) => {
  try {
    const { tick_no } = req.params;
    const getSeat = await pool.query(query.seatByTick, [tick_no]);
    console.log("h", getSeat.rows);
    res.json(getSeat.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//<--- BROWSE FLIGHTS --->
//get all flightss
app.get("/flights", async (req, res) => {
  try {
    const no_ticket = req.body;
    const avflight = await pool.query(query.queryGetFlights);
    res.json(avflight.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get flights depending on availability and date 
app.get("/flights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date(); 
    let avflight = await pool.query(query.GetFlightByAvail, [id, today]);
    res.json(avflight.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/flights/:id/:d_city-:a_city/", async (req, res) => {
  try {
    const { id } = req.params;
    const { a_city } = req.params;
    const { d_city } = req.params;

    const avflight = await pool.query(query.queryGetTrip, [id, d_city, a_city]);

    console.log(avflight.rows);

    res.json(avflight.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// <--- BOOKING --->

function Generate_book_ref(flight_id, pass_id) {
  return (
    flight_id.substr(flight_id.length - 2) +
    pass_id.substr(pass_id.length - 4)
  );
}

app.post("/booking", async (req, res) => {
  try {
    const pars = req.body;
    const no_ticket = pars.no_ticket;
    const flight_id = pars.flight_id;
    const flight = await pool.query(query.getFlightByID, [
      flight_id,
      pars.pass.length,
    ]);
    console.log(flight_id)
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
        console.log("ans:" + ans + "  " + flight_id);
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
});

//<--- CHECK IN --->
app.get("/ticket/:pass_id&:book_ref", async (req, res) => {
  try {
    const { pass_id } = req.params;
    const { book_ref } = req.params;
    const response = await pool.query(query.verifyTicket, [book_ref, pass_id]);
    res.json(response.rowCount);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/booking/:book_ref", async (req, res) => {
  try {
    const { book_ref } = req.params;
    console.log(typeof book_ref);
    const bookingInfo = await pool.query(query.getBookingInfo, [book_ref]);
    res.json(bookingInfo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get passengers by bookRef
app.get("/ticket/:book_ref", async (req, res) => {
  try {
    const { book_ref } = req.params;
    const getPassengers = await pool.query(query.getPassByBookRef, [book_ref]);
    res.json(getPassengers.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/seats/:flight_id/:fare_condition", async (req, res) => {
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
});

//Verify booking status/ get flight id
app.post("/boarding", async (req, res) => {
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
            pass.passenger_id,
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
});

app.get("/board/:flight_id", async (req, res) => {
  try {
    const { flight_id } = req.params;
    const response = await pool.query(query.boardingByFlight, [flight_id]);
    console.log(response.rows);
    res.json(response.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//<---- ADMIN ---->
app.get("/list_aircrafts", async (req, res) => {
  try {
    const aircrafts = await pool.query(query.getAircrafts);
    res.json(aircrafts.rows);
  } catch (err) {
    console.log(err.message);
  }
});
app.get("/list_airports", async (req, res) => {
  try {
    const airports = await pool.query(query.getAirports);
    res.json(airports.rows);
  } catch (err) {
    console.log(err.message);
  }
});

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
app.post("/admin/flight", async (req, res) => {
  try {
    const { flight } = req.body;
    console.log("in bd ");
    console.log("flightt" + Object.keys(flight));
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
});

//get payment
app.get("/admin_payment/:ref", async (req, res) => {
  try {
    const { ref } = req.params;
    const getpayment = await pool.query(query.getPayByRef, [ref]);
    res.json(getpayment.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// set up the server listening at port 5000 (the port number can be changed)
// PORT
const port = process.env.PORT || 1385;
app.listen(port, () => console.log(`Listening on port ${port}...`));
