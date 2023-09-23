const pools = document.querySelectorAll("input[type=checkbox].pool");
const toggleAll = document.querySelector("#toggleAll");
const lightSwitch = document.querySelector("input[type=checkbox].lightswitch");

const save = document.querySelector("#save");

const ALL = 1048575;
const POOLBIT = {"sea": 524288, "itza": 262144, "stoic": 131072, "farm": 65536, "rare": 32768, "psb": 16384, "chef": 8192, "qcpol": 4096, "vegas": 2048, "bone": 1024, "lido": 512, "woof": 256, "baidu": 128, "a3c": 64, "ddos": 32, "aspen": 16, "pride": 8, "psya": 4, "salt": 2, "hazel": 1}
const LUT = ["hazel", "salt", "psya", "pride", "aspen", "ddos", "a3c", "baidu", "woof", "lido", "bone", "vegas", "qcpol", "chef", "psb", "rare", "farm", "stoic", "itza", "sea"]

poolsSelected = ALL;

function updatePools() {
    poolsSelected = Array.from(document.querySelectorAll("input[type=checkbox].pool:checked")).map(x => x.value);
    encoded = 0;
    for (let pool of poolsSelected) {            
        encoded = encoded | POOLBIT[pool];
    }
    chrome.storage.session.set({ "pools": encoded });
}

function loadPools() {
    chrome.storage.session.get(["pools"]).then((result) => {
        poolsSelected = result.pools == undefined ? ALL :  result.pools;
        for (var count = 0, i = 1; count < LUT.length; count++, i <<= 1) {
            selected = (poolsSelected & i) != 0;
            document.querySelector("#" + LUT[count]).checked = selected;
        }
        toggleAll.innerHTML = poolsSelected == ALL ? "Uncheck All" : "Check All";
    });
    chrome.storage.session.get(["lightmode"]).then((result) => {
        lightSwitch.checked = result.lightmode;
        if (result.lightmode) {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    });
} 

pools.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
        updatePools();
    })
});

lightSwitch.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    console.log(lightSwitch.checked);
    chrome.storage.session.set({ "lightmode": lightSwitch.checked });
});

toggleAll.addEventListener("click", () => {
    if (toggleAll.innerHTML === "Uncheck All") {
        pools.forEach(el => el.checked = false);
        toggleAll.innerHTML="Check All";
    } else {
        pools.forEach(el => el.checked = true);
        toggleAll.innerHTML="Uncheck All";
    }
    updatePools();
});

window.onload = function() {
    loadPools();
}

