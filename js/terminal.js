document.addEventListener('DOMContentLoaded', () => {
  const terminalDiv = document.getElementById('terminal');
  const headerDiv = document.getElementById('headerDiv');
  const introDiv = document.getElementById('introDiv');
  const reportDiv = document.getElementById('reportDiv');
  const loadingAnimation = document.getElementById('loadingAnimation')
  const dateDiv = document.getElementById('dateDiv');
  const weatherDiv = document.getElementById('weatherDiv');
  const todayDiv = document.getElementById('todayDiv');
  const tomorrowDiv = document.getElementById('tomorrowDiv');
  const nextSuspensionDiv = document.getElementById('nextSuspensionDiv');
  const twoWeeksDiv= document.getElementById('twoWeeksDiv');




  // By Character animation effect
  function typeChar(targetElement, text, speed, onComplete) {
    //clear line's content
    // targetElement.textContent = '';

    //character index count
    let index = 0;

    function step() {
      if (index < text.length) {
        const char = text[index];

        //add the next character
        targetElement.textContent += char;

        index += 1;

        //schedule the next character
        setTimeout(step, speed);
      } else {
        // when its done typing this string
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }

    // start typing
    step();
      }



  // By Line animation effect 
  function typeLines(targetElement, text, charSpeed, linePause, onComplete) {
    // split text into individual lines using \n
    const lines = text.split('\n');
    let lineIndex = 0; // which line we're on
    
    function showNextLine() {
      // if we've done all lines, run onComplete if provided
      if (lineIndex >= lines.length) {
        if (typeof onComplete === 'function') {
          onComplete();
        }
        return;
      }

      const line = lines[lineIndex];

      // append this whole line + newline
      targetElement.textContent += line + '\n';

      lineIndex += 1;

      // wait before showing the next line
      setTimeout(showNextLine, linePause);
    }

    // start with the first line
    showNextLine();
  }

   const headerArt =
 `



   ⠀⠀⠀⠀⠀      ⣀⡤⢄⡀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠶⠦⡞⢳⣶⡄⠙⡄⣀⣀⡀
⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⣠⣤⣹⡜⠛⠁⣠⠗⠛⠉⠙⢳⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠳⣄⣘⣟⠿⠋⠉⠉⠀⠀⠀⠀⢈⣿⡇
⠀⠀⠀⠀⠀⠀⣠⠾⠛⠉⠀⠀⠀⠀⠀⠀⣀⣠⣤⣴⠛⣟
⠀⠀⠀⠀⠀⣰⡇⣰⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⡄⠸⡇
⠀⠀⠀⠀⠀⢿⡀⠛⠻⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣇
⠀⠀⠀⠀⠀⠘⣷⡄⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⢀⡟
⠀⠀⠀⠀⠀⠀⠘⣿⣄⠀⠀⠈⠙⠻⠿⠿⠿⠟⠋⠀⢀⡾⠁
⠀⠀⠀⠀⠀⠀⠀⣿⠉⠻⢦⣄⣀⠀⠀⠀⠀⠀⢀⣰⢿⡇⠀
⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠈⠉⠉⠙⠚⠒⠀⠈⢀⠈⣇
⠀⠀⠀⠀⠀⠀⢰⠇⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆⢹⡄
⠀⠀⠀⠀⠀⢠⡿⢠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⠈⢧
⠀⠀⠀⠀⠀⣰⠃⣸⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀
⠀⠀⠀⠀⢼⡷⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⣄
⠀⠀⠀⢠⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣈⡓
⠀⣠⡶⢋⡄⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠚⣿⠍⢀⣀⠉:
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ :
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Alternate Side preParking report
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 █████╗ ███████╗██╗██████╗ ██████╗
██╔══██╗██╔════╝██║██╔══██╗██╔══██╗
███████║███████╗██║██████╔╝██████╔╝
██╔══██║╚════██║██║██╔═══╝ ██╔═══╝
██║  ██║███████║██║██║     ██║
╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚═╝
`

const headerTitle = `
Alternate Side preParking report
DREWD (2025)
(ASipP)
`;

const gitHub = `<a href="https://github.com/TheOpenC/parking-tool-v3">GitHub</a>`

const headerIntro = `
ASipP is a resource designed and maintained by Drew Dudak to help navigate future NYC Alternate Side Parking suspensions. The report provides current ASP status, tomorrow's status, a two-week summary, and upcoming suspensions with the intent of providing users with information for pre-parking to identify situations that allow for consecutive, multi-week ASP suspension parking spots. ASipP updates its report every 6 hours using Cron jobs via Netlify scheduled functions. These frequent updates account for sudden changes in parking information caused by weather or current events and provide additional current weather information for the NYC area. The report gets its information from the official NYC 311 Public API. It does not account for film + residential permits, street construction, or scheduled events. 
`;

const fetchingReport = `
Fetching report `;

function fetchAndShowReport() {
  const REPORT_URL = '/.netlify/functions/report'

  fetch(REPORT_URL)
    .then((response) => response.text())
    .then((html) => {
      reportDiv.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error fetching report:', error);
      reportDiv.textContent = 'Error loading report.'
    })
}

  // functions running
  typeLines(headerDiv, headerArt, 20, 40, () => {
    // after art finishes
    setTimeout(() => {
      typeLines(headerDiv, headerTitle, 4, 125, () => {
        // after title finishes
        setTimeout(() => {
          typeChar(introDiv, headerIntro, 1, () => {
            setTimeout(() => {
              typeChar(loadingAnimation, fetchingReport, 15, () => {
                function typeDot(count) {
                  if (count === 0) return; // stop after N dots

                  // add one dot slowly
                  typeChar(loadingAnimation, '.', 500, () => {
                    // when that dot is done, call typeDot again with one less
                    typeDot(count - 1);
                  });
                  fetchAndShowReport();
                }

                typeDot(5);
              });
            }, 500);
          })
          // this runs after the intro paragraph finishes typing
          // Fetching report ...
        }, 300)
      });
    }, 300)
    
  })

  // initial add event listener
})







