const dados = await fetch('./dados.json').then(r => r.json());

const ChartAlunos = document.getElementById('ChartOne'),
    ChartNotas = document.getElementById('ChartTwo');

function sumUpStudents(item) {
    let veteranos = item.veteranos[0].qtd + item.veteranos[1].qtd,
        calouros = item.calouros[0].qtd + item.calouros[1].qtd;

    return [veteranos, calouros];
}

function getHighestGrades(item) {
    let notas = [
        ...item.veteranos[0].cinco_maiores_notas,
        ...item.veteranos[1].cinco_maiores_notas,
        ...item.calouros[0].cinco_maiores_notas,
        ...item.calouros[1].cinco_maiores_notas,
    ].slice(0, 5);

    return notas;
}

let chartOne = new Chart(ChartAlunos, {
    type: 'pie',
    data: {
        labels: ['Veteranos', 'Calouros'],
        datasets: [{
            label: 'Quantidade de alunos',
            data: [sumUpStudents(dados[0])[0], sumUpStudents(dados[0])[1]],
        }]
    },
});

let chartTwo = new Chart(ChartNotas, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Maiores notas dos 5 primeiros meses',
            data: [...getHighestGrades(dados[0])],
        }]
    },
});

function createChart(item, ano) {
    chartOne.destroy();
    chartTwo.destroy();

    document.getElementById('title').innerText = item.cidade.nome;

    let chartOneLabel = ['Veteranos', 'Calouros'],
        chartTwoLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

    let ChartOneData, ChartTwoData;

    switch (ano) {
        case 'todos':
            ChartOneData = [sumUpStudents(item)[0], sumUpStudents(item)[1]];
            ChartTwoData = [sumUpStudents(item)[0], sumUpStudents(item)[1]];
            break;

        case '2022':
            break;

        case '2021':
            break;
        default:
            break;
    }

    if (ano == 'todos') {

    } else { }

    chartOne = new Chart(ChartAlunos, {
        type: 'pie',
        data: {
            labels: chartOneLabel,
            datasets: [{
                label: 'Quantidade de alunos',
                data: ChartOneData,
            }],
        },
    });

    chartTwo = new Chart(ChartNotas, {
        type: 'bar',
        data: {
            labels: chartTwoLabel,
            datasets: [{
                label: 'Maior nota dos 5 primeiros meses',
                data: ChartTwoData,
            }]
        }
    });
};
createChart(dados[0], 'todos');  //graficos iniciais

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

    createChart(item, 'todos');
});

