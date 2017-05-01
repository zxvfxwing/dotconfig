/*
 * This file is a part of the Chrome Download Manager project.
 *
 */

var bg = chrome.extension.getBackgroundPage();
var stored = localStorage;
var hide_interrupted = (stored.hide_interrupted == "true");
var buttons = {'left':1, 'middle':2, 'right':3, 'esc':27, 'space':32, 'enter':13};

function byId(id) {
	
	return document.getElementById(id);
	
};

function byClass(id) { 

	return document.getElementsByClassName(id)[0]; 

};

function change_state(state, id) {
	
	chrome.downloads[state](id);
	
};

var timers = [];

function byte_format(bytes) {
	
	if (!bytes) {
		
		return "0 B";
		
	};
	if (bytes < 1000*1000) {
		
		return (bytes/1000).toFixed() + " KB";
	
	};
	if (bytes < 1000*1000*10) {
		
		return (bytes/1000/1000).toFixed(1) + " MB";
		
	};
	if (bytes < 1000*1000*1000) {
		
		return (bytes/1000/1000).toFixed() + " MB";
		
	};
	if (bytes < 1000*1000*1000*1000) {
		
		return (bytes/1000/1000/1000).toFixed(1) + " GB";
		
	};
	
	return bytes + " B";
	
};

function time_format(s) {
	
	if (s < 60) {
		
		return Math.ceil(s) + " secs";
		
	};
	if (s < 60*5) {
		
		return Math.floor(s/60) + " mins " + Math.ceil(s%60) + " secs";
		
	};
	if (s < 60*60) {
		
		return Math.ceil(s/60) + " mins";
		
	};
	if (s < 60*60*5) {
		
		return Math.floor(s/60/60) + " hours " + (Math.ceil(s/60)%60) + " mins";
		
	};
	if (s < 60*60*24) {
		
		return Math.ceil(s/60/60) + " hours";
		
	};
	
	return Math.ceil(s/60/60/24) + " days";
	
};

function refresh_download_view(id) {
	
	chrome.downloads.search({ id: id }, function (results) {
		
		var el = document.createElement('div');
		el.innerHTML = get_download_view(results[0]);
		
		try{
			downloads.replaceChild(el.firstChild, byId("download-"+id));
		} catch(e){};
		
		
	});
	
};

function start_timer(id) {
	
	clearInterval(timers[id]);

	var progress_last_value     = 0;
	var progress_current_value  = 0;
	var progress_next_value     = 0;
	var progress_remaining_time = 0;
	var progress_last_frame     = +new Date;

	function timer() {

		var el = byId("download-" + id);
		if(!el){
			
			return;
			
		};
		var status = el.getElementsByClassName('status')[0];
		var progress = el.getElementsByClassName('progress')[0];

		chrome.downloads.search({ id: id }, function (results) {
			var e = results[0];

			if (!e) {
				stopTimer(timers[id]);
				init();
				
				return;
				
			};

			if (e.state != 'complete') {
				var speed = 0, left_text = "";

				var remaining_seconds = (new Date(e.estimatedEndTime) - new Date()) / 1000;
				var remaining_bytes = e.totalBytes - e.bytesReceived;
				var speed = remaining_bytes / remaining_seconds;

				if (speed) {
					left_text = ", " + time_format(remaining_seconds)
				};

				if (progress_current_value == 0) {
					if (speed) {
						progress_current_value = e.bytesReceived / e.totalBytes;
						progress_next_value = (e.bytesReceived + speed) / e.totalBytes;
						progress_last_value = progress_current_value;
						progress_remaining_time += 1000;
					}
				} else {

					var current_progress = e.bytesReceived / e.totalBytes; 
					var progress_delta = current_progress - progress_last_value;
					progress_next_value = current_progress + progress_delta;
					progress_last_value = current_progress;
					progress_remaining_time += 1000;
				};

				status.innerHTML = 
					byte_format(speed) + "/s &ndash; " +
					byte_format(e.bytesReceived) + " of " + byte_format(e.totalBytes) + left_text;

				if (e.bytesReceived && e.bytesReceived == e.totalBytes) {
					status.innerHTML = byte_format(e.totalBytes);
				}
			} else { 
				status.innerHTML = "";
				clearInterval(timers[id]);
				refresh_download_view(e.id)
			};
		});
		
	};
	
	timers[id] = setInterval(timer, 1000);
	setTimeout(timer, 1);

	function progressAnimationFrame() {

		var el = byId("download-" + id);
		
		if(!el){
			
			return;
			
		};
		
		var progress = el.getElementsByClassName('progress')[0];

		var now = +new Date;
		var elapsed = now - progress_last_frame;
		var remaining_progress = progress_next_value - progress_current_value;
		progress_last_frame = now;

		if (progress_remaining_time > 0 && remaining_progress > 0) {
			progress_current_value += (elapsed / progress_remaining_time) * remaining_progress;
			progress_remaining_time -= elapsed;
			progress.style.width = (100 * progress_current_value) + "%";
		};
		if (timers[id]) {
			window.requestAnimationFrame(progressAnimationFrame);
		};
		
	};
	
	window.requestAnimationFrame(progressAnimationFrame);
	
};

