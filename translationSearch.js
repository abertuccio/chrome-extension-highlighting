// let resultTable = document.getElementsByClassName("WRD")[0].outerHTML;

let resultTable = {};

resultTable.search = document.querySelectorAll(".FrWrd strong")[0].innerText
resultTable.translation = document.querySelectorAll(".ToWrd")[1].innerText


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === 'translation') {
            sendResponse({
                resultTable: resultTable
            });
        }
        window.close()
    });