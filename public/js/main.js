const data = await fetch('./base.json').then(r => r.json()),
    cidades = await data.cidades,
    barCharts = await data.barCharts,
    lineCharts = await data.lineCharts,
    apiCharts = await data.charts;

const barChart = document.getElementById('barChart'),
    lineChart = document.getElementById('lineChart');

//gráficos iniciais
let chartOne = new Chart(barChart, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Valor Contratado (em milhões)',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

let chartTwo = new Chart(lineChart, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Superavit (em milhões)',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
});


//destruição e reconstrução a partir do mapa
function createChart(id) {
    chartOne.destroy();
    chartTwo.destroy();

    
    let labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

    chartOne = new Chart(barChart, {
        type: apiCharts[id].type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Contratado (em milhões)',
                data: barCharts[id].data,
                borderWidth: 1
            }],
        },
    });

     chartTwo = new Chart(lineChart, {
        type: apiCharts[id+1].type,
        data: {
            labels: labels,
            datasets: [{
              label: 'Superavit (em milhões)',
              data: barCharts[id].data,
            }]
        }
    });
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

for (let i = 0; i < cidades.length; i++) {

    popupContent = /*html*/`<p>${cidades[i].nome}</p>`;

    L.marker([cidades[i].lat, cidades[i].lon]).bindPopup(popupContent).addTo(map);
}


//map click event
map.on('popupopen', function (e) {
    let marker = e.popup._source._popup._content,
        anchor = marker.substring(
            marker.indexOf('>') + 1,
            marker.lastIndexOf('</'));

    let cidade = cidades.find(item => item.nome === anchor),
        cidadeId = cidade.id;

    createChart(cidadeId);

});


