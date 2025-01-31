/*
    ChickenPaint
    
    ChickenPaint is a translation of ChibiPaint from Java to JavaScript
    by Nicholas Sherlock / Chicken Smoothie.
    
    ChibiPaint is Copyright (c) 2006-2008 Marc Schefer

    ChickenPaint is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ChickenPaint is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ChickenPaint. If not, see <http://www.gnu.org/licenses/>.
*/

import $ from "jquery";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EventEmitter from "wolfy87-eventemitter";
import {_} from "../languages/lang.js";

export default function CPSendDialog(controller, parent, resourceSaver) {
    let
        dialog = 
            $(`<div class="modal fade chickenpaint-send-dialog" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content" data-stage="saving">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Saving drawing...")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <p class="chickenpaint-saving-progress-message">${_("Preparing your drawing to be saved, please wait...")}</p>
                            <pre class="chickenpaint-saving-error-message pre-scrollable"></pre>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light chickenpaint-send-cancel" data-bs-dismiss="modal">${_("Cancel")}</button>
                        </div>
                    </div>
                    <div class="modal-content" data-stage="success-not-previously-posted" style="display:none">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Drawing saved!")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${_("Your drawing has been saved, would you like to post it to the forum now?")}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary chickenpaint-post-drawing" data-bs-dismiss="modal">${_("Yes, post it now")}</button>
                            <button type="button" class="btn btn-light chickenpaint-continue-drawing" data-bs-dismiss="modal">${_("No, keep drawing")}</button>
                            <button type="button" class="btn btn-light chickenpaint-exit" data-bs-dismiss="modal">${_("No, quit and I'll finish it later")}</button>
                        </div>
                    </div>
                    <div class="modal-content" data-stage="success-already-posted" style="display:none">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Drawing saved!")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${_("Your drawing has been saved, would you like to view it on the forum now?")}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary chickenpaint-post-drawing" data-bs-dismiss="modal">${_("Yes, view the post")}</button>
                            <button type="button" class="btn btn-light chickenpaint-continue-drawing" data-bs-dismiss="modal">${_("No, keep drawing")}</button>
                        </div>
                    </div>
                    <div class="modal-content" data-stage="success-redirect" style="display:none">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Drawing saved!")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${_("Your drawing has been saved, redirecting you to view your new post now...")}</p>
                        </div>
                    </div>
                </div>
            </div>
        `),
        progressMessageElem = $(".chickenpaint-saving-progress-message", dialog),
        progressError = $(".chickenpaint-saving-error-message", dialog),
        progressElem = $(".progress-bar", dialog),

        that = this;
    
        resourceSaver.on("savingProgress", function(progress, message) {
            progress *= 100;

            progressMessageElem.text(message);

            $(progressElem)
                .attr("aria-valuenow", progress)
                .css("width", progress + "%");
        });

        resourceSaver.on("savingComplete", function () {
            let dialogElement = dialog[0];
        
            dialogElement.querySelector(".modal-content[data-stage='saving']").style.display = "none";
        
            if (controller.isActionSupported("CPContinue")) {
                if (controller.isActionSupported("CPExit")) {
                    dialogElement.querySelector(".modal-content[data-stage='success-not-previously-posted']").style.display = "block";
                } else {
                    dialogElement.querySelector(".modal-content[data-stage='success-already-posted']").style.display = "block";
                }
            } else {
                dialogElement.querySelector(".modal-content[data-stage='success-redirect']").style.display = "block";
            }
        });

        resourceSaver.on("savingFailure", function(serverMessage) {
            progressElem.addClass("progress-bar-danger");

            let
                errorMessage = _("Sorry, your drawing could not be saved, please try again later.");

            if (serverMessage) {
                serverMessage = serverMessage.replace(/^CHIBIERROR\s*/, "");

                if (serverMessage.length > 0) {
                    errorMessage += `<br><br>${_("The error returned from the server was")}:`;

                    progressError
                        .text(serverMessage)
                        .show();
                }

                progressMessageElem.html(errorMessage);
            }
        });

        dialog[0].querySelector(".chickenpaint-post-drawing").addEventListener("click", function() {
            controller.actionPerformed({ action: "CPPost" });
        });
        let exitButton = dialog[0].querySelector(".chickenpaint-exit");
        if (exitButton) {
            exitButton.style.display = controller.isActionSupported("CPExit") ? "" : "none";
            exitButton.addEventListener("click", function() {
                alert("When you want to come back and finish your drawing, just click the 'new drawing' button again and "
                    + "you can choose to continue this drawing.");
                controller.actionPerformed({ action: "CPExit" });
            });
        }

        dialog[0].querySelector(".chickenpaint-send-cancel").addEventListener("click", function () {
            resourceSaver.cancel();
            // dialog[0].classList.remove('show'); // Bootstrapの.modal('hide') 相当
        });
        
        // Destroy the modal upon close
        dialog[0].addEventListener('hidden.bs.modal', (e) => {
        dialog.remove();
        })

        dialog.appendTo(parent);

        // Bootstrap 5のModalを初期化
        let modal = new bootstrap.Modal(dialog[0]);

        this.show = function() {
            modal.show();
            that.emitEvent("shown");
    };
    }

    CPSendDialog.prototype = Object.create(EventEmitter.prototype);
    CPSendDialog.prototype.constructor = CPSendDialog;
