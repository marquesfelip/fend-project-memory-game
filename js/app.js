let array = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf',
  'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle',
  'fa-paper-plane-o', 'fa-cube'
];

const jogadas = document.getElementsByClassName('jogadas');
const LI_ARRAY = document.getElementsByClassName('card');
const tempo = document.getElementsByClassName('temporizador');
const estrelas = document.getElementsByClassName('fa-star');
const bsClassesCards = 'card justify-content-center align-items-center m-2';

let tempoDeJogo;

let cartasAbertas = [],
  cartasClicadas = [];

let segundos = 0,
  minutos = 0,
  totalCartasCombinadas = 0,
  jogada = 0;

iniciarJogo();

function iniciarJogo() {
  array = shuffle(array);

  Array.from(LI_ARRAY).forEach(function (element, index) {
    element.innerHTML = `<i class="fa ${array[index]}"></i>`
  });

  Array.from(LI_ARRAY).forEach(function (element) {
    virarCarta(element);
    setTimeout(() => {
      desvirarCarta(element);

    }, 2000);
  });

  Array.from(LI_ARRAY).forEach(function (element, index) {
    element.addEventListener('click', function () {

      const conteudo = element.innerHTML.trim();

      if (cartasClicadas.length === 2) {
        return;
      } else if (cartasAbertas.length > 0 && cartasAbertas.length < 2 && !(cartasClicadas.includes(index))) {
        if (!(element.classList.contains('match'))) {
          virarCarta(element);
          memorizarCartas(conteudo, index);
          combinarCartas();
          acrescentarJogada();
        }
      } else if (cartasAbertas.length <= 2 && !(cartasClicadas.includes(index))) {
        if (!(element.classList.contains('match'))) {
          virarCarta(element);
          memorizarCartas(conteudo, index);
        }
      }
    });
  });
  iniciarTempo();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function virarCarta(elemento) {
  elemento.setAttribute('class', `${bsClassesCards} show open`);
}

function desvirarCarta(elemento) {
  elemento.setAttribute('class', `${bsClassesCards}`);
}

function iniciarTempo() {
  tempoDeJogo = setInterval(function () {
    segundos++;
    segundos = ("0" + segundos).slice(-2);
    if (segundos == 60) {
      minutos++;
      segundos = 0;
    } else {
      tempo[0].innerHTML = `Tempo: ${minutos = ("0" + minutos).slice(-2)}:${segundos}`
    }

  }, 1000);
}

function reiniciarJogo() {
  limparArrays();
  document.getElementsByTagName("i")[2].setAttribute('class', 'fa fa-star');
  document.getElementsByTagName("i")[1].setAttribute('class', 'fa fa-star');
  jogada = 0;
  jogadas[0].innerHTML = `Jogadas: 0`;
  tempo[0].innerHTML = `Tempo: 00:00`;
  segundos = 0;
  minutos = 0;
  clearInterval(tempoDeJogo);
  iniciarJogo();
}

function memorizarCartas(conteudo, index) {
  cartasAbertas.push(conteudo);
  cartasClicadas.push(index);
}

function combinarCartas() {
  const cartaUm = cartasClicadas[0];
  const cartaDois = cartasClicadas[1];
  if (cartasAbertas[0] === cartasAbertas[1]) {
    percorrerArrayLi('cartasCombinadas', cartaUm, cartaDois);
    limparArrays();
  } else {
    setTimeout(function () {
      percorrerArrayLi('desvirarCarta', cartaUm, cartaDois);
      limparArrays();
    }, 600);
  }
}

function acrescentarJogada() {
  jogada += 1;
  jogadas[0].innerHTML = `Jogadas: ${jogada}`;
  if (jogada == 13) {
    reduzirEstrelas(estrelas[2]);
  } else if (jogada == 16) {
    reduzirEstrelas(estrelas[1]);
  }
}

function percorrerArrayLi(func, cartaUm, cartaDois) {
  for (let index in LI_ARRAY) {
    if (index == cartaUm || index == cartaDois) {
      window[func](LI_ARRAY[index]);
    }
  };
}

function limparArrays() {
  cartasAbertas = [];
  cartasClicadas = [];
}

function reduzirEstrelas(estrela) {
  estrela.setAttribute('class', 'fa fa-star-o');
}

function cartasCombinadas(elemento) {

  elemento.setAttribute('class', `${bsClassesCards} show match`);
  totalCartasCombinadas++;

  if (totalCartasCombinadas === 16) {

    var pontuacao = '';

    for (let i = 0; i < document.getElementsByClassName('fa-star').length; i++) {
      pontuacao = pontuacao + '<i class="fa fa-star"></i>';
    }

    document.getElementsByClassName('modal-body')[0].innerHTML = `Parabéns!
      Você completou o Jogo da Memória em ${minutos} minuto(s) e ${segundos} segundo(s) <br/>
      Sua pontuação: ${pontuacao}`;

    clearInterval(tempoDeJogo);
    $('#modalFimDeJogo').modal();
  }
}
