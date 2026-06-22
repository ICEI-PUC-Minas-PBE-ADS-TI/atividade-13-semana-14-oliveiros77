const API_BASE_URL = "http://localhost:3000/jogadores";

async function carregarDados() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Erro ao buscar dados do servidor.");
        
        const jogadores = await response.json();
        
        jogadores.sort((a, b) => b.valor - a.valor);
        
        renderizarCards(jogadores);
        criarGrafico(jogadores);

    } catch (error) {
        console.error("Erro na aplicação:", error);
        document.getElementById("container-cards").innerHTML = "<p class='error-msg'>Erro ao carregar dados do servidor.</p>";
    }
}

function renderizarCards(jogadores) {
    const container = document.getElementById("container-cards");
    container.innerHTML = "";

    jogadores.forEach(jogador => {
        const cardHtml = `
            <div class="card">
                <img src="${jogador.imagem}" alt="${jogador.titulo}">
                <div class="card-content">
                    <span class="badge">${jogador.categoria}</span>
                    <h2 class="card-title">${jogador.titulo}</h2>
                    <p class="card-desc">${jogador.descricaoCurta}</p>
                    <div class="card-price">Quantidade de Prêmios: ${jogador.valor}</div>
                    <a href="details.html?id=${jogador.id}" class="btn-detalhes">Ver detalhes</a>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function criarGrafico(jogadores) {
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    
    const nomes = jogadores.map(j => j.titulo);
    const quantidades = jogadores.map(j => j.valor);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Total de Bolas de Ouro',
                data: quantidades,
                backgroundColor: '#e1b12c',
                borderColor: '#cbad1b',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#323238' },
                    ticks: { color: '#a4a4ac', stepSize: 1 }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a4a4ac' }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", carregarDados);