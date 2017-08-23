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
    // grab $$ text
    // var $moo = $('.money-text');
    // $moo.each(i => $moo[i].html());

    // $('.rectangle').css('')
    $low.hide();
    $high.hide();
    // remove rectangle class
    var $newTop = $('<div>').addClass('media-background added'); //.addClass('media-background added');
    var $newBottom = $('<div>').addClass('media-background added');
    $newTop.append($low.html())
    $newBottom.append($high.html());

    $('header').after($newBottom).after($newTop);

  } else {
    $low.show();
    $high.show();
    $('.added').remove();
  }
}
