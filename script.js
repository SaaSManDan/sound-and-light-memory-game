// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound, originally 1000
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0; //keeps track of where the user is in the clue sequence
var timer;
var seconds;
var attempts;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  attempts = 0;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    clearInterval(timer);
    document.getElementById("countdowntimer").innerHTML = "";
    document.getElementById("attemptscounter").innerHTML = "Attempts left: 3";
    attempts = 0;
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

//plays a single clue
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//iterates through array to play all clues
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime
  }
  clueHoldTime -= 100; //gradually increases speed after each play 
  // console.log(clueHoldTime);
  //countdown to guessing with begin
  setTimeout(t, delay - 1000);
}

function t() {
  seconds = 11;
  timer = window.setInterval(function(){
      seconds--;
      document.getElementById("countdowntimer").innerHTML = "<br><b><font color ='black'>You have " + seconds + " seconds left to guess.</font></b><br><br>";
     // console.log(seconds);
      if(seconds == 0){
      loseGame();
      clearInterval(timer);
      }
    }, 1000);
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //we need: last button played and btn touched by user
  if(pattern[guessCounter] == btn){ //if correct
      //check if it's the last turn
    if(guessCounter == progress){ 
      if(progress == pattern.length - 1){ //if last spot, won game
        winGame();
          } else { //if not last stop, continue game
            clearInterval(timer); //clears timer
            document.getElementById("countdowntimer").innerHTML = "";
            progress++;
            playClueSequence();
       }
    } else {
      guessCounter++;
    }
  } else { //if incorrect, invoke loseGame()
    attempts++;
    if (attempts <= 2){ 
      alert("Incorrect pattern! You have " + (3 - attempts) + " guesses left.");
      document.getElementById("attemptscounter").innerHTML = "Attempts left: " + (3 - attempts) + "<br>";
      clearInterval(timer); //clears timer
      document.getElementById("countdowntimer").innerHTML = "";
      progress++;
      playClueSequence();
    } else {
     loseGame(); 
    }
  }
  // add game logic here
}

//if the player loses the game
function loseGame(){
  clearInterval(timer);
  document.getElementById("countdowntimer").innerHTML = "";
  document.getElementById("attemptscounter").innerHTML = "Attempts left: 3";
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

