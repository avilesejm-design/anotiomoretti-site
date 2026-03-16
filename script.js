const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
// Pedimos el formato CSV, que es el más compatible
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

async function fetchData() {
    try {
        const response = await fetch(base);
        const data = await response.text();
        
        // Convertimos el texto CSV en un array de filas
        const rows = data.split('\n').map(row => row.split(','));
        const app = document.getElementById('app');
        app.innerHTML = ''; 

        // Empezamos en i=1 para saltear los encabezados
        for (let i = 1; i < rows.length; i++) {
            const [seccion, titulo, desc, link, imagen] = rows[i];

            if (titulo && titulo.trim() !== "") {
                let mediaHTML = '';
                const cleanLink = link ? link.trim().replace(/"/g, '') : '';
                const cleanImg = imagen ? imagen.trim().replace(/"/g, '') : '';

                // Detectamos video de YouTube
                if (cleanLink.includes('youtube.com') || cleanLink.includes('youtu.be')) {
                    const videoId = cleanLink.split('v=')[1] || cleanLink.split('/').pop();
                    mediaHTML = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                } else {
                    mediaHTML = `<img src="${cleanImg || 'https://via.placeholder.com/300'}" style="width:100%;">`;
                }

                app.innerHTML += `
                    <div class="item ${seccion.toLowerCase()}">
                        ${mediaHTML}
                        <h3>${titulo.replace(/"/g, '')}</h3>
                        <p>${desc.replace(/"/g, '')}</p>
                        <a href="${cleanLink}" target="_blank">Ver más</a>
                    </div>`;
            }
        }
    } catch (e) {
        console.error("Error de carga:", e);
        document.getElementById('app').innerHTML = '<p>Error al conectar. Por favor actualizá la página.</p>';
    }
}

fetchData();
