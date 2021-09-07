
// assign seats to customer and ask whether they would like a meal
let seat_list = []
let trip_no; 
let bookInfo;
let bookRef = "";
let passengers = []

const setSeats = (data) => {
    seat_list = data;
}

const setBookRef = (data) =>{
    bookRef = data; 
}
//197787
//192837787

const setPassengers = (data) => {
    passengers = data; 
}

const setBookInfo = (data) => {
    bookInfo = data; 
}


const port = 1385; 
const hostHttp = `http://143.198.141.21:${port}`; 


//verify that passenger and bookref are in db 
async function verifyBooking(){
    const book_ref = document.querySelector("#check-bookref").value; 
    const pass_id =  document.querySelector('#check-id').value;
    setBookRef(bookRef)

    try{
        const response = await fetch(`${hostHttp}/ticket/${pass_id}&${book_ref}`); 
        const jsonData = await response.json(); 
        //check if data exists in db 
        if(jsonData==1){ 
            setBookRef(book_ref); 
            return verifyBookingStatus();  
        }
        else{
            displayError();
        }
    }catch(err){
        alert(err); 
    }
}

function displayError(){
    document.getElementById("bpass-display").style.display = "none";
    document.getElementById("error-display").style.display = "block";
}

// Use ticket number from input box to get boarding pass info
async function getPassengersInfo() {

    try {
        const response = await fetch(`${hostHttp}/ticket/${bookRef}`); 
        const jsonData = await response.json();
        setPassengers(jsonData);
        if(passengers.length > 0 ){ 
            document.getElementById("bpass-display").style.display = "block";

            document.getElementById("error-display").style.display = "none";
        }
        //await getAvailableSeats(); 
        return displayBookInfo(); 
       
    } catch (err) {
        alert(err.message);
    }
}

//check if booking is active/ set flight id 
async function verifyBookingStatus() {
    try{    
        const response = await fetch(`${hostHttp}/booking/${bookRef}`);
        const jsonData = await response.json();
        setBookInfo(jsonData); 

        return getPassengersInfo();

    }catch(err){
        console.log(err.message); 
    }
}


//<--- Display Check-in info --->

const seatsHtml = () => {
    seatOptions = ""; 
    seat_list.forEach((seat)=>{
        seatOptions += `<option value = "${seat.seat_no}">${seat.seat_no}</option>`
    })
    return seatOptions;  
}

async function getAvailableSeats(){
    try{
        const flight_id = bookInfo[0].flight_id; 
        const response = await fetch(`${hostHttp}/seats/${flight_id}/Economy`);
        const seats = await response.json(); 
        setSeats(seats); 
        
        
    }catch(err){
        alert(err.message);
    }
}


const displayBookInfo = async() =>{
    await getAvailableSeats(); 
    displayFlightInfo(); 
    displayContactInfo(); 
    displayPassInfo(); 

}

const displayFlightInfo = () => {
    document.getElementById("flightInfo-display").style.display = "block";
    const finfoTable = document.querySelector('#flight-info'); 
    let tableHTML = ""; 
        tableHTML += `
        <th> ${bookInfo[0].flight_id}</th>
        <th> ${bookInfo[0].departure_airport}</th>
        <th> ${new Date(bookInfo[0].scheduled_departure).toUTCString()}</th>
        <th> ${bookInfo[0].arrival_airport}</th>
        <th> ${new Date(bookInfo[0].scheduled_arrival).toUTCString()}</th>
        <th> ${bookInfo[0].flight_status}</th>
        `;
    finfoTable.innerHTML = tableHTML; 
    
}

const displayContactInfo = () => {
    document.getElementById("contactInfo-display").style.display = "block";
    const cinfoTable = document.querySelector('#contact-info'); 
    let tableHTML = ""; 
        tableHTML += `
        <th> ${bookInfo[0].contact_name}</th>
        <th> ${bookInfo[0].contact_phone}</th>
        <th> ${bookInfo[0].contact_email}</th>
        `;
    cinfoTable.innerHTML = tableHTML; 
}

