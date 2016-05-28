'use strict';

const id3 = require('id3js');
const ipcMain = require('ipc-main');

ipcMain.on('id3-parse', (event, path) => {

    id3({ file: path, type: id3.OPEN_LOCAL }, (err, tags) => {
        if (tags) {
            event.sender.send('id3-result', tags);
        } else {
            event.sender.send('id3-error', err);
        }
    });

});
