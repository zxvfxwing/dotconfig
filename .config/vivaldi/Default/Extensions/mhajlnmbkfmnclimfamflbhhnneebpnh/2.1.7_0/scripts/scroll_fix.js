/*
 * This file is a part of the Chrome Download Manager project.
 *
 */

$("body").mousewheel(function(event, delta) {

	this.scrollTop -= (delta * 30);
	event.preventDefault();

});