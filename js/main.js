
let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY

let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${+month + 1}%2F${day}%2F${year}`

fetch(parkingUrl, {
    method: 'GET',
    // REQUEST HEADERS
    headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.API_KEY}
    })


    .then(data => {
        console.log(data)
        console.log(data.text())
    })
    .catch(err => {
        console.log(`error ${err}`)
    })

    