// game logic
var interval;
var state = [6, 5, 4, 3, 1];
var rnd = 1;
var playerCase;

$('.case').on('click', select);

// using deferred objects here
var selection = $.Deferred();
selection.done(function() {
  round(rnd);
});

// var roundOne = $.Deferred();
// roundOne.done(round(2));
//
// var roundTwo = $.Deferred();
// roundTwo.done(round(3));
//
// var roundThree = $.Deferred();
// roundTwo.done(round(4));
//
// var roundFour = $.Deferred();
// roundTwo.done(round(5));
//
// var roundFive = $.Deferred();
// roundTwo.done(finish);


// flashing instructions
function instructions(caseId, casesLeft, dolla){
  dolla = dolla || false;
  if(dolla){
    // slightly different prompts w dollar amounts
    let a = 1;
    interval = setInterval(function(){
      var t1 = `now open ${casesLeft} more cases`;
      var t2 = `case ${caseId} contains $${dolla}`

      if(a){
        $('#instructions').text(t1);
        a--;
      } else {
        $('#instructions').text(t2);
        a++;
      }

    }, 1200);
  } else {
    let b = 1;
    interval = setInterval(function(){
      var t1 = `now open ${casesLeft} more cases`;
      var t2 = `you picked case ${caseId}`

      if(b){
        console.log('switch to t1');
        $('#instructions').text(t1);
        b--;
      } else {
        console.log('switch to t2');
        $('#instructions').text(t2);
        b++;
      }

    }, 1200);
  }

 };

function select(){
  // remove event listeners
  $('.case').off('click', select);

  let myId = $(this)[0].id;
  playerCase = myId;
  let $moveMe = $('<div>').addClass('col-md-2').append($(this));

  console.log($moveMe);
  var moveMe = $(this).removeClass('case').addClass('case-selected');
  $('#mine').append(moveMe).css('opacity', 1);

  $('#instructions').text(`you picked case ${myId}`);
  // set instructions
  instructions(myId, state[0]);

  // resolve deferred
  selection.resolve();
}

function round(r) {
  // reverse flashing effects of offer text
  // if(r > 1){
  //   $('#q').fadeOut(1000);
  //   $('#deal').unbind();
  //   $('#no-deal').unbind();
  //   $('#deal').removeClass('blink');
  //   $('#no-deal').removeClass('blink');
  // }
  var casesToOpen = state[r-1];
  var opened = 0;

  $('.case').click(function(){
    // clear interval
    clearInterval(interval);
    let caseId = $(this)[0].id;
    let caseValue = cases[caseId-1].value;
    let formattedValue = addCommas(caseValue);

    $('#instructions').text(`case ${caseId} contains $${formattedValue}`);
    // change case to opaque
    $(`#${caseId}`).css('opacity', 0.2).css('cursor', 'auto');
    cases[caseId-1].opened = true;
    // change money bar
    $(`#${caseValue}`).css('opacity', '0.2');
    $(`#${caseValue}`).find('.money-text').removeClass('money-text').addClass('money-eliminated');

    opened++;

    if(opened === casesToOpen){
      rnd ++;
      console.log('stop');
      $('.case').unbind();
      var $offer = $('<span>').addClass('blink').html(`<br>You have an offer! Click box to view.`);
      $('#instructions').append($offer);
      $('#offer').addClass('blink');
      $('#offer').on('click', offer);
    } else {
      // set new instructions
      instructions(caseId, casesToOpen-opened, formattedValue);
    }
  });
}

function offer(){
  $(this).off();
  $('#instructions .blink').remove();
  $('#instructions').text('Viewing offer');
  $(this).removeClass('blink').css('opacity', 1);

  // update internal data
  var evaluate = cases.filter(function(i){
    return i.opened == false && i.id != playerCase;
  });

  evaluate = evaluate.map(i => i.value);

  var ev = expectedValue(evaluate); // insert offer here
  var casesLeft = evaluate.length;
  var maxVal = Math.max(...evaluate);

  var o = addCommas(Math.floor(formula(ev, casesLeft, maxVal)));

  $(this).append(`
    <h2 class="moola">$${o}</h2>
    `);

    $('#q').fadeIn(2000);
    $('#deal').addClass('blink').css('cursor','pointer').click(finish);

    if(rnd == state.length){
      $('#no-deal').addClass('blink').css('cursor','pointer').click(swap);
    } else {
      $('#no-deal').addClass('blink').css('cursor','pointer').click(transition);
    }
}

function transition(){
  $('#q').hide();
  $('#deal').unbind();
  $('#no-deal').unbind();
  $('#deal').removeClass('blink');
  $('#no-deal').removeClass('blink');
  $('#offer h2').remove();
  console.log('round', rnd);
  $('#instructions').text(`Open ${state[rnd-1]} more cases`);
  round(rnd);
}

function swap(){
  $('#q').fadeOut(1000);
  $('#deal').unbind();
  $('#no-deal').unbind();
  $('#deal').removeClass('blink');
  $('#no-deal').removeClass('blink');
  $('#offer h2').remove();


  var $swap = $('<button>').text('Swap');
  var $keep = $('<button>').text('Keep');

  // $swap.click();
  $keep.click(reveal);

  $('#instructions').text('There are only two cases left. Woud you like to swap?');
  $('#instructions').append($swap).append($keep);
}

function finish(){
  console.log('in prog');
}

function reveal(){
  var val = addCommas(cases[playerCase-1].value);
  $('#instructions').text(`Your case contains $${val}`);
}
