let list_flights = []
let list_passengers = []
selectFlights();
const port = 1385; 
const hostHttp = `http://localhost:${port}`
const setFlights = (data) => {
    list_flights = data;
}

const setPassengers = (data) => {
    list_passengers = data;
}
 
// function to display flights
const displayFlights = () => {
    const flightsTable = document.querySelector('#flights-table');

    // display all flights by modifying the HTML in "flights-table"
    let tableHTML = "";
    list_flights.forEach((flight) => {
        tableHTML +=
            `<tr>
    <th>${flight.flight_id}</th>
    <th>${flight.scheduled_departure}</th>
    <th>${flight.scheduled_arrival}</th>
    <th>${flight.departure_airport}</th>
    <th>${flight.arrival_airport}</th>
    <th>${flight.status}</th>~
    <th>${flight.aircraft_code}</th>
    <th>${flight.seats_available}</th>
    <th>${flight.seats_booked}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#flight-info" onclick="selectPassengers('${flight.flight_id}')">Info</button></th>
    </tr>`;
    })
    flightsTable.innerHTML = tableHTML;
}

// function to display passengers
const displayPassengers = () => {
    
    const passengersTable = document.querySelector('#passengers-table');
    // display all flights by modifying the HTML in "passengers-table"
    let tableHTML1 = "";
    list_passengers.map(pass => {
        let tempName = pass.passenger_name.split("_"); 
        let passName = tempName[1] + " " + tempName[2];
        tableHTML1 +=
            `<th>${pass.seat_no}</th>
    <th>${pass.passenger_id}</th>
    <th>${passName}</th>
    </tr>`;
    })
    passengersTable.innerHTML = tableHTML1;
}


// select all the flights
async function selectFlights() {
    // use try... catch... to catch error 
    try {
        // GET all flights from "http://localhost:1385/list_flights"
        const response = await fetch(`${hostHttp}/flights`)
        const jsonData = await response.json();
        setFlights(jsonData);
        displayFlights();

    } catch (err) {
        console.log(err.message);
    }
}

async function getPassSeat(pass){
    try{ 
        const response = await fetch(`${hostHttp}/admin/seats/${pass.ticket_no}`);  
        const jsonData = await response.json();  
        if(jsonData.length == 0){
            pass["seat_no"] = "N/A"; 
        }
        else{
            pass["seat_no"] =  jsonData[0].seat_no; 
        }
    }catch(err){
        console.log(err.message); 
    }

}



const getPassSeatHandler = async() =>{
    for(pass of list_passengers){
        await getPassSeat(pass); 
    }
    displayPassengers(); 
}
// select all the passengers
async function selectPassengers(flight_id) {
    // use try... catch... to catch error
    try {
        // GET all passengers from "http://localhost:1385/list_flights/${code}"
        const response = await fetch(`${hostHttp}/admin/passengers/${flight_id}`);
        const jsonData = await response.json();
        setPassengers(jsonData);
        getPassSeatHandler()

    } catch (err) {
        console.log(err.message);
    }
}