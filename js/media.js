// media query event handler
if (matchMedia) {
  const mq = window.matchMedia("(max-width: 990px)");
  mq.addListener(horizontalBars);
  horizontalBars(mq);
}

// media query change
function horizontalBars(mq) {
  // store bars in variable
  var $low = $('.low-numbers');
  var $high = $('.high-numbers');

  if (mq.matches) {
    // $('.rectangle').css('')
    $low.hide();
    $high.hide();
    // remove rectangle class
    var $newTop = $('<div>').addClass('media-background added'); //.addClass('media-background added');
    var $newBottom = $('<div>').addClass('media-background added');
    $newTop.append($low.html())
    $newBottom.append($high.html());

    $('header').after($newBottom).after($newTop);

    $('.added').children().each(function(key, value){
      var num = Number(value.innerText.replace(/[^0-9\.-]+/g,""));
      var final = num > 999 ? (num/1000).toFixed(1) + 'k' : num;
      value.innerHTML = `$${final}`;
    });

  } else {
    $low.show();
    $high.show();
    $('.added').remove();
  }
}
