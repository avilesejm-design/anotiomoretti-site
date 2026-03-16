const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

// 1. Detectar qué sección queremos mostrar (sacado del link ?s=Nombre)
const params = new URLSearchParams(window.location.search);
const seccionActiva = params.get('s'); 

async function fetchData() {
    if (!seccionActiva) return; // Si es la Home, no hace nada (o maneja la lógica de Home)
    
    document.getElementById('titulo-seccion').innerText = seccionActiva;
    document.title = `N-PRDGM | ${seccionActiva}`;

    try {
        const response = await fetch(base);
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
        const app = document.getElementById('app');
        app.innerHTML = '';

        for (let i = 1; i < rows.length; i++) {
            const [sec, tit, desc, lnk, img] = rows[i].map(c => c ? c.replace(/"/g, '').trim() : '');
            
            // FILTRO CRÍTICO: Solo mostrar si coincide con la sección del link
            if (sec.toLowerCase() === seccionActiva.toLowerCase()) {
                let media = '';
                if (lnk.includes('youtube.com') || lnk.includes('youtu.be')) {
                    const vId = lnk.split('v=')[1] || lnk.split('/').pop();
                    media = `<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${vId}" frameborder="0" allowfullscreen></iframe></div>`;
                } else if (img) {
                    media = `<img src="${img}" alt="${tit}">`;
                }

                app.innerHTML += `
                    <div class="card-interna">
                        ${media}
                        <div class="info">
                            <h3>${tit}</h3>
                            <p>${desc}</p>
                            ${lnk ? `<a href="${lnk}" target="_blank" class="btn">Abrir Recurso</a>` : ''}
                        </div>
                    </div>`;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

fetchData();
