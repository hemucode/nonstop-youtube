const rendomJson = (addon_details) => {
  try {
    return addon_details[Math.floor(Math.random() * addon_details.length)];
  } catch (e) {
    return addon_details[0];
  }
}

const translateHTML = (dataKey = 'message') => {
  for (const $element of document.getElementsByTagName('*')) {
    if ($element.dataset && $element.dataset[dataKey]) {
      $element.innerText = chrome.i18n.getMessage($element.dataset[dataKey])
    }
  }
}

async function isSettings() {
   var adsblockPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"enabled": true}, function(options){
          resolve(options.enabled);
      })
  });

  var nonstopPromise = new Promise(function(resolve, reject){
      chrome.storage.sync.get({"nonstop": true}, function(options){
          resolve(options.nonstop);
      })
  });

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


  const enabled = await adsblockPromise;
  const nonstop = await nonstopPromise;
  const comments = await commentsPromise;
  const shorts = await shortsPromise;


  const $checkboxLabel1 = document.querySelector("#enabled");
  const $checkboxLabel2 = document.querySelector("#nonstop");
  const $checkboxLabel3 = document.querySelector("#comments");
  const $checkboxLabel4 = document.querySelector("#shorts");


  $checkboxLabel1.style.color = (enabled ? "#0d8ed0" : "#909090");
  $checkboxLabel2.style.color = (nonstop ? "#0d8ed0" : "#909090");
  $checkboxLabel3.style.color = (comments ? "#0d8ed0" : "#909090");
  $checkboxLabel4.style.color = (shorts ? "#0d8ed0" : "#909090");


  // Hydrate Checkbox Label
  const $enabledCheckbox1 = document.querySelector("input[name=enabled]");
  $enabledCheckbox1.checked = enabled;
  $enabledCheckbox1.addEventListener("change", async (event) => {
    const enabled = event.currentTarget.checked;
    await chrome.storage.sync.set({ enabled });
    $checkboxLabel1.style.color = (enabled ? "#0d8ed0" : "#909090");

  });

  const $enabledCheckbox2 = document.querySelector("input[name=nonstop]");
  $enabledCheckbox2.checked = nonstop;
  $enabledCheckbox2.addEventListener("change", async (event) => {
    const nonstop = event.currentTarget.checked;
    await chrome.storage.sync.set({ nonstop });
    $checkboxLabel2.style.color = (nonstop ? "#0d8ed0" : "#909090");
  });

  const $enabledCheckbox3 = document.querySelector("input[name=comments]");
  $enabledCheckbox3.checked = comments;
  $enabledCheckbox3.addEventListener("change", async (event) => {
    const comments = event.currentTarget.checked;
    await chrome.storage.sync.set({ comments });
    $checkboxLabel3.style.color = (comments ? "#0d8ed0" : "#909090");
  });

  const $enabledCheckbox4 = document.querySelector("input[name=shorts]");
  $enabledCheckbox4.checked = shorts;
  $enabledCheckbox4.addEventListener("change", async (event) => {
    const shorts = event.currentTarget.checked;
    await chrome.storage.sync.set({ shorts });
    $checkboxLabel4.style.color = (shorts ? "#0d8ed0" : "#909090");
  });

}

var details = {
  "WEBSTORE":`https://microsoftedge.microsoft.com/addons/detail/${chrome.runtime.id}`,
  "HOMEPAGE": chrome.runtime.getManifest().homepage_url,
  "YT": "https://www.youtube.com/@CodeHemu",
  "FB": "https://www.facebook.com/CodeHemu",
  "SITE":"https://www.codehemu.com/",
  "ADDON_SITE": "https://www.downloadhub.cloud/"
}

var addon_details = [
{
  "name": "Dislike in YouTube™",
  "link": "2022/10/dislike-add-youtube.html"
},{
  "name": "Adblock for YouTube™",
  "link": "2022/11/adblock-for-youtube.html"
},{
  "name": "Image Downloader",
  "link": "2023/02/downloader.html"
},{
  "name": "Loop YouTube™",
  "link": "2023/01/loop.html"
},{
  "name": "Allow Copy& Right Click",
  "link": "2022/12/browser-allow-copy-right-click.html"
},{
  "name": "Nonstop for YouTube™",
  "link": "2022/10/nonstopyoutube.html"
},{
  "name": "SiteBlock: Block Websites",
  "link": "2023/06/SiteBlock.html"
},{
  "name": "ClickBait YouTube™",
  "link": "2023/05/clickbait.html"
},{
  "name": "SponsorBlock for faceBook™",
  "link": "2022/09/sponsorblock-for-facebook.html"
}];


function hrefLink(){
  document.querySelector('.teaser').href = details.WEBSTORE;
  document.querySelector('.youtube').href = details.YT;
  document.querySelector('.facebook').href = details.FB;
  document.querySelector('.website').href = details.ADDON_SITE;
  document.querySelector('.homepage').href = details.HOMEPAGE;
  document.querySelector('.codehemu').href = details.SITE;
}


function Dialog(){
  const randomArray = rendomJson(addon_details);
  document.querySelector(".addons_name").appendChild(
    document.createTextNode(randomArray.name)
  );

  document.querySelector(".cta-description").addEventListener("click", ()=>{
    window.open(details.ADDON_SITE + randomArray.link,'_blank');
  },false); 

  document.querySelector(".cta-close").addEventListener("click", ()=>{
    document.querySelector(".div_myadblock").style.display="none";
  },false);
}


function domReady (callback) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', callback, false);
  }
}

domReady(() => {
  isSettings()
  hrefLink()
  Dialog()
  translateHTML()
})