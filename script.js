const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
// Usamos el formato CSV que es más simple y no suele fallar nunca
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

async function fetchData() {
    try {
        const response = await fetch(base);
        const csvText = await response.text();
        
        // Convertimos el CSV a filas
        const rows = csvText.split('\n').map(row => row.split(','));
        const app = document.getElementById('app');
        app.innerHTML = ''; 

        // Empezamos desde i=1 para saltar los encabezados
        for (let i = 1; i < rows.length; i++) {
            const [seccion, titulo, desc, link, imagen] = rows[i];

            if (titulo) {
                let mediaHTML = `<img src="${imagen}" style="width:100%;">`;
                
                // Limpiamos el link de posibles espacios o comillas
                const cleanLink = link.trim().replace(/"/g, '');
                
                if (cleanLink.includes('youtube.com') || cleanLink.includes('youtu.be')) {
                    const videoId = cleanLink.split('v=')[1] || cleanLink.split('/').pop();
                    mediaHTML = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                }

                app.innerHTML += `
                    <div class="item ${seccion.toLowerCase()}">
                        ${mediaHTML}
                        <h3>${titulo}</h3>
                        <p>${desc}</p>
                        <a href="${cleanLink}" target="_blank">Ver más</a>
                    </div>`;
            }
        }
    } catch (e) {
        console.error(e);
        document.getElementById('app').innerHTML = '<p>Error de acceso. Por favor, verificá que el Sheets esté "Publicado en la Web".</p>';
    }
}
fetchData();
