//<---- BOOKING/Customer info ---->
const tick_price = 700; 
const tax = 6.25/100; 
const discounts = 0; 
const port = 1385; 
const localHost = 'localhost'; 
const http = '143.198.141.21'; 
const hostHttp = `http://${localHost}:${port}`;


let passgs; 
let payment = {}; 
let contact = {}; 

const set_no_ticket = (data) => {
  localStorage.setItem("no_ticket", JSON.stringify(data));
  localStorage.setItem("no_pass", "1"); 
}


const set_book_ref = (data) => {
  localStorage.setItem("book_ref", JSON.stringify(data));
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

//Calculate booking total
function calc_total(no_tick, discounts) {
  let tick_prices = no_tick * tick_price;
  return tick_prices + (tax * tick_prices) - discounts;
}

//booking banner/ booking page
function cost_onload() {
  const a_city = localStorage.getItem("a_city").replace(/['"$]+/g, "");
  const d_city = localStorage.getItem("d_city").replace(/['"$]+/g, "");
  const a_date = new Date(
    localStorage.getItem("a_date").replace(/['"$]+/g, "")
  );
  const d_date = new Date(
    localStorage.getItem("d_date").replace(/['"$]+/g, "")
  );

  const flightinfo = document.querySelector(".flight-container");

  //format dates

  let scheduled_departure = d_date.toString();
  scheduled_departure =
    scheduled_departure.split(" ")[1] +
    " " +
    scheduled_departure.split(" ")[2] +
    " " +
    scheduled_departure.split(" ")[3] +
    " " +
    scheduled_departure.split(" ")[4];

  let scheduled_arrival = a_date.toString();
  scheduled_arrival =
    scheduled_arrival.split(" ")[1] +
    " " +
    scheduled_arrival.split(" ")[2] +
    " " +
    scheduled_arrival.split(" ")[3] +
    " " +
    scheduled_arrival.split(" ")[4];

  flightinfo.innerHTML = `
    <div class = "flight-bg">
      <div id = "city" class = "flight-info" > 
      ${d_city}
      </div>
      <div id = "date" class = "flight-info" > 
      ${scheduled_departure}
      </div>
      <div id = "city" class = "flight-info"> 
      ${a_city}
      </div>
      <div id ="date" class = "flight-info" > 
      ${scheduled_arrival}
      </div>
    </div>
   `;

  var no_tick = parseInt(
    localStorage.getItem("no_ticket").replace(/['"$]+/g, "")
  );

  const pass_container = document.querySelector("#travel-docs");

  let temp_container = "";

  for (let i = 1; i <= no_tick; i++) {
    temp_container += `
      <label class = "pass-label" for = ".pass-input"> Passenger ${i} </label>
      <div class = "pass-input" id = "pass-${i}" > 
        <div class = "mid">
          <select class = "input-box"> 
            <option class = prefix-op value = "NULL"> - </option>
            <option class = "prefix-op" value = "Mr" > Mr</option>
            <option class = "prefix-op" value = "Ms"> Ms</option>
            <option class = "prefix-op" value = "Mrs"> Mrs</option>
          </select>
          <input class = "input-box" type = "text" placeholder="First Name" id = "pass-fname">
          <input class = "input-box" type = "text"  placeholder="Last Name" id = "pass-lname">
          <label class = "date-label" for= "pass-dob">
            Birthdate
          </label>
          <input class = "input-box"  type = "date" placeholder = "mm-dd-yyyy" id = "pass-dob" >
        </div>
      
        <div class = "btm">
          <input class = "input-box" type = "text" placeholder="Identification Number" id = "id-num">
          <input class = "input-box" type = "text" placeholder="Country of Issue" id = "nationality">
          <label class = "date-label" for="id-exp">Expiration Date</label>
          <input class = "input-box"  type = "date" placeholder = "mm-dd-yyyy" id = "id-exp" > 
        </div>
      </div> `;
  }
  pass_container.innerHTML = temp_container;

  //payment container
  const pay_table = document.querySelector(".price-table");
  pay_table.querySelector("#price_pc").innerHTML = `+ $${tick_price}`;
  pay_table.querySelector("#tax").innerHTML = `+ $${tax * 100}%`;
  pay_table.querySelector("#discount").innerHTML = `- $${discounts}`;
  pay_table.querySelector("#total").innerHTML = `$${calc_total(
    no_tick,
    discounts
  )}`;
}

//Send booking confirmation
function confirmation() {
  const book_ref = localStorage.getItem("book_ref");
  const confirm_text = document.querySelector(".text-box");
  confirm_text.innerHTML += `
      <span> Bookref: ${book_ref}</span>
      <br></br>
      <span> please type down your bookref</span>
  
    `;
  //Fix Above ^
}

//add booking to DB
async function post_booking() {
  try {
    const tickets = parseInt(
      localStorage.getItem("no_ticket").replace(/['"$]+/g, "")
    );
    const flight_id = localStorage.getItem("flight_id").replace(/['"$]+/g, "");
    const body = {
      flight_id: flight_id,
      no_ticket: tickets,
      pass: passgs,
      cont: contact,
      pay: payment,
    };
    const response = await fetch(
      `${hostHttp}/booking`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )
    const jsonData = await response.json()
    if (jsonData.length != 0) {
        set_book_ref(jsonData);
        document.location.href = "bookSubmit";
        return false;
    } else {
        alert("Your booking was not submitted, please try again");
        return true;
    }
      
  } catch (err) {
    return alert("err:" + err.message);
  }
}

function submit() {
  return post_booking();
}

//Verify booking info
function verify(container, value, i, opt) {
  //opt 0: none , 1: date (BD), 2: date (exp), 3: id, 4: card num
  var error = 0;
  let now = new Date();
  if (opt == 1) {
    let date = new Date(value);
    let legal_age = 18;
    let legal_date = new Date(
      now.getFullYear() - legal_age,
      now.getMonth(),
      now.getDay()
    );
    if (date > legal_date) {
      alert(
        `Passenger ${i} Error: You must be 18 years or older to book a ticket!`
      );
      error++;
    }
  } else if (opt == 2) {
    let date = new Date(value);
    if (date <= now) {
      if (i != 0) {
        alert(
          `Passenger ${i} Error: The id expiration date entered is invalid!`
        );
      } else {
        alert("The card expiration date entered is invalid");
      }
      error++;
    }
  } else if (opt == 3) {
    if (value.length > 10 || value.length < 8) {
      // id must be max 10 digits
      alert(`Passenger ${i} Error: The ID number entered is invalid!`);
      error++;
    }
  } else if (opt == 4) {
    if (value.length > 12 || value.length < 8) {
      alert(`The card number entered is invalid!`);
      error++;
    }
  } else if (opt == 5) {
    if (value.length != 10) {
      alert(`The contact number entered is invalid!`);
      error++;
    }
  }
  //null values
  if (value == "NULL" || value == "" || error != 0) {
    container.style["border"] = "3px solid orange ";
    error++;
  }
  return error;
}

//Review booking info
function review() {
  var errors = 0;
  var no_tick = parseInt(
    localStorage.getItem("no_ticket").replace(/['"$]+/g, "")
  );
  passgs = [];
  let pass_cont, prefix, fname, lname, DOB, id_no, nation, id_exp, passg;
  //verify passenger input fields
  for (var i = 1; i <= no_tick; i++) {
    pass_cont = document.querySelector(`#pass-${i}`);

    prefix_cont = pass_cont.querySelector("select");
    prefix = prefix_cont.value;
    errors += verify(prefix_cont, prefix, i, 0);

    fname_cont = pass_cont.querySelector("#pass-fname");
    fname = fname_cont.value;
    errors += verify(fname_cont, fname, i, 0);

    lname_cont = pass_cont.querySelector(`#pass-lname`);
    lname = lname_cont.value;
    errors += verify(lname_cont, lname, i, 0);

    DOB_cont = pass_cont.querySelector(`#pass-dob`);
    DOB = DOB_cont.value;
    errors += verify(DOB_cont, DOB, i, 1);

    id_no_cont = pass_cont.querySelector(`#id-num`);
    id_no = id_no_cont.value;
    errors += verify(id_no_cont, id_no, i, 3);

    nation_cont = pass_cont.querySelector(`#nationality`);
    nation = nation_cont.value;
    errors += verify(nation_cont, nation, i, 0);

    id_exp_cont = pass_cont.querySelector("#id-exp");
    id_exp = id_exp_cont.value;
    errors += verify(id_exp_cont, id_exp, i, 2);

    passg = { prefix, fname, lname, DOB, id_no, nation, id_exp };
    setpassgs(passg);
  }
  //Verify contact fields
  contact_cont = document.querySelector("#contact");
  ctname_cont = contact_cont.querySelector("#cont-name");
  ctname = ctname_cont.value;
  errors += verify(ctname_cont, ctname, 0, 0);
  ct_nom_cont = contact_cont.querySelector("#cont-num");
  ct_nom = ct_nom_cont.value;
  errors += verify(ct_nom_cont, ct_nom, 0, 5);
  ct_email_cont = contact_cont.querySelector("#cont-email");
  ct_email = ct_email_cont.value;
  errors += verify(ct_email_cont, ct_email, 0, 0);

  setcontact({ ctname, ct_nom, ct_email });
  //Verify Payments fields
  pay_cont = document.querySelector("#pay-container");
  cname_cont = pay_cont.querySelector("#card-name");
  cname = cname_cont.value;
  errors += verify(cname_cont, cname, 0, 0);
  c_nom_cont = pay_cont.querySelector("#card-num");
  c_nom = c_nom_cont.value;
  errors += verify(c_nom_cont, c_nom, 0, 4);
  c_exp_cont = pay_cont.querySelector("#card-exp");
  c_exp = c_exp_cont.value;
  errors += verify(c_exp_cont, c_exp, 0, 2);

  setpayment({ cname, c_nom, c_exp });

  if (errors != 0) {
    alert("Please fix highlighted fields");
    return false;
  }
  return submit();
}
