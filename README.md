# deal-or-no-deal
CODA project week

## game & rules.
Welcome to Deal or No Deal, a gambling game modeled closely off of the hit NBC TV show! You are presented with 20 cases, each of which contain a grand prize between $50 and $1,000,000, and you must claim one (and only one) case as your own. The game progresses in stages where you'll open cases to reveal the amount inside. The instructions will tell you how many cases to open, and once you've completed the stage the Banker will make you an offer. He will try to buy your case for as *little* as possible based on the dollar amounts left. This is where you must answer the million-dollar question... Deal or No Deal? If you choose Deal, you immediately walk away with the Banker's offer but if you choose No Deal, you must continue to open cases until you complete the next stage. If you're feeling lucky you may switch cases, but only when there is one remaining on the board. But tread carefully-- you cannot undo any of your decisions!

So what will it be? Deal or No Deal?

## technologies used.
This game was built using HTML, CSS, and Javascript.

## process/approach.

#### The Why
I chose Deal or No Deal because I built a preliminary version of it for a previous lab. As I was looking through my sloppy old code, I realized it could be DRYer so I scrapped everything and started from square one.

#### Graphics
The graphics I used are free vector images found online. I modified them slightly with Adobe Illustrator.

#### Organization
My game has three behavioral components: the internal data structures, the game logic, and the banker's formula. Organization is very important to me so I kept these components in separate js files.

#### Internal Data Structure & Scalability
I created a unique "Case" class to store each case' number, dollar amount, and whether or not it's been opened. The dollar values for each case are randomly assigned from a hard-coded array of dollar values. Scalability is not a problem; if I wanted to increase the number of cases from 20 to 25, I would have to change one variable  and manually add the 5 extra dollar amounts. The number of cases in each row is also a variable which can easily be changed if desired.

## future features.
Right now I have a minimum viable product. If time allows, I'd like to add the following:
  * a title screen with a large "Play" button and a cool fading effect
  * a :10 second countdown timer when given the option to swap cases
  * improve page responsiveness when browser is resized
  * sound effects
  * (this is a stretch) computer support/coaching when player is faced with a risky Deal or No Deal decision-- just like the actual TV show

## bugs.
1. I used set/clearInterval to coordinate the flashing instructions and it was troubling at first. I originally wrapped setInterval() in  a function which prevented me from accessing that function later on. I solved the issue by setting the variable equal to just setInterval() instead.

  Before:
  ```
  var interval = function(){
    setInterval(..., 1200);
  }
  ```

  After:
  ```
  var interval = setInterval(function(){
    .
    .
    .
  }, 1200);
  ```

1.


## wins and challenges.
* Wins
  * writing clean code that is reused for each stage of the game
  * designing and implementing a clean grid layout
* Challenges
  * finding a reasonable banker's formula on the internet
  * making the page responsive when browser is resized, or when viewed on a mobile device

##  process for turning that game into a web application (wireframes, blockers/issues that popped up).


## links
* [trello board](http://google.com)
* [wireframe](https://wireframe.cc/P2djAa)
