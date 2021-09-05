const port = 1385; 
let passengers;
let bookInfo;
let boardInfo;

const setPassengers = (data) => {
  passengers = data;
};

const setBookInfo = (data) => {
  bookInfo = data;
};

const setBoardInfo = (data) => {
  boardInfo = data;
};

function addBoardingBtn() {
    setPassengers(JSON.parse(localStorage.getItem("passengers")));
  const Boardinghtml = document.querySelector("#bConfirmed");
  let addedHtml = "";
  passengers.forEach((pass, index) => {
    addedHtml += `
        <button class = "board-btn" id = "${index}-Bpass" onclick = "displayBpass(${index})">
            Boarding ${index + 1}
        </button>`;
  });
  Boardinghtml.innerHTML += addedHtml;
}

function displayBpass(index) {
  window.open("boarding_pass.html", "_blank");
  localStorage.setItem("index", index);
}

//change time from 24 to 12
function formatTime(hour, min) {
  let timeOfDay = "AM";
  hour = Number(hour);
  min = Number(min);
  if (hour > 12) {
    hour -= 12;
    timeOfDay = "PM";
  }
  if (hour == 0) {
    hour = 12;
  }
  if(min < 10){
      min = "0" + min; 
  }
  return hour + ":" + min + " " + timeOfDay;
}

async function inputBoardingInfo() {
  setPassengers(JSON.parse(localStorage.getItem("passengers")));
  const index = localStorage.getItem("index");
  setBookInfo(JSON.parse(localStorage.getItem("bookInfo")));
  //passenger name
  let tempName = passengers[index].passenger_name.split("_");
  const pass_name = tempName[2] + "/" + tempName[1];
  const pass_name_html = document.querySelector("#pass-name");
  pass_name_html.innerHTML = `${pass_name}`;

  //city from
  let city_from = bookInfo.departure_airport;
  const city_from_html = document.querySelector("#city-from");
  city_from_html.innerHTML = `${city_from}`;

  //city to
  let city_to = bookInfo.arrival_airport;
  const city_to_html = document.querySelector("#city-to");
  city_to_html.innerHTML = `${city_to}`;

  //fix time formula
  //depart time
  let tempDepart = new Date(bookInfo.scheduled_departure);
  let depart_time = formatTime(tempDepart.getHours(), tempDepart.getMinutes());
  const depart_time_html = document.querySelector("#depart-time");
  depart_time_html.innerHTML = `${depart_time}`;

  //depart date
  let tempDepartDate = new Date(bookInfo.scheduled_departure);
  let depart_date =
    tempDepartDate.getMonth() +
    "/" +
    tempDepartDate.getDate() +
    "/" +
    tempDepartDate.getFullYear();
  const depart_date_html = document.querySelector("#depart-date");
  depart_date_html.innerHTML = `${depart_date}`;

  //arrive time
  let tempArrive = new Date(bookInfo.scheduled_arrival);
  let arrive_time = formatTime(tempArrive.getHours(), tempArrive.getMinutes());
  const arrival_time_html = document.querySelector("#arrive-time");
  arrival_time_html.innerHTML = `${arrive_time}`;

  //flight id
  let flight_id = bookInfo.flight_id;
  const flight_id_html = document.querySelector("#flight-num");
  flight_id_html.innerHTML = `${flight_id}`;

  //Book Conf
  let bookRef = passengers[index].book_ref;
  const bookRef_html = document.querySelector("#book-conf");
  bookRef_html.innerHTML = `${bookRef}`;

  //bags
  let bags = passengers[index].bag_no;
  const bags_html = document.querySelector("#bags");
  bags_html.innerHTML = `${bags}`;

  //seat
  let seat = passengers[index].seat_no;
  const seat_html = document.querySelector("#seat");
  seat_html.innerHTML = `${seat}`;

  //get boarding info from DB
  await getBoardInfo();

  //bags
  let gate = boardInfo.d_gate;
  const gate_html = document.querySelector("#gate");
  gate_html.innerHTML = `${gate}`;

  let tempBtime = new Date(boardInfo.d_boarding_time); 
  let board_time = formatTime(tempBtime.getHours(),tempBtime.getMinutes());
  const board_time_html = document.querySelector("#board-time");
  board_time_html.innerHTML = `${board_time}`;

  let bag_claim = boardInfo.baggage_claim;
  const bag_claim_html = document.querySelector("#bag-claim");
  bag_claim_html.innerHTML = `${bag_claim}`;



}


async function getBoardInfo(){
    try{
        const response = await fetch(`http://localhost:${port}/board/${bookInfo.flight_id}`);
        const jsonData = await response.json(); 
        setBoardInfo(jsonData[0]); 
    }catch(err){
        alert(err.message); 
    }

}