const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

// Captura qué sección pidió el usuario en el link
const urlParams = new URLSearchParams(window.location.search);
const seccionDestino = urlParams.get('s'); 

async function cargarContenido() {
    const res = await fetch(base);
    const texto = await res.text();
    const filas = texto.split('\n').map(f => f.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));

    const contenedor = document.getElementById('app');
    contenedor.innerHTML = '';

    filas.forEach((cols, index) => {
        if (index === 0) return; // Saltear encabezados
        
        const [seccion, titulo, desc, link, img] = cols.map(c => c.replace(/"/g, '').trim());

        // EL FILTRO MÁGICO:
        if (seccion.toLowerCase() === seccionDestino.toLowerCase()) {
            contenedor.innerHTML += `
                <div class="card-medieval">
                    ${img ? `<img src="${img}">` : ''}
                    <h3>${titulo}</h3>
                    <p>${desc}</p>
                    <a href="${link}" target="_blank">Ver más</a>
                </div>`;
        }
    });
}
cargarContenido();
