(function(){
let timer=null;
let step=0;
const steps=[
{label:"Inhale slowly.",className:"inhale",duration:4000},
{label:"Hold gently.",className:"hold",duration:2000},
{label:"Exhale slowly.",className:"exhale",duration:6000},
{label:"Rest for a moment.",className:"rest",duration:2000}
];

function stop(){
clearTimeout(timer);
timer=null;
step=0;
const text=document.getElementById("breathingText");
const orb=document.getElementById("breathingOrb");
if(text)text.textContent="Press start when you are ready.";
if(orb)orb.className="breathing-orb";
}

function setStep(){
const text=document.getElementById("breathingText");
const orb=document.getElementById("breathingOrb");
if(!text||!orb){stop();return;}
const current=steps[step%steps.length];
text.textContent=current.label;
orb.className=`breathing-orb ${current.className}`;
step++;
timer=setTimeout(setStep,current.duration);
}

function runDestress(){
const startButton=document.getElementById("startBreathing");
const stopButton=document.getElementById("stopBreathing");
if(startButton&&startButton.dataset.utBreathBound!=="true"){
startButton.dataset.utBreathBound="true";
startButton.addEventListener("click",()=>{if(timer)return;setStep();});
}
if(stopButton&&stopButton.dataset.utBreathBound!=="true"){
stopButton.dataset.utBreathBound="true";
stopButton.addEventListener("click",stop);
}
}

window.runDestress=runDestress;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",runDestress);
}else{
runDestress();
}

document.addEventListener("ut:beforepagechange",stop);
document.addEventListener("ut:pagechange",runDestress);
})();
