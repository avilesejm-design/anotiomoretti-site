const sheetId = '13Qqp0VlWF94msoKVss6cRxKvtpxkpds_5V4wdIGPmfE';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

async function fetchData() {
    try {
        const response = await fetch(base);
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
        const app = document.getElementById('app');
        app.innerHTML = ''; 

        // Organizador de secciones
        const secciones = {
            'Inicio': [],
            'Cursos': [],
            'Historial': [],
            'Descargables': [],
            'Amigas': []
        };

        // Clasificar datos
        for (let i = 1; i < rows.length; i++) {
            const [sec, tit, desc, lnk, img] = rows[i].map(c => c ? c.replace(/"/g, '').trim() : '');
            if (secciones[sec]) {
                secciones[sec].push({ tit, desc, lnk, img });
            }
        }

        // Renderizar cada sección con su propio estilo
        for (const [nombre, items] of Object.entries(secciones)) {
            if (items.length === 0) continue;

            const sectionHTML = document.createElement('section');
            sectionHTML.className = `modulo-${nombre.toLowerCase()}`;
            sectionHTML.innerHTML = `<h2>${nombre}</h2><div class="grid-${nombre.toLowerCase()}"></div>`;
            const grid = sectionHTML.querySelector('div');

            items.forEach(item => {
                let media = '';
                if (item.lnk.includes('youtube.com') || item.lnk.includes('youtu.be')) {
                    const vId = item.lnk.split('v=')[1] || item.lnk.split('/').pop();
                    media = `<div class="video-wrap"><iframe src="https://www.youtube.com/embed/${vId}" frameborder="0" allowfullscreen></iframe></div>`;
                } else if (item.img) {
                    media = `<img src="${item.img}" alt="${item.tit}">`;
                }

                grid.innerHTML += `
                    <div class="card">
                        ${media}
                        <div class="info">
                            <h3>${item.tit}</h3>
                            <p>${item.desc}</p>
                            ${item.lnk ? `<a href="${item.lnk}" target="_blank" class="btn">Explorar</a>` : ''}
                        </div>
                    </div>`;
            });
            app.appendChild(sectionHTML);
        }
    } catch (e) {
        console.error(e);
        app.innerHTML = '<p>Sincronizando el ecosistema...</p>';
    }
}
fetchData();
