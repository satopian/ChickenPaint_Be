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

import ChickenPaint from "../ChickenPaint.js";

import CPPalette from "./CPPalette.js";
import CPCheckbox from "./CPCheckbox.js";
import CPColorSwatch from "./CPColorSwatch.js";
import CPSlider from "./CPSlider.js";
import { createCheckerboardPattern } from "./CPGUIUtils.js";

import CPColorBmp from "../engine/CPColorBmp.js";

import CPColor from "../util/CPColor.js";

import key from "../../lib/keymaster.js";

import { _ } from "../languages/lang.js";

function sliderCheckboxGroup(checkbox, slider) {
    let group = document.createElement("div");

    group.className = "chickenpaint-checkbox-slider-group";

    group.appendChild(checkbox.getElement());
    group.appendChild(slider.getElement());

    return group;
}

function fillCombobox(combo, optionNames) {
    for (let key in optionNames) {
        if (optionNames.hasOwnProperty(key)) {
            let option = document.createElement("option");

            option.appendChild(document.createTextNode(_(optionNames[key])));
            option.value = key;

            combo.appendChild(option);
        }
    }
}

function CPGradientPreview(controller) {
    let w = 150,
        h = 32,
        canvas = document.createElement("canvas"),
        canvasContext = canvas.getContext("2d"),
        checkerboard = createCheckerboardPattern(canvasContext),
        image = new CPColorBmp(w, h),
        imageCanvas = document.createElement("canvas"),
        imageCanvasContext = imageCanvas.getContext("2d"),
        gradient = controller.getCurGradient();

    function paint() {
        image.gradient(image.getBounds(), 0, 0, image.width, 0, gradient, true);
        imageCanvasContext.putImageData(image.imageData, 0, 0, 0, 0, w, h);

        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(imageCanvas, 0, 0);
    }

    this.getElement = function () {
        return canvas;
    };

    controller.on("gradientChange", function (_gradient) {
        gradient = _gradient;

        paint();
    });

    canvas.width = imageCanvas.width = w;
    canvas.height = imageCanvas.height = h;

    canvas.className = "chickenpaint-gradient-preview";

    canvasContext.fillStyle = checkerboard;

    paint();
}

export default function CPBrushPalette(controller) {
    CPPalette.call(this, controller, "brush", "Tool options");

    let brushPanel = new CPBrushPanel(controller),
        gradientPanel = new CPGradientPanel(controller),
        transformPanel = new CPTransformPanel(controller),
        selectPanel = new CPSelectionPanel(controller),
        panPanel = new CPPanPanel(controller),
        floodFillPanel = new CPfloodFillPanel(controller),
        body = this.getBodyElement();

    //touchmoveイベントのデフォルトの動作をキャンセル
    body.addEventListener(
        "touchmove",
        (e) => {
            e.preventDefault(); // デフォルトの動作をキャンセル
        },
        { passive: false }
    );

    body.appendChild(brushPanel.getElement());
    body.appendChild(gradientPanel.getElement());
    body.appendChild(transformPanel.getElement());
    body.appendChild(selectPanel.getElement());
    body.appendChild(panPanel.getElement());
    body.appendChild(floodFillPanel.getElement());

    function hideAllPanels() {
        brushPanel.getElement().style.display = "none";
        gradientPanel.getElement().style.display = "none";
        transformPanel.getElement().style.display = "none";
        selectPanel.getElement().style.display = "none";
        panPanel.getElement().style.display = "none";
        floodFillPanel.getElement().style.display = "none";
    }
    let currentMode = null;
    function updatePanelByMode(mode) {
        hideAllPanels();
        const checkbox = selectPanel.getElement().querySelector(".form-check"); //

        if (checkbox) {
            checkbox.style.display = "none"; // 非表示にする
        }
        switch (mode) {
            case ChickenPaint.M_GRADIENTFILL:
                gradientPanel.getElement().style.display = "block";
                break;
            case ChickenPaint.M_TRANSFORM:
                transformPanel.getElement().style.display = "block";
                break;
            case ChickenPaint.M_RECT_SELECTION:
                selectPanel.getElement().style.display = "block";
                if (checkbox instanceof HTMLElement) {
                    checkbox.style.display = ""; // 表示する
                }
                break;
            case ChickenPaint.M_MOVE_TOOL:
                selectPanel.getElement().style.display = "block";
                break;
            case ChickenPaint.M_ROTATE_CANVAS:
            case ChickenPaint.M_PAN_CANVAS:
                panPanel.getElement().style.display = "block";
                break;
            case ChickenPaint.M_FLOODFILL:
                floodFillPanel.getElement().style.display = "block";
                if (checkbox instanceof HTMLElement) {
                    checkbox.style.display = ""; // 表示する
                }
                break;
            default:
                brushPanel.getElement().style.display = "block";
                break;
        }
    }
    controller.on("modeChange", function (mode) {
        currentMode = mode;
        updatePanelByMode(mode);
    });

    document.addEventListener("keydown", (e) => {
        if (
            e.key.toLocaleLowerCase() === "r" ||
            (!e.ctrlKey && e.key.toLocaleLowerCase() === "z") ||
            e.key === " "
        ) {
            hideAllPanels();
            panPanel.getElement().style.display = "block";
        }
    });
    document.addEventListener("keyup", (e) => {
        if (
            e.key.toLocaleLowerCase() === "r" ||
            e.key.toLocaleLowerCase() === "z" ||
            e.key === " "
        ) {
            hideAllPanels();
            updatePanelByMode(currentMode);
        }
    });
}

