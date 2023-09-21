const ALL = 524287;
const POOLBIT = {'itza': 262144, 'stoic': 131072, 'farm': 65536, 'rare': 32768, 'psb': 16384, 'chef': 8192, 'qcpol': 4096, 'vegas': 2048, 'bone': 1024, 'lido': 512, 'woof': 256, 'baidu': 128, 'a3c': 64, 'ddos': 32, 'aspen': 16, 'pride': 8, 'psya': 4, 'salt': 2, 'hazel': 1}

const command = {
    update: "update",
    clear: "clear"
}

var hoskyPort;
var hoskyAlarm;

var poolsSelected = ALL;

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == "wenrug") {
        hoskyPort = port;
        console.log("connected");
        chrome.alarms.create('frequency', {
            delayInMinutes: 0.05,
            periodInMinutes: 0.03
        });    
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == 'frequency') {
        try {
            if (hoskyPort) {
                chrome.storage.session.get(["pools"]).then((result) => {
                    if(result) {
                        poolsSelected = result.pools;
                    } else {
                        poolsSelected = ALL;
                    }
                });
                hoskyPort.postMessage({command: command.update, pools: poolsSelected});
            }
        } catch(e) {
            hoskyPort.disconnect();
            hoskyPort = undefined; 
            console.log("disconnected");   
            chrome.alarms.clear('frequency');
        }
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      poolsSelected = newValue;
    }
    hoskyPort?.postMessage({command: command.clear, pools: poolsSelected});
});