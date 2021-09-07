module.exports = {
    getCountries: `SELECT * FROM location;`, 
    getAllflights: `SELECT * FROM flights ORDER BY flight_id;`, 
    queryGetFlights: `SELECT *, lD.city as departure_city, lA.city as arrival_city
    FROM 
    (
      SELECT *, A.city_id AS a_city_id, D.city_id AS d_city_id 
      FROM flights AS F
      INNER JOIN 
      airport AS D
      on F.departure_airport = D.airport_code
      INNER JOIN
      airport As A
      on arrival_airport = A.airport_code
    ) B
    INNER JOIN 
    location AS lD
    on B.d_city_id = lD.city_id
    INNER JOIN 
    location AS lA
    on B.a_city_id = lA.city_id`, 
    
    getFlightByID:`SELECT * FROM flights WHERE flight_id = $1 AND seats_available >= $2 `, 
    getPayByRef: `
    SELECT book_ref, amount_per_tick, num_tickets, discount
    FROM payment a 
    NATURAL JOIN 
    bookings b 
    WHERE a.book_ref=$1`,
    GetFlightByAvail:`
    SELECT *, L1.city as departure_city, L2.city as arrival_city
    FROM 
      (SELECT *, A1.city_id AS d_city_id, A2.city_id AS a_city_id
      FROM flights
      INNER JOIN airport A1
      on departure_airport = A1.airport_code
      INNER JOIN airport A2
      on arrival_airport = A2.airport_code
      WHERE seats_available >= $1 AND scheduled_departure > $2) F
      INNER JOIN location L1
      on F.d_city_id = L1.city_id
      INNER JOIN location L2
      on F.a_city_id = L2.city_id
      ORDER BY flight_id
    `,

    getFlightByLoc:  `
    SELECT * 
    FROM 
    (SELECT *, L1.city_id AS d_city_id, L2.city_id AS a_city_id, L1.city AS departure_city, L2.city AS arrival_city
    FROM 
    flights F
    JOIN airport A1 
    on departure_airport = A1.airport_code
    JOIN airport A2
    on arrival_airport = A2.airport_code 
    JOIN location L1
    on A1.city_id = L1.city_id
    JOIN location L2
    on A2.city_id = L2.city_id
    WHERE scheduled_departure::date = $1 AND scheduled_arrival::date = $2 AND seats_available >= $3) A WHERE A.a_city_id = $4 AND A.d_city_id = $5
    `, 
    verifyTicket: `
        SELECT * FROM ticket 
        WHERE book_ref LIKE $1 AND passenger_id LIKE $2
    `,

    getPassByBookRef: `
    SELECT * 
    FROM 
    passenger p
    JOIN 
    ticket t
    on t.passenger_id = p.passenger_id
    WHERE book_ref = $1`,

    getBookingInfo: `
    SELECT book_date, no_tick, contact_name, contact_phone,   contact_email, F.flight_id AS flight_id , scheduled_departure,   scheduled_arrival, A1.airport_name AS departure_airport, A2.airport_name AS arrival_airport, F.status AS flight_status
    FROM 
    bookings B
    JOIN
    flights F
    on B.flight_id = F.flight_id
    JOIN
    airport A1
    on F.departure_airport = A1.airport_code
    JOIN
    airport A2
    on F.arrival_airport = A2.airport_code
    WHERE Book_ref LIKE $1 AND B.status LIKE 'Active'
    `,

    seatsByFlight:`
    SELECT A.seat_no 
    FROM
    aircraft_seat A
    JOIN
    seat_class C
    ON A.seat_no = C.seat_no
    WHERE flight_id = $1 AND fare_condition = $2 AND status LIKE 'Free'
    `,
    boardingByFlight:`
    SELECT * 
    FROM 
    boarding_flight
    WHERE
    flight_id = $1
    
    `, 
    passengerByFlight:`
    SELECT T.ticket_no, P.passenger_id, P.passenger_name 
    FROM 
    bookings B
    JOIN 
    ticket T
    ON B.book_ref = T.book_ref
    JOIN 
    passenger P
    ON T.passenger_id = P.passenger_id
    WHERE B.flight_id = $1
    `,

    seatByTick :`
    SELECT seat_no 
    FROM
    ticket T
    JOIN
    boarding_passes B
    ON B.ticket_no = T.ticket_no
    WHERE T.ticket_no = $1
    `,

    getAircrafts:`
    SELECT
    aircraft_code, model
    From 
    aircraft
    `,
    getAirports:`
    SELECT
    airport_code, airport_name
    FROM
    airport
    `,
    getNumSeats:`
    SELECT
    seats_available
    FROM 
    flights 
    WHERE flight_id = $1
    `,
    getAllSeats:`
    SELECT seat_no 
    FROM 
    seat_class;`,
    insertSeat:
    `INSERT INTO aircraft_seat 
    VALUES($1, $2, 'Free');`
    , 


    //923820218 

        }