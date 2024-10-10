/* © Copyright 2024, Hemanta Gayen, All rights reserved. */
/*!
 *  NonStop YouTube™ by @codehemu -https://github.com/hemucode/nonstop-youtube/
 *  License - https://github.com/hemucode/nonstop-youtube/license ( CSS: MIT License)
 */


const WEBSTORE = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`;
const POPUP_RESTRICTION_DATE = "popupRestrictionKey";
const POPUP_RATE_DATE = "popupRateDateKey";
const MIN_RATE_POPUP_GAPE_DAY =  1000 * 60 * 60 * 24 * 3; // 3 days


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
  skipButtonContainer = ".ytp-ad-skip-button-container";
  videoCurrentTime = 1.5;
  videoDurationLessTime = 0.5;


  constructor(skipButtonContainer,videoCurrentTime,videoDurationLessTime) {
    this.skipButtonContainer = skipButtonContainer;
    this.videoCurrentTime = videoCurrentTime;
    this.videoDurationLessTime = videoDurationLessTime;
  }

  start() {
    let playerContainer = false,
    skipButton = this.skipButtonContainer,
    lessCurrentTime = this.videoCurrentTime,
    lessdurationTime = this.videoDurationLessTime,
    tigger = 0;

    clearInterval(tigger),
    tigger = setInterval((() => {
      (function () {
        if (!playerContainer) {
          document.querySelector(skipButton)?.click();
        }
      })(),
      function () {
        let playerContainer = document.querySelector(".html5-video-player.ad-showing video"),
        tigger = document.getElementById("yt-ext-info-bar");
        try{
          playerContainer ? (
          tigger && tigger.classList.remove("yt-ext-hidden"),
          playerContainer.volume = 0, 
          playerContainer.paused && playerContainer.play(),
          playerContainer.currentTime > lessCurrentTime && playerContainer.currentTime < playerContainer.duration && 
          (playerContainer.currentTime = playerContainer.duration - lessdurationTime)) : tigger && tigger.classList.add("yt-ext-hidden")
        }catch (e) {
          console.error(e);
        }

      }()
    }), 550)

  }
}


class Dialog {
  isUpdatePopupEnabled = "";
  isRateUsPopupEnabled = "";
  isMessage = "";

  constructor(isUpdatePopupEnabled ,isRateUsPopupEnabled ,isMessage) {
    this.isUpdatePopupEnabled = isUpdatePopupEnabled;
    this.isRateUsPopupEnabled = isRateUsPopupEnabled;
    this.isMessage = isMessage;
  }

  start() {
    if (isIframe()) {
      return;
    }

    try {
      chrome.storage.local.get(
        [
          POPUP_RATE_DATE,
          POPUP_RESTRICTION_DATE,
        ],
        async (result) => {
          const now = Date.now();
          const popup_date = result[POPUP_RESTRICTION_DATE];
          const rate_date = result[POPUP_RATE_DATE];

          if (this.isUpdatePopupEnabled) {
            this.createDialogPopup("NEW UPDATE", WEBSTORE, rate_date);
          }else if(this.isMessage) {
            this.createDialogPopup(this.isMessage, WEBSTORE, rate_date);
          }else if(this.isRateUsPopupEnabled){
            if (popup_date && rate_date) {
              if (popup_date + rate_date < now) {
                this.createDialogPopup(chrome.i18n.getMessage("rate") ,`${WEBSTORE}/reviews`, rate_date + MIN_RATE_POPUP_GAPE_DAY);
              }
            }else{
               this.createDialogPopup(chrome.i18n.getMessage("rate") ,`${WEBSTORE}/reviews`, MIN_RATE_POPUP_GAPE_DAY);
            } 
          }

      });
    }catch(err) {
      console.log(err.message);
    }

  }

  appendPopup(dialog) {
    domReady(() => {
      document.body.appendChild(dialog);
    });
  }

  handlePopupClose(dialog, storageKeyRestriction) {
    document.body.removeChild(dialog);

    chrome.storage.local.set(storageKeyRestriction, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  createDialogPopup(text, link, rate_date) {
    const handleClose = () => {
      this.handlePopupClose(dialog, {
        [POPUP_RATE_DATE]: rate_date,
        [POPUP_RESTRICTION_DATE]: Date.now(),
      });
    };

    // Create dialog
    const dialog = document.createElement("DIV");
    dialog.classList.add("nonstop-dialog");

    // Create closeIcon
    const closeIcon = document.createElement("A");
    closeIcon.classList.add("nonstop-close-icon");
    closeIcon.appendChild(document.createTextNode(" "));
    closeIcon.addEventListener("click", handleClose);
    dialog.appendChild(closeIcon);

    // Create header
    const header = document.createElement("DIV");
    header.appendChild(
      document.createTextNode(chrome.i18n.getMessage("app_name"))
    );
    header.classList.add("nonstop-dialog-header");
    dialog.appendChild(header);

    // Create ShareLink
    const webstoreLink = document.createElement("A");
    webstoreLink.classList.add("nonstop-webstore-link");
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
      .nonstop-dialog {
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

      .nonstop-close-icon {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 10px;
        height: 10px;
        opacity: 0.8;
      }
      .nonstop-close-icon:hover {
        opacity: 1;
      }
      .nonstop-close-icon:before, 
      .nonstop-close-icon:after {
        position: absolute;
        left: 5px;
        content: ' ';
        height: 10px;
        width: 2px;
        background-color: white;
      }
      .nonstop-close-icon:before {
        transform: rotate(45deg);
      }
      .nonstop-close-icon:after {
        transform: rotate(-45deg);
      }

      .nonstop-dialog-header {
        font-size: 16px;
        padding: 16px 24px;
        color: white;
      }

      .nonstop-webstore-link {
        display: block;
        font-size: 13px;
        color: white;
        padding: 16px 24px;
        text-decoration: none;
        opacity: 0.8;
        border-top: 1px solid white;
        text-transform: uppercase;
      }

      .nonstop-webstore-link:hover {
        opacity: 1;
      }
    `)
    );
    dialog.appendChild(stylesheet);
    dialog.style.display = "block";

    this.appendPopup(dialog);
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
      commentsAndshorts();
    }
  }
);