CPBrushPalette.prototype = Object.create(CPPalette.prototype);
CPBrushPalette.prototype.constructor = CPBrushPalette;

function CPBrushPanel(controller) {
    const TIP_NAMES = [
            "Round Pixelated",
            "Round Hard Edge",
            "Round Soft",
            "Square Pixelated",
            "Square Hard Edge",
        ],
        BRUSH_SIZES = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60,
            70, 80, 90, 100, 125, 150, 175, 200,
        ];

    let panel = document.createElement("div"),
        tipCombo = document.createElement("select"),
        alphaCB = new CPCheckbox(
            false,
            _("Control brush opacity with pen pressure")
        ),
        alphaSlider = new CPSlider(1, 255),
        sizeCB = new CPCheckbox(
            true,
            _("Control brush size with pen pressure")
        ),
        sizeSlider = new CPSlider(1, 200, false, true),
        scatteringCB = new CPCheckbox(
            false,
            _("Control brush scattering with pen pressure")
        ),
        scatteringSlider = new CPSlider(0, 1000, false, true),
        resatSlider = new CPSlider(0, 100, false, true),
        bleedSlider = new CPSlider(0, 100, false, true),
        spacingSlider = new CPSlider(0, 100, false, true),
        smoothingSlider = new CPSlider(0, 100, false, true),
        brushPreview = new CPBrushPalette.CPBrushPreview(controller);

    function fillWithInitialValues() {
        alphaCB.setValue(controller.getBrushInfo().pressureAlpha);
        alphaSlider.setValue(controller.getAlpha());

        sizeCB.setValue(controller.getBrushInfo().pressureSize);
        sizeSlider.setValue(controller.getBrushSize());

        scatteringCB.setValue(controller.getBrushInfo().pressureScattering);
        scatteringSlider.setValue(
            ~~(controller.getBrushInfo().scattering * 100)
        );

        tipCombo.value = controller.getBrushInfo().tip;

        resatSlider.setValue(~~(controller.getBrushInfo().resat * 100));
        bleedSlider.setValue(~~(controller.getBrushInfo().bleed * 100));
        spacingSlider.setValue(~~(controller.getBrushInfo().spacing * 100));
        smoothingSlider.setValue(~~(controller.getBrushInfo().smoothing * 100));
    }

    this.getElement = function () {
        return panel;
    };

    alphaSlider.title = function (value) {
        return _("Opacity") + ": " + value;
    };

    alphaSlider.on("valueChange", function (value) {
        controller.setAlpha(value);
    });

    sizeSlider.title = function (value) {
        return _("Brush size") + ": " + value;
    };

    sizeSlider.on("valueChange", function (value) {
        controller.setBrushSize(value);
    });

    resatSlider.title = function (value) {
        return _("Color") + ": " + value + "%";
    };

    resatSlider.on("valueChange", function (value) {
        controller.getBrushInfo().resat = value / 100.0;
        controller.callToolListeners();
    });

    bleedSlider.title = function (value) {
        return _("Blend") + ": " + value + "%";
    };

    bleedSlider.on("valueChange", function (value) {
        controller.getBrushInfo().bleed = value / 100.0;
        controller.callToolListeners();
    });

    spacingSlider.title = function (value) {
        return _("Spacing") + ": " + value + "%";
    };

    spacingSlider.on("valueChange", function (value) {
        controller.getBrushInfo().spacing = value / 100.0;
        controller.callToolListeners();
    });

    scatteringSlider.title = function (value) {
        return _("Scattering") + ": " + value + "%";
    };

    scatteringSlider.on("valueChange", function (value) {
        controller.getBrushInfo().scattering = value / 100.0;
        controller.callToolListeners();
    });

    smoothingSlider.title = function (value) {
        return _("Smoothing") + ": " + value + "%";
    };

    smoothingSlider.on("valueChange", function (value) {
        controller.getBrushInfo().smoothing = value / 100.0;
        controller.callToolListeners();
    });

    scatteringCB.on("valueChange", function (state) {
        controller.getBrushInfo().pressureScattering = state;
        controller.callToolListeners();
    });

    alphaCB.on("valueChange", function (state) {
        controller.getBrushInfo().pressureAlpha = state;
        controller.callToolListeners();
    });

    sizeCB.on("valueChange", function (state) {
        controller.getBrushInfo().pressureSize = state;
        controller.callToolListeners();
    });

    tipCombo.addEventListener("change", function (e) {
        controller.getBrushInfo().tip = parseInt(tipCombo.value, 10);
        tipCombo.blur();
    });
    // tipCombo.onfocus = ()=>{//フォーカスを検出したら
    // 	document.activeElement.blur();//フォーカスを外す

    // };

    tipCombo.className = "form-control form-control-sm";
    tipCombo.tabIndex = -1;

    fillCombobox(tipCombo, TIP_NAMES);

    panel.appendChild(tipCombo);

    panel.appendChild(brushPreview.getElement());

    panel.appendChild(sliderCheckboxGroup(sizeCB, sizeSlider));
    panel.appendChild(sliderCheckboxGroup(alphaCB, alphaSlider));
    panel.appendChild(resatSlider.getElement());
    panel.appendChild(bleedSlider.getElement());
    panel.appendChild(spacingSlider.getElement());
    panel.appendChild(sliderCheckboxGroup(scatteringCB, scatteringSlider));
    panel.appendChild(smoothingSlider.getElement());

    fillWithInitialValues();

    controller.on("toolChange", function (tool, toolInfo) {
        alphaSlider.setValue(toolInfo.alpha);
        sizeSlider.setValue(toolInfo.size);
        sizeCB.setValue(toolInfo.pressureSize);
        alphaCB.setValue(toolInfo.pressureAlpha);
        tipCombo.value = toolInfo.tip;
        scatteringCB.setValue(toolInfo.pressureScattering);

        if (~~(toolInfo.resat * 100.0) != resatSlider.value) {
            resatSlider.setValue(~~(toolInfo.resat * 100.0));
        }

        if (~~(toolInfo.bleed * 100.0) != bleedSlider.value) {
            bleedSlider.setValue(~~(toolInfo.bleed * 100.0));
        }

        if (~~(toolInfo.spacing * 100.0) != spacingSlider.value) {
            spacingSlider.setValue(~~(toolInfo.spacing * 100.0));
        }

        if (~~(toolInfo.scattering * 100.0) != scatteringSlider.value) {
            scatteringSlider.setValue(~~(toolInfo.scattering * 100.0));
        }

        if (~~(toolInfo.smoothing * 100.0) != smoothingSlider.value) {
            smoothingSlider.setValue(~~(toolInfo.smoothing * 100.0));
        }
    });

    key("1,2,3,4,5,6,7,8,9,0", function (event, handler) {
        let shortcut = parseInt(handler.shortcut, 10);

        if (shortcut == 0) {
            shortcut = 10;
        }

        controller.setAlpha(Math.round((shortcut / 10) * 255));
    });

    key("{,[", function () {
        let size = controller.getBrushSize();

        for (let i = BRUSH_SIZES.length - 1; i >= 0; i--) {
            if (size > BRUSH_SIZES[i]) {
                controller.setBrushSize(BRUSH_SIZES[i]);
                break;
            }
        }
    });

    key("},]", function () {
        let size = controller.getBrushSize();

        for (let i = 0; i < BRUSH_SIZES.length; i++) {
            if (size < BRUSH_SIZES[i]) {
                controller.setBrushSize(BRUSH_SIZES[i]);
                break;
            }
        }
    });
}

