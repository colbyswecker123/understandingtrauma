(function(){
let breathingTimer=null;
let countdownTimer=null;
let endTimer=null;
let step=0;
let secondsLeft=60;
const totalDuration=60000;
const steps=[
{label:"Inhale slowly.",className:"inhale",duration:4000},
{label:"Hold gently.",className:"hold",duration:2000},
{label:"Exhale slowly.",className:"exhale",duration:6000},
{label:"Rest for a moment.",className:"rest",duration:2000}
];

function getEls(){
return{
text:document.getElementById("breathingText"),
orb:document.getElementById("breathingOrb"),
startButton:document.getElementById("startBreathing"),
stopButton:document.getElementById("stopBreathing")
};
}

function formatTime(seconds){
const mins=Math.floor(seconds/60);
const secs=seconds%60;
return `${mins}:${String(secs).padStart(2,"0")}`;
}

function updateStartButton(){
const {startButton}=getEls();
if(!startButton)return;
startButton.textContent=`Reset in progress — ${formatTime(secondsLeft)}`;
}

function resetButton(){
const {startButton}=getEls();
if(!startButton)return;
startButton.textContent="Start 60-Second Reset";
startButton.disabled=false;
}

function stop(message="Press start when you are ready."){
clearTimeout(breathingTimer);
clearInterval(countdownTimer);
clearTimeout(endTimer);
breathingTimer=null;
countdownTimer=null;
endTimer=null;
step=0;
secondsLeft=60;
const {text,orb}=getEls();
if(text)text.textContent=message;
if(orb)orb.className="breathing-orb";
resetButton();
}

function complete(){
clearTimeout(breathingTimer);
clearInterval(countdownTimer);
clearTimeout(endTimer);
breathingTimer=null;
countdownTimer=null;
endTimer=null;
step=0;
secondsLeft=60;
const {text,orb,startButton}=getEls();
if(text)text.textContent="You completed the 60-second reset. Take one more easy breath.";
if(orb)orb.className="breathing-orb";
if(startButton){
startButton.textContent="Complete";
startButton.disabled=true;
}
setTimeout(()=>{
resetButton();
if(text)text.textContent="Press start when you are ready.";
},1800);
}

function setStep(){
const {text,orb}=getEls();
if(!text||!orb){
stop();
return;
}
const current=steps[step%steps.length];
text.textContent=current.label;
orb.className=`breathing-orb ${current.className}`;
step++;
breathingTimer=setTimeout(setStep,current.duration);
}

function start(){
if(breathingTimer||countdownTimer||endTimer)return;
const {startButton}=getEls();
secondsLeft=60;
if(startButton)startButton.disabled=false;
updateStartButton();
setStep();
countdownTimer=setInterval(()=>{
secondsLeft--;
if(secondsLeft<0)secondsLeft=0;
updateStartButton();
},1000);
endTimer=setTimeout(()=>{
complete();
},totalDuration);
}

function runDestress(){
const {startButton,stopButton}=getEls();
if(startButton&&startButton.dataset.utBreathBound!=="true"){
startButton.dataset.utBreathBound="true";
startButton.textContent="Start 60-Second Reset";
startButton.addEventListener("click",start);
}
if(stopButton&&stopButton.dataset.utBreathBound!=="true"){
stopButton.dataset.utBreathBound="true";
stopButton.addEventListener("click",()=>{
stop("Reset stopped. Press start when you are ready.");
});
}
}

window.runDestress=runDestress;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",runDestress);
}else{
runDestress();
}

document.addEventListener("ut:beforepagechange",()=>{
stop("Press start when you are ready.");
});
document.addEventListener("ut:pagechange",runDestress);
})();