async function commentsAndshorts() {
  let headElement = document.head || document.getElementsByTagName("head")[0];

  if (!headElement) return void setTimeout((() => {
   commentsAndshorts();
  }), 100);

  var commentsPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"comments": true}, function(options){
          resolve(options.comments);
      })
  });

  var shortsPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"shorts": false}, function(options){
          resolve(options.shorts);
      })
  });

  const comments = await commentsPromise;
  const shorts = await shortsPromise;

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

async function observer(){
  const observer = new MutationObserver(() => { preventAutostop() });

  var nonstopPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"nonstop": true}, function(options){
          resolve(options.nonstop);
    })
  });

  const nonstop = await nonstopPromise;

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
  var codehemu = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"enabled": true}, function(options){
          resolve(options.enabled);
    })
  });

  var adBlockSelectorsPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"adBlockingSelectors": adBlockSelector}, function(options){
          resolve(options.adBlockingSelectors);
    })
  });

  var skipButtonContainerPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"skipButtonContainer": ".ytp-ad-skip-button-container"}, function(options){
          resolve(options.skipButtonContainer);
    })
  });

  var videoCurrentTimePromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"videoCurrentTime": 1.5}, function(options){
          resolve(options.videoCurrentTime);
    })
  });

  var videoDurationLessTimePromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"videoDurationLessTime": 0.5}, function(options){
          resolve(options.videoDurationLessTime);
    })
  });

  var isUpdatePopupEnabledPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"isUpdatePopupEnabled": false}, function(options){
          resolve(options.isUpdatePopupEnabled);
    })
  });

  var isRateUsPopupEnabledPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"isRateUsPopupEnabled": true}, function(options){
          resolve(options.isRateUsPopupEnabled);
    })
  });


  var isMessagePromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"isMessage": ""}, function(options){
          resolve(options.isMessage);
    })
  });

  const enabled = await codehemu;
  const adBlockSelectors = await adBlockSelectorsPromise;
  const skipButtonContainer = await skipButtonContainerPromise;
  const videoCurrentTime = await videoCurrentTimePromise;
  const videoDurationLessTime = await videoDurationLessTimePromise;
  const isUpdatePopupEnabled = await isUpdatePopupEnabledPromise;
  const isRateUsPopupEnabled = await isRateUsPopupEnabledPromise;
  const isMessage = await isMessagePromise;


  const filters = [
      new CosmeticFilter(adBlockSelectors),
      new SkipVideoAds(skipButtonContainer, videoCurrentTime, videoDurationLessTime),
      new Dialog(isUpdatePopupEnabled, isRateUsPopupEnabled, isMessage)
  ];
   
  if (enabled) {
    filters.forEach((filter) => {
      filter.start();
    });
  }


}








   
          