CPBrushPalette.CPBrushPreview = function (controller) {
    let size = 16,
        canvas = document.createElement("canvas"),
        canvasContext = canvas.getContext("2d"),
        mouseCaptured = false;

    function paint() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        canvasContext.beginPath();
        canvasContext.arc(
            canvas.width / 2,
            canvas.height / 2,
            (size / 2) * window.devicePixelRatio,
            0,
            Math.PI * 2
        );
        canvasContext.stroke();
    }

    function handlePointerDrag(e) {
        const rect = canvas.getBoundingClientRect();
        const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const x = pt.x - canvas.clientWidth / 2;
        const y = pt.y - canvas.clientHeight / 2;
        const newSize = Math.round(Math.sqrt(x * x + y * y) * 2);

        let size = Math.max(1, Math.min(200, newSize));

        paint();
        controller.setBrushSize(size);
    }

    function handlePointerUp(e) {
        if (mouseCaptured) {
            mouseCaptured = false;
            document.removeEventListener("pointerup", handlePointerUp, {
                capture: false,
            });
            document.removeEventListener("pointermove", handlePointerDrag, {
                capture: false,
            });
        }
    }

    canvas.addEventListener("pointerdown", function (e) {
        if (!mouseCaptured) {
            mouseCaptured = true;

            document.addEventListener("pointerup", handlePointerUp, {
                passive: true,
                capture: false,
            });
            document.addEventListener("pointermove", handlePointerDrag, {
                passive: true,
                capture: false,
            });

            handlePointerDrag(e);
        }
    });

    this.getElement = function () {
        return canvas;
    };

    controller.on("toolChange", function (tool, toolInfo) {
        if (toolInfo.size != size) {
            size = toolInfo.size;
            paint();
        }
    });

    canvas.width = 64;
    canvas.height = 64;

    if (window.devicePixelRatio > 1) {
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        canvas.width = canvas.width * window.devicePixelRatio;
        canvas.height = canvas.height * window.devicePixelRatio;
    }

    canvas.className = "chickenpaint-brush-preview";

    canvasContext.strokeStyle = "black";
    canvasContext.lineWidth = 1.0 * window.devicePixelRatio;

    paint();
};

