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

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CPWacomTablet from "../util/CPWacomTablet.js";

export default function CPTabletDialog(parent) {
    let dialog = document.createElement('div');
    dialog.classList.add('modal', 'fade');
    dialog.setAttribute('tabindex', '-1');
    dialog.setAttribute('role', 'dialog');
    dialog.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Drawing tablet support</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="chickenpaint-tablet-there-are-two-options">
                        There are two ways you could use your tablet's pen pressure support with ChickenPaint.
                    </p>
                    <div class="chickenpaint-tablet-support chickenpaint-wacom-support">
                        <h5>Plugin for Wacom tablets</h5>
                        <div class="chickenpaint-supported-browsers">
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-firefox"></span>
                                Firefox (32-bit only)
                            </div>
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-safari"></span>
                                Safari
                            </div>
                            <div class="chickenpaint-supported-browser">
                                <span class="icon-opera"></span>
                                Opera
                            </div>
                        </div>
                        <p class="chickenpaint-not-installed">
                            The plugin for Wacom tablets doesn't seem to be installed in your browser yet.
                        </p>
                        <p class="chickenpaint-not-installed">
                            Please make sure that you've installed the latest drivers for your tablet from the 
                            <a href="http://www.wacom.com/en-us/support/product-support/drivers" target="_blank">Wacom drivers page</a>,
                            then restart your browser.
                        </p>
                        <p class="chickenpaint-not-supported">
                            Your browser doesn't support the Wacom tablet plugin, please 
                            try one of the browsers listed above instead.
                        </p>
                        <p class="chickenpaint-supported alert alert-success">
                            The Wacom tablet plugin is installed and working.
                        </p>
                    </div>
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
                                Firefox (<a href="https://github.com/satopian/ChickenPaint_Be/blob/main/help/Firefox%20pressure%20support.md" target="_blank" rel="noopener">help <i class="fa icon-external-link-alt"></i></a>)
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
  
    let wacomSupportElem = dialog.querySelector(".chickenpaint-wacom-support"),
        peSupportElem = dialog.querySelector(".chickenpaint-pointerevents-support"),
        bothOptionsElem = dialog.querySelector(".chickenpaint-tablet-there-are-two-options"),
        wacomPresent = CPWacomTablet.getRef().isTabletPresent(),
        peSupported = !!window.hasNativePointerEvents;

    if (wacomPresent) {
        wacomSupportElem.classList.add("supported");
        peSupportElem.style.display = 'none';
        bothOptionsElem.style.display = 'none';
    } else {
        if (/Chrome/i.test(navigator.userAgent) && !/OPR/.test(navigator.userAgent)
            || /iPad/.test(navigator.userAgent) || /iPhone/.test(navigator.userAgent)) {
            wacomSupportElem.classList.add("not-supported");
        }

        if (peSupported) {
            wacomSupportElem.style.display = 'none';
            bothOptionsElem.style.display = 'none';
        }
    }

    peSupportElem.classList.toggle("supported", peSupported);
    peSupportElem.classList.toggle("not-supported", !peSupported);

    // Destroy the modal upon close
    dialog.addEventListener('hidden.bs.modal', (e) => {
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
