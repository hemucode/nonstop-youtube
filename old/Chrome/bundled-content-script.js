/*!
 *  By @Codehemu - https://github.com/hemucode/nonstop-youtube/license ( JS: MIT License)
 *  License - https://github.com/hemucode/nonstop-youtube/license ( CSS: MIT License)
 */

setInterval(()=>{
    const btn=document.querySelector(".ytp-ad-skip-button");
    const btn2=document.querySelector("#confirm-button");
    if(btn) {btn.click()}
    if(btn2) {btn2.click()}
    if( ! document.querySelector('.ad-showing') ) return
 
          const video=document.querySelector('video')
          if( ! video)  return

          if( btn) {
            btn.click()
          } else {
            video.currentTime = isNaN(video.duration) ? 0 : video.duration
          }
},300);

(function(){
    "use strict";
    let javascript = `
    <script type="text/javascript">
      function nonstop() {
         "use strict";
          var _lact = {
              set: () => 0,
              get: () => Date.now()
          };
          Object.defineProperty(window, "_lact", _lact);
      } 
      nonstop();
    </script>
    `;
    (document.head || document.documentElement).insertAdjacentHTML("beforeend", javascript);
})();







   
          