function CPGradientPanel(controller) {
    const gradientPanel = document.createElement("div"),
        gradientPreview = new CPGradientPreview(controller),
        gradientStartSwatch = new CPColorSwatch(
            new CPColor(controller.getCurGradient()[0] & 0xffffff),
            controller.getCurGradient()[0] >>> 24,
            gradientPanel
        ),
        gradientEndSwatch = new CPColorSwatch(
            new CPColor(controller.getCurGradient()[1] & 0xffffff),
            controller.getCurGradient()[1] >>> 24,
            gradientPanel
        );

    function updateGradient() {
        const gradient = [
            (gradientStartSwatch.getAlpha() << 24) |
                gradientStartSwatch.getColorRgb(),
            (gradientEndSwatch.getAlpha() << 24) |
                gradientEndSwatch.getColorRgb(),
        ];

        controller.setCurGradient(gradient);
    }

    this.getElement = function () {
        return gradientPanel;
    };

    gradientPanel.className = "chickenpaint-gradient-panel";
    gradientPanel.style.display = "none";

    gradientStartSwatch.on("colorChange", updateGradient);
    gradientStartSwatch.on("alphaChange", updateGradient);
    gradientEndSwatch.on("colorChange", updateGradient);
    gradientEndSwatch.on("alphaChange", updateGradient);

    let title, colorsGroup, colorGroup;

    title = document.createElement("p");
    title.textContent = _("Gradient");

    gradientPanel.appendChild(title);
    gradientPanel.appendChild(gradientPreview.getElement());

    colorsGroup = document.createElement("div");
    colorsGroup.className = "chickenpaint-gradient-colors";

    colorGroup = document.createElement("div");
    colorGroup.className = "chickenpaint-gradient-start-color";

    colorGroup.appendChild(gradientStartSwatch.getElement());

    colorsGroup.appendChild(colorGroup);

    colorGroup = document.createElement("div");
    colorGroup.className = "chickenpaint-gradient-end-color";

    colorGroup.appendChild(gradientEndSwatch.getElement());

    colorsGroup.appendChild(colorGroup);

    gradientPanel.appendChild(colorsGroup);
}

