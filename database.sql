


DROP TABLE IF EXISTS airport CASCADE;

DROP TABLE IF EXISTS boarding_passes CASCADE;

DROP TABLE IF EXISTS seats CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE;

DROP TABLE IF EXISTS ticket CASCADE;

DROP TABLE IF EXISTS ticket_flights CASCADE;

DROP TABLE IF EXISTS bookings CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS aircraft CASCADE; 

DROP TABLE IF EXISTS passenger CASCADE; 

DROP TABLE IF EXISTS payment CASCADE;

DROP TABLE IF EXISTS aircraft_seat CASCADE;  

DROP TABLE IF EXISTS seat_class CASCADE; 

DROP TABLE IF EXISTS boarding_flight CASCADE;

/*create tables*/
CREATE TABLE aircraft(
    aircraft_code char(3),
    model char(25),
    RANGE integer,
    meal boolean,
    movie boolean,
    PRIMARY KEY(aircraft_code),
    CONSTRAINT "flights_aircraft_code_fkey" FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code),
    CONSTRAINT "seats_aircraft_code_fkey" FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code) ON DELETE CASCADE
);

CREATE TABLE airport (
    airport_code char(3) NOT NULL,
    airport_name char(40),
    city_id SERIAL,
    coordinates point,
    timezone VARCHAR(20),
    PRIMARY KEY (airport_code),
    CONSTRAINT "city_country" FOREIGN KEY (city_id)
    REFERENCES location(city_id) ON DELETE CASCADE
);

CREATE TABLE flights (
    flight_id Char(6),
    scheduled_departure timestamp WITH time zone NOT NULL,
    scheduled_arrival timestamp WITH time zone NOT NULL,
    departure_airport character(3) NOT NULL,
    arrival_airport character(3) NOT NULL,
    STATUS character varying(20) NOT NULL,
    aircraft_code character(3) NOT NULL,
    seats_available integer NOT NULL,
    seats_booked integer NOT NULL,
    PRIMARY KEY(flight_id), 
    CONSTRAINT flights_aircraft_code_fkey FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code) ON DELETE CASCADE,
    CONSTRAINT flights_arrival_airport_fkey FOREIGN KEY (arrival_airport) REFERENCES airport(airport_code) ON DELETE CASCADE,
    CONSTRAINT flights_departure_airport_fkey FOREIGN KEY (departure_airport) REFERENCES airport(airport_code) ON DELETE CASCADE,
    CONSTRAINT flights_check CHECK ((scheduled_arrival > scheduled_departure)),
    /*
     CONSTRAINT flights_check1 CHECK (
         (
             (actual_arrival IS NULL)
             OR (
                 (actual_departure IS NOT NULL)
                 AND (actual_arrival IS NOT NULL)
                 AND (actual_arrival > actual_departure)
             )
         )
     ),
     */
    CONSTRAINT flights_status_check CHECK (
        (
            (STATUS)::text = ANY (
                ARRAY [('On Time'::character varying)::text, ('Delayed'::character varying)::text, ('Departed'::character varying)::text, ('Arrived'::character varying)::text, ('Scheduled'::character varying)::text, ('Cancelled'::character varying)::text]
            )
        )
    )
);





CREATE TABLE bookings (
    book_ref CHAR(6) PRIMARY KEY,
    flight_id CHAR(6), 
    book_date timestamp WITH time zone NOT NULL,
    no_tick integer NOT NULL, 
    contact_name text NOT NULL, 
    contact_phone VARCHAR(10) NOT NULL,
    contact_email text NOT NULL,
    STATUS character varying(10) NOT NULL,
    CONSTRAINT verify_status CHECK(STATUS = 'Active' OR STATUS = 'Inactive'), 
    CONSTRAINT flight_id_fkey FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE 
);




CREATE TABLE passenger(
    passenger_id VARCHAR(20) NOT NULL,
    passenger_name text NOT NULL,
    passenger_DOB TIMESTAMP NOT NULL, 
    passenger_nation char(20) NOT NULL,
    PRIMARY KEY (passenger_id)
);

CREATE TABLE ticket(
    ticket_no SERIAL PRIMARY KEY,
    book_ref CHAR(6) NOT NULL,
    passenger_id VARCHAR(20) NOT NULL,
    CONSTRAINT "ticket_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE,
    CONSTRAINT "ticket_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id) ON DELETE CASCADE
);


CREATE TABLE boarding_passes (
    boarding_no SERIAL PRIMARY KEY,
    ticket_no integer NOT NULL,
    seat_no character varying(4) NOT NULL,
    checked_bags integer,
    meal character varying(10), 
    check_in boolean, 
    CONSTRAINT boarding_passes_ticket_no_fkey FOREIGN KEY (ticket_no) REFERENCES ticket(ticket_no) ON DELETE CASCADE 
);

CREATE TABLE payment (
    payment_num SERIAL PRIMARY KEY, 
    book_ref CHAR(6) NOT NULL,
    amount_per_tick integer NOT NULL,
    num_tickets integer NOT NULL,
    credit_card VARCHAR(16) NOT NULL, 
    discount integer,
    CONSTRAINT payment_book_ref_fkey FOREIGN KEY (book_ref) REFERENCES bookings(book_ref) ON DELETE CASCADE
);



