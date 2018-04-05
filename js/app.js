/**
 * Nesse Array são armazenados os nomes das classes que ilustrarão a figura dentro de cada carta.
 * As classes são oferecidas por Font Awesome https://fontawesome.com/
 */
let array = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf',
  'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle',
  'fa-paper-plane-o', 'fa-cube'
];

// Declaração de constantes que buscam elementos no documento HTML
const jogadas = document.getElementsByClassName('jogadas');
const liArray = document.getElementsByClassName('card');
const tempo = document.getElementsByClassName('temporizador');
const estrelas = document.getElementsByClassName('fa-star');

/**
 * Essa constante foi criada para armazenar um conjunto de classes, porque todas serão
 * utilizadas em alguns trechos, assim evitando uma massante digitação das mesmas
 */
const bsClassesCards = 'card justify-content-center align-items-center m-2';

// Declaração de variáveis e arrays
let cartasAbertas = [],
  cartasClicadas = [],
  segundos = 0,
  minutos = 0,
  totalCartasCombinadas = 0,
  jogada = 0,
  tempoDeJogo,
  cliqueLiberado = false;

iniciarJogo();

/**
 * @description
 */
function iniciarJogo() {

  // A função shuffle irá trocar a ordem de todos os elementos dentro de array
  array = shuffle(array);

  // Adicionar em cada elemento de liArray uma tag HTML com uma das classes do Array 'array'.
  Array.from(liArray).forEach(function (element, index) {
    element.innerHTML = `<i class="fa ${array[index]}"></i>`
  });

  // As cartas serão exibidas e então escondidas por 2 segundos.
  Array.from(liArray).forEach(function (element) {

    virarCarta(element);
    setTimeout(() => {
      desvirarCarta(element);
      // Aqui cliqueLiberado recebe true para que seja executado algum código somente após as cartas...
      // serem desviradas.
      cliqueLiberado = true;
    }, 2000);
  });

  // Adicionando o evento de click para cada elemento de liArray.
  Array.from(liArray).forEach(function (element, index) {
    element.addEventListener('click', function () {

      // É passado para 'conteudo' o conteúdo interno da tag li que possui a informação necessária...
      // para verificar posteriormente se a primeira carta clicada combina com a segunda.
      const conteudo = element.innerHTML.trim();

      // Condição para evitar abrir uma terceira carta ou executar alguma jogada enquanto ainda exibidas
      if (cartasClicadas.length === 2 || !cliqueLiberado) {
        return;
      }
      // Condição que irá verificar se há apenas 1 carta aberta e se a carta ainda não foi clicada
      else if (cartasAbertas.length == 1 && !(cartasClicadas.includes(index))) {
        // Se a carta clicada não é uma carta que ainda não foi combinada...
        if (!(element.classList.contains('match'))) {
          // a carta será exibida...
          virarCarta(element);
          memorizarCartas(conteudo, index);
          combinarCartas();
          acrescentarJogada();
        }
      }
      else if (!(cartasClicadas.includes(index))) {
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
/**
 * @description a função irá receber um objeto como argumento (a carta clicada) e irá exibir a imagem
 * dentro da mesma adicionando as classes "show" e "open"
 * @param  {object} elemento
 */
function virarCarta(elemento) {
  elemento.setAttribute('class', `${bsClassesCards} show open`);
}
/**
 * @description A função desvirarCarta funciona da forma inversa de virarCarta, ao invés de exibir,
 * irá esconder a imagem de dentro da carta removendo as classes "show" e "open" inseridas por virarCarta
 * @param  {oject} elemento
 */
function desvirarCarta(elemento) {
  elemento.setAttribute('class', `${bsClassesCards}`);
}

/**
 * @description iniciarTempo irá zerar o temporizador e bloquear o clique das cartas
 * O clique será desbloqueado após todas as cartas serem desviradas, assim passando true para cliqueLiberado
 */
function iniciarTempo() {
  cliqueLiberado = false;
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

/**
 * @description Função que irá reiniciar jogo
 * Limpar arrays, voltar a 3 estrelas, zerar número de jogadas e tempo, tanto no html como nas variáveis
 * Por fim chamando a função iniciarJogo() novamente, a função usada quando a página é carregada.
 */
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

/**
 * @description Nessa função o array cartasAbertas irá receber o conteúdo de um elemento até o maxímo de 2 elementos para que
 * o conteúdo da posição [0] seja comparado a posição [1]. cartasClicadas terá o índice armazenado das cartas clicadas para evitar
 * execução de código caso uma carta já aberta seja clicada novamente.
 * @param  {object} conteudo
 * @param  {object} index
 */
function memorizarCartas(conteudo, index) {
  cartasAbertas.push(conteudo);
  cartasClicadas.push(index);
}

/**
 * @description A função combinar cartas irá verificar se o conteúdo das duas cartas clicadas e armazenadas em cartasAbertas são iguais
 * para então fazer a combinação, caso o conteúdo não seja igual, as cartas serão desviradas após 0.6s/600ms.
 */
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

/**
 * @description A cada duas cartas clicadas é contada uma jogada. O número de jogadas que é passado para a variável 'jogada' é informado
 * no span que possui a classe 'jogadas'.
 * Caso o número de jogadas seja igual à 13, será removida a primeira estrela de pontuação, a segunda estrela é removida com 16 jogadas.
 */
function acrescentarJogada() {
  jogada += 1;
  jogadas[0].innerHTML = `Jogadas: ${jogada}`;
  if (jogada == 13) {
    reduzirEstrelas(estrelas[2]);
  } else if (jogada == 16) {
    reduzirEstrelas(estrelas[1]);
  }
}

/**
 * @description percorrerArrayLi irá receber como argumento uma função e 2 numbers. A função passada como argumento define o que acontece
 * com as duas cartas clicadas, podendo ser passadas as funções cartasCombinadas eou desvirarCarta como argumento.
 * @param  {function} func
 * @param  {number} cartaUm
 * @param  {number} cartaDois
 */
function percorrerArrayLi(func, cartaUm, cartaDois) {
  window[func](liArray[cartaUm]);
  window[func](liArray[cartaDois]);
}

/**
 * @description Esvazia/limpa os arrays 'cartasAbertas' e 'cartasClicadas'
 */
function limparArrays() {
  cartasAbertas = [];
  cartasClicadas = [];
}

/**
 * @description Altera o icone da estrela preenchida para uma estrela apenas com a borda. Simbólicamente é uma estrela a menos na pontuação.
 * @param  {element} estrela
 */
function reduzirEstrelas(estrela) {
  estrela.setAttribute('class', 'fa fa-star-o');
}

/**
 * @description Casos 2 cartas tenham o mesmo conteúdo (verificação feita em 'combinarCartas') as duas cartas terão suas classes alteradas
 * para 'show' e 'match' que irão mudar a cor de fundo de azul para verde, representando que as duas cartas foram combinadas.
 * Caso haja um total de 16 cartas combinadas, será exibido um modal com as informações de tempo e pontuação. Antes da exibição do modal o
 * temporizador será pausado pelo clearInterval.
 * @param  {element} elemento
 */
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