function stopTimer(id) {
	
	clearInterval(timers[id]);
	timers[id] = null;
	
};

function findClosestItem(el) {
	
	do {
		if (el.className && el.className.indexOf('download') != -1) {
			
			return el;
			
		}
	} while (el = el.parentNode);
	
};

function showEmptySmile() {
	
	byId('downloads').innerHTML = "<div id='empty-smile'>" +
		"<img src = 'images/empty_chrome_downloads-119x144.png'></img>" +
		"</div>";
		
};

function clearAllDownloadsExceptRunning(callback) {
	
	chrome.downloads.search({}, function (results) {
		
		var running = results.map(function (item) {

			if (item.state == 'in_progress') 
				return true;
			chrome.downloads.erase({ id: item.id });
			
		});
		callback && callback(running);
		
	});
	
};

function clearAllClick() {
	
	Modal.hide();
	clearAllDownloadsExceptRunning(function (running) {
		
		if (running.length){
			init();
		} else{
			showEmptySmile();
		};
		
	});
	
};

byId('clear').onclick = function () {
	
	if (options.dont_show_clear_dialog){
		clearAllClick();
	} else{
		Modal.show();
	};
	
};

byId('open_folder').onclick = function () {
	
	chrome.downloads.showDefaultFolder();
	
};

byId('modal-close').onclick = function () { Modal.hide(); };
byId('clear-all').onclick = clearAllClick;

byId('downloads').onclick = function (e) {
	
	var c = e.target.className;
	if (e.target.nodeName == 'A') {
		if (!/resume|cancel|pause|retry|erase|name|show/.test(c)){
			return;
		};
		if (e.which != buttons.left){
			return;
		};
		var el = findClosestItem(e.target);
		var id = +el.dataset.id;
		if (/resume|cancel|pause/.test(c)) {
			change_state(c, id);
			refresh_download_view(id);
			if (/resume/.test(c)){
				start_timer(id);
			} else if (/cancel|pause/.test(c)){
				stopTimer(id);
			}
		} else if (/retry/.test(c)) {
			chrome.downloads.search({ id: id }, function (results) {
				
				chrome.downloads.download({ url: results[0].url }, function (new_id) {
					
					start_timer(new_id); /// May become redundant later
					
				});
				
			});
		} else if (/erase/.test(c)) {
			chrome.downloads.search(
				{ limit: 151, filenameRegex: '.+', orderBy: ['-startTime'] },
				function (results) {
					
					var list = el.parentNode;
					list.removeChild(el);
					
					var e = results[150];
					if (!e || hide_interrupted && e.state == 'interrupted') 
						return; 
					var new_el = element_from_html(get_download_view(e));
					list.appendChild(new_el);
					
					return;
					
				}
			);
			chrome.downloads.erase({ id: id });
		} else if (/show/.test(c)) {
			chrome.downloads.show(id);
		} else if (/name/.test(c)) {
			chrome.downloads.open(id);
			
			return false;
			
		};
	};
	
};

byId('downloads').ondragstart = function (e) {
	
	var el = findClosestItem(e.target);
	if (el) {
		var id = +el.dataset.id;		
		chrome.downloads.drag(id);
		el.classList.remove('active');
		e.preventDefault();
	};
	
};


byId('downloads').addEventListener('click', function (e) {
	
	if (e.target.nodeName == 'A') return true;
	var selected = byId('downloads').getElementsByClassName('selected')[0]
	selected && selected.classList.remove('selected')
	var el = findClosestItem(e.target);
	el && el.classList.add('selected')
	
}, false);

