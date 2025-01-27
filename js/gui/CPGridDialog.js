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
import {_} from "../languages/lang.js";

export default function CPGridDialog(parent, canvas) {
    var
        dialog = 
            $(`<div class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${_("Grid options")}</h5>
                            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label>${_("Grid size")}</label>
                                    <input type="number" class="form-control chickenpaint-grid-size" value="">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_("Cancel")}</button>
                            <button type="button" class="btn btn-primary chickenpaint-apply-grid-settings" data-bs-dismiss="modal">${_("Ok")}</button>
                        </div>
                    </div>
                </div>
            </div>
        `),
        
		gridSizeElem = $(".chickenpaint-grid-size", dialog),
		applyButton = $(".chickenpaint-apply-grid-settings", dialog);

		// Bootstrap 5: Modal コンストラクタを使用して modal を初期化
		var modal = new bootstrap.Modal(dialog[0]);
		this.show = function () {
			// ハンバガーメニューとモーダルの二重表示防止
			// chickenpaint-main-menu-contentのIDを持つcollapse要素を閉じる
			const collapseElement = document.getElementById('chickenpaint-main-menu-content');
			if (collapseElement && collapseElement.classList.contains('show')) {
				const bsCollapse = new bootstrap.Collapse(collapseElement, {
					toggle: false // すでに閉じている場合のエラーを防ぐ
				});
				bsCollapse.hide();
			}
			//モーダルを表示
			modal.show();
		};
	
		gridSizeElem.val(canvas.getGridSize());
	
		// Destroy the modal upon close
		dialog[0].addEventListener('hidden.bs.modal', (e) => {
			dialog[0].remove();
		});

		applyButton[0].addEventListener('click', (e) => {

			var gridSize = parseInt(gridSizeElem.val(), 10);
			canvas.setGridSize(gridSize);
			var modal = bootstrap.Modal.getInstance(dialog[0]); // インスタンスを取得
			gridSizeElem[0].blur(); // フォーカスを外す
			modal.hide(); // モーダルを手動で閉じる
		});
		dialog[0].addEventListener('shown.bs.modal', (e) => {
			// gridSizeElem.trigger('focus');
			gridSizeElem[0].focus();
		});
	
		// Enter キーが押されたときの処理を追加
		dialog[0].addEventListener('keydown', (e) => {
			if (e.key === "Enter") {
				e.preventDefault(); // デフォルトのフォーム送信を阻止
				// applyButton.trigger('click');
				applyButton[0].click();
			}
		});
	
		parent.appendChild(dialog[0]);
	}