CREATE TABLE boarding_flight (
    flight_id CHAR(6) NOT NULL,
    d_boarding_time timestamp WITH time zone NOT NULL,
    d_gate varchar(4),
    baggage_claim varchar(3) NOT NULL, 
    CONSTRAINT boarding_flight_flight_if_fkey FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
);

/*airport table */
INSERT INTO airport
VALUES (
        'RUH',
        'King Khaled International',
        '190',
        NULL,
        'UTC+03:00'
    );

INSERT INTO airport
VALUES (
        'DCA',
        'Dulles International Airport',
        '234',
        NULL,
        'UTC-05:00'
    );

INSERT INTO airport
VALUES (
        'MAD',
        'Madrid International Airport',
        '208',
        NULL,
        'UTC+01:00'
    );

INSERT INTO airport
VALUES (
        'ARN',
        'Stockholm Arlanda Airport',
        '213', 
        NULL, 
        'UTC+01:00'
    );

INSERT INTO airport
VALUES (
        'TLV',
        'Ben Gurion Airport', 
        '106',
        NULL, 
        'UTC+02:00'
    );

/*aircraft*/
INSERT INTO aircraft
VALUES ('773', 'Boeing 777-300', 11100, TRUE, TRUE);

INSERT INTO aircraft
VALUES ('763', 'Boeing 767-300', 7900, TRUE, TRUE);

INSERT INTO aircraft
VALUES ('SU9', 'Boeing 777-300', 5700, FALSE, FALSE);

INSERT INTO aircraft
VALUES ('320', 'Boeing 777-300', 6400, FALSE, TRUE);

INSERT INTO aircraft
VALUES ('321', 'Boeing 777-300', 6100, FALSE, TRUE);



/*flights table*/
INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0010',
        '2020-11-10 09:50:00+03',
        '2020-11-10 14:55:00+03',
        'DCA',
        'MAD',
        'Scheduled',
        '773',
        50,
        0
    );

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0020',
        '2020-11-11 09:50:00+03',
        '2020-11-11 15:55:00+03',
        'MAD',
        'RUH',
        'Scheduled',
        '763',
        50,
        0
    );

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0030',
        '2020-11-11 09:50:00+03',
        '2020-11-11 16:55:00+03',
        'DCA',
        'ARN',
        'Scheduled',
        'SU9',
        50,
        0
    );

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0040',
        '2020-11-12 09:50:00+03',
        '2020-11-12 12:55:00+03',
        'ARN',
        'DCA',
        'Scheduled',
        '320',
        50,
        0
    );

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0050',
        '2020-11-12 09:50:00+03',
        '2020-11-12 12:55:00+03',
        'RUH',
        'TLV',
        'Scheduled',
        '321',
        50,
        0
    );

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
    'PG0060',
    '2020-11-13 09:50:00+03',
    '2020-11-13 12:55:00+03',
    'TLV',
    'DCA',
    'Scheduled',
    '773',
    50,
    0
);

INSERT INTO flights(flight_id , scheduled_departure , scheduled_arrival , departure_airport , arrival_airport , status ,aircraft_code, seats_available , seats_booked )
VALUES (
        'PG0070',
        '2020-11-14 09:50:00+03',
        '2020-11-14 12:55:00+03',
        'RUH',
        'MAD',
        'Scheduled',
        '763',
        50,
        0
    );



CREATE TABLE seat_class(seat_no CHAR(2), fare_condition Text, PRIMARY KEY(seat_no), CONSTRAINT valid_fare_condition CHECK(fare_condition = 'Business' OR fare_condition = 'Economy'));


INSERT INTO seat_class VALUES
    ('1A', 'Economy'), 
    ('1B', 'Economy'), 
    ('1C', 'Economy'), 
    ('1D', 'Economy'), 
    ('2A', 'Economy'), 
    ('2B', 'Economy'), 
    ('2C', 'Economy'), 
    ('2D', 'Economy'), 
    ('3A', 'Economy'), 
    ('3B', 'Economy'), 
    ('3C', 'Economy'), 
    ('3D', 'Economy'),
    ('3E', 'Economy'), 
    ('3F', 'Economy'),
    ('4A', 'Economy'), 
    ('4B', 'Economy'), 
    ('4C', 'Economy'), 
    ('4D', 'Economy'),
    ('4E', 'Economy'), 
    ('4F', 'Economy'),
    ('5A', 'Economy'), 
    ('5B', 'Economy'), 
    ('5C', 'Economy'), 
    ('5D', 'Economy'),
    ('5E', 'Economy'), 
    ('5F', 'Economy'),
    ('6A', 'Economy'), 
    ('6B', 'Economy'), 
    ('6C', 'Economy'), 
    ('6D', 'Economy'),
    ('6E', 'Economy'), 
    ('6F', 'Economy');





CREATE TABLE aircraft_seat(
    flight_id CHAR(6), 
    seat_no CHAR(2),
    status text, 
    PRIMARY KEY(flight_id,seat_no), 
    CONSTRAINT aircraft_seat_flightid_fkey FOREIGN KEY  (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE, 
    CONSTRAINT aircraft_seat_seatno_fkey FOREIGN KEY(seat_no) REFERENCES seat_class(seat_no) ON DELETE CASCADE, 
    CONSTRAINT valid_status CHECK(status = 'Occupied' OR status = 'Free')
    );