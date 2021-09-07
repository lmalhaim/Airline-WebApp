
world = [] // country, city list 
let departCity = [];
let arriveCity = []; 
let flights = [];
let error_style = false; 
const tick_price = 700; 
const tax = 6.25/100; 
let tickTotal; 
let discounts = 0; 
let passgs; 
let payment = {}; 
let contact = {}; 
const port = 1385; 
const hostHttp = `http://localhost:${port}`;

const set_no_ticket = (data) => {
  localStorage.setItem("no_ticket", JSON.stringify(data));
  localStorage.setItem("no_pass", "1"); 
}


const set_book_ref = (data) => {
  localStorage.setItem("book_ref", JSON.stringify(data));
}


const set_chosen_flight = (flight_id, a_city, d_city, a_date, d_date) => {
  localStorage.setItem("flight_id", JSON.stringify(flight_id));
  localStorage.setItem("a_city", JSON.stringify(a_city));
  localStorage.setItem("d_city", JSON.stringify(d_city));
  localStorage.setItem("a_date", JSON.stringify(a_date));
  localStorage.setItem("d_date", JSON.stringify(d_date));
}
const setworld = (data) => {
  world = data; 
}

const setDepartCity = (data) => {
  departCity = data; 
}

const setArriveCity = (data) => {
  arriveCity = data; 
}

const setpassgs = (data) => {
  passgs.push(data);  
}

const setcontact = (data) => {
  contact = data; 
}

const setpayment = (data) => {
  payment = data; 
}


const setflights= (data) => {
  flights = []; 
  flights = data;
}

const calTickTotal = (tickNo) => {
  tickTotal = 0; 
  tickTotal = tick_price * tickNo; 
}



//World options 


//Get list of countries 
function setCountries() {
  async function GetWorld(){
    try{ 
      const response = await fetch(`${hostHttp}
/world_list`);
      const jsonData = await response.json();
      setworld(jsonData);
      setoptions('d');
      setoptions('o'); 
    }catch(err){
      console.log(err.message)
    }
  }
  
  GetWorld(); 
  document = window.document; 
  
  const o_optionsContainer = document.querySelector(`#o-options-container`);
  
  const o_selected = document.querySelector(`#o-selected`);
  
  o_selected.addEventListener("click", () => {
    o_optionsContainer.classList.toggle("active");
  });

  const d_optionsContainer = document.querySelector(`#d-options-container`);
  
  const d_selected = document.querySelector(`#d-selected`);
  
  d_selected.addEventListener("click", () => {
    d_optionsContainer.classList.toggle("active");
  });
  
  
  const setoptions = (data) => {
    optionsContainer = o_optionsContainer; 
    if(data == 'd'){
      optionsContainer = d_optionsContainer; 
    }
    world.forEach(w => {
      optionsContainer.innerHTML += `<div class = "option-${data}">
      <input 
      type = "radio"
      class = radio 
      value = "${w.city_id}"
      id =  "${w.city_id}"
      name = "category"/> 
      <label for="d_city"> ${w.city}, ${w.country} </label>
      </div>`;
    });
    const optionsList = document.querySelectorAll(`.option-o`);
    optionsList.forEach(o => {
      o.addEventListener("click", () => {
      
      o_selected.innerHTML = o.querySelector("label").innerHTML;
      
      o_optionsContainer.classList.remove("active");
      setDepartCity(o.querySelector("input").value); 
      });
    })
    const optionsList1 = document.querySelectorAll(`.option-d`);
    optionsList1.forEach(o => {
      o.addEventListener("click", () => {
      
      d_selected.innerHTML = o.querySelector("label").innerHTML;
  
      d_optionsContainer.classList.remove("active");
      setArriveCity(o.querySelector("input").value); 
      });
    })
    
  }

  
}



//<---- BROWSE/SEARCH FLIGHTS ----> 

//Browse Flights
async function browse() {
  const id = document.querySelector("#b_no_ticket").value;
  if(id <= 0){
    alert("Please enter a valid number of tickets");
    return false; 
  }
  try {
    const response = await fetch(`${hostHttp}
/flights/${id}`);
    const jsonData = await response.json();
    set_no_ticket(id); 
    setflights(jsonData);
    calTickTotal(id); 
    displayflights();
  } catch (err) {
    console.log(err.message);
  }
}


//Search Flights
async function search() {
  try {
    const id = document.querySelector("#s_no_ticket").value;
    const d_city = departCity; 
    const a_city = arriveCity;
    const d_date = document.querySelector("#d_date").value;
    const a_date =  document.querySelector("#a_date").value;
    if(id <= 0){
      alert("Please enter a valid number of tickets");
      return false; 
    }
    const response = await fetch(`${hostHttp}/flights/${id}/${d_city}&${a_city}/${d_date}&${a_date}`);
    const jsonData = await response.json();
    set_no_ticket(id); 
    setflights(jsonData);
    calTickTotal(id); 
    displayflights();
    return false; 
  } catch (err) {
    alert(err.message);
  }
}



//Display available flights depending on user input 
function displayflights(){
  const flightsTable = document.querySelector('#flights-table');
  if(flights.length > 0)
  {
    let tableHTML = "";
    flights.map(flight =>{
        //format date
        let scheduled_departure = new Date(flight.scheduled_departure).toString(); 
        scheduled_departure = scheduled_departure.split(" ")[1] + " " + scheduled_departure.split(" ")[2]+ " " + scheduled_departure.split(" ")[3]+ " " + scheduled_departure.split(" ")[4];  

        let scheduled_arrival = new Date(flight.scheduled_arrival).toString(); 
        scheduled_arrival = scheduled_arrival.split(" ")[1] + " " + scheduled_arrival.split(" ")[2] + " " + scheduled_arrival.split(" ")[3]+ " " + scheduled_arrival.split(" ")[4]; 

        tableHTML +=
        `<div  >
        <tr class = "flight-row" >
          <th  id = "flight_id" >${flight.flight_id}</th>
          <th  id = "d_city" >${flight.departure_city}</th>
          <th  id = "d_date"> ${scheduled_departure}</th>
          <th  id = "a_date"> ${scheduled_arrival}</th>
          <th id = "a_city" > ${flight.arrival_city} </th>
          <th id = "price" > $${tickTotal}</th>
        <th> 
          <button id = "select-btn" class = "btn-book-search"> select </button>
        </th>`  
    });
    flightsTable.innerHTML = tableHTML; 
    selectBtnListener();
    
  }
  else{
    flightsTable.innerHTML = '<h3 class = "error-message" > No available flights </h3>';
  }

}




function selectBtnListener(){
  const flight_rows = document.querySelectorAll(`.flight-row`);
  flight_rows.forEach(flight_row => {
      flight_row.querySelector("button").addEventListener("click", () => {
        const a_city = flight_row.querySelector("#a_city").textContent;
        const d_city = flight_row.querySelector("#d_city").textContent;
        const a_date = flight_row.querySelector("#a_date").textContent;
        const d_date = flight_row.querySelector("#d_date").textContent;
        const flight_id = flight_row.querySelector("#flight_id").textContent;
        set_chosen_flight(flight_id,a_city, d_city, a_date, d_date); 
        document.location.href = 'bookFlight';  
      });
    }
  );
  
  return false;
}


