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
import {_} from "../languages/lang.js";

const macPlatform = navigator.userAgent.toLowerCase().includes('mac os');
const Ctrl = macPlatform ? "⌘" : "Ctrl";
const ctrlForZoom = macPlatform ? '⌃' : "Ctrl";

export default function CPShortcutsDialog(parent) {
    const dialog = document.createElement('div');
    dialog.classList.add('modal', 'fade', 'chickenpaint-shortcuts-dialog');
    dialog.tabIndex = -1;
    dialog.role = 'dialog';
    
    dialog.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Shortcuts")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${_("Many of the menu options and painting tools have keyboard shortcuts which are written next to them or appear when you hover.")}</p>
                    <p>${_("Here are some other shortcuts which are not as obvious!")}</p>
                    <div class="chickenpaint-shortcuts-sections">
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Color swatches palette")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Use as the drawing color")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Right")}</span></dt>
                                        <dd>${_("Remove or replace a color swatch")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Line drawing mode")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Shift</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Snap line to nearest 45 degrees")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Painting tools")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">1</span> - <span class="chickenpaint-shortcut-key">9</span>, <span class="chickenpaint-shortcut-key">0</span></span></dt>
                                        <dd>${_("Change brush opacity")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">[</span>, <span class="chickenpaint-shortcut-key">]</span></span></dt>
                                        <dd>${_("Change brush size")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Brush palette")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Right")}</span><span class="chickenpaint-shortcut-alternate">${_("or")}</span><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Shift</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Adjust brush sliders more precisely")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Zoom")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">${ctrlForZoom}</span>  + <span class="chickenpaint-shortcut-key">Space</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span><dt>
                                        <dt><span class="chickenpaint-shortcut-alternate">${_("or")}</span>
                                        <span class="chickenpaint-shortcut-key">Shift</span>  + <span class="chickenpaint-shortcut-key">Space</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Zoom the canvas")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Drawing canvas")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Middle")}</span> <span class="chickenpaint-shortcut-alternate">${_("or")}</span> <span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Space</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Move the canvas around")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">R</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Rotate the canvas")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Right")}</span><span class="chickenpaint-shortcut-alternate">${_("or")}</span><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Alt</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Sample the color under the cursor")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <div class="chickenpaint-shortcuts-section">
                            <h5>${_("Layers palette")}</h5>
                            <ul class="chickenpaint-shortcuts-list list-unstyled">
                                <li>
                                    <dl>
                                        <dt><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Double click")}</span><span class="chickenpaint-shortcut-alternate">${_("or")}</span><span class="chickenpaint-shortcut"><span class="fa icon-mouse-pointer"></span> ${_("Right")}</span></dt>
                                        <dd>${_("Rename layer")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Shift</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Toggle mask enable/disable")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Alt</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Toggle mask View")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">${Ctrl}</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Apply layer mask")}</dd>
                                        <dt><span class="chickenpaint-shortcut"><span class="chickenpaint-shortcut-key">Shift</span> + <span class="chickenpaint-shortcut-key">${Ctrl}</span> + <span class="fa icon-mouse-pointer"></span> ${_("Left")}</span></dt>
                                        <dd>${_("Delete layer mask")}</dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Destroy the modal upon close
    dialog.querySelector('.btn-close').addEventListener('click', () => {
        dialog.remove();
    });

    // Initialize the modal using Bootstrap 5 methods
    const modalInstance = new bootstrap.Modal(dialog);

    parent.appendChild(dialog);

    this.show = function () {
        modalInstance.show();
    };
}
