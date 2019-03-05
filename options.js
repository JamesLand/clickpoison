function saveOptions() {
    saveFromPageRules();
}

function restoreOptions() {
    restoreFromPageRules();
}

function saveFromPageRules() {
    chrome.storage.sync.get(["rules"], function(result) {
        let storeRules = result.rules;
        if (storeRules.from == null) storeRules.from = {};

        let domRules = getRulesFromDOM();
        let updatedStoreRules = {from: {}};
        for (let [k, domRule] of Object.entries(domRules.from)) {
            if (Object.keys(storeRules.from).includes(domRule.name)){
                //Update rule
                storeRules.from[domRule.name].rule = domRule.rule;
                updatedStoreRules.from[domRule.name] = storeRules[domRule.name];
            }
            else {
                //Add rule
                updatedStoreRules.from[domRule.name] = {
                    name: domRule.name,
                    rule: domRule.rule,
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
    let rules = {from: {}};
    for (let line of fromRulesBox.value.split("\n")) {
        let rule = parseRuleFromString(line);
        if (rule != null) {
            //TODO: Add duplicate checking here.
            rules.from[rule.name] = rule;
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
        for (let [key, rule] of Object.entries(result.rules.from)) {
            let line = `${rule.name}:${rule.rule}\n`;
            boxText = boxText.concat(line);
        }
        document.getElementById("fromPageRules").value = boxText;

    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);
