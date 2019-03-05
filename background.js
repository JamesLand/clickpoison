//let rules = { Reddit: {name: "Reddit", rule: ".*reddit\.com.*", clicks: 0, type: "from"}};
//TODO: Consider putting this object in a class that manages access, thread safety (can JS do locks?)
let tabs = {};

chrome.runtime.onInstalled.addListener(function() {
    //TODO: On initialization, create basic objects needed to avoid console errors.
    chrome.storage.sync.set({clicks: 0}, function() {
        console.log("Initialized clicks.");
    });
});

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
    if (changeInfo.status === "complete") {
        // Fetch rules
        console.log("Fetching rules...");
        let rules = await getRules();
        if (rules == null) return;
        console.log(rules);

        // Get tab data matching tab ID, if it exists.
        const currentTab = tabs[tabId];
        let fromRule = null;
        if (currentTab != null) {
            // Check "from" url to see if a click needs to be added.
            console.log("Checking from rules");
            fromRule = checkUrl(rules, currentTab.url, "from");
        }
        if (fromRule !== null) {
            // Update clicks with the rule we got
            console.log("Is from rule, updating clicks.");
            //TODO: This is where the program breaks. Resume from here.
            rules = incrementRule(rules, fromRule, "from");
            console.log(`Current state: ${rules}`);
            chrome.storage.sync.set({"rules": rules}, function() {});
        }
        else {
            console.log("Checking to rules");
            let toRule = checkUrl(rules, tab.url, "to");
            if (toRule !== null) {
            console.log("Is to rule, updating clicks");
                rules = incrementRule(rules, toRule, "to");
                console.log(`Current state: ${rules}`);
                chrome.storage.sync.set({"rules": rules}, function() {} );
            }
        }

        //Finally, update tabs
        updateTabs(tabId, tab.url);
    }
});

// Function to regex check a url to see if it is on the blacklist.
function checkUrl(rules, url, type) {
    if (rules[type] == null) return null;
    for (let rule of Object.values(rules[type])) {
        if (new RegExp(rule.rule).test(url)) {
            console.log(url);
            return rule.rule;
        }
    }
    return null;
}

async function getRules() {
    return new Promise(resolve => {
        chrome.storage.sync.get("rules", function(result) {
            resolve(result.rules);
        });
    });
}

function incrementRule(rules, rule, type) {
    rule.clicks++;
    rules[type][rule.name] = rule;
    return rules;
}

// Tab structure: { tabId: 0, url: https://reddit.com }
function updateTabs(tabId, url) {
    const currentTab = tabs[tabId];
    if (currentTab == null) {
        // Add new value for tab
        tabs[tabId] = { tabId: tabId, url: url };
        return;
    }
    tabs[tabId].url = url;
    console.log(tabs);
}





