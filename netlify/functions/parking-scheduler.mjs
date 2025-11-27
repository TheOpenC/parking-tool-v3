import { getStore } from "@netlify/blobs";

console.log('[scheduler] env check', {
  hasOcpKey: !!process.env.OCP_KEY,
});


// ================================================================
// ================================================================
//  HELPER FUNCTIONS (below)
// ================================================================
// ================================================================


//Globals for dates only.
let today = new Date();
let month = String(today.getMonth()+1).padStart(2, '0'); //MM
let day = String(today.getDate()).padStart(2, '0'); //DD
let year = String(today.getFullYear()); //YYYY

let endDate = new Date(today);
endDate.setDate(endDate.getDate() + 60);

let endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
let endDay = String(endDate.getDate()).padStart(2, '0');
let endYear = String(endDate.getFullYear()); 



// let parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${endMonth}%2F${endDay}%2F${endYear}` 


async function getParking() {
    
    const parkingUrl = `https://api.nyc.gov/public/api/GetCalendar?fromdate=${month}%2F${day}%2F${year}&todate=${endMonth}%2F${endDay}%2F${endYear}` 
    const parkingRequest = new Request(parkingUrl, {
            method: 'GET',
            // REQUEST HEADERS
            headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': process.env.OCP_KEY
            }
    })

    const   parkingResponse = await fetch(parkingRequest)

    if (!parkingResponse.ok) {
        throw new Error(`Parking API error: ${parkingResponse.status}`);
    }

    const   parkingJSON = await parkingResponse.json();
            return parkingJSON;


}

async function getWeather() {
    const   weatherUrl = 'https://api.weather.gov/gridpoints/OKX/35,34/forecast',
            WEATHER_USER_AGENT = 'parking-tool-v3 (contact: ddudak@gmail.com)';

    const   weatherRequest = new Request(weatherUrl, {
            method: 'GET',
            headers: {
            'User-Agent': WEATHER_USER_AGENT
            }
    })

    const   weatherResponse = await fetch(weatherRequest);

    if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const   weatherJSON = await weatherResponse.json();
            return weatherJSON;
}

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
            return `${dateFormatter(day.today_id)} : ${colorStatus(day.items[0].status)}`
        })
            //tomorrow date format
            let tomorrow = dateFormatter(parkingJSON.days[1].today_id)
            // Suspension Code
            let suspension = null;
            const  findSuspension = parkingJSON.days.find(
                day => day.items[0].status === 'SUSPENDED' 
            );
                
                if (findSuspension) {
                    const formatted = dateFormatter(findSuspension.today_id);
                    suspension = {
                        day: formatted,
                        status: findSuspension.items[0].status,
                        reason: findSuspension.items[0].exceptionName,
                    };
                } else {
                    suspension = null;
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
            forecast
            }
}
    
function colorStatus(status) {
        if (status === "IN EFFECT") {
            return `<span class="black hYellow">${status}</span>`
        } 
        if (status === "NOT IN EFFECT" || status === "SUSPENDED"){
            return `<span class="black hGreen">${status}</span>`
        } 
        return status;
}

function buildReport(parkingJSON, weatherJSON) {
    
    

    const   parking = formatParking(parkingJSON); 
    const   weather = formatWeather(weatherJSON);

    const {details, status, type, tomorrowStatus, future, fourteenDays, tomorrowDate} = parking;
    const {current, forecast} = weather;
    
    

        return `
        + + + + + + + + + + + + + + + + + + + +

        The ASipP Report.
        <span class="fuchsia">${today.toDateString()}</span>, New York City
        <span class="underline">Weather</span>: 
        ${current}, ${forecast}
                
        <span class="underline">Today</span>:
        ${colorStatus(status)}
        ${details} 
                
        <span class="underline">Tomorrow</span>:
        ${tomorrowDate}
        ${colorStatus(tomorrowStatus)}

        <span class="underline">Next Suspension Date</span>:           
        ${future ? future.day : 'No upcoming suspensions.'}
        ${future ? future.status : ''}
        ${future ? future.reason : ''}

        <span class="underline">Next Two Weeks</span>:
        ${fourteenDays.join('\n')}

        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


        `


   

}

// ++++++++++++++++++++++++++++++++++++++
// main scheduled handler
// ++++++++++++++++++++++++++++++++++++++
export default async function handler(req, context) {
    try {

        // fetch both data sets
    const [parkingData, weatherData] = await Promise.all([
        getParking(),
        getWeather(),
    ]);


    //(b) build the final text report
    const reportText = buildReport(parkingData, weatherData);


    // (c) write it into a blobs store
    const store = getStore('parking-reports');
    await store.set("latest-report.txt", reportText, {
        metadata: {
            generatedAt: new Date().toISOString(),
        },
    });

        return new Response('Report generated', { status: 200 });
    } catch (err) {
        console.error('Error in parking-scheduler:', err);
        return new Response("Scheduler error", { status: 500});
    }
}

// ++++++++++++++++++++++++++++++++++++++
// Schedule config
// ++++++++++++++++++++++++++++++++++++++

// tell netlify when to run 
export const config = {
    schedule: "@daily", 
}






// use this to format all the parking dates



// OLD XTERM OUTPUT WITH TERMINAL CODES FOR COLORS
// return `
// + + + + + + + + + + + + + + + + + + + +

// The ASipP Report.
// \x1b[38;5;200;1m${today}${close}, New York City
// \x1b[38;5;15;4mWeather${close}: 
// ${current}, ${forecast}
        
// \x1b[38;5;15;4mToday${close}:
// \x1b[48;5;3m\x1b[38;5;16;1m${status == "IN EFFECT" ? status : ""}${twoClose}\x1b[48;5;2m\x1b[38;5;15m${status == "NOT IN EFFECT" || status == "SUSPENDED" ? status : ""}${twoClose}
// ${details} 
        
// \x1b[38;5;15;4mTomorrow${close}:
// ${tomorrowDate}
// \x1b[48;5;3m\x1b[38;5;16;1m${tomorrowStatus == "IN EFFECT" ? tomorrowStatus : ""}${twoClose}\x1b[48;5;2m\x1b[38;5;15m${tomorrowStatus == "NOT IN EFFECT" || tomorrowStatus == "SUSPENDED" ? tomorrowStatus : ""}${twoClose}

// \x1b[38;5;15;4mNext Suspension Date${close}:           
// ${future ? future.day : 'No upcoming suspensions'}
// ${future.status}
// ${future.reason}

// \x1b[38;5;15;4mNext two weeks${close}:
// ${fourteenDays}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


// `









//disclaimer -- can be linked on the website rather than printed. 
// \x1b[38;5;15;3mDisclaimer: This report is for general information only.
// Parking rules, suspensions, and posted signs may change at any time, and official street signs always override this report.

// By using this tool, you agree that you are solely responsible for following all parking regulations.
// You assume all risk for any tickets, fines, or towing.
// The developer is not liable for errors, delays, or inaccuracies in the data.

// For official information, always check NYC DOT / 311 or the posted signage at your location.\x1b[0m


// console.log(combineAPIData())