// ボタンにアイコンを設定
// function setButtonIcon(button, iconClass) {
//     const text = button.textContent;
//     button.textContent = "";

//     // ボタンを flex に
//     button.classList.add(
//         "d-flex",
//         "align-items-center",
//         "justify-content-center"
//     );

//     let iconWidth = 0;

//     if (iconClass) {
//         const icon = document.createElement("span");
//         icon.className = `md-panel ${iconClass}`;
//         icon.style.flex = "0 0 auto"; // アイコンは縮まない
//         button.prepend(icon);

//         // アイコンとテキスト間のマージン
//         iconWidth = 0.2; // rem
//     }

//     // テキスト
//     const spanText = document.createElement("span");
//     spanText.textContent = text;
//     spanText.style.flex = "1 1 auto"; // 残りスペースを使って中央寄せ
//     spanText.style.textAlign = "center";

//     if (iconClass) {
//         spanText.style.marginLeft = `${iconWidth}rem`; // アイコン分スペースを確保
//     }

//     button.appendChild(spanText);
// }
// function setButtonIcon(button, iconClass) {
//     const text = button.textContent;
//     button.textContent = "";

//     // ボタンを相対位置 + flex に
//     button.classList.add(
//         "d-flex",
//         "align-items-center",
//         "justify-content-center",
//         "position-relative"
//     );

//     // アイコンを絶対配置で左端に追加
//     if (iconClass) {
//         const icon = document.createElement("span");
//         icon.className = `md-panel ${iconClass}`;
//         icon.style.position = "absolute";
//         icon.style.left = "0.35rem"; // 左端から0.35rem
//         icon.style.marginRight = "0"; // アイコン自体の余白は不要
//         button.appendChild(icon);
//     }

//     // テキスト用 span を中央に
//     const spanText = document.createElement("span");
//     spanText.textContent = text;
//     spanText.style.marginLeft = "1rem"; // 左のアイコン分の余白
//     button.appendChild(spanText);
// }
function setButtonIcon(button, iconClass) {
    const text = button.textContent;
    button.textContent = "";

    // ボタン自体を flex に
    button.classList.add(
        "d-flex",
        "align-items-center",
        "justify-content-center",
        "position-relative"
    );

    // 左端からの開始位置（パディング）を設定
    const startOffset = "0.35rem";
    button.style.paddingLeft = startOffset;

    if (iconClass) {
        const icon = document.createElement("span");
        icon.className = `md-panel ${iconClass}`;
        icon.style.flex = "0 0 auto"; // 縮まない
        icon.style.marginRight = "0"; // アイコンとテキストの間隔
        button.prepend(icon);
    }

    const spanText = document.createElement("span");
    spanText.textContent = text;
    spanText.style.flex = "1 1 auto"; // 残りスペースを使う
    spanText.style.textAlign = "center"; // 中央寄せ
    button.appendChild(spanText);
}

