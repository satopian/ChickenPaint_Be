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
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import CPPalette from "./CPPalette.js";
import CPBlend from "../engine/CPBlend.js";
import CPSlider from "./CPSlider.js";
import CPLayerGroup from "../engine/CPLayerGroup.js";
import CPLayer from "../engine/CPLayer.js";
import CPImageLayer from "../engine/CPImageLayer.js";

import { _ } from "../languages/lang.js";

function absorbTouch(e) {
    e.preventDefault();
    e.stopPropagation();
}

function createFontAwesomeIcon(iconName) {
    let icon = document.createElement("span");

    icon.className = "fa " + iconName;

    return icon;
}

function createChickenPaintIcon(iconName) {
    let icon = document.createElement("span");

    icon.className = "chickenpaint-icon chickenpaint-icon-" + iconName;

    return icon;
}

/**
 *
 * @param {HTMLInputElement} checkbox - Must have a unique ID set
 * @param {string} title
 *
 * @returns {HTMLElement}
 */
function wrapBootstrapCheckbox(checkbox, title) {
    let div = document.createElement("div"),
        label = document.createElement("label");

    label.tabIndex = -1;
    checkbox.tabIndex = -1;

    div.className = "form-check";

    checkbox.className = "form-check-input";

    label.className = "form-check-label";
    label.setAttribute("for", checkbox.id);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(title));

    div.appendChild(checkbox);
    div.appendChild(label);

    return div;
}

function computeLayerPredicates(layer) {
    return {
        "image-layer": layer instanceof CPImageLayer,
        "layer-group": layer instanceof CPLayerGroup,

        "clipping-mask": layer instanceof CPImageLayer && layer.clip,
        "no-clipping-mask": layer instanceof CPImageLayer && !layer.clip,
        "no-clipping-mask-or-is-group":
            !(layer instanceof CPImageLayer) || !layer.clip,

        mask: layer && layer.mask !== null,
        "no-mask": layer && layer.mask === null,

        "mask-enabled": layer && layer.mask !== null && layer.maskVisible,
        "mask-disabled": layer && layer.mask !== null && !layer.maskVisible,
    };
}