function mouseClickHandler(e) {
	
	var el = findClosestItem(e.target);
	if(!el){
		
		return;
	
	};

	if (e.which == buttons.left && e.target.nodeName != 'A')  {
		el.classList.remove('active');
		id = +el.dataset.id;
		chrome.downloads.open(id);
		e.preventDefault();
		
		return;
		
	};

	if (e.which == buttons.middle) {
		var first_link = el.querySelector('.controls a');
		first_link.classList.remove('active');
		first_link.click();
		e.preventDefault();
		
		return;
		
	};

	if (e.which == buttons.left && e.target.classList.contains('name')) {
		el.classList.remove('active');
	};

	return false;
	
};

function mouse_down(e) {
	
	var el = findClosestItem(e.target);
	if(!el){
		
		return;
	
	};
	
	if (e.which == buttons.middle) {
		var first_link = el.querySelector('.controls a');
		first_link.classList.add('active');
	};
	if (e.which == buttons.left && el.draggable && is_target_whole_item(e.target)) {
		el.classList.add('active');
	};
	
};

function is_target_whole_item(el) {
	
	return el.nodeName != 'A' || el.classList.contains('name');
	
};

function get_proper_filename(filename) {
	
	var back_array =  filename.split('\\');
	var forward_array = filename.split('/');
	var array = back_array.length > forward_array.length ? back_array : forward_array;
	
	return array.pop().replace(/.crdownload$/, '');
	
};

function get_download_view(e) {
	
		var controls = "", status = "", progress_class = "", progress_width = 0;
		if (e.state == 'complete') { 
			var folder = /mac/i.test(navigator.platform) ? chrome.i18n.getMessage("control_finder_part_value") : chrome.i18n.getMessage("control_folder_part_value");
			controls = "<a class='show' href='#'>" + chrome.i18n.getMessage("control_show_in_part_value") + " " + folder + "</a>";
			status = byte_format(Math.max(e.totalBytes, e.bytesReceived));
			if (!e.exists) { 
				status = chrome.i18n.getMessage("control_status_removed_value");
				controls = "<a class='retry' href='#'>" + chrome.i18n.getMessage("control_retry_download_value") + "</a>";
			} 
		} else if (e.state == "interrupted") { 
			status = chrome.i18n.getMessage("control_status_canceled_value");
			controls = "<a class='retry' href='#'>" + chrome.i18n.getMessage("control_retry_download_value") + "</a>";
		} 
		else { 
			if (e.paused) { 
				status = chrome.i18n.getMessage("control_status_paused_value");
				controls = "<a class='resume' href='#'>" + chrome.i18n.getMessage("control_resume_value") + "</a><a class='cancel' href='#'>" + chrome.i18n.getMessage("control_cancel_value") + "</a>";
				progress_width = (100 * e.bytesReceived / e.totalBytes) + "%";
				progress_class = "paused";
			} else { 
				status = ""; 
				controls = "<a class='cancel' href='#'>" + chrome.i18n.getMessage("control_cancel_value") + "</a>";	
				progress_width = (100 * e.bytesReceived / e.totalBytes) + "%";
				progress_class = "in-progress";		
			}
		};

		var img_src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		chrome.downloads.getFileIcon(e.id, { size: 16 }, function (icon) {
			
			if (icon) {
				img_src = icon;
				byId("img-" + e.id).src = icon;
			};
			
		});

		var canceled_class = (e.state == "interrupted") ? "canceled" : "";
		var removed_class = (!e.exists) ? "removed" : "";
		var extra_class = removed_class + " " + canceled_class + " " + progress_class;
		var draggable_attr = (e.state == 'complete' && e.exists) ? 'true' : 'false';

		var prop_filename = get_proper_filename(e.filename);

		if (is_dangerous(e)) {
			extra_class += ' danger';
		};

		return "<div class='download " + extra_class + "' id='download-" + e.id + "' data-id='"+ e.id +"' draggable='"+ draggable_attr +"'>" +
					"<a class='remove erase' href='#' title='" + chrome.i18n.getMessage("item_remove_button_title") + "'>x</a>" +
					"<img id='img-"+ e.id +"' src='"+ img_src +"' class='icon' />" +
			        "<div class='name-wrapper'>" +

			        ((e.state != 'complete' || !e.exists)
			        	? "<span class='name'>" + prop_filename + "</span>"
				        : "<a class='name' href='file://" + e.filename + "' title='" + chrome.i18n.getMessage("item_name_open_title") + "'>" + 
				              prop_filename +
				        "</a>") +

			        "</div>" +
			        "<div class='progress-bar'><div class='progress' style='width:" + progress_width + "'></div></div>" + 
			        "<div><a class='src-url' href='" + e.url + "'>" + e.url + "</a></div>" +

			        "<div class='controls'>" + controls  + "<span class='status'>" + status + "</span>" + "</div>" +
		        "</div>";
				
};

