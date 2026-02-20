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

import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import EventEmitter from "wolfy87-eventemitter";
import { _ } from "../languages/lang.js";

export default function CPSendDialog(
    controller,
    parent,
    resourceSaver,
    savedbFromMenu = false,
) {
    let dialog = document.createElement("div");
    dialog.className = "modal fade chickenpaint-send-dialog";
    dialog.tabIndex = -1;
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content" data-stage="saving">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Saving ...")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="chickenpaint-saving-progress-message">${savedbFromMenu ? _("Preparing your backup to be saved, please wait...") : _("Preparing your drawing to be saved, please wait...")}</p>
                    <pre class="chickenpaint-saving-error-message pre-scrollable" style="display: none;"></pre>
                    <div class="progress" style="${savedbFromMenu ? "display:none" : ""}">
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
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close">
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
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close">
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
                    <h5 class="modal-title">${savedbFromMenu ? _("Drawing saved to browser storage!") : _("Drawing saved!")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${savedbFromMenu ? _("Your drawing has been saved to your browser storage.") : _("Your drawing has been saved, redirecting you to view your new post now...")}</p>
                </div>
                 <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" data-stage="success-savedb-from-menu" style="display:none">OK</button>
                </div>
            </div>
        </div>
    `;

    let progressMessageElem = dialog.querySelector(
        ".chickenpaint-saving-progress-message",
    );
    let progressError = dialog.querySelector(
        ".chickenpaint-saving-error-message",
    );
    let progressElem = dialog.querySelector(".progress-bar");
    let modal = new bootstrap.Modal(dialog, {
        backdrop: "static", // 背景クリックで閉じない
        keyboard: false, // Escキーで閉じない
    });
    let that = this;

    resourceSaver.on("savingProgress", function (progress, message) {
        progressMessageElem.textContent = message;
        progressElem.setAttribute("aria-valuenow", progress * 100);
        progressElem.style.width = progress * 100 + "%";
    });

    resourceSaver.on("savingComplete", function () {
        // "saving" ステージを非表示にする
        dialog.querySelector(
            ".modal-content[data-stage='saving']",
        ).style.display = "none";

        // CPContinue と CPExit のサポートを確認して、適切なステージを表示する
        if (controller.isActionSupported("CPContinue")) {
            if (controller.isActionSupported("CPExit")) {
                // "success-not-previously-posted" ステージを表示
                dialog.querySelector(
                    ".modal-content[data-stage='success-not-previously-posted']",
                ).style.display = "block";
            } else {
                // "success-already-posted" ステージを表示
                dialog.querySelector(
                    ".modal-content[data-stage='success-already-posted']",
                ).style.display = "block";
            }
        } else {
            // "success-redirect" ステージを表示
            dialog.querySelector(
                ".modal-content[data-stage='success-redirect']",
            ).style.display = "block";
            if (savedbFromMenu) {
                dialog.querySelector(
                    ".modal-footer button[data-stage='success-savedb-from-menu']",
                ).style.display = "block";
            }
        }
    });

    resourceSaver.on("savingFailure", function (serverMessage) {
        progressElem.classList.add("progress-bar-danger");
        let errorMessage = _(
            "Sorry, your drawing could not be saved, please try again later.",
        );

        if (serverMessage) {
            serverMessage = serverMessage.replace(/^CHIBIERROR\s*/, "");
            if (serverMessage.length > 0) {
                errorMessage += `<br><br>${_("The error returned from the server was")}:`;
                progressError.textContent = serverMessage;
                progressError.style.display = "block";
            }
        }
        progressMessageElem.innerHTML = errorMessage;
    });

    dialog
        .querySelector(".chickenpaint-send-cancel")
        .addEventListener("click", function () {
            resourceSaver.cancel();
        });

    let postButton = dialog.querySelector(".chickenpaint-post-drawing");
    if (postButton) {
        postButton.addEventListener("click", function () {
            controller.actionPerformed({ action: "CPPost" });
        });
    }

    let exitButton = dialog.querySelector(".chickenpaint-exit");
    if (exitButton) {
        exitButton.style.display = controller.isActionSupported("CPExit")
            ? ""
            : "none";
        exitButton.addEventListener("click", function () {
            alert(
                "When you want to come back and finish your drawing, just click the 'new drawing' button again and " +
                    "you can choose to continue this drawing.",
            );
            controller.actionPerformed({ action: "CPExit" });
        });
    }

    dialog.addEventListener("hidden.bs.modal", () => {
        dialog.remove();
    });

    parent.appendChild(dialog);

    this.show = function () {
        modal.show();
        that.emitEvent("shown");
    };
}

CPSendDialog.prototype = Object.create(EventEmitter.prototype);
CPSendDialog.prototype.constructor = CPSendDialog;
