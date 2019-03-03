chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({clicks: 0}, function() {
        console.log("Initialized clicks.");
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
    if (changeInfo.status === "complete") {
        chrome.storage.sync.get("clicks", function(items) {
            console.log(items.clicks + 1);
            chrome.storage.sync.set({"clicks": items.clicks + 1}, function() {
                console.log("Updated number of clicks.");
            });
        });
    }
});

// Function to regex check a url to see if it is on the blacklist.
let checkUrl = function(url) {
    //TODO: Implement
};

// Function to get a tab value from storage. Should be stored as { tabNumber: 0, url: "", trackNextClick: true, ruleIds: [] }
let getTabFromStorage = function(tab) {
    //TODO: Implement
};

// Function to update a tab value in storage.
let updateTabInStorage = function(tab) {
    //TODO: Implement
};

//Function to 