function is_dangerous(e) {
	
	return !/safe|accepted/.test(e.danger) && e.state == 'in_progress';
	
}

function element_from_html(html) {
	
	var el = document.createElement('div');
	el.innerHTML = html;
	
	return el.firstChild;
	
};



chrome.downloads.onCreated.addListener(function (e) {
	
	var downloads = byId('downloads');
	var new_el = element_from_html(get_download_view(e));
	downloads.insertBefore(new_el, downloads.firstChild);
	downloads.removeChild(downloads.lastChild);
	
});

chrome.downloads.onChanged.addListener(function (delta) {
	
	if (delta.filename){
		refresh_download_view(delta.id);
	};
	if (delta.danger && delta.danger.current == 'accepted'){
		byId("download-" + delta.id).classList.remove('danger');
	};
	
});

var Modal = (function () {

	var visible = false;
	var duration = 0.1;

	function show() {
		
		visible = true;
		byId('downloads').style.opacity =  0.5;
		byClass('modal-overlay').style.display = 'block';
		byClass('modal').style.display = 'block';
		setTimeout(function () {
			
			byClass('modal').classList.add('visible');
			
		}, 1);
		
	};

	function hide() {
		
		visible = false;
		byId('downloads').style.opacity =  1;
		byClass('modal-overlay').style.display = 'none';
		byClass('modal').classList.remove('visible');
		setTimeout(function () {
			
			byClass('modal').style.display = 'none';
			
		}, duration * 1000 + 10);
		
	};

	function isVisible() {
		
		return visible;
		
	};

	document.addEventListener("keydown", function (e) {
		
		if (isVisible()) {
			if (e.keyCode == buttons.enter) {
				clearAllClick()
				e.preventDefault();
			};
			if (e.keyCode == buttons.space) {
				clearAllClick()
				e.preventDefault();
			};
			if (e.keyCode == buttons.esc) {
				hide();
				e.preventDefault();
			};
		};
		
	});

	return {
		show: show,
		hide: hide,
		isVisible: isVisible
	};
	
})();

var options = {'dont_show_clear_dialog': false};

chrome.storage.sync.get(options, function (options_new) {
	
	options = options_new;
	byId('dont_show_clear_dialog').checked = options.dont_show_clear_dialog;
	
});

byId('dont_show_clear_dialog').onchange = function (e) {
	
	chrome.storage.sync.set({'dont_show_clear_dialog': e.target.checked});
	
};
function init () {

	chrome.downloads.search({ limit:0 }, function () {
		
		chrome.downloads.search(
			{ limit: 150, filenameRegex: '.+', orderBy: ['-startTime'] },  // Label : 11(a)
			show_downloads_list
		);
		byId("show-all").focus();
		
	});
	
};

function show_downloads_list(results) {
	
	var target = byId('downloads');
	var html = "";

	results.forEach(function (e) {
		
		if (hide_interrupted && e.state == 'interrupted'){ 
			
			return; 
			
		};

		if (is_dangerous(e)) {
			setTimeout(function () {
				
				chrome.downloads.acceptDanger(e.id);
				
			}, 100);
		};

		if (e.state == "in_progress" && !e.paused) {
			start_timer(e.id);
		};

		html += get_download_view(e);
		
	});

	if (html){
		target.innerHTML = html;
	} else{
		showEmptySmile();
	};

};

byId("show-all").onclick = function (e) { 

	chrome.tabs.create({url:e.target.href,selected:true})
	
};


window.addEventListener("DOMContentLoaded", function () {
	
	chrome.runtime.sendMessage("popup_open");
	
});
window.addEventListener("unload", function () {

	var bg = chrome.extension.getBackgroundPage();
	bg.chrome.extension.sendMessage("popup_close");
	
});

$("#title").html(chrome.i18n.getMessage("head_downloads_title"));
$("#open_folder").attr("title", chrome.i18n.getMessage("head_open_folder_title"));
$("#clear").html(chrome.i18n.getMessage("head_clear_button_value"));
$("#show-all").html(chrome.i18n.getMessage("footer_show_all_title"));

$("#clear_win_top_content").html(chrome.i18n.getMessage("clear_win_top_content"));
$("#clear_win_middle_text").html(chrome.i18n.getMessage("clear_win_middle_text"));
$("#clear-all").html(chrome.i18n.getMessage("clear_win_clear_all_button_value"));
$("#modal-close").html(chrome.i18n.getMessage("clear_win_cancel_button_value"));

init();