/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
const drawParams = {
  showBars : true,
  showWaves : false
};

let bassVal;
let trebleVal;
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
  audio.setupWebaudio(DEFAULTS.sound1)
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  let canvasElement = document.querySelector("#canvas"); // hookup <canvas> element
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  setupUI(canvasElement);
  loop();
}

function setupUI(canvasElement){
  let tempImg = document.querySelector("#boombox");
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
    utils.goFullscreen(tempImg);
  };

  playButton.onclick = e => {
    //check if context is in suspended state (autoplay policy)
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state ater = ${audio.audioCtx.stae}`);

    if(e.target.dataset.playing == "no"){
      //If track is paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes";

      //If track is playing pause it
    }else{
      audio.pauseCurrentSound();
      e.target.dataset.playing ="no";
    }
  };

  //Sliders setup
  //Volume
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  volumeSlider.oninput = e=>{
    //set the gain
    audio.setVolume(e.target.value);
    
    //update volume label
    volumeLabel.innerHTML = Math.round((e.target.value/2*100));
  };

  //set the vaule of label to match inital value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  //Treble
  let trebleSlider = document.querySelector("#trebleSlider");
  canvas.drawTrebleSlider(trebleSlider.value);
  let trebleLabel = document.querySelector("#trebleLabel");

  trebleSlider.oninput = e=>{
    //set the gain
    audio.setTreble(e.target.value);
    canvas.drawTrebleSlider(e.target.value);
    //update treble label
    trebleLabel.innerHTML = e.target.value;
  };

  //set the vaule of label to match inital value of slider
  trebleSlider.dispatchEvent(new Event("input"));

  //bass
  let bassSlider = document.querySelector("#bassSlider");
  canvas.drawBassSlider(bassSlider.value);
  let bassLabel = document.querySelector("#bassLabel");

  bassSlider.oninput = e=>{
    //set the gain
    canvas.drawBassSlider(e.target.value);
    audio.setBass(e.target.value);
    
    //update bass label
    bassLabel.innerHTML = e.target.value;
  };

  //set the vaule of label to match inital value of slider
  bassSlider.dispatchEvent(new Event("input"));


  //D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  //add .onchange event  to <select>
  trackSelect.onchange = e =>{
    audio.loadSoundFile(e.target.value);
    //pause the currect track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  //Events for handling the check boxes.

  let barCheck =  document.querySelector("#barsCB");
  let waveCheck = document.querySelector("#waveCB");
 

  barCheck.onclick = e =>{
    drawParams.showBars = !drawParams.showBars;
  };

  waveCheck.onclick = e =>{
    drawParams.showWaves = !drawParams.showWaves;
  };
} // end setupUI

function loop(){
  /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
    canvas.drawTime(audio.element);
    
  }

export {init};