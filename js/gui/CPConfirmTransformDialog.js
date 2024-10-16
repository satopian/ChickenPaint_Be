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

import EventEmitter from "wolfy87-eventemitter";
import $ from "jquery";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {_} from "../languages/lang.js";

export default function CPConfirmTransformDialog(parent, controller) {
	var
		dialog =
			$(`<div class="modal fade" tabindex="-1" role="dialog">
	            <div class="modal-dialog">
	                <div class="modal-content">
	                    <div class="modal-header">
	                        <h5 class="modal-title">${_("Complete transform")}</h5>
	                        <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close">
	                        </button>
	                    </div>
	                    <div class="modal-body">
	                        <p>
							${_("You need to finish transforming this layer before you can do that. What would you like to do with the transform?")}
							</p>
	                    </div>
	                    <div class="modal-footer">
	                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_("Cancel")}</button>
	                        <button type="button" class="btn btn-light chickenpaint-reject-transform" data-bs-dismiss="modal">${_("Undo transform")}</button>
	                        <button type="button" class="btn btn-primary chickenpaint-accept-transform" data-bs-dismiss="modal">${_("Apply transform")}</button>
	                    </div>
	                </div>
	            </div>
	        </div>
	    `),

		that = this,

		applyButton = $(".chickenpaint-accept-transform", dialog),
		rejectButton = $(".chickenpaint-reject-transform", dialog);

	applyButton.on('click',function(e) {
		controller.actionPerformed({action: "CPTransformAccept"});
		that.emitEvent("accept");
	});

	rejectButton.on('click',function(e) {
		controller.actionPerformed({action: "CPTransformReject"});
		that.emitEvent("reject");
	});

	// Bootstrap 5 modal initialization
	var modal = new bootstrap.Modal(dialog[0]);

	this.show = function () {
		modal.show();
	};

	dialog[0].addEventListener('hidden.bs.modal', (e) => {
		dialog.remove();
	});
	// Enterキーが押されたときの処理
	parent.addEventListener("keydown", function keydown_EnterKey (e) {
		if (e.key === "Enter") {
			// Enterキーが押されたら非表示にする
			modal.hide();
			controller.actionPerformed({action: "CPTransformAccept"});//変形確定
			that.emitEvent("accept");
			parent.removeEventListener("keydown",keydown_EnterKey);
		}
	});

	// Fix the backdrop location in the DOM by reparenting it to the chickenpaint container
	parent.appendChild(dialog[0]);
	
}

CPConfirmTransformDialog.prototype = Object.create(EventEmitter.prototype);
CPConfirmTransformDialog.prototype.constructor = CPConfirmTransformDialog;