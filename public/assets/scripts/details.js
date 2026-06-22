const API_BASE_URL = "http://localhost:3000/jogadores";

async function carregarDetalhes() {
    const container = document.getElementById("detalhe-jogador");
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = "<p class='error-msg'>Identificador do jogador não informado.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (response.status === 404) {
            container.innerHTML = "<p class='error-msg'>Jogador não encontrado em nossa base de dados.</p>";
            return;
        }
        if (!response.ok) throw new Error("Erro na comunicação com o servidor.");

        const jogador = await response.json();

        // Criando as linhas da tabela de conquistas de forma dinâmica com o Top 3
        let linhasTabela = "";
        if (jogador.conquistas && jogador.conquistas.length > 0) {
            jogador.conquistas.forEach(c => {
                linhasTabela += `
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #323238; color: #e1b12c; font-weight: bold;">${c.ano}</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #323238; color: #c4c4cc;">🥈 ${c.segundo}</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #323238; color: #c4c4cc;">🥉 ${c.terceiro}</td>
                    </tr>
                `;
            });
        } else {
            linhasTabela = `
                <tr>
                    <td colspan="3" style="padding: 15px; text-align: center; color: #8d8d99;">Nenhum histórico detalhado encontrado.</td>
                </tr>
            `;
        }

        container.innerHTML = `
            <div class="detail-wrapper">
                <img class="detail-img" src="${jogador.imagem}" alt="${jogador.titulo}">
                <div class="detail-info">
                    <span class="badge">${jogador.categoria}</span>
                    <h1 class="detail-title">${jogador.titulo}</h1>
                    <div class="card-price" style="margin-bottom: 15px; font-size: 1.1rem; color: #e1b12c; font-weight: bold;">Total de Bolas de Ouro: ${jogador.valor}</div>
                    <p class="detail-long-desc" style="line-height: 1.6; color: #c4c4cc; margin-bottom: 25px;">${jogador.descricaoCompleta}</p>
                    
                    <h3 style="margin-top: 30px; margin-bottom: 15px; color: #fff; border-bottom: 1px solid #323238; padding-bottom: 8px; font-size: 1.3rem;">Histórico do Pódio (Top 3)</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px; background-color: #1c1c1e; border-radius: 4px; overflow: hidden;">
                        <thead>
                            <tr style="background-color: #121214;">
                                <th style="padding: 12px 10px; color: #fff; font-weight: 600;">Ano</th>
                                <th style="padding: 12px 10px; color: #fff; font-weight: 600;">2º Lugar</th>
                                <th style="padding: 12px 10px; color: #fff; font-weight: 600;">3º Lugar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linhasTabela}
                        </tbody>
                    </table>

                    <h3 style="margin-top: 20px; margin-bottom: 12px; color: #fff; font-size: 1.1rem;">Características e Clubes relacionados:</h3>
                    <div class="chips-container" id="tags-container"></div>
                </div>
            </div>
        `;

        const tagsContainer = document.getElementById("tags-container");
        jogador.tags.forEach(tag => {
            const chipSpan = document.createElement("span");
            chipSpan.className = "chip";
            chipSpan.textContent = tag;
            tagsContainer.appendChild(chipSpan);
        });

    } catch (error) {
        console.error("Falha ao carregar detalhes:", error);
        container.innerHTML = "<p class='error-msg'>Erro técnico ao carregar as informações.</p>";
    }
}

document.addEventListener("DOMContentLoaded", carregarDetalhes);