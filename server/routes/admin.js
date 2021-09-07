
const express = require('express'); 
const adminRouter = express.Router(); 
const path = require('path'); 
const getAll = require('../controller/getAll'); 
const post = require('../controller/post'); 
const get = require('../controller/get'); 

//Render Html
const mainDir = path.dirname(path.dirname(__dirname)); 

adminRouter.use("/", express.static(path.join(mainDir,'public/views/admin/')));
adminRouter.use("/home", express.static(path.join(mainDir,'public/views/admin/admin.html')));
adminRouter.use("/addFlight", express.static(path.join(mainDir,'public/views/admin/addFlight.html')));
adminRouter.use("/flightStatus", express.static(path.join(mainDir,'public/views/admin/flightStatus.html')));
adminRouter.use("/trackPay", express.static(path.join(mainDir,'public/views/admin/trackPay.html')));




//DB interact
adminRouter.get("/aircrafts", getAll.aircrafts);
adminRouter.get("/airports", getAll.airports);
adminRouter.post("/flight", post.flight);
adminRouter.get("/payment/:ref", get.paymentByRef);
adminRouter.get("/passengers/:flight_id", get.passOnFlight);
adminRouter.get("/seats/:tick_no", get.seatsOfTicket);

module.exports= adminRouter; 