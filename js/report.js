// import {CronJob} from 'cron';

import dotenv from 'dotenv';
dotenv.config();


let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY

let endDate = new Date(today);
endDate.setDate(endDate.getDate() + 60);

let endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
let endDay = String(endDate.getDate()).padStart(2, '0');
let endYear = String(endDate.getFullYear()); 

const WEATHER_USER_AGENT = 'parking-tool-v3 (contact: ddudak@gmail.com)';

let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${endMonth}%2F${endDay}%2F${endYear}` 
const weatherUrl = 'https://api.weather.gov/gridpoints/OKX/35,34/forecast'
// const timeUrl = 'https://worldtimeapi.org/api/timezone/America/New_York' 

const parkingRequest = new Request(parkingUrl, {
         method: 'GET',
//     // REQUEST HEADERS
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': process.env.OCP_KEY
        }
        })

const weatherRequest = new Request(weatherUrl, {
        method: 'GET',
        headers: {
            'User-Agent': WEATHER_USER_AGENT
        }
})

async function getParking() {
    const   parkingResponse = await fetch(parkingRequest),
            parkingJSON = await parkingResponse.json();
        
            return parkingJSON;    
}

async function getWeather() {
    const   weatherResponse = await fetch(weatherRequest),
            weatherJSON = await weatherResponse.json()
            return {weatherJSON};
}

async function fetchAllData() {
    const   parkingJSON = await getParking(),
            {weatherJSON} = await getWeather();

            console.log('parking received, weather received. Returning results to formatters')
            return {parkingJSON, weatherJSON};
}

// use this to format all the parking dates
function dateFormatter(date) {
    const   year = Number(date.slice(0,4)),
            month = Number(date.slice(4,6)) - 1,
            day = Number(date.slice(6,8)),
            
            result = new Date(year, month, day);
            return result.toDateString()
}

function formatParking(parkingJSON) {                    
        // Two weeks 
        let clone = parkingJSON.days.slice(1,15);
        let twoWeeks = clone.map( day => {  
        return `\n${dateFormatter(day.today_id)} : ${day.items[0].status}`
    })
        //tomorrow date format
        let tomorrow = dateFormatter(parkingJSON.days[1].today_id)

        // Suspension Code
        let suspension = null;
        const  findSuspension = parkingJSON.days.find(day => day.items[0].status === 'SUSPENDED' );
            
            if (findSuspension) {
                const formatted = dateFormatter(findSuspension.today_id);
                suspension = {
                    day: formatted,
                    status: findSuspension.items[0].status,
                    reason: findSuspension.items[0].exceptionName,
                };
            } else {
                suspension = 'No upcoming suspensions in the next 60 days.'
            }

    return {
            details: parkingJSON.days[0].items[0].details,
            status: parkingJSON.days[0].items[0].status,
            tomorrowStatus: parkingJSON.days[1].items[0].status,
            type: parkingJSON.days[0].items[0].type,
            future: suspension,
            fourteenDays: twoWeeks,
            tomorrowDate: tomorrow
            }
    
    
}



function formatWeather(weatherJSON) {
    const   weather = weatherJSON,
            forecastUnformatted = weather.properties.periods[0].detailedForecast,
            forecast = forecastUnformatted.charAt(0).toLowerCase() + forecastUnformatted.slice(1);
            
    return {
            current: weather.properties.periods[0].name,
            forecast: forecast
            }
}





export async function combineAPIData() {
    // Get all raw JSON
    const   {parkingJSON, weatherJSON} = await fetchAllData(),

    // JSON >> objects
            parking = formatParking(parkingJSON), 
            weather = formatWeather(weatherJSON),

            //divide fields from objects
            {details, status, type, tomorrowStatus, future, fourteenDays, tomorrowDate} = parking,
            {current, forecast} = weather
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']


return `

+ + + + + + + + + + + + + + + + + + + +

\x1b[91mThe ASipP Report\x1b[0m.
${today}, New York City
Weather: ${current}, ${forecast}
        
Current:
Status: ${status}
Details: ${details} 
        
Tommorrow:
${tomorrowDate}, parking rules are: ${tomorrowStatus}

Next Suspension Date: (60 day range)
                      
${future ? future.day : 'No upcoming suspensions'}
Status: ${future.status}
Reason: ${future.reason}

Next two weeks:
${fourteenDays}

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Disclaimer:

This tool is provided for informational purposes only. While every effort is made to ensure the accuracy and timeliness of the data displayed, no guarantees are made regarding completeness, correctness, or real-time accuracy. Parking regulations, street signage, suspensions, and enforcement policies may change at any time and official posted signs always take precedence.

By using this report, you acknowledge and agree that:

You remain solely responsible for complying with all posted parking regulations.

You assume all risk for any parking tickets, fines, towing, or penalties incurred.

The developer of this tool bears no liability for errors, omissions, delays, incorrect data, or consequences resulting from reliance on the information provided.

If you need authoritative parking information, consult official NYC DOT / 311 sources or the physical signage at your parking location.
`
}




// console.log(combineAPIData())