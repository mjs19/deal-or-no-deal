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
        $('#instructions').text(t1);
        b--;
      } else {
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
  // add empty class in case user wants to swap cases later on
  $(this).closest('.col').attr('id', 'empty');

  playerCase = myId;
  let $moveMe = $('<div>').addClass('col-md-2').append($(this));

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
    // change case to opened
    $(`#${caseId}`).removeClass('case').addClass('case-opened').css('cursor', 'auto');
    $(`#${caseId}`).find('.text').text(`$${formattedValue}`).css('font-size', '1rem');

    cases[caseId-1].opened = true;
    $(this).off();
    // change money bar
    $(`#${caseValue}`).css('opacity', '0.2');
    $(`#${caseValue}`).find('.money-text').removeClass('money-text').addClass('money-eliminated');

    opened++;

    if(opened === casesToOpen){
      rnd ++;
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
    $('#deal').addClass('blink').css('cursor','pointer').click(deal);

    if(rnd == state.length){
      $('#no-deal').addClass('blink').css('cursor','pointer').click(promptSwap);
    } else {
      $('#no-deal').addClass('blink').css('cursor','pointer').click(transition);
    }
}

function stopBlinking(){
  $('#q').hide();
  $('#deal').unbind();
  $('#no-deal').unbind();
  $('#deal').removeClass('blink');
  $('#no-deal').removeClass('blink');
}

function transition(){
  stopBlinking();
  $('#offer h2').remove();
  $('#instructions').text(`Open ${state[rnd-1]} more cases`);
  round(rnd);
}

function promptSwap(){
  $('#q').fadeOut(1000);
  $('#deal').unbind();
  $('#no-deal').unbind();
  $('#deal').removeClass('blink');
  $('#no-deal').removeClass('blink');
  $('#offer h2').remove();

  var $swap = $('<button>').text('Swap');
  var $keep = $('<button>').text('Keep');

  $swap.click(swap);
  $keep.click(reveal);

  $('#instructions').text('There are only two cases left. Woud you like to swap?');
  $('#instructions').append($swap).append($keep);
}

function deal(){
  stopBlinking();
  $('.board').css('opacity', '0.2');
  $('.low-numbers').css('opacity', '0.2');
  $('.high-numbers').css('opacity', '0.2');

  var $take = $('.moola').text();

  var $myCaseValue = cases[playerCase - 1].value;

  $('#mine').hide();
  $('#offer').hide();

  // make this into a function cuz I use it twice

  $('#instructions').html(`
    <div class="reveal">
      <div class="overlay">
        <div class="text" style="color: white; top:13%;">
        It's a deal! You walk away with ${$take} </br>
        <button type="text" id="open-mine" style="color:black;">open my case</button> <button type="text" id="refresh" style="color:black;">play again</button>
        <div style="display:none" id="my-case-value">Your case had $${addCommas($myCaseValue)}</div>
        <div style="display:none" id="you-win">Congrats, you got more than your case was worth!</div>
        <div style="display:none" id="you-lose">Oops, looks like the dealer got you...</div>
        </div>
      </div>
    </div>
    `);

    $('#refresh').click(function(){
      window.location.reload();
    });
    $('#open-mine').click(function(){
      $(this).off();
      $('#my-case-value').css('display', 'block');

      var $takeAsANumber = Number($take.replace(/[^0-9\.-]+/g,""));
      if($takeAsANumber > $myCaseValue) {
        $('#you-win').css('display', 'block');
      } else {
        $('#you-lose').css('display', 'block')
      }

    });
}

function reveal(){
  var val = addCommas(cases[playerCase-1].value);
  var id = cases[playerCase-1].id;
  $('#instructions').text(`Your case contains...`);
  $('#offer').hide();
  $('#mine').hide();

  var $lastCase = $('.board .case').length ? $('.board .case') : $('.board .case-selected');
  console.log($lastCase);
  var $lastCaseValue = cases[$lastCase.text()-1].value;
  $(`#${$lastCaseValue}`).css('opacity', '0.2');
  $(`#${$lastCaseValue}`).find('.money-text').removeClass('money-text').addClass('money-eliminated');


  $lastCase.removeClass('case-selected').addClass('case-opened').css('cursor', 'auto');
  $lastCase.find('.text').text(`$${addCommas($lastCaseValue)}`).css('font-size', '1rem');

  $('#instructions').html(`
    <div class="reveal">
      <div class="overlay">
        <div class="text" style="color: white; top:13%;">
        Nice! You walk away with $${val} </br>
        <button type="text" id="refresh" style="color:black;">play again</button>
        <div style="display:none" id="my-case-value">Your case had $${val}</div>
        <div style="display:none" id="you-win">Congrats, you got more than your case was worth!</div>
        <div style="display:none" id="you-lose">Oops, looks like the dealer got you...</div>
        </div>
      </div>
    </div>
    `);

    $('#refresh').click(function(){
      window.location.reload();
    });
}

function swap() {
  // save case on board
  var $iDontWantThis = $('.case-selected');
  var $thisBecomesMine = $('.case');

  $('#empty').append($iDontWantThis);
  $('#mine').append($thisBecomesMine);

  // now swap their classes

  playerCase = $thisBecomesMine[0].id;


  $('button').remove();
  $('#instructions').text('click your new case to open it!');
  $('#mine').click(reveal);
}

function keep() {

}
