(function(){
let timer=null;
let stopTimer=null;
let step=0;
const totalDuration=60000;
const steps=[
{label:"Inhale slowly.",className:"inhale",duration:4000},
{label:"Hold gently.",className:"hold",duration:2000},
{label:"Exhale slowly.",className:"exhale",duration:6000},
{label:"Rest for a moment.",className:"rest",duration:2000}
];

function stop(message="You completed the 60-second reset. Take one more easy breath."){
clearTimeout(timer);
clearTimeout(stopTimer);
timer=null;
stopTimer=null;
step=0;
const text=document.getElementById("breathingText");
const orb=document.getElementById("breathingOrb");
const startButton=document.getElementById("startBreathing");
if(text)text.textContent=message;
if(orb)orb.className="breathing-orb";
if(startButton)startButton.textContent="Start 60-Second Reset";
}

function setStep(){
const text=document.getElementById("breathingText");
const orb=document.getElementById("breathingOrb");
if(!text||!orb){
stop("Press start when you are ready.");
return;
}
const current=steps[step%steps.length];
text.textContent=current.label;
orb.className=`breathing-orb ${current.className}`;
step++;
timer=setTimeout(setStep,current.duration);
}

function start(){
if(timer||stopTimer)return;
const startButton=document.getElementById("startBreathing");
if(startButton)startButton.textContent="Reset in progress...";
setStep();
stopTimer=setTimeout(()=>{
stop();
},totalDuration);
}

function runDestress(){
const startButton=document.getElementById("startBreathing");
const stopButton=document.getElementById("stopBreathing");
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
