const startButton=document.getElementById("startBreathing");
const stopButton=document.getElementById("stopBreathing");
const text=document.getElementById("breathingText");
const orb=document.getElementById("breathingOrb");
let timer=null;
let step=0;
const steps=[
{label:"Inhale slowly.",className:"inhale",duration:4000},
{label:"Hold gently.",className:"hold",duration:2000},
{label:"Exhale slowly.",className:"exhale",duration:6000},
{label:"Rest for a moment.",className:"rest",duration:2000}
];
function setStep(){
const current=steps[step%steps.length];
if(text)text.textContent=current.label;
if(orb)orb.className=`breathing-orb ${current.className}`;
step++;
timer=setTimeout(setStep,current.duration);
}
function stop(){
clearTimeout(timer);
timer=null;
step=0;
if(text)text.textContent="Press start when you are ready.";
if(orb)orb.className="breathing-orb";
}
if(startButton)startButton.addEventListener("click",()=>{if(timer)return;setStep();});
if(stopButton)stopButton.addEventListener("click",stop);
