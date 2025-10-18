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

import key from "../../lib/keymaster.js";
import { _ } from "../languages/lang.js";

const MENU_ENTRIES = [
    {
        name: "File",
        mnemonic: "F",
        children: [
            {
                name: "Save to my computer",
                action: "CPSave",
                mnemonic: "S",
                shortcut: "ctrl+s",
            },
            {
                name: "Save Oekaki",
                action: "CPSend",
                mnemonic: "S",
                shortcut: "ctrl+s",
            },
        ],
    },
    {
        name: "Edit",
        mnemonic: "E",
        children: [
            {
                name: "Undo",
                action: "CPUndo",
                mnemonic: "U",
                shortcut: "ctrl+z",
            },
            {
                name: "Redo",
                action: "CPRedo",
                mnemonic: "R",
                shortcut: "ctrl+y",
            },
            {
                name: "Clear history",
                action: "CPClearHistory",
                mnemonic: "H",
                title: _("Removes all undo/redo information to regain memory"),
            },
            {
                name: "-",
            },
            {
                name: "Cut",
                action: "CPCut",
                mnemonic: "T",
                shortcut: "ctrl+x",
            },
            {
                name: "Copy",
                action: "CPCopy",
                mnemonic: "C",
                shortcut: "ctrl+c",
            },
            {
                name: "Copy merged",
                action: "CPCopyMerged",
                mnemonic: "Y",
                shortcut: "shift+ctrl+c",
            },
            {
                name: "Paste",
                action: "CPPaste",
                mnemonic: "P",
                shortcut: "ctrl+v",
            },
            {
                name: "-",
            },
            {
                name: "Select all",
                action: "CPSelectAll",
                mnemonic: "A",
                shortcut: "ctrl+a",
            },
            {
                name: "Deselect",
                action: "CPDeselectAll",
                mnemonic: "D",
                shortcut: "ctrl+d",
            },
            {
                name: "-",
            },
            {
                name: "Transform",
                action: "CPTransform",
                mnemonic: "T",
                shortcut: "ctrl+h",
            },
        ],
    },
    {
        name: "Layers",
        mnemonic: "L",
        children: [
            {
                name: "Duplicate",
                action: "CPLayerDuplicate",
                mnemonic: "D",
                shortcut: "shift+ctrl+d",
            },
            {
                name: "-",
            },
            {
                name: "Merge down",
                action: "CPLayerMergeDown",
                mnemonic: "E",
                shortcut: "ctrl+e",
            },
            {
                name: "Merge group",
                action: "CPGroupMerge",
                mnemonic: "G",
                shortcut: "shift+ctrl+g",
            },
            {
                name: "Merge all layers",
                action: "CPLayerMergeAll",
                shortcut: "shift+ctrl+e",
                mnemonic: "A",
            },
            {
                name: "Create merged layer",
                action: "CPCreateMergedLayer",
                shortcut: "shift+alt+e",
            },
            {
                name: "-",
            },
            {
                hideIfNotAvailable: true,
                name: "Add layer mask",
                action: "CPAddLayerMask",
            },
            {
                hideIfNotAvailable: true,
                name: "Delete layer mask",
                action: "CPRemoveLayerMask",
                shortcut: "shift+m",
            },
            {
                hideIfNotAvailable: true,
                name: "Apply layer mask",
                action: "CPApplyLayerMask",
                shortcut: "ctrl+m",
            },
            {
                name: "-",
            },
            {
                hideIfNotAvailable: true,
                name: "Clip to the layer below",
                action: "CPCreateClippingMask",
            },
            {
                hideIfNotAvailable: true,
                name: "Unclip from the layer below",
                action: "CPReleaseClippingMask",
            },
        ],
    },
    {
        name: "Effects",
        mnemonic: "E",
        children: [
            {
                name: "Clear",
                action: "CPClear",
                mnemonic: "D",
                shortcut: "del,backspace",
            },
            {
                name: "Clear with texture",
                action: "CPClearWithTexture",
                mnemonic: "T",
                shortcut: "shift+x",
            },
            {
                name: "Fill",
                action: "CPFill",
                mnemonic: "F",
                shortcut: "ctrl+f",
            },
            {
                name: "Flip horizontal",
                action: "CPHFlip",
                mnemonic: "Q",
                shortcut: "q",
            },
            {
                name: "Flip vertical",
                action: "CPVFlip",
                mnemonic: "V",
            },
            {
                name: "Invert",
                action: "CPFXInvert",
                mnemonic: "I",
                shortcut: "ctrl+i",
                title: _("Invert the image colors"),
            },
            {
                name: "-",
            },
            {
                name: "Convert brightness to opacity",
                action: "CPBrightnessToOpacity",
                mnemonic: "B",
                title: _("Convert brightness to opacity"),
            },
            {
                name: "-",
            },
            {
                name: "Box blur...",
                action: "CPFXBoxBlur",
                mnemonic: "B",
            },
            {
                name: "Chromatic aberration",
                action: "CPChromaticAberration",
                mnemonic: "C",
            },
            {
                name: "-",
            },
            {
                name: "Monochromatic noise",
                action: "CPMNoise",
                mnemonic: "M",
                title: _("Fills the selection with noise"),
            },
            {
                name: "Color noise",
                action: "CPCNoise",
                mnemonic: "C",
                title: _("Fills the selection with colored noise"),
            },
        ],
    },
    {
        name: "View",
        mnemonic: "V",
        children: [
            {
                name: "Full-screen mode",
                action: "CPFullScreen",
                mnemonic: "F",
                checkbox: true,
                checked: false,
            },
            {
                name: "-",
            },
            {
                name: "Zoom in",
                action: "CPZoomIn",
                mnemonic: "I",
                shortcut: "=",
            },
            {
                name: "Zoom out",
                action: "CPZoomOut",
                mnemonic: "O",
                shortcut: "-",
            },
            {
                name: "Zoom 100%",
                action: "CPZoom100",
                mnemonic: "1",
                shortcut: "ctrl+0",
            },
            {
                name: "-",
            },
            {
                name: "Reset Rotation",
                action: "CPResetCanvasRotation",
                mnemonic: "R",
                shortcut: "alt+0",
            },
            {
                name: "-",
            },
            {
                name: "Flip View Horizontal",
                action: "CPViewHFlip",
                mnemonic: "H",
                shortcut: "h",
            },
            {
                name: "-",
            },
            {
                name: "Smooth-out zoomed canvas",
                action: "CPLinearInterpolation",
                mnemonic: "L",
                title: _(
                    "Linear interpolation is used to give a smoothed looked to the picture when zoomed in"
                ),
                checkbox: true,
                checked: true, //初期状態でズームのアンチエイリアスをOnに
            },
            {
                name: "-",
            },
            {
                name: "Show grid",
                action: "CPToggleGrid",
                mnemonic: "G",
                shortcut: "ctrl+g",
                checkbox: true,
                checked: false,
            },
            {
                name: "Grid options...",
                action: "CPGridOptions",
                mnemonic: "D",
            },
        ],
    },
    {
        name: "Palettes",
        mnemonic: "P",
        children: [
            {
                name: "Rearrange",
                action: "CPArrangePalettes",
                title: _("Rearrange the palette windows"),
            },
            {
                name: "Toggle palettes",
                action: "CPTogglePalettes",
                mnemonic: "P",
                shortcut: "tab",
                title: _("Hides or shows all palettes"),
            },
            {
                name: "-",
            },
            {
                name: "Mobile mode",
                action: "CPToggleSetSmallScreenMode",
            },
            {
                name: "-",
            },
            {
                name: "Show tools",
                action: "CPPalTool",
                mnemonic: "T",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show color",
                action: "CPPalColor",
                mnemonic: "C",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show stroke",
                action: "CPPalStroke",
                mnemonic: "S",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show misc",
                action: "CPPalMisc",
                mnemonic: "M",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show swatches",
                action: "CPPalSwatches",
                mnemonic: "W",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show textures",
                action: "CPPalTextures",
                mnemonic: "X",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show tool options",
                action: "CPPalBrush",
                mnemonic: "B",
                checkbox: true,
                checked: true,
            },
            {
                name: "Show layers",
                action: "CPPalLayers",
                mnemonic: "L",
                checkbox: true,
                checked: true,
            },
        ],
    },
    {
        name: "Help",
        mnemonic: "H",
        children: [
            {
                name: "Tablet support",
                mnemonic: "T",
                action: "CPTabletSupport",
            },
            {
                name: "Shortcuts",
                mnemonic: "S",
                action: "CPShortcuts",
            },
            {
                name: "-",
            },
            {
                name: "About",
                mnemonic: "A",
                action: "CPAbout",
            },
        ],
    },
];

