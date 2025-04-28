// csp-tester/index.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();

const PORT = 3000;

// Tu servidor para recibir reportes CSP (actualiza esta URL)
const CSP_REPORT_URL = 'http://localhost:8080/api/csp/report/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7ImlkIjoiOWY4YzFiN2UtNGQzYS00YzJlLThiN2YtM2ExZDJlNmY5YTVjIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Rlc3QifSwiaWF0IjoxNzQ1ODQ4MDk4LCJleHAiOjE3NDU4NTg4OTh9.GJXtWQGHZ1jyhlsVn_Tpqv8X1FkGNZX8sOSienLNNdU';

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Apply the CORS middleware

// Middleware para configurar CSP
app.use((req, res, next) => {
  // Política CSP restrictiva para probar violaciones
  const cspPolicy = [
    "default-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self'",
    "child-src 'self'",
    "worker-src 'none'",
    `report-uri ${CSP_REPORT_URL}`
  ].join('; ');


  // Content-Security-Policy:
  // default-src 'self';
  // script-src 'self' https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com;
  // style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  // frame-src https://www.youtube.com https://www.google.com;
  // font-src 'self' https://fonts.gstatic.com;
  // connect-src 'self' https://www.google-analytics.com;
  // img-src 'self' data: https://www.google-analytics.com;


  res.setHeader('Content-Security-Policy', cspPolicy)
  next();
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para páginas de ejemplo específicas
app.get('/test/:testCase', (req, res) => {
  const { testCase } = req.params;
  res.sendFile(path.join(__dirname, 'public', 'tests', `${testCase}.html`));
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir un archivo JavaScript con un MIME type incorrecto
app.get('/malicious-script.txt', (req, res) => {
  // Establecer explícitamente el encabezado Content-Type
  res.setHeader('Content-Type', 'text/plain');
  // Importante: deshabilitar cualquier detección de MIME type automática
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(`
    console.log("Este es un script JavaScript servido como text/plain");
    alert("Script malicioso ejecutado con MIME type incorrecto");
  `);
});

app.listen(PORT, () => {
  console.log(`CSP Test App running at http://localhost:${PORT}`);
});