document.addEventListener('DOMContentLoaded', () => {
  const div = document.getElementById('terminal');

  function typeText(div, text, delay = 5) {
    const formatted = text.replace(/\n/g, '\n')
    let i = 0

    const intervalId = setInterval(() => {
      if (i >= formatted.length) {
        clearInterval(intervalId)
        return;
      }

      div.innerHTML += formatted[i];
      i++;
      div.scrollTop = div.scrollHeight;

    }, delay);
  }

  function typeLines(div, text, lineDelay = 30, done) {
    const lines = text.split('\n');
    let i = 0;

    const intervalId = setInterval(() => {
      if (i >= lines.length) {
            clearInterval(intervalId);
            if (typeof done === 'function') done();
            return;
        }

        div.innerText += lines[i] + '\n';
        i++;

        div.scrollTop = div.scrollHeight;
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
  typeLines(div, headerArt, 45, () => {
    div.innerHTML += `Fetching report...\n`;
    div.scrollTop = div.scrollHeight;

        setTimeout(() => {
            fetch('/.netlify/functions/report')
                .then(res => res.text())            
                .then(text => {
                    div.innerHTML += '\n'
                    typeText(div, text, 5);
                })
                .catch(err => {
                  div.textContent += '\nError: ' + err.message;
            });
        }, 2500);
  });

})







