const dados = await fetch('./dados.json').then(r => r.json());

const ChartAlunos = document.getElementById('ChartOne'),
    ChartNotas = document.getElementById('ChartTwo');

let chartOne = new Chart(ChartAlunos, {
    type: 'pie',
    data: {
        labels: ['Veteranos', 'Calouros'],
        datasets: [{
            label: 'Quantidade de alunos',
            data: [12, 19, 3, 5, 2, 3],
        }]
    },
});

let chartTwo = new Chart(ChartNotas, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Maior nota dos 5 primeiros meses',
            data: [12, 19, 3, 5, 2, 3],
        }]
    },
});

function createChart(item) {
    chartOne.destroy();
    chartTwo.destroy();
}

let popupContent;

const map = L.map('map', {
    center: [-19.8, -40.6],
    zoom: 7,
    minZoom: 7,
    maxZoom: 8,
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
}).addTo(map);

for (let i = 0; i < dados.length; i++) {
    popupContent = /*html*/`<p>${dados[i].cidade.nome}</p>`;

    L.marker([dados[i].cidade.lat, dados[i].cidade.lon]).bindPopup(popupContent).addTo(map);
}

map.on('popupopen', function (e) {
    let marker = e.popup._source._popup._content,
        anchor = marker.substring(
            marker.indexOf('>') + 1,
            marker.lastIndexOf('</'));

    let item = dados.find(item => item.cidade.nome === anchor);

    createChart(item)
});