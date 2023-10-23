const ALL = 1048575;
const POOLBIT = {"sea": 524288,  "itza": 262144, "stoic": 131072, "farm": 65536, "rare": 32768, "psb": 16384, "chef": 8192, "qcpol": 4096, "vegas": 2048, "bone": 1024, "lido": 512, "woof": 256, "baidu": 128, "a3c": 64, "ddos": 32, "aspen": 16, "pride": 8, "psya": 4, "salt": 2, "hazel": 1}

var poolsSelected = ALL;

chrome.runtime.onInstalled.addListener(function() {
    chrome.alarms.create("updatePools", {
        delayInMinutes: 0.1,
        periodInMinutes: 0.03
    });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.tabs.query({active: true, lastFocusedWindow: true, status: "complete", url: "https://www.jpg.store/*"}, function(tabs) {
        if (tabs.length === 1) {
            chrome.storage.session.get(["pools"]).then((result) => {
                chrome.tabs.sendMessage(tabs[0].id, {message: "wenrug", pools: (result ? result.pools : ALL)});
            });
        }
    });
});