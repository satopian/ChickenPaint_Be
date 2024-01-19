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
import key from "../../lib/keymaster.js";
import {_} from "../languages/lang.js";

const
    MENU_ENTRIES = [
        {
            name: "File",
            mnemonic: "F",
            children: [
                {
                    name: "Save to my computer",
                    action: "CPSave",
                    mnemonic: "S",
                    shortcut: "ctrl+s"
                },
                {
                    name: "Save Oekaki",
                    action: "CPSend",
                    mnemonic: "S",
                    shortcut: "ctrl+s"
                }
            ]
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
                    shortcut: "shift+ctrl+z",
                },
                {
                    name: "Clear history",
                    action: "CPClearHistory",
                    mnemonic: "H",
                    title: _("Removes all undo/redo information to regain memory")
                },
                {
                    name: "-"
                },
                {
                    name: "Cut",
                    action: "CPCut",
                    mnemonic: "T",
                    shortcut: "ctrl+x"
                },
                {
                    name: "Copy",
                    action: "CPCopy",
                    mnemonic: "C",
                    shortcut: "ctrl+c"
                },
                {
                    name: "Copy merged",
                    action: "CPCopyMerged",
                    mnemonic: "Y",
                    shortcut: "shift+ctrl+c"
                },
                {
                    name: "Paste",
                    action: "CPPaste",
                    mnemonic: "P",
                    shortcut: "ctrl+v"
                },
                {
                    name: "-"
                },
                {
                    name: "Select all",
                    action: "CPSelectAll",
                    mnemonic: "A",
                    shortcut: "ctrl+a"
                },
                {
                    name: "Deselect",
                    action: "CPDeselectAll",
                    mnemonic: "D",
                    shortcut: "ctrl+d"
                },
                {
                    name: "-"
                },
                {
                    name: "Transform",
                    action: "CPTransform",
                    mnemonic: "T",
                    shortcut: "ctrl+y"
                }
            ]
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
                    name: "-"
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
                    name: "-"
                },
                {
                    hideIfNotAvailable: true,
                    name: "Add layer mask",
                    action: "CPAddLayerMask"
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
                    name: "-"
                },
                {
                    hideIfNotAvailable: true,
                    name: "Clip to the layer below",
                    action: "CPCreateClippingMask"
                },
                {
                    hideIfNotAvailable: true,
                    name: "Unclip from the layer below",
                    action: "CPReleaseClippingMask"
                }
            ]
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
                    name: "Fill",
                    action: "CPFill",
                    mnemonic: "F",
                    shortcut: "ctrl+f",
                },
                {
                    name: "Flip horizontal",
                    action: "CPHFlip",
                    mnemonic: "H",
                    shortcut: "h",
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
                    title: _("Invert the image colors")
                },
                {
                    name: "-"
                },
                {
                    name: "Box blur...",
                    action: "CPFXBoxBlur",
                    mnemonic: "B",
                },
                {
                    name: "-"
                },
                {
                    name: "Monochromatic noise",
                    action: "CPMNoise",
                    mnemonic: "M",
                    title: _("Fills the selection with noise")
                },
                {
                    name: "Color noise",
                    action: "CPCNoise",
                    mnemonic: "C",
                    title: _("Fills the selection with colored noise")
                }
            ]
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
                    checked: false
                },
                {
                    name: "-"
                },
                {
                    name: "Zoom in",
                    action: "CPZoomIn",
                    mnemonic: "I",
                    shortcut: "ctrl+=",
                },
                {
                    name: "Zoom out",
                    action: "CPZoomOut",
                    mnemonic: "O",
                    shortcut: "ctrl+-",
                },
                {
                    name: "Zoom 100%",
                    action: "CPZoom100",
                    mnemonic: "1",
                    shortcut: "ctrl+0",
                },
                {
                    action: "CPLinearInterpolation",
                    name: "-"
                },
                {
                    name: "Smooth-out zoomed canvas",
                    action: "CPLinearInterpolation",
                    mnemonic: "L",
                    title: _("Linear interpolation is used to give a smoothed looked to the picture when zoomed in"),
                    checkbox: true,
					checked: true //初期状態でズームのアンチエイリアスをOnに
                },
                {
                    name: "-"
                },
                {
                    name: "Show grid",
                    action: "CPToggleGrid",
                    mnemonic: "G",
                    shortcut: "ctrl+g",
                    checkbox: true,
                    checked: false
                },
                {
                    name: "Grid options...",
                    action: "CPGridOptions",
                    mnemonic: "D",
                }
            ]
        },
        {
            name: "Palettes",
            mnemonic: "P",
            children: [
                {
                    name: "Rearrange",
                    action: "CPArrangePalettes",
                    title: _("Rearrange the palette windows")
                },
                {
                    name: "Toggle palettes",
                    action: "CPTogglePalettes",
                    mnemonic: "P",
                    shortcut: "tab",
                    title: _("Hides or shows all palettes")
                },
                {
                    name: "Use old icons",
                    action: "CPToolbarStyle",
                    checkbox: true,
                    checked: false
                },
                {
                    name: "-"
                },
                {
                    name: "Show tools",
                    action: "CPPalTool",
                    mnemonic: "T",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show color",
                    action: "CPPalColor",
                    mnemonic: "C",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show stroke",
                    action: "CPPalStroke",
                    mnemonic: "S",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show misc",
                    action: "CPPalMisc",
                    mnemonic: "M",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show swatches",
                    action: "CPPalSwatches",
                    mnemonic: "W",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show textures",
                    action: "CPPalTextures",
                    mnemonic: "X",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show tool options",
                    action: "CPPalBrush",
                    mnemonic: "B",
                    checkbox: true,
                    checked: true
                },
                {
                    name: "Show layers",
                    action: "CPPalLayers",
                    mnemonic: "L",
                    checkbox: true,
                    checked: true
                }
            ]
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
                    name: "-"
                },
                {
                    name: "About",
                    mnemonic: "A",
                    action: "CPAbout",
                }
            ]
        }
    ];

