chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            setIcon(changes[key].newValue);
        }
    }

});

chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
    setIcon(result.hgltAvailible);
});

const setIcon = (active) => {
    if (active) {
        chrome.browserAction.setIcon({
            path: 'images/pencil_active_64.png'
        });
    } else {
        chrome.browserAction.setIcon({
            path: 'images/pencil_64.png'
        });
    }

}