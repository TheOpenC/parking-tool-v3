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

    const   red = '';
    const   green = "\x1b[48;5;2m\x1b[38;5;15m";
    const   yellowBlk = "\x1b[48;5;3m\x1b[38;5;16;1m"
    const   close = "\x1b[0m"
    const   twoClose = "\x1b\x1b[0m"




    

   
return `
+ + + + + + + + + + + + + + + + + + + +

The ASipP Report.
\x1b[38;5;200;1m${today}, New York City\x1b[0m
\x1b[38;5;15;4mWeather\x1b[0m: ${current}, ${forecast}
        
\x1b[38;5;15;4mToday\x1b[0m:
\x1b[48;5;3m\x1b[38;5;16;1m${status == "IN EFFECT" ? status : ""}\x1b\x1b${close}\x1b[48;5;2m\x1b[38;5;15m${status == "NOT IN EFFECT" || status == "SUSPENDED" ? status : ""}\x1b\x1b${close}
${details} 
        
\x1b[38;5;15;4mTomorrow\x1b[0m:
${tomorrowDate}
\x1b[48;5;2m\x1b[38;5;15m${tomorrowStatus}\x1b\x1b[0m

\x1b[38;5;15;4mNext Suspension Date\x1b[0m:           
${future ? future.day : 'No upcoming suspensions'}
${future.status}
${future.reason}

\x1b[38;5;15;4mNext two weeks\x1b[0m:
${fourteenDays}

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


`
}

// \x1b[38;5;15;3mDisclaimer: This report is for general information only.
// Parking rules, suspensions, and posted signs may change at any time, and official street signs always override this report.

// By using this tool, you agree that you are solely responsible for following all parking regulations.
// You assume all risk for any tickets, fines, or towing.
// The developer is not liable for errors, delays, or inaccuracies in the data.

// For official information, always check NYC DOT / 311 or the posted signage at your location.\x1b[0m


// console.log(combineAPIData())