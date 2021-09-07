let payment = []; 
const tick_price = 700; 
const tax = 6.25/100; 
let discounts = 0; 
const port = 1385; 
const hostHttp = `http://143.198.141.21:${port}`
const setPayment = (data) => {
    payment = data;
}

// Use ticket number from input box to get boarding pass info
async function getPassengerPayment() {

    const book_ref = document.querySelector('#book-ref').value;
    try {
        const response = await fetch(`${hostHttp}/admin/payment/${book_ref}`);
        const jsonData = await response.json();

        if (Object.keys(jsonData).length > 0) {
            document.getElementById("payment-display").style.display = "block";
            document.getElementById("error-display").style.display = "none";
        } else {
            document.getElementById("payment-display").style.display = "none";
            document.getElementById("error-display").style.display = "block";
        }

        setPayment(jsonData);
        displayPayment();

    } catch (err) {
        document.getElementById("payment-display").style.display = "none";
        document.getElementById("error-display").style.display = "block";
        console.log(err.message);
    }
}


function calc_total(no_tick, discounts){
  let tick_prices = no_tick * tick_price; 
  return tick_prices + (tax*tick_price) - discounts; 
}

// function to display boarding pass
const displayPayment = () => {
    const paymentTable = document.querySelector('#payment-table');

    // display payment table by modifying the HTML in "payment-display"
    let tableHTML = "";
    payment.map(paymentInfo => {
        tableHTML +=
            `<th>${paymentInfo.book_ref}</th>
        <th>${paymentInfo.amount_per_tick}</th>
        <th>${paymentInfo.num_tickets}</th>
        <th>${paymentInfo.discount}</th>
        <th>${calc_total(paymentInfo.num_tickets, paymentInfo.discount)}</th>
    </tr>`;
    })
    paymentTable.innerHTML = tableHTML;
}
