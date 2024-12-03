import {save as chiSave} from "../../js/engine/CPChibiFile.js";
import AdobeColorTable from "../util/AdobeColorTable.js";
import EventEmitter from "wolfy87-eventemitter";
import FileSaver from "file-saver";

import {_} from "../languages/lang.js";

/**
 * We generally can't do much with binary strings because various methods will try to UTF-8 mangle them.
 * This function converts such a string to a Uint8Array instead.
 */
export function binaryStringToByteArray(s) {
    var
        result = new Uint8Array(s.length);

    for (var i = 0; i < s.length; i++) {
        result[i] = s.charCodeAt(i);
    }

    return result;
}

/**
 * Saves ChickenPaint resources to a remote server or to the disk and emits progress events.
 *
 * Options:
 *     url - URL to send to. If omitted, will save to the disk instead.
 *     artwork - Artwork to send
 *     rotation - Integer [0..3] of the number of 90 degree rotation steps that should be applied to canvas upon opening.
 *     swatches - Array of ARGB integer colors to save as the image swatches (optional)
 */
export default function CPResourceSaver(options) {
    var
        that = this,
        
        cancelled = false;
    
    options.rotation = options.rotation || 0;
    
    function reportProgress(progress) {
        if (progress === null) {
            that.emitEvent("savingProgress", [1.0, _("Saving drawing...")]);
        } else {
            that.emitEvent("savingProgress", [progress, _("Saving drawing...") +" (" + Math.round(progress * 100) + "%)"]);
        }
    }
    
    function reportFatal(serverMessage) {
        that.emitEvent("savingFailure", [serverMessage]);
    }
    
    async function postDrawing(formData) {

      // FormDataサイズを取得してチェック
      try {
        const size = await getFormDataSize(formData);
        const total_size = `${(size/ 1024 / 1024).toFixed(3)}MB`;
        const limit_size = `${options.post_max_size}MB`;
        console.log("Total size of FormData:", total_size);
        console.log("post_max_size:",limit_size);

        if (options && options.post_max_size && size && !isNaN(size) && (size > (options.post_max_size * 1024 * 1024))) {
            reportFatal(`${_("The file size exceeds the server limit.")}\n${_("Limit size")}:${limit_size}\n${_("Current size")}:${total_size}`);
            return; // サイズ超過の場合は中断
        } else {
            console.log(_("The total size of FormData is within the acceptable range."));
        }
      } catch (error) {
        console.error("Error details:", error);
        reportFatal("An error occurred in the getFormDataSize function.");
        return;
      }
    
      var requestOptions = {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'X-Requested-With': 'chickenpaint'
          ,
        },
        body: formData,
      }; 
      reportProgress(0.5);
      // リクエストを送信
      fetch(options.url, requestOptions).then(response => {
        if (!response.ok) {
        throw new Error(`${_("Network response was not ok")} (Code:${response.status})`);
        }
    
        return response.text();
      }).then(responseText => {
        if (/^CHIBIOK/.test(responseText)) {
        reportProgress(1.0);
        that.emitEvent("savingComplete");
        } else {
        reportFatal(responseText);
        }
      }).catch(error => {
        reportFatal(error.message);
      });
      }

    /**
   * Calculates the total size of a FormData object in bytes.
   * This function iterates over each entry in the FormData object,
   * converting string values to Blobs to measure their size consistently.
   * Blob entries are used directly. All entries are then combined into a single Blob,
   * whose size is returned as the total FormData size.
   * 
   * Note: This function is asynchronous to ensure compatibility across
   * all environments where Blob size calculation might be non-blocking.
   * 
   * @param {FormData} formData - The FormData object containing data to be measured.
   * @returns {Promise<number>} The total size of the FormData data in bytes.
   */
    async function getFormDataSize(formData) {

      if(!options.post_max_size){
        return;
      }
      
      const entries = Array.from(formData.entries());
      const blobs = entries.map(([key, value]) => {
        if (typeof value === "string") {
            return new Blob([`${key}=${value}`]);
        } else {
            return value;
        }
      });
      const totalBlob = new Blob(blobs);
      return totalBlob.size;
    }
    // 	function postDrawing(formData) {
    //     var
    //         xhr = new XMLHttpRequest();
    
    //     xhr.upload.addEventListener("progress", function(evt) {
    //         var
    //             progress;
            
    //         if (evt.lengthComputable) {
    //             progress = evt.loaded / evt.total;
    //         } else {
    //             progress = null;
    //         }
            
    //         reportProgress(progress);
    //     }, false);
    
    //     xhr.addEventListener("load", function(evt) {
    //         reportProgress(1.0);
            
    //         if (this.status == 200 && /^CHIBIOK/.test(this.response)) {
    //             that.emitEvent("savingComplete");
    //         } else {
    //             reportFatal(this.response);
    //         }
    //     }, false);
    
    //     xhr.addEventListener("error", function() {
    //         reportFatal(this.response);
    //     }, false);
    
    //     reportProgress(0);
    
    //     xhr.open("POST", options.url, true);
        
    //     xhr.responseType = "text";
        
    //     xhr.send(formData);
    // }
    
    /**
     * Begin saving the data provided in the constructor. Returns immediately, and fires these events to report the
     * saving progress:
     * 
     * savingProgress(progress) - Progress is [0.0 ... 1.0] and reports how much has uploaded so far, or null if the 
     *                            total progress could not be determined.
     * savingFailure(error)     - When saving fails, along with a string error message to display to the user. 
     * savingComplete()         - When saving completes succesfully
     */
    this.save = function() {
        var
            flat,
            flatBlob,
            swatchesBlob;

        flat = binaryStringToByteArray(options.artwork.getFlatPNG(options.rotation));
        flatBlob = new Blob([flat], {type: "image/png"});
        flat = null; // Don't need this any more
        
        var
            serializeLayers;

        if (options.artwork.isSimpleDrawing()) {
            serializeLayers = Promise.resolve(null);
        } else {
            serializeLayers = chiSave(options.artwork);
        }
        
        serializeLayers
            .then(function(chibiResult) {
                if (cancelled) {
                    that.emitEvent("savingFailure");
                    return;
                }

                if (options.swatches) {
                    var
                        aco = new AdobeColorTable();

                    swatchesBlob = new Blob([aco.write(options.swatches)], {type: "application/octet-stream"});
                } else {
                    swatchesBlob = null;
                }

                if (options.url) {
                    let
                        marker = "This marker ensures the upload wasn't truncated",
                        formData = new FormData();

                    formData.append("beginMarker", marker);

					formData.append("painter", "ChickenPaint v2.0");

					formData.append("picture", flatBlob);
                    flatBlob = null;

                    if (chibiResult) {
						formData.append("chibifileFormat", chibiResult.version);

						formData.append("chibifile", chibiResult.bytes);
                        chibiResult = null;

						// Layers will need to be rotated upon opening
                        formData.append("rotation", "" + options.rotation);
                    } else {
                        /*
                         * Because the image is a flat PNG, we rotate it before we saved it and it doesn't need further
                         * rotation upon opening.
                         */
                        formData.append("rotation", "0");
                    }

                    if (swatchesBlob) {
                        formData.append("swatches", swatchesBlob);
                        swatchesBlob = null;
                    }

					formData.append("endMarker", marker);

                    postDrawing(formData);
                } else {

					const saveFilename='oekaki_' + (new Date()).toISOString().split('.')[0].replace(/[^0-9]/g, '_');
					
                    FileSaver.saveAs(flatBlob, saveFilename+".png");

                    if (chibiResult) {
                        FileSaver.saveAs(chibiResult.bytes, saveFilename+".chi");
                    }
                    if (swatchesBlob) {
                        FileSaver.saveAs(swatchesBlob, saveFilename+".aco");
                    }
                }
            })
            .catch(function(e) {
                that.emitEvent("savingFailure");
            });
    };
    
    this.cancel = function() {
        cancelled = true;
    };
}

CPResourceSaver.prototype = Object.create(EventEmitter.prototype);
CPResourceSaver.prototype.constructor = CPResourceSaver;
