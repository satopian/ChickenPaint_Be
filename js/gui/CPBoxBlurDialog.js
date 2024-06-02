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
import {_} from "../languages/lang.js";

export default function CPBoxBlurDialog(parent, controller) {
    let
        dialog = 
            $(`<div class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Box blur")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label>${_("Blur amount (pixels)")}</label>
                                    <input type="number" class="form-control chickenpaint-blur-amount" value="3">
                                </div>
                                <div class="form-group">
                                    <label>${_("Iterations (1-8, larger gives smoother blur)")}</label>
                                    <input type="number" class="form-control chickenpaint-blur-iterations" value="1" min="1" max="8">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_("Cancel")}</button>
                            <button type="button" class="btn btn-primary chickenpaint-apply-box-blur" data-bs-dismiss="modal">${_("Ok")}</button>
                        </div>
                    </div>
                </div>
            </div>
        `),
        
		blurAmountElem = $(".chickenpaint-blur-amount", dialog),
		blurIterationsElem = $(".chickenpaint-blur-iterations", dialog),
		applyButton = $(".chickenpaint-apply-box-blur", dialog);
		
		// Bootstrap 5: Modalコンストラクタを使用してmodalを初期化
		var modal = new bootstrap.Modal(dialog[0]);
		this.show = function() {
			modal.show();

			// ハンバガーメニューとモーダルの二重表示防止
			// chickenpaint-main-menu-contentのIDを持つcollapse要素を閉じる
			const collapseElement = document.getElementById('chickenpaint-main-menu-content');
			if (collapseElement && collapseElement.classList.contains('show')) {
				const bsCollapse = new bootstrap.Collapse(collapseElement, {
					toggle: false // すでに閉じている場合のエラーを防ぐ
				});
				bsCollapse.hide();
			}
		};
		
		applyButton[0].addEventListener('click', (e) => {

			let
				blur = Math.max(parseInt(blurAmountElem.val(), 10), 1),
				iterations = Math.min(Math.max(parseInt(blurIterationsElem.val(), 10), 1), 8);
		
			controller.getArtwork().boxBlur(blur, blur, iterations);
			// modal.hide();
		});
		
		dialog[0].addEventListener('hidden.bs.modal', (e) => {
			dialog.remove();
		});

		dialog[0].addEventListener('shown.bs.modal', (e) => {
			blurAmountElem.trigger('focus');
		});

		dialog[0].addEventListener("keydown", (e) => {

			if (e.key === "Enter" && dialog.hasClass('show')) {
				applyButton.trigger('click');
				e.preventDefault(); // デフォルトのフォーム送信を阻止
			}
		});
		parent.appendChild(dialog[0]);
	}
