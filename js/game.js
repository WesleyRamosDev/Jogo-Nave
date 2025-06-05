window.onload = function() {
  
  // 1) Referências 
  
  const areaJogo     = document.getElementById("areaJogo");
  const elementoNave = document.getElementById("nave");

  // Dimensão área de jogo 
  const larguraArea = 400;
  const alturaArea  = 600;

  
  // 2) Propriedades da Nave
  
  const larguraNave  = 40;    
  const alturaNave   = 60;    
  let posicaoXNave   = (larguraArea - larguraNave) / 2;
  let posicaoYNave   = alturaArea - alturaNave - 20;  
  let velocidadeNave = 7;     

  // Posicionada corretamente no início
  elementoNave.style.left = posicaoXNave + "px";
  elementoNave.style.top  = posicaoYNave + "px";

  
  // 3) Controle de Teclas
  
  let pressionouEsquerda = false;
  let pressionouDireita  = false;

  document.addEventListener("keydown", function(e) {
    // seta esquerda ou tecla “A/a”
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      pressionouEsquerda = true;
    }
    // seta direita ou tecla “D/d”
    else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      pressionouDireita = true;
    }
  });

  document.addEventListener("keyup", function(e) {
    // seta esquerda ou tecla “A/a” solta
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      pressionouEsquerda = false;
    }
    // seta direita ou tecla “D/d” solta
    else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      pressionouDireita = false;
    }
  });

  
  // 4) Configuração dos Meteoros
  
  const larguraMeteoro = 50;   
  const alturaMeteoro  = 50;   
  let listaMeteoros    = [];   

  let velocidadeBaseMeteoro   = 3;    
  let intervaloBaseMeteoro    = 1000; 

  const intervaloMinimoMeteoro = 500;  
  const velocidadeMaxMeteoro   = 10;   

  let ultimaCriacaoMeteoro = Date.now();


  // 5) Timer e Pontuação
  
  let tempoInicio  = Date.now();
  let pontuacao    = 0;
  let jogoTerminou = false;


  // 6) Criar um novo Meteoro
  
  function criarMeteoro() {
    
    const xInicial = Math.random() * (larguraArea - larguraMeteoro);
    const yInicial = -alturaMeteoro; 
    const vel      = velocidadeBaseMeteoro;

    // Cria o elemento meteoro
    const elementoMeteoro = document.createElement("img");
    elementoMeteoro.src   = "images/meteoro.png";
    elementoMeteoro.className = "meteoro";
    elementoMeteoro.style.left = xInicial + "px";
    elementoMeteoro.style.top  = yInicial + "px";

    areaJogo.appendChild(elementoMeteoro);

    listaMeteoros.push({
      elemento: elementoMeteoro,
      x: xInicial,
      top: yInicial,
      vel: vel
    });

    ultimaCriacaoMeteoro = Date.now();
  }

 
  // 7) Atualizar Meteoros (movimentação e remoção)
  
  function atualizarMeteoros() {
    listaMeteoros.forEach(function(m) {
      m.top += m.vel;
      m.elemento.style.top = m.top + "px";
    });

    listaMeteoros = listaMeteoros.filter(function(m) {
      if (m.top > alturaArea) {
        // Saiu da tela → remove do DOM e incrementa a pontuação
        areaJogo.removeChild(m.elemento);
        pontuacao++;
        return false;
      }
      return true;
    });
  }


  // 8) Verificar Colisão Nave × Meteoro
  
  function verificarColisao() {
    for (let m of listaMeteoros) {
      if (
        posicaoXNave < m.x + larguraMeteoro &&
        posicaoXNave + larguraNave > m.x &&
        posicaoYNave < m.top + alturaMeteoro &&
        posicaoYNave + alturaNave > m.top
      ) {
        acabarJogo();
        return;
      }
    }
  }

  function acabarJogo() {
    jogoTerminou = true;
    alert("Game Over! Sua pontuação: " + pontuacao);
    location.reload();
  }

  
  // 9) Ajustar Dificuldade Conforme o Tempo
  
  function ajustarDificuldade() {
    const segundosDecorridos = Math.floor((Date.now() - tempoInicio) / 1000);

    // Aumenta a velocidade de queda dos meteoros 
    velocidadeBaseMeteoro = Math.min(
      velocidadeMaxMeteoro,
      3 + segundosDecorridos * 0.1
    );

    // Diminui o intervalo entre meteoros
    intervaloBaseMeteoro = Math.max(
      intervaloMinimoMeteoro,
      2000 - segundosDecorridos * 50
    );
  }

  
  // 10) Atualizar Timer e Pontuação
  
  function atualizarHud() {
    const elementoTimer = document.getElementById("timer");
    const elementoScore = document.getElementById("score");
    const segundos      = Math.floor((Date.now() - tempoInicio) / 1000);

    elementoTimer.textContent = "Tempo: " + segundos + "s";
    elementoScore.textContent = "Pontuação: " + pontuacao;
  }

  
  // 11) Loop Principal do Jogo
  
  function atualizarJogo() {
    if (jogoTerminou) return;

    // Ajusta dificuldade antes de tudo
    ajustarDificuldade();

    // Movimento da nave apenas para esquerda e direita
    if (pressionouEsquerda && posicaoXNave > 0) {
      posicaoXNave -= velocidadeNave;
    }
    if (pressionouDireita && posicaoXNave < larguraArea - larguraNave) {
      posicaoXNave += velocidadeNave;
    }
    elementoNave.style.left = posicaoXNave + "px";
    // posicaoYNave permanece fixo, já que não há movimento vertical

    // Cria um meteorozinho se já passou o intervalo
    if (Date.now() - ultimaCriacaoMeteoro > intervaloBaseMeteoro) {
      criarMeteoro();
    }

    // Atualiza posição e remoção dos meteoros
    atualizarMeteoros();

    // Verifica colisões
    verificarColisao();

    // Atualiza o HUD (tempo + pontuação)
    atualizarHud();

    // Pede o próximo quadro
    requestAnimationFrame(atualizarJogo);
  }

  
  // 12) Inicia o Jogo
  
  atualizarJogo();
};
