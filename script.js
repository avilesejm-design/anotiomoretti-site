const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

const app = document.getElementById('app');

async function fetchData() {
    try {
        const response = await fetch(base);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        app.innerHTML = ''; 

        rows.forEach(row => {
            const seccion = row.c[0] ? row.c[0].v : '';
            const titulo = row.c[1] ? row.c[1].v : '';
            const desc = row.c[2] ? row.c[2].v : '';
            const link = row.c[3] ? row.c[3].v : '';
            const imagen = row.c[4] ? row.c[4].v : '';

            let mediaHTML = '';

            // Lógica para detectar si es un video de YouTube
            if (link.includes('youtube.com') || link.includes('youtu.be')) {
                const videoId = link.split('v=')[1] || link.split('/').pop();
                mediaHTML = `
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" allowfullscreen></iframe>
                    </div>`;
            } else {
                // Si no es video, muestra la imagen de Cloudinary/ImgBB
                mediaHTML = `<img src="${imagen}" alt="${titulo}" style="width:100%;">`;
            }

            const card = `
                <div class="item ${seccion.toLowerCase()}">
                    ${mediaHTML}
                    <h3>${titulo}</h3>
                    <p>${desc}</p>
                    <a href="${link}" target="_blank">Ver más / Enlace externo</a>
                </div>
            `;
            app.innerHTML += card;
        });
    } catch (error) {
        console.error('Error:', error);
        app.innerHTML = '<p>Error al conectar con la base de datos.</p>';
    }
}

fetchData();
