document.addEventListener('DOMContentLoaded', () => {
  const div = document.getElementById('terminal');

  // -- create header and report cotnainers --
  const headerDiv = document.createElement('div');
  const reportDiv = document.createElement('div')

  headerDiv.id = 'headerDiv';
  reportDiv.id = 'reportDiv';

  terminal.appendChild(headerDiv);
  terminal.appendChild(reportDiv);

  // By Character animation effect
  function typeText(target, text, delay = 5) {
    const formatted = text.replace(/\n/g, '\n')
    let i = 0

    const intervalId = setInterval(() => {
      if (i >= formatted.length) {
        clearInterval(intervalId);
        if (typeof done === 'function') done();
        return;
      }

      // dynamic -- element's innHTML
      target.innerHTML += formatted[i];
      i++;
      target.scrollTop = target.scrollHeight;
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  }

  // figure out a way of using a special character to pause the typing momentarily for information headings, ... if char == specialChar {delay 10}. // blink effect would be nice too.

  // By Line animation effect 
  function typeLines(target, text, lineDelay = 30, done) {
    const lines = text.split('\n');
    let i = 0;

    const intervalId = setInterval(() => {
      if (i >= lines.length) {
            clearInterval(intervalId);
            if (typeof done === 'function') done();
            return;
        }

        // Dynamic for any element
        target.innerHTML += lines[i] + '\n';
        i++;

        target.scrollTop = target.scrollHeight;
        terminal.scrollTop = terminal.scrollHeight;
    }, lineDelay);
  }

   const headerArt =
 `



         ⠀⠀⠀⠀⠀⣀⡤⢄⡀
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

Alternate Side preParking report
DREWD (2025)
(ASipP)

ASipP is a resource designed and maintained by Drew Dudak for navigating future NYC Alternate Side Parking suspensions. The report provides current ASP status, tomorrow's status, two week summary and upcoming suspensions with the intent on providing users information for pre-parking to hit consecutive, multi-week ASP suspensions. ASipP gets its information from the official NYC 311 Public API. It does not account for film + residential permits, street construction, or scheduled events. It does include the weather for the next 6 hours 'cus why not?
`;

  // functions running
  typeLines(headerDiv, headerArt, 45, () => {
    reportDiv.innerHTML += `\nFetching report...\n`;

        setTimeout(() => {
            fetch('/.netlify/functions/report')
                .then(res => res.text())            
                .then(text => {
                    reportDiv.innerHTML += '\n'
                    typeText(div, text, 5);
                })
                .catch(err => {
                  reportDiv.textContent += '\nError: ' + err.message;
            });
        }, 2500);
  });

})







