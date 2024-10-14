/* © Copyright 2024, Hemanta Gayen, All rights reserved. */
/*!
 *  NonStop YouTube™ by @codehemu -https://github.com/hemucode/nonstop-youtube/
 *  License - https://github.com/hemucode/nonstop-youtube/license ( CSS: MIT License)
 */

const WEBSTORE = `https://addons.opera.com/en/extensions/details/nonstop-youtubetm/`;
const WEBSTORE_REVIEW = `${WEBSTORE}`;


const isIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

const closeConfirmButton = ()=> {
  try{
    return new Promise((resolve) => {
      const confirmButton = document.getElementById("confirm-button");
      if (confirmButton) {
        confirmButton.click();
        resolve(true);
      }
      resolve(false);
    });
  } catch (e) {
    return false;
  }
}

const removeStillWatchingPopup = ()=> {
  try{
    return new Promise((resolve) => {
      [
        "Still watching? Video will pause soon",
        "Bist du noch da? Die Wiedergabe wird bald unterbrochen.",
        "Video paused. Continue watching?",
        
      ].forEach((text) => {
        const areYouStillTherePopup = document.evaluate(
          `//div[contains(text(),"${text}")]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (areYouStillTherePopup) {
          document.querySelectorAll("tp-yt-paper-toast").forEach((toast) => {
            if (
              toast.label &&
              toast.label !== undefined &&
              toast.label.includes(text)
            ) {
              toast.getElementsByTagName("button")[0].click();
              resolve(true);
            }
          });
        }
      });

      resolve(false);
    });

  }catch (e) {
    return false;
  }
}

class CosmeticFilter {
  adBlockSelectors = "";

  constructor(adBlockSelectors) {
    this.adBlockSelectors = adBlockSelectors;
  }

  start() {
    let headElement = document.head || document.getElementsByTagName("head")[0];
    let bodyElement = document.body || document.getElementsByTagName("body")[0];

    if (!headElement || !bodyElement) return void setTimeout((() => {
      new CosmeticFilter(this.adBlockSelectors,this.removeVideoAdsScript).start();
    }), 100);

    const newCssContent = `
    .yt-ext-hidden {
      display: none;
    }

    #yt-ext-info-bar {
      position: fixed;
      bottom: 20px;
      left: 20px;
      height: auto;
      border: 1px solid #ececec;
      background: #ff0000;
      z-index: 100000;
      padding: 5px 12px;
      color: white;
      font-size: 14px;
      border-radius: 4px;
    }

    .ad-container,
    .ad-div,
    .masthead-ad-control,
    .video-ads,
    .ytp-ad-progress-list,
    #ad_creative_3,
    #footer-ads,
    #masthead-ad,
    #player-ads,
    .ytd-mealbar-promo-renderer,
    #watch-channel-brand-div,
    #watch7-sidebar-ads,
    ytd-display-ad-renderer,
    ytd-compact-promoted-item-renderer,
    .html5-video-player.ad-showing video {
      display: none !important;
    }`;

    if (!document.getElementById("yt-extension-style")) {
      let styleElement = document.createElement("style");
      styleElement.id = "yt-extension-style",
      styleElement.appendChild(document.createTextNode(newCssContent)), 
      headElement.appendChild(styleElement);
    }

    if (!document.getElementById("yt-ext-info-bar")) {
        var divEl = document.createElement("div");
        divEl.id = "yt-ext-info-bar",
        divEl.innerText = "NonStop Skipping ads...", 
        divEl.classList.add("yt-ext-hidden"), 
        bodyElement.appendChild(divEl);
    }


    if (!this.adBlockSelectors) {
      return;
    }

    if (!document.getElementById("adBlock-Selectors")) {
      const cssContent = `${this.adBlockSelectors} { display: none !important; visibility: hidden !important;}`;
      const styleEl = document.createElement("style");
      styleEl.id = "adBlock-Selectors",
      styleEl.textContent = cssContent,
      headElement.appendChild(styleEl);
    }

  }

}


class SkipVideoAds {

  constructor(isPlayerContainer, 
    isSkipButtonContainer, 
    isSkipAdsEnabled, 
    lessCurrentTime,
    lessDurationTime, 
    minusDurationTime,
    isSpeedAdsEnabled, 
    videoSpeed) {
    this.isPlayerContainer = isPlayerContainer;
    this.isSkipButtonContainer = isSkipButtonContainer;
    this.lessCurrentTime = lessCurrentTime;
    this.lessDurationTime = lessDurationTime;
    this.minusDurationTime = minusDurationTime;
    this.isSpeedAdsEnabled = isSpeedAdsEnabled ;
    this.videoSpeed = videoSpeed;
    this.isSkipAdsEnabled = isSkipAdsEnabled;

  }

  start() {
    let isPlayerContainer = this.isPlayerContainer,
    isSkipButtonContainer = this.isSkipButtonContainer,
    lessCurrentTime = this.lessCurrentTime,
    lessDurationTime = this.lessDurationTime,
    minusDurationTime = this.minusDurationTime,
    isSpeedAdsEnabled = this.isSpeedAdsEnabled,
    videoSpeed = this.videoSpeed,
    isSkipAds = this.isSkipAdsEnabled,
    tigger = 0;

    clearInterval(tigger),
    tigger = setInterval(() => {
      let playerContainer = document.querySelector(isPlayerContainer),
      //skipButton = document.querySelector(isSkipButtonContainer),
      tigger = document.getElementById("yt-ext-info-bar");
      //errorScreen = document.querySelector("#error-screen");
      try{
        playerContainer ? (
        tigger && tigger.classList.remove("yt-ext-hidden"),
        playerContainer.volume = 0, 
        isSpeedAdsEnabled &&
        (playerContainer.playbackRate = videoSpeed),
        isSkipAds &&
        playerContainer.currentTime > lessCurrentTime && 
        playerContainer.currentTime < lessCurrentTime * 3 && 
        playerContainer.currentTime < playerContainer.duration && 
        playerContainer.duration > lessDurationTime && 
        (playerContainer.currentTime = playerContainer.duration - minusDurationTime)
        ) : tigger && tigger.classList.add("yt-ext-hidden")
      }catch (e) {
        console.error(e);
      }
    }, 550)

  }
}


class Dialog {
  isUpdatePopupEnabled = "";
  isRateUsPopupEnabled = "";
  isMessage = "";

  constructor(updateVersionOpera,
    isRateUsPopupEnabled, 
    nextRatingRequest, 
    isMessage, 
    isMessageURL) {
      this.nextRatingRequest = nextRatingRequest;
      this.updateVersionOpera = updateVersionOpera;
      this.isRateUsPopupEnabled = isRateUsPopupEnabled;
      this.isMessage = isMessage;
      this.isMessageURL = isMessageURL;
  }

  start() {
    if (isIframe()) {
      return;
    }

    try {
      setTimeout(() => {
        if (this.updateVersionOpera > chrome.runtime.getManifest().version) {
          this.createDialogPopup(`New Version ${this.updateVersionOpera} Available Please Update..😉`, WEBSTORE);
        }else{
          if (this.isRateUsPopupEnabled && this.nextRatingRequest) {
            const webstoreLink = this.createDialogPopup(chrome.i18n.getMessage("rate") , WEBSTORE_REVIEW);
            webstoreLink.addEventListener("click", () => {
              chrome.storage.sync.set({
                nextRatingRequest: false
              });
            });
          }else{
            if (!this.isMessage=="") {
              this.createDialogPopup(this.isMessage, WEBSTORE);
            }
          }
        }
      },2000);
    }catch(err) {
      console.log(err.message);
    }

  }

  appendPopup(dialog) {
    domReady(() => {
      document.body.appendChild(dialog);
    });
  }

  handlePopupClose(dialog) {
    document.body.removeChild(dialog);
  }

  createDialogPopup(text, link) {
    const handleClose = () => {
      this.handlePopupClose(dialog);
    };
    // Create dialog
    const dialog = document.createElement("DIV");
    dialog.classList.add("mytube-dialog");

    // Create closeIcon
    const closeIcon = document.createElement("A");
    closeIcon.classList.add("mytube-close-icon");
    closeIcon.appendChild(document.createTextNode(" "));
    closeIcon.addEventListener("click", handleClose);
    dialog.appendChild(closeIcon);

    // Create header
    const header = document.createElement("DIV");
    header.appendChild(
      document.createTextNode(chrome.i18n.getMessage("app_name"))
    );
    header.classList.add("mytube-dialog-header");
    dialog.appendChild(header);

    // Create ShareLink
    const webstoreLink = document.createElement("A");
    webstoreLink.classList.add("mytube-webstore-link");
    webstoreLink.setAttribute("href", link);
    webstoreLink.setAttribute("target", "_blank");
    webstoreLink.appendChild(
      document.createTextNode(text)
    );

    webstoreLink.addEventListener("click", handleClose);
    dialog.appendChild(webstoreLink);

    const stylesheet = document.createElement("style");
    stylesheet.type = "text/css";
    stylesheet.appendChild(
      document.createTextNode(`
      .mytube-dialog {
        right: 10px;
        z-index: 99999999999;
        top: 68px;
        padding: 0;
        margin: 0;
        border-radius: 4px;
        border: 1px solid white;
        text-align: center;
        display: none;
        background-color: #000000c7;
        position: fixed;
      }

      .mytube-close-icon {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 10px;
        height: 10px;
        opacity: 0.8;
      }
      .mytube-close-icon:hover {
        opacity: 1;
      }
      .mytube-close-icon:before, .mytube-close-icon:after {
        position: absolute;
        left: 5px;
        content: ' ';
        height: 10px;
        width: 2px;
        background-color: white;
      }
      .mytube-close-icon:before {
        transform: rotate(45deg);
      }
      .mytube-close-icon:after {
        transform: rotate(-45deg);
      }

      .mytube-dialog-header {
        font-size: 16px;
        padding: 16px 24px;
        color: white;
      }

      .mytube-webstore-link {
        display: block;
        font-size: 13px;
        color: white;
        padding: 16px 24px;
        text-decoration: none;
        opacity: 0.8;
        border-top: 1px solid white;
        text-transform: uppercase;
      }

      .mytube-webstore-link:hover {
        opacity: 1;
      }
    `)
    );
    dialog.appendChild(stylesheet);
    dialog.style.display = "block";

    this.appendPopup(dialog);

    return webstoreLink;
  }

}

function domReady(callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback, {
      once: true,
    });
  }
}


chrome.runtime.sendMessage(
  {
    action: "PAGE_READY",
  },
  ({adBlockSelectors}) => {
    const pageUrl = new URL(window.location.href)
    if (/youtube\.com/.test(window.location.origin)) {
      info(adBlockSelectors);
      observer();
    }
  }
);


const commentShorts = (comments,shorts) =>{
  let headElement = document.head || document.getElementsByTagName("head")[0];

  if (!headElement) return void setTimeout((() => {
   commentShorts(comments,shorts);
  }), 100);
 
  if (!comments && !document.getElementById("comments-Selectors")) {
    const cssContent = "ytd-comments { display: none !important; visibility: hidden !important;}";
    const styleEl = document.createElement("style");
    styleEl.id = "comments-Selectors",
    styleEl.textContent = cssContent,
    headElement.appendChild(styleEl);
  };

  if (shorts && !document.getElementById("shorts-Selectors")) {
    const shortsSelectors = [
      "ytd-rich-shelf-renderer",
      "ytd-reel-shelf-renderer",
      ".ytd-reel-shelf-renderer",
      "a[title=\"Shorts\"]"
      ];

    this.selectors = shortsSelectors.join(",");
    const newCssContent = `${this.selectors} { display: none !important; visibility: hidden !important;}`;

    const styleElement = document.createElement("style");
    styleElement.id = "shorts-Selectors",
    styleElement.appendChild(document.createTextNode(newCssContent)), 
    headElement.appendChild(styleElement);
  };


}

const YTnonstop = (nonstop)=>{
  const observer = new MutationObserver(() => { preventAutostop() });

  // call `observe()`, passing it the element to observe, and the options object
  if (nonstop) {
    observer.observe(document.querySelectorAll("ytd-popup-container")[0], {
      subtree: true,
      childList: true,
    });
  }

}

async function preventAutostop() {
    console.log("Prevent Autostop: callback that runs when observer is triggered");
    try{
      const announcer = document.getElementsByClassName("iron-a11y-announcer");
      if (announcer.length > 0 && announcer[0].innerText !== "")
        await removeStillWatchingPopup();

      const reloadRequired = await closeConfirmButton();
      if (reloadRequired) location.reload();
      //console.log("Prevent Autostop: if (reloadRequired) location.reload()");

    } catch (e) {
        console.error(e);
    }
}



async function info(adBlockSelector){
  var promise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({
        "enabled": true,
        "adBlockingSelectors": adBlockSelector,
        "isPlayerContainer": ".html5-video-player.ad-showing video",
        "isSkipButtonContainer": ".ytp-ad-skip-button",
        "isSkipAdsEnabled": true,
        "lessCurrentTime": 1.5,
        "lessDurationTime": 10,
        "minusDurationTime": 3,
        "isSpeedAdsEnabled": false,
        "videoSpeed": 2,
        "isRecommendEnabled": false,
        "isRateUsPopupEnabled": true,
        "updateVersionOpera": chrome.runtime.getManifest().version,
        "isMessage": "",
        "isMessageURL": "",
        "nextRatingRequest": true,
        "nonstop": true,
        "comments": true,
        "shorts": false
      }, (options)=>{
        resolve(options)
      })
  });

  const options = await promise;
  commentShorts(options.comments, options.shorts);
  YTnonstop(options.nonstop);
  const filters = [
      new CosmeticFilter(options.adBlockingSelectors),
      new SkipVideoAds(options.isPlayerContainer, options.isSkipButtonContainer, options.isSkipAdsEnabled, options.lessCurrentTime,options.lessDurationTime, options.minusDurationTime, options.isSpeedAdsEnabled, options.videoSpeed),
      new Dialog(options.updateVersionOpera, options.isRateUsPopupEnabled,  options.nextRatingRequest, options.isMessage, options.isMessageURL)
  ];
   
  if (options.enabled) {
    filters.forEach((filter) => {
      filter.start();
    });
  }


}








   
          
