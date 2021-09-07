const port = 1385;
const localHost = 'localhost'; 
const http = '143.198.141.21'; 
const hostHttp = `http://${localHost}:${port}`;
let aircrafts = [];
let airports = [];
let flight = {};

const setFlight = (data) => {
  flight = data;
};

const setAirports = (data) => {
  airports = data;
};

const setAircrafts = (data) => {
  aircrafts = data;
};

async function getAircrafts() {
  try {
    const response = await fetch(`${hostHttp}/admin/aircrafts`);
    const jsonData = await response.json();
    setAircrafts(jsonData);
  } catch (err) {
    alert(err.message);
  }
}
async function getAirports() {
  try {
    const response = await fetch(`${hostHttp}/admin/airports`);
    const jsonData = await response.json();
    setAirports(jsonData);
  } catch (err) {
    alert(err.message);
  }
}

async function addSelection() {
  await getAircrafts();
  const airports_html = document.querySelector("#aircraft-code");

  let opt;
  aircrafts.forEach((aircraft) => {
    opt = document.createElement("option");
    opt.value = aircraft.aircraft_code;
    opt.innerHTML = `${aircraft.aircraft_code} (${aircraft.model})`;
    airports_html.appendChild(opt);
  });

  await getAirports();
  const depart_airport_html = document.querySelector("#departure-airport");
  const arrive_airport_html = document.querySelector("#arrival-airport");

  airports.forEach((airport) => {
    opt = document.createElement("option");
    opt.value = airport.airport_code;
    opt.innerHTML = `${airport.airport_code} (${airport.airport_name})`;
    arrive_airport_html.appendChild(opt);
  });

  airports.forEach((airport) => {
    opt = document.createElement("option");
    opt.value = airport.airport_code;
    opt.innerHTML = `${airport.airport_code} (${airport.airport_name})`;
    depart_airport_html.appendChild(opt);
  });
}

function isEqual(data1, data2) {
  if (data1 == data2) {
    return true;
  }
  return false;
}

function formatDateTime(date, time) {
  let final = new Date();
  let year = date.split("-")[0];
  final.setFullYear(year);
  let month = date.split("-")[1];
  final.setMonth(month - 1);
  let day = date.split("-")[2];
  final.setDate(day);
  let hour = time.split(":")[0];
  final.setHours(hour);
  let min = time.split(":")[1];
  final.setMinutes(min);

  return final;
}

function getScheduledBoarding(tempdate) {
  let date = new Date(tempdate);
  let min = date.getMinutes();
  if (min >= 45) {
    date.setMinutes(min - 45);
  } else {
    let hour = date.getHours();
    date.setMinutes(60 + min - 45);
    if (hour == 0) {
      date.setHours(23);
      let day = date.getDate();
      date.setDate(day - 1);
    } else {
      date.setHours(hour - 1);
    }
  }
  return date;
}

function verifyScheduled(date1, date2) {
  if (date1.getFullYear() >= date2.getFullYear()) {
    if (date1.getFullYear() > date2.getFullYear()) {
      return true;
    }
    if (date1.getMonth() >= date2.getMonth()) {
      if (date1.getMonth() > date2.getMonth()) {
        return true;
      }
      if (date1.getDate() >= date2.getDate()) {
        if (date1.getDate() > date2.getDate()) {
          return true;
        }

        if (date1.getHours() >= date2.getHours()) {
          if (date1.getHours() > date2.getHours()) {
            return true;
          }

          if (date1.getMinutes() > date2.getMinutes()) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function insertFlightHandler() {
  //get inputs from page
  const flight_id = document.querySelector("#flight-id").value;

  const dep_time = document.querySelector("#departure-time").value;
  const dep_date = document.querySelector("#departure-date").value;
  const scheduled_dep = formatDateTime(dep_date, dep_time);

  const scheduled_board = getScheduledBoarding(scheduled_dep);
  const arr_time = document.querySelector("#arrival-time").value;
  const arr_date = document.querySelector("#arrival-date").value;
  const scheduled_arr = formatDateTime(arr_date, arr_time);

  const dep_airport = document.querySelector("#departure-airport").value;
  const arr_airport = document.querySelector("#arrival-airport").value;

  const aircraft_code = document.querySelector("#aircraft-code").value;
  const seats_avail = document.querySelector("#seats-available").value;
  const dep_gate = document.querySelector("#depart-gate").value;
  const bag_claim = document.querySelector("#bag-claim").value;

  //verify that all inputs are given
  let verification = true;
  alert(isEqual(flight_id.length, 0) +
  isEqual(scheduled_dep, "Invalid Date") +
  isEqual(scheduled_arr, "Invalid Date") +
  isEqual(seats_avail.length, 0) +
  isEqual(dep_gate.length, 0) +
  isEqual(bag_claim.length, 0));
  if (
    isEqual(flight_id.length, 0) ||
    isEqual(scheduled_dep, "Invalid Date") ||
    isEqual(scheduled_arr, "Invalid Date") ||
    isEqual(seats_avail.length, 0) ||
    isEqual(dep_gate.length, 0) ||
    isEqual(bag_claim.length, 0)
  ) {
    verification = false;
    alert("Error: missing inputs");
  } else {
    //check further restrictions
    //flight_id must be 6 characters
    
    if(seats_avail > 32){
      verification = false; 
      alert("Error: All of our aircrafts support maximum 32 seats. Available seats must be 32 or less"); 
    }
    if (flight_id.length != 6) {
      verification = false;
      alert("Error: flight ID must be 6 characters long");
    }
    //departure > today's date
    if (!verifyScheduled(scheduled_dep, new Date())) {
      verification = false;
      alert("Error: flight must be in the future");
    }

    //departure< arrival
    if (!verifyScheduled(scheduled_arr, scheduled_dep)) {
      verification = false;
      alert(
        "Error: scheduled arrival cannot be before scheduled departure (time and date)"
      );
    }
    //departure airport and arrival airport must be different
    if (isEqual(dep_airport, arr_airport)) {
      verification = false;
      alert("Error: departure airport and arrival airport cannot be the same");
    }
  }

  if (verification) {
    const tempflight = {
      flight_id: flight_id,
      scheduled_arrival: scheduled_arr,
      scheduled_departure: scheduled_dep,
      scheduled_boarding: scheduled_board,
      departure_airport: dep_airport,
      arrival_airport: arr_airport,
      aircraft_code: aircraft_code,
      available_seats: seats_avail,
      depart_gate: dep_gate,
      bag_claim: bag_claim,
    };

    setFlight(tempflight);
    insertFlight();
  }
}

// insert a new flight
async function insertFlight() {
  // read the flight details from the input

  // use try... catch... to catch error
  try {
    // insert new flight to "http://localhost:1385/admin_add_flight", with "POST" method
    const body = {
      flight: flight,
    };

    const response = await fetch(`${hostHttp}/admin/flight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const jsonData = await response.json();
    if (Object.keys(jsonData) == "Error") {
      if (jsonData["Error"] == "duplicate") {
        alert("Error: flight ID already exists");
      } else {
        alert("Error: adding flight please try again");
      }
    } else {
      alert("Flight has been successsfully added");
      location.reload();
    }
  } catch (err) {
    console.log(err.message);
  }
}
