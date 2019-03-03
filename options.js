function saveOptions() {
    saveFromPageRules();
}

function restoreOptions() {
    restoreFromPageRules();
}

function saveFromPageRules() {
    chrome.storage.sync.get(["rules"], function(result) {
        let storeRules = result.rules;
        let domRules = getRulesFromDOM();
        let updatedStoreRules = {};
        for (let [k, domRule] of Object.entries(domRules)) {
            if (Object.keys(storeRules).includes(domRule.name)){
                //Update rule
                storeRules[domRule.name].rule = domRule.rule;
                updatedStoreRules[domRule.name] = storeRules[domRule.name];
            }
            else {
                //Add rule
                updatedStoreRules[domRule.name] = {
                    name: domRule.name,
                    rule: domRule.rule,
                    type: "from", //TODO: This is going to have to be two separate sets of rules I think
                    clicks: 0
                };
            }
        }
        chrome.storage.sync.set({rules: updatedStoreRules}, function() {
        });
    });

}

function getRulesFromDOM() {
    let fromRulesBox = document.getElementById("fromPageRules");
    let rules = {};
    for (let line of fromRulesBox.value.split("\n")) {
        let rule = parseRuleFromString(line);
        if (rule != null) {
            //TODO: Add duplicate checking here.
            rules[rule.name] = rule;
        }
    }
    return rules;
}

function parseRuleFromString(ruleString) {
    let ruleRegex = /^[A-Za-z0-9]+:.+$/g;
    if (ruleRegex.test(ruleString)) {
        let colonIndex = ruleString.indexOf(":");
        let regexString = ruleString.substring(colonIndex + 1);
        if (isStringValidRegex(regexString) ) {
            return {
                name: ruleString.substring(0, colonIndex),
                rule: regexString
            };
        }
    }
    return null;
}

function isStringValidRegex(regexString) {
    var isValid = true;
    try {
        new RegExp(regexString);
    } catch(e) {
        isValid = false;
    }
    return isValid;
}

function restoreFromPageRules() {
    chrome.storage.sync.get(["rules"], function(result) {
        let boxText = "";
        if (result.rules == null) return;
        for (let [key, rule] of Object.entries(result.rules)) {
            let line = `${rule.name}:${rule.rule}\n`;
            boxText = boxText.concat(line);
        }
        document.getElementById("fromPageRules").value = boxText;

    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);
