/* © Copyright 2024, Hemanta Gayen, All rights reserved. */
/*!
 *  NonStop YouTube™ by @codehemu -https://github.com/hemucode/nonstop-youtube/
 *  License - https://github.com/hemucode/nonstop-youtube/license ( CSS: MIT License)
 */

/**
 * Here are the IDs and classes of all YouTube advertisement elements.
 * adBlockingSelectorsFallback Always changing. Here are the IDs and classes of 
 * all types of banner ads and other ads that can be easily targeted and remove.
 * rights only @codehemu.
 */

const adBlockingSelectorsFallback = [
  'ytd-promoted-video-renderer',
  'ytd-movie-offer-module-renderer',
  'ytd-promoted-sparkles-web-renderer',
  'ytd-promoted-sparkles-text-search-renderer',
  'ytd-player-legacy-desktop-watch-ads-renderer',
  '#player-ads',
  '#search-pva',
  '#premium-yva',
  '#masthead-ad',
  '#feedmodule-PRO',
  '#video-masthead',
  '#watch-buy-urls',
  '#sub-frame-error',
  '#main-frame-error',
  '#watch7-sidebar-ads',
  '#feed-pyv-container',
  '#shelf-pyv-container',
  '#watch-branded-actions',
  '#watch-channel-brand-div',
  '#homepage-chrome-side-promo',
  '#watch-channel-brand-div-text',
  '.iv-promo',
  '.video-ads',
  '.promoted-videos',
  '.ytp-ad-progress',
  '.ytp-ad-progress-list',
  '.searchView.list-view',
  '.html5-ad-progress-list',
  '.watch-extra-info-right',
  '.watch-extra-info-column',
  '.lohp-pyv-shelf-container',
  '.ytd-merch-shelf-renderer',
  '.carousel-offer-url-container',
  '.youtubeSuperLeaderBoardAdHolder',
  '.youtubeSuperLeaderOverallAdArea',
  '.ytd-movie-offer-module-renderer',
  '.ytd-action-companion-ad-renderer',
  'iframe[id^=ad_]',
  'div[class*="-ad-v"]',
  'div[class*="-ads-"]',
  'a[href*="/adwords/"]',
  'a[href*="doubleclick.net"]',
  'iframe[src*="doubleclick.net"]',
  'a[href^="http://www.youtube.com/cthru?"]',
  'a[href^="https://www.youtube.com/cthru?"]',
  'a[onclick*="\\"ping_url\\":\\"http://www.google.com/aclk?"]',
  '.ad-showing > .html5-video-container',
  '.ytd-player-legacy-desktop-watch-ads-renderer',
  '.ytd-rich-item-renderer > ytd-ad-slot-renderer',
  'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
  '#contents > ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer)',
  '.ad-container',
  'ytd-display-ad-renderer',
  '.ytd-carousel-ad-renderer',
  'ytd-compact-promoted-video-renderer',
  '.ytd-promoted-sparkles-text-search-renderer',
  '.masthead-ad-control',
  '#ad_creative_3',
  '#footer-ads',
  '.ad-div',
  '.ytd-mealbar-promo-renderer',
  '.sparkles-light-cta',
  '.badge-style-type-ad',
  '.GoogleActiveViewElement',
  '.ytd-compact-promoted-video-renderer',
  '.ytd-companion-slot-renderer',
  '.ytd-video-masthead-ad-v3-renderer',
  '[layout*="display-ad-"]',
  '#merch-shelf',
  '#show-ad',
  '.ytd-in-feed-ad-layout-renderer',
  '.ytp-ad-image-overlay',
  '.ytp-ad-text-overlay',
  '.ytd-ad-slot-renderer',
  '.companion',
  'ytd-compact-promoted-item-renderer',
  '.html5-video-player.ad-showing video'
].join(",");

