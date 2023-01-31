import * as Charts from '../js/functions/charts.js'

const dados = await fetch('./dados.json').then(r => r.json());

// Charts.createChart(dados[0], 'todos', 'todos');  //graficos iniciais

const visibleList = document.getElementById('visibleList');
function pullMapCities() {
    let bounds = map.getBounds();
    visibleList.innerHTML = '';

    let visibleMarkers = [];


    allMarkers.forEach(each => {
        let isInBounds = bounds.contains(each._latlng)

        if (isInBounds) {
            let visibleCity = document.createElement('li');
            visibleMarkers.push(each);

            let itemVisivel = dados.find(item =>
                item.cidade.lat === each._latlng.lat &&
                item.cidade.lon === each._latlng.lng);

            visibleCity.innerHTML = /*html*/`
                <div></div>
                <a>${itemVisivel.cidade.nome}</a>
            `;

            visibleList.appendChild(visibleCity);
        }
    })

    if (!visibleMarkers.length) {
        for (let i = 0; i < dados.length; i++) {
            let visibleCity = document.createElement('li');

            visibleCity.innerHTML = /*html*/`
                <div></div>
                <a>${dados[i].cidade.nome}</a>
            `;

            visibleList.appendChild(visibleCity);
        }
    }
}

//MAPA
let popupContent;

const map = L.map('map', {
    center: [-19.8, -40.6],
    zoom: 9,
    minZoom: 7,
    maxZoom: 10,
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
}).addTo(map);

let allMarkers = [];
for (let i = 0; i < dados.length; i++) {
    popupContent = /*html*/`<p>${dados[i].cidade.nome}</p>`;

    let marker = L.marker([dados[i].cidade.lat, dados[i].cidade.lon]).bindPopup(popupContent).addTo(map);
    allMarkers.push(marker)
}

pullMapCities()

let anoInput = document.getElementById('ano'),
    alunoInput = document.getElementById('alunos');

map.on('popupopen', function (e) {
    let marker = e.popup._source._popup._content,
        anchor = marker.substring(
            marker.indexOf('>') + 1,
            marker.lastIndexOf('</'));

    let item = dados.find(item => item.cidade.nome === anchor);
    Charts.createChart(item, 'todos', alunoInput.value);
});

anoInput.addEventListener('input', () => {
    let item = dados.find(item => item.cidade.nome === Charts.cidadeTitulo.innerText);
    Charts.createChart(item, anoInput.value, alunoInput.value)
})

alunoInput.addEventListener('input', () => {
    let item = dados.find(item => item.cidade.nome === Charts.cidadeTitulo.innerText);
    Charts.createChart(item, anoInput.value, alunoInput.value)
})


let chartSection = document.querySelector('.chart');
const backButton = document.getElementById('back');

function clickCityLinks() {
    let allLinks = visibleList.querySelectorAll('li a');
    allLinks.forEach(e => {
        e.addEventListener('click', (evt) => {
            visibleList.style.display = 'none';
            backButton.style.display = 'block';

            let cidadeClicada = dados.find(item => item.cidade.nome === evt.currentTarget.innerText);

            Charts.createChart(cidadeClicada, 'todos', 'todos');

            chartSection.style.display = 'flex';
        })
    })
}
clickCityLinks()

map.on('moveend', function (e) {
    pullMapCities();
    clickCityLinks()
});

backButton.addEventListener('click', () => {
    visibleList.style.display = 'flex';
    chartSection.style.display = 'none';
    backButton.style.display = 'none';

})