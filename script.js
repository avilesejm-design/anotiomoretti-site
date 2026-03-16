const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE'; // <--- ASEGURATE QUE SEA ESTE
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

const app = document.getElementById('app');

async function fetchData() {
    try {
        const response = await fetch(base);
        const text = await response.text();
        // Esta línea corta el texto raro que manda Google para dejar solo el JSON
        const data = JSON.parse(text.substring(47).slice(0, -2));
        const rows = data.table.rows;

        app.innerHTML = ''; 

        rows.forEach(row => {
            // Verificamos que la fila no esté vacía antes de procesar
            if (row.c && row.c[1]) {
                const seccion = row.c[0] ? row.c[0].v : '';
                const titulo = row.c[1] ? row.c[1].v : '';
                const desc = row.c[2] ? row.c[2].v : '';
                const link = row.c[3] ? row.c[3].v : '';
                const imagen = row.c[4] ? row.c[4].v : '';

                let mediaHTML = '';
                if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
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
        });
    } catch (error) {
        console.error("Error detallado:", error);
        app.innerHTML = '<p>Error de conexión. Verificá el ID y la Publicación del Sheets.</p>';
    }
}
fetchData();
