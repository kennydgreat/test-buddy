/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* exported getFileHandle, getNewFileHandle, readFile, verifyPermission,
            writeFile */

/**
 * Open a handle to an existing file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
 */
export var dataFileHandle ;
export async function getDataFileHanlde(){
  if(!dataFileHandle){
    dataFileHandle = await getFileHandle();
  }
  return dataFileHandle;
}
export async function getFileHandle() {

  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  // For Chrome 86 and later...
  if ('showOpenFilePicker' in window) {
    const opts = {
      types: [{
        description: 'Json file',
        accept: {'application/json': ['.json']},
      }],
    };
    var fileHandle = await window.showOpenFilePicker(opts);
    return fileHandle;
  }
  
  // For Chrome 85 and earlier...
  var fileHandle = await window.chooseFileSystemEntries(opts);
  return fileHandle;
}

/**
 * Create a handle to a new (text) file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the new file.
 */
export function getNewFileHandle() {
  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  // For Chrome 86 and later...
  if ('showSaveFilePicker' in window) {
    const opts = {
      types: [{
        description: 'Json file',
        accept: {'application/json': ['.json']},
      }],
    };
    return window.showSaveFilePicker(opts);
  }
  // For Chrome 85 and earlier...
  const opts = {
    type: 'save-file',
    accepts: [{
      description: 'Json file',
      extensions: ['json'],
      mimeTypes: ['application/json'],
    }],
  };
  return window.chooseFileSystemEntries(opts);
}

/**
 * Reads the raw text from a file.
 *
 * @param {File} file
 * @return {!Promise<string>} A promise that resolves to the parsed string.
 */
export function readFile(file) {
  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  // If the new .text() reader is available, use it.
  if (file.text) {
    return file.text();
  }
  // Otherwise use the traditional file reading technique.
  return _readFileLegacy(file);
}

/**
 * Reads the raw text from a file.
 *
 * @private
 * @param {File} file
 * @return {Promise<string>} A promise that resolves to the parsed string.
 */
export async function _readFileLegacy(file) {
  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      const text = e.srcElement.result;
      resolve(text);
    });
    reader.readAsText(file);
  });
}

/**
 * Writes the contents to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} contents Contents to write.
 */
export async function writeFile(fileHandle, contents) {
  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  // Support for Chrome 82 and earlier.
  if (fileHandle.createWriter) {
    // Create a writer (request permission if necessary).
    const writer = await fileHandle.createWriter();
    // Write the full length of the contents
    await writer.write(0, contents);
    // Close the file and write the contents to disk
    await writer.close();
    return;
  }
  // For Chrome 83 and later.
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} withWrite True if write permission should be checked.
 * @return {boolean} True if the user has granted read/write permission.
 */
export async function verifyPermission(fileHandle, withWrite) {
  // checking if context is secure (monster in the middle attacks)
  if (!window.isSecureContext) {
    console.log("Error: Window does not have a secure context");
    return undefined;
  }
  const opts = {};
  if (withWrite) {
    opts.writable = true;
    // For Chrome 86 and later...
    opts.mode = 'readwrite';
  }
  // Check if we already have permission, if so, return true.
  if (await fileHandle.queryPermission(opts) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if (await fileHandle.requestPermission(opts) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}
