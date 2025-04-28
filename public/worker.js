// public/worker.js
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start-worker').addEventListener('click', function() {
    try {
      const code = `
        self.onmessage = function(e) {
          console.log('Worker ejecutándose');
          self.postMessage('Datos procesados');
        };
      `;
      
      // Esto crea un worker en el mismo origen (no hay problema CORS)
      const blob = new Blob([code], {type: 'application/javascript'});
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      
      worker.onmessage = (e) => {
        console.log('Mensaje recibido del worker:', e.data);
      };
      
      worker.postMessage('Hola worker');
    } catch (e) {
      console.log('Worker bloqueado:', e);
    }
  });
});