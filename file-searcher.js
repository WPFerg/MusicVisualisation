'use strict';

const fs = require('fs');
const path = require('path');
const ipcMain = require('ipc-main');

class FileSearcher {

    constructor(renderer) {
        this.renderer = renderer;
        this.results = [];
    }

    _statFile(file) {
        return new Promise((resolve, reject) => {
            fs.stat(file, (err, stats) => resolve(stats));
        });
    }

    _scan(pathToFolder, type) {
        return new Promise((resolve, reject) => {
            let contents = fs.readdir(pathToFolder, (err, foundFiles) => {
                let promises = [];
                let folders = [];
                let files = [];

                foundFiles.forEach(file => {
                    let pathToFile = path.join(pathToFolder, file);
                    promises.push(this._statFile(pathToFile).then(stats => {
                        if (stats.isDirectory()) {
                            folders.push(pathToFile);
                        } else if (stats.isFile() && pathToFile.indexOf(type) !== -1) {
                            console.log('progress:', pathToFile);
                            this.renderer.send('file-search-progress', pathToFile);
                            this.results.push(pathToFile);
                        }
                    }));
                });

                Promise.all(promises).then(() => {
                    resolve({
                        files: files,
                        folders: folders
                    });
                }).catch(e => console.log(e));
            });
        });
    }

    scanForFiles(pathToFolder, type) {
        return new Promise((resolve, reject) => {
            let promise = this._scan(pathToFolder, type);
            let files = [];

            let folderPromises = [];
            promise.then((results) => {
                results.folders.forEach(folder => {
                    let folderPromise = this.scanForFiles(folder, type).then(expandedFiles => {
                        files = files.concat(expandedFiles);
                    });
                    folderPromises.push(folderPromise)
                });

                Promise.all(folderPromises).then(expandedFiles => {
                    resolve(this.results);
                });
            });
        });
    }

}

ipcMain.on('file-search', (event, path) => {
    console.log('file search started for path %s', path);
    let searcher = new FileSearcher(event.sender);
    searcher.scanForFiles(path, '.mp3').then(files => event.sender.send('file-search-results', files));
});

module.exports = FileSearcher;
