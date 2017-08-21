// game logic

var state = [6, 5, 4, 3, 2];

$('.case').on('click', select);

// using deferred object here
var selection = $.Deferred();
selection.done(function(int) {
  round(1, int);
});


function select(){
  let myId = $(this)[0].id;
  let $moveMe = $('<div>').addClass('col-md-2').append($(this));

  console.log($moveMe);
  $('#mine').append($(this)).css('opacity', 1);

  $('#instructions').text(`you picked case ${myId}`);
  // set instructions
  let b = 0;
  var blink = setInterval(function(){
        if(b){
          $('#instructions').text(`you picked case ${myId}`);
          b--;
        } else {
          $('#instructions').text(`now open ${state[0]} more cases`);
          b++;
         }
    }, 1200);

  blink;

  // remove event listeners
  $('.case').off('click', select);
  // resolve deferred
  selection.resolve(blink);
}

function round(i, j) {

  $('.case').click(function(){
    console.log('i want to clear');
    clearInterval(j);
    $('#instructions').text(`you clicked ${$(this)[0].id}`)
  })

}