const regexRulesFallback = [  
  "googleads.g.doubleclick.net",
  "=adunit&",
  "/pubads.",
  "/pubads_",
  "/api/ads/",
  "/googleads_",
  "innovid.com",
  "/pagead/lvz?",
  "/pagead/gen_",
  "doubleclick.com",
  "google.com/pagead/",
  "youtube.com/pagead/",
  "googlesyndication.com",
  "www.youtube.com/get_midroll_"
];
/**
 * It is used to determine whether a start will run or stop.
 * Where I mean an install will continue.
 * rights only @codehemu.
 */
chrome.runtime.onStartup.addListener(async () => {
  var codehemu = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
      })
  });

  const enabled = await codehemu;

  if (enabled) {await enable()} else {await disable()}

});


/**
 * Do not use google API without permission from the developer.
 * This key has rights only @codehemu. You may not use it at all without CodeHemu permission.
 * https://script.google.com/macros/s/++/exec
 */
const API_KEY = "AKfycbzh4Bsea_YgsPn9MUOYzbSDY6O0g-uiqIGW62-msKW9kVxOJ12rkhOi9rDExSCErUA";

/**
 * If the user uninstalls the app then he will have a new url or windows open.
 * rights only @codehemu.
 */
var uninstallUrl = `${chrome.runtime.getManifest().homepage_url}#uninstall`;
chrome.runtime.setUninstallURL(uninstallUrl);


/**
 * When the app is installed, the date the app was installed and other 
 * information will be stored in the browser.
 * rights only @codehemu.
 */

chrome.runtime.onInstalled.addListener(async (details) => {
  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      chrome.storage.sync.set({
        installDate: Date.now(),
        installVersion: chrome.runtime.getManifest().version,
        regexRules: regexRulesFallback,
        adBlockingSelectors: adBlockingSelectorsFallback,
        isPlayerContainer: ".html5-video-player.ad-showing video",
        isSkipButtonContainer: ".ytp-ad-skip-button",
        isSkipAdsEnabled: true,
        lessCurrentTime: 1.5,
        lessDurationTime: 10,
        minusDurationTime: 3,
        isSpeedAdsEnabled: false,
        videoSpeed: 2,
        isRecommendEnabled: false,
        isRateUsPopupEnabled: true,
        updateVersionEdge: chrome.runtime.getManifest().version,
        isMessage: "",
        isMessageURL: "",
        nonstop: true,
        comments: true,
        shorts: false
      });
      chrome.tabs.create({ url: chrome.runtime.getManifest().homepage_url });

    case chrome.runtime.OnInstalledReason.UPDATE:
      chrome.storage.sync.set({
        updateDate: Date.now(),
      });
      
  }
});


/**
 * If you turn it on, it will run.
 * rights only @codehemu.
 */

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== "sync") return;
  if (changes.enabled) {
    if (changes.enabled.newValue) {
      await enable();
    } else {
      await disable();
    }
  }else if(changes.nonstop || changes.comments || changes.shorts){
    await reloadAffectedTab();
  }

});


/**
 * Used to reload youtube page it will only reload youtube page not reload other pages.
 * rights only @codehemu.
 * @returns reload youtube page.
 */

async function reloadAffectedTab() {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    url: "*://*.youtube.com/*",
  });
  const isTabAffected = Boolean(currentTab?.url);
  if (isTabAffected) {
    return chrome.tabs.reload();
  }
}



/**
 * chrome.declarativeNetRequest.updateDynamicRules() API works, I ended up with this solution.
 * blockUrls is an array variable that holds all blocked websites/URLs.
 * rights only @codehemu.
 */

