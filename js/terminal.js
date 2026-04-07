document.addEventListener('DOMContentLoaded', () => {
  const terminalDiv = document.getElementById('terminal');
  const headerDiv = document.getElementById('headerDiv');
  const projectDiv = document.getElementById('projectDiv');
  const reportDiv = document.getElementById('reportDiv');
  const loadingAnimation = document.getElementById('loadingAnimation')
  const dateDiv = document.getElementById('dateDiv');
  const weatherDiv = document.getElementById('weatherDiv');
  const todayDiv = document.getElementById('todayDiv');
  const tomorrowDiv = document.getElementById('tomorrowDiv');
  const nextSuspensionDiv = document.getElementById('nextSuspensionDiv');
  const twoWeeksDiv= document.getElementById('twoWeeksDiv');


  function keepBottom() {
      const doc = document.documentElement;
      const body = document.body;

      const fullHeight = Math.max(
        doc.scrollHeight,
        body.scrollheight
      );

      // wait til the page is taller than the viewport (ie has data filling the page.)
      if (doc.scrollHeight > window.clientHeight) {
        window.scrollTo(0, doc.scrollHeight);
      }
    }



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

        // Keep newest content in view once data has filled the container.
        keepBottom();

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

  // render html after text loads
  function typeCharThenRenderHTML(targetElement, html, speed, onComplete) {
    //create text-only version for typinig animation
    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    const plain = tmp.textContent || tmp.innerText || '';
    // Type the plain text
    targetElement.textContent = '';
    typeChar(targetElement, plain, speed, () => {
      // Swap in html so link becomes clickable
      targetElement.innerHTML = html;

      if (typeof onComplete === 'function') onComplete();
    });
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
      
      // keep newest content in view 
      keepBottom()

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

 █████╗ ███████╗██╗██████╗ ██████╗
██╔══██╗██╔════╝██║██╔══██╗██╔══██╗
███████║███████╗██║██████╔╝██████╔╝
██╔══██║╚════██║██║██╔═══╝ ██╔═══╝
██║  ██║███████║██║██║     ██║
╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚═╝
`

// 
// Alternate Side preParking Report

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

const headerTitle = `
Alternate Side preParking Report
DREWD (2026)
(ASipP)
`;

const gitHub = `<a href="https://github.com/TheOpenC/parking-tool-v3">GitHub</a>`

const projectDescription = `
ASipP is a resource designed and maintained by Drew Dudak to help navigate future NYC Alternate Side Parking suspensions. The report provides current ASP status, tomorrow's status, a two-week summary, and upcoming suspensions. ASipP updates its report every 10 min, 24 hours a day to account for changes in weather and current events. The report gets its information from the official NYC 311 Public API. It does not account for film + residential permits, street construction, or scheduled events.

This site is best utilized on mobile by adding the link to your Home Screen:

[↑] share, [+] Add to Home Screen 
or
Run as Web app

To see more projects or get in touch:
<a href="https://primary-materials.io" target="_blank" rel="noopener noreferrer">
primary-materials.io
</a>
`;

const fetchingReport = `
Fetching report `;

function fetchAndShowReport() {
  const REPORT_URL = '/.netlify/functions/report'

  // Adding return. Original did not have Returnnn

  return fetch(REPORT_URL)
    .then((response) => response.text())
    .then((html) => {
      reportDiv.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error fetching report:', error);
      reportDiv.textContent = 'Error loading report.';
    });
}

  // NEW VERSION
  typeLines(headerDiv, headerArt, 20, 40, () => {
    setTimeout(() => {
      typeLines(headerDiv, headerTitle, 4, 125, () => {
        setTimeout(() => {
          typeChar(loadingAnimation, fetchingReport, 15, () => {
            
            function typeDot(count) {
              if (count === 0) return;

              typeChar(loadingAnimation, '.', 150, () => {
                typeDot(count - 1);
              });  
            }
            // Gimme 5 dots
            typeDot(3);
            setTimeout(() => {

              fetchAndShowReport().then(() => {
                loadingAnimation.textContent = '';
              });
          
              setTimeout(() => {
                // type the description at the bottom
                typeCharThenRenderHTML(projectDiv, projectDescription, 1);
              }, 2000)

            }, 1500)
          })
        }, 500)
      })  
    }, 300)
  })

   
  });
   

  