/**
 * 
 * @param {ChickenPaint} controller
 * @param {CPMainGui} mainGUI
 * @constructor
 */
export default function CPMainMenu(controller, mainGUI) {
    let
	bar = $(
		'<nav class="navbar navbar-expand-md navbar-light bg-light">'
			+ '<a class="navbar-brand" href="#">ChickenPaint Be</a>'
			+ '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#chickenpaint-main-menu-content" aria-controls="chickenpaint-main-menu-content" aria-expanded="false" aria-label="Toggle main menu">'
				+ '<span class="navbar-toggler-icon"></span>'
			+ '</button>'
			+ '<div class="collapse navbar-collapse" id="chickenpaint-main-menu-content">'
				+ '<ul class="navbar-nav mr-auto">'
				+ '</ul>'
			+ '</div>'
			+ '<div class="widget-nav" id="chickenpaint-palette-toggler-content"></div>'
		+ '</nav>'
	),
	macPlatform = /^Mac/i.test(navigator.platform);

    function menuItemClicked(target) {
			let
            action = target.data('action'),
            checkbox = target.data('checkbox'),
            selected;

        if (controller.isActionAllowed(action)) {
            if (checkbox) {
                target.toggleClass("selected");
                selected = target.hasClass("selected");
			} else {
				selected = false;
			}

			controller.actionPerformed({
                action: action,
                checkbox: checkbox,
                selected: selected
            });
		}
    }
    
    function presentShortcutText(shortcut) {
        shortcut = shortcut.toUpperCase();
        
        // Only show the first potential shortcut out of the comma-separated list
        shortcut = shortcut.replace(/(,.+)$/, "");
        
        // Although the keycode for zoom in is "=", we'll present it to the user as "+"
        shortcut = shortcut.replace("CTRL+=", "CTRL++");
        shortcut = shortcut.replace("⌘+=", "⌘++");
        
        if (macPlatform) {
            shortcut = shortcut.replace(/\+/g, "");
        } else {
            shortcut = shortcut.replace(/\+/g, " ");
        }
        
        return shortcut;
    }

    function updateMenuStates(menuElem) {
        $("[data-action]", menuElem).each(function() {
            let
                thisElem = $(this),
                action = this.getAttribute("data-action"),
                actionAllowed = controller.isActionAllowed(action);

            thisElem
                .toggleClass("disabled", !actionAllowed)
                .toggleClass("hidden", !actionAllowed && thisElem.data("hideIfNotAvailable") === true);
        });

		// Hide dividers if all of the menu options in the section they delineate were hidden
        $(".dropdown-divider", menuElem).removeClass("hidden");

        let
            visibleElements = $(".dropdown-item:not(.hidden),.dropdown-divider:not(.hidden)", menuElem),
            lastDivider = null;

        for (let i = 0; i < visibleElements.length; i++) {
            let
                thisElement = $(visibleElements[i]);

            if (thisElement.hasClass("dropdown-divider")) {
                if (i === 0 || lastDivider) {
                    // This divider immediately follows a previous divider, so we don't need it
                    thisElement.addClass("hidden");
                } else {
                    lastDivider = thisElement;
                }
            } else {
                lastDivider = null;
            }
        }

        if (lastDivider) {
            lastDivider.addClass("hidden");
        }
    }
		
	function fillMenu(menuElem, entries) {
		menuElem.append(entries.map(topLevelMenuEntry => {
		let topLevelMenuElem = $(
						'<li class="nav-item dropdown">'
						+ '<a href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + _(topLevelMenuEntry.name) + '</a>'
						+ '<div class="dropdown-menu">'
						+ '</div>'
						+ '</li>'
					);
			
					let dropdownToggle = $(".dropdown-toggle", topLevelMenuElem);
					let dropdownMenu = $(".dropdown-menu", topLevelMenuElem);
			
					//data-bs-toggle="dropdown"を指定ずみのため、初期化不要
					// Bootstrap 5: ドロップダウンを初期化
					// var dropdown = new bootstrap.Dropdown(dropdownToggle[0]);
					dropdownToggle[0].addEventListener('show.bs.dropdown', (e) => {
			
						updateMenuStates(topLevelMenuElem);
			
						/* Instead of Bootstrap's extremely expensive data API, we'll only listen for dismiss clicks on the
						 * document *while the menu is open!*
						 */
						//メニューが表示されなくなってしまうのでコメントアウト
						// $(document).one("click", function () {
						// 	if (dropdownMenu.hasClass("show")) {
						// 		dropdown.hide(); // Bootstrap 5: ドロップダウンを非表示にする
						// 	}
						// });
					});
			
					dropdownMenu.append(topLevelMenuEntry.children.map(entry => {
						if (entry.action && !controller.isActionSupported(entry.action)) {
							return;
						}
			
						if (entry.action == "CPSend" && !controller.isActionSupported("CPContinue")) {
							// User won't be able to come back after saving, so make it sound more final
							entry.name = _("Post Oekaki");
							entry.shortcut = "ctrl+p";
						}
			
						let entryElem;
			
						if (entry.name == '-') {
							entryElem = $('<hr class="dropdown-divider"></hr>');
						} else {
							entryElem = $(
								'<a class="dropdown-item" href="#" data-action="' + entry.action + '"><span>' + _(entry.name) + '</span></a>'
							);
			
							if (entry.checkbox) {
								$(entryElem)
									.data("checkbox", true)
									.toggleClass("selected", !!entry.checked);
							}
							if (entry.hideIfNotAvailable) {
								entryElem.data("hideIfNotAvailable", true);
							}
						}
			
						if (entry.title) {
							entryElem.attr('title', _(entry.title));
						}
			
						if (entry.shortcut) {
							let menuLink = entryElem;
							let shortcutDesc = document.createElement("small");
			
							// Rewrite the shortcuts to Mac-style
							if (macPlatform) {
								entry.shortcut = entry.shortcut.replace(/SHIFT/im, "⇧");
								entry.shortcut = entry.shortcut.replace(/ALT/im, "⌥");
								entry.shortcut = entry.shortcut.replace(/CTRL/im, "⌘");
							}
			
							shortcutDesc.className = "chickenpaint-shortcut";
							shortcutDesc.textContent = presentShortcutText(entry.shortcut);
			
							menuLink.append(shortcutDesc);
			
							key(entry.shortcut, function (e) {
								menuItemClicked(menuLink);
			
								e.preventDefault();
								e.stopPropagation();
			
								return false;
							});
						}
			
						return entryElem;
					}));
			
					return topLevelMenuElem;
				}));
			}
			function fillWidgetTray(menuElem, entries) {
				menuElem.append(entries.filter(item => !!item.mnemonic && controller.isActionSupported(item.action)).map(entry => {
					let
						widgetMenuElem = $(
							`<button class="widget-toggler selected" type="button" data-action="${entry.action}" data-checkbox="true" data-selected="${!entry.checked}">`
								+ '<span>'
									+ entry.mnemonic
								+'</span>'
							+ '</button>'
						);
					widgetMenuElem.on('click',e => {
					
						menuItemClicked(widgetMenuElem);
						e.preventDefault();
					})
					return widgetMenuElem;
				}));
			}

			this.getElement = function() {
				return bar[0];
			};
			
			fillMenu($(".navbar-nav", bar), MENU_ENTRIES);
			fillWidgetTray($(".widget-nav", bar), MENU_ENTRIES[5].children);
			
			$(bar).on('click', 'a:not(.dropdown-toggle)', function(e) {
				menuItemClicked($(this));
				e.preventDefault();
			});
			
			// Since we don't use the data-api
			$(".navbar-toggler", bar).on('click', e => {//ハンバーガーメニューをクリックした時
				//元のコードをbootstrap5形式に対応させようとするとエラーが出る
				//コメントアウトしても動作に支障は出ていない
				// $('.collapse', bar).collapse('toggle');
				e.preventDefault();
			});
						
    function onPaletteVisChange(paletteName, show) {
        // Toggle the tickbox of the corresponding menu entry to match the new palette visibility
        let
            palMenuEntry = $('[data-action=\"CPPal' + paletteName.substring(0, 1).toUpperCase() + paletteName.substring(1) + '\"]', bar);
        
        palMenuEntry.toggleClass("selected", show);
    }

    mainGUI.getPaletteManager().on("paletteVisChange", onPaletteVisChange);

    let 
        fullScreenToggle = $(".dropdown-item[data-action=CPFullScreen]", bar),
        toolbarStyleToggle = $(".dropdown-item[data-action=CPToolbarStyle]", bar);
    
    controller.on("fullScreen", isFullscreen => fullScreenToggle.toggleClass("selected", isFullscreen));
    fullScreenToggle.toggleClass("selected", controller.isFullScreen());

    controller.on("toolbarStyleChange", newStyle => toolbarStyleToggle.toggleClass("selected", newStyle === "old"));
    toolbarStyleToggle.toggleClass("selected", controller.getToolbarStyle() === "old");
}
