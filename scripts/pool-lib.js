const HOSKY_BASE_URL = 'https://www.jpg.store/collection/hoskycashgrab?tab=items';

const NFT_CONTAINER = 'div.NFTMarketplaceCard_nftMarketplaceCardContainer__QWSCT';
const LUT = ['HAZEL', 'SALT', 'PSYA', 'PRIDE', 'ASPEN', 'DDOS', 'A3C', 'BAIDU', 'WOOF', 'LIDO', 'BONE', 'VEGAS', 'QCPOL', 'CHEF', 'PSB', 'RARE', 'FARM', 'STOIC', 'ITZA']
const ALL = 524287;

const command = {
    update: "update",
    clear: "clear"
}

function injectPools(cg, selected) {
    var asset = cg.textContent;
    id = parseInt(asset.slice(21 - asset.length));
    pools = [];
    if (id < CG_POOL_MAP.length) {
        encoded = CG_POOL_MAP[id-1] & selected;
        if (encoded) {           
            for (var count = 0, i = 1; count < 19; count++, i <<= 1) {
                if (encoded & i) pools.push(LUT[count]);
            }
        } 
    }
    div = document.createElement("div");
    div.innerHTML = (pools.length > 0 ? pools.length + ": " + pools.join(", ") : "No Matching Pools");
    div.classList.add("styles_subdued__ySQNo");
    div.classList.add("matchedPools");
    insertAfter(cg, div);

    parentDiv = cg.closest(NFT_CONTAINER);
    if (selected != ALL) {
        if (pools.length > 0) {
            parentDiv.classList.add("matched");
        } else {
            parentDiv.classList.add("unmatched");
        }
    } else {
        parentDiv.classList.remove("matched", "unmatched");
    }

    cg.classList.add("rugged");
}

function clearAll() {
    document.querySelectorAll(NFT_CONTAINER).forEach(e => e.classList.remove("matched", "unmatched"));
    document.querySelectorAll(".rugged").forEach(e => e.classList.remove("rugged"));
    document.querySelectorAll(".matchedPools").forEach(e => e.remove());
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function update(selected) {
    document.querySelectorAll("#asset-title:not(.rugged)").forEach(cg => {
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
