// Configuración de la base de datos
const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE' ;
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

const app = document.getElementById('app');

// Función para traer los datos
async function fetchData() {
    try {
        const response = await fetch(base);
        const text = await response.text();
        // Limpiamos el JSON que devuelve Google
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        app.innerHTML = ''; // Limpiamos el cargando...

        rows.forEach(row => {
            const seccion = row.c[0] ? row.c[0].v : '';
            const titulo = row.c[1] ? row.c[1].v : '';
            const desc = row.c[2] ? row.c[2].v : '';
            const link = row.c[3] ? row.c[3].v : '';
            const imagen = row.c[4] ? row.c[4].v : '';

            // Creamos la estructura visual para cada ítem
            const card = `
                <div class="item ${seccion.toLowerCase()}">
                    <img src="${imagen}" alt="${titulo}" style="width:100%; max-width:300px;">
                    <h3>${titulo}</h3>
                    <p>${desc}</p>
                    <a href="${link}" target="_blank">Ver más / Acceder</a>
                </div>
            `;
            app.innerHTML += card;
        });
    } catch (error) {
        console.error('Error cargando datos:', error);
        app.innerHTML = '<p>Error al conectar con la base de datos.</p>';
    }
}

fetchData();
