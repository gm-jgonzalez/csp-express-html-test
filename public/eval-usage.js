

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('run-eval').addEventListener('click', function() {
        try {
          eval('console.log("Este código ejecutado con eval() debería ser bloqueado")');
        } catch (e) {
          console.log('Eval bloqueado como se esperaba:', e);
        }
      });
});


