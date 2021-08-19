var socket;

let cards = [];
let deck = 0;
let NCards = 0;
let maxCard = 10;
let positionX = 50;
let positionY = 150;
let radio;

function setup() {

  let c = createCanvas(windowWidth, windowHeight);

  background(3, 164, 223);
  strokeWeight(4);

  radio = createRadio();
  radio.position(10, 60);
  radio.option(1, "Amarillo");
  radio.option(2, "Azul");
  radio.option(3, "Rojo");
  radio.selected("1");

  button = createButton("Agregar carta");
  button.position(190, 30);
  button.mousePressed(AddCard);

  input = createInput();
  input.position(10, 30);

  button = createButton("Voltear Todas las Cartas");
  button.position(320, 30);
  button.mousePressed(FlipAndEmit);



  function AddCard() {
    const contentCard = input.value();
    var cardToSave = new Card(positionX, positionY, radio.value(), contentCard);
    cards.push(cardToSave);
    var data = {type: "addcard", content: cardToSave};
    socket.emit('cardsdeck', data )

    positionX = positionX + 90;
    NCards = NCards + 1;
    if (NCards === maxCard) {
      positionX = 40;
      maxCard = maxCard + 10;
      positionY = positionY + 120;
    }

    return positionX;
  }
  for (let i = 0; i < deck; i++) {
    let xAxis = i * 70 + 35;
    cards.push(new Card(xAxis, 65));
  }

  socket= io.connect('http://localhost:3000/')
  socket.on('cardsdeck', newDrawing);
  

}

function FlipAndEmit() {
  FlipCards();
  var data = {type:"flipallcard", content: ""}
  socket.emit('cardsdeck', data);
}

  function FlipCards() {
    for (let i = 0; i < cards.length; i++) {
      let currentCard = cards[i];
      currentCard.flip = true;
    }
  }

function newDrawing(data) {
  console.log('data' , data)
  if (data.type === 'addcard')
    cards.push(new Card(data.content.x, data.content.y, data.content.color, data.content.content));
  if (data.type === 'flipcard') {
    var currentCard = cards.find(c => c.id === data.content.id);
    currentCard.flip = data.content.flip;    
  }
  if (data.type === 'flipallcard')  {
    FlipCards();
  }
  if(data.type === 'mousepressed') {
    var currentCard = cards.find(c => c.id === data.content.id);
    currentCard.xOffset = data.contsp
    currentCard.yOffset = mouseY - currentCard.y;
  }
}

function draw() {
  background(3, 164, 223);
  for (let i = 0; i < cards.length; i++) {
    cards[i].display();
    cards[i].id = i;
  }
  rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  for (let i = 0; i < cards.length; i++) {
    let currentCard = cards[i];

    if (currentCard.isInPosition()) {
      currentCard.locked = true;
    } else {
      currentCard.locked = false;
    }
    currentCard.xOffset = mouseX - currentCard.x;
    currentCard.yOffset = mouseY - currentCard.y;
    var data = {type:"mousepressed", content: currentCard}
    socket.emit('cardsdeck', data);
    break;
  }

}-

function mouseDragged() {
  for (let i = 0; i < cards.length; i++) {
    let currentCard = cards[i];
    if (currentCard.locked) {
      currentCard.x = mouseX - currentCard.xOffset;
      currentCard.y = mouseY - currentCard.yOffset;
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < cards.length; i++) {
    let currentCard = cards[i];
    currentCard.locked = false;
  }
}

function doubleClicked() {
  for (let i = 0; i < cards.length; i++) {
    let currentCard = cards[i];
    flipOneCard(currentCard)
    var data = {type: "flipcard", content: currentCard};
    socket.emit('cardsdeck', data )
    
}

}

function flipOneCard(currentCard) {
  if (currentCard.isInPosition()) {
    currentCard.locked = true;

    if (currentCard.flip) {
      currentCard.flip = false;
    } else {
      currentCard.flip = true;
    }
  } else {
    currentCard.locked = false;
  }
}

class Card {
  constructor(x, y, color, content) {
    this.content = content;
    this.id = 0;
    this.color = color;
    //Card sizes
    this.cardWidth = 80;
    this.cardHeight = 110;
    //Card position
    this.x = x;
    this.y = y;
    this.xOffset = 0.0;
    this.yOffset = 0.0;
    //Card State
    this.locked = false;
    this.overBox = false;
    this.flip = false;
  }

  isInPosition() {
    if (
      mouseX > this.x - 40 &&
      mouseX < this.x + 40 &&
      mouseY > this.y - 55 &&
      mouseY < this.y + 55
    ) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    if (this.isInPosition()) {
      this.overBox = true;
      if (!this.locked) {
      }
    } else {
      this.overBox = false;
    }

    if (this.flip) {
      if (this.color === "1") {
        fill(214, 248, 11); //amarillo
      } else if (this.color === "2") {
        fill(24, 11, 248); //azul
      } else {
        fill(248, 15, 11); //rojo
      }
    } else {
      //gris
      fill(217, 217, 217);
    }

    rect(this.x, this.y, this.cardWidth, this.cardHeight);
    //circle(this.x, this.y, this.cardWidth);

    if (this.flip) {
      fill(0); //color al texto
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.content, this.x, this.y);

      /*  button = createButton("x");
      button.position(this.x - 40, this.y - 55);
      button.mousePressed(); */
    }
  }
}
