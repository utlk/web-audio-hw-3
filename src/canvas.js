/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,analyserNode,audioData,timeData;
let firstRun = true;
let bassBox = {x:315, y:415};
let trebleBox = {x:425, y:415};
function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    timeData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    analyserNode.getByteTimeDomainData(timeData);
	
	
	// 2 - draw the waveform/bar background
    ctx.save();
    ctx.fillStyle = "rgb(153, 153, 153)";
    
    ctx.clearRect(135, 53, 550, 75);
    ctx.restore();
	//draw waveform
	if(params.showWaves){
        let waveWidth = (550/timeData.length);
        let x = 135;
        
        ctx.save();
        ctx.linewidth = 10;
        ctx.beginPath();
        let i =0;
        while( i < timeData.length && x <650){
            
            let waveHeight = timeData[i] / 128.0;
            let y = waveHeight * 200 /2.3;
            if (y > 120 )
                y = 120;
            
            if (y < 55)
             y=55;

            ctx.strokeStyle = `rgb(${waveHeight+150}, 50, 59)`;
            if (i === 0){
                ctx.moveTo(x, y);
            }
            else{
                ctx.lineTo(x, y );
            }
            x+=waveWidth;
            i++;
        }
        ctx.lineTo(675, 90);
        ctx.stroke();
        ctx.restore();
    }

    //Draw bar graph
	if(params.showBars){

        let visCanvasHeight = 100;
        let barWidth = (550 / audioData.length) * 2.5;
        let x = 150;
        let i = 0;
        ctx.save();
        while(i<audioData.length && x < 650){
           let barHeight = audioData[i];
            
            ctx.fillStyle = `rgb(${barHeight+150}, 50, 59)`;
            ctx.fillRect  (x,visCanvasHeight - barHeight/6, barWidth, barHeight/ 6);
            ctx.strokeRect(x, visCanvasHeight - barHeight/6, barWidth, barHeight/ 6);
            
            x+= barWidth + 1;
            i++;
        }
        ctx.restore();

    }
  
      

    }

function clear(){
   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

//Corresponds the slider on the canvas to the one for actual
function drawBassSlider(bass){

        let tempPerc = bass/40;
        if(tempPerc != 0){
        bassBox.y = 415 - (220 * tempPerc);
        }

        ctx.save()
        ctx.clearRect(300, 180, 80, 400);
        ctx.fillStyle = "rgb(102, 102, 102)";
        ctx.fillRect(bassBox.x, bassBox.y , 60, 25);
        ctx.restore();
    
}

//Corresponds the slider on the canvas to the one for actual
function drawTrebleSlider(treble){

    let tempPerc2 = treble/40;
    trebleBox.y = 415 - (220 * tempPerc2);
    ctx.save()
    ctx.clearRect(425, 180, 80, 400);
    ctx.fillStyle = "rgb(102, 102, 102)";
    ctx.fillRect(trebleBox.x, trebleBox.y , 60, 25);
    ctx.restore();

}

function drawTime(audioElement){
    let dur = audioElement.duration;
    let curTime = audioElement.currentTime;
    //Gets the minutes and seconds of the duration
    let minsD = Math.floor(dur /60);
    let secondsD = Math.ceil(dur - (minsD * 60));

    //Get minutes and seconds of the playhead
    let minsC =Math.floor(curTime /60);
    let secondsC= Math.ceil(curTime - (minsC * 60));

    //Write Text to the boom box;
    
    ctx.save();
    ctx.clearRect(350, 0, 300, 50);
    ctx.font = '36px Rubik';
    ctx.fillText(`${minsC}:${secondsC} / ${minsD}:${secondsD} `, 340, 30);
    ctx.restore();
    
}
export {setupCanvas, draw, clear, drawBassSlider, drawTrebleSlider, drawTime};
