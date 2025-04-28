// public/fake-image.jpg
// Este archivo tiene extensión .jpg pero contiene código JavaScript
// El navegador intentará ejecutarlo como JavaScript si el tipo MIME no se verifica

console.log("Script ejecutado desde un archivo .jpg");
alert("Este script no debería ejecutarse debido a la política CSP");