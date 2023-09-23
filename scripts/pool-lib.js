const HOSKY_BASE_URL = "https://www.jpg.store/collection/hoskycashgrab?tab=items";

const STATIC_CG_ASSET_NAME = "HOSKY C(ash Grab)NFT ";
const STATIC_ASSET_NAME_LENGTH = STATIC_CG_ASSET_NAME.length;
const SWEEP_BUTTON_ENABLED = ".border-text-link";
const PROFILE_PAGE_INDICATOR = "div.styles_dualImageContainer__YPhDJ.rounded-full.h-full.w-full.overflow-hidden.rounded-full.object-contain";
const PROFILE_PAGE_INDICATOR2 = "div.relative.border-none.h-full.w-full.overflow-hidden.rounded-full.object-contain";

const NFT_CONTAINER = "div.NFTMarketplaceCard_nftMarketplaceCardContainer__QWSCT";
const PROFILE_CONTAINER = "div#asset-wallet-card";
const SWEEP_CONTAINER = "div.transition-all";

const POOL_CONTAINER_CLASS = "pools-container";

const COLLECTION_ELEMENT = "#asset-title:not(.rugged)";
const SWEEP_ELEMENT = ".flex .flex-col .items-start > span:first-child:not(.rugged)";
const PROFILE_ELEMENT = "div.bodyMd-400:not(.rugged)";

const LUT = ["HAZEL", "SALT", "PSYA", "PRIDE", "ASPEN", "DDOS", "A3C", "BAIDU", "WOOF", "LIDO", "BONE", "VEGAS", "QCPOL", "CHEF", "PSB", "RARE", "FARM", "STOIC", "ITZA", "SEA"]
const ALL = 1048575;

const command = {
    update: "update",
    clear: "clear"
}

function wrapPoolInfo(text, style) {
    var element = document.createElement("div");
    element.innerHTML = text;
    element.classList.add("pool-info", style);
    return element;
}

function injectPools(cg, selected) {
    var asset = cg.textContent;
    var id = parseInt(asset.slice(STATIC_ASSET_NAME_LENGTH - asset.length));
    var pools = 0;
    var matched = 0;
    var poolListContainer = document.createElement("div");
    poolListContainer.classList.add("pools-container");
    if (id < CG_POOL_MAP.length) {
        encoded = CG_POOL_MAP[id];
        for (var count = 0, i = 1; count < LUT.length; count++, i <<= 1) {
            if (encoded & i) {
                poolListContainer.appendChild(wrapPoolInfo(LUT[count], (selected & i) ? "selectedpool" : "normaltext"));
                if (selected & i) {
                    matched++;
                }
                pools++;
            }
        }
        if (pools > 0) {
            poolListContainer.insertBefore(wrapPoolInfo(pools + ":", "normaltext"), poolListContainer.firstChild);
        } else {
            poolListContainer.appendChild(wrapPoolInfo("No Matching Pools", "nopools"));
        }
    }    
    insertAfter(cg, poolListContainer);
    highlightContainer(cg, selected, matched);
    cg.classList.add("rugged");
}

function highlightContainer(cg, selected, matched) {
    var parentDiv = isProfilePage() ? cg.closest(PROFILE_CONTAINER) : !isSweepEnabled() ? cg.closest(NFT_CONTAINER) : null;
    if (parentDiv != null) {
        if (selected != ALL) {
            if (matched > 0) {
                parentDiv.classList.add("matched");
            } else {
                parentDiv.classList.add("unmatched");
            }
        } else {
            parentDiv.classList.remove("matched", "unmatched");
        }
    }
}

function clearAll() {
    document.querySelectorAll(PROFILE_CONTAINER).forEach(e => e.classList.remove("matched", "unmatched"));
    document.querySelectorAll(NFT_CONTAINER).forEach(e => e.classList.remove("matched", "unmatched"));
    document.querySelectorAll(".rugged").forEach(e => e.classList.remove("rugged"));
    document.querySelectorAll(".pools-container").forEach(e => e.remove());
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function isSweepEnabled() {
    return document.querySelector(SWEEP_BUTTON_ENABLED) != null; 
}

function isProfilePage() {
    return (document.querySelector(PROFILE_PAGE_INDICATOR) != null) | (document.querySelector(PROFILE_PAGE_INDICATOR2) != null);
}

function update(selected) {
    if (isProfilePage()) {
        let elementContainer = document.querySelectorAll(PROFILE_ELEMENT);
        elementContainer.forEach(nft => {
            if (nft.textContent.startsWith(STATIC_CG_ASSET_NAME)) {
                injectPools(nft, selected);
            } else {
                nft.classList.add("rugged");
            }
        });
    } else {
        let elementContainer = document.querySelectorAll(isSweepEnabled() ? SWEEP_ELEMENT : COLLECTION_ELEMENT);
        elementContainer.forEach(cg => {
            injectPools(cg, selected);
        });    
    }
}

var port = chrome.runtime.connect({name: "wenrug"});
port.onMessage.addListener(function(msg) {
    if (msg.command === command.update) {
        update(msg.pools == undefined ? ALL : msg.pools);
    }
    if (msg.command === command.clear) {
        clearAll();
        update(msg.pools == undefined ? ALL : msg.pools);
    }
});

port.onDisconnect.addListener((message) => {
    console.log("disconnecting");
    if (message.error) {
      console.log(`Disconnected due to an error: ${message.error}`);
    }
});
