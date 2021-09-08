# airline-webapp

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#files">Files</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About 

This project serves to function as a real-time airline website where users can explore available flights, book tickets, and check in; for any number of people. 

There is also functionality for employees of this airline to check on the status and availability of a particular flight, add a new flight to the system, and retrieve a confirmation of payment for a particular ticket or group of tickets. 

The web application allows for multiple users to explore and book flights concurrently, with transactions in place to prevent errors occurring such as two customers booking the same seat on a flight. The goal of this project was to achieve seamless communication between the user and the database.

### Built With

* Javascript
* Postregsql
* NodeJS

### Files
* app.js: started file that initializes connection to database 
* airline_webapp_ER.pdf: Entity Relationship model of database. 
* Public: 
    * assets: contains images used 
    * views: html files 
    * scripts: js files used by html 
    * stylesheets
* Server: 
    * routes: API routes used by and for html 
    * database: 
         * db.js: configuration for database 
         * database.sql: queries used in database to create and populate tables.
         * query.js: query syntax used to interact database
         * transaction.js: transaction syntax used to interact with database 
    * controller: 
         * get.js/getall.js/post.js: functions that used by routes that uses query.js and transaction.js


<!-- GETTING STARTED -->
## Getting Started

The webapp can be accessed directly at [http://143.198.141.21:1385](http://143.198.141.21:1385). 

To run locally follow steps below. 

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install 
  ```
* nodeJS
  ```sh
  npm i node
  ```

### Installation

1. Install prerequisites to machine 
2. Clone the repo
   ```sh
   git clone https://github.com/lmalhaim/airline-webapp
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Start server
   ```sh
   npm start
   ```
5. Go to localhost url [http://localhost:1385](http://localhost:1385)

<!-- CONTACT -->
## Contact

Lynn Alhaimy - leen.alhaimy@gmail.com

Project Link: [https://github.com/lmalhaim/airline-webapp](https://github.com/lmalhaim/airline-webapp)

