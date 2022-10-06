/*!
 *  By @Codehemu - https://github.com/hemucode/nonstop-youtube/license ( JS: MIT License)
 *  License - https://github.com/hemucode/nonstop-youtube/license ( CSS: MIT License)
 */

setInterval(()=>{
    if( ! document.querySelector('.ad-showing') ) return
 
          const video=document.querySelector('video')
          if( ! video)  return
  
          const btn=document.querySelector(".ytp-ad-skip-button")
          if( btn) {
            btn.click()
          } else {
            video.currentTime = isNaN(video.duration) ? 0 : video.duration
          }
},300);

(function() {
    "use strict";
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("load.js");
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
})();



   
          
