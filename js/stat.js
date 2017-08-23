function expectedValue(arr){
  var length = arr.length;
  var sum = arr.reduce(function(a, b){
    return a+b
  }, 0);

  return Math.floor(sum/length);
}

// http://commcognition.blogspot.com/2007/06/deal-or-no-deal-bankers-formula.html
function formula(ev, casesLeft, maxVal){
  return 12275 + (0.748 * ev) + (-2714.74 * casesLeft) + ( -0.040 * maxVal)
  + (0.0000006986 * Math.pow(ev, 2))
  + (32.623 * Math.pow(casesLeft, 2));

}
