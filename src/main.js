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
  showGradient : true,
  showBars : true,
  showNoise : false,
  showCircles : true,
  showInvert : false,
  showEmboss : false

};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
  audio.setupWebaudio(DEFAULTS.sound1)
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  let canvasElement = document.querySelector("#canvas"); // hookup <canvas> element
  let bBoxCanvas = document.querySelector("#bBoxCanvas");
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
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
  let trebleLabel = document.querySelector("#trebleLabel");

  trebleSlider.oninput = e=>{
    //set the gain
    audio.settreble(e.target.value);
    
    //update treble label
    trebleLabel.innerHTML = e.target.value;
  };

  //set the vaule of label to match inital value of slider
  trebleSlider.dispatchEvent(new Event("input"));

  //Treble
  let trebleSlider = document.querySelector("#trebleSlider");
  let trebleLabel = document.querySelector("#trebleLabel");

  trebleSlider.oninput = e=>{
    //set the gain
    audio.settreble(e.target.value);
    
    //update treble label
    trebleLabel.innerHTML = e.target.value;
  };

  //set the vaule of label to match inital value of slider
  trebleSlider.dispatchEvent(new Event("input"));


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
  let gradCheck = document.querySelector("#gradientCB");
  let barCheck =  document.querySelector("#barsCB");
  let circleCheck = document.querySelector("#circlesCB");
  let noiseCheck = document.querySelector("#noiseCB");
  let invertCheck = document.querySelector("#invertCB");
  let embossCheck = document.querySelector("#embossCB");

  gradCheck.onclick = e=>{
    drawParams.showGradient = !drawParams.showGradient;
  };

  barCheck.onclick = e =>{
    drawParams.showBars = !drawParams.showBars;
  };

  circleCheck.onclick = e =>{
    drawParams.showCircles = !drawParams.showCircles;
  };

  noiseCheck.onclick = e =>{
    drawParams.showNoise = !drawParams.showNoise;
  }

  invertCheck.onclick = e =>{
    drawParams.showInvert = !drawParams.showInvert;
  }
  embossCheck.onclick = e =>{
    drawParams.showEmboss = !drawParams.showEmboss;
  }
} // end setupUI

function loop(){
  /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
     
  }

export {init};