async function UpdateIntercept() {
    var promise = new Promise((resolve, reject)=>{
          chrome.storage.sync.get({"enabled": true,"regexRules": regexRulesFallback}, (options)=>{
              resolve(options);
        })
    });
    const options = await promise;

    if (options.enabled) {
        const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

        const newRules = [];
        options.regexRules.forEach((domain, index) => {
          newRules.push({
            "id": index + 1,
            "priority": 1,
            "action": { "type": "block" },
            "condition": {"domains": ['youtube.com'], "urlFilter": domain, "resourceTypes": allResourceTypes }
          });
        });

        chrome.declarativeNetRequest.getDynamicRules(previousRules => {
          const previousRuleIds = previousRules.map(rule => rule.id);
          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: previousRuleIds,
            addRules: newRules
          });
        });
    }else{
        chrome.declarativeNetRequest.getDynamicRules(previousRules => {
          const previousRuleIds = previousRules.map(rule => rule.id);
          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: previousRuleIds
          });
        });
    }
}


/**
 * By looking at the name of the function, you can understand what it actually is function, 
 * it is the function of being active.
 * rights only @codehemu.
 */

async function enable() {
  await UpdateIntercept();
  await reloadAffectedTab();
}

/**
 * As with the function above, it's inverse.
 * This is the closing function.
 * rights only @codehemu.
 */
async function disable() {
  await UpdateIntercept();
  await reloadAffectedTab();
}

/**
 * It is used to store all kinds of AdBlocking Selectors IDs and class names.
 * and others store
 * rights only @codehemu.
 */

/**
 * It is used to store all kinds of AdBlocking Selectors IDs and class names.
 * and others store
 * rights only @codehemu.
 */

const setAdBlockingSelectors = async (
  regexRules,
  adBlockingSelectors, 
  isPlayerContainer,
  isSkipButtonContainer,
  isSkipAdsEnabled,
  lessCurrentTime,
  lessDurationTime,
  minusDurationTime,
  isSpeedAdsEnabled,
  videoSpeed,
  isRecommendEnabled,
  isRateUsPopupEnabled,
  updateVersionEdge,
  isMessage,
  isMessageURL) => {
  await chrome.storage.sync.set({ 
    regexRules,
    adBlockingSelectors, 
    isPlayerContainer,
    isSkipButtonContainer,
    isSkipAdsEnabled,
    lessCurrentTime,
    lessDurationTime,
    minusDurationTime,
    isSpeedAdsEnabled,
    videoSpeed,
    isRecommendEnabled,
    isRateUsPopupEnabled,
    updateVersionEdge,
    isMessage,
    isMessageURL
  });
};


/**
 * It is used externally to update all the data it requests to download from the URL.
 * rights only @codehemu.
 */

const updateJson = async () => {
  url = `https://script.google.com/macros/s/${API_KEY}/exec?v=nonstop`;
  await fetch(url)
  .then((response) => response.json())
  .then((json) => {
    //console.log(json);
     const {
        regexRules,
        adBlockingSelectors,
        isPlayerContainer,
        isSkipButtonContainer,
        isSkipAdsEnabled,
        lessCurrentTime,
        lessDurationTime,
        minusDurationTime,
        isSpeedAdsEnabled,
        videoSpeed,
        isRecommendEnabled,
        isRateUsPopupEnabled,
        updateVersionEdge,
        isMessage,
        isMessageURL
     } = json;
     // console.log(json);
     // console.log(updateVersionEdge);

     setAdBlockingSelectors(regexRules,
        adBlockingSelectors.join(","), 
        isPlayerContainer,
        isSkipButtonContainer,
        isSkipAdsEnabled,
        lessCurrentTime,
        lessDurationTime,
        minusDurationTime,
        isSpeedAdsEnabled,
        videoSpeed,
        isRecommendEnabled,
        isRateUsPopupEnabled,
        updateVersionEdge,
        isMessage,
        isMessageURL);
  })
  .catch((e) => {
    console.error(e);
   });
};

const init = async () => {
  updateJson();
  chrome.runtime.onMessage.addListener(
    ({ action, href, message }, { tab }, sendResponse) => {
      if (action === "PAGE_READY") {
        const response = {
          adBlockSelectors: adBlockingSelectorsFallback
        };
        updateJson();
        sendResponse(response);
    } 
  });

};init();





