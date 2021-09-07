
const express = require('express'); 
const homeRouter = express.Router(); 
const path = require('path'); 
const get = require('../controller/get');
const getAll = require('../controller/getAll');
const post = require('../controller/post');   



//Render html 
const mainDir = path.dirname(path.dirname(__dirname)); 

homeRouter.use("/", express.static(path.join(mainDir , 'public/views/index/'))); 
homeRouter.use("/searchFlight", express.static(path.join(mainDir , 'public/views/index/searchFlight.html'))); 
homeRouter.use("/bookFlight", express.static(path.join(mainDir , 'public/views/index/bookFlight.html'))); 
homeRouter.use("/checkIn", express.static(path.join(mainDir , 'public/views/index/checkIn.html'))); 
homeRouter.use("/bookSubmit", express.static(path.join(mainDir , 'public/views/index/bookSubmit.html'))); 
homeRouter.use("/boardPass", express.static(path.join(mainDir , 'public/views/index/boardPass.html'))); 
homeRouter.use("/boardSubmit", express.static(path.join(mainDir , 'public/views/index/boardSubmit.html'))); 

//DB interact
homeRouter.get("/world_list", getAll.countries);
homeRouter.get("/flights", getAll.flights);
homeRouter.get("/flights/:id", get.flightsByAvail);
homeRouter.get("/flights/:id/:d_city&:a_city/:d_date&:a_date", get.flightsByLocation);
homeRouter.post("/booking", post.booking);
homeRouter.post("/boarding", post.boarding);
homeRouter.get("/ticket/:pass_id&:book_ref", get.ticketByPass);
homeRouter.get("/ticket/:book_ref", get.ticketByRef);
homeRouter.get("/seats/:flight_id/:fare_condition",get.seatsByFlight);
homeRouter.get("/booking/:book_ref", get.bookByRef);
homeRouter.get("/boarding/:flight_id", get.flightBoardInfo);

module.exports = homeRouter; 
