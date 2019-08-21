const Bleacon = require('bleacon');
const Queue = require('better-queue')

const tilts = {
    "a495bb10c5b14b44b5121370f02d74de": "Red",
    "a495bb20c5b14b44b5121370f02d74de": "Green",
    "a495bb30c5b14b44b5121370f02d74de": "Black",
    "a495bb40c5b14b44b5121370f02d74de": "Purple",
    "a495bb50c5b14b44b5121370f02d74de": "Orange",
    "a495bb60c5b14b44b5121370f02d74de": "Blue",
    "a495bb70c5b14b44b5121370f02d74de": "Yellow",
    "a495bb80c5b14b44b5121370f02d74de": "Pink"
};

const currentlyRebroadcastingUUIDs = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const q = new Queue(async (bleacon, resolve) => {
    console.log(`processing bleacon from ${tilts[bleacon.uuid]} tilt`)
    currentlyRebroadcastingUUIDs.push(bleacon.uuid)

    Bleacon.startAdvertising(bleacon.uuid, bleacon.major, bleacon.minor, bleacon.rssi);

    await sleep(100)

    Bleacon.stopAdvertising();

    let index = currentlyRebroadcastingUUIDs.findIndex((uuid) => uuid === bleacon.uuid)
    if (index > -1) {
        currentlyRebroadcastingUUIDs.splice(index, 1)
    }

    console.log(`finished processing bleacon from ${tilts[bleacon.uuid]} tilt`)

    resolve(null, null)
})

Bleacon.on('discover', (bleacon) => {
    if (tilts.hasOwnProperty(bleacon.uuid)) {
        if (currentlyRebroadcastingUUIDs.includes(bleacon.uuid)) {
            console.log(`Ignoring broadcast from ${tilts[bleacon.uuid]} tilt as we are currently broadcasting this tilt ourselves!`)
            return
        }
        q.push(bleacon)
        console.log(`Pushing bleacon received from ${tilts[bleacon.uuid]} to queue`);
    }
});

Bleacon.startScanning();