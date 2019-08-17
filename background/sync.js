    // var cantElementsStored = 0;

    // const changeElementSync = () => {

    //     chrome.storage.sync.get({ 'hgltSyncElementsLength': 0 }, (syncElementsLenth) => {
    //         const lengthSync = syncElementsLenth.hgltSyncElementsLength;

    //         //REMOVE ALL SYNC ELEMENTS
    //         for (let i = 1; i <= lengthSync; i++) {
    //             chrome.storage.sync.remove('hgltStoredSyncElements' + i);
    //         }

    //         chrome.storage.local.get({ 'hgltStoredElement': [] }, (elementsStored) => {

    //             //ADD ALL LOCAL ELEMENTS TO SYNC ELEMENTS
    //             for (let i = 0; i < elementsStored.hgltStoredElement.length; i++) {
    //                 let newKey = 'hgltStoredSyncElements' + (i + 1);
    //                 let newElement = {};
    //                 newElement[newKey] = elementsStored.hgltStoredElement[i];
    //                 chrome.storage.sync.set(newElement);
    //             }
    //             chrome.storage.sync.set({ 'hgltSyncElementsLength': elementsStored.hgltStoredElement.length });
    //         });

    //     });


    // }


//CHANGE ON ELEMENTS LOCAL STORED
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//     for (var key in changes) {
//         if (key === 'hgltStoredElement') {
//             if(cantElementsStored !== changes[key].newValue.length){
//                 changeElementSync();
//                 cantElementsStored = changes[key].newValue.length;
//             }
//         }
//     }
// });

//ALL SYNC TO LOCAL
// chrome.storage.sync.get({ 'hgltSyncElementsLength': 0 }, (syncElementsLenth) => {
//     const lengthSync = syncElementsLenth.hgltSyncElementsLength;

//     chrome.storage.local.set({ 'hgltStoredElement': [] });

//     for(let i = 1; i<=lengthSync; i++){
//         chrome.storage.sync.get(['hgltStoredSyncElements' + i], (elementSyncStored) => {
//             chrome.storage.local.get({ 'hgltStoredElement': [] }, (elementsLocalStored) => {
//                 let newElement = elementSyncStored['hgltStoredSyncElements' + i];
//                 elementsLocalStored.hgltStoredElement.push(newElement);
//                 cantElementsStored = elementsLocalStored.hgltStoredElement.length;
//                 chrome.storage.local.set({ 'hgltStoredElement': elementsLocalStored.hgltStoredElement });
//             });
//         });
//     }

// });