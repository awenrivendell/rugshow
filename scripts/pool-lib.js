const HOSKY_BASE_URL = "https://www.jpg.store/collection/hoskycashgrab?tab=items";

const STATIC_ASSET_NAME_LENGTH = "HOSKY C(ash Grab)NFT ".length;
const SWEEP_BUTTON_ENABLED = ".border-text-link";

const NFT_CONTAINER = "div.NFTMarketplaceCard_nftMarketplaceCardContainer__QWSCT";
const SWEEP_CONTAINER = "div.transition-all";
const POOL_CONTAINER_CLASS = "pools-container";

const COLLECTION_ELEMENT = "#asset-title:not(.rugged)";
const SWEEP_ELEMENT = ".flex .flex-col .items-start > span:first-child:not(.rugged)";

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
    id = parseInt(asset.slice(STATIC_ASSET_NAME_LENGTH - asset.length));
    pools = 0;
    matched = 0;
    poolListContainer = document.createElement("div");
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
    highlightContainer(cg, selected);
    cg.classList.add("rugged");
}

function highlightContainer(cg, selected) {
    if (!isSweepEnabled()) {
        parentDiv = cg.closest(NFT_CONTAINER);
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
    document.querySelectorAll(NFT_CONTAINER, SWEEP_CONTAINER).forEach(e => e.classList.remove("matched", "unmatched"));
    document.querySelectorAll(".rugged").forEach(e => e.classList.remove("rugged"));
    document.querySelectorAll(".pools-container").forEach(e => e.remove());
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function isSweepEnabled() {
    sweep = document.querySelector(SWEEP_BUTTON_ENABLED);
    return sweep != null; 
}

function update(selected) {
    elementContainer = document.querySelectorAll(isSweepEnabled() ? SWEEP_ELEMENT : COLLECTION_ELEMENT);
    elementContainer.forEach(cg => {
        injectPools(cg, selected);
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
