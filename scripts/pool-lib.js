const HOSKY_BASE_URL = "https://www.jpg.store/collection/hoskycashgrab?tab=items";

const CG_ASSET_NAME = "HOSKY C(ash Grab)NFT ";
const GNOMESKIE_ASSET_NAME = "Gnomeskies 69 Shades of Rug ";
const CG_NAME_LENGTH = CG_ASSET_NAME.length;
const GNOMESKIE_NAME_LENGTH = GNOMESKIE_ASSET_NAME.length;

const NFT_ASSET_NAME_ELEMENT = "h4#asset-title:not(.rugged), div.flex .flex-col .items-start > span:first-child:not(.rugged), div.bodyMd-400:not(.rugged), h1.styles_H1__d38Bz>span:first-child:not(.rugged)";
const PARENT_CONTAINER = "div.NFTMarketplaceCard_nftMarketplaceCardContainer__QWSCT, div#asset-wallet-card";
const POOL_CONTAINER_CLASS = "pools-container";

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

function injectPools(nft, selected) {
    var asset = nft.textContent;
    var isHosky = asset.startsWith(CG_ASSET_NAME)
    var id = parseInt(asset.slice((isHosky ? CG_NAME_LENGTH : GNOMESKIE_NAME_LENGTH) - asset.length));
    var pools = 0;
    var matched = 0;
    var poolListContainer = document.createElement("div");
    poolListContainer.classList.add("pools-container");
    if (id < (isHosky ? CG_POOL_MAP.length : GNOMESKIES_POOL_MAP.length)) {
        encoded = (isHosky ? CG_POOL_MAP[id] : GNOMESKIES_POOL_MAP[id]);
        for (var count = 0, i = 1; count < LUT.length; count++, i <<= 1) {
            if (encoded & i) {
                poolListContainer.appendChild(wrapPoolInfo(LUT[count], (selected & i) ? "selectedpool" : "normaltext"));
                if (selected & i) {
                    matched++;
                }
                pools++;
            }
        }
        poolListContainer.prepend(wrapPoolInfo(pools > 0 ? pools + ":" : "No Matching Pools", pools > 0 ? "normaltext" : "nopools"));
    }    
    insertAfter(nft, poolListContainer);
    if (selected != ALL) {
        highlightContainer(nft, selected, matched);
    }
}

function highlightContainer(nft, selected, matched) {
    var parentContainer = nft.closest(PARENT_CONTAINER);
    if (parentContainer != null) {
        if (matched > 0) {
            parentContainer.classList.add("matched");
        } else {
            parentContainer.classList.add("unmatched");
        }
    }
}

function clearAll() {
    document.querySelectorAll(PARENT_CONTAINER).forEach(e => e.classList.remove("matched", "unmatched"));
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
    document.querySelectorAll(NFT_ASSET_NAME_ELEMENT).forEach(nft => {
        if (nft.textContent.startsWith(CG_ASSET_NAME) || nft.textContent.startsWith(GNOMESKIE_ASSET_NAME) ) {
            injectPools(nft, selected);
        }
        nft.classList.add("rugged");
    });
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
