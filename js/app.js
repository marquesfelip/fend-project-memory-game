let array = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf',
  'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle',
  'fa-paper-plane-o', 'fa-cube'
];

array = shuffle(array);

let jogadas = document.getElementsByClassName("jogadas");
let liArray = document.getElementsByClassName("card");
let tempo = document.getElementsByClassName("temporizador");
let estrelas = document.getElementsByClassName("fa-star");

let tempoDeJogo;

let cartasAbertas = [],
  cartasClicadas = [];

let segundos = 0,
  minutos = 0,
  totalCartasCombinadas = 0,
  jogada = 0;

Array.from(liArray).forEach(function (element, index) {
  element.innerHTML = `<i class="fa ${array[index]}"></i>`
});

Array.from(liArray).forEach(function (element) {
  virarCarta(element);
  setTimeout(() => {
    desvirarCarta(element);
  }, 2000);
});

iniciarTempo();

Array.from(liArray).forEach(function (element, index) {
  element.addEventListener('click', function () {

    const conteudo = element.innerHTML.trim();

    if (cartasAbertas.length > 0 && cartasAbertas.length < 2 && !(cartasClicadas.includes(index))) {
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
  elemento.setAttribute('class', 'card show open');
}

function desvirarCarta(elemento) {
  elemento.setAttribute('class', 'card');
}

function iniciarTempo() {
  tempoDeJogo = setInterval(function () {
    segundos++;
    if (segundos === 60) {
      minutos++;
      segundos = 0;
    }
    tempo[0].innerHTML = `Tempo: ${minutos}:${segundos}`
  }, 1000);
}

function memorizarCartas(conteudo, index) {
  cartasAbertas.push(conteudo);
  cartasClicadas.push(index);
}

function combinarCartas() {
  const cartaUm = cartasClicadas[0];
  const cartaDois = cartasClicadas[1];
  if (cartasAbertas[0] === cartasAbertas[1]) {
    percorrerArrayLi("cartasCombinadas", cartaUm, cartaDois);
    limparArrays();
  } else {
    setTimeout(function () {
      percorrerArrayLi("desvirarCarta", cartaUm, cartaDois);
      limparArrays();
    }, 600);
  }
}

function acrescentarJogada() {
  jogada += 1;
  jogadas[0].innerHTML = `Jogadas: ${jogada}`;
  if (jogada == 11) {
    reduzirEstrelas(estrelas[2]);
  } else if (jogada == 14) {
    reduzirEstrelas(estrelas[1]);
  }
}

function percorrerArrayLi(func, cartaUm, cartaDois) {
  for (let index in liArray) {
    if (index == cartaUm || index == cartaDois) {
      window[func](liArray[index]);
    }
  };
}

function limparArrays() {
  cartasAbertas = [];
  cartasClicadas = [];
}

function reiniciarJogo() {
  for (let index in liArray) {
    desvirarCarta(liArray[index]);
  };
  limparArrays();
  jogadas[0].innerHTML = `Jogadas: 0`;
}

function reduzirEstrelas(estrela) {
  estrela.setAttribute("class", "fa fa-star-o");
}

function cartasCombinadas(elemento) {

  elemento.setAttribute('class', 'card show match');
  totalCartasCombinadas++;

  if (totalCartasCombinadas === 16) {

    var pontuacao = '';

    for (let i = 0; i < document.getElementsByClassName("fa-star").length; i++) {
      pontuacao = pontuacao + '<i class="fa fa-star"></i>';
    }

    document.getElementsByClassName('modal-body')[0].innerHTML = `Parabéns!
      Você completou o Jogo da Memória em ${minutos} minuto(s) e ${segundos} segundo(s) <br/>
      Sua pontuação: ${pontuacao}`;

    clearInterval(tempoDeJogo);
    $('#modalFimDeJogo').modal();
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
