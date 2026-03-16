const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

// Detectamos la sección desde la URL (ej: seccion.html?s=Historial)
const params = new URLSearchParams(window.location.search);
const seccionActiva = params.get('s');

async function cargarPortal() {
    if (!seccionActiva) return;

    document.getElementById('titulo-pagina').innerText = seccionActiva;
    
    try {
        const response = await fetch(base);
        const csv = await response.text();
        const filas = csv.split('\n').map(f => f.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
        const app = document.getElementById('app');
        
        app.innerHTML = '';

        filas.forEach((col, i) => {
            if (i === 0) return;
            const [sec, tit, desc, lnk, img] = col.map(c => c ? c.replace(/"/g, '').trim() : '');

            // Si la sección en el Sheets coincide con la URL...
            if (sec.toLowerCase() === seccionActiva.toLowerCase()) {
                let mediaHTML = '';
                
                // Si es video de YouTube
                if (lnk.includes('youtube.com') || lnk.includes('youtu.be')) {
                    const vId = lnk.split('v=')[1] || lnk.split('/').pop();
                    mediaHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-bottom:15px;border:2px solid var(--oro-viejo);">
                                    <iframe src="https://www.youtube.com/embed/${vId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
                                 </div>`;
                } else {
                    mediaHTML = `<img src="${img || 'https://via.placeholder.com/400x250'}" style="width:100%; border:2px solid var(--oro-viejo); margin-bottom:15px;">`;
                }

                app.innerHTML += `
                    <article class="organic-card">
                        ${mediaHTML}
                        <h4 style="font-family:'MedievalSharp';color:var(--oro-viejo);margin-bottom:10px;">${tit}</h4>
                        <p>${desc}</p>
                        ${lnk ? `<a href="${lnk}" target="_blank" class="btn" style="display:inline-block; margin-top:15px; font-size:0.7rem;">Abrir</a>` : ''}
                    </article>`;
            }
        });
    } catch (e) {
        console.error("Error cargando el portal:", e);
    }
}

cargarPortal();
