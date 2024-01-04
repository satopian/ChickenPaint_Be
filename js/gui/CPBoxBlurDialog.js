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
                                    <input type="number" class="form-control chickenpaint-blur-iterations" value="1">
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
		
		this.show = function() {
			// Bootstrap 5: Modalコンストラクタを使用してmodalを初期化
			var modal = new bootstrap.Modal(dialog[0]);
			modal.show();
		};
		
		applyButton.on('click', function(e) {
			let
				blur = Math.max(parseInt(blurAmountElem.val(), 10), 1),
				iterations = Math.min(Math.max(parseInt(blurIterationsElem.val(), 10), 1), 8);
		
			controller.getArtwork().boxBlur(blur, blur, iterations);
		});
		
		dialog.on('shown.bs.modal', function () {
			blurAmountElem.trigger('focus');
		});
		
		$(document).on('keypress', function (e) {
			if (e.key === "Enter" && dialog.hasClass('show')) {
				applyButton.trigger('click');
			}
		});
		
		// Bootstrap 5: modalオプションが不要なため削除
		parent.appendChild(dialog[0]);
	}
