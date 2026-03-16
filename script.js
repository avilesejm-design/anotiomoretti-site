const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
// Usamos la exportación básica que no pide autenticación extra
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=0`;

async function fetchData() {
    try {
        const response = await fetch(base);
        if (!response.ok) throw new Error('Error en respuesta de red');
        const data = await response.text();
        
        const rows = data.split('\n');
        const app = document.getElementById('app');
        app.innerHTML = ''; 

        // Empezamos en 1 para saltear encabezados
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split que respeta comas dentro de comillas
            
            if (cols.length >= 2 && cols[1]) {
                const seccion = cols[0] ? cols[0].replace(/"/g, '') : '';
                const titulo = cols[1].replace(/"/g, '');
                const desc = cols[2] ? cols[2].replace(/"/g, '') : '';
                const link = cols[3] ? cols[3].replace(/"/g, '').trim() : '';
                const imagen = cols[4] ? cols[4].replace(/"/g, '').trim() : '';

                let mediaHTML = '';
                if (link.includes('youtube.com') || link.includes('youtu.be')) {
                    const videoId = link.split('v=')[1] || link.split('/').pop();
                    mediaHTML = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                } else {
                    mediaHTML = `<img src="${imagen || 'https://via.placeholder.com/300'}" style="width:100%;">`;
                }

                app.innerHTML += `
                    <div class="item ${seccion.toLowerCase()}">
                        ${mediaHTML}
                        <h3>${titulo}</h3>
                        <p>${desc}</p>
                        <a href="${link}" target="_blank">Ver más</a>
                    </div>`;
            }
        }
    } catch (e) {
        console.error("Error detallado:", e);
        document.getElementById('app').innerHTML = '<p>Cargando... si el error persiste, refrescá con Ctrl+F5.</p>';
    }
}
fetchData();
