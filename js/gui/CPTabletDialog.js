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

export default function CPTabletDialog(parent) {
    let dialog = document.createElement("div");
    dialog.classList.add("modal", "fade");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Drawing tablet support</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="chickenpaint-tablet-support chickenpaint-pointerevents-support">
                        <h5>
                            Built-in support for most tablets.
                            <small>macOS, Windows 10 or newer</small>
                        </h5>
                        <div class="chickenpaint-supported-browsers">
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-chrome"></span>
                                Chrome
                            </div>
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-edge"></span>
                                Edge (Windows 10)
                            </div>
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-firefox"></span>
                                Firefox
                            </div>
                        </div>
                        <p class="chickenpaint-not-supported">
                            Your browser doesn't have built-in support for drawing tablets, please try
                            one of the other browsers listed above.
                        </p>
                        <p class="chickenpaint-supported alert alert-success">
                            Your browser has built-in support for drawing tablets!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const peSupportElem = dialog.querySelector(
        ".chickenpaint-pointerevents-support"
    );
    const peSupported = !!window.PointerEvent;

    peSupportElem?.classList.toggle("supported", peSupported);
    peSupportElem?.classList.toggle("not-supported", !peSupported);

    // Destroy the modal upon close
    dialog.addEventListener("hidden.bs.modal", (e) => {
        dialog.remove();
    });

    // Initialize the modal using Bootstrap 5 methods
    const modalInstance = new bootstrap.Modal(dialog);

    parent.appendChild(dialog);

    // Show method
    this.show = function () {
        modalInstance.show();
    };
}