export default function CPMainMenu(controller, mainGUI) {
    const bar = document.createElement("nav");
    bar.className = "navbar navbar-expand-md bg-light";
    bar.innerHTML = `
    <div class="navbar-upper">
      <a class="navbar-brand" href="#">ChickenPaint Be</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#chickenpaint-main-menu-content" aria-controls="chickenpaint-main-menu-content" aria-expanded="false" aria-label="Toggle main menu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <div class="collapse navbar-collapse" id="chickenpaint-main-menu-content">
      <div class="navbar-nav"></div>
    </div>
    <div class="widget-nav" id="chickenpaint-palette-toggler-content"></div>
  `;

    const macPlatform = navigator.userAgent.toLowerCase().includes("mac os");

    bar.addEventListener("touchmove", (e) => e.preventDefault(), {
        passive: false,
    });

    function menuItemClicked(target) {
        const action = target.dataset.action;
        const checkbox = target.dataset.checkbox === "true";
        let selected;

        if (controller.isActionAllowed(action)) {
            if (checkbox) {
                target.classList.toggle("selected");
                selected = target.classList.contains("selected");
            } else {
                selected = false;
            }

            controller.actionPerformed({ action, checkbox, selected });
        }
    }

    function presentShortcutText(shortcut) {
        shortcut = shortcut
            .toUpperCase()
            .replace(/(,.+)$/, "")
            .replace("=", "+");
        return macPlatform
            ? shortcut.replace(/([^+])\+/g, "$1")
            : shortcut.replace(/([^+])\+/g, "$1 ");
    }

    function updateMenuStates(menuElem) {
        menuElem.querySelectorAll("[data-action]").forEach((elem) => {
            const action = elem.dataset.action;
            const allowed = controller.isActionAllowed(action);
            elem.classList.toggle("disabled", !allowed);
            if (elem.dataset.hideIfNotAvailable === "true") {
                elem.classList.toggle("hidden", !allowed);
            }
        });

        menuElem
            .querySelectorAll(".dropdown-divider")
            .forEach((div) => div.classList.remove("hidden"));

        const visible = Array.from(
            menuElem.querySelectorAll(
                ".dropdown-item:not(.hidden), .dropdown-divider:not(.hidden)"
            )
        );
        let lastDivider = null;

        visible.forEach((el, i) => {
            if (el.classList.contains("dropdown-divider")) {
                if (i === 0 || lastDivider) el.classList.add("hidden");
                else lastDivider = el;
            } else {
                lastDivider = null;
            }
        });
        if (lastDivider) lastDivider.classList.add("hidden");
    }

    function fillMenu(menuElem, entries) {
        entries.forEach((topEntry) => {
            const div = document.createElement("div");
            div.className = "nav-item dropdown";
            div.innerHTML = `
        <a href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${_(
            topEntry.name
        )}</a>
        <ul class="dropdown-menu"></ul>
      `;

            const dropdownMenu = div.querySelector(".dropdown-menu");

            // ドロップダウンメニューのフォーカスを外す
            // 変形操作で↓キーを押下時にメニューが開くのを防止
            function blurIfDropdownFocused() {
                setTimeout(() => {
                    const activeEl = document.activeElement;
                    if (
                        activeEl instanceof HTMLElement &&
                        (activeEl.matches('[data-bs-toggle="dropdown"]') ||
                            activeEl.matches(".dropdown-item") ||
                            activeEl.closest(".dropdown-menu"))
                    ) {
                        activeEl.blur();
                    }
                }, 10);
            }
            div.querySelector(".dropdown-toggle")?.addEventListener(
                "show.bs.dropdown",
                () => {
                    // ドロップダウンメニューのフォーカスを外す
                    // 変形操作で↓キーを押下時にメニューが開くのを防止
                    blurIfDropdownFocused();
                    updateMenuStates(div);
                }
            );

            div.querySelector(".dropdown-toggle")?.addEventListener(
                "hide.bs.dropdown",
                () => {
                    // ドロップダウンメニューのフォーカスを外す
                    // 変形操作で↓キーを押下時にメニューが開くのを防止
                    blurIfDropdownFocused();
                }
            );

            topEntry.children.forEach((entry) => {
                if (entry.name === "-") {
                    // 区切り線の場合は直接処理
                    const entryElem = document.createElement("hr");
                    entryElem.className = "dropdown-divider";
                    dropdownMenu?.appendChild(entryElem);
                    return; // この後の処理は不要なので、次のエントリに進む
                }

                if (
                    !entry.action ||
                    !controller.isActionSupported(entry.action)
                )
                    return;

                if (
                    entry.action === "CPSend" &&
                    !controller.isActionSupported("CPContinue")
                ) {
                    entry.name = _("Post Oekaki");
                    entry.shortcut = "ctrl+p";
                }

                let entryElem;
                entryElem = document.createElement("a");
                entryElem.className = "dropdown-item";
                entryElem.href = "#";
                entryElem.dataset.action = entry.action;
                entryElem.innerHTML = `<span>${_(entry.name)}</span>`;

                if (entry.checkbox) {
                    entryElem.dataset.checkbox = "true";
                    if (entry.checked) entryElem.classList.add("selected");
                }
                if (entry.hideIfNotAvailable) {
                    entryElem.dataset.hideIfNotAvailable = "true";
                }
                if (entry.title) {
                    entryElem.title = _(entry.title);
                }
                if (entry.shortcut) {
                    if (macPlatform) {
                        entry.shortcut = entry.shortcut
                            .replace(/SHIFT/im, "⇧")
                            .replace(/ALT/im, "⌥")
                            .replace(/CTRL/im, "⌘");
                    }
                    const small = document.createElement("small");
                    small.className = "chickenpaint-shortcut";
                    small.textContent = presentShortcutText(entry.shortcut);
                    entryElem.appendChild(small);
                    key(entry.shortcut, (e) => {
                        menuItemClicked(entryElem);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                }

                const li = document.createElement("li");
                li.appendChild(entryElem);
                dropdownMenu.appendChild(li);
            });
            menuElem.appendChild(div);
        });
    }

    function fillWidgetTray(menuElem, entries) {
         const mobileEntry = entries.find(e => e.action === "CPToggleSetSmallScreenMode");
        entries
            .filter((e) => e.mnemonic && controller.isActionSupported(e.action))
            .forEach((entry) => {
                const btn = document.createElement("button");
                btn.className = "widget-toggler selected";
                btn.type = "button";
                btn.dataset.action = entry.action;
                btn.dataset.checkbox = "true";
                btn.dataset.selected = (!entry.checked).toString();
                btn.innerHTML = `<span>${entry.mnemonic}</span>`;

                btn.addEventListener("click", (e) => {
                    menuItemClicked(btn);
                    e.preventDefault();
                });

                menuElem.appendChild(btn);
            });
    if (mobileEntry) {
        const smallScreenMode = controller.getSmallScreenMode()
        const mobileBtn = document.createElement("button");
        mobileBtn.className = "widget-toggler mobile selected";
        mobileBtn.dataset.checkbox = "true";
        mobileBtn.type = "button";
        mobileBtn.dataset.selected = "true";
        mobileBtn.style.minWidth = "110px";

        // CPPaletteManagerでも同様の変更
        if (smallScreenMode) {
        mobileBtn.innerHTML = `<span>${_("PC mode")}</span>`;
        } else {
        mobileBtn.innerHTML = `<span>${_("Mobile mode")}</span>`;
        }
        mobileBtn.dataset.action = mobileEntry.action;

        mobileBtn.addEventListener("click", (e) => {
            menuItemClicked(mobileBtn);
            e.preventDefault();
        });

        menuElem.appendChild(mobileBtn);
    }
    }

    bar.addEventListener("click", (e) => {
        const target = e.target.closest("a:not(.dropdown-toggle)");
        if (target) {
            menuItemClicked(target);
            e.preventDefault();
        }
    });

    /**
     * 指定されたパレットの表示状態に応じて、対応するトグルボタンやメニュー項目の
     * "selected" クラスの付け外しを行う。
     *
     * @param {string} paletteName - パレット名（例: "Tool", "Color"など）
     * @param {boolean} show - パレットが表示されている場合は true、非表示の場合は false
     *
     * ボタンは #chickenpaint-palette-toggler-content 内の[data-action=CPPalXxx]要素を対象とし、
     * メニュー項目は bar 要素内の[data-action=CPPalXxx]要素を対象とする。
     * これらをまとめて処理し、"selected" クラスを適切に切り替える。
     */
    function onPaletteVisChange(paletteName, show) {
        const key =
            "CPPal" +
            paletteName.charAt(0).toUpperCase() +
            paletteName.slice(1);

        const palette_toggler_content = document.getElementById(
            "chickenpaint-palette-toggler-content"
        ); //'button'

        const buttons =
            palette_toggler_content?.querySelectorAll(
                `[data-action="${key}"]`
            ) || [];
        const menus = bar?.querySelectorAll(`[data-action="${key}"]`) || [];
        // 両方を一つにまとめて処理
        [...buttons, ...menus].forEach((element) => {
            element.classList.toggle("selected", show);
        });
    }

    fillMenu(bar.querySelector(".navbar-nav"), MENU_ENTRIES);
    fillWidgetTray(bar.querySelector(".widget-nav"), MENU_ENTRIES[5].children);

    mainGUI.getPaletteManager().on("paletteVisChange", onPaletteVisChange);

    const fullScreenToggle = bar.querySelector(
        ".dropdown-item[data-action=CPFullScreen]"
    );
    controller.on("fullScreen", (isFS) =>
        fullScreenToggle?.classList.toggle("selected", isFS)
    );
    fullScreenToggle?.classList.toggle("selected", controller.isFullScreen());

    this.getElement = () => bar;
}
