var setup = {
  numberOfCases: 20,
  rows: [5,5,5,5],
  amounts: [50, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000,750000, 1000000]
};

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

setup.amounts = setup.amounts.map(i => addCommas(i));

// create rows of $$ amounts
for(let i=0; i < setup.numberOfCases; i++){
  let $rectangle = $('<img>').attr('src', 'images/dollars.jpg').addClass('numbers');
  if(i < setup.numberOfCases / 2){
    $('.low-numbers').append(`
      <div class="rectangle">
        <div class="number-overlay">
          <div class="money-text">$${setup.amounts[i]}</div>
        </div>
      </div>
      `);

  } else {
    $('.high-numbers').append(`
      <div class="rectangle">
        <div class="number-overlay">
          <div class="money-text">$${setup.amounts[i]}</div>
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
  let $row = $('<div>').addClass('row').css('margin-bottom', '2rem');
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
