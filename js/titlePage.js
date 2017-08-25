console.log('connected to titlePage');


$('button[name="game"]').click(function(){
  window.location.href = "index.html";
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDGCYFmFy9PD5snheGCFWgVEHsoEE9RO8U",
  authDomain: "coda-game.firebaseapp.com",
  databaseURL: "https://coda-game.firebaseio.com",
  projectId: "coda-game",
  storageBucket: "coda-game.appspot.com",
  messagingSenderId: "861191789315"
};

firebase.initializeApp(config);
var database = firebase.database();

//   var rank = getRank(score);
function writeUserData(time, user, score) {
  database.ref('/' + time).set({
    name: user,
    score: score
  });
}

function renderScores(){
  var $table = `
  <table class="table">
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>Name</th>
        <th>Winnings</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
    </table>
      `
  $('body').append($table);
  var ref = database.ref();

// Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function(snapshot) {
    var object = Object.values(snapshot.val());
    console.log(object);

    object.forEach(function(i){
      let name = i.name;
      let score = i.score;
      // let date = new Date();
      // let value = date.getTime();
      let newRow = `
          <tr>
            <th scope="row">${object.indexOf(i)+1}</th>
            <td>${name}</td>
            <td>$${addCommas(score)}</td>
          </tr>
        `
      $('tbody').append(newRow);

    })
  });

};

// returns rank of score i;
function getRank(i){
  if(typeof(i) !== 'number'){
    console.log('getRank says Nan!');
  }
  var ref = database.ref();
  var scores = [i];
  var getScores = $.Deferred();
  var findRank = $.Deferred();

  ref.on("value", function(snapshot){
    var object = Object.values(snapshot.val());
    object.forEach(function(i){
      scores.push(i.score);
    });
    getScores.resolve(scores);
  })

  $.when(getScores).done(function(s){
    // sort scores in descneding order
    s.sort(function(a, b){return a-b});
    s = s.reverse();
    console.log('getRank says score array is:', s);
    var rank = (scores.indexOf(i) + 1);
    // console.log(rank);
    findRank.resolve(rank);
  });

  $.when(findRank).done(function(r){
    console.log('getRank returns rank', r);
    return r;
  });
}

renderScores();
