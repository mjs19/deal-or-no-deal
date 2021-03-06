window.onload = function() {
  // game logic
  var interval;
  var rnd = 1;
  var playerCase;

  // remove highscores table
  $('table').remove();

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
        if(casesLeft === 1){
          var t1 = `now open ${casesLeft} more case`;
        } else {
          var t1 = `now open ${casesLeft} more cases`;
        }
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
    var casesToOpen = state[r-1];
    var opened = 0;

    $('.case').click(function(){
      var open = new Audio('sound/open.wav');
      open.play();
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
        var $offer = $('<span>').addClass('blink').html(`<br>The banker is calling! Click the box to view your offer.`);
        var $banker = new Audio('sound/banker-calling.mp3');
        $banker.play();
        var bankerCalling = setInterval(function(){
          $banker.play();
        }, 2500);
        $('#instructions').append($offer);
        $('#offer').addClass('blink');
        // use proxy to pass arguments into function
        $("#offer").click($.proxy(offer, null, bankerCalling));

      } else {
        // set new instructions
        instructions(caseId, casesToOpen-opened, formattedValue);
      }
    });
  }

  function offer(int){
    clearInterval(int);

    $(this).off();
    $('#instructions .blink').remove();
    $('#instructions').text('Viewing offer');
    $(this).removeClass('blink').css('opacity', 1);

    // update internal data
    var evaluate = cases.filter(function(i){
      // return i.opened == false && i.id != playerCase;
      return i.opened == false;
    });

    evaluate = evaluate.map(i => i.value);

    var ev = expectedValue(evaluate); // insert offer here
    var casesLeft = evaluate.length;
    var maxVal = Math.max(...evaluate);

    var o = addCommas(Math.floor(formula(ev, casesLeft, maxVal)));

    $(this).append(`
      <h2 class="moola">$${o}</h2>
      `);

      var $nameHeader = $('<h2>').attr('id', 'player').text(`${getPlayerName()},`).css('text-align', 'center');
      $('header').prepend($nameHeader);
      $('#q').fadeIn(2000);
      $('#deal').addClass('blink').css('cursor','pointer').click(deal);

      if(rnd == state.length){
        $('#no-deal').addClass('blink').css('cursor','pointer').click(promptSwap);
      } else {
        $('#no-deal').addClass('blink').css('cursor','pointer').click(transition);
      }
  }

  function stopBlinking(){
    $('#player').remove();
    $('#q').hide();
    $('#deal').unbind();
    $('#no-deal').unbind();
    $('#deal').removeClass('blink');
    $('#no-deal').removeClass('blink');
  }

  function transition(){
    stopBlinking();
    $('#offer h2').remove();
    $('#instructions').text(`open ${state[rnd-1]} more cases`);
    round(rnd);
  }

  function promptSwap(){
    stopBlinking();
    $('#offer h2').remove();

    var $swap = $('<button>').attr("type", "text").addClass('choices').text('Swap');
    var $keep = $('<button>').attr("type", "text").addClass('choices').text('Keep');

    $swap.click(swap);
    $keep.click(reveal);
    $('#instructions').text('');
    $('#instructions').append(`There are only two cases left. Would you like to swap?<br>`);
    $('#instructions').append($swap).append($keep);
  }

  function renderResults(moneyWon, caseAmount){
    caseAmount = addCommas(caseAmount) || " ";
    let html = `
      <div class="reveal">
        <div class="overlay">
          <div class="text" style="color: white; top:13%;">
          Congrats! You walk away with $${moneyWon} </br>
          </div>
          <button type="text" id="hs" style="color:black;">see highscores</button>
          <button type="text" id="refresh" style="color:black;">play again</button>
        </div>
      </div>
      `
    $('#instructions').text("").append(html).hide().slideDown('slow');

    $('#hs').click(function(){
      $(this).off();
      $('header').nextAll().hide();
      renderScores();
    });
  }

  function deal(){
    // clear thinking music
    stopBackground();

    let music = new Audio('sound/its-a-deal.mp3');
    music.play();

    stopBlinking();
    $('.board').css('opacity', '0.2');
    $('.low-numbers').css('opacity', '0.2');
    $('.high-numbers').css('opacity', '0.2');
    // fades media bars if viewing on mobile device
    $('.added').css('opacity', '0.2');

    var $take = $('.moola').text().replace("$", "");
    var $takeAsANumber = Number($take.replace(/[^0-9\.-]+/g,""));

    var $myCaseValue = cases[playerCase - 1].value;

    $('#mine').hide();
    $('#offer').hide();

    renderResults($take, $myCaseValue);

    let openMyCase = `
    <button type="text" id="open-mine" style="color:black; display:none">open my case</button>
    `;
    $('.reveal .overlay').append(openMyCase);

    let buttonContent = `
      <div style="display:none" id="my-case-value">Your case contained $${addCommas($myCaseValue)}.</div>
      <div style="display:none" id="you-win">Congrats, you got more than your case was worth!</div>
      <div style="display:none" id="you-lose">Oops, looks like the dealer got you...</div>`;

      $('#refresh').click(function(){
        window.location.reload();
      });

      var date = new Date();
      var timestamp = date.getTime();

      writeUserData(timestamp, getPlayerName(), $takeAsANumber);


      $('#open-mine').css('display', 'inline-block').click(function(){

        $(this).off();
        $('#instructions').append(buttonContent);
        $('#my-case-value').css('display', 'block');

        if($takeAsANumber > $myCaseValue) {
          var clap = new Audio('sound/clap.wav');
          clap.play();
          $('#you-win').css('display', 'block');
        } else {
          var aww = new Audio('sound/aww.wav');
          aww.play();
          $('#you-lose').css('display', 'block')
        }

      });
  }

  function reveal(){
    // clear thinking music
    stopBackground();

    var val = addCommas(cases[playerCase-1].value);
    var id = cases[playerCase-1].id;
    $('#instructions').text(`Your case contains...`);
    $('#offer').hide();
    $('#mine').hide();

    var $lastCase = $('.board .case').length ? $('.board .case') : $('.board .case-selected');
    var $lastCaseValue = cases[$lastCase.text()-1].value;
    $(`#${$lastCaseValue}`).css('opacity', '0.2');
    $(`#${$lastCaseValue}`).find('.money-text').removeClass('money-text').addClass('money-eliminated');

    $lastCase.removeClass('case-selected').addClass('case-opened').css('cursor', 'auto');
    $lastCase.find('.text').text(`$${addCommas($lastCaseValue)}`).css('font-size', '1rem');

    renderResults(val, val);

    var date = new Date();
    var timestamp = date.getTime();

    writeUserData(timestamp, getPlayerName(), cases[playerCase-1].value);

    let theme = new Audio('sound/theme.mp3');
    theme.play();

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

    playerCase = $thisBecomesMine[0].id;

    $('button').remove();
    $('#instructions').text('click your new case to open it!');
    $('#mine').click(reveal);
  }

};
