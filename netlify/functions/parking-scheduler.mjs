import { getStore } from "@netlify/blobs";

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

const nyTime = today.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
});


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
            return `<span class="black hRed">${status}</span>`
        } 
        if (status === " NOT IN EFFECT " || status === " SUSPENDED "){
            return `<span class="black hLime">${status}</span>`
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
<span class="black hWhite">${today.toDateString()} @ ${nyTime}</span>, New York City

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

+ + + + + + + + + + + + + + + + + + + +
`

}
// ++++++++++++++++++++++++++++++++++++++
// main scheduled handler
// +++++++++++++++++++++++++++++++++++++++
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
    schedule: "0 */6 * * *", 
}
