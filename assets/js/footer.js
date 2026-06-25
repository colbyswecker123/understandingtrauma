(function(){
function renderFooter(){
const footerMount=document.getElementById("siteFooter");
if(!footerMount)return;

footerMount.innerHTML=`
<footer class="clean-footer minimal-footer">
<div class="footer-main">
<div class="footer-brand-block">
<p class="footer-brand">Understanding Trauma</p>
<p class="footer-note">Gentle reminders for hard moments.</p>
<p class="footer-legal">© 2026 Understanding Trauma. All rights reserved.</p>
<p class="footer-disclaimer">This site offers encouragement and general support. It is not a substitute for professional medical, mental health, legal, or emergency help.</p>
</div>
<div class="footer-socials" aria-label="Social media links">
<a href="https://www.tiktok.com/@understandingtrauma?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener" aria-label="TikTok">
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<path fill="currentColor" d="M14.7 3c.3 2.1 1.5 3.5 3.5 3.9v3.1c-1.3 0-2.4-.4-3.5-1.1v5.8c0 3-2 5.3-5 5.3-2.8 0-4.9-1.9-4.9-4.5 0-2.8 2.2-4.8 5.2-4.8.4 0 .8 0 1.1.1v3.2c-.3-.1-.6-.1-.9-.1-1.2 0-2 .7-2 1.6s.7 1.5 1.7 1.5c1.1 0 1.8-.7 1.8-2.1V3h3z"/>
</svg>
</a>
<a href="https://www.instagram.com/under_standingtrauma/" target="_blank" rel="noopener" aria-label="Instagram">
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<rect x="4" y="4" width="16" height="16" rx="4.5" ry="4.5" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="17.1" cy="6.9" r="1.1" fill="currentColor"/>
</svg>
</a>
<a href="https://www.facebook.com/profile.php?id=61576005540842" target="_blank" rel="noopener" aria-label="Facebook">
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<path fill="currentColor" d="M14 8.2h2.2V5.1c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.1v2.8H5v3.5h3.2V24h3.9v-7.7h3.1l.5-3.5h-3.6v-2.4c0-1 .3-2.2 1.9-2.2z"/>
</svg>
</a>
</div>
<button class="footer-music-button footer-music-inline" id="musicToggle" type="button" aria-pressed="false">
<span class="footer-music-icon" aria-hidden="true">♪</span>
<span class="footer-music-label">Play music</span>
</button>
</div>
<div class="footer-links">
<a href="/">Home</a>
<a href="/user_messages/">Submit a Message</a>
<a href="/resources/">Resources</a>
<a href="/destress/">Destress</a>
<a href="/faith/">Faith</a>
<a href="/store/">Store</a>
<a href="/support/">Support</a>
<a href="/about/">About</a>
</div>
</footer>
`;

document.dispatchEvent(new CustomEvent("ut:footerready"));
}

window.renderSiteFooter=renderFooter;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",renderFooter);
}else{
renderFooter();
}

document.addEventListener("ut:pagechange",renderFooter);
})();