function CPTransformPanel(controller) {
    const TRANSFORM_INTERPOLATION = { smooth: _("Smooth"), sharp: _("Sharp") };

    let panel = document.createElement("div"),
        acceptButton = document.createElement("button"),
        rejectButton = document.createElement("button"),
        interpCombo = document.createElement("select");

    this.getElement = function () {
        return panel;
    };

    panel.className = "chickenpaint-transform-panel";
    panel.style.display = "none";

    acceptButton.type = "button";
    rejectButton.type = "button";

    acceptButton.className = "btn btn-primary btn-block";
    rejectButton.className = "btn btn-light btn-block";

    acceptButton.textContent = _("Apply transform");
    rejectButton.textContent = _("Cancel");

    setButtonIcon(acceptButton, "icon-md-circle");
    setButtonIcon(rejectButton, "icon-md-close");

    interpCombo.addEventListener("change", function (e) {
        controller.setTransformInterpolation(this.value);
    });

    interpCombo.className = "form-control chickenpaint-transform-interpolation";
    fillCombobox(interpCombo, TRANSFORM_INTERPOLATION);

    let interpGroup = document.createElement("div"),
        interpLabel = document.createElement("label");

    interpLabel.textContent = _("Transform style");

    interpGroup.className = "form-group";
    interpGroup.appendChild(interpLabel);
    interpGroup.appendChild(interpCombo);

    panel.appendChild(interpGroup);

    let buttonGroup = document.createElement("div");

    buttonGroup.appendChild(acceptButton);
    buttonGroup.appendChild(rejectButton);

    buttonGroup.className = "form-group";

    panel.appendChild(buttonGroup);

    let { wrapper: maintainAspectGroup, checkbox: maintainAspectCheckbox } =
        createBootstrapCheckbox(
            "chickenpaint-t-maintainAspectCheckbox",
            _("Constrain"),
            true
        );

    // パネルに追加
    panel.appendChild(maintainAspectGroup);

    acceptButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPTransformAccept" });
        e.preventDefault();
    });

    rejectButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPTransformReject" });
        e.preventDefault();
    });

    // ローカル変数から直接リスナーを追加
    maintainAspectCheckbox.addEventListener("change", () => {
        maintainAspectCheckbox.blur(); // フォーカス解除
    });
}
// 選択パネル
function CPSelectionPanel(controller) {
    let panel = document.createElement("div"),
        formGroup = document.createElement("div"),
        label = document.createElement("label"),
        selectAllButton = document.createElement("button"),
        deselectButton = document.createElement("button"),
        transformButton = document.createElement("button"); // 追加

    this.getElement = function () {
        return panel;
    };

    panel.className = "chickenpaint-selection-panel";
    panel.style.display = "none"; // 初期非表示
    formGroup.className = "form-group";

    // ラベルのみ使用
    label.textContent = _("Selection"); // 「選択範囲」
    formGroup.appendChild(label);

    // 「すべて選択」ボタン
    selectAllButton.type = "button";
    selectAllButton.className = "btn btn-light btn-block";
    selectAllButton.textContent = _("Fill");
    selectAllButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPFill" });
        e.preventDefault();
    });
    setButtonIcon(selectAllButton, "icon-md-ink_selection");
    formGroup.appendChild(selectAllButton);

    // 「選択解除」ボタン
    deselectButton.type = "button";
    deselectButton.className = "btn btn-light btn-block";
    deselectButton.textContent = _("Deselect");
    deselectButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPDeselectAll" });
        e.preventDefault();
    });
    setButtonIcon(deselectButton, "icon-md-deselect");
    formGroup.appendChild(deselectButton);

    // 「変形」ボタン

    transformButton.type = "button";
    transformButton.className = "btn btn-primary btn-block";
    transformButton.textContent = _("Transform");
    transformButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPTransform" });
        e.preventDefault();
    });
    setButtonIcon(transformButton, "icon-md-resize");
    formGroup.appendChild(transformButton);

    panel.appendChild(formGroup);

    //チェックボックスの作成
    let { wrapper: maintainAspectGroup, checkbox: maintainAspectCheckbox } =
        createBootstrapCheckbox(
            "chickenpaint-s-maintainAspectCheckbox",
            _("Constrain"),
            false
        );

    panel.appendChild(maintainAspectGroup);
    // パネルに追加

    // ローカル変数から直接リスナーを追加
    maintainAspectCheckbox.addEventListener("change", () => {
        maintainAspectCheckbox.blur(); // フォーカス解除
        controller.setMaintainAspectCheckbox(maintainAspectCheckbox.checked);
    });
}
//Bootstrapのチェックボックスを作成
function createBootstrapCheckbox(id, title, checked = false) {
    // チェックボックス作成
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.className = "form-check-input";
    checkbox.checked = checked;

    // フォーカス時の青枠を消す
    checkbox.style.outline = "none";
    checkbox.style.boxShadow = "none";
    //タブキーでのフォーカスを無効にする
    checkbox.tabIndex = -1;
    // ラベル作成
    const label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", id);
    label.textContent = title;

    // ラッパー div
    const wrapper = document.createElement("div");
    wrapper.className = "form-check";
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    // チェック状態取得用に input を返す場合は一緒に返す
    return { wrapper, checkbox };
}

