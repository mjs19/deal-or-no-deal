$('.all').hide();

$(document).ready(function() {
  var theme = new Audio('sound/theme.mp3');
  theme.play();
  console.log('theme volume', theme.volume);

  var loop = setInterval(function(){
    theme.play();
  }, 1000);

  var $name = `
  <form>
    <div class="intro">
      <h1> Deal or No Deal </h1>
        <div class="row">
          <div class="col-lg-6">
            <div class="input-group input-group-lg">
              <input type="text" class="form-control" name="question" placeholder="enter contestant name">
              <span class="input-group-btn">
              <button class="btn btn-secondary" type="button">Lets play!</button>
              </span>
            </div>
          </div>
        </div>
    </div>
    </form>

      `
  $('body').append($name).hide().fadeIn('slow');

  $('form').submit(function(event){

  event.preventDefault();
  isEmpty();

});

  $('button').click(isEmpty);

  // function triggerVolume(o){
  //   $(this).remove();
  //   if(o == "on"){
  //     // trigger on
  //     $('.vol').append(`
  //       <i class="fa fa-volume-up fa-2x" aria-hidden="true"></i>
  //       `);
  //   } else if (o == "off"){
  //     console.log("off");
  //     // trigger off
  //     $('.vol').append(`
  //       <i class="fa fa-volume-off fa-2x" aria-hidden="true"></i>
  //       `);
  //   }
  //
  // }

  function isEmpty(){
    event.preventDefault();
    if($('input').val() == "")
    {
       alert('enter your name first!')
    } else {
      theme.pause();
      clearInterval(loop);
      playerName = $('input').val();
      $('.intro').remove();
      $('.all').fadeIn('slow');
      playBackground();
    }
  }
});

var playerName;
var thinking = new Audio('sound/thinking.mp3');
var backgroundMusic;

function playBackground() {
  thinking.play();
  backgroundMusic = setInterval(function(){
    thinking.play();
  }, 500);
}

function stopBackground(){
  thinking.pause();
  clearInterval(backgroundMusic);
}

function getPlayerName(){
  return playerName;
}


var setup = {
  numberOfCases: 20,
  rows: [5,5,5,5],
  amounts: [50, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000,750000, 1000000]
};

var state = [6, 5, 4, 3, 1];


function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var commas = setup.amounts.map(i => addCommas(i));

// create rows of $$ amounts
for(let i=0; i < setup.numberOfCases; i++){
  let $rectangle = $('<img>').attr('src', 'images/dollars.jpg').addClass('numbers');
  if(i < setup.numberOfCases / 2){
    $('.low-numbers').append(`
      <div class="rectangle" id=${setup.amounts[i]}>
        <div class="number-overlay">
          <div class="money-text">$${commas[i]}</div>
        </div>
      </div>
      `);

  } else {
    $('.high-numbers').append(`
      <div class="rectangle" id=${setup.amounts[i]}>
        <div class="number-overlay">
          <div class="money-text">$${commas[i]}</div>
        </div>
      </div>
      `);

  }
}

// creating internal data structure

class Case {
  constructor(value, id) {
    this.value = value;
    this.id = id;
    this.opened = false;
  }
}

var cases = [];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

for(let i = 0; i < setup.numberOfCases; i++){
  let randomIndex = Math.floor(getRandom(0, setup.amounts.length));
  let dollarAmount = setup.amounts[randomIndex];
  cases.push(new Case(dollarAmount, i+1));
  setup.amounts.splice(randomIndex, 1);
}

// set up grid rows
for(let i=0; i < setup.rows.length; i++){
  let $row = $('<div>').addClass('row board-row');
  let $value = getRandom(0, setup.amounts.length);

  for(let j=0; j < setup.rows[i]; j++){
    $row.prepend(`
        <div class="col col-md-2">
        <div class="case" id=${setup.numberOfCases}>
          <div class="overlay">
            <div class="text">${setup.numberOfCases}</div>
          </div>
        </div>
        </div>
      `)

      setup.numberOfCases--;
  }
  $('.board').prepend($row);
}
// make highscores table appear