// function to display passsenger infromation/ get input 
const displayPassInfo = () => {
    const bpassTable = document.querySelector('#boarding-pass');
    
    // display boarding pass by modifying the HTML in "boarding-pass"
    let tableHTML = "";
    //display passenger information
    passengers.forEach((passInfo, index)=>{
        //Format passenger date of birth 
        const DOB = new Date(passInfo.passenger_dob); 
        const formatted_DOB = 
        DOB.getMonth() + 1 + "/" +  DOB.getDate() + "/" + DOB.getFullYear(); 

        //Format passenger name 
        //let name = passInfo.passenger_name.replace(/_/g, ' ');  
        let name = passInfo.passenger_name.split("_"); 
        const formatted_name = name[0] + " " + name[2] + ", " + name[1]; 


        tableHTML +=
        `<th>${formatted_name}</th>
        <th>${passInfo.passenger_id}</th>
        <th>${formatted_DOB}</th>
        <th >
            <select id = "pass${index}-seat-no">
            ${seatsHtml()}
            </select>
        </th>
        <th><input class = "input-box" id = "pass${index}-bag-no" type = "number" value = 0 ></input></th>
        <th> <select id = "pass${index}-meal" class = "input-box"> 
        <option value = "regular"> Regular </option>
        <option value = "vegetarian"> 
        Vegetarian </option>
        </select></th>
        </tr>`;
    })
    
    bpassTable.innerHTML = tableHTML; 
    document.innerHTML +=  `<button class = "nav-btn" > Board Me </button>`; 
    ;
}





//verify user input 
function verifyCheckIn(){
    
    
    let verification = true; 
    //Check if bag number is non-positive
    
    passengers.forEach((pass, index)=>{
        if(document.querySelector(`#pass${index}-bag-no`).value < 0) {
            alert("Error: please enter a valid bag number");
            verification = false; 
        }
    }); 

    let seats = []; 
    

    //get passengers seat numbers and push into seat array
    passengers.forEach((pass, index)=>{
        seats.push(document.querySelector(`#pass${index}-seat-no`).value); 
    });
    

    //verify that no two seats are the same
    seats.forEach((seat1, index)=>{
        seats.slice(index+1).forEach((seat2)=>{
            if(seat1 == seat2){
                alert("Error: please check that each passenger is assigned a different seat");
                verification = false; 
            }
        });
    });
    
    return verification; 
    
}


async function check_in() {
    //verify that seats of passengers are different
    const verifyStatus = verifyCheckIn(); 
    if (verifyStatus){
        const insertStatus = await insertBoarding();
        if(!insertStatus){
            location.reload(); 
        } 
        else{
            //display boarding pass
            localStorage.setItem("passengers",JSON.stringify(passengers)); 
            localStorage.setItem("bookInfo", JSON.stringify(bookInfo[0])); 
            document.location.href = "boardSubmit"
            
        }
    }
};



//Post boarding to db 
async function insertBoarding(pass, index) {
    try{
        let bPassengers = []; 
        let bPassenger = {}; 
        passengers.forEach((pass, index) =>{
            const bags = document.querySelector(`#pass${index}-bag-no`).value; 
            const seat = document.querySelector(`#pass${index}-seat-no`).value; 
            const meal = document.querySelector(`#pass${index}-meal`).value; 
            passengers[index]["bag_no"]= bags; 
            passengers[index]["seat_no"] = seat; 
            bPassenger = {passenger_id: pass.passenger_id, ticket_no: pass.ticket_no,meal: meal, bags: bags, seat: seat}; 
            bPassengers.push(bPassenger); 
        }); 

        const body = {passengers: bPassengers, flight_id: bookInfo[0].flight_id}; 
        const response = await fetch(`${hostHttp}/boarding/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }); 
        const jsonData = await response.json();
        if(jsonData == 'error'){
            alert("An error has occured, please try again!")
            return false; 
        }
        return true;  
    }catch(err){
        alert(err.message); 
    }

}