export default function CPLayersPalette(controller) {
    CPPalette.call(this, controller, "layers", "Layers", {
        resizeHorz: true,
        resizeVert: true,
    });

    const NOTIFICATION_HIDE_DELAY_MS_PER_CHAR = 70,
        NOTIFICATION_HIDE_DELAY_MIN = 3000,
        BUTTON_PRIMARY = 0,
        BUTTON_WHEEL = 1,
        BUTTON_SECONDARY = 2;

    let palette = this,
        artwork = controller.getArtwork(),
        /**
         * An array of layers in display order, with the layers inside collapsed groups not present.
         *
         * @type {CPLayer[]}
         */
        linearizedLayers = null,
        body = this.getBodyElement(),
        positionRoot = this.getElement(),
        // This element will be responsible for positioning the BS dropdown
        dropdownParent = positionRoot,
        layerWidget = new CPLayerWidget(),
        alphaSlider = new CPSlider(0, 100, false, false, 208),
        blendCombo = document.createElement("select"),
        renameField = new CPRenameField(),
        cbSampleAllLayers = document.createElement("input"),
        cbLockAlpha = document.createElement("input"),
        notificationDismissTimer = false,
        layerActionButtons;

    /**
     *
     * @param {number} displayIndex
     * @returns {CPLayer}
     */
    function getLayerFromDisplayIndex(displayIndex) {
        return linearizedLayers[displayIndex];
    }

    /**
     *
     * @param {CPLayer} layer
     * @returns {number}
     */
    function getDisplayIndexFromLayer(layer) {
        return linearizedLayers.indexOf(layer);
    }

    function CPLayerWidget() {
        const LAYER_DRAG_START_THRESHOLD = 5, // Pixels we have to move a layer before it shows as "dragging"
            LAYER_IN_GROUP_INDENT = 16,
            CLASSNAME_LAYER_ACTIVE = "active",
            CLASSNAME_LAYER_VISIBLE = "chickenpaint-layer-visible",
            CLASSNAME_LAYER_HIDDEN = "chickenpaint-layer-hidden",
            CLASSNAME_LAYER_GROUP_EXPANDED =
                "chickenpaint-layer-group-expanded",
            CLASSNAME_LAYER_GROUP_COLLAPSED =
                "chickenpaint-layer-group-collapsed",
            CLASSNAME_LAYER_GROUP_TOGGLE = "chickenpaint-layer-group-toggle",
            CLASSNAME_LAYER_IMAGE_THUMBNAIL =
                "chickenpaint-layer-image-thumbnail",
            CLASSNAME_LAYER_MASK_THUMBNAIL =
                "chickenpaint-layer-mask-thumbnail",
            CLASSNAME_LAYER_THUMBNAIL = "chickenpaint-layer-thumbnail",
            DRAG_STATE_IDLE = 0,
            DRAG_STATE_PRE_DRAG = 1, // If we've put our cursor down but we're not sure if we're dragging or clicking yet
            DRAG_STATE_DRAGGING = 2, // When we're really dragging
            DRAG_STATE_PRE_PAN = 3, // Pen/touch is down, we could either click, drag or pan
            DRAG_STATE_PANNING = 4,
            LONG_PRESS_INTERVAL = 800;

        let drag = {
                /**
                 *
                 * @type {number}
                 */
                state: DRAG_STATE_IDLE,

                /**
                 * The image layer currently being dragged, or null if no drag is in progress.
                 *
                 * @type {?CPLayer}
                 */
                layer: null,

                /**
                 * The element of the layer being dragged
                 *
                 * @type {HTMLElement}
                 */
                layerElem: null,

                /**
                 * @type {number}
                 */
                dragX: 0,

                /**
                 * @type {number}
                 */
                dragY: 0,

                /**
                 * @type {number}
                 */
                initialScrollTop: 0,

                dropTarget: null,
                dropBetweenMarkerElem: null,
                frameElem: null,
            },
            widgetContainer = document.createElement("div"),
            layerContainer = document.createElement("div"),
            scrollContainer = layerContainer,
            //ドロップダウンメニュー関連項目のコメントアウト
            // dropdownLayerMenu = createLayerDropdownMenu(),
            // dropdownMousePos = {x: 0, y: 0},

            /**
             * @type {number} Rotation of image in 90 degree units
             */
            imageRotation = 0,
            /**
             * The layer we right-clicked on to open the dropdown
             *
             * @type {CPLayer}
             */
            dropdownLayer = null,
            /**
             * True if we right-clicked on the mask of the layer for the dropdown.
             * @type {boolean}
             */
            dropdownOnMask = false,
            longPressTimer = null;

        /**
         * Get the element that represents the layer with the given display index.
         *
         * @param {number} displayIndex
         * @returns {HTMLElement}
         */
        function getElemFromDisplayIndex(displayIndex) {
            let elems = layerContainer.querySelectorAll(".chickenpaint-layer");

            return elems[elems.length - 1 - displayIndex];
        }

        function getDisplayIndexFromElem(elem) {
            let layer = elem.closest(".chickenpaint-layer");

            if (layer) {
                let elems = Array.from(
                    layerContainer.querySelectorAll(".chickenpaint-layer")
                );
                return elems.length - 1 - elems.indexOf(layer);
            } else {
                return -1;
            }
        }

        /**
         * @typedef {Object} CPDropTarget
         *
         * @property {number} displayIndex - The index of the layer to insert near
         * @property {CPLayer} layer - The layer to insert near
         * @property {string} direction - "under", "over" or "inside", the direction to insert relative to the target
         */

        /**
         * Decides which drop target we should offer for the given mouse position.
         *
         * Returns null if no drop should be offered at the given position, otherwise returns an object with details
         * on the drop.
         *
         * @param {number} clientX
         * @param {number} clientY
         * @returns {?CPDropTarget}
         */
        function getDropTargetFromClientPos(clientX, clientY) {
            let layerElems = $(".chickenpaint-layer", layerContainer),
                target = {
                    layer: linearizedLayers[linearizedLayers.length - 1],
                    displayIndex: linearizedLayers.length - 1,
                    direction: "over",
                };

            for (
                let displayIndex = 0;
                displayIndex < layerElems.length;
                displayIndex++
            ) {
                let targetElem =
                        layerElems[layerElems.length - 1 - displayIndex],
                    rect = targetElem.getBoundingClientRect();

                if (displayIndex === 0 && clientY > rect.bottom) {
                    // Special support for positioning after the last element to help us escape the bottom of a group
                    let lastLayer = artwork.getLayersRoot().layers[0];

                    target = {
                        layer: lastLayer,
                        displayIndex: getDisplayIndexFromLayer(lastLayer),
                        direction: "under",
                    };
                    break;
                } else if (clientY >= rect.top) {
                    let targetLayer = getLayerFromDisplayIndex(displayIndex),
                        targetHeight = rect.bottom - rect.top;

                    target = { layer: targetLayer, displayIndex: displayIndex };

                    if (targetLayer instanceof CPLayerGroup) {
                        if (clientY >= rect.top + targetHeight * 0.75) {
                            if (
                                targetLayer.expanded &&
                                targetLayer.layers.length > 0
                            ) {
                                // Show the insert marker as above the top layer in the group
                                target.layer =
                                    targetLayer.layers[
                                        targetLayer.layers.length - 1
                                    ];
                                target.displayIndex--;
                                target.direction = "over";
                            } else {
                                target.direction = "under";
                            }
                        } else if (clientY >= rect.top + targetHeight * 0.25) {
                            if (
                                targetLayer.expanded &&
                                targetLayer.layers.length > 0
                            ) {
                                // Show the insert marker as above the top layer in the group rather than on top of the group
                                target.layer =
                                    targetLayer.layers[
                                        targetLayer.layers.length - 1
                                    ];
                                target.displayIndex--;
                                target.direction = "over";
                            } else {
                                target.direction = "inside";
                            }
                        } else {
                            target.direction = "over";
                        }
                    } else {
                        if (clientY >= rect.top + targetHeight * 0.5) {
                            target.direction = "under";
                        } else {
                            target.direction = "over";
                        }
                    }
                    break;
                }
            }

            /*
             * If we're dropping into the same container, make sure we don't offer to drop the layer back to the
             * same position it was already in.
             */
            if (
                target.layer.parent == drag.layer.parent &&
                (target.direction == "over" || target.direction == "under")
            ) {
                let parentGroup = target.layer.parent,
                    targetIndex = parentGroup.indexOf(target.layer);

                if (
                    (target.direction == "over" &&
                        parentGroup.layers[targetIndex + 1] == drag.layer) ||
                    (target.direction == "under" &&
                        parentGroup.layers[targetIndex - 1] == drag.layer) ||
                    target.layer == drag.layer
                ) {
                    return null;
                }
            }

            /*
             * Make sure we don't try to drop a group as a child of itself, no group-ception!
             */
            if (
                drag.layer instanceof CPLayerGroup &&
                ((target.layer == drag.layer && target.direction == "inside") ||
                    target.layer.hasAncestor(drag.layer))
            ) {
                return null;
            }

            return target;
        }

        function updateDropMarker() {
            if (drag.state === DRAG_STATE_DRAGGING) {
                let positionRootBounds = positionRoot.getBoundingClientRect(),
                    hideBetweenMarker = true,
                    hideIntoMarker = true;

                drag.dropTarget = getDropTargetFromClientPos(
                    drag.dragX,
                    drag.dragY
                );

                if (drag.dropTarget) {
                    let targetElem = getElemFromDisplayIndex(
                        drag.dropTarget.displayIndex
                    );

                    switch (drag.dropTarget.direction) {
                        case "over":
                        case "under":
                            layerContainer.appendChild(
                                drag.dropBetweenMarkerElem
                            );

                            let layerRect,
                                markerDepth =
                                    drag.dropTarget.layer.getDepth() - 1,
                                markerLeft,
                                layerBottom;

                            // Position the marker in the correct position between the layers, and indent it to match the layer
                            layerRect = targetElem.getBoundingClientRect();

                            // Are we dropping below the layers in an expanded group? Extend the rect to enclose them
                            if (
                                drag.dropTarget.direction == "under" &&
                                drag.dropTarget.layer instanceof CPLayerGroup &&
                                drag.dropTarget.layer.expanded
                            ) {
                                // Find the display index after this group
                                let childIndex;

                                for (
                                    childIndex =
                                        drag.dropTarget.displayIndex - 1;
                                    childIndex >= 0;
                                    childIndex--
                                ) {
                                    if (
                                        !linearizedLayers[
                                            childIndex
                                        ].hasAncestor(drag.dropTarget.layer)
                                    ) {
                                        break;
                                    }
                                }

                                layerBottom = getElemFromDisplayIndex(
                                    childIndex + 1
                                ).getBoundingClientRect().bottom;
                            } else {
                                layerBottom = layerRect.bottom;
                            }

                            markerLeft =
                                layerRect.left -
                                positionRootBounds.left +
                                (markerDepth > 0
                                    ? 26 + LAYER_IN_GROUP_INDENT * markerDepth
                                    : 0);

                            drag.dropBetweenMarkerElem.style.left =
                                markerLeft + "px";
                            drag.dropBetweenMarkerElem.style.width =
                                layerRect.right -
                                positionRootBounds.left -
                                markerLeft +
                                "px";
                            drag.dropBetweenMarkerElem.style.top =
                                (drag.dropTarget.direction == "over"
                                    ? layerRect.top - 1
                                    : layerBottom + 1) -
                                positionRootBounds.top +
                                "px";

                            $(
                                ".chickenpaint-layer-drop-target",
                                layerContainer
                            ).removeClass("chickenpaint-layer-drop-target");

                            hideBetweenMarker = false;
                            break;
                        case "inside":
                            let layerElems = $(
                                ".chickenpaint-layer",
                                layerContainer
                            );

                            layerElems.each(function (index) {
                                $(this).toggleClass(
                                    "chickenpaint-layer-drop-target",
                                    layerElems.length - 1 - index ==
                                        drag.dropTarget.displayIndex
                                );
                            });

                            hideIntoMarker = false;
                            break;
                    }
                }

                if (hideIntoMarker) {
                    $(
                        ".chickenpaint-layer-drop-target",
                        layerContainer
                    ).removeClass("chickenpaint-layer-drop-target");
                }

                if (hideBetweenMarker) {
                    if (drag.dropBetweenMarkerElem) {
                        drag.dropBetweenMarkerElem.remove();
                    }
                }

                drag.frameElem.style.top =
                    drag.dragY -
                    positionRootBounds.top -
                    parseInt(drag.frameElem.style.height, 10) / 2 +
                    "px";
            } else {
                if (drag.dropBetweenMarkerElem) {
                    drag.dropBetweenMarkerElem.remove();
                }
                if (drag.frameElem) {
                    drag.frameElem.remove();
                }
            }
        }

        function createImageThumb(layer) {
            let thumbnail = layer.getImageThumbnail(),
                thumbCanvas = thumbnail.getAsCanvas(imageRotation);

            thumbCanvas.title = _("Image");
            thumbCanvas.className =
                CLASSNAME_LAYER_THUMBNAIL +
                " " +
                CLASSNAME_LAYER_IMAGE_THUMBNAIL;

            // Thumbnails are actually displayed at 25px high, set the display width appropriately for the aspect ratio
            thumbCanvas.style.maxWidth =
                (thumbCanvas.width / thumbCanvas.height) * 25 + "px";

            if (layer == artwork.getActiveLayer() && !artwork.isEditingMask()) {
                thumbCanvas.className += " active";
            }

            return thumbCanvas;
        }

        function drawRedX(canvas) {
            const X_INSET = 5,
                Y_INSET = 5,
                X_LINE_THICKNESS = 3,
                context = canvas.getContext("2d");

            context.strokeStyle = "red";
            context.lineWidth = X_LINE_THICKNESS;

            context.moveTo(X_INSET, Y_INSET);
            context.lineTo(canvas.width - X_INSET, canvas.height - Y_INSET);

            context.moveTo(canvas.width - X_INSET, Y_INSET);
            context.lineTo(X_INSET, canvas.height - Y_INSET);

            context.stroke();
        }

        function createMaskThumb(layer) {
            let thumbnail = layer.getMaskThumbnail(),
                thumbCanvas = thumbnail.getAsCanvas(imageRotation);

            thumbCanvas.title = _("Layer mask");
            thumbCanvas.className =
                CLASSNAME_LAYER_THUMBNAIL +
                " " +
                CLASSNAME_LAYER_MASK_THUMBNAIL;

            // Thumbnails are actually displayed at 25px high, set the display width appropriately for the aspect ratio
            thumbCanvas.style.maxWidth =
                (thumbCanvas.width / thumbCanvas.height) * 25 + "px";

            if (layer == artwork.getActiveLayer() && artwork.isEditingMask()) {
                thumbCanvas.className += " active";
            }
            if (!layer.maskVisible) {
                thumbCanvas.className += " disabled";

                drawRedX(thumbCanvas);
            }

            return thumbCanvas;
        }

        /**
         * Create a DOM element for the given layer
         *
         * @param {number} index
         * @param {CPLayer} layer
         */
        function buildLayer(index, layer) {
            let layerDiv = document.createElement("div"),
                eyeDiv = document.createElement("div"),
                mainDiv = document.createElement("div"),
                iconsDiv = document.createElement("div"),
                layerNameDiv = document.createElement("div"),
                statusDiv = document.createElement("div"),
                blendDiv = document.createElement("div");

            layerDiv.className = "chickenpaint-layer list-group-item";

            if (layer == artwork.getActiveLayer()) {
                layerDiv.className += " " + CLASSNAME_LAYER_ACTIVE;
            }

            eyeDiv.className = "chickenpaint-layer-eye";
            if (!layer.ancestorsAreVisible()) {
                eyeDiv.className += " chickenpaint-layer-eye-hidden-ancestors";
            }

            eyeDiv.style.marginRight =
                2 + LAYER_IN_GROUP_INDENT * (layer.getDepth() - 1) + "px";

            if (layer.visible) {
                layerDiv.className += " " + CLASSNAME_LAYER_VISIBLE;
                eyeDiv.appendChild(createFontAwesomeIcon("icon-eye"));
            } else {
                layerDiv.className += " " + CLASSNAME_LAYER_HIDDEN;
                eyeDiv.appendChild(createFontAwesomeIcon("icon-eye-slash"));
            }

            layerDiv.appendChild(eyeDiv);

            mainDiv.className = "chickenpaint-layer-description";

            if (layer instanceof CPImageLayer) {
                if (layer.clip) {
                    layerDiv.className += " chickenpaint-layer-clipped";
                    iconsDiv.appendChild(
                        createFontAwesomeIcon(
                            "icon-level-down-alt fa-flip-horizontal"
                        )
                    );
                }

                if (layer.lockAlpha) {
                    let locked = createChickenPaintIcon("lock-alpha");

                    locked.title = _("Transparency locked");
                    statusDiv.appendChild(locked);
                }
            } else if (layer instanceof CPLayerGroup) {
                layerDiv.className += " chickenpaint-layer-group";

                if (layer.expanded) {
                    layerDiv.className += " " + CLASSNAME_LAYER_GROUP_EXPANDED;
                    iconsDiv.appendChild(
                        createFontAwesomeIcon(
                            "icon-folder-open chickenpaint-layer-group-toggle"
                        )
                    );
                } else {
                    layerDiv.className += " " + CLASSNAME_LAYER_GROUP_COLLAPSED;
                    iconsDiv.appendChild(
                        createFontAwesomeIcon(
                            "icon-folder chickenpaint-layer-group-toggle"
                        )
                    );
                }
            }

            if (iconsDiv.childNodes.length) {
                iconsDiv.className = "chickenpaint-layer-icons";
                layerDiv.appendChild(iconsDiv);
            }

            try {
                if (layer instanceof CPImageLayer) {
                    layerDiv.appendChild(createImageThumb(layer));
                }

                if (layer.mask) {
                    layerDiv.appendChild(createMaskThumb(layer));
                }
            } catch (e) {
                // We don't expect this to ever happen but it'd be nice if everything keeps running if it does
                console.log("Failed to create layer thumb");
            }

            let layerName =
                layer.name && layer.name.length > 0
                    ? layer.name
                    : "(unnamed " +
                      (layer instanceof CPLayerGroup ? "group" : "layer") +
                      ")";

            layerNameDiv.innerText = layerName;
            layerNameDiv.setAttribute("title", layerName);
            layerNameDiv.className = "chickenpaint-layer-name";

            blendDiv.innerText =
                _(CPBlend.BLEND_MODE_DISPLAY_NAMES[layer.blendMode]) +
                ": " +
                layer.alpha +
                "%";
            blendDiv.className = "chickenpaint-layer-blend";

            mainDiv.appendChild(layerNameDiv);
            mainDiv.appendChild(blendDiv);

            layerDiv.appendChild(mainDiv);

            statusDiv.className = "chickenpaint-layer-status";
            layerDiv.appendChild(statusDiv);

            layerDiv.setAttribute("data-display-index", "" + index);
            // layerDiv.setAttribute("data-toggle", "dropdown");
            // layerDiv.setAttribute("data-target", "#chickenpaint-layer-pop");

            return layerDiv;
        }

        function showRenameBoxForLayer(displayIndex) {
            if (displayIndex > -1) {
                let layer = getLayerFromDisplayIndex(displayIndex),
                    elem = getElemFromDisplayIndex(displayIndex);

                if (layer && elem) {
                    renameField.show(layer, elem);
                }
            }
        }

        function onDoubleClick(e) {
            if (
                e.button === BUTTON_PRIMARY &&
                $(e.target).closest(".chickenpaint-layer-description").length >
                    0 &&
                $(e.target).closest("input").length === 0
            ) {
                /* Double clicking the layer description should start editing it, but ignore double clicks inside
                 * the rename textbox itself
                 */
                showRenameBoxForLayer(getDisplayIndexFromElem(e.target));

                e.preventDefault();
            }
        }

        function showContextMenu(e) {
            let displayIndex = getDisplayIndexFromElem(e.target);
            if (displayIndex != -1) {
                //コンテキストメニューのBootstrap5対応ができなかったが
                //マウス使用時にレイヤー名を変更できないと困るので
                //右クリックでレイヤー名の変更になるように動作を変更した。
                showRenameBoxForLayer(getDisplayIndexFromElem(e.target));

                e.preventDefault();
            }
        }

        function onPointerDown(e) {
            let layerElem = e.target.closest(".chickenpaint-layer");
            let displayIndex = getDisplayIndexFromElem(layerElem);

            if (displayIndex != -1) {
                let layer = getLayerFromDisplayIndex(displayIndex);

                if (
                    e.button == BUTTON_PRIMARY &&
                    $(e.target).closest(".chickenpaint-layer-eye").length
                ) {
                    controller.actionPerformed({
                        action: "CPSetLayerVisibility",
                        layer: layer,
                        visible: !layer.visible,
                    });
                } else if (
                    e.button == BUTTON_PRIMARY &&
                    layer instanceof CPLayerGroup &&
                    $(e.target).closest("." + CLASSNAME_LAYER_GROUP_TOGGLE)
                        .length
                ) {
                    controller.actionPerformed({
                        action: "CPExpandLayerGroup",
                        group: layer,
                        expand: !layer.expanded,
                    });
                } else {
                    let layerChanged = artwork.getActiveLayer() != layer;

                    dropdownOnMask =
                        $(e.target).closest(
                            "." + CLASSNAME_LAYER_MASK_THUMBNAIL
                        ).length > 0 ||
                        (layer instanceof CPLayerGroup &&
                            layer.mask !== null &&
                            layerChanged);

                    if (
                        e.button == BUTTON_PRIMARY &&
                        e.shiftKey &&
                        !(e.ctrlKey || e.metaKey) &&
                        dropdownOnMask
                    ) {
                        controller.actionPerformed({
                            action: "CPSetMaskVisible",
                            layer: layer,
                            visible: !layer.maskVisible,
                        });
                    } else {
                        let selectMask, maskChanged;

                        if (e.button != BUTTON_PRIMARY && !layerChanged) {
                            /*
                             * Right clicking within the currently selected layer does not result in the mask/image selection
                             * moving (but it does change the type of dropdown menu we receive)
                             */
                            selectMask = artwork.isEditingMask();
                        } else {
                            selectMask = dropdownOnMask;
                        }

                        maskChanged = artwork.isEditingMask() != selectMask;

                        if (layerChanged || maskChanged) {
                            controller.actionPerformed({
                                action: "CPSetActiveLayer",
                                layer: layer,
                                mask: selectMask,
                            });
                        }

                        if (selectMask && e.altKey) {
                            controller.actionPerformed({
                                action: "CPToggleMaskView",
                            });
                        } else if (
                            selectMask &&
                            !e.shiftKey &&
                            (e.ctrlKey || e.metaKey)
                        ) {
                            controller.actionPerformed({
                                action: "CPApplyLayerMask",
                            });
                        } else if (
                            selectMask &&
                            e.shiftKey &&
                            (e.ctrlKey || e.metaKey)
                        ) {
                            controller.actionPerformed({
                                action: "CPRemoveLayerMask",
                            });
                        } else if (e.button == BUTTON_PRIMARY) {
                            if (
                                e.pointerType === "pen" ||
                                e.pointerType === "touch"
                            ) {
                                drag.state = DRAG_STATE_PRE_PAN;
                                drag.initialScrollTop =
                                    scrollContainer.scrollTop;

                                if (longPressTimer) {
                                    clearTimeout(longPressTimer);
                                }

                                longPressTimer = setTimeout(() => {
                                    if (drag.state === DRAG_STATE_PRE_PAN) {
                                        startLayerDrag();
                                        drag.dragY = e.clientY;
                                        updateDropMarker();
                                    }
                                }, LONG_PRESS_INTERVAL);
                            } else {
                                drag.state = DRAG_STATE_PRE_DRAG;
                            }

                            drag.dropTarget = null;

                            drag.layer = layer;
                            // We might have replaced the layer with a new element due to the CPSetActiveLayer, so fetch that again
                            drag.layerElem =
                                getElemFromDisplayIndex(displayIndex);
                            drag.dragX = e.clientX;
                            drag.dragY = e.clientY;

                            layerContainer.setPointerCapture(e.pointerId);

                            layerContainer.addEventListener(
                                "pointermove",
                                onPointerDragged
                            );
                            layerContainer.addEventListener(
                                "pointerup",
                                onPointerUp
                            );
                        } else if (
                            e.button == BUTTON_SECONDARY &&
                            !layerChanged
                        ) {
                            e.preventDefault();
                            showContextMenu(e);
                        }
                    }
                }
            }
        }

        function onPointerUp(e) {
            switch (drag.state) {
                case DRAG_STATE_DRAGGING:
                    $(drag.layerElem).removeClass(
                        "chickenpaint-layer-dragging"
                    );

                    if (drag.dropTarget) {
                        if (drag.dropTarget.direction == "inside") {
                            controller.actionPerformed({
                                action: "CPRelocateLayer",
                                layer: drag.layer,
                                toGroup: drag.dropTarget.layer,
                                toIndex: drag.dropTarget.layer.layers.length,
                            });
                        } else {
                            controller.actionPerformed({
                                action: "CPRelocateLayer",
                                layer: drag.layer,
                                toGroup: drag.dropTarget.layer.parent,
                                toIndex:
                                    drag.dropTarget.layer.parent.indexOf(
                                        drag.dropTarget.layer
                                    ) +
                                    (drag.dropTarget.direction == "over"
                                        ? 1
                                        : 0),
                            });
                        }
                    }

                    drag.dropTarget = null;
                    drag.state = DRAG_STATE_IDLE;

                    updateDropMarker();
                    break;

                default: // We didn't start the drag so there is no indicator to remove
                    drag.state = DRAG_STATE_IDLE;
                    break;
            }

            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            layerContainer.releasePointerCapture(e.pointerId);

            layerContainer.removeEventListener("pointermove", onPointerDragged);
            layerContainer.removeEventListener("pointerup", onPointerUp);
        }

        function startLayerDrag() {
            drag.state = DRAG_STATE_DRAGGING;

            drag.frameElem = document.createElement("div");
            drag.frameElem.className = "chickenpaint-layer-drag-frame";
            drag.frameElem.style.width =
                $(drag.layerElem).outerWidth(false) + "px";
            drag.frameElem.style.height =
                $(drag.layerElem).outerHeight(false) + "px";

            drag.dropBetweenMarkerElem = document.createElement("div");
            drag.dropBetweenMarkerElem.className =
                "chickenpaint-layer-drop-between-mark";

            drag.layerElem.className += " chickenpaint-layer-dragging";

            layerContainer.appendChild(drag.frameElem);
        }

        function onPointerDragged(e) {
            let newDragY = e.clientY;

            switch (drag.state) {
                case DRAG_STATE_PRE_PAN:
                    if (
                        Math.abs(newDragY - drag.dragY) >
                        LAYER_DRAG_START_THRESHOLD
                    ) {
                        drag.state = DRAG_STATE_PANNING;

                        // Fall through
                    } else {
                        break;
                    }

                case DRAG_STATE_PANNING:
                    scrollContainer.scrollTop =
                        drag.initialScrollTop + drag.dragY - newDragY;
                    break;

                case DRAG_STATE_PRE_DRAG:
                    if (
                        Math.abs(newDragY - drag.dragY) >
                        LAYER_DRAG_START_THRESHOLD
                    ) {
                        startLayerDrag();

                        // Fall through
                    } else {
                        break;
                    }

                case DRAG_STATE_DRAGGING:
                    drag.dragY = newDragY;
                    updateDropMarker();
                    break;
            }
        }

        /**
         * Rebuild all layer elements from the cached linearizedLayers list
         */
        this.buildLayers = function () {
            // Cache the details of the layer structure
            linearizedLayers = artwork
                .getLayersRoot()
                .getLinearizedLayerList(true);

            let layerElems = linearizedLayers.map((layer, index) =>
                    buildLayer(index, layer)
                ),
                layerFrag = document.createDocumentFragment();

            $(layerContainer).empty();

            for (let i = layerElems.length - 1; i >= 0; i--) {
                layerFrag.appendChild(layerElems[i]);
            }

            layerContainer.appendChild(layerFrag);

            updateDropMarker();
        };

        /**
         * The properties of the given layer have changed, rebuild it.
         *
         * @param {CPLayer} layer
         */
        this.layerChanged = function (layer) {
            let index = getDisplayIndexFromLayer(layer),
                layerElem = $(getElemFromDisplayIndex(index));

            if (
                layerElem.length === 0 ||
                (layer instanceof CPLayerGroup &&
                    (layer.expanded !=
                        $(layerElem).hasClass(CLASSNAME_LAYER_GROUP_EXPANDED) ||
                        layer.visible !=
                            $(layerElem).hasClass(CLASSNAME_LAYER_VISIBLE)))
            ) {
                // When these properties change, we might have to rebuild the group's children too, so just rebuild everything
                this.buildLayers();
            } else {
                layerElem.replaceWith(buildLayer(index, layer));
            }
        };

        function rebuildThumbnailForLayer(layerElem, layer, maskThumb) {
            try {
                if (maskThumb) {
                    $(
                        "." + CLASSNAME_LAYER_MASK_THUMBNAIL,
                        layerElem
                    ).replaceWith(createMaskThumb(layer));
                } else {
                    $(
                        "." + CLASSNAME_LAYER_IMAGE_THUMBNAIL,
                        layerElem
                    ).replaceWith(createImageThumb(layer));
                }
            } catch (e) {}
        }

        /**
         *
         * @param {number} rotation - 90 degree increments
         */
        this.setRotation90 = function (rotation) {
            if (imageRotation != rotation) {
                imageRotation = rotation;

                for (let i = 0; i < linearizedLayers.length; i++) {
                    let layer = linearizedLayers[i],
                        layerElem = $(getElemFromDisplayIndex(i));

                    if (layerElem.length > 0) {
                        rebuildThumbnailForLayer(layerElem, layer, false);

                        if (layer.mask) {
                            rebuildThumbnailForLayer(layerElem, layer, true);
                        }
                    }
                }
            }
        };

        /**
         * The thumbnail of the given layer has been updated.
         *
         * @param {CPImageLayer} layer
         */
        this.layerImageThumbChanged = function (layer) {
            let index = getDisplayIndexFromLayer(layer),
                layerElem = $(getElemFromDisplayIndex(index));

            if (layerElem.length > 0) {
                rebuildThumbnailForLayer(layerElem, layer, false);
            }
        };

        /**
         * The thumbnail of the given layer has been updated.
         *
         * @param {CPImageLayer} layer
         */
        this.layerMaskThumbChanged = function (layer) {
            let index = getDisplayIndexFromLayer(layer),
                layerElem = $(getElemFromDisplayIndex(index));

            if (layerElem.length > 0) {
                if (layer.mask) {
                    rebuildThumbnailForLayer(layerElem, layer, true);
                } else {
                    $("." + CLASSNAME_LAYER_MASK_THUMBNAIL, layerElem).remove();
                }
            }
        };

        /**
         * Call when the selected layer changes.
         *
         * @param {CPLayer} newLayer
         * @param {boolean} maskSelected
         */
        this.activeLayerChanged = function (newLayer, maskSelected) {
            $("." + CLASSNAME_LAYER_ACTIVE, layerContainer).removeClass(
                CLASSNAME_LAYER_ACTIVE
            );

            let layerElem = $(
                getElemFromDisplayIndex(getDisplayIndexFromLayer(newLayer))
            );

            layerElem.addClass(CLASSNAME_LAYER_ACTIVE);

            $("." + CLASSNAME_LAYER_IMAGE_THUMBNAIL, layerElem).toggleClass(
                "active",
                !maskSelected
            );
            $("." + CLASSNAME_LAYER_MASK_THUMBNAIL, layerElem).toggleClass(
                "active",
                maskSelected
            );
        };

        this.resize = function () {
            palette.dismissNotification();
            this.buildLayers();
        };

        this.getElement = function () {
            return widgetContainer;
        };

        /**
         * Scroll the layer widget until the layer with the given index is fully visible, and return
         * the element for that layer.
         *
         * @param {number} displayIndex
         */
        this.revealLayer = function (displayIndex) {
            let layerElem = getElemFromDisplayIndex(displayIndex),
                layerRect = layerElem.getBoundingClientRect(),
                containerRect = layerContainer.getBoundingClientRect();

            scrollContainer.scrollTop = Math.max(
                Math.min(
                    Math.max(
                        scrollContainer.scrollTop,
                        // Scroll down to reveal the bottom of the layer
                        scrollContainer.scrollTop +
                            layerRect.bottom -
                            containerRect.bottom
                    ),
                    scrollContainer.scrollTop +
                        layerRect.top -
                        containerRect.top
                ),
                0
            );

            return layerElem;
        };

        dropdownParent.id = "chickenpaint-layer-pop";

        widgetContainer.className = "chickenpaint-layers-widget";
        widgetContainer.addEventListener(
            "contextmenu",
            (e) => e.preventDefault(),
            true /* Capture phase, prevent context menu on all children */
        );

        //ドロップダウンメニュー関連項目のコメントアウト
        // dropdownLayerMenu.addEventListener("click", onDropdownActionClick);

        layerContainer.className = "list-group";
        layerContainer.addEventListener("dblclick", onDoubleClick);
        layerContainer.addEventListener("pointerdown", onPointerDown);

        layerContainer.setAttribute("touch-action", "none");

        for (let eventName of [
            "ontouchstart",
            "ontouchmove",
            "ontouchend",
            "ontouchcancel",
        ]) {
            layerContainer.addEventListener(eventName, absorbTouch);
        }

        widgetContainer.appendChild(layerContainer);
    }

    function updateAvailableBlendModes() {
        let activeLayer = artwork.getActiveLayer();

        while (blendCombo.lastChild) {
            blendCombo.removeChild(blendCombo.lastChild);
        }

        for (
            let blendMode = CPBlend.LM_FIRST;
            blendMode <= CPBlend.LM_LAST;
            blendMode++
        ) {
            if (
                blendMode != CPBlend.LM_MULTIPLY2 &&
                (blendMode == activeLayer.blendMode ||
                    (blendMode === CPBlend.LM_PASSTHROUGH &&
                        activeLayer instanceof CPLayerGroup) ||
                    blendMode <= CPBlend.LM_LAST_CHIBIPAINT)
            ) {
                let option = document.createElement("option");

                option.appendChild(
                    document.createTextNode(
                        _(CPBlend.BLEND_MODE_DISPLAY_NAMES[blendMode])
                    )
                );

                // Should we use the new LM_MULTIPLY2 blend mode in this spot instead of the legacy one?
                if (
                    blendMode === CPBlend.LM_MULTIPLY &&
                    activeLayer.blendMode !== blendMode &&
                    !activeLayer.useLegacyMultiply
                ) {
                    option.value = CPBlend.LM_MULTIPLY2;
                } else {
                    option.value = blendMode;
                }

                blendCombo.appendChild(option);
            }
        }
    }

    function createLayerActionButtons() {
        const buttons = [
                {
                    title: "Add layer",
                    icon: createFontAwesomeIcon("icon-file"),
                    action: "CPAddLayer",
                },
                {
                    title: "Add group",
                    icon: createFontAwesomeIcon("icon-folder"),
                    action: "CPAddGroup",
                },
                {
                    title: "Merge down",
                    icon: createFontAwesomeIcon("icon-download_FILL"),
                    action: "CPLayerMergeDown",
                    require: ["image-layer"],
                },
                {
                    title: "Merge group",
                    icon: createFontAwesomeIcon("icon-collapse_all_FILL"),
                    action: "CPGroupMerge",
                    require: ["layer-group"],
                },
                {
                    title: "Clip to the layer below",
                    icon: createFontAwesomeIcon(
                        "icon-level-down-alt fa-flip-horizontal"
                    ),
                    action: "CPCreateClippingMask",
                    require: "no-clipping-mask-or-is-group",
                },
                {
                    title: "Unclip from the layer below",
                    icon: createFontAwesomeIcon(
                        "icon-level-down-alt fa-flip-horizontal"
                    ),
                    action: "CPReleaseClippingMask",
                    require: "clipping-mask",
                },
                {
                    title: "Add layer mask",
                    icon: createChickenPaintIcon("mask"),
                    action: "CPAddLayerMask",
                    require: ["no-mask"],
                },
                {
                    title: "Apply mask",
                    icon: createChickenPaintIcon("mask"),
                    action: "CPApplyLayerMask",
                    require: ["mask"],
                },
                {
                    title: "Duplicate",
                    icon: createFontAwesomeIcon("icon-clone"),
                    action: "CPLayerDuplicate",
                },
                {
                    title: "Delete layer",
                    icon: createFontAwesomeIcon("icon-trash"),
                    action: "CPRemoveLayer",
                },
            ],
            layerButtonsList = document.createElement("ul");

        layerButtonsList.className = "chickenpaint-layer-buttons list-unstyled";

        for (let button of buttons) {
            let elem = document.createElement("li");

            elem.setAttribute("data-action", button.action);
            elem.className =
                "chickenpaint-small-toolbar-button " +
                (button.require
                    ? "chickenpaint-action-require-" + button.require
                    : "");
            elem.title = _(button.title);
            elem.appendChild(button.icon);
            elem.addEventListener("click", function () {
                controller.actionPerformed({ action: button.action });
            });

            layerButtonsList.appendChild(elem);
        }

        return layerButtonsList;
    }

    function updateActiveLayerActionButtons() {
        let activeLayer = artwork.getActiveLayer(),
            facts = computeLayerPredicates(activeLayer);

        for (let requirement of [
            "mask",
            "no-mask",
            "clipping-mask",
            "no-clipping-mask-or-is-group",
            "image-layer",
            "layer-group",
        ]) {
            let elements = layerActionButtons.getElementsByClassName(
                "chickenpaint-action-require-" + requirement
            );

            for (let element of elements) {
                element.style.display = facts[requirement]
                    ? "inline-block"
                    : "none";
            }
        }

        let actions = layerActionButtons.querySelectorAll("[data-action]");

        actions.forEach(function (element) {
            let action = element.getAttribute("data-action");
            element.classList.toggle(
                "disabled",
                !controller.isActionAllowed(action)
            );
        });
    }

    function updateActiveLayerControls() {
        let activeLayer = artwork.getActiveLayer();

        if (activeLayer.getAlpha() != alphaSlider.value) {
            alphaSlider.setValue(activeLayer.getAlpha());
        }

        updateAvailableBlendModes();

        if (activeLayer.getBlendMode() != parseInt(blendCombo.value, 10)) {
            blendCombo.value = activeLayer.getBlendMode();
        }

        if (activeLayer.getLockAlpha() != cbLockAlpha.checked) {
            cbLockAlpha.checked = activeLayer.getLockAlpha();
        }

        updateActiveLayerActionButtons();
    }

    /**
     * Called when a layer has been added/removed.
     */
    function onChangeStructure() {
        artwork = this;

        // Fetch and rebuild all layers
        layerWidget.resize();

        updateActiveLayerControls();
    }

    /**
     * Called when the properties of one layer has been updated and we should rebuild/repaint it.
     *
     * @param {CPLayer} layer
     */
    function onChangeLayer(layer) {
        artwork = this;

        palette.dismissNotification();
        layerWidget.layerChanged(layer);

        updateActiveLayerControls();
    }

    /**
     * Called when the thumbnail of one layer has been updated.
     *
     * @param {CPLayer} layer
     */
    function onChangeLayerImageThumb(layer) {
        artwork = this;

        layerWidget.layerImageThumbChanged(layer);
    }

    /**
     * Called when the thumbnail of one layer has been updated.
     *
     * @param {CPLayer} layer
     */
    function onChangeLayerMaskThumb(layer) {
        artwork = this;

        layerWidget.layerMaskThumbChanged(layer);
    }

    /**
     * Called when the selected layer changes.
     *
     * @param {CPLayer} oldLayer
     * @param {CPLayer} newLayer
     * @param {boolean} maskSelected
     */
    function onChangeActiveLayer(oldLayer, newLayer, maskSelected) {
        layerWidget.activeLayerChanged(newLayer, maskSelected);

        updateActiveLayerControls();
    }

    function CPRenameField() {
        let layer = null,
            origName = "",
            textBox = document.createElement("input"),
            that = this;

        this.hide = function () {
            layer = null;

            let parentNameElem = $(textBox).parent();

            if (parentNameElem) {
                $(textBox).remove();
                parentNameElem.text(origName);
            }
        };

        this.renameAndHide = function () {
            if (layer && layer.name != textBox.value) {
                controller.actionPerformed({
                    action: "CPSetLayerName",
                    layer: layer,
                    name: textBox.value,
                });
            }
            this.hide();
        };

        this.show = function (_layer, _layerElem) {
            layer = _layer;
            origName = layer.name;

            textBox.value = origName;

            var layerNameElem = _layerElem.querySelector(
                ".chickenpaint-layer-name"
            );
            if (layerNameElem) {
                // 親ノードから削除されている場合にのみ処理を実行
                if (layerNameElem.parentNode) {
                    // 現在の子ノードを取得
                    let currentChild = layerNameElem.firstChild;
                    // テキストノードが存在する場合にのみ削除
                    if (
                        currentChild &&
                        currentChild.nodeType === Node.TEXT_NODE
                    ) {
                        layerNameElem.removeChild(currentChild);
                        layerNameElem.appendChild(textBox);
                    }
                }
            }
            textBox.select();
        };
        textBox.type = "text";
        textBox.className = "chickenpaint-layer-rename form-control input-sm";

        textBox.addEventListener("keydown", function (e) {
            // Prevent other keyhandlers (CPCanvas) from getting their grubby hands on the input
            e.stopPropagation();
        });

        textBox.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                // Enter
                that.renameAndHide();
            }
            e.stopPropagation();
        });

        textBox.addEventListener("keyup", function (e) {
            if (e.key === "Escape") {
                // Escape
                that.hide();
            }
            e.stopPropagation();
        });

        textBox.addEventListener("blur", function (e) {
            if (layer) {
                that.renameAndHide();
            }
        });
    }

    let parentSetSize = this.setSize,
        parentSetWidth = this.setWidth,
        parentSetHeight = this.setHeight;

    this.setSize = function (w, h) {
        parentSetSize.call(this, w, h);

        this.dismissNotification();
        alphaSlider.resize();
    };

    this.setWidth = function (width) {
        parentSetWidth.call(this, width);
        alphaSlider.resize();
        layerWidget.resize();
    };

    this.setHeight = function (height) {
        parentSetHeight.call(this, height);

        layerWidget.resize();
    };

    /**
     * Set the rotation of the image thumbnails with respect to the underlying image data.
     *
     * @param {number} newRotation - 90 degree increments
     */
    this.setRotation90 = function (newRotation) {
        layerWidget.setRotation90(newRotation);
    };

    this.dismissNotification = function () {
        $(
            ".chickenpaint-layer[aria-describedby],.chickenpaint-slider[aria-describedby]",
            body
        ).each((index, elem) => {
            elem = $(elem);

            const popoverInstance = bootstrap.Popover.getInstance(elem[0]);

            if (popoverInstance) {
                popoverInstance.dispose();
            }
        });

        if (notificationDismissTimer) {
            clearTimeout(notificationDismissTimer);
            notificationDismissTimer = false;
        }
    };

    this.showNotification = (layer, message, where) => {
        let notificationLayerIndex = getDisplayIndexFromLayer(layer),
            target;

        if (artwork.getActiveLayer() == layer && where == "opacity") {
            target = alphaSlider.getElement();
        } else {
            target = layerWidget.revealLayer(notificationLayerIndex);
        }

        this.dismissNotification();

        const popoverInstance = new bootstrap.Popover(target, {
            html: false,
            content: message,
            placement: "left",
            trigger: "manual",
            fallbackPlacement: [],
            boundary: "window",
            container: palette.getElement(),
        });

        popoverInstance.show();

        notificationDismissTimer = setTimeout(() => {
            notificationDismissTimer = false;
            this.dismissNotification();
        }, Math.max(Math.round(message.length * NOTIFICATION_HIDE_DELAY_MS_PER_CHAR), NOTIFICATION_HIDE_DELAY_MIN));
    };

    blendCombo.className = "form-control form-control-sm";
    blendCombo.tabIndex = -1;

    blendCombo.title = _("Layer blending mode");
    blendCombo.addEventListener("change", function (e) {
        controller.actionPerformed({
            action: "CPSetLayerBlendMode",
            blendMode: parseInt(blendCombo.value, 10),
        });
        blendCombo.blur();
    });

    body.appendChild(blendCombo);

    alphaSlider.title = function (value) {
        return _("Opacity") + ": " + value + "%";
    };

    alphaSlider.on("valueChange", function (value) {
        controller.actionPerformed({ action: "CPSetLayerAlpha", alpha: value });
    });

    body.appendChild(alphaSlider.getElement());

    cbSampleAllLayers.id = "chickenpaint-chk-sample-all-layers";
    cbSampleAllLayers.type = "checkbox";
    cbSampleAllLayers.addEventListener("click", function (e) {
        artwork.setSampleAllLayers(cbSampleAllLayers.checked);
        document.activeElement.blur();
    });

    body.appendChild(
        wrapBootstrapCheckbox(cbSampleAllLayers, _("Sample all layers"))
    );

    cbLockAlpha.id = "chickenpaint-chk-lock-alpha";
    cbLockAlpha.type = "checkbox";
    cbLockAlpha.addEventListener("click", function (e) {
        controller.actionPerformed({
            action: "CPSetLayerLockAlpha",
            lock: cbLockAlpha.checked,
        });
        document.activeElement.blur();
    });

    body.appendChild(
        wrapBootstrapCheckbox(cbLockAlpha, _("Lock transparency"))
    );

    body.appendChild(layerWidget.getElement());

    layerActionButtons = createLayerActionButtons();
    body.appendChild(layerActionButtons);

    artwork.on("changeActiveLayer", onChangeActiveLayer);
    artwork.on("changeLayer", onChangeLayer);
    artwork.on("changeStructure", onChangeStructure);
    artwork.on("changeLayerMaskThumb", onChangeLayerMaskThumb);
    artwork.on("changeLayerImageThumb", onChangeLayerImageThumb);

    controller.on("layerNotification", this.showNotification.bind(this));

    // Set initial values
    onChangeStructure.call(artwork);
}

CPLayersPalette.prototype = Object.create(CPPalette.prototype);
CPLayersPalette.prototype.constructor = CPLayersPalette;