function CPPanPanel(controller) {
    let panel = document.createElement("div");
    let formGroup = document.createElement("div");
    let label = document.createElement("label");
    let resetButton = document.createElement("button");

    let zoomSlider = new CPSlider(10, 800, false, true, 180, 3.13);
    let rotationSlider = new CPSlider(-180, 180, false, false, 180);

    panel.className = "chickenpaint-pan-panel";
    panel.style.display = "none"; // 初期非表示
    panel.appendChild(zoomSlider.getElement());

    formGroup.className = "form-group";

    // ラベルのみ使用
    label.textContent = _("Zoom and Rotate"); //「ズームと回転」
    formGroup.appendChild(label);
    formGroup.appendChild(label);
    panel.appendChild(formGroup);
    // 「表示を初期化」ボタン
    resetButton.type = "button";
    resetButton.className = "btn btn-primary btn-block";
    resetButton.style.outline = "none";

    resetButton.textContent = _("Reset View");
    resetButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPResetZoomAndRotation" });
        e.preventDefault();
    });
    setButtonIcon(resetButton, "icon-md-restart_alt");
    formGroup.appendChild(resetButton);
    panel.appendChild(formGroup);
    function fillWithInitialValues() {
        zoomSlider.setValue(controller.getZoom() * 100);
        rotationSlider.setValue(controller.getRotationDegrees());
    }

    zoomSlider.title = function (value) {
        return _("Zoom") + ": " + value + "%";
    };
    rotationSlider.title = function (value) {
        return _("Rotation") + ": " + value + "°";
    };

    zoomSlider.on("valueChange", function (value) {
        controller.zoomOnCenter(value / 100);
    });
    rotationSlider.on("valueChange", function (value) {
        controller.setRotationDegrees(value);
    });

    panel.appendChild(zoomSlider.getElement());
    panel.appendChild(rotationSlider.getElement());

    this.getElement = function () {
        return panel;
    };

    fillWithInitialValues();

    document.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault(); // これでスクロール抑制できる
            updateSliderDebounced();
        },
        { passive: false }
    );
    // デバウンス関数の定義
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    //スライダーを更新
    const updateSlider = () => {
        zoomSlider.setValue(controller.getZoom() * 100);
        rotationSlider.setValue(controller.getRotationDegrees());
    };

    // デバウンス関数を使用して、連続したイベントをまとめて処理
    const updateSliderDebounced = debounce(updateSlider, 12);

    const isZoomRotateEnabled = (e) => {
        return (
            controller.isPanOrRotateMode() ||
            key.isPressed("space") ||
            key.isPressed("r") ||
            key.isPressed("z")
        );
    };

    const isMainPaintCanvas = (el) => {
        return (
            el instanceof HTMLCanvasElement &&
            el.classList.contains("chickenpaint-canvas")
        );
    };

    let isPointerDown = false;

    document.addEventListener("pointerdown", (e) => {
        if (!isZoomRotateEnabled(e)) return;
        isPointerDown = true;
        if (!isMainPaintCanvas(e.target)) {
            return; // 描画キャンバス以外の時は処理しない
        }
        updateSliderDebounced();
    });

    document.addEventListener("pointermove", (e) => {
        if (!isPointerDown) return;
        if (!isZoomRotateEnabled(e)) return;
        if (!isMainPaintCanvas(e.target)) {
            return; // 描画キャンバス以外の時は処理しない
        }
        updateSliderDebounced();
    });

    document.addEventListener("pointerup", (e) => {
        isPointerDown = false;
        if (!isZoomRotateEnabled(e)) return;
        if (!isMainPaintCanvas(e.target)) {
            return; // 描画キャンバス以外の時は処理しない
        }
        updateSliderDebounced();
    });

    // キーボードでのサイズ変更
    //+-の時は連打を許可する
    key("=,-", function () {
        updateSliderDebounced();
    });

    let isFirstKeyPress = true;
    // キーボードでのサイズ変更
    //キーが押下された時に一度だけ更新する
    key("ctrl+0,alt+0,r,z,space,enter", function () {
        if (!isFirstKeyPress) return;
        isFirstKeyPress = false;
        updateSliderDebounced();
    });
    //キーが離されたときにフラグをリセット
    document.addEventListener("keyup", (e) => {
        isFirstKeyPress = true;
    });

    //パンや回転ツールのアイコンがクリックされたときにスライダーを更新
    document.addEventListener("click", (e) => {
        if (
            e.target instanceof HTMLElement &&
            !(e.target instanceof HTMLCanvasElement)
        ) {
            updateSliderDebounced();
        }
    });
}
function CPfloodFillPanel(controller) {
    let panel = document.createElement("div");
    let formGroup = document.createElement("div");
    let label = document.createElement("label");

    let growSlider = new CPSlider(0, 5, false, false, 180);
    let alphaSlider = new CPSlider(1, 255, false, false, 180);

    panel.className = "chickenpaint-floodFill-panel";
    panel.style.display = "none"; // 初期非表示
    panel.appendChild(growSlider.getElement());

    formGroup.className = "form-group";

    // ラベルのみ使用
    label.textContent = _("Flood fill"); //「バケツ塗り」
    formGroup.appendChild(label);
    panel.appendChild(formGroup);

    function fillWithInitialValues() {
        growSlider.setValue(2);
        alphaSlider.setValue(255);
    }

    growSlider.title = function (value) {
        return _("Grow fill area") + ": " + value;
    };
    alphaSlider.title = function (value) {
        return _("Opacity") + ": " + value;
    };

    growSlider.on("valueChange", function (value) {
        controller.growFillArea(value);
    });
    alphaSlider.on("valueChange", function (value) {
        controller.setFoodFillAlpha(value);
    });

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "form-group"; // ラップ用

    sliderWrapper.appendChild(growSlider.getElement());
    sliderWrapper.appendChild(alphaSlider.getElement());

    panel.appendChild(sliderWrapper);
    //チェックボックスの作成
    let { wrapper: sampleAllLayersGroup, checkbox: sampleAllLayersCheckbox } =
        createBootstrapCheckbox(
            "chickenpaint-floodFillSampleAllLayersCheckbox",
            _("Refer all layers"),
            true
        );
    sampleAllLayersGroup.classList.add("mb-1");
    panel.appendChild(sampleAllLayersGroup);
    // パネルに追加

    // ローカル変数から直接リスナーを追加
    sampleAllLayersCheckbox.addEventListener("change", () => {
        sampleAllLayersCheckbox.blur(); // フォーカス解除
        controller.setFloodFillSampleAllLayers(sampleAllLayersCheckbox.checked);
    });

    this.getElement = function () {
        return panel;
    };

    fillWithInitialValues();
}
