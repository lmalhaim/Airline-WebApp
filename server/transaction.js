module.exports = {
  queryInsertBook: `
    INSERT INTO bookings(book_ref,flight_id, book_date, no_tick,  contact_name, contact_phone, contact_email, status)
        VALUES($1, $2, $3, $4, $5, $6, $7, 'Active');`,

  queryInsertTick: `
    INSERT INTO ticket(book_ref, passenger_id)
        VALUES($1,$2);`, //trip no == 1 for now, change when set up

  queryInsertPass: `
    INSERT INTO passenger
        VALUES($1, $2, $3, $4);`,

  queryInsertPay: `
    INSERT INTO payment(book_ref, amount_per_tick, num_tickets, credit_card, discount)
        VALUES($1,$2,$3,$4, $5); 
    `,

  queryUpdateAS: `
    UPDATE flights SET seats_booked = seats_booked + $1 ,seats_available = seats_available - $1 WHERE flight_id = $2;
    `,
  queryCheckSeat: `SELECT * FROM aircraft_seat WHERE flight_id = $1 AND seat_no = $2 AND status LIKE 'Free'`,
  queryOccupySeat: `
    UPDATE aircraft_seat SET status = 'Occupied' WHERE flight_id = $1 AND seat_no = $2
    `,
  postBoardingPass: `
    INSERT INTO boarding_passes
    VALUES 
    ($1, $2, $3, $4,$5, true)
    `,
  queryInsertFlight: `
    INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        'Scheduled',
        $6,
        $7,
        0
    )
    `,
  queryInsertFlightBoard: `
    INSERT INTO boarding_flight
    VALUES(
        $1, 
        $2,
        $3,
        $4
    )
    `,
};

//REMOVE num_tickets it is dependent on book_ref
