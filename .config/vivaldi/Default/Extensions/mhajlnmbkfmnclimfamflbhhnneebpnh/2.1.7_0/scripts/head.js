/*
 * This file is a part of the Chrome Download Manager project.
 *
 */

if (window.devicePixelRatio < 2){
	document.documentElement.style.zoom = 1 / window.devicePixelRatio;
} else {
	document.documentElement.style.zoom = 2 / window.devicePixelRatio;
}