// csp-tester/index.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();

const PORT = 3000;

// Tu servidor para recibir reportes CSP (actualiza esta URL)
// const CSP_REPORT_URL = 'http://localhost:8080/api/csp/report/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7ImlkIjoiOWY4YzFiN2UtNGQzYS00YzJlLThiN2YtM2ExZDJlNmY5YTVjIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Rlc3QifSwiaWF0IjoxNzQ1ODc5NTkwLCJleHAiOjE3NDU4OTAzOTB9.iqem1tC-xwwQBQS6wAlostiobw79o43BO0nUpZjAwAk';
 const CSP_REPORT_URL = "https://3rbfsmhx7h.execute-api.us-east-1.amazonaws.com/dev/monitor/82A2A444D4?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7fSwiaWF0IjoxNzQ3OTQzNjg5LCJleHAiOjE3NDc5NTQ0ODl9.AValNA_2HHryOxd2Bl0xIXmZ-4_gZrTso4gzDK6av-Q"
// DE3D9A642D
 //  82A2A444D4
// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions)); // Apply the CORS middleware

app.use((req, res, next) => {
  // Set the Report-To header (properly formatted)
  res.setHeader("Report-To", JSON.stringify({
    group: "csp-endpoint-1",
    max_age: 300, // 5 minutes in seconds 
    endpoints: [{ url: CSP_REPORT_URL }]
  }));
  
  // Set the Reporting-Endpoints header
  res.setHeader("Reporting-Endpoints", `csp-endpoint-1="${CSP_REPORT_URL}"`);
  
  // CSP policy with both report-uri and report-to
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
    `report-uri ${CSP_REPORT_URL}`,
    `report-to csp-endpoint-1`
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', cspPolicy);
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