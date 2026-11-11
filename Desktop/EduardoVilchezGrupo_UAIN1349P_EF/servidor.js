const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PUERTO = 3000;
const CARPETA_PUBLICA = path.join(__dirname, 'publico');
const ARCHIVO_CITAS = path.join(__dirname, 'datos', 'citas.json');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

// Función para escapar texto y evitar código malicioso
function escapar(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function responder(res, codigo, titulo, mensaje) {
  res.writeHead(codigo, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${titulo}</title></head><body><h1>${titulo}</h1><p>${mensaje}</p><p><a href="/">Volver al inicio</a></p></body></html>`);
}

// Servir archivos de la carpeta publico/
async function servirArchivo(res, rutaUrl) {
  try {
    const relativa = rutaUrl === '/' ? 'index.html' : decodeURIComponent(rutaUrl);
    const rutaArchivo = path.join(CARPETA_PUBLICA, relativa);
    if (!rutaArchivo.startsWith(CARPETA_PUBLICA + path.sep)) {
      return responder(res, 403, 'Acceso no permitido', 'Ruta no válida.');
    }
    const contenido = await fs.readFile(rutaArchivo);
    const tipo = TIPOS[path.extname(rutaArchivo)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(contenido);
  } catch {
    responder(res, 404, 'No encontrado', 'La página solicitada no existe.');
  }
}

// Leer datos del formulario que envía el cliente
function leerFormulario(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', (trozo) => {
      cuerpo += trozo;
      if (cuerpo.length > 10000) req.destroy();
    });
    req.on('end', () => resolve(new URLSearchParams(cuerpo)));
    req.on('error', reject);
  });
}

// Guardar la cita en datos/citas.json
async function guardarCita(cita) {
  let citas = [];
  try {
    citas = JSON.parse(await fs.readFile(ARCHIVO_CITAS, 'utf8'));
  } catch {}
  citas.push(cita);
  await fs.mkdir(path.dirname(ARCHIVO_CITAS), { recursive: true });
  await fs.writeFile(ARCHIVO_CITAS, JSON.stringify(citas, null, 2));
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Cuando el usuario envíe el formulario por POST a /citas
  if (req.method === 'POST' && url.pathname === '/citas') {
    const datos = await leerFormulario(req);
    const cita = {
      dueño: escapar(datos.get('dueño') || ''),
      celular: escapar(datos.get('celular') || ''),
      mascota: escapar(datos.get('mascota') || ''),
      servicio: escapar(datos.get('servicio') || ''),
      fecha: escapar(datos.get('fecha') || ''),
      hora: escapar(datos.get('hora') || ''),
      consentimiento: datos.get('consentimiento') === 'on',
      recibido: new Date().toISOString(),
    };
    await guardarCita(cita);
    return responder(res, 201, '¡Cita Registrada!', `Gracias ${cita.dueño}, hemos agendado el turno para ${cita.mascota}. Te contactaremos pronto.`);
  }

  if (req.method === 'GET') {
    return servirArchivo(res, url.pathname);
  }

  responder(res, 405, 'Método no permitido', 'Solo se permite GET y POST.');
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor de la veterinaria activo en http://localhost:${PUERTO}`);
});