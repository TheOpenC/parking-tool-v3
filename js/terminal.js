document.addEventListener('DOMContentLoaded', () => {
  const terminalEl = document.getElementById('terminal');

  const term = new Terminal({
    convertEol: true,
    wordWrap: true
    // no rows/cols here – fit will handle it
  });

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);

  term.open(terminalEl);

  // 🔑 This makes xterm match the #terminal size
  fitAddon.fit();

  // Optional: refit when browser window resizes
  window.addEventListener('resize', () => fitAddon.fit());

  term.writeln('🚗 ASP Pre-Parking Tool');
  term.writeln('Fetching report...\r\n');

  fetch('http://localhost:3001/api/report')
    .then(res => res.text())
    .then(text => term.writeln(text.replace(/\n/g, '\r\n')))
    .catch(err => term.writeln('Error: ' + err.message));
});
