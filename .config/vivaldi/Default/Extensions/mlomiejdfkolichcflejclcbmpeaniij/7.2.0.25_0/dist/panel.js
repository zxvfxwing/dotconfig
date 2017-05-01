if(typeof browser!=='undefined'){chrome=browser;}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Router = require('./routers/Router.js'),
    msg = require('../utils/msg')('panel_app'),
    globals = require('../../../src/classes/Globals'),
    sendMessageToBackground = msg.sendMessageToBackground;

window.t = chrome.i18n.getMessage;
window.App = {
  GHOSTERY_DOMAIN: globals.GHOSTERY_DOMAIN,
  BROWSER_INFO: globals.BROWSER_INFO
};

new Router();

sendMessageToBackground('ping', 'engaged');

},{"../../../src/classes/Globals":53,"../utils/msg":22,"./routers/Router.js":4}],2:[function(require,module,exports){
'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    Models = require('../models/Models'),
    msg = require('../../utils/msg')('panel_collection');

const reloadSet = new Set(['toggle_individual_trackers', 'ignore_first_party', 'block_by_default', 'site_whitelist', 'site_blacklist', 'selected_app_ids', 'site_specific_blocks', 'site_specific_unblocks']);

var Collections = {
	PanelModels: Backbone.Collection.extend({
		model: function (attrs, options) {
			switch (attrs.id) {
				case 'panel':
					return new Models.PanelModel(attrs, options);
				case 'header':
					return new Models.HeaderModel(attrs, options);
				case 'summary':
					return new Models.SummaryModel(attrs, options);
				case 'blocking':
					return new Models.BlockingModel(attrs, options);
				case 'settings':
					return new Models.SettingsModel(attrs, options);
				case 'help':
					return new Models.HelpModel(attrs, options);
				default:
					return new Models.ParentModel(attrs, options);
			}
		},

		sync: function (method, collection, options) {
			var modelJSON;
			if (method === 'read') {
				this.sendMessage('getPanelData').then(data => {
					if (data.logged_in) {
						this.sendMessage('getLoginInfo').then(login_info => {
							if (login_info && login_info.logged_in) {
								this.sendMessage('pullUserSettings').then(settings => {
									if (settings) {
										let needsReload = false;
										collection.models.forEach(model => {
											Object.keys(settings).forEach(key => {
												if (model.attributes.hasOwnProperty(key) && !_.isEqual(model.get(key), settings[key])) {
													model.set(key, settings[key]);
													if (reloadSet.has(key)) {
														needsReload = true;
													}
												}
											});
										});

										if (needsReload) {}
									}
								}).catch(err => {});
							}
						});
					}
					return options.success(data.models);
				}).catch(function (err) {
					return options.error(err);
				});
			} else if (method === 'update') {
				modelJSON = collection.toJSON();

				Object.keys(modelJSON).forEach(key => {
					if (key !== 'id') {
						collection.collection.models.forEach(model => {
							if (model.get('id') !== modelJSON.id) {
								if (model.attributes.hasOwnProperty(key) && !_.isEqual(model.get(key), modelJSON[key])) {
									model.set(key, modelJSON[key]);
								}
							}
						});
					}
				});

				this.sendMessage('updatePanelData', modelJSON).then(function (data) {
					return options.success(data);
				}).catch(function (err) {
					return options.error(err);
				});
			}
		},

		sendMessage: msg.sendMessageInPromise
	}),

	BlockingCategories: Backbone.Collection.extend({
		model: Models.BlockingCategory,
		comparator: function (category) {
			return -1 * category.get('num_total');
		},
		buildCollectionData: function (trackerList, selectedAppIds, pageUnblocks, pageBlocks, showTrackerUrls, language) {
			var categories = {},
			    categoryName,
			    categoryArray = [];

			trackerList.forEach(tracker => {
				var category = tracker.cat,
				    blocked = selectedAppIds.hasOwnProperty(tracker.id);

				if (t('category_' + category) === 'category_' + category) {
					category = 'uncategorized';
				}

				if (categories.hasOwnProperty(category)) {
					categories[category].num_total++;
					if (blocked) {
						categories[category].num_blocked++;
					}
				} else {
					categories[category] = {
						id: category,
						name: t('category_' + category),
						description: t('category_' + category + '_desc'),
						img_name: category === 'advertising' ? 'adv' : category === 'social_media' ? 'smed' : category,
						num_total: 1,
						num_blocked: blocked ? 1 : 0,
						trackers: {}
					};
				}
				categories[category].trackers[tracker.name] = {
					id: tracker.id,
					name: tracker.name,
					description: '',
					blocked: blocked,
					ss_allowed: pageUnblocks.indexOf(+tracker.id) >= 0,
					ss_blocked: pageBlocks.indexOf(+tracker.id) >= 0,
					shouldShow: true,
					catId: category,
					sources: tracker.sources,
					showTrackerUrls: showTrackerUrls,
					warningCompatibility: tracker.hasCompatibilityIssue,
					warningInsecure: tracker.hasInsecureIssue,
					warningSlow: tracker.hasLatencyIssue,
					language: language
				};
			});

			for (categoryName in categories) {
				if (categories.hasOwnProperty(categoryName)) {
					categoryArray.push(categories[categoryName]);
				}
			}

			this.reset(categoryArray);
		},

		close: function () {
			this.remove();
		}
	}),
	BlockingTrackers: Backbone.Collection.extend({
		model: Models.BlockingTracker,
		comparator: function (tracker) {
			return tracker.get('name').toLowerCase();
		},
		buildCollectionData: function (trackers) {
			var trackerName,
			    trackersArray = [];
			for (trackerName in trackers) {
				if (trackers.hasOwnProperty(trackerName)) {
					trackersArray.push(trackers[trackerName]);
				}
			}

			this.reset(trackersArray);
		},
		countTotal: function () {
			var count = 0;
			this.models.forEach(model => {
				count++;
			});
			return count;
		},
		countBlocked: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('blocked') && !model.get('ss_allowed') || model.get('ss_blocked')) {
					count++;
				}
			});
			return count;
		},
		countSsBlocked: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('ss_blocked')) {
					count++;
				}
			});
			return count;
		},
		countSsUnblocked: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('ss_allowed')) {
					count++;
				}
			});
			return count;
		},
		countShownBlocked: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('blocked') && model.get('shouldShow')) {
					count++;
				}
			});
			return count;
		},
		checkAllShown: function () {
			var ret = true;
			this.models.forEach(model => {
				if (!model.get('shouldShow')) {
					ret = false;
				}
			});
			return ret;
		},
		checkShownBlocked: function () {
			var ret = true;
			this.models.forEach(model => {
				if (model.get('shouldShow') && !model.get('blocked')) {
					ret = false;
				}
			});
			return ret;
		},
		setBlocked: function (app_id, blocked) {
			this.models.forEach(model => {
				if (model.get('id') === app_id) {
					model.set('blocked', blocked);
					return;
				}
			});
		},
		setTrustRestrict: function (app_id, trust, restrict) {
			this.models.forEach(model => {
				if (model.get('id') === app_id) {
					model.set('ss_allowed', trust);
					model.set('ss_blocked', restrict);
					return;
				}
			});
		},
		setShow: function (show) {
			var count = 0;
			this.models.forEach(model => {
				model.set('shouldShow', show);
				count++;
			});
			return show ? count : 0;
		},
		setShownBlocked: function (blocked) {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('shouldShow')) {
					model.set('blocked', blocked);
					count++;
				}
			});
			return count;
		},
		setBlockedShow: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('blocked') && !model.get('ss_allowed') || model.get('ss_blocked')) {
					model.set('shouldShow', true);
					count++;
				} else {
					model.set('shouldShow', false);
				}
			});
			return count;
		},
		setWarningShow: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('warningCompatibility') || model.get('warningInsecure') || model.get('warningSlow')) {
					model.set('shouldShow', true);
					count++;
				} else {
					model.set('shouldShow', false);
				}
			});
			return count;
		},
		setWarningCompatibilityShow: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('warningCompatibility')) {
					model.set('shouldShow', true);
					count++;
				} else {
					model.set('shouldShow', false);
				}
			});
			return count;
		},
		setWarningSlowInsecureShow: function () {
			var count = 0;
			this.models.forEach(model => {
				if (model.get('warningInsecure') || model.get('warningSlow')) {
					model.set('shouldShow', true);
					count++;
				} else {
					model.set('shouldShow', false);
				}
			});
			return count;
		},

		close: function () {
			this.remove();
		}
	})
};

module.exports = Collections;

},{"../../utils/msg":22,"../models/Models":3,"backbone":43,"underscore":52}],3:[function(require,module,exports){
'use strict';

var Backbone = require('backbone'),
    t = chrome.i18n.getMessage;

var ParentModel = Backbone.Model.extend({
	defaults: { language: 'en' },
	sync: function (method, model, options) {
		options.success = function (data) {};
		this.collection.sync(method, model, options);
	}
});
var AccountModel = ParentModel.extend({
	API_ROOT_URL: null,
	initialize: function (options) {
		this.API_ROOT_URL = 'https://consumerapi.' + App.GHOSTERY_DOMAIN + '.com';
	},
	sync: function (method, model, options) {
		var apiUrlRoot = this.API_ROOT_URL;
		options.beforeSend = function () {
			this.url = apiUrlRoot + this.url;
		};
		return Backbone.sync.call(this, method, model, options);
	},
	validateEmail: function (email) {
		var emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
		return email !== '' && emailRegex.test(email);
	},
	validatePassword: function (pwd) {
		var pwdRegex = /^[a-zA-Z0-9!@#$%^&*=+()<>{}[\];:,./?]{8,50}$/;
		return pwd !== '' && pwdRegex.test(pwd);
	}
});

var Models = {
	ParentModel: ParentModel,
	PanelModel: ParentModel.extend({ defaults: { id: 'panel' } }),
	HeaderModel: ParentModel.extend({ defaults: { id: 'header' } }),
	SummaryModel: ParentModel.extend({ defaults: { id: 'summary' } }),
	BlockingModel: ParentModel.extend({ defaults: { id: 'blocking' } }),
	SettingsModel: ParentModel.extend({ defaults: { id: 'settings' } }),
	HelpModel: ParentModel.extend({ defaults: { id: 'help' } }),

	BlockingCategory: ParentModel.extend({
		defaults: {
			id: '',
			name: '',
			description: '',
			num_total: 0,
			num_shown: 0,
			num_blocked: 0,

			blocking_category_tracker: t('blocking_category_tracker'),
			blocking_category_trackers: t('blocking_category_trackers'),
			blocking_category_blocked: t('blocking_category_blocked')
		},
		idAttribute: 'id'
	}),
	BlockingTracker: ParentModel.extend({
		defaults: {
			id: '',
			name: '',
			description: '',
			blocked: false,
			ss_blocked: false,
			ss_allowed: false,
			shouldShow: true,
			catId: '',
			sources: [],

			panel_tracker_trust_tooltip: t('panel_tracker_trust_tooltip'),
			panel_tracker_restrict_tooltip: t('panel_tracker_restrict_tooltip'),
			panel_tracker_block_tooltip: t('panel_tracker_block_tooltip'),
			panel_tracker_found_sources_title: t('panel_tracker_found_sources_title')
		},
		idAttribute: 'name'
	}),

	LoginModel: AccountModel.extend({
		urlRoot: '/api/Login',
		defaults: {
			EmailAddress: '',
			Password: ''
		},

		validate: function (attrs, options) {
			if (!this.validateEmail(attrs.EmailAddress)) {
				return 'ERR_INVALID_EMAIL';
			}
			if (!attrs.Password) {
				return 'ERR_PWD_REQUIRED';
			}
		}
	}),
	CreateAccountModel: AccountModel.extend({
		urlRoot: '/api/Account',
		defaults: {
			EmailAddress: '',
			ConfirmEmailAddress: '',
			Password: '',
			ModifyingUserId: '',
			FirstName: '',
			LastName: '',
			UserType: 2,
			KeepUpdatedOnProductReleases: true,
			ValidationRedirectUrlToAddCodeSuffixOn: '',
			FooterUrl: '',
			VerificationContinueUrl: ''
		},

		validate: function (attrs, options) {
			if (!this.validateEmail(attrs.EmailAddress)) {
				return 'ERR_INVALID_EMAIL';
			}

			if (attrs.EmailAddress !== attrs.ConfirmEmailAddress) {
				return 'ERR_INVALID_EMAIL_CONFIRM';
			}

			if (!this.validatePassword(attrs.Password)) {
				if (attrs.Password.length >= 8 && attrs.Password.length <= 50) {
					return 'ERR_INVALID_PWD';
				} else {
					return 'ERR_INVALID_PWD_TOO_SHORT';
				}
			}
		}
	}),
	AccountSuccessModel: AccountModel.extend({
		defaults: {
			EmailAddress: ''
		}
	}),
	ForgotPasswordModel: AccountModel.extend({
		urlRoot: '/api/Password/Forgot',
		defaults: {
			EmailAddress: '',
			RedirectUrlToAddCodeSuffixOn: '',
			FooterUrl: ''
		},

		validate: function (attrs, options) {
			if (!this.validateEmail(attrs.EmailAddress)) {
				return 'ERR_INVALID_EMAIL';
			}
		}
	})
};

module.exports = Models;

},{"backbone":43}],4:[function(require,module,exports){
'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    PanelView = require('../views/PanelView'),
    Collections = require('../collections/Collections'),
    msg = require('../../utils/msg')('panel_router'),
    log = msg.log;

var Router = Backbone.Router.extend({
	routes: {
		'dashboard': 'dashboardRoute',
		'settings': 'settingsRoute',
		'login': 'loginRoute',
		'create-account': 'createAccountRoute',
		'account-success': 'accountSuccessRoute',
		'forgot-password': 'forgotPasswordRoute',
		'help': 'helpRoute',
		'*action': 'defaultRoute'
	},
	initialize: function () {
		var panelCollection = new Collections.PanelModels();
		panelCollection.fetch({
			reset: true,
			success: (collection, response, options) => {
				this.panelView = new PanelView({
					attributes: {},
					model: collection.get('panel'),
					collection: panelCollection,
					customEvents: _.extend({}, Backbone.Events)
				});
				this.start();
			},
			error: function () {
				log("Error loading collection models");
			}
		});

		if (App.BROWSER_INFO.name) {
			$('body').addClass(App.BROWSER_INFO.name);
		}

		try {
			let p = JSON.parse(window.localStorage.getItem('panel'));
			if (p && p.name && p.date && new Date() - new Date(p.date) < 30000) {
				switch (p.name) {
					case 'login':
						window.history.pushState({}, 'dashboard', '/#dashboard');
						window.history.pushState({}, 'login', '/#login');
						window.location.hash = 'login';
						break;
					case 'create-account':
						window.history.pushState({}, 'dashboard', '/#dashboard');
						window.history.pushState({}, 'login', '/#login');
						window.history.pushState({}, 'create-account', '/#create-account');
						window.location.hash = 'create-account';
						break;
				}
			}
		} catch (err) {
			window.location.hash = '#/dashboard';
		}
	},

	start: function () {
		Backbone.history.start();
	},

	dashboardRoute: function () {
		log('ROUTE: Dashboard');
		this.recordRoute('dashboard');
		this.panelView.renderSummary();
	},
	settingsRoute: function () {
		log('ROUTE: Settings');
		this.recordRoute('settings');
		this.panelView.renderSettings();
	},
	loginRoute: function () {
		log('ROUTE: Login');
		this.recordRoute('login');
		this.panelView.renderLogin();
	},
	createAccountRoute: function () {
		log('ROUTE: Create Account');
		this.recordRoute('create-account');
		this.panelView.renderCreateAccount();
	},
	accountSuccessRoute: function () {
		log('ROUTE: Account Success');
		this.recordRoute('account-success');
		this.panelView.renderAccountSuccess();
	},
	forgotPasswordRoute: function () {
		log('ROUTE: Forgot Password');
		this.recordRoute('forgot-password');
		this.panelView.renderForgotPassword();
	},
	helpRoute: function () {
		log('ROUTE: Help');
		this.recordRoute('help');
		this.panelView.renderHelp();
	},
	defaultRoute: function (action) {
		log('ROUTE: default', action);
		window.location.hash = '#/dashboard';
	},
	recordRoute: function (route) {
		try {
			window.localStorage.setItem('panel', JSON.stringify({ name: route, date: new Date() }));

			clearInterval(this.routeTimer);
			this.routeTimer = setInterval(() => {
				window.localStorage.setItem('panel', JSON.stringify({ name: route, date: new Date() }));
			}, 20000);
		} catch (err) {}
	}
});

module.exports = Router;

},{"../../utils/msg":22,"../collections/Collections":2,"../views/PanelView":18,"backbone":43,"underscore":52}],5:[function(require,module,exports){
'use strict';

(function () {
	function clamp(element, options) {
		options = options || {};

		var win = window,
		    opt = {
			clamp: options.clamp || 2,
			useNativeClamp: typeof options.useNativeClamp != 'undefined' ? options.useNativeClamp : true,
			splitOnChars: options.splitOnChars || ['.', '-', '–', '—', ' '],
			animate: options.animate || false,
			truncationChar: options.truncationChar || '…',
			truncationHTML: options.truncationHTML
		},
		    sty = element.style,
		    originalText = element.innerHTML,
		    supportsNativeClamp = typeof element.style.webkitLineClamp != 'undefined',
		    clampValue = opt.clamp,
		    isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1),
		    truncationHTMLContainer;

		if (opt.truncationHTML) {
			truncationHTMLContainer = document.createElement('span');
			truncationHTMLContainer.innerHTML = opt.truncationHTML;
		}

		function computeStyle(elem, prop) {
			if (!win.getComputedStyle) {
				win.getComputedStyle = function (el, pseudo) {
					this.el = el;
					this.getPropertyValue = function (prop) {
						var re = /(\-([a-z]){1})/g;
						if (prop == 'float') {
							prop = 'styleFloat';
						}
						if (re.test(prop)) {
							prop = prop.replace(re, function () {
								return arguments[2].toUpperCase();
							});
						}
						return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
					};
					return this;
				};
			}

			return win.getComputedStyle(elem, null).getPropertyValue(prop);
		}

		function getMaxLines(height) {
			var availHeight = height || element.clientHeight,
			    lineHeight = getLineHeight(element);

			return Math.max(Math.floor(availHeight / lineHeight), 0);
		}

		function getMaxHeight(clmp) {
			var lineHeight = getLineHeight(element);
			return lineHeight * clmp;
		}

		function getLineHeight(elem) {
			var lh = computeStyle(elem, 'line-height');
			if (lh == 'normal') {
				lh = parseInt(computeStyle(elem, 'font-size')) * 1.2;
			}
			return parseInt(lh);
		}

		var splitOnChars = opt.splitOnChars.slice(0),
		    splitChar = splitOnChars[0],
		    chunks,
		    lastChunk;

		function getLastChild(elem) {
			if (elem.lastChild.children && elem.lastChild.children.length > 0) {
				return getLastChild(Array.prototype.slice.call(elem.children).pop());
			} else if (!elem.lastChild || !elem.lastChild.nodeValue || elem.lastChild.nodeValue === '' || elem.lastChild.nodeValue == opt.truncationChar) {
					elem.lastChild.parentNode.removeChild(elem.lastChild);
					return getLastChild(element);
				} else {
						return elem.lastChild;
					}
		}

		function truncate(target, maxHeight) {
			if (!maxHeight) {
				return;
			}

			function reset() {
				splitOnChars = opt.splitOnChars.slice(0);
				splitChar = splitOnChars[0];
				chunks = null;
				lastChunk = null;
			}

			var nodeValue = target.nodeValue.replace(opt.truncationChar, '');

			if (!chunks) {
				if (splitOnChars.length > 0) {
					splitChar = splitOnChars.shift();
				} else {
						splitChar = '';
					}

				chunks = nodeValue.split(splitChar);
			}

			if (chunks.length > 1) {
				lastChunk = chunks.pop();
				applyEllipsis(target, chunks.join(splitChar));
			} else {
					chunks = null;
				}

			if (truncationHTMLContainer) {
				target.nodeValue = target.nodeValue.replace(opt.truncationChar, '');
				element.innerHTML = target.nodeValue + opt.truncationChar + ' ' + truncationHTMLContainer.innerHTML;
			}

			if (chunks) {
				if (element.clientHeight <= maxHeight) {
					if (splitOnChars.length >= 0 && splitChar !== '') {
						applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
						chunks = null;
					} else {
							return element.innerHTML;
						}
				}
			} else {
					if (splitChar === '') {
						applyEllipsis(target, '');
						target = getLastChild(element);

						reset();
					}
				}

			if (opt.animate) {
				setTimeout(function () {
					truncate(target, maxHeight);
				}, opt.animate === true ? 10 : opt.animate);
			} else {
				return truncate(target, maxHeight);
			}
		}

		function applyEllipsis(elem, str) {
			elem.nodeValue = str + opt.truncationChar;
		}

		if (clampValue == 'auto') {
			clampValue = getMaxLines();
		} else if (isCSSValue) {
			clampValue = getMaxLines(parseInt(clampValue));
		}

		var clampedText;
		if (supportsNativeClamp && opt.useNativeClamp) {
			sty.overflow = 'hidden';
			sty.textOverflow = 'ellipsis';
			sty.webkitBoxOrient = 'vertical';
			sty.display = '-webkit-box';
			sty.webkitLineClamp = clampValue;

			if (isCSSValue) {
				sty.height = opt.clamp + 'px';
			}
		} else {
			var height = getMaxHeight(clampValue);
			if (height <= element.clientHeight) {
				clampedText = truncate(getLastChild(element), height);
			}
		}

		return {
			'original': originalText,
			'clamped': clampedText
		};
	}

	module.exports = clamp;
})();

},{}],6:[function(require,module,exports){
'use strict';

/** @preserve jQuery animateNumber plugin v0.0.13
 * (c) 2013, Alexandr Borisov.
 * https://github.com/aishek/jquery-animateNumber
 */

(function ($) {
  var reverse = function (value) {
    return value.split('').reverse().join('');
  };

  var defaults = {
    numberStep: function (now, tween) {
      var floored_number = Math.floor(now),
          target = $(tween.elem);

      target.text(floored_number);
    }
  };

  var handle = function (tween) {
    var elem = tween.elem;
    if (elem.nodeType && elem.parentNode) {
      var handler = elem._animateNumberSetter;
      if (!handler) {
        handler = defaults.numberStep;
      }
      handler(tween.now, tween);
    }
  };

  if (!$.Tween || !$.Tween.propHooks) {
    $.fx.step.number = handle;
  } else {
    $.Tween.propHooks.number = {
      set: handle
    };
  }

  var extract_number_parts = function (separated_number, group_length) {
    var numbers = separated_number.split('').reverse(),
        number_parts = [],
        current_number_part,
        current_index,
        q;

    for (var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
      current_number_part = '';
      for (q = 0; q < group_length; q++) {
        current_index = i * group_length + q;
        if (current_index === separated_number.length) {
          break;
        }

        current_number_part = current_number_part + numbers[current_index];
      }
      number_parts.push(current_number_part);
    }

    return number_parts;
  };

  var remove_precending_zeros = function (number_parts) {
    var last_index = number_parts.length - 1,
        last = reverse(number_parts[last_index]);

    number_parts[last_index] = reverse(parseInt(last, 10).toString());
    return number_parts;
  };

  $.animateNumber = {
    numberStepFactories: {
      append: function (suffix) {
        return function (now, tween) {
          var floored_number = Math.floor(now),
              target = $(tween.elem);

          target.prop('number', now).text(floored_number + suffix);
        };
      },

      separator: function (separator, group_length, suffix) {
        separator = separator || ' ';
        group_length = group_length || 3;
        suffix = suffix || '';

        return function (now, tween) {
          var floored_number = Math.floor(now),
              separated_number = floored_number.toString(),
              target = $(tween.elem);

          if (separated_number.length > group_length) {
            var number_parts = extract_number_parts(separated_number, group_length);

            separated_number = remove_precending_zeros(number_parts).join(separator);
            separated_number = reverse(separated_number);
          }

          target.prop('number', now).text(separated_number + suffix);
        };
      }
    }
  };

  $.fn.animateNumber = function () {
    var options = arguments[0],
        settings = $.extend({}, defaults, options),
        target = $(this),
        args = [settings];

    for (var i = 1, l = arguments.length; i < l; i++) {
      args.push(arguments[i]);
    }

    if (options.numberStep) {
      var items = this.each(function () {
        this._animateNumberSetter = options.numberStep;
      });

      var generic_complete = settings.complete;
      settings.complete = function () {
        items.each(function () {
          delete this._animateNumberSetter;
        });

        if (generic_complete) {
          generic_complete.apply(this, arguments);
        }
      };
    }

    return target.animate.apply(target, args);
  };
})(jQuery);

},{}],7:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/account_success');

var AccountSuccessView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.customEvents, "updateEmail", this.updateEmail);

		this.render();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#signin-success-panel');
		return this;
	},

	updateEmail: function (msg) {
		this.$('.signin-success-email').html(msg.email);
	},

	close: function () {
		this.remove();
	}
});

module.exports = AccountSuccessView;

},{"../../../templates/precompiled/account_success":24,"./ParentView":19,"jquery":49}],8:[function(require,module,exports){
'use strict';

var ParentView = require('./ParentView'),
    BlockingCategory = require('./BlockingCategory'),
    html = require('../../../templates/precompiled/blocking_category');

var BlockingCategories = ParentView.extend({
	customEvents: {},

	initialize: function (options) {
		this.customEvents = options.customEvents;
	},

	render: function () {
		this.closeViews();
		this.views = [];
		this.$el.html('');
		this.collection.each(category => {
			var blockingCategory = new BlockingCategory({
				model: category,
				customEvents: this.customEvents
			});
			this.$el.append(blockingCategory.render(html).el);
			this.views.push(blockingCategory);
		});

		return this;
	},

	close: function () {
		this.closeViews();
		if (this.collection) {
			this.collection.close();
		}
		this.remove();
	},
	closeViews: function () {
		if (this.views) {
			this.views.forEach(view => {
				view.close();
			});
		}
	}
});

module.exports = BlockingCategories;

},{"../../../templates/precompiled/blocking_category":25,"./BlockingCategory":9,"./ParentView":19}],9:[function(require,module,exports){
'use strict';

var ParentView = require('./ParentView'),
    Collections = require('../collections/Collections'),
    BlockingTrackers = require('./BlockingTrackers');

var BlockingCategory = ParentView.extend({
	tagName: 'div',
	customEvents: {},
	events: {},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'change:trackers', this.updateTrackers);
		this.listenTo(this.model, 'change:num_shown', this.updateNumShown);
		this.listenTo(this.model, 'change:num_blocked', this.updateNumBlocked);
	},

	render: function (template) {
		this.model.set('num_shown', this.model.get('num_total'));
		this.$el.html(template(this.model.toJSON()));
		this.$el.addClass('blocking-category');

		this.closeTrackers();
		this.trackersView = new BlockingTrackers({
			collection: new Collections.BlockingTrackers(),
			el: this.$('.trackers-list'),
			customEvents: this.customEvents
		});

		this.model.trigger('change:trackers change:num_shown change:num_blocked');
		return this;
	},

	updateTrackers: function () {
		var trackers = this.model.get('trackers') || {};

		this.trackersView.collection.buildCollectionData(trackers);
		this.trackersView.render();
	},
	updateNumShown: function () {
		var num_shown = this.model.get('num_shown');
		this.$el.css('display', num_shown === 0 ? 'none' : '');
	},
	updateNumBlocked: function () {
		var num_blocked = this.model.get('num_blocked');

		this.$('.blocked-count .count').text(num_blocked);
		this.$('.blocked-count').css('display', num_blocked === 0 ? 'none' : '');

		this.customEvents.trigger('refreshStickyHeader');
	},

	close: function () {
		this.closeTrackers();
		this.remove();
	},
	closeTrackers: function () {
		if (this.trackersView) {
			this.trackersView.close();
		}
	}
});

module.exports = BlockingCategory;

},{"../collections/Collections":2,"./BlockingTrackers":11,"./ParentView":19}],10:[function(require,module,exports){
(function (global){
'use strict';

global.$ = global.jQuery = require('jquery');
require('foundation');

var ParentView = require('./ParentView'),
    $clamp = require('../vendor/clamp.custom.js'),
    common = require('../../../../src/utils/common'),
    log = common.log;

var BlockingTracker = ParentView.extend({
	tagName: 'div',
	customEvents: {},
	events: {
		'click .svg-container .status': 'clickSvgStatus',
		'click .svg-container .trust': 'clickSvgTrust',
		'click .svg-container .restrict': 'clickSvgRestrict',
		'click .trk-name': 'toggleDescription',
		'click a': 'clickLink'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'change:shouldShow', this.updateShouldShow);
		this.listenTo(this.model, 'change:blocked', this.updateBlocked);
		this.listenTo(this.model, 'change:ss_allowed', this.updateSsAllowed);
		this.listenTo(this.model, 'change:ss_blocked', this.updateSsBlocked);
		this.listenTo(this.model, 'change:description', this.updateDescription);
		this.listenTo(this.model, 'change:warningCompatibility change:warningInsecure change:warningSlow', this.updateWarnings);
	},

	render: function (trackerDiv, template_more) {
		this.setElement(trackerDiv);
		this.template_more = template_more;

		if (App.BROWSER_INFO.name === 'firefox' || App.BROWSER_INFO.name === 'edge') {
			this.$('.tracker-tooltip').foundation();
			this.$('.warning-image').foundation();
		}

		this.model.trigger('change:blocked change:ss_allowed change:ss_blocked change:warningCompatibility');

		return this;
	},

	updateShouldShow: function () {
		var shouldShow = this.model.get('shouldShow');
		this.$el.css('display', shouldShow ? '' : 'none');
	},
	updateBlocked: function () {
		var blocked = this.model.get('blocked');
		if (blocked) {
			this.$el.addClass('blocked');
		} else {
			this.$el.removeClass('blocked');
		}
	},
	updateSsAllowed: function () {
		var ssAllowed = this.model.get('ss_allowed');
		if (ssAllowed) {
			this.$el.addClass('individual-trust');
		} else {
			this.$el.removeClass('individual-trust');
		}
	},
	updateSsBlocked: function () {
		var ssBlocked = this.model.get('ss_blocked');
		if (ssBlocked) {
			this.$el.addClass('individual-restrict');
		} else {
			this.$el.removeClass('individual-restrict');
		}
	},
	updateDescription: function () {
		var description = this.model.get('description'),
		    learnMoreLink = 'https://apps.ghostery.com/en/apps/' + encodeURIComponent(this.model.get('name').replace(/\s+/g, '_').toLowerCase());

		if (!description) {
			description = t('tracker_description_none_found');
		}

		this.$('.trk-description').text(description);
		$clamp(this.$('.trk-description')[0], {
			clamp: 4,
			useNativeClamp: false,
			splitOnChars: ['.', ',', ' ']
		});
		this.$('.trk-description').append('<br><a target="_blank" title="' + learnMoreLink + '" href="' + learnMoreLink + '">' + t('tracker_description_learn_more') + '</a>');
		this.customEvents.trigger('toggleTrackerDescription');
	},
	updateShowTrackerUrls: function () {
		var showTrackerUrls = this.model.get('showTrackerUrls');
		if (!showTrackerUrls) {
			this.$('.trk-srcs-title, .trk-srcs').css('display', 'none');
		}
	},
	updateWarnings: function () {
		var warningCompatibility = this.model.get('warningCompatibility') || false,
		    warningInsecure = this.model.get('warningInsecure') || false,
		    warningSlow = this.model.get('warningSlow') || false;

		this.$el.removeClass('warning compatibility insecure slow');
		this.$('.warning-image').attr('title', '');
		$('.tooltip.warning-tooltip.' + this.model.get('id')).css('opacity', 0).text('');
		if (warningCompatibility) {
			this.$el.addClass('warning compatibility');
			this.$('.warning-image').attr('title', t('panel_tracker_warning_compatibility_tooltip'));
			$('.tooltip.warning-tooltip.' + this.model.get('id')).css('opacity', 0.75).text(t('panel_tracker_warning_compatibility_tooltip'));
		} else if (warningInsecure && warningSlow) {
			this.$el.addClass('warning insecure slow');
			this.$('.warning-image').attr('title', t('panel_tracker_warning_slow_nonsecure_tooltip'));
			$('.tooltip.warning-tooltip.' + this.model.get('id')).css('opacity', 0.75).text(t('panel_tracker_warning_slow_nonsecure_tooltip'));
		} else if (warningInsecure) {
			this.$el.addClass('warning insecure');
			this.$('.warning-image').attr('title', t('panel_tracker_warning_nonsecure_tooltip'));
			$('.tooltip.warning-tooltip.' + this.model.get('id')).css('opacity', 0.75).text(t('panel_tracker_warning_nonsecure_tooltip'));
		} else if (warningSlow) {
			this.$el.addClass('warning slow');
			this.$('.warning-image').attr('title', t('panel_tracker_warning_slow_tooltip'));
			$('.tooltip.warning-tooltip.' + this.model.get('id')).css('opacity', 0.75).text(t('panel_tracker_warning_slow_tooltip'));
		}
	},

	clickLink: function (event) {
		const url = event.target.href.toString();
		if (url.startsWith("http")) {
			event.preventDefault();
			this.sendMessage('openNewTab', { url: event.target.href, become_active: true });
			window.close();
		}
	},

	clickSvgStatus: function () {
		var blocked = !this.model.get('blocked');
		this.customEvents.trigger('toggleTrackerBlocked', {
			app_id: this.model.get('id'),
			blocked: blocked
		});
	},
	clickSvgTrust: function () {
		var ss_allowed = !this.model.get('ss_allowed');
		this.customEvents.trigger('toggleTrackerTrustRestrict', {
			app_id: this.model.get('id'),
			trust: ss_allowed,
			restrict: false
		});
		this.customEvents.trigger('setNeedsReload', { updated: this.model.get('id') + '_ss_allowed', last: "ss_allowed_" + this.model.get('ss_allowed') });
	},
	clickSvgRestrict: function () {
		var ss_blocked = !this.model.get('ss_blocked');
		this.customEvents.trigger('toggleTrackerTrustRestrict', {
			app_id: this.model.get('id'),
			trust: false,
			restrict: ss_blocked
		});
		this.customEvents.trigger('setNeedsReload', { updated: this.model.get('id') + '_ss_blocked', last: "ss_blocked_" + this.model.get('ss_blocked') });
	},
	toggleDescription: function () {
		if (!this.$('.trk-moreinfo').length) {
			$(this.template_more(this.model.toJSON())).insertAfter(this.$(".trk-header"));
			this.updateShowTrackerUrls();
		}
		this.$('.trk-moreinfo').toggle();

		if (this.model.get('description')) {
			this.updateDescription();
			return;
		}

		this.model.set('description', t('tracker_description_getting'));
		this.sendMessage('getTrackerDescription', {
			url: 'https://apps.ghostery.com/en/apps/' + encodeURIComponent(this.model.get('name').replace(/\s+/g, '_').toLowerCase()) + '?format=json'
		}).then(data => {
			this.model.set('description', data);
		}).catch(err => {
			log("Error loading tracker description", err);
		});
	},
	clickSignIn: function () {
		this.sendMessage('ping', 'sign_in');
		this.sendMessage('ping', 'sign_in_urls');
		window.location.hash = "#/login";
	},

	close: function () {
		this.remove();
	}
});

module.exports = BlockingTracker;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../src/utils/common":54,"../vendor/clamp.custom.js":5,"./ParentView":19,"foundation":42,"jquery":49}],11:[function(require,module,exports){
'use strict';

var ParentView = require('./ParentView'),
    BlockingTracker = require('./BlockingTracker'),
    _ = require('underscore');

var BlockingTrackers = ParentView.extend({
	customEvents: {},
	template: require('../../../templates/precompiled/blocking_tracker'),
	template_more: require('../../../templates/precompiled/blocking_tracker_more'),
	initialize: function (options) {
		this.customEvents = options.customEvents;
	},

	render: function () {
		this.closeViews();
		if (!_.size(this.collection)) {
			return;
		}

		this.views = [];
		var tracker = this.collection.at(0);
		var name = tracker.get('name');
		tracker.set('name', '@');
		var html = '<div class="blocking-trk">' + this.template(tracker.toJSON()) + '</div>';
		tracker.set('name', name);
		var trackers = '';
		this.collection.each(tracker => {
			let blockingTracker = new BlockingTracker({
				model: tracker,
				customEvents: this.customEvents
			});
			this.views.push(blockingTracker);

			let safeName = _.escape(tracker.get('name'));
			trackers += html.replace('@', safeName);
		});

		this.$el.html(trackers);
		var divArray = this.$('div.blocking-trk');

		setTimeout(() => {
			var index = 0;
			this.views.forEach(view => {
				view.render(divArray.eq(index), this.template_more);
				index++;
			});
		}, 0);

		return this;
	},

	close: function () {
		this.closeViews();
		if (this.collection) {
			this.collection.close();
		}
		this.remove();
	},
	closeViews: function () {
		if (this.views) {
			this.views.forEach(view => {
				view.close();
			});
		}
	}
});

module.exports = BlockingTrackers;

},{"../../../templates/precompiled/blocking_tracker":26,"../../../templates/precompiled/blocking_tracker_more":27,"./BlockingTracker":10,"./ParentView":19,"underscore":52}],12:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    Collections = require('../collections/Collections'),
    BlockingCategories = require('./BlockingCategories'),
    html = require('../../../templates/precompiled/blocking_view');

var BlockingView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'click .block-text, .header-checkbox': 'clickHeaderCheckbox'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;
		this.listenTo(this.customEvents, 'toggleTrackerBlocked', this.updateTrackerBlocked);
		this.listenTo(this.customEvents, 'toggleTrackerTrustRestrict', this.updateTrackerTrustRestrict);
		this.listenTo(this.customEvents, 'toggleTrackerDescription', this.stickyHeaders.updatePositions.bind(this.stickyHeaders));
		this.listenTo(this.customEvents, 'refreshStickyHeader', this.stickyHeaders.refresh.bind(this.stickyHeaders));

		this.listenTo(this.model, 'change:trackerList change:selected_app_ids', this.updateTrackers);
		this.listenTo(this.model, 'change:toggle_individual_trackers', this.updateToggleIndividualTrackers);
		this.listenTo(this.model, 'change:paused_blocking', this.updateGhosteryPaused);
		this.listenTo(this.model, 'change:sitePolicy', this.updateSitePolicy);

		this.render();

		this.model.trigger('change:toggle_individual_trackers change:paused_blocking change:sitePolicy');
		this.updateHeaderCheckbox();
		this.updateSummaryBlockingCount();
		this.stickyHeaders.init();
		this.scrollBarAlignments();
	},

	render: function () {
		$('#ghostery-content').append(this.template(this.model.toJSON()));
		this.setElement('#content-blocking');

		this.closeCategories();
		this.categoriesView = new BlockingCategories({
			collection: new Collections.BlockingCategories(),
			el: this.$('.blocking-trackers .scroll-content'),
			customEvents: this.customEvents
		});

		return this;
	},

	updateTrackers: function () {
		var selectedAppIds = this.model.get('selected_app_ids') || {},
		    pageHost = this.model.get('pageHost') || '',
		    toggleIndvTrks = this.model.get('toggle_individual_trackers') || false,
		    pageUnblocks = toggleIndvTrks && this.model.get('site_specific_unblocks')[pageHost] || [],
		    pageBlocks = toggleIndvTrks && this.model.get('site_specific_blocks')[pageHost] || [],
		    trackerList = this.model.get('trackerList') || [],
		    showTrackerUrls = this.getShowTrackerUrlsValue();

		this.categoriesView.collection.buildCollectionData(trackerList, selectedAppIds, pageUnblocks, pageBlocks, showTrackerUrls, this.model.get('language'));
		this.categoriesView.render();
		this.updateHeaderCheckbox();
	},
	updateToggleIndividualTrackers: function () {
		var toggle_individual_trackers = this.model.get('toggle_individual_trackers');

		if (toggle_individual_trackers) {
			this.$('.blocking-trackers').addClass('show-individual');
		} else {
			this.$('.blocking-trackers').removeClass('show-individual');
		}
		this.model.trigger('change:trackerList');
	},
	updateGhosteryPaused: function () {
		var ghosteryPaused = this.model.get('paused_blocking');
		if (ghosteryPaused) {
			this.$('.blocking-trackers').addClass('paused');
			this.$('.blocking-trackers svg.status title').text('');
			$('.status-tooltip').css('opacity', 0);
		} else {
			this.$('.blocking-trackers').removeClass('paused');
			this.$('.blocking-trackers svg.status title').text(t('panel_tracker_block_tooltip'));
			$('.status-tooltip').css('opacity', 0.75);
		}
		this.updateHeaderCheckboxDisabled();
	},
	updateSitePolicy: function () {
		var sitePolicy = this.model.get('sitePolicy');

		this.$('.blocking-trackers').removeClass('trusted restricted');
		if (sitePolicy) {
			this.$('.blocking-trackers').addClass(sitePolicy === 2 ? 'trusted' : 'restricted');
			this.$('.blocking-trackers svg.status title').text('');
			$('.status-tooltip').css('opacity', 0);
		} else {
			this.$('.blocking-trackers svg.status title').text(t('panel_tracker_block_tooltip'));
			$('.status-tooltip').css('opacity', 0.75);
		}

		this.categoriesView.views.forEach(category => {
			category.model.set('num_blocked', sitePolicy === 1 ? category.model.get('num_total') : category.trackersView.collection.countBlocked());
		});
		this.updateHeaderCheckboxDisabled();
	},
	getShowTrackerUrlsValue: function () {
		var show_tracker_urls = this.model.get('show_tracker_urls');
		if (!show_tracker_urls) {
			return false;
		}
		return true;
	},
	updateHeaderCheckboxDisabled: function () {
		var sitePolicy = this.model.get('sitePolicy'),
		    ghosteryPaused = this.model.get('paused_blocking');

		if (sitePolicy || ghosteryPaused) {
			this.$('.block-text, .header-checkbox').addClass('disabled');
		} else {
			this.$('.block-text, .header-checkbox').removeClass('disabled');
		}
	},

	updateTrackerBlocked: function (message) {
		var trackerList = this.model.get('trackerList'),
		    selectedAppIds = this.model.get('selected_app_ids'),
		    sitePolicy = this.model.get('sitePolicy'),
		    ghosteryPaused = this.model.get('paused_blocking');

		if (sitePolicy || ghosteryPaused) {
			return;
		}

		this.customEvents.trigger('setNeedsReload', { updated: message.app_id + '_blocked', last: 'blocked_' + message.blocked });

		if (message.blocked) {
			selectedAppIds[message.app_id] = 1;
		} else {
			delete selectedAppIds[message.app_id];
		}
		this.model.set('selected_app_ids', selectedAppIds);
		this.model.save();

		trackerList.forEach(tracker => {
			if (tracker.id === message.app_id) {
				tracker.blocked = message.blocked;
				return;
			}
		});
		this.model.set('trackerList', trackerList);
		this.categoriesView.views.forEach(category => {
			var collection = category.trackersView.collection;
			collection.setBlocked(message.app_id, message.blocked);
			category.model.set('num_blocked', collection.countBlocked());
		});
		this.updateSummaryBlockingCount();
		this.updateHeaderCheckbox();
	},
	updateTrackerTrustRestrict: function (message) {
		var trackerList = this.model.get('trackerList'),
		    siteSpecificUnblocks = this.model.get('site_specific_unblocks') || {},
		    siteSpecificBlocks = this.model.get('site_specific_blocks') || {},
		    pageHost = this.model.get('pageHost') || '',
		    app_id = +message.app_id,
		    pageUnblocks = siteSpecificUnblocks[pageHost] || [],
		    pageBlocks = siteSpecificBlocks[pageHost] || [];

		if (message.trust) {
			if (pageUnblocks.indexOf(app_id) === -1) {
				pageUnblocks.push(app_id);
			}
		} else {
			if (pageUnblocks.indexOf(app_id) >= 0) {
				pageUnblocks.splice(pageUnblocks.indexOf(app_id), 1);
			}
		}
		siteSpecificUnblocks[pageHost] = pageUnblocks;
		if (message.restrict) {
			if (pageBlocks.indexOf(app_id) === -1) {
				pageBlocks.push(app_id);
			}
		} else {
			if (pageBlocks.indexOf(app_id) >= 0) {
				pageBlocks.splice(pageBlocks.indexOf(app_id), 1);
			}
		}
		siteSpecificBlocks[pageHost] = pageBlocks;
		this.model.set('site_specific_unblocks', siteSpecificUnblocks);
		this.model.set('site_specific_blocks', siteSpecificBlocks);
		this.model.save();

		trackerList.forEach(tracker => {
			if (tracker.id === message.app_id) {
				tracker.ss_allowed = message.trust;
				tracker.ss_blocked = message.restrict;
				return;
			}
		});
		this.model.set('trackerList', trackerList);
		this.categoriesView.views.forEach(category => {
			var collection = category.trackersView.collection;
			collection.setTrustRestrict(message.app_id, message.trust, message.restrict);
			category.model.set('num_blocked', collection.countBlocked());
		});
		this.updateSummaryBlockingCount();
	},
	updateHeaderCheckbox: function () {
		var totalShownBlocked = 0,
		    allShownBlocked = true,
		    allShown = true;

		this.categoriesView.views.forEach(category => {
			var collection = category.trackersView.collection;
			totalShownBlocked += collection.countShownBlocked();
			allShownBlocked = allShownBlocked && collection.checkShownBlocked();
			allShown = allShown && collection.checkAllShown();
		});

		this.$('.block-text').text(allShown ? t('blocking_block_all') : t('blocking_block_shown'));

		this.$('.header-checkbox').removeClass('all-blocked some-blocked');
		if (totalShownBlocked && allShownBlocked) {
			this.$('.header-checkbox').addClass('all-blocked');
		} else if (totalShownBlocked) {
			this.$('.header-checkbox').addClass('some-blocked');
		}
	},

	clickHeaderCheckbox: function () {
		var selectedAppIds = this.model.get('selected_app_ids'),
		    checkbox = this.$('.header-checkbox');

		if (checkbox.hasClass('disabled')) {
			return;
		}

		this.categoriesView.views.forEach(category => {
			var collection = category.trackersView.collection;
			if (checkbox.hasClass('all-blocked')) {
				collection.setShownBlocked(false);
				collection.models.forEach(tracker => {
					delete selectedAppIds[tracker.get('id')];
				});
			} else {
				collection.setShownBlocked(true);
				collection.models.forEach(tracker => {
					if (tracker.get('shouldShow')) {
						selectedAppIds[tracker.get('id')] = true;
					}
				});
			}
			category.model.set('num_blocked', collection.countBlocked());
		});
		this.model.set('selected_app_ids', selectedAppIds);
		this.model.save();
		if (checkbox.hasClass('all-blocked')) {
			this.customEvents.trigger('setNeedsReload', { updated: this.model.get('selected_app_ids'), last: 'unblock_all' });
		} else {
			this.customEvents.trigger('setNeedsReload', { updated: this.model.get('selected_app_ids'), last: 'block_all' });
		}
		this.updateSummaryBlockingCount();
		this.updateHeaderCheckbox();
	},

	updateSummaryBlockingCount: function () {
		var numTotal = 0,
		    numTotalBlocked = 0,
		    numTotalSsBlocked = 0,
		    numTotalSsUnblocked = 0;

		this.categoriesView.views.forEach(category => {
			var collection = category.trackersView.collection;
			numTotal += collection.countTotal();
			numTotalBlocked += collection.countBlocked();
			numTotalSsBlocked += collection.countSsBlocked();
			numTotalSsUnblocked += collection.countSsUnblocked();
		});
		this.customEvents.trigger('updateTotalBlocked', {
			num_total: numTotal,
			num_blocked: numTotalBlocked,
			num_ss_blocked: numTotalSsBlocked,
			num_ss_allowed: numTotalSsUnblocked
		});
	},

	filterTrackers: function (filter) {
		if (!filter) {
			return;
		}

		if (filter.type === 'trackers' && filter.name === 'all') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setShow(true);
				category.model.set('num_shown', num_returned);
			});
		} else if (filter.type === 'trackers' && filter.name === 'blocked') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setBlockedShow();
				category.model.set('num_shown', num_returned);
			});
		} else if (filter.type === 'trackers' && filter.name === 'warning') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setWarningShow();
				category.model.set('num_shown', num_returned);
			});
		} else if (filter.type === 'trackers' && filter.name === 'warning-compatibility') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setWarningCompatibilityShow();
				category.model.set('num_shown', num_returned);
			});
		} else if (filter.type === 'trackers' && filter.name === 'warning-slow-insecure') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setWarningSlowInsecureShow();
				category.model.set('num_shown', num_returned);
			});
		} else if (filter.type === 'category') {
			this.categoriesView.views.forEach(category => {
				var num_returned = category.trackersView.collection.setShow(category.model.get('id') === filter.name ? true : false);
				category.model.set('num_shown', num_returned);
			});
		}

		this.updateHeaderCheckbox();
	},

	close: function () {
		if (App.BROWSER_INFO.name === 'firefox') {
			$('.tooltip.blocking-tooltip').remove();
			$('.tooltip.warning-tooltip').remove();
		}
		this.closeCategories();
		this.remove();
	},
	closeCategories: function () {
		if (this.categoriesView) {
			this.categoriesView.close();
		}
	},
	scrollBarAlignments: function () {
		let scrollBarWidth = this.getScrollBarWidth(),
		    headerPadding = +this.$('.blocking-header').css('padding-right').slice(0, -2);
		this.$('.blocking-header').css('padding-right', scrollBarWidth + headerPadding);
		this.stickyHeaders._$wrapperEl.css('right', scrollBarWidth);
	},
	getScrollBarWidth: function () {
		var $outer = $('<div>').css({ visibility: 'hidden', width: 100, overflow: 'scroll' }).appendTo('body'),
		    widthWithScroll = $('<div>').css({ width: '100%' }).appendTo($outer).outerWidth();
		$outer.remove();
		return 100 - widthWithScroll;
	},
	stickyHeaders: {
		_positions: [],
		_height: null,
		_current: null,
		_$scrollEl: null,
		_$wrapperEl: null,
		_generate: function (index) {
			return this._$scrollEl.find('.sticky-category:visible').eq(index).clone();
		},
		_update: function (newPos, offset) {
			if (this._current !== newPos) {
				let newHeader = this._generate(newPos);
				this._$wrapperEl.empty().append(newHeader);
				this._current = newPos;
			}
			if (offset > 0 && offset <= this._height) {
				this._$wrapperEl.find('.sticky-category').css('margin-top', offset - this._height).addClass('sliding');
			} else {
				this._$wrapperEl.find('.sticky-category').css('margin-top', '0').removeClass('sliding');
			}
		},
		updatePositions: function () {
			if (App.BROWSER_INFO.name === 'firefox') {
				return;
			}
			this._positions = [];
			var that = this,
			    scrollTop = this._$scrollEl.scrollTop();
			this._$scrollEl.find('.sticky-category:visible').each(function () {
				let topOffset = $(this).position().top;
				that._positions.push(topOffset + scrollTop);
			});
			this._height = $('.sticky-category:visible').outerHeight();
		},
		refresh: function () {
			if (App.BROWSER_INFO.name === 'firefox' || !this._$wrapperEl) {
				return;
			}
			this.updatePositions();
			let newHeader = this._generate(this._current);
			this._$wrapperEl.empty().append(newHeader);
		},
		init: function () {
			this._$scrollEl = $('.blocking-trackers .scroll-content');
			this._$wrapperEl = $('.blocking-trackers .wrapper');
			this.updatePositions();
			this._$scrollEl.on('scroll', () => {
				let pos = this._$scrollEl.scrollTop(),
				    offset = 0,
				    newPos;
				for (let i = 0, len = this._positions.length; i < len; i++) {
					if (i === len - 1) {
						newPos = i;
					} else {
						if (pos >= this._positions[i] && pos < this._positions[i + 1]) {
							offset = this._positions[i + 1] - pos;
							newPos = i;
							break;
						}
					}
				}
				this._update(newPos, offset);
			});
		}
	}
});

module.exports = BlockingView;

},{"../../../templates/precompiled/blocking_view":28,"../collections/Collections":2,"./BlockingCategories":8,"./ParentView":19,"jquery":49}],13:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/create_account_view'),
    common = require('../../../../src/utils/common'),
    log = common.log,
    decodeJwt = common.decodeJwt;

var CreateAccountView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'click #create-account-button': 'createAccount',
		'keypress input': 'createAccountCheckForEnter',
		'click #accept-privacy': 'acceptPrivacy',
		'click a': 'clickLink'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'invalid', this.handleModelValidationError);
		this.render();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#create-account-panel');

		this.customEvents.trigger('setHeader', {
			showBack: true
		});

		this.sendMessage('ping', 'create_start');

		return this;
	},

	clickLink: function (event) {
		const url = event.target.href.toString();
		if (url.startsWith("http")) {
			event.preventDefault();
			this.sendMessage('openNewTab', { url: event.target.href, become_active: true });
			window.close();
		}
	},

	createAccount: function () {
		var VERIFICATION_URL = 'https://signon.' + App.GHOSTERY_DOMAIN + '.com/register/verify/';
		var REDIRECT_URL = 'https://extension.' + App.GHOSTERY_DOMAIN + '.com/' + this.model.get('language') + '/settings/';

		$('#create-account-email-confirm').removeClass('panel-error');
		var email = $('input[name=email]').val().toLowerCase();
		var confirm = $('input[name=emailConfirm]').val().toLowerCase();
		var firstName = $('input[name=firstName]').val();
		var lastName = $('input[name=lastName]').val();
		var pwd = $('input[name=password]').val();

		$('#create-account-panel').css('cursor', 'wait');
		$('#create-account-button').css('cursor', 'wait');

		this.model.set({
			EmailAddress: email,
			ConfirmEmailAddress: confirm,
			Password: pwd,
			ModifyingUserId: email,
			FirstName: firstName,
			LastName: lastName,
			UserType: 2,
			KeepUpdatedOnProductReleases: true,
			ValidationRedirectUrlToAddCodeSuffixOn: VERIFICATION_URL,
			FooterUrl: VERIFICATION_URL,
			VerificationContinueUrl: REDIRECT_URL
		});
		var _that = this;
		this.model.save({}, {
			validate: true,
			success: function (model, response, options) {
				if (response.UserId !== null && response.Token !== null) {
					var decodedToken = decodeJwt(response.Token);

					if (decodedToken && decodedToken.payload) {
						_that.sendMessage('setLoginInfo', {
							user_token: response.Token,
							decoded_user_token: decodedToken.payload
						}).then(data => {
							$('#create-account-panel').css('cursor', 'default');
							$('#create-account-button').css('cursor', 'pointer');

							_that.customEvents.trigger('resetCollection');

							_that.customEvents.trigger('setNotification', {
								text: t('panel_email_verification_sent', email),
								classes: 'success'
							});

							_that.sendMessage('ping', 'create_finish');
							window.location = "#/account-success";
						}).catch(err => {
							log('CreateAccountView setLoginInfo error', err);

							$('#create-account-panel').css('cursor', 'default');
							$('#create-account-button').css('cursor', 'pointer');
							_that.customEvents.trigger('setNotification', {
								text: t('server_error_message'),
								classes: 'alert'
							});
						});
					}
				} else {
					log('CreateAccountView success callback error', response);

					$('#create-account-panel').css('cursor', 'default');
					$('#create-account-button').css('cursor', 'pointer');

					if (response.Message.indexOf('User with email address') === 0) {
						_that.customEvents.trigger('setNotification', {
							text: t('email_address_in_use'),
							classes: 'alert'
						});
					} else {
						_that.customEvents.trigger('setNotification', {
							text: t('server_error_message'),
							classes: 'alert'
						});
					}
				}
			},

			error: function (model, response, options) {
				log('CreateAccountView error callback', response);

				$('#create-account-panel').css('cursor', 'default');
				$('#create-account-button').css('cursor', 'pointer');

				_that.customEvents.trigger('setNotification', {
					text: t('server_error_message'),
					classes: 'alert'
				});
			}
		});
	},

	acceptPrivacy: function (e) {
		var submitButton = this.$('#create-account-button');
		var errorMessage = $("#create-account-privacy-container");
		if (e.target.checked) {
			submitButton.removeClass('disabled');
			errorMessage.removeClass("panel-error");
		} else {
			submitButton.addClass('disabled');
			errorMessage.addClass("panel-error");
		}
	},

	createAccountCheckForEnter: function (e) {
		if (e.keyCode === 13) {
			this.createAccount();
		}
	},

	handleModelValidationError: function (model, error) {
		log("CreateAccountView handleModelValidationError error", error);

		$('#create-account-panel').css('cursor', 'default');
		$('#create-account-button').css('cursor', 'pointer');
		$('#create-account-password, #create-account-email, #create-account-email-confirm').removeClass('panel-error');
		$('#password-length-requirement, #password-characters-requirement').hide();

		switch (error) {
			case 'ERR_INVALID_EMAIL':
				$('#create-account-email').addClass('panel-error');
				break;
			case 'ERR_INVALID_EMAIL_CONFIRM':
				$('#create-account-email-confirm').addClass('panel-error');
				break;
			case 'ERR_INVALID_PWD':
				$('#create-account-password').addClass('panel-error');
				$('#password-characters-requirement').show();
				break;
			case 'ERR_INVALID_PWD_TOO_SHORT':
				$('#create-account-password').addClass('panel-error');
				$('#password-length-requirement').show();
				break;
		}
	},

	close: function () {
		this.remove();
	}
});

module.exports = CreateAccountView;

},{"../../../../src/utils/common":54,"../../../templates/precompiled/create_account_view":29,"./ParentView":19,"jquery":49}],14:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/forgot_password'),
    log = require('../../../../src/utils/common').log;

var ForgotPasswordView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'keypress input': 'forgotPasswordCheckForEnter',
		'click #send-button': 'sendEmail'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'invalid', this.handleModelValidationError);
		this.render();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#forgot-password-panel');

		$('#forgot-email').removeClass('panel-error no-email server-error');

		return this;
	},

	forgotPasswordCheckForEnter: function (e) {
		if (e.keyCode === 13) {
			this.sendEmail();
		}
	},

	sendEmail: function () {
		var _that = this;
		var FORGOT_PASSWORD_URL = 'https://signon.' + App.GHOSTERY_DOMAIN + '.com/password/reset/';

		var email = $('input[name=email]').val().toLowerCase();
		$('#forgot-email').removeClass('panel-error no-email server-error');
		$('#forgot-password-panel').css('cursor', 'wait');
		$('#send-button').css('cursor', 'wait');
		this.model.set({
			EmailAddress: email,
			RedirectUrlToAddCodeSuffixOn: FORGOT_PASSWORD_URL,
			FooterUrl: FORGOT_PASSWORD_URL
		});
		this.model.save({}, {
			validate: true,

			success: function (model, response, options) {
				$('#forgot-password-panel').css('cursor', 'default');
				$('#send-button').css('cursor', 'pointer');
				if (response.succeeded === true) {
					_that.customEvents.trigger('setNotification', {
						text: t("banner_check_your_email_title"),
						classes: 'success'
					});

					setTimeout(function () {
						window.location = "#/login";
					}, 2000);
				} else {
					log('ForgotPasswordView sendEmail success callback error', response);
					_that.customEvents.trigger('setNotification', {
						text: t('server_error_message'),
						classes: 'alert'
					});
				}
			},
			error: function (model, response, options) {
				log('ForgotPasswordView sendEmail error callback', response.status, response.statusText);
				$('#forgot-password-panel').css('cursor', 'default');
				$('#send-button').css('cursor', 'pointer');
				if (response.status === 400) {
					$('#forgot-email').addClass('panel-error server-error');
				} else {
					_that.customEvents.trigger('setNotification', {
						text: t('server_error_message'),
						classes: 'alert'
					});
				}
			}
		});
	},

	close: function () {
		this.remove();
	},

	handleModelValidationError: function (model, error) {
		log("ForgotPasswordView handleModelValidationError error " + error);

		$('#forgot-password-panel').css('cursor', 'default');
		$('#send-button').css('cursor', 'pointer');
		if (error) {
			$('#forgot-email').addClass('panel-error invalid-email');
		}
	}
});

module.exports = ForgotPasswordView;

},{"../../../../src/utils/common":54,"../../../templates/precompiled/forgot_password":30,"./ParentView":19,"jquery":49}],15:[function(require,module,exports){
(function (global){
'use strict';

global.$ = global.jQuery = require('jquery');
require('foundation');

var ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/header_view'),
    log = require('../../../../src/utils/common').log;

var HeaderView = ParentView.extend({
	el: '#ghostery-header',
	template: html,
	customEvents: {},
	events: {
		'click .header-back': 'windowHistoryBack',
		'click .header-helper-text': 'clickSignInVerify',
		'click .menu-settings': 'clickSettings',
		'click .menu-advanced-settings': 'clickAdvancedSettings',
		'click .menu-broken-page': 'clickBrokenPage',
		'click .menu-submit-tracker': 'clickSubmitTracker',
		'click .menu-help': 'clickHelp',
		'click .signed-in-as': 'clickSignedInAs',
		'click .menu-signin': 'clickSignIn',
		'click .menu-signout': 'clickSignOut',
		'click .header-kebab': 'clickKebab'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;
		this.listenTo(this.customEvents, 'setHeader', this.setHeader);

		this.listenTo(this.model, 'change:logged_in change:is_validated change:email', this.updateSignInText);

		this.render();
	},

	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.updateSignInText();
		return this;
	},

	updateSignInText: function () {
		var logged_in = this.model.get('logged_in'),
		    is_validated = this.model.get('is_validated'),
		    email = this.model.get('email');

		if (!logged_in) {
			this.$('.header-helper-text').css('display', '');
			this.$('.header-helper-text').text(t('panel_header_sign_in'));
		} else if (!is_validated) {
			this.$('.header-helper-text').css('display', '');
			this.$('.header-helper-text').text(t('panel_header_verify_account'));
		} else {
			this.$('.header-helper-text').text('');
			this.$('.header-helper-text').css('display', 'none');
		}

		if (logged_in) {
			this.$('.signed-in-as, .menu-signout').css('display', '');
			this.$('.menu-signin').css('display', 'none');
			this.$('.signed-in-as span').text(email).attr('title', email);
		} else {
			this.$('.signed-in-as, .menu-signout').css('display', 'none');
			this.$('.menu-signin').css('display', '');
		}
	},

	setHeader: function (opts) {
		this.$('.header-logo').css('cursor', opts && opts.hideBack ? 'default' : 'auto');
		this.$('.header-back').toggle(opts && opts.showBack ? true : false);
		this.$('.header-kebab').css('display', opts && opts.hideKebab ? 'none' : '');
	},

	windowHistoryBack: function () {
		window.history.back();
	},
	clickSignInVerify: function () {
		if (!this.model.get('logged_in')) {
			this.sendMessage('ping', 'sign_in');
			window.location.hash = "#/login";
		} else if (!this.model.get('is_validated')) {
			this.sendMessage('sendVerificationEmail').then(data => {
				this.customEvents.trigger('setNotification', {
					classes: 'success',
					text: t('panel_email_verification_sent', data.email)
				});
			}).catch(function (err) {
				log('SendVerificationEmail Error', err);
			});
		}
	},
	clickSettings: function () {
		window.location.hash = "#/settings";
		this.$('#header-dropdown').foundation('close');
		this.sendMessage('ping', 'local_settings');
	},
	clickAdvancedSettings: function () {
		this.sendMessage('openNewTab', {
			url: 'https://extension.' + App.GHOSTERY_DOMAIN + '.com/' + this.model.get('language') + '/settings',
			tab_id: +this.model.get('tab_id'),
			become_active: true
		});
		window.close();
	},
	clickBrokenPage: function () {
		this.sendMessage('getSiteData').then(data => {
			var body = 'PLEASE INCLUDE A DESCRIPTION AND A PICTURE OF THE ISSUE YOU ARE EXPERIENCING:' + '\r\n\r\n\r\n\r\n\r\n\r\n' + 'URL: ' + data.url + '\r\n' + 'Ghostery version: ' + data.extensionVersion + '\r\n' + 'Database Version: ' + data.dbVersion + '\r\n' + 'Browser name: ' + data.browserDisplayName + '\r\n' + 'Browser version: ' + data.browserVersion + '\r\n' + 'Language: ' + data.language + '\r\n' + 'OS: ' + data.os + '\r\n';

			data.categories.forEach(category => {
				var trackersAllowed = [],
				    trackersBlocked = [];

				category.trackers.forEach(tracker => {
					if (tracker.blocked) {
						trackersBlocked.push(tracker.name);
					} else {
						trackersAllowed.push(tracker.name);
					}
				});

				body += '\r\nCategory: ' + category.name + '\r\n' + 'Allowed Trackers: ' + trackersAllowed + '\r\n' + 'Blocked Trackers: ' + trackersBlocked + '\r\n';
			});

			var url = "mailto:support@ghostery.com?body=" + encodeURIComponent(body) + "&subject=Broken Page Report";
			this.sendMessage('openNewTab', {
				url: url,
				become_active: true
			});
		}).catch(err => {
			log("Error gathering page data");
		});
		this.$('#header-dropdown').foundation('close');
		window.close();
	},

	clickSubmitTracker: function () {
		this.sendMessage('openNewTab', {
			url: 'https://www.ghostery.com/support/submit-tracker/',
			become_active: true
		});
		window.close();
	},
	clickHelp: function () {
		this.$('#header-dropdown').foundation('close');
		window.location.hash = "#/help";
	},
	clickSignedInAs: function () {
		this.sendMessage('openNewTab', {
			url: 'https://account.' + App.GHOSTERY_DOMAIN + '.com/',
			become_active: true
		});
		window.close();
	},
	clickSignIn: function () {
		this.sendMessage('ping', 'sign_in');
		this.$('#header-dropdown').foundation('close');
		window.location.hash = "#/login";
	},
	clickSignOut: function () {
		this.$('#header-dropdown').foundation('close');
		this.sendMessage('setLoginInfo', {}).then(data => {
			this.customEvents.trigger('updateLoginInfo', data);
		}).catch(err => {
			log('HeaderView clickSignOut setLoginInfo returned with an error', err);
		});
	},

	clickKebab: function () {
		let template_menu = require('../../../templates/precompiled/header_menu_view');
		if (!this.$('#header-dropdown').length) {
			$(template_menu(this.model.toJSON())).insertAfter(this.$(".header-kebab"));
			$(document).foundation();

			var logged_in = this.model.get('logged_in'),
			    email = this.model.get('email');

			if (logged_in) {
				this.$('.signed-in-as, .menu-signout').css('display', '');
				this.$('.menu-signin').css('display', 'none');
				this.$('.signed-in-as span').text(email).attr('title', email);
			} else {
				this.$('.signed-in-as, .menu-signout').css('display', 'none');
				this.$('.menu-signin').css('display', '');
			}
		}
	},

	close: function () {
		this.remove();
	}
});

module.exports = HeaderView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../src/utils/common":54,"../../../templates/precompiled/header_menu_view":32,"../../../templates/precompiled/header_view":33,"./ParentView":19,"foundation":42,"jquery":49}],16:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/help_view');

var HelpView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'click a': 'clickLink'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.render();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#content-help');

		this.customEvents.trigger('setHeader', {
			showBack: true
		});
		return this;
	},

	clickLink: function (event) {
		event.preventDefault();
		this.sendMessage('openNewTab', { url: event.target.href, become_active: true });
		window.close();
	},

	close: function () {
		this.remove();
	}
});

module.exports = HelpView;

},{"../../../templates/precompiled/help_view":34,"./ParentView":19,"jquery":49}],17:[function(require,module,exports){
'use strict';

var $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/login_view'),
    common = require('../../../../src/utils/common'),
    log = common.log,
    decodeJwt = common.decodeJwt;

var LoginView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'click #signin-button': 'showSigninResult',
		'keypress input': 'signinCheckForEnter',
		'click a': 'clickLink'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'invalid', this.handleModelValidationError);
		this.render();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#signin-panel');
		this.customEvents.trigger('setHeader', {
			showBack: true
		});

		return this;
	},

	clickLink: function (event) {
		const url = event.target.href.toString();
		if (url.startsWith("http")) {
			event.preventDefault();
			this.sendMessage('openNewTab', { url: event.target.href, become_active: true });
			window.close();
		}
	},

	showSigninResult: function () {
		var _that = this;
		var email = $('input[name=email]').val().toLowerCase();
		var pwd = $('input[name=password]').val();

		$('#signin-panel').css('cursor', 'wait');
		$('#signin-button').css('cursor', 'wait');

		$('#login-email').removeClass('panel-error');
		$('#login-password').removeClass('panel-error');

		this.model.set({
			EmailAddress: email,
			Password: pwd
		});

		this.model.save({}, {
			validate: true,
			success: function (model, response, options) {
				if (response.UserId !== null && response.Token !== null) {
					var decodedToken = decodeJwt(response.Token);

					if (decodedToken && decodedToken.payload) {
						_that.sendMessage('setLoginInfo', {
							user_token: response.Token,
							decoded_user_token: decodedToken.payload
						}).then(data => {
							$('#signin-panel').css('cursor', 'default');
							$('#signin-button').css('cursor', 'pointer');

							_that.customEvents.trigger('resetCollection');
							_that.customEvents.trigger('setNotification', {
								text: t('panel_signin_success') + email,
								classes: 'success'
							});
							window.location.hash = "#/dashboard";
						}).catch(err => {
							log('LoginView showSigninResult setLoginInfo returned with an error', err);
							$('#signin-panel').css('cursor', 'default');
							$('#signin-button').css('cursor', 'pointer');
							_that.customEvents.trigger('setNotification', {
								text: t('panel_signin_success') + email,
								classes: 'alert'
							});
						});
					}
				} else {
					log('LoginView showSigninResult success callback error', response);
					$('#signin-panel').css('cursor', 'default');
					$('#signin-button').css('cursor', 'pointer');
					_that.customEvents.trigger('setNotification', {
						text: t('banner_no_such_account_message'),
						classes: 'alert'
					});
				}
			},
			error: function (model, response, options) {
				log('LoginView showSigninResult error callback error', response);
				$('#signin-panel').css('cursor', 'default');
				$('#signin-button').css('cursor', 'pointer');
				_that.customEvents.trigger('setNotification', {
					text: t('server_error_message'),
					classes: 'alert'
				});
			}
		});
	},

	updatedLoginState: function (loginInfo) {
		if (loginInfo && typeof loginInfo.is_validated !== 'undefined') {
			var email = loginInfo.email;

			$('#signin-panel').css('cursor', 'default');
			$('#signin-button').css('cursor', 'pointer');

			$('#signin-panel #login-email').removeClass('panel-error');
			$('#signin-panel #login-password').removeClass('panel-error');

			$('.account-top-panel').hide();
			$('#signin-success-panel .signin-success-email').text(email);
		}
	},

	handleModelValidationError: function (model, error) {
		log("LoginView handleModelValidationError error " + error);
		$('#signin-panel').css('cursor', 'default');
		$('#signin-button').css('cursor', 'pointer');
		if (error === 'ERR_PWD_REQUIRED') {
			$('#login-password').addClass('panel-error');
			$('#login-email').removeClass('panel-error');
		} else {
			$('#login-password').removeClass('panel-error');
			$('#login-email').addClass('panel-error');
		}
	},

	signinCheckForEnter: function (e) {
		if (e.keyCode === 13) {
			this.showSigninResult();
		}
	},

	close: function () {
		this.remove();
	}

});

module.exports = LoginView;

},{"../../../../src/utils/common":54,"../../../templates/precompiled/login_view":38,"./ParentView":19,"jquery":49}],18:[function(require,module,exports){
(function (global){
'use strict';

global.$ = global.jQuery = require('jquery');
require('foundation');

var _ = require('underscore'),
    $ = require('jquery'),
    Models = require('../models/Models'),
    ParentView = require('./ParentView'),
    HeaderView = require('./HeaderView'),
    SummaryView = require('./SummaryView'),
    SettingsView,
    HelpView,
    LoginView,
    CreateAccountView,
    AccountSuccessView,
    ForgotPasswordView,
    msg = require('../../utils/msg')('panel_Panelview'),
    log = msg.log,
    isEdge = msg.isEdge;

var PanelView = ParentView.extend({
	el: 'body',
	customEvents: {},
	events: {
		'click .modal-back': 'clickModalBack',
		'click .modal-learn-more': 'clickLearnMore',
		'click .modal-human-web-back': 'clickHumanWebModalBack',
		'click .modal-human-web-learn-more': 'clickHumanWebLearnMore',
		'click .modal-privacy-statement': 'clickPrivacyStatement',
		'click .modal-button-container .ghostrank-opt-in': 'clickGhostrankOptIn',
		'click .modal-button-container .ghostrank-opt-out': 'clickGhostrankOptOut',
		'click .modal-button-container .metrics-opt-in': 'clickMetricsOptIn',
		'click .modal-button-container .metrics-opt-out': 'clickMetricsOptOut',
		'click .modal-button-container .human-web-opt-in': 'clickHumanWebOptIn',
		'click .modal-button-container .human-web-opt-out': 'clickHumanWebOptOut',
		'click .modal-button-container .account-dismiss': 'clickDismissAccountModal',
		'click .modal-button-container .create-account': 'clickCreateAccount',
		'click .modal-button-container .sign-in': 'clickSignInAccountModal',
		'click #account-modal .modal-button-container .create-account': 'createAccountPing',
		'click .modal-button-container .no-thanks': 'renderModal',
		'click .modal-button-container .get-started': 'renderModal',
		'click .callout-text .needs-reload-link': 'clickReloadTab',
		'click .callout-text .filter-link.compatibility': 'clickFilterCompatibility',
		'click .callout-text .filter-link.slow-insecure': 'clickFilterSlowInsecure',
		'click .callout-text .sign-in-link': 'clickSignIn',
		'click .callout-text .verify-account-link': 'clickVerifyAccount',
		'click .callout.hideous .close-button': 'clickDismissTrackersBanner',
		'click .callout.warning:not(".alert, .success") .close-button': 'clickDismissReloadBanner'
	},
	headerView: null,
	activeContentView: null,
	modalIndex: 0,

	initialize: function (options) {
		this.customEvents = options.customEvents;
		this.listenTo(this.customEvents, "setNeedsReload", this.setNeedsReload);
		this.listenTo(this.customEvents, "updateLoginInfo", this.updateLoginInfo);
		this.listenTo(this.customEvents, 'updateTotalBlocked', this.changeNumBlocked);
		this.listenTo(this.customEvents, "setNotification", this.setNotification);
		this.listenTo(this.customEvents, "resetCollection", this.resetCollection);

		this.listenTo(this.model, 'change:needsReload', this.showNeedsReload);
		this.listenTo(this.model, 'change:email', this.emailChanged);

		this.onMessage('onLoginInfoUpdated', data => {
			this.updateLoginInfo(data);
		});

		this.render();

		this.model.trigger('change:needsReload change:logged_in');
	},

	getNumberOfDotsCalled: false,

	getNumberOfDots: function () {
		if (this.getNumberOfDotsCalled) {
			return;
		}
		this.getNumberOfDotsCalled = true;
		let numDots = 0;

		if (this.runGhostrank()) {
			numDots++;
		}
		if (this.runMetrics()) {
			numDots++;
		}
		if (this.runHumanWeb()) {
			numDots++;
		}
		if (this.runAccount()) {
			numDots++;
		}
		this.numDots = numDots;
		this.dotIndex = 1;
	},

	loadView: function (view) {
		if (this.activeContentView !== null) {
			if (this.activeContentView.close) {
				this.activeContentView.close();
			}
			this.activeContentView.remove();
		}
		this.activeContentView = view;
	},

	render: function () {
		if (this.headerView === null) {
			this.headerView = new HeaderView({
				attributes: {},
				model: this.collection.get('header'),
				customEvents: this.customEvents
			});
		} else {
			this.headerView.render();
		}

		this.$el.foundation();
		this.renderModal();

		return this;
	},
	clearCallout: function () {
		this.$('.callout').addClass('needs-reload warning').removeClass('success alert hideous');
		this.$('.callout').css('display', 'none');
	},

	renderDots: function () {
		if (this.numDots > 1) {
			let divEl = $('div.location-container');
			if (divEl) {
				let count = 0;
				let width = 14 * this.numDots - 6;
				let html = '<svg height="8" width="' + width + '">';
				while (++count <= this.numDots) {
					if (count === this.dotIndex) {
						html += '<circle cx="' + (4 + 14 * (count - 1)) + '" cy="4" r="4" stroke="none" fill="#4a4a4a" />';
					} else {
						html += '<circle cx="' + (4 + 14 * (count - 1)) + '" cy="4" r="4" stroke="none" fill="#d8d8d8" />';
					}
				}
				html += '</svg>';

				divEl.append(html);
			}
		}

		this.dotIndex++;
	},

	runGhostrank: function () {
		return !this.model.get('ghostrank_dismissed');
	},

	runMetrics: function () {
		return !this.model.get('metrics_dismissed');
	},

	runHumanWeb: function () {
		return this.model.get('offer_human_web') && !this.model.get('human_web_dismissed') && !isEdge;
	},

	runAccount: function () {
		return !this.model.get('account_dismissed') && !this.model.get('logged_in');
	},

	renderModal: function () {
		this.modalIndex++;

		if (this.modalIndex === 1) {
			if (this.runGhostrank()) {
				this.templateGhostrank = this.templateGhostrank || require('../../../templates/precompiled/ghostrank_modal');
				this.renderModalHelper(this.templateGhostrank(this.model.toJSON()));
				this.getNumberOfDots();
				this.renderDots();
			} else {
				this.renderModal();
			}
		} else if (this.modalIndex === 2) {
			if (this.runMetrics()) {
				this.templateMetrics = this.templateMetrics || require('../../../templates/precompiled/metrics_modal');
				this.renderModalHelper(this.templateMetrics(this.model.toJSON()));
				this.getNumberOfDots();
				this.renderDots();
			} else {
				this.renderModal();
			}
		} else if (this.modalIndex === 3) {
			if (this.runHumanWeb()) {
				this.templateHumanWeb = this.templateHumanWeb || require('../../../templates/precompiled/human_web_modal');
				this.renderModalHelper(this.templateHumanWeb(this.model.toJSON()));
				this.getNumberOfDots();
				this.renderDots();
			} else {
				this.renderModal();
			}
		} else if (this.modalIndex === 4) {
			if (this.runAccount()) {
				this.templateAccount = this.templateAccount || require('../../../templates/precompiled/account_modal');
				this.renderModalHelper(this.templateAccount(this.model.toJSON()));
				this.getNumberOfDots();
				this.renderDots();
			} else {
				this.renderModal();
			}
		} else {
			this.$('#ghostrank-modal').foundation('close');
		}
	},
	renderModalHelper: function (template) {
		if (this.$('#ghostrank-modal').css('display') === 'none') {
			this.$('#ghostrank-modal').foundation('open');
		}
		this.$('#ghostrank-modal').html(template);
	},

	renderSummary: function () {
		this.loadView(new SummaryView({
			attributes: {},
			model: this.collection.get('summary'),
			modelBlocking: this.collection.get('blocking'),
			customEvents: this.customEvents
		}));
	},
	renderSettings: function () {
		SettingsView = SettingsView || require('./SettingsView');

		this.clearCallout();
		this.loadView(new SettingsView({
			attributes: {},
			model: this.collection.get('settings'),
			customEvents: this.customEvents
		}));
	},
	renderHelp: function () {
		HelpView = HelpView || require('./HelpView');

		this.clearCallout();
		this.loadView(new HelpView({
			attributes: {},
			model: this.collection.get('help'),
			customEvents: this.customEvents
		}));
	},
	renderLogin: function () {
		LoginView = LoginView || require('./LoginView');

		this.clearCallout();
		this.loadView(new LoginView({
			attributes: {},
			model: new Models.LoginModel(),
			customEvents: this.customEvents
		}));
	},
	renderCreateAccount: function () {
		CreateAccountView = CreateAccountView || require('./CreateAccountView');

		this.clearCallout();
		this.loadView(new CreateAccountView({
			attributes: {},
			model: new Models.CreateAccountModel(),
			customEvents: this.customEvents
		}));
	},
	renderAccountSuccess: function () {
		AccountSuccessView = AccountSuccessView || require('./AccountSuccessView');

		this.loadView(new AccountSuccessView({
			attributes: {},
			model: new Models.AccountSuccessModel(),
			customEvents: this.customEvents
		}));
	},
	renderForgotPassword: function () {
		ForgotPasswordView = ForgotPasswordView || require('./ForgotPasswordView');

		this.clearCallout();
		this.loadView(new ForgotPasswordView({
			attributes: {},
			model: new Models.ForgotPasswordModel(),
			customEvents: this.customEvents
		}));
	},

	clickDismissBanner: function (banner_status_name) {
		var banner_status = this.model.get(banner_status_name);

		if (!banner_status.show_time) {
			return;
		}

		var BANNER_INTERVAL = 3600000,
		    BANNERS_ALLOWED = 3,
		    BANNERS_BANNED_TIME = 604800000,
		    dismissals = banner_status.dismissals,
		    lastDismissal = Number(new Date().getTime());

		dismissals.push(lastDismissal);
		var firstDismissal = dismissals[0];

		while (lastDismissal > firstDismissal + BANNER_INTERVAL) {
			dismissals.shift();
			firstDismissal = dismissals[0];
		}

		if (dismissals.length >= BANNERS_ALLOWED) {
			banner_status = {
				show_time: lastDismissal + BANNERS_BANNED_TIME,
				dismissals: [],
				show: false
			};
		} else {
			banner_status = {
				show_time: lastDismissal,
				dismissals: dismissals,
				show: true
			};
		}
		this.model.set(banner_status_name, banner_status);
		this.model.save();
	},
	clickDismissReloadBanner: function () {
		log('DISMISS WARNING BANNER IS CALLED');
		this.clickDismissBanner('reload_banner_status');
	},

	clickDismissTrackersBanner: function () {
		log('DISMISS HIDEOUS BANNER IS CALLED');
		this.clickDismissBanner('trackers_banner_status');
	},

	showNeedsReload: _.debounce(function () {
		var reloadBannerStatus = this.model.get('reload_banner_status');
		if (!reloadBannerStatus.show) {
			return;
		}

		var nowTime = Number(new Date().getTime());

		if (nowTime < reloadBannerStatus.show_time) {
			return;
		}

		var needsReload = this.model.get('needsReload'),
		    ghosteryPaused = this.model.get('paused_blocking'),
		    sitePolicy = this.model.get('sitePolicy'),
		    totalBlocked = this.model.get('trackerCounts') && this.model.get('trackerCounts').blocked,
		    totalSsBlocked = this.model.get('trackerCounts') && this.model.get('trackerCounts').ssBlocked,
		    totalSsAllowed = this.model.get('trackerCounts') && this.model.get('trackerCounts').ssAllowed,
		    lastClick = needsReload.last;

		if (_.size(needsReload.changes) > 0) {

			this.$('.callout').addClass('needs-reload warning').removeClass('success alert hideous');

			if (ghosteryPaused === true) {
				this.$('.callout .callout-text').html(t('panel_needs_reload_paused'));
			} else if (ghosteryPaused === false && needsReload.changes.ghosteryPausedfalse) {
				this.$('.callout .callout-text').html(t('panel_needs_reload_resumed'));
			} else if (sitePolicy === 1 && needsReload.changes.sitePolicy1) {
				this.$('.callout .callout-text').html(t('panel_needs_reload_restrict'));
			} else if (sitePolicy === 2 && needsReload.changes.sitePolicy2) {
				this.$('.callout .callout-text').html(t('panel_needs_reload_trust'));
			} else if (sitePolicy === false && needsReload.changes.sitePolicyfalse) {
				this.$('.callout .callout-text').html(needsReload.changes.sitePolicy1 ? t('panel_needs_reload_undo_restrict') : t('panel_needs_reload_undo_trust'));
			} else if (lastClick === "block_all") {
				this.$('.callout .callout-text').html(t('panel_needs_reload_trackers_block_all'));
			} else if (lastClick === "unblock_all") {
				this.$('.callout .callout-text').html(t('panel_needs_reload_trackers_unblock_all'));
			} else if (lastClick === "blocked_true") {
				if (totalBlocked > 1) {
					this.$('.callout .callout-text').html(totalBlocked + " " + t('panel_needs_reload_tracker_qty_blocked_plural'));
				} else {
					this.$('.callout .callout-text').html(totalBlocked + " " + t('panel_needs_reload_tracker_qty_blocked'));
				}
			} else if (lastClick === "blocked_false") {
				this.$('.callout .callout-text').html(t('panel_needs_reload_tracker_unblocked'));
			} else if (lastClick === "ss_blocked_true") {
				if (totalSsBlocked > 1) {
					this.$('.callout .callout-text').html(totalSsBlocked + " " + t('panel_needs_reload_tracker_ss_blocked_plural'));
				} else {
					this.$('.callout .callout-text').html(totalSsBlocked + " " + t('panel_needs_reload_tracker_ss_blocked'));
				}
			} else if (lastClick === "ss_blocked_false") {
				this.$('.callout .callout-text').html(t('panel_needs_reload_tracker_ss_unblocked'));
			} else if (lastClick === "ss_allowed_true") {
				if (totalSsAllowed > 1) {
					this.$('.callout .callout-text').html(totalSsAllowed + " " + t('panel_needs_reload_tracker_ss_allowed_plural'));
				} else {
					this.$('.callout .callout-text').html(totalSsAllowed + " " + t('panel_needs_reload_tracker_ss_allowed'));
				}
			} else if (lastClick === "ss_allowed_false") {
				this.$('.callout .callout-text').html(t('panel_needs_reload_tracker_ss_untrusted'));
			} else {
				return;
			}
			this.$('.callout').css('display', '');
		} else if (!this.$('.callout').hasClass('hideous')) {
			this.$('.callout').css('display', 'none');
		}
	}, 300),

	changeNumBlocked: function (message) {
		var trackerCounts = this.model.get('trackerCounts') || false;

		trackerCounts = {
			blocked: message.num_blocked,
			allowed: message.num_total - message.num_blocked,
			ssBlocked: message.num_ss_blocked,
			ssAllowed: message.num_ss_allowed
		};
		this.model.set('trackerCounts', trackerCounts);
	},

	setNeedsReload: function (message = {}) {
		var needsReload = this.model.get('needsReload') || {},
		    updated = message.updated || '';
		if (needsReload && needsReload.changes && needsReload.changes[updated]) {
			delete needsReload.changes[updated];
		} else {
			needsReload.changes[updated] = true;
		}
		needsReload.last = message.last || '';

		this.model.set('needsReload', needsReload);
		this.model.trigger('change:needsReload');
		this.model.save();
	},
	setNotification: function (message) {
		var trackersBannerStatus = this.model.get('trackers_banner_status');
		if (!trackersBannerStatus.show) {
			return;
		}

		var nowTime = Number(new Date().getTime());
		if (nowTime < trackersBannerStatus.show_time) {
			return;
		}

		this.$('.callout').removeClass('success alert alert-notification warning').addClass(message.classes);
		this.$('.callout .callout-text').html(message.text);
		this.$('.callout').css('display', '');
	},
	resetCollection: function () {
		this.collection.fetch();
	},
	updateLoginInfo: function (message) {
		this.model.set('logged_in', message.logged_in);
		this.model.set('is_validated', message.is_validated);
		this.model.set('email', message.email);
		this.model.set('first_name', message.decoded_user_token.ClaimFirstName);
		this.model.set('last_name', message.decoded_user_token.ClaimLastName);
		this.model.save();
	},

	emailChanged: function () {
		this.customEvents.trigger('updateEmail', {
			email: this.model.get('email')
		});
	},

	clickModalBack: function () {
		this.templateGhostrank = this.templateGhostrank || require('../../../templates/precompiled/ghostrank_modal');
		this.$('#ghostrank-modal').html(this.templateGhostrank(this.model.toJSON()));
		this.dotIndex--;
		this.renderDots();
	},
	clickLearnMore: function () {
		this.templateLearnMore = this.templateLearnMore || require('../../../templates/precompiled/learn_more_modal');
		this.$('#ghostrank-modal').html(this.templateLearnMore(this.model.toJSON()));
	},
	clickHumanWebModalBack: function () {
		this.templateHumanWeb = this.templateHumanWeb || require('../../../templates/precompiled/human_web_modal');
		this.$('#ghostrank-modal').html(this.templateHumanWeb(this.model.toJSON()));
		this.dotIndex--;
		this.renderDots();
	},
	clickHumanWebLearnMore: function () {
		this.templateHumanWebLearnMore = this.templateHumanWebLearnMore || require('../../../templates/precompiled/human_web_learn_more_modal');
		this.$('#ghostrank-modal').html(this.templateHumanWebLearnMore(this.model.toJSON()));
	},
	clickPrivacyStatement: function () {
		this.sendMessage('openNewTab', {
			url: 'https://www.ghostery.com/about-us/privacy-statements/ghostery-browser-extension/ghostery-browser-extension-privacy-statement/',
			become_active: false
		});
		window.close();
	},
	clickGhostrankOptIn: function () {
		this.model.set('ghostrank', true);
		this.model.set('ghostrank_dismissed', true);
		this.model.save();
		this.sendMessage('ping', 'install');
		this.sendMessage('ping', 'opt_in_ext');
		this.renderModal();
	},
	clickGhostrankOptOut: function () {
		this.model.set('ghostrank', false);
		this.model.set('ghostrank_dismissed', true);
		this.model.save();
		this.sendMessage('ping', 'install');
		this.sendMessage('ping', 'opt_out_ext');
		this.renderModal();
	},
	clickMetricsOptIn: function () {
		this.model.set('enable_metrics', true);
		this.model.set('metrics_dismissed', true);
		this.model.save();
		this.renderModal();
	},
	clickMetricsOptOut: function () {
		this.model.set('enable_metrics', false);
		this.model.set('metrics_dismissed', true);
		this.model.save();
		this.renderModal();
	},
	clickHumanWebOptIn: function () {
		this.model.set('enable_human_web', true);
		this.sendMessage('onHWSettingChanged', true);
		this.model.set('human_web_dismissed', true);
		this.model.save();
		this.sendMessage('ping', 'opt_in_human_web');
		this.renderModal();
	},
	clickHumanWebOptOut: function () {
		this.model.set('enable_human_web', false);
		this.sendMessage('onHWSettingChanged', false);
		this.model.set('human_web_dismissed', true);
		this.model.save();
		this.sendMessage('ping', 'opt_out_human_web');
		this.renderModal();
	},

	clickDismissAccountModal: function () {
		this.model.set('account_dismissed', true);
		this.model.save();
	},
	clickCreateAccount: function () {
		this.$('#ghostrank-modal').foundation('close');
		window.location.hash = "#/create-account";
	},
	clickSignInAccountModal: function () {
		this.$('#ghostrank-modal').foundation('close');
		window.location.hash = "#/login";
	},
	createAccountPing: function () {
		this.sendMessage('ping', 'create_modal');
	},
	clickReloadTab: function (e) {
		e.preventDefault();
		this.sendMessage('reloadTab', {
			tab_id: +this.model.get('tab_id')
		});
		this.$('.callout').hide().removeClass('needs-reload warning success hideous');
		window.close();
	},
	clickFilterCompatibility: function (e) {
		e.preventDefault();
		this.$('.callout').hide().removeClass('needs-reload warning hideous');
		if (this.activeContentView && this.activeContentView.model.get('id') === 'summary') {
			this.activeContentView.filterTrackers({ type: 'trackers', name: 'warning-compatibility' });
		}
	},
	clickFilterSlowInsecure: function (e) {
		e.preventDefault();
		this.$('.callout').hide().removeClass('needs-reload warning hideous');
		if (this.activeContentView && this.activeContentView.model.get('id') === 'summary') {
			this.activeContentView.filterTrackers({ type: 'trackers', name: 'warning-slow-insecure' });
		}
	},
	clickSignIn: function (e) {
		e.preventDefault();
		this.$('.callout').hide().removeClass('needs-reload warning hideous');
		this.sendMessage('ping', 'sign_in');
		window.location.hash = "#/login";
	},
	clickVerifyAccount: function (e) {
		e.preventDefault();
		this.$('.callout').hide().removeClass('needs-reload warning hideous');
		this.sendMessage('sendVerificationEmail').then(data => {
			this.customEvents.trigger('setNotification', {
				classes: 'success',
				text: t('panel_email_verification_sent', data.email)
			});
		}).catch(function (err) {
			log('SendVerificationEmail error', err);
		});
	}

});

module.exports = PanelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../templates/precompiled/account_modal":23,"../../../templates/precompiled/ghostrank_modal":31,"../../../templates/precompiled/human_web_learn_more_modal":35,"../../../templates/precompiled/human_web_modal":36,"../../../templates/precompiled/learn_more_modal":37,"../../../templates/precompiled/metrics_modal":39,"../../utils/msg":22,"../models/Models":3,"./AccountSuccessView":7,"./CreateAccountView":13,"./ForgotPasswordView":14,"./HeaderView":15,"./HelpView":16,"./LoginView":17,"./ParentView":19,"./SettingsView":20,"./SummaryView":21,"foundation":42,"jquery":49,"underscore":52}],19:[function(require,module,exports){
'use strict';

var Backbone = require('backbone'),
    msg = require('../../utils/msg')('panel_parentView'),
    log = msg.log;

var ParentView = Backbone.View.extend({
	attributes: {},
	sendMessage: msg.sendMessageInPromise,
	onMessage: function (name, handler) {
		if (chrome.runtime && chrome.runtime.onMessage) {
			chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
				if (name === request.name) {
					log("PARENT VIEW RECEIVES", name);
					handler.call(this, request.message);
				}
			});
		}
	}
});

module.exports = ParentView;

},{"../../utils/msg":22,"backbone":43}],20:[function(require,module,exports){
(function (global){
'use strict';

global.$ = global.jQuery = require('jquery');
require('foundation');

var _ = require('underscore'),
    $ = require('jquery'),
    ParentView = require('./ParentView'),
    html = require('../../../templates/precompiled/settings_view'),
    moment = require('moment/min/moment-with-locales.min.js'),
    common = require('../../../../src/utils/common'),
    log = common.log,
    hashCode = common.hashCode;

var SettingsView = ParentView.extend({
	template: html,
	customEvents: {},
	events: {
		'click #settings-auto-update': 'toggleAutoUpdate',
		'click #settings-show-patterns': 'toggleShowPatterns',
		'click #settings-enable-click2play': 'toggleRequiredTrackers',
		'click #settings-replace-social': 'toggleReplaceSocial',
		'click #settings-individual-trackers': 'toggleIndividualTrackers',
		'click #settings-allow-trackers': 'toggleAllowSelfTrackers',
		'click #settings-block-trackers': 'toggleBlockNewByDefault',
		'click #update-now-span': 'updateDatabase',

		'click #settings-show-purple-box': 'toggleShowPurpleBox',
		'change #settings-dismiss-after': 'setDismissedAfter',
		'change #settings-display-in': 'setDisplayIn',
		'change #settings-hide-alert-trusted': 'toggleHideAlertTrusted',

		'click #settings-announcements': 'toggleAnnouncements',
		'click #settings-new-features': 'toggleNewFeatures',
		'click #settings-defect-fixes': 'toggleHotFixes',
		'click #settings-new-trackers': 'toggleNewTrackers',
		'click #settings-show-reload-banner': 'toggleShowReloadBanner',
		'click #settings-show-trackers-banner': 'toggleShowTrackersBanner',
		'click #settings-show-count-badge': 'toggleShowBadge',

		'click #settings-share-data': 'toggleShareData',
		'click #settings-share-usage': 'toggleShareUsage',
		'click #settings-share-human-web': 'toggleHumanWeb',

		'click .signin-create': 'signinCreate',
		'click .edit-account': 'editAccount',

		'click .export': 'exportSettings',
		'click .import': 'importSettings'
	},

	initialize: function (options) {
		this.customEvents = options.customEvents;

		this.listenTo(this.model, 'change:enable_autoupdate', this.updateAutoUpdate);
		this.listenTo(this.model, 'change:show_tracker_urls', this.updateShowPatterns);
		this.listenTo(this.model, 'change:enable_click2play', this.updateRequiredTrackers);
		this.listenTo(this.model, 'change:enable_click2play_social', this.updateReplaceSocial);
		this.listenTo(this.model, 'change:toggle_individual_trackers', this.updateIndividualTrackers);
		this.listenTo(this.model, 'change:ignore_first_party', this.updateAllowSelfTrackers);
		this.listenTo(this.model, 'change:block_by_default', this.updateBlockNewByDefault);
		this.listenTo(this.model, 'change:db_last_updated', this.updateDbLastUpdated);
		this.listenTo(this.model, 'change:language', this.updateLanguage);

		this.listenTo(this.model, 'change:show_alert', this.updateShowPurpleBox);
		this.listenTo(this.model, 'change:alert_bubble_timeout', this.updateDismissedAfter);
		this.listenTo(this.model, 'change:alert_bubble_pos', this.updateDisplayIn);
		this.listenTo(this.model, 'change:hide_alert_trusted', this.updateHideAlertTrusted);

		this.listenTo(this.model, 'change:show_cmp', this.updateAnnouncements);
		this.listenTo(this.model, 'change:notify_upgrade_updates', this.updateNewFeatures);
		this.listenTo(this.model, 'change:notify_hotfix_updates', this.updateHotFixes);
		this.listenTo(this.model, 'change:notify_library_updates', this.updateNewTrackers);
		this.listenTo(this.model, 'change:reload_banner_status', this.updateShowReloadBanner);
		this.listenTo(this.model, 'change:trackers_banner_status', this.updateShowTrackersBanner);
		this.listenTo(this.model, 'change:show_badge', this.updateShowBadge);

		this.listenTo(this.model, 'change:ghostrank', this.updateShareData);
		this.listenTo(this.model, 'change:enable_metrics', this.updateShareUsage);
		this.listenTo(this.model, 'change:enable_human_web', this.updateHumanWeb);

		this.listenTo(this.model, 'change:logged_in change:email change:first_name change:last_name', this.updateLoggedInState);

		this.listenTo(this.model, 'change:settings_last_imported change:settings_last_exported', this.updateImportExportState);

		this.render();

		this.model.trigger('change:enable_autoupdate ' + 'change:show_tracker_urls ' + 'change:enable_click2play ' + 'change:enable_click2play_social ' + 'change:toggle_individual_trackers ' + 'change:ignore_first_party ' + 'change:block_by_default ' + 'change:db_last_updated ' + 'change:settings_last_imported ' + 'change:settings_last_exported ' + 'change:language ' + 'change:show_alert ' + 'change:alert_bubble_timeout ' + 'change:alert_bubble_pos ' + 'change:hide_alert_trusted ' + 'change:show_cmp ' + 'change:notify_upgrade_updates ' + 'change:notify_hotfix_updates ' + 'change:notify_library_updates ' + 'change:reload_banner_status ' + 'change:trackers_banner_status ' + 'change:show_badge ' + 'change:ghostrank ' + 'change:enable_metrics ' + 'change:enable_human_web ' + 'change:logged_in ' + 'change:email ' + 'change:first_name ' + 'change:last_name');

		this.hideHumanWebIfNotOffered();
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON())).foundation();
		this.setElement('#content-settings');

		this.customEvents.trigger('setHeader', {
			showBack: true
		});

		return this;
	},

	signinCreate: function () {
		log("signinCreate called");
		this.sendMessage('ping', 'sign_in');
		window.location.hash = "#/login";
	},

	importSettings: function () {
		var browserName = App.BROWSER_INFO.name;
		if (browserName === 'edge' || browserName === 'firefox') {
			this.sendMessage('showBrowseWindow').then(result => {
				if (!result) {
					window.close();
				} else {
					$(".import-result").text(result).css('color', 'red').show();
				}
			});
		} else {
			$('#select-file').click();

			$('#select-file').change(() => {
				this.validateBackup();
			});
			return true;
		}
	},

	validateBackup: function () {
		_.debounce(() => {
			var backup;

			var fileToLoad = $('#select-file')[0].files[0];
			log("SELECTED FILE NAME", fileToLoad);

			var fileReader = new FileReader();
			fileReader.onload = fileLoadedEvent => {
				try {
					backup = JSON.parse(fileLoadedEvent.target.result);

					if (backup.hash !== hashCode(JSON.stringify(backup.settings))) {
						throw "Invalid hash";
					}
					let data = (backup.settings || {}).conf || {};
					log("IMPORTED SETTINGS", data, this.model);
					Object.keys(data).forEach(key => {
						if (this.model.attributes.hasOwnProperty(key)) {
							if (key === 'ghostrank') {
								data[key] = data[key] === 2 ? false : data[key];
							} else if (key === 'alert_bubble_timeout') {
								data[key] = data[key] > 30 ? 30 : data[key];
							}
							this.model.set(key, data[key]);
						}
					});
					this.model.set('settings_last_imported', Number(new Date().getTime()));
					this.sendMessage('updatePanelData', data);
					this.model.save();
				} catch (err) {
					log("IMPORT ERROR", err);
					$(".import-result").text(t("settings_import_file_error")).css('color', 'red').show();
				}
			};
			fileReader.readAsText(fileToLoad, "UTF-8");
		}, 1000)();
	},

	exportSettings: function () {
		this.sendMessage("getSettingsForExport").then(result => {
			if (result) {
				this.model.set('settings_last_exported', Number(new Date().getTime()));
				this.model.save();
				if (App.BROWSER_INFO.name === 'edge') {
					window.close();
				}
			} else {
				$(".export-result").text(t("settings_export_error")).css('color', 'red').show();
			}
		});
	},

	updateImportExportState: function () {
		try {
			let importTime = this.model.get('settings_last_imported'),
			    exportTime = this.model.get('settings_last_exported');
			moment.locale(this.model.get('language').toLowerCase().replace('_', '-'));
			if (importTime) {
				$('.import-result').text(t("settings_import_success") + " " + moment(importTime).format('LLL')).css({ 'color': '#2092BF' }).show();
			} else {
				$('.import-result').text('').hide();
			}
			if (exportTime) {
				$('.export-result').text(t("settings_export_success") + " " + moment(exportTime).format('LLL')).css({ 'color': '#2092BF' }).show();
			} else {
				$('.export-result').text('').hide();
			}
		} catch (e) {}
	},

	toggleAutoUpdate: function () {
		this.model.set('enable_autoupdate', $('#settings-auto-update')[0].checked);
		this.model.save();
	},
	updateAutoUpdate: function () {
		$('#settings-auto-update')[0].checked = this.model.get('enable_autoupdate');
	},

	updateDbLastUpdated: function () {
		moment.locale(this.model.get('language').toLowerCase().replace('_', '-'));
		$('#last-updated-span-value').text(moment(this.model.get('db_last_updated')).format('LLL'));
	},
	updateDatabase: function () {
		let _this = this;
		this.sendMessage('update_database').then(function (result) {
			if (result && result.success === true) {
				if (result.updated === true) {
					$('#update-now-span').text(t('settings_update_success'));
				} else {
					$('#update-now-span').text(t('settings_update_up_to_date'));
				}
				_this.model.set('db_last_updated', Number(new Date().getTime()));
				_this.model.save();
			} else {
				$('#update-now-span').text(t('settings_update_failed')).css('color', 'red');
			}
		});
	},
	updateLanguage: function () {
		log("LANGUAGE:", this.model.get('language').toLowerCase().replace('_', '-'));
		moment.locale(this.model.get('language').toLowerCase().replace('_', '-'));
		$('#last-updated-span-value').text(moment(this.model.get('db_last_updated')).format('LLL'));
	},

	toggleShowPatterns: function () {
		this.model.set('show_tracker_urls', $('#settings-show-patterns')[0].checked);
		this.model.save();
	},
	updateShowPatterns: function () {
		$('#settings-show-patterns')[0].checked = this.model.get('show_tracker_urls');
	},

	toggleRequiredTrackers: function () {
		this.model.set('enable_click2play', $('#settings-enable-click2play')[0].checked);
		this.model.save();
	},
	updateRequiredTrackers: function () {
		$('#settings-enable-click2play')[0].checked = this.model.get('enable_click2play');
	},

	toggleReplaceSocial: function () {
		this.model.set('enable_click2play_social', $('#settings-replace-social')[0].checked);
		this.model.save();
	},
	updateReplaceSocial: function () {
		$('#settings-replace-social')[0].checked = this.model.get('enable_click2play_social');
	},

	toggleIndividualTrackers: function () {
		this.model.set('toggle_individual_trackers', $('#settings-individual-trackers')[0].checked);
		this.model.save();
	},
	updateIndividualTrackers: function () {
		$('#settings-individual-trackers')[0].checked = this.model.get('toggle_individual_trackers');
	},

	toggleAllowSelfTrackers: function () {
		this.model.set('ignore_first_party', $('#settings-allow-trackers')[0].checked);
		this.model.save();
	},
	updateAllowSelfTrackers: function () {
		$('#settings-allow-trackers')[0].checked = this.model.get('ignore_first_party');
	},

	toggleBlockNewByDefault: function () {
		this.model.set('block_by_default', $('#settings-block-trackers')[0].checked);
		this.model.save();
	},
	updateBlockNewByDefault: function () {
		$('#settings-block-trackers')[0].checked = this.model.get('block_by_default');
	},

	toggleShowPurpleBox: function () {
		this.model.set('show_alert', $('#settings-show-purple-box')[0].checked);
		this.model.save();
	},
	updateShowPurpleBox: function () {
		$('#settings-show-purple-box')[0].checked = this.model.get('show_alert');
	},

	setDismissedAfter: function () {
		this.model.set('alert_bubble_timeout', $('#settings-dismiss-after')[0].value);
		this.model.save();
	},
	updateDismissedAfter: function () {
		$('#settings-dismiss-after')[0].value = this.model.get('alert_bubble_timeout');
	},

	setDisplayIn: function () {
		this.model.set('alert_bubble_pos', $('#settings-display-in')[0].value);
		this.model.save();
	},
	updateDisplayIn: function () {
		$('#settings-display-in')[0].value = this.model.get('alert_bubble_pos');
	},

	toggleHideAlertTrusted: function () {
		this.model.set('hide_alert_trusted', $('#settings-hide-alert-trusted')[0].checked);
		this.model.save();
	},
	updateHideAlertTrusted: function () {
		$('#settings-hide-alert-trusted')[0].checked = this.model.get('hide_alert_trusted');
	},

	toggleAnnouncements: function () {
		this.model.set('show_cmp', $('#settings-announcements')[0].checked);
		this.model.save();
	},
	updateAnnouncements: function () {
		$('#settings-announcements')[0].checked = this.model.get('show_cmp');
	},

	toggleNewFeatures: function () {
		this.model.set('notify_upgrade_updates', $('#settings-new-features')[0].checked);
		this.model.save();
	},
	updateNewFeatures: function () {
		$('#settings-new-features')[0].checked = this.model.get('notify_upgrade_updates');
	},

	toggleHotFixes: function () {
		this.model.set('notify_hotfix_updates', $('#settings-defect-fixes')[0].checked);
		this.model.save();
	},
	updateHotFixes: function () {
		$('#settings-defect-fixes')[0].checked = this.model.get('notify_hotfix_updates');
	},

	toggleNewTrackers: function () {
		this.model.set('notify_library_updates', $('#settings-new-trackers')[0].checked);
		this.model.save();
	},
	updateNewTrackers: function () {
		$('#settings-new-trackers')[0].checked = this.model.get('notify_library_updates');
	},

	_updateBannerStatus: function (banner_status_name, node_search_token) {
		var banner_status = this.model.get(banner_status_name),
		    nowTime = Number(new Date().getTime());

		if (banner_status.show_time && nowTime > banner_status.show_time && !banner_status.show) {
			banner_status.show = true;
			this.model.set(banner_status_name, banner_status);
			this.model.save();
		}
		$(node_search_token)[0].checked = banner_status.show;
	},
	_toggleBannerStatus: function (banner_status_name, node_search_token) {
		var banner_status = {
			show_time: 0,
			dismissals: [],
			show: $(node_search_token)[0].checked
		};
		this.model.set(banner_status_name, banner_status);
		this.model.save();
	},

	toggleShowReloadBanner: function () {
		this._toggleBannerStatus('reload_banner_status', '#settings-show-reload-banner');
	},
	updateShowReloadBanner: function () {
		this._updateBannerStatus('reload_banner_status', '#settings-show-reload-banner');
	},

	toggleShowTrackersBanner: function () {
		this._toggleBannerStatus('trackers_banner_status', '#settings-show-trackers-banner');
	},
	updateShowTrackersBanner: function () {
		this._updateBannerStatus('trackers_banner_status', '#settings-show-trackers-banner');
	},

	toggleShowBadge: function () {
		this.model.set('show_badge', $('#settings-show-count-badge')[0].checked);
		this.model.save();
	},
	updateShowBadge: function () {
		$('#settings-show-count-badge')[0].checked = this.model.get('show_badge');
	},

	toggleShareData: function () {
		this.model.set('ghostrank', $('#settings-share-data')[0].checked);
		this.model.save();
	},
	updateShareData: function () {
		$('#settings-share-data')[0].checked = this.model.get('ghostrank');
	},

	toggleShareUsage: function () {
		this.model.set('enable_metrics', $('#settings-share-usage')[0].checked);
		this.model.save();
	},

	updateShareUsage: function () {
		$('#settings-share-usage')[0].checked = this.model.get('enable_metrics');
	},

	toggleHumanWeb: function () {
		var value = $('#settings-share-human-web')[0].checked;
		this.model.set('enable_human_web', value);
		this.sendMessage('onHWSettingChanged', value);
		this.model.save();
	},

	updateHumanWeb: function () {
		$('#settings-share-human-web')[0].checked = this.model.get('enable_human_web');
	},

	editAccount: function () {
		this.sendMessage('openNewTab', {
			url: 'https://account.' + App.GHOSTERY_DOMAIN + '.com/',
			become_active: true
		});
		window.close();
	},

	updateLoggedInState: function () {
		let logged_in = this.model.get('logged_in');

		if (logged_in) {
			let email = this.model.get('email'),
			    first_name = this.model.get('first_name'),
			    last_name = this.model.get('last_name');

			log("EMAIL:", email);

			if (first_name || last_name) {
				let full_name = first_name ? first_name + (last_name ? ' ' + last_name : '') : last_name;
				$('#settings-account-name > span').text(full_name);
				$('#settings-account-name').show();
			} else {
				$('#settings-account-name > span').text('');
				$('#settings-account-name').hide();
			}

			$('#settings-account-email > span').text(email);

			$('#settings-account-not-signed').hide();
			$('#settings-account-signed').show();
		} else {
			$('#settings-account-name > span').text('');
			$('#settings-account-email > span').text('');

			$('#settings-account-not-signed').show();
			$('#settings-account-signed').hide();
		}
	},

	hideImportExport: function () {
		$('#import-export').hide();
	},

	hideHumanWebIfNotOffered: function () {
		if (!this.model.get('offer_human_web')) {
			$('#human-web-section').hide();
		}
	},

	close: function () {
		$('.tooltip.settings-tooltip').remove();
		this.remove();
	}
});

module.exports = SettingsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../src/utils/common":54,"../../../templates/precompiled/settings_view":40,"./ParentView":19,"foundation":42,"jquery":49,"moment/min/moment-with-locales.min.js":50,"underscore":52}],21:[function(require,module,exports){
'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    ParentView = require('./ParentView'),
    BlockingView,
    html = require('../../../templates/precompiled/summary_view'),
    d3 = require('d3');
require('../vendor/jquery.animateNumber.js');

var SummaryView = ParentView.extend({
	name: 'SummaryView',
	template: html,
	customEvents: {},
	events: {
		'click .categories-donut-count': 'clickTrackersAll',
		'click .tracker-count-blocked': 'clickTrackersBlocked',
		'click .tracker-count-alerts': 'clickTrackersAlerts',
		'click .controls-trust, .controls-restrict': 'clickSitePolicy',
		'click .controls-pause': 'clickGhosteryPause',
		'click .map-trackers': 'clickMapTheseTrackers'
	},

	initialize: function (options) {
		this.modelBlocking = options.modelBlocking;

		this.customEvents = options.customEvents;
		this.listenTo(this.customEvents, 'updateTotalBlocked', this.changeNumBlocked);

		this.listenTo(this.model, 'change:siteNotScanned change:trackerCategories change:pageUrl', this.updateSiteNotScanned);
		this.listenTo(this.model, 'change:trackerCounts', this.updateTrackersCountTotal);
		this.listenTo(this.model, 'change:pageHost', this.updatePageHost);
		this.listenTo(this.model, 'change:trackerCategories change:sitePolicy change:paused_blocking', this.updateCategoriesDonutData);
		this.listenTo(this.model, 'change:categoriesDonutData', this.updateCategoriesDonut);
		this.listenTo(this.model, 'change:trackerDonutCount', this.updateTrackerDonutCount);
		this.listenTo(this.model, 'change:trackerCounts', this.updateTrackerCountBlocked);
		this.listenTo(this.model, 'change:alertCounts', this.updateTrackerCountAlert);
		this.listenTo(this.model, 'change:sitePolicy', this.updateSitePolicy);
		this.listenTo(this.model, 'change:paused_blocking', this.updateGhosteryPaused);

		this.model.set('donutAnimationDuration', 750);

		this.render();

		this.model.trigger('change:trackerCategories change:trackerList change:pageHost change:categoriesDonutData change:trackerCounts change:sitePolicy change:paused_blocking');
		setTimeout(() => {
			this.model.trigger('change:alertCounts');
		}, 0);
	},

	render: function () {
		$('#ghostery-content').html(this.template(this.model.toJSON()));
		this.setElement('#content-summary');

		this.customEvents.trigger('setHeader');

		if (!this.blockingView) {
			BlockingView = BlockingView || require('./BlockingView');
			this.blockingView = new BlockingView({
				attributes: {},
				model: this.modelBlocking,
				customEvents: this.customEvents
			});
		} else {
			this.blockingView.render();
		}

		return this;
	},

	updateSiteNotScanned: function () {
		var siteNotScanned = this.model.get('siteNotScanned'),
		    trackerCategories = this.model.get('trackerCategories'),
		    pageUrl = this.model.get('pageUrl') || '';

		if (siteNotScanned || !trackerCategories || pageUrl.search('http') === -1) {
			this.$el.addClass('not-scanned');
			this.$('.blocking-controls').addClass('disabled');
		} else {
			this.$el.removeClass('not-scanned');
			this.$('.blocking-controls').removeClass('disabled');
		}
	},
	updateTrackersCountTotal: function () {
		var trackerCounts = this.model.get('trackerCounts') || {},
		    trackerCount = trackerCounts.allowed + trackerCounts.blocked || 0;

		this.$('.tracker-count-total .count').text(trackerCount);
		this.$('.tracker-count-total .text').text(trackerCount === 1 ? t('summary_category_tracker') : t('summary_category_trackers'));

		this.model.set('trackerDonutCount', trackerCount);
	},
	updatePageHost: function () {
		var pageHost = this.model.get('pageHost') || '';
		this.$('.tracker-host').text(pageHost);
	},
	updateCategoriesDonutData: function () {
		var categories = this.model.get('trackerCategories'),
		    sitePolicy = this.model.get('sitePolicy'),
		    ghosteryPaused = this.model.get('paused_blocking'),
		    performanceData = this.model.get('performanceData'),
		    unfixedLatency = '',
		    pageLatency = '',
		    categories_data = [],
		    category_colors_obj = {};

		if (ghosteryPaused) {
			category_colors_obj = {
				advertising: '#848484',
				audio_video_player: '#888888',
				comments: '#919191',
				customer_interaction: '#c9c9c9',
				essential: '#ababab',
				pornvertising: '#c3c3c3',
				site_analytics: '#c0c0c0',
				social_media: '#757575',
				uncategorized: '#6e6e6e'
			};
		} else if (sitePolicy === 1) {
			category_colors_obj = {
				advertising: '#f75065',
				audio_video_player: '#fa5368',
				comments: '#ff5f73',
				customer_interaction: '#ffb0Ba',
				essential: '#ff8595',
				pornvertising: '#ffa9b3',
				site_analytics: '#ffa3ae',
				social_media: '#e74055',
				uncategorized: '#e13a4f'
			};
		} else {
			category_colors_obj = {
				advertising: '#cb55cd',
				audio_video_player: '#ef671e',
				comments: '#43b7c5',
				customer_interaction: '#fdc257',
				essential: '#fc9734',
				pornvertising: '#ecafc2',
				site_analytics: '#87d7ef',
				social_media: '#388ee8',
				uncategorized: '#8459a5'
			};
		}

		if (typeof categories === 'object' && categories.length > 0) {
			categories.forEach(category => {
				if (!category_colors_obj.hasOwnProperty(category.name)) {
					category.id = 'uncategorized';
					category.name = 'uncategorized';
				}
				categories_data.push({
					name: category.name,
					value: category.total,
					color: category_colors_obj[category.name]
				});
			});
		} else {
			categories_data.push({
				name: null,
				value: 1,
				color: '#e8e8e8'
			});
		}

		if (performanceData) {
			var timing = performanceData.timing;

			unfixedLatency = Number(timing.loadEventEnd - timing.navigationStart) / 1000;
			if (unfixedLatency >= 100) {
				pageLatency = (Number(timing.loadEventEnd - timing.navigationStart) / 1000).toFixed();
			} else if (unfixedLatency >= 10 && unfixedLatency < 100) {
				pageLatency = (Number(timing.loadEventEnd - timing.navigationStart) / 1000).toFixed(1);
			} else if (unfixedLatency < 10) {
				pageLatency = (Number(timing.loadEventEnd - timing.navigationStart) / 1000).toFixed(2);
			}
			this.$('.tracker-latency-total').html(pageLatency + ' seconds');
		}

		this.model.set('categoriesDonutData', categories_data);
	},
	updateCategoriesDonut: function () {
		this.$("#categories-donut").empty();

		var width = 96,
		    height = 96,
		    radius = Math.min(width, height) / 2,
		    chart = d3.select("#categories-donut").append('svg').attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
		    $tooltip,
		    arc = d3.svg.arc().innerRadius(radius - 13).outerRadius(radius),
		    pie = d3.layout.pie().startAngle(-Math.PI).endAngle(Math.PI).sort(null).value(function (d) {
			return d.value;
		}),
		    categories_data = this.model.get('categoriesDonutData'),
		    animationDuration = this.model.get('donutAnimationDuration'),
		    total_categories = 0,
		    delays = [],
		    g = chart.selectAll(".arc").data(pie(categories_data)).enter().append("g").attr("class", "arc");

		categories_data.forEach(function (c) {
			total_categories += c.value;
		});

		g.append("path").style("fill", function (d, i) {
			return categories_data[i].color;
		}).attr("class", (d, i) => {
			return d.data.name ? "clickable" : "disabled";
		}).on("mouseover", (d, i) => {
			let pX = arc.centroid(d)[0] + width / 2,
			    pY = arc.centroid(d)[1] + height / 2;
			if (d.data.name) {
				$tooltip = $('<span class="tooltip top">' + t('category_' + d.data.name) + '</span>').css({
					'opacity': '0',
					'visiblity': 'hidden'
				});

				this.$('.tracker-category-wheel').append($tooltip);

				$tooltip.css({
					'left': pX - $tooltip.outerWidth() / 2,
					'top': pY - $tooltip.outerHeight() - 8
				});

				$tooltip.fadeTo(200, 0.75);
			}
		}).on("mouseout", (d, i) => {
			if (d.data.name) {
				$tooltip.remove();
			}
		}).on("click", (d, i) => {
			if (d.data.name) {
				this.filterTrackers({ type: 'category', name: d.data.name });
			}
		}).transition().duration(function (d, i) {
			delays.push(d.value / total_categories * animationDuration);
			return d.value / total_categories * animationDuration;
		}).delay(function (d, i) {
			if (i === 0) {
				return 0;
			}

			var sum = 0;
			delays.forEach(function (val, j) {
				if (j < i) {
					sum += val;
				}
			});

			return sum;
		}).attrTween('d', function (d) {
			var i = d3.interpolate(d.startAngle, d.endAngle);
			return function (t) {
				d.endAngle = i(t);
				return arc(d);
			};
		}).ease("linear");

		this.model.trigger('change:trackerDonutCount');
	},
	updateTrackerDonutCount: _.debounce(function () {
		var trackerDonutCount = this.model.get('trackerDonutCount');

		this.$('.categories-donut-count').animateNumber({
			number: trackerDonutCount
		}, this.model.get('donutAnimationDuration'));
	}, 20),
	updateTrackerCountBlocked: function () {
		var trackerCounts = this.model.get('trackerCounts') || {};

		if (trackerCounts.blocked) {
			this.$('.tracker-count-blocked').css('display', '');
			this.$('.tracker-count-blocked .count').text(trackerCounts.blocked);
		} else {
			this.$('.tracker-count-blocked').css('display', 'none');
		}
	},
	updateTrackerCountAlert: function () {
		var alertCounts = this.model.get('alertCounts') || {};

		if (alertCounts.total) {
			this.$('.tracker-count-alerts').css('display', '');
			this.$('.tracker-count-alerts .count').text(alertCounts.total);
			this.$('.tracker-count-alerts .text').text(alertCounts.total === 1 ? t('summary_alert') : t('summary_alerts'));

			if (alertCounts.compatibility) {
				if (App.BROWSER_INFO.name === 'edge') {
					let text = t('panel_tracker_breaking_page');
					text = text.replace("$1", alertCounts.compatibility);
					text = text.replace("$2", alertCounts.compatibility === 1 ? t('tracker_signular') : t('tracker_plural'));
					this.customEvents.trigger('setNotification', {
						classes: 'needs-reload hideous',
						text: text
					});
				} else {
					this.customEvents.trigger('setNotification', {
						classes: 'needs-reload hideous',
						text: t('panel_tracker_breaking_page', [alertCounts.compatibility, alertCounts.compatibility === 1 ? t('tracker_signular') : t('tracker_plural')])
					});
				}
			} else {
				if (App.BROWSER_INFO.name === 'edge') {
					let text = t('panel_tracker_slow_non_secure');
					text = text.replace("$1", alertCounts.total - alertCounts.compatibility);
					text = text.replace("$2", alertCounts.total - alertCounts.compatibility === 1 ? t('tracker_signular') : t('tracker_plural'));
					this.customEvents.trigger('setNotification', {
						classes: 'needs-reload hideous',
						text: text
					});
				} else {
					this.customEvents.trigger('setNotification', {
						classes: 'needs-reload hideous',
						text: t('panel_tracker_slow_non_secure', [alertCounts.total - alertCounts.compatibility, alertCounts.total - alertCounts.compatibility === 1 ? t('tracker_signular') : t('tracker_plural')])
					});
				}
			}
		} else {
			this.$('.tracker-count-alerts').css('display', 'none');
		}
	},
	updateSitePolicy: function () {
		var siteNotScanned = this.model.get('siteNotScanned'),
		    sitePolicy = this.model.get('sitePolicy'),
		    trackerCounts = this.model.get('trackerCounts') || {};

		if (siteNotScanned) {
			return;
		}

		this.$('.controls-trust, .controls-restrict').removeClass('active');
		this.$('.tracker-count-blocked').css('display', '');
		this.updateTrackerCountBlocked();
		if (sitePolicy === 1) {
			this.$('.controls-restrict').addClass('active');
			this.$('.tracker-count-blocked').css('display', '');
			this.$('.tracker-count-blocked .count').text(trackerCounts.blocked + trackerCounts.allowed);
		} else if (sitePolicy === 2) {
			this.$('.controls-trust').addClass('active');
			this.$('.tracker-count-blocked').css('display', 'none');
		}
	},
	updateGhosteryPaused: function () {
		var siteNotScanned = this.model.get('siteNotScanned'),
		    ghosteryPaused = this.model.get('paused_blocking'),
		    trackerCategories = this.model.get('trackerCategories'),
		    pageUrl = this.model.get('pageUrl');

		if (siteNotScanned) {
			return;
		}

		if (ghosteryPaused) {
			this.$('.controls-pause').addClass('active');
			this.$('.controls-trust, .controls-restrict').addClass('disabled');
			this.$('.tracker-count-blocked').addClass('faded');
			this.$('.tracker-count-alerts').addClass('faded');
		} else {
			this.$('.controls-pause').removeClass('active');
			if (!siteNotScanned && trackerCategories && pageUrl.search('http') >= 0) {
				this.$('.controls-trust, .controls-restrict').removeClass('disabled');
				this.$('.tracker-count-blocked').removeClass('faded');
				this.$('.tracker-count-alerts').removeClass('faded');
			}
		}
	},

	changeNumBlocked: function (message) {
		var trackerCounts = this.model.get('trackerCounts') || false;

		trackerCounts = {
			blocked: message.num_blocked,
			allowed: message.num_total - message.num_blocked,
			ssBlocked: message.num_ss_blocked,
			ssAllowed: message.num_ss_allowed
		};
		this.model.set('trackerCounts', trackerCounts);
	},

	clickTrackersAll: function (event) {
		if (event.currentTarget.classList.contains('disabled')) {
			return;
		}
		this.filterTrackers({ type: 'trackers', name: 'all' });
	},
	clickTrackersBlocked: function (event) {
		var sitePolicy = this.model.get('sitePolicy');

		if (sitePolicy === 1) {
			this.filterTrackers({ type: 'trackers', name: 'all' });
		} else {
			this.filterTrackers({ type: 'trackers', name: 'blocked' });
		}
	},
	clickTrackersAlerts: function (event) {
		this.filterTrackers({ type: 'trackers', name: 'warning' });
	},
	clickSitePolicy: function (event) {
		var ghosteryPaused = this.model.get('paused_blocking'),
		    sitePolicy,
		    oldSitePolicy = this.model.get('sitePolicy'),
		    siteBlacklist = this.model.get('site_blacklist'),
		    siteWhitelist = this.model.get('site_whitelist'),
		    targetClasses = event.currentTarget.classList || [],
		    action = targetClasses.contains('controls-trust') ? 'whitelist' : 'blacklist',
		    pageHost = this.model.get('pageHost').replace(/^www\./, '');

		if (targetClasses.contains('disabled') || ghosteryPaused) {
			return;
		}

		if (action === 'whitelist') {
			this.sendMessage('ping', 'trust_site');
			sitePolicy = oldSitePolicy === 1 || !oldSitePolicy ? 2 : false;
			if (siteBlacklist.indexOf(pageHost) >= 0) {
				siteBlacklist.splice(siteBlacklist.indexOf(pageHost), 1);
				this.model.set('site_blacklist', siteBlacklist);
			}
			if (siteWhitelist.indexOf(pageHost) === -1) {
				siteWhitelist.push(pageHost);
				this.model.set('site_whitelist', siteWhitelist);
			} else {
				siteWhitelist.splice(siteWhitelist.indexOf(pageHost), 1);
				this.model.set('site_whitelist', siteWhitelist);
			}
		} else {
			this.sendMessage('ping', 'restrict_site');
			sitePolicy = oldSitePolicy === 2 || !oldSitePolicy ? 1 : false;
			if (siteWhitelist.indexOf(pageHost) >= 0) {
				siteWhitelist.splice(siteWhitelist.indexOf(pageHost), 1);
				this.model.set('site_whitelist', siteWhitelist);
			}
			if (siteBlacklist.indexOf(pageHost) === -1) {
				siteBlacklist.push(pageHost);
				this.model.set('site_blacklist', siteBlacklist);
			} else {
				siteBlacklist.splice(siteBlacklist.indexOf(pageHost), 1);
				this.model.set('site_blacklist', siteBlacklist);
			}
		}

		this.model.set('sitePolicy', sitePolicy);
		this.model.save();

		this.customEvents.trigger('setNeedsReload', { updated: 'sitePolicy' + oldSitePolicy });
		this.customEvents.trigger('setNeedsReload', { updated: 'sitePolicy' + sitePolicy });
		this.filterTrackers({ type: 'trackers', name: 'all' });
	},
	clickGhosteryPause: function (event) {
		var ghosteryPaused = this.model.get('paused_blocking');

		if (event.currentTarget.classList.contains('disabled')) {
			return;
		}

		this.sendMessage('ping', ghosteryPaused ? 'resume' : 'pause');

		this.model.set('paused_blocking', !ghosteryPaused);
		this.model.save();

		this.customEvents.trigger('setNeedsReload', { updated: 'ghosteryPaused' + ghosteryPaused });
		this.customEvents.trigger('setNeedsReload', { updated: 'ghosteryPaused' + !ghosteryPaused });
		this.filterTrackers({ type: 'trackers', name: 'all' });
	},
	clickMapTheseTrackers: function () {
		this.sendMessage('ping', 'live_scan');
		this.sendMessage('openNewTab', {
			url: 'https://www.evidon.com/digital-governance-solutions/trackermap/?url=' + this.model.get('pageUrl'),
			tab_id: +this.model.get('tab_id'),
			become_active: true
		});
		window.close();
	},

	close: function () {
		this.closeBlocking();
		this.remove();
	},
	closeBlocking: function () {
		if (this.blockingView) {
			this.blockingView.close();
			this.blockingView = null;
		}
	},
	filterTrackers: function (filter) {
		if (this.blockingView) {
			this.blockingView.filterTrackers(filter);
			this.customEvents.trigger('refreshStickyHeader');
		}
	}
});

module.exports = SummaryView;

},{"../../../templates/precompiled/summary_view":41,"../vendor/jquery.animateNumber.js":6,"./BlockingView":12,"./ParentView":19,"d3":46,"jquery":49,"underscore":52}],22:[function(require,module,exports){
'use strict';

module.exports = function (origin) {
	var onMessage = chrome.runtime.onMessage;
	var DEBUG = chrome.runtime.getManifest().debug || false;
	var LOG = DEBUG && chrome.runtime.getManifest().log;
	var globals = require('../../../src/classes/Globals');
	var isEdge = globals.BROWSER_INFO.name === 'edge';

	function sendMessageInPromise(name, message) {
		if (isEdge) {
			return new Promise((resolve, reject) => {
				onMessage.addListener((request, sender, sendResponse) => {
					if (messageId === request.name) {
						resolve(request.message);
					}
					if (sendResponse) {
						sendResponse();
					}
				});
				var messageId = ("EDGE_" + window.performance.now()).replace('.', '_');
				chrome.runtime.sendMessage({
					origin: origin,
					name: name,
					message: message,
					messageId: messageId
				}, () => {});
			});
		} else {
			return new Promise(function (resolve, reject) {
				chrome.runtime.sendMessage({
					origin: origin,
					name: name,
					message: message
				}, function (response) {
					if (chrome.runtime.lastError) {
						log(chrome.runtime.lastError, origin, name, message);
						resolve(null);
					}
					resolve(response);
				});
			});
		}
	};

	function sendMessage(name, message, callback) {
		log(origin + ' sending to handler', name);
		return _sendMessageToHandler(name, origin, message, callback);
	};

	function sendMessageToBackground(name, message, callback) {
		log(origin + ' sending to background', name);
		return _sendMessageToHandler(name, '', message, callback);
	};

	function log(...args) {
		if (!LOG) {
			return false;
		}

		var errors = args.toString().toLowerCase().indexOf('error');

		args.unshift(new Date().toLocaleTimeString() + '\t');

		try {
			if (errors !== -1) {
				console.error.apply(console, args);
			} else {
				console.log.apply(console, args);
			}
		} catch (e) {
			if (errors !== -1) {
				console.error(args);
			} else {
				console.log(args);
			}
		}
	}

	function _sendMessageToHandler(name, origin, message, callback) {
		log('_sendMessageToHandler:' + origin + ' sending to background', name);

		var fallback = function () {};
		callback = callback ? callback : fallback;
		return chrome.runtime.sendMessage({
			origin: origin,
			name: name,
			message: message
		}, callback);
	};

	return {
		sendMessageInPromise: sendMessageInPromise,
		onMessage: onMessage,
		DEBUG: DEBUG,
		sendMessage: sendMessage,
		sendMessageToBackground: sendMessageToBackground,
		log: log,
		isEdge: isEdge
	};
};

},{"../../../src/classes/Globals":53}],23:[function(require,module,exports){
"use strict";module.exports=function(n){var a,l="";return l+='<div id="account-modal">\n\t<div class="modal-title">'+(null==(a=t("panel_modal_account_title"))?"":a)+'</div>\n\t<div class="modal-subtitle">\n\t\t<p>'+(null==(a=t("panel_modal_account_subtitle_1"))?"":a)+"</p>\n\t\t<p>"+(null==(a=t("panel_modal_account_subtitle_2"))?"":a)+'</p>\n\t</div>\n\t<div class="modal-button-container">\n\t\t<button class="button account-dismiss create-account">\n\t\t\t'+(null==(a=t("panel_modal_account_button_create_account"))?"":a)+'\n\t\t</button>\n\t\t<div class="links">\n\t\t\t<a class="account-dismiss sign-in">'+(null==(a=t("panel_modal_account_button_sign_in"))?"":a)+'</a>\n\t\t\t<a class="account-dismiss no-thanks">'+(null==(a=t("panel_modal_account_button_maybe_later"))?"":a)+'</a>\n\t\t</div>\n\t\t<div class="location-container">\n\t\t</div>\n\t</div>\n</div>\n'};

},{}],24:[function(require,module,exports){
"use strict";module.exports=function(n){var s,i="";return i+='<div id="signin-success-panel">\n\t<div class="row align-center">\n\t\t<div class="small-7 columns text-center">\n\t\t\t<h3>'+(null==(s=t("panel_signin_success_title"))?"":s)+'</h3>\n\t\t\t<div class="big-ghosty"></div>\n\t\t\t<p class="small-and-pale">'+(null==(s=t("panel_signin_success"))?"":s)+'</p>\n\t\t\t<h3 class="signin-success-email"></h3>\n\t\t\t<a href="#/dashboard" id="view-trackers-button" class="button">\n\t\t\t\t'+(null==(s=t("panel_view_trackers"))?"":s)+"\n\t\t\t</a>\n\t\t</div>\n\t</div>\n</div>\n"};

},{}],25:[function(require,module,exports){
"use strict";module.exports=function(t){var n,s="";return s+='<div class="flex sticky-category">\n\t<img class="cat-image" src="/app/images/panel/'+(null==(n=t.img_name)?"":n)+'.svg">\n\t<div class="flex vertical">\n\t\t<div class="cat-name">\n\t\t\t'+(null==(n=t.name)?"":n)+'\n\t\t</div>\n\t\t<div class="counts flex">\n\t\t\t<div class="total-count">\n\t\t\t\t<span class="count">'+(null==(n=t.num_total)?"":n)+'</span>\n\t\t\t\t<span class="text">\n\t\t\t\t\t'+(null==(n=1===t.num_total?t.blocking_category_tracker:t.blocking_category_trackers)?"":n)+'\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class="blocked-count" style="display:none;">\n\t\t\t\t<span class="count"></span>\n\t\t\t\t<span class="text">'+(null==(n=t.blocking_category_blocked)?"":n)+'</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class="trackers-list"></div>\n'};

},{}],26:[function(require,module,exports){
"use strict";module.exports=function(t){var a,l="";return l+='<div class="flex align-middle trk-header">\n\t<span class="warning-image right" title="" data-template-classes="warning-tooltip '+(null==(a=t.id)?"":a)+'" tabindex="1" data-h-offset="5" data-v-offset="30" data-hover-delay="1200"\tdata-tooltip aria-haspopup="true" data-disable-hover="false">\n\t</span>\n\t<div class="trk-name">'+(null==(a=t.name)?"":a)+'</div>\n\t<div class="flex-fill"></div>\n\t<div class="svg-container">\n\t\t<span class="tracker-tooltip left" title="'+(null==(a=t.panel_tracker_trust_tooltip)?"":a)+'" data-template-classes="blocking-tooltip"\n\t\t\t\ttabindex="1" data-h-offset="5" data-v-offset="30" data-hover-delay="1200"\n\t\t\t\tdata-tooltip aria-haspopup="true" data-disable-hover="false">\n\t\t\t<svg class="trust" width="20px" height="20px" viewbox="0 0 20 20">\n\t\t\t\t<g>\n\t\t\t\t\t<title>'+(null==(a=t.panel_tracker_trust_tooltip)?"":a)+'</title>\n\t\t\t\t\t<path class="border" d="M1,1 l18,0 l0,18 l-18,0 l0,-18"></path>\n\t\t\t\t\t<path class="background" d="M2,2 l16,0 l0,16 l-16,0 l0,-16"></path>\n\t\t\t\t\t<path class="shield" d="M10.1063482,5.01604251 C10.0424848,4.9946525 9.95751518,4.9946525 9.89365179,5.01604251 L5.31918081,6.22941467 C5.12772679,6.27192221 5,6.44222483 5,6.63378123 C5.02137858,9.89092117 6.76597947,12.9137247 9.765925,14.9361025 C9.82978839,14.97861 9.9148942,15 10,15 C10.0851058,15 10.1702116,14.97861 10.234075,14.9361025 C13.2340205,12.9137247 14.9786214,9.89092117 15,6.63378123 C15,6.44222483 14.8722732,6.27192221 14.6808192,6.22941467 L10.1063482,5.01604251 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</span>\n\t\t<span class="tracker-tooltip left" title="'+(null==(a=t.panel_tracker_restrict_tooltip)?"":a)+'" data-template-classes="blocking-tooltip"\n\t\t\t\ttabindex="1" data-h-offset="5" data-v-offset="30" data-hover-delay="1200"\n\t\t\t\tdata-tooltip aria-haspopup="true" data-disable-hover="false">\n\t\t\t<svg class="restrict" width="20px" height="20px" viewbox="0 0 20 20">\n\t\t\t\t<g>\n\t\t\t\t\t<title>'+(null==(a=t.panel_tracker_restrict_tooltip)?"":a)+'</title>\n\t\t\t\t\t<path class="border" d="M1,1 l18,0 l0,18 l-18,0 l0,-18"></path>\n\t\t\t\t\t<path class="background" d="M2,2 l16,0 l0,16 l-16,0 l0,-16"></path>\n\t\t\t\t\t<path class="lock" d="M7.09090909,9.48275862 L6.99703014,9.48275862 C6.45303631,9.48275862 6,9.93008471 6,10.4818894 L6,14.0008692 C6,14.548501 6.4463856,15 6.99703014,15 L13.0029699,15 C13.5469637,15 14,14.5526739 14,14.0008692 L14,10.4818894 C14,9.93425764 13.5536144,9.48275862 13.0029699,9.48275862 L12.9090909,9.48275862 L12.9090909,7.90818975 C12.9090909,6.30964904 11.6066465,5 10,5 C8.39662266,5 7.09090909,6.3020409 7.09090909,7.90818975 L7.09090909,9.48275862 Z M7.57575758,9.50286456 L7.57575758,7.76048278 C7.57575758,6.48983426 8.6608335,5.45977011 10,5.45977011 C11.3388721,5.45977011 12.4242424,6.48886151 12.4242424,7.75909549 L12.4242424,9.52268315 L7.57575758,9.50286456 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</span>\n\t\t<span class="tracker-tooltip left" title="'+(null==(a=t.panel_tracker_block_tooltip)?"":a)+'" data-template-classes="blocking-tooltip status-tooltip"\n\t\t\t\ttabindex="1" data-h-offset="5" data-v-offset="30" data-hover-delay="1200"\n\t\t\t\tdata-tooltip aria-haspopup="true" data-disable-hover="false">\n\t\t\t<svg class="status" width="20px" height="20px" viewbox="0 0 20 20">\n\t\t\t\t<g>\n\t\t\t\t\t<title>'+(null==(a=t.panel_tracker_block_tooltip)?"":a)+'</title>\n\t\t\t\t\t<path class="border" d="M1,1 l18,0 l0,18 l-18,0 l0,-18"></path>\n\t\t\t\t\t<path class="background" d="M2,2 l16,0 l0,16 l-16,0 l0,-16"></path>\n\t\t\t\t\t<polygon class="check" points="5.38461538 9.5 4 11 7.69230769 15 16 6.5 14.6153846 5 7.69230769 12"></polygon>\n\t\t\t\t\t<path class="shield" d="M10.1063482,5.01604251 C10.0424848,4.9946525 9.95751518,4.9946525 9.89365179,5.01604251 L5.31918081,6.22941467 C5.12772679,6.27192221 5,6.44222483 5,6.63378123 C5.02137858,9.89092117 6.76597947,12.9137247 9.765925,14.9361025 C9.82978839,14.97861 9.9148942,15 10,15 C10.0851058,15 10.1702116,14.97861 10.234075,14.9361025 C13.2340205,12.9137247 14.9786214,9.89092117 15,6.63378123 C15,6.44222483 14.8722732,6.27192221 14.6808192,6.22941467 L10.1063482,5.01604251 Z"></path>\n\t\t\t\t\t<path class="lock" d="M7.09090909,9.48275862 L6.99703014,9.48275862 C6.45303631,9.48275862 6,9.93008471 6,10.4818894 L6,14.0008692 C6,14.548501 6.4463856,15 6.99703014,15 L13.0029699,15 C13.5469637,15 14,14.5526739 14,14.0008692 L14,10.4818894 C14,9.93425764 13.5536144,9.48275862 13.0029699,9.48275862 L12.9090909,9.48275862 L12.9090909,7.90818975 C12.9090909,6.30964904 11.6066465,5 10,5 C8.39662266,5 7.09090909,6.3020409 7.09090909,7.90818975 L7.09090909,9.48275862 Z M7.57575758,9.50286456 L7.57575758,7.76048278 C7.57575758,6.48983426 8.6608335,5.45977011 10,5.45977011 C11.3388721,5.45977011 12.4242424,6.48886151 12.4242424,7.75909549 L12.4242424,9.52268315 L7.57575758,9.50286456 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</span>\n\t</div>\n</div>\n'};

},{}],27:[function(require,module,exports){
"use strict";module.exports=function(t){var n,e="";return Array.prototype.join,e+='<div class="clear"></div>\n<div class="trk-moreinfo" style="display: none;">\n\t<div class="trk-description"></div>\n\t<div class="trk-srcs-title">'+(null==(n=t.panel_tracker_found_sources_title)?"":n)+'</div>\n\t<div class="trk-srcs">\n\t\t',t.sources.forEach(function(s){e+='\n\t\t\t<a target="_blank" class="trk-src-link"\n\t\t\t\t\ttitle="'+(null==(n=s.src)?"":n)+'"\n\t\t\t\t\thref="https://www.ghostery.com/'+(null==(n=encodeURIComponent(t.language))?"":n)+"/gcache/?n="+(null==(n=encodeURIComponent(t.name))?"":n)+"&s="+(null==(n=encodeURIComponent(s.src))?"":n)+"&v=2&t="+(null==(n=s.type)?"":n)+'">\n\t\t\t\t'+(null==(n=s.src)?"":n)+"\n\t\t\t</a>\n\t\t"}),e+="\n\t</div>\n</div>\n"};

},{}],28:[function(require,module,exports){
"use strict";module.exports=function(n){var l,i="";return i+='<div id="content-blocking">\n\t<div class="blocking-header flex align-middle align-justify">\n\t\t<div class="title">'+(null==(l=t("blocking_trackers"))?"":l)+'</div>\n\t\t<div class="flex-fill"></div>\n\t\t<div class="block-text"></div>\n\t\t<div class="header-checkbox">\n\t\t\t<svg width="20px" height="20px" viewbox="0 0 20 20">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="border" d="M1,1 l18,0 l0,18 l-18,0 l0,-18"></path>\n\t\t\t\t\t<path class="background" d="M2,2 l16,0 l0,16 l-16,0 l0,-16"></path>\n\t\t\t\t\t<path class="dash" d="M5,10.5 15,10.5"></path>\n\t\t\t\t\t<polygon class="check" points="5.38461538 9.5 4 11 7.69230769 15 16 6.5 14.6153846 5 7.69230769 12"></polygon>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</div>\n\t</div>\n\t<div class="blocking-trackers show-warnings">\n\t\t<div class="scroll-content"></div>\n\t\t<div class="wrapper blocking-category"></div>\n\t</div>\n</div>\n'};

},{}],29:[function(require,module,exports){
"use strict";module.exports=function(a){var n,e="";return e+='<div id="create-account-panel">\n\t<div class="row align-center">\n\t\t<div class="small-11 columns">\n\t\t\t<div class="row">\n\t\t\t\t<div class="small-8 columns">\n\t\t\t\t\t<div id="create-account-email">\n\t\t\t\t\t\t<label class=\'create-account-label\' id=\'create-email-label\' for="create-input-email">\n\t\t\t\t\t\t\t'+(null==(n=t("email_field_label"))?"":n)+'<span class="asterisk">*</span>\n\t\t\t\t\t\t\t<input class=\'create-account-input\' id="create-input-email" type="text" name="email" pattern=".{1,}" autocomplete="off" required>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<p id="email-invalid" class="warning">\n\t\t\t\t\t\t\t'+(null==(n=t("invalid_email_create"))?"":n)+"\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"create-account-email-confirm\">\n\t\t\t\t\t\t<label class='create-account-label' id='create-email-confirm-label' for=\"create-input-email-confirm\">\n\t\t\t\t\t\t\t"+(null==(n=t("email_confirm_field_label"))?"":n)+'<span class="asterisk">*</span>\n\t\t\t\t\t\t\t<input class=\'create-account-input\' id="create-input-email-confirm" type="text" name="emailConfirm" pattern=".{1,}" autocomplete="off" required>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<p class="warning">'+(null==(n=t("invalid_email_confirmation"))?"":n)+'</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="row">\n\t\t\t\t<div class="small-6 columns">\n\t\t\t\t\t<div id="create-account-first-name">\n\t\t\t\t\t\t<label class=\'create-account-label\' id=\'create-first-name-label\' for="create-input-first-name">\n\t\t\t\t\t\t\t'+(null==(n=t("first_name_field_label"))?"":n)+'\n\t\t\t\t\t\t\t<input class=\'create-account-input\' id="create-input-first-name" type="text" name="firstName" pattern=".{1,}" required>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="small-6 columns">\n\t\t\t\t\t<div id="create-account-last-name">\n\t\t\t\t\t\t<label class=\'create-account-label\' id=\'create-last-name-label\' for="create-input-last-name">\n\t\t\t\t\t\t\t'+(null==(n=t("last_name_field_label"))?"":n)+'\n\t\t\t\t\t\t\t<input class=\'create-account-input\' id="create-input-last-name" type="text" name="lastName" pattern=".{1,}" required>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="row">\n\t\t\t\t<div class="small-12 columns">\n\t\t\t\t\t<div id="create-account-password">\n\t\t\t\t\t\t<div class="row">\n\t\t\t\t\t\t\t<div class="small-8 columns">\n\t\t\t\t\t\t\t\t<label class=\'create-account-label\' id=\'create-password-label\' for="create-input-password">\n\t\t\t\t\t\t\t\t\t'+(null==(n=t("create_password_field_label"))?"":n)+'<span class="asterisk">*</span>\n\t\t\t\t\t\t\t\t\t<input class=\'create-account-input\' id="create-input-password" type="password" name="password" pattern=".{1,}" required>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p class="warning">\n\t\t\t\t\t\t\t<span id="password-length-requirement">\n\t\t\t\t\t\t\t\t'+(null==(n=t("password_requirements"))?"":n)+"\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span id='password-characters-requirement'>\n\t\t\t\t\t\t\t\t"+(null==(n=t("password_characters_requirements"))?"":n)+'\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="row">\n\t\t\t\t<div class="small-12 columns">\n\t\t\t\t\t<div id=\'create-account-privacy-container\'>\n\t\t\t\t\t\t<label for="accept-privacy" id="accept-privacy-label">\n\t\t\t\t\t\t\t<input id="accept-privacy" type="checkbox" checked>\n\t\t\t\t\t\t\t'+(null==(n=t("account_creation_privacy_statement"))?"":n)+"\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<p id='accept-privacy-requirement' class=\"warning\">\n\t\t\t\t\t\t\t"+(null==(n=t("consent_privacy"))?"":n)+'\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id="account-creation-buttons" class="row align-center">\n\t\t\t\t\t\t<div class="small-4 columns text-center">\n\t\t\t\t\t\t\t<a href="#/dashboard" id=\'create-account-cancel\' class="cancel button hollow">\n\t\t\t\t\t\t\t\t'+(null==(n=t("button_cancel"))?"":n)+'\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="small-4 columns text-center">\n\t\t\t\t\t\t\t<div id="create-account-button" class="button">\n\t\t\t\t\t\t\t\t'+(null==(n=t("panel_title_create_account"))?"":n)+"\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"};

},{}],30:[function(require,module,exports){
"use strict";module.exports=function(n){var l,a="";return a+='<div id="forgot-password-panel">\n\t<div class="row align-center">\n\t\t<div class="small-8 columns">\n\t\t\t<h4 id=\'forgot-password-message\'>\n\t\t\t\t'+(null==(l=t("forgot_password_message"))?"":l)+'\n\t\t\t</h4>\n\t\t\t<div id="forgot-email">\n\t\t\t\t<label for="forgot-input-email">\n\t\t\t\t\t'+(null==(l=t("email_field_label"))?"":l)+'<span class="asterisk">*</span>\n\t\t\t\t\t<input id="forgot-input-email" type="text" name="email" pattern=".{1,}" autocomplete="off" required>\n\t\t\t\t</label>\n\t\t\t\t<p class=\'invalid-email warning\'>\n\t\t\t\t\t'+(null==(l=t("invalid_email_forgot"))?"":l)+'\n\t\t\t\t</p>\n\t\t\t\t<p class="server-error warning">\n\t\t\t\t\t'+(null==(l=t("error_email_forgot"))?"":l)+'\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t<div class="buttons-container row">\n\t\t\t\t<div class="small-6 columns text-center">\n\t\t\t\t\t<a href="#/login" id=\'forgot-password-cancel\' class="cancel button hollow">\n\t\t\t\t\t\t'+(null==(l=t("button_cancel"))?"":l)+'\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<div class="small-6 columns text-center">\n\t\t\t\t\t<div id="send-button" class="button">\n\t\t\t\t\t\t'+(null==(l=t("send_button_label"))?"":l)+"\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"};

},{}],31:[function(require,module,exports){
"use strict";module.exports=function(n){var l,a="";return a+='<div class="modal-title">'+(null==(l=t("panel_modal_ghostrank_title"))?"":l)+"</div>\n<p>"+(null==(l=t("panel_modal_ghostrank_p1"))?"":l)+"</p>\n<p>"+(null==(l=t("panel_modal_ghostrank_p2"))?"":l)+"</p>\n<p><b>"+(null==(l=t("panel_modal_ghostrank_p3"))?"":l)+'</b></p>\n<div class="modal-button-container">\n\t<button class="button ghostrank-opt-in">'+(null==(l=t("panel_modal_ghostrank_opt_in"))?"":l)+'</button>\n\t<div class="links">\n\t\t<a class="ghostrank-opt-out">'+(null==(l=t("panel_modal_ghostrank_opt_out"))?"":l)+'</a>\n\t</div>\n\t<div class="location-container">\n\t</div>\n</div>\n'};

},{}],32:[function(require,module,exports){
"use strict";module.exports=function(C){var n,e="";return e+='<div class="top-bar flex align-middle align-justify">\n\t<div class="dropdown-pane flex vertical" id="header-dropdown" data-dropdown data-close-on-click="true">\n\t\t<div class="menu-option menu-settings flex align-middle">\n\t\t\t<svg width="18px" height="18px" viewBox="0 0 18 18">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M17.9063611,7.4473434 C17.8436479,7.36521204 17.7618042,7.31630721 17.6602547,7.30077273 L15.5157778,6.97267882 C15.39855,6.5976938 15.2383148,6.21494155 15.0352159,5.82427821 C15.1757453,5.62894655 15.3866115,5.35364109 15.6678143,4.99807417 C15.9490171,4.64250725 16.1482323,4.38288011 16.2654601,4.21876124 C16.3280295,4.13274626 16.3590985,4.04299151 16.3590985,3.94920929 C16.3590985,3.8398926 16.3319132,3.75402146 16.277111,3.69145204 C15.9959082,3.29287763 15.3513712,2.62892258 14.3435001,1.69915535 C14.2500056,1.62105145 14.1521959,1.58207142 14.0507903,1.58207142 C13.9335626,1.58207142 13.8397803,1.61716783 13.7694437,1.68736066 L12.1055286,2.94133817 C11.7850581,2.7772193 11.4335187,2.63266236 11.0507664,2.50766735 L10.7226725,0.351539463 C10.7149053,0.249990011 10.6698841,0.165988765 10.5878966,0.0995357237 C10.5057652,0.0330826827 10.4102569,-1.77635684e-15 10.3006526,-1.77635684e-15 L7.69920309,-1.77635684e-15 C7.47265863,-1.77635684e-15 7.33198532,0.109316691 7.27732697,0.32809391 C7.17577752,0.718613404 7.06243338,1.44513788 6.93743838,2.50766735 C6.57022061,2.62503896 6.21479754,2.77347952 5.87102532,2.95313287 L4.25385753,1.69915535 C4.15230808,1.62105145 4.05075863,1.58207142 3.94920918,1.58207142 C3.77732308,1.58207142 3.40823542,1.8612605 2.84180237,2.41992632 C2.27536932,2.97859215 1.89074718,3.39845454 1.68750445,3.67965735 C1.61716779,3.7812068 1.58207138,3.87110539 1.58207138,3.94920929 C1.58207138,4.04299151 1.62105141,4.13677372 1.69915531,4.2304121 C2.22258087,4.8632982 2.64057336,5.40225825 2.95313278,5.84772377 C2.75780112,6.20703047 2.60547695,6.56648101 2.49616026,6.92578771 L0.316443043,7.25388162 C0.230571909,7.26955994 0.156351631,7.32033466 0.0937822111,7.40634964 C0.0312127911,7.49222077 1.77635684e-15,7.58211937 1.77635684e-15,7.67575775 L1.77635684e-15,10.2773511 C1.77635684e-15,10.3790444 0.0312127911,10.4706691 0.0937822111,10.5526566 C0.156351631,10.634788 0.238339147,10.6838366 0.339888596,10.6993711 L2.4845094,11.0158142 C2.59382609,11.3985664 2.7539175,11.7852023 2.96492748,12.1757218 C2.824398,12.3710535 2.61338803,12.6463589 2.33218523,13.0019258 C2.05098244,13.3574927 1.85162332,13.6171199 1.73453939,13.7812388 C1.67196997,13.8673976 1.64075718,13.9570085 1.64075718,14.0507907 C1.64075718,14.1523402 1.66808635,14.2420949 1.7227447,14.3201988 C2.02739304,14.7422188 2.67192999,15.3985504 3.65635553,16.28905 C3.7423705,16.3750649 3.84003633,16.4179286 3.94935302,16.4179286 C4.06658078,16.4179286 4.16424661,16.3828322 4.24235051,16.3126393 L5.89475855,15.058518 C6.21522905,15.2226369 6.5667685,15.3671938 6.94952075,15.4923326 L7.27761465,17.6484605 C7.28552573,17.75001 7.3304031,17.8340112 7.41239062,17.9004643 C7.49437813,17.9670612 7.59017407,18 7.69949076,18 L10.3010841,18 C10.5279162,18 10.6684457,17.8906833 10.7232479,17.6719061 C10.8246535,17.2812428 10.9378538,16.5548621 11.0628488,15.4923326 C11.4300666,15.3751049 11.7856335,15.2265205 12.1292619,15.0468671 L13.7465735,16.3126393 C13.8558902,16.3828322 13.9575835,16.4179286 14.0512218,16.4179286 C14.2229641,16.4179286 14.5901819,16.1407532 15.1525875,15.585971 C15.7152807,15.0313327 16.1019166,14.6093127 16.3126389,14.3201988 C16.3829756,14.2420949 16.4182158,14.1523402 16.4182158,14.0507907 C16.4182158,13.9492413 16.3792358,13.8512877 16.300988,13.7577932 C15.7385824,13.0702488 15.32059,12.5312887 15.0470106,12.1406254 C15.2032183,11.8515115 15.3556864,11.4960884 15.5041269,11.0742123 L17.6720494,10.7462622 C17.7656878,10.7305839 17.8440794,10.6796653 17.906505,10.5936504 C17.9689305,10.5076354 17.9999995,10.4177368 17.9999995,10.3240984 L17.9999995,7.72264885 C18.0001433,7.6210994 17.9690744,7.52947475 17.9063611,7.4473434 L17.9063611,7.4473434 Z M11.1213908,11.1211034 C10.5355396,11.7070984 9.82843326,12.0000959 9.00021551,12.0000959 C8.17199776,12.0000959 7.46503523,11.7070984 6.87904025,11.1211034 C6.29318911,10.5352522 6.00019162,9.82828969 6.00019162,9.00007192 C6.00019162,8.17185415 6.29304527,7.4648916 6.87904025,6.8788966 C7.46503523,6.29304544 8.1721416,6.00004795 9.00021551,6.00004795 C9.82843326,6.00004795 10.5355396,6.29304544 11.1213908,6.8788966 C11.7072419,7.4648916 12.0002394,8.17185415 12.0002394,9.00007192 C12.0002394,9.82828969 11.7072419,10.5352522 11.1213908,11.1211034 L11.1213908,11.1211034 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span>'+(null==(n=t("panel_menu_settings"))?"":n)+'</span>\n\t\t</div>\n\t\t<div class="menu-option menu-advanced-settings flex align-middle">\n\t\t\t<svg width="20px" height="18px" viewBox="0 0 20 18">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M12.1348101,12.650875 C12.1348101,12.583 12.1107595,12.515125 12.0626582,12.44725 C11.6775949,11.992125 11.3682278,11.60175 11.1344304,11.276 C11.2787342,10.99775 11.3887342,10.73975 11.4643038,10.50225 L13.0629114,10.257875 C13.1249367,10.251 13.1798734,10.215375 13.2279747,10.151 C13.2760759,10.08625 13.3,10.02025 13.3,9.952375 L13.3,8.068125 C13.3,7.9935 13.2760759,7.92725 13.2279747,7.869625 C13.1798734,7.812 13.1213924,7.77625 13.0526582,7.762875 L11.4850633,7.528625 C11.4092405,7.29775 11.2924051,7.01925 11.1343038,6.6935 C11.2373418,6.544 11.3921519,6.34025 11.598481,6.082375 C11.8046835,5.824375 11.9492405,5.641125 12.0316456,5.5325 C12.0797468,5.464625 12.1037975,5.4 12.1037975,5.339 C12.1037975,5.155625 11.6087342,4.6125 10.6188608,3.7095 C10.5501266,3.65525 10.4779747,3.628125 10.4021519,3.628125 C10.3197468,3.628125 10.2510127,3.651625 10.1958228,3.699375 L8.97886076,4.60575 C8.69708861,4.46325 8.43924051,4.358 8.20544304,4.29 L7.96822785,2.731875 C7.96151899,2.664 7.92708861,2.6045 7.86518987,2.553625 C7.80329114,2.50275 7.73455696,2.47725 7.65886076,2.47725 L5.74075949,2.47725 C5.58265823,2.47725 5.47949367,2.55875 5.43139241,2.721625 C5.34886076,3.034 5.26987342,3.556875 5.19417722,4.29 C4.89860759,4.385 4.63392405,4.493625 4.40012658,4.615875 L3.21417722,3.699375 C3.14544304,3.65175 3.07329114,3.628125 2.99759494,3.628125 C2.86683544,3.628125 2.59531646,3.828375 2.18278481,4.229 C1.77025316,4.6295 1.48822785,4.931625 1.33708861,5.135375 C1.28886076,5.18975 1.26493671,5.257625 1.26493671,5.339125 C1.26493671,5.400125 1.28886076,5.468 1.33708861,5.54275 C1.72202532,5.99775 2.03139241,6.388125 2.26518987,6.713875 C2.12088608,6.992375 2.01088608,7.25025 1.93531646,7.487875 L0.336708861,7.732125 C0.274810127,7.738875 0.219873418,7.7745 0.17164557,7.838875 C0.123544304,7.9035 0.0994936709,7.969625 0.0994936709,8.0375 L0.0994936709,9.9215 C0.0994936709,9.99625 0.123544304,10.0625 0.17164557,10.120125 C0.219873418,10.177875 0.278227848,10.210125 0.347088608,10.216875 L1.91468354,10.46125 C1.99721519,10.71925 2.11759494,10.997625 2.2756962,11.296375 C2.1656962,11.445875 2.00417722,11.653 1.79101266,11.917625 C1.57772152,12.1825 1.43683544,12.3625 1.36810127,12.457375 C1.32,12.52525 1.29594937,12.59 1.29594937,12.650875 C1.29594937,12.834375 1.79101266,13.377375 2.78101266,14.280375 C2.84974684,14.334625 2.92189873,14.361625 2.99759494,14.361625 C3.08696203,14.361625 3.1556962,14.338125 3.20379747,14.2905 L4.42075949,13.384125 C4.70253165,13.52675 4.96037975,13.631875 5.19417722,13.69975 L5.43139241,15.258 C5.43822785,15.325875 5.47265823,15.385375 5.53443038,15.43625 C5.59632911,15.487125 5.66506329,15.5125 5.74075949,15.5125 L7.65886076,15.5125 C7.81708861,15.5125 7.92012658,15.431125 7.96822785,15.268125 C8.05075949,14.948875 8.12974684,14.42275 8.20544304,13.6895 C8.48037975,13.60825 8.74506329,13.50275 8.99949367,13.374 L10.1855696,14.2905 C10.2543038,14.338125 10.3264557,14.361625 10.4021519,14.361625 C10.5327848,14.361625 10.8027848,14.15975 11.2117722,13.755625 C11.6207595,13.351875 11.9044304,13.047875 12.0626582,12.844125 C12.1107595,12.796875 12.1348101,12.732375 12.1348101,12.650875 L12.1348101,12.650875 Z M8.5664557,10.83825 C8.05088608,11.347375 7.42860759,11.602 6.69987342,11.602 C5.97101266,11.602 5.34873418,11.347375 4.83316456,10.83825 C4.31759494,10.329125 4.05974684,9.714625 4.05974684,8.994875 C4.05974684,8.27525 4.31759494,7.66075 4.83316456,7.151625 C5.34873418,6.642375 5.97101266,6.387875 6.69987342,6.387875 C7.42860759,6.387875 8.05088608,6.642375 8.5664557,7.151625 C9.0821519,7.66075 9.33987342,8.27525 9.33987342,8.994875 C9.33987342,9.714625 9.0821519,10.329125 8.5664557,10.83825 L8.5664557,10.83825 Z"></path>\n\t\t\t\t\t<path class="menu-icon" d="M18.3637975,13.180625 C18.274557,12.98375 18.1713924,12.80725 18.054557,12.651 C18.4051899,11.88375 18.5803797,11.41525 18.5803797,11.245625 C18.5803797,11.218625 18.5668354,11.19475 18.5392405,11.174375 C17.7140506,10.699125 17.2878481,10.4615 17.2603797,10.4615 L17.198481,10.482 C16.9167089,10.760375 16.6002532,11.140625 16.2497468,11.622625 C16.1122785,11.609125 16.0092405,11.602125 15.9405063,11.602125 C15.871519,11.602125 15.7686076,11.609125 15.6310127,11.622625 C15.5350633,11.479875 15.3560759,11.25075 15.0949367,10.935125 C14.8337975,10.6195 14.6755696,10.4615 14.6205063,10.4615 C14.6068354,10.4615 14.5036709,10.515875 14.3111392,10.624625 C14.1186076,10.73325 13.9158228,10.848625 13.7026582,10.971 C13.4892405,11.093375 13.3692405,11.161125 13.3416456,11.17475 C13.3139241,11.195 13.3003797,11.218875 13.3003797,11.245875 C13.3003797,11.415625 13.4756962,11.883875 13.8262025,12.65125 C13.7094937,12.8075 13.6063291,12.984 13.516962,13.18075 C12.4924051,13.2825 11.9801266,13.38775 11.9801266,13.496375 L11.9801266,14.922125 C11.9801266,15.03075 12.4924051,15.136 13.516962,15.23775 C13.5992405,15.421 13.7025316,15.597625 13.8262025,15.767125 C13.4756962,16.534375 13.3003797,17.002875 13.3003797,17.172625 C13.3003797,17.199625 13.3139241,17.2235 13.3416456,17.243875 C14.1802532,17.725875 14.6067089,17.966875 14.6205063,17.966875 C14.6755696,17.966875 14.8337975,17.807375 15.0949367,17.48825 C15.3560759,17.169 15.5349367,16.938375 15.6310127,16.79575 C15.768481,16.809125 15.871519,16.816 15.9405063,16.816 C16.0092405,16.816 16.1122785,16.809125 16.2497468,16.79575 C16.3458228,16.938375 16.5246835,17.169 16.7859494,17.48825 C17.0470886,17.807375 17.2051899,17.966875 17.2603797,17.966875 C17.2740506,17.966875 17.7005063,17.72575 18.5392405,17.243875 C18.5668354,17.2235 18.5803797,17.19975 18.5803797,17.172625 C18.5803797,17.002875 18.4050633,16.534375 18.054557,15.767125 C18.1782278,15.597625 18.2813924,15.421 18.3637975,15.23775 C19.3883544,15.136 19.9006329,15.03075 19.9006329,14.922125 L19.9006329,13.496375 C19.9006329,13.38775 19.3883544,13.2825 18.3637975,13.180625 L18.3637975,13.180625 Z M16.8735443,15.130875 C16.6159494,15.3855 16.3046835,15.513 15.9402532,15.513 C15.5758228,15.513 15.2646835,15.3855 15.006962,15.130875 C14.7491139,14.87625 14.6201266,14.569125 14.6201266,14.20925 C14.6201266,13.85625 14.7508861,13.5505 15.0121519,13.292625 C15.2734177,13.03475 15.5827848,12.905625 15.9402532,12.905625 C16.2977215,12.905625 16.6073418,13.034625 16.8686076,13.292625 C17.1297468,13.5505 17.2605063,13.85625 17.2605063,14.20925 C17.2603797,14.569125 17.131519,14.87625 16.8735443,15.130875 L16.8735443,15.130875 Z"></path>\n\t\t\t\t\t<path class="menu-icon" d="M18.3637975,2.752 C18.274557,2.555125 18.1713924,2.378625 18.054557,2.222375 C18.4051899,1.45525 18.5803797,0.98675 18.5803797,0.817 C18.5803797,0.79 18.5668354,0.766125 18.5392405,0.74575 C17.7140506,0.2705 17.2878481,0.032875 17.2603797,0.032875 L17.198481,0.05325 C16.9167089,0.33175 16.6002532,0.711875 16.2497468,1.193875 C16.1122785,1.180375 16.0092405,1.1735 15.9405063,1.1735 C15.871519,1.1735 15.7686076,1.180375 15.6310127,1.193875 C15.5350633,1.05125 15.3560759,0.822125 15.0949367,0.5065 C14.8337975,0.19075 14.6755696,0.032875 14.6205063,0.032875 C14.6068354,0.032875 14.5036709,0.087125 14.3111392,0.195875 C14.1186076,0.304625 13.9158228,0.42 13.7026582,0.54225 C13.4892405,0.6645 13.3692405,0.732375 13.3416456,0.745875 C13.3139241,0.76625 13.3003797,0.79 13.3003797,0.817125 C13.3003797,0.986875 13.4756962,1.455375 13.8262025,2.2225 C13.7094937,2.37875 13.6063291,2.55525 13.516962,2.752125 C12.4924051,2.853875 11.9801266,2.959125 11.9801266,3.06775 L11.9801266,4.4935 C11.9801266,4.602125 12.4924051,4.707375 13.516962,4.809125 C13.5992405,4.992375 13.7025316,5.169 13.8262025,5.33875 C13.4756962,6.106 13.3003797,6.574375 13.3003797,6.744125 C13.3003797,6.771125 13.3139241,6.795 13.3416456,6.815375 C14.1802532,7.297375 14.6067089,7.538375 14.6205063,7.538375 C14.6755696,7.538375 14.8337975,7.378875 15.0949367,7.05975 C15.3560759,6.740625 15.5349367,6.509875 15.6310127,6.36725 C15.768481,6.38075 15.871519,6.387625 15.9405063,6.387625 C16.0092405,6.387625 16.1122785,6.38075 16.2497468,6.36725 C16.3458228,6.509875 16.5246835,6.740625 16.7859494,7.05975 C17.0470886,7.378875 17.2051899,7.538375 17.2603797,7.538375 C17.2740506,7.538375 17.7005063,7.297375 18.5392405,6.815375 C18.5668354,6.795 18.5803797,6.77125 18.5803797,6.744125 C18.5803797,6.574375 18.4050633,6.106 18.054557,5.33875 C18.1782278,5.169 18.2813924,4.9925 18.3637975,4.809125 C19.3883544,4.707375 19.9006329,4.602125 19.9006329,4.4935 L19.9006329,3.06775 C19.9006329,2.959125 19.3883544,2.853875 18.3637975,2.752 L18.3637975,2.752 Z M16.8735443,4.70225 C16.6159494,4.956875 16.3046835,5.08425 15.9402532,5.08425 C15.5758228,5.08425 15.2646835,4.956875 15.006962,4.70225 C14.7491139,4.44775 14.6201266,4.1405 14.6201266,3.780625 C14.6201266,3.427625 14.7508861,3.122 15.0121519,2.864 C15.2734177,2.606 15.5827848,2.477 15.9402532,2.477 C16.2977215,2.477 16.6073418,2.606125 16.8686076,2.864 C17.1297468,3.122 17.2605063,3.427625 17.2605063,3.780625 C17.2603797,4.1405 17.131519,4.44775 16.8735443,4.70225 L16.8735443,4.70225 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span>'+(null==(n=t("panel_menu_advanced_settings"))?"":n)+'</span>\n\t\t</div>\n\t\t<div class="menu-option menu-broken-page flex align-middle">\n\t\t\t<svg width="19px" height="18px" viewBox="0 0 19 18">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M17.6593575,9.31215301 C18.9509219,8.56554918 19.3820842,6.92109579 18.6312577,5.63083237 L16.138206,1.34260393 C15.3882033,0.0526155015 13.7448434,-0.382422166 12.455476,0.366381607 L8.42616837,2.71014017 L7.90163337,3.89178167 L9.636169,4.80255585 L13.8994577,2.30947652 L16.6594455,7.08224123 L12.7515224,9.37017637 C12.7515224,9.37017637 11.7560044,9.87286212 11.3761971,10.2347519 C10.9963899,10.5969166 10.4729534,11.5398649 10.4729534,11.5398649 L8.113919,15.6820724 L3.34119975,12.9310504 L5.98886568,8.26058282 L4.08790691,8.34748036 L3.92065988,7.03686751 L1.36087416,11.5024659 C0.615265506,12.7957543 1.0626307,14.4349828 2.35639215,15.1760868 L6.6581284,17.6413919 C7.95188986,18.3835959 9.5922289,17.9367335 10.334542,16.6423452 L12.5433562,12.7850296 C12.5433562,12.7850296 12.8704353,12.2177206 13.1129298,11.993327 C13.3543257,11.7686584 13.9390038,11.4744167 13.9390038,11.4744167 L17.6593575,9.31215301 Z"></path>\n\t\t\t\t\t<polygon class="menu-icon" points="4.80242321 2 4 2.28676089 5.13611903 4.2454109 4.80242321 2.00100883"></polygon>\n\t\t\t\t\t<polygon class="menu-icon" points="0.729020149 2 0 3.64717271 3.61403597 4.34957295 0.729020149 2.00100883"></polygon>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span>'+(null==(n=t("panel_menu_report_broken_site"))?"":n)+'</span>\n\t\t</div>\n\t\t<div class="menu-option menu-submit-tracker flex align-middle">\n\t\t\t<svg width="16px" height="16px" viewBox="0 0 16 16">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M15.6817156,6.13639018 C15.4695724,5.92424705 15.2119601,5.81824522 14.9088785,5.81824522 L10.1816153,5.81824522 L10.1816153,1.09084252 C10.1816153,0.787900449 10.075474,0.530288105 9.86347034,0.318144968 C9.6513272,0.106141307 9.39385433,0 9.09063331,0 L6.90894826,0 C6.60600619,0 6.34839385,0.106001831 6.13625071,0.318144968 C5.92410757,0.530288105 5.81810574,0.787900449 5.81810574,1.09084252 L5.81810574,5.81824522 L1.09084252,5.81824522 C0.787900449,5.81824522 0.530288105,5.92424705 0.318144968,6.13639018 C0.106001831,6.34853332 0,6.60600619 0,6.90908774 L0,9.09105174 C0,9.39413329 0.106001831,9.65160615 0.318144968,9.86360982 C0.530288105,10.075753 0.787900449,10.1817548 1.09084252,10.1817548 L5.81810574,10.1817548 L5.81810574,14.909297 C5.81810574,15.212239 5.92410757,15.4699908 6.13625071,15.6819945 C6.34839385,15.8939982 6.60600619,16 6.90894826,16 L9.09077278,16 C9.39399381,16 9.65146668,15.8939982 9.86360982,15.6819945 C10.075753,15.4698514 10.1817548,15.212239 10.1817548,14.909297 L10.1817548,10.1817548 L14.909018,10.1817548 C15.2120996,10.1817548 15.4697119,10.075753 15.681855,9.86360982 C15.8938587,9.65160615 16,9.39413329 16,9.09105174 L16,6.90908774 C15.9998605,6.60600619 15.8939982,6.34839385 15.6817156,6.13639018 L15.6817156,6.13639018 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span>'+(null==(n=t("panel_menu_submit_tracker"))?"":n)+'</span>\n\t\t</div>\n\t\t<div class="menu-option menu-help flex align-middle">\n\t\t\t<svg width="18px" height="18px" viewBox="0 0 18 18">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M16.7932109,4.48238002 C15.9884451,3.10356235 14.8967253,2.01184255 13.5179077,1.20707676 C12.1388023,0.402310975 10.6332646,0 9.00028767,0 C7.36745457,0 5.86148535,0.402310975 4.48266769,1.20707676 C3.10370619,2.01169871 2.01198638,3.10341852 1.2072206,4.48238002 C0.402310975,5.86134152 0,7.36731074 0,9 C0,10.6328331 0.402454811,12.1385146 1.20707676,13.51762 C2.01184255,14.8962938 3.10356235,15.9881575 4.48252385,16.7929232 C5.86148535,17.597689 7.36731074,18 9.00014384,18 C10.6329769,18 12.1389462,17.597689 13.5177638,16.7929232 C14.8965815,15.9883013 15.9883013,14.8964376 16.7930671,13.51762 C17.597689,12.1386585 18,10.6326893 18,9 C18,7.3671669 17.597689,5.86119768 16.7932109,4.48238002 L16.7932109,4.48238002 Z M10.5003596,14.625018 C10.5003596,14.7343338 10.4649758,14.8242317 10.3947835,14.8944239 C10.3247351,14.9646162 10.2348372,14.9997123 10.1255214,14.9997123 L7.87534161,14.9997123 C7.76602579,14.9997123 7.67612792,14.9646162 7.60579182,14.8944239 C7.53545572,14.8242317 7.50035959,14.7343338 7.50035959,14.625018 L7.50035959,12.3748382 C7.50035959,12.2655224 7.53545572,12.1756245 7.60579182,12.1052884 C7.67612792,12.03524 7.76602579,12.0001438 7.87534161,12.0001438 L10.1255214,12.0001438 C10.2348372,12.0001438 10.3247351,12.03524 10.3947835,12.1052884 C10.4649758,12.1756245 10.5003596,12.2655224 10.5003596,12.3748382 L10.5003596,14.625018 L10.5003596,14.625018 Z M13.3537901,7.69914177 C13.256125,7.98825334 13.1468092,8.22472072 13.0256988,8.40825622 C12.9045884,8.59179172 12.7306899,8.77935465 12.5040035,8.97065733 C12.2777485,9.16210385 12.0979527,9.29889246 11.9649039,9.38102316 C11.8322865,9.46286618 11.6406962,9.57433955 11.390852,9.71486791 C11.1330968,9.86330728 10.9203625,10.0566237 10.7525052,10.2949609 C10.584504,10.5331543 10.5005034,10.7266146 10.5005034,10.8749101 C10.5005034,10.9843698 10.4651196,11.0742676 10.3949274,11.1444599 C10.3248789,11.214796 10.2349811,11.2498921 10.1256652,11.2498921 L7.87548545,11.2498921 C7.76616963,11.2498921 7.67627176,11.214796 7.60593566,11.1444599 C7.53559956,11.0742676 7.50050343,10.9843698 7.50050343,10.8749101 L7.50050343,10.4528935 C7.50050343,9.92947212 7.70547059,9.43913314 8.11569257,8.98216426 C8.52591456,8.52505154 8.97712998,8.18717936 9.46933883,7.96840389 C9.84417701,7.79666299 10.1098432,7.62075083 10.2660498,7.44109891 C10.422544,7.261447 10.5006473,7.02296591 10.5006473,6.726231 C10.5006473,6.46833197 10.3539339,6.23790574 10.0609388,6.03466462 C9.76794362,5.83156734 9.4342427,5.7300187 9.05911684,5.7300187 C8.65277844,5.7300187 8.31691998,5.82380016 8.05125378,6.01136309 C7.79335475,6.19878218 7.45749628,6.55822985 7.04339071,7.08941842 C6.97305461,7.18319988 6.87538956,7.23023445 6.75039555,7.23023445 C6.65661409,7.23023445 6.5823944,7.20678909 6.52773649,7.16004219 L4.98091768,5.9882054 C4.80126576,5.8475332 4.77005322,5.68355948 4.88713621,5.49599655 C5.8872321,3.8319509 7.33638587,2.99985616 9.23474133,2.99985616 C9.91465695,2.99985616 10.5787505,3.16009014 11.2271659,3.48041425 C11.8755813,3.80059452 12.4165508,4.25382366 12.850362,4.83981397 C13.2835978,5.42566045 13.5006473,6.06242509 13.5006473,6.74996404 C13.5002158,7.09373352 13.4511675,7.41003021 13.3537901,7.69914177 L13.3537901,7.69914177 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span>'+(null==(n=t("panel_menu_help"))?"":n)+'</span>\n\t\t</div>\n\t\t<div class="flex-fill"></div>\n\t\t<div class="menu-option signed-in-as flex align-middle">\n\t\t\t<svg width="17px" height="18px" viewBox="0 0 17 18">\n\t\t\t\t<g>\n\t\t\t\t\t<path class="menu-icon" d="M11.7415776,7.69057143 C12.6371552,6.81771429 13.0848707,5.76442857 13.0848707,4.53057143 C13.0848707,3.29685714 12.6371552,2.24357143 11.7415776,1.37057143 C10.8461466,0.497714286 9.76547414,0.0612857143 8.49985345,0.0612857143 C7.23423276,0.0612857143 6.15356034,0.497714286 5.25812931,1.37057143 C4.36255172,2.24357143 3.91483621,3.29685714 3.91483621,4.53057143 C3.91483621,5.76442857 4.36255172,6.81771429 5.25812931,7.69057143 C6.1537069,8.56342857 7.23423276,9 8.49985345,9 C9.76576724,9 10.8462931,8.56342857 11.7415776,7.69057143 Z"></path>\n\t\t\t\t\t<path class="menu-icon" d="M16.8637069,13.7195714 C16.8357155,13.3277143 16.7800259,12.9048571 16.6964914,12.4508571 C16.6129569,11.9968571 16.5072931,11.576 16.3799397,11.188 C16.2525862,10.8001429 16.0814138,10.4218571 15.8664224,10.0532857 C15.6515776,9.68471429 15.4047845,9.37042857 15.1260431,9.11042857 C14.8473017,8.85042857 14.5071552,8.643 14.1053103,8.48785714 C13.7031724,8.33271429 13.2594138,8.255 12.7738879,8.255 C12.7022241,8.255 12.5350086,8.33842857 12.2723879,8.50528571 C12.0097672,8.67214286 11.7132931,8.85842857 11.3829655,9.064 C11.0526379,9.26942857 10.6226552,9.45585714 10.0934569,9.62242857 C9.56411207,9.78928571 9.03286207,9.87271429 8.49941379,9.87271429 C7.96611207,9.87271429 7.43486207,9.78928571 6.90551724,9.62242857 C6.37631897,9.45585714 5.94633621,9.26942857 5.61600862,9.064 C5.28568103,8.85842857 4.9892069,8.67214286 4.72658621,8.50528571 C4.46381897,8.33842857 4.29675,8.255 4.22508621,8.255 C3.73956034,8.255 3.29580172,8.33271429 2.89381034,8.48785714 C2.49181897,8.643 2.15152586,8.85057143 1.87293103,9.11042857 C1.59433621,9.37042857 1.3475431,9.68471429 1.13269828,10.0532857 C0.917853448,10.4218571 0.746681034,10.8002857 0.619327586,11.188 C0.491974138,11.576 0.386456897,11.9968571 0.302922414,12.4508571 C0.219241379,12.9048571 0.163551724,13.3275714 0.135706897,13.7195714 C0.107862069,14.1115714 0.0939396552,14.513 0.0939396552,14.9242857 C0.0939396552,15.8552857 0.384551724,16.5905714 0.96562931,17.1298571 C1.5467069,17.669 2.31888793,17.9385714 3.28202586,17.9385714 L13.717681,17.9385714 C14.680819,17.9385714 15.4528534,17.669 16.0340776,17.1298571 C16.6153017,16.5905714 16.9057672,15.8554286 16.9057672,14.9242857 C16.9057672,14.513 16.8918448,14.1114286 16.8637069,13.7195714 L16.8637069,13.7195714 Z"></path>\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t\t<span></span>\n\t\t</div>\n\t\t<div class="menu-signin">\n\t\t\t'+(null==(n=t("panel_menu_signin"))?"":n)+'\n\t\t</div>\n\t\t<div class="menu-signout" style="display: none;">\n\t\t\t'+(null==(n=t("panel_menu_signout"))?"":n)+"\n\t\t</div>\n\t</div>\n</div>\n"};

},{}],33:[function(require,module,exports){
"use strict";module.exports=function(a){var d="";return d+='<div class="top-bar flex align-middle align-justify">\n\t<div class="header-back"></div>\n\t<a href="#/dashboard" class="header-logo"></a>\n\t<div class="flex-fill"></div>\n\t<div class="header-helper-text"></div>\n\t<div class="header-kebab" data-toggle="header-dropdown"></div>\n</div>\n'};

},{}],34:[function(require,module,exports){
"use strict";module.exports=function(e){var n,s="";return s+='<div id="content-help">\n\t<h1>'+(null==(n=t("panel_help_panel_header"))?"":n)+'</h1>\n\t<div class="support-section">\n\t\t<h3>'+(null==(n=t("panel_help_questions_header"))?"":n)+'</h3>\n\t\t<a href="https://ghostery.zendesk.com/hc/">'+(null==(n=t("panel_help_faq"))?"":n)+'</a>\n\t\t<a href="https://www.ghostery.com/survey/in-app">'+(null==(n=t("panel_help_feedback"))?"":n)+'</a>\n\t\t<a href="https://ghostery.zendesk.com/hc/">'+(null==(n=t("panel_help_support"))?"":n)+'</a>\n\t</div>\n\t<div class="support-section">\n\t\t<h3>'+(null==(n=t("panel_help_contact_header"))?"":n)+'</h3>\n\t\t<a class="info" href="mailto:info@ghostery.com">info@ghostery.com</a>\n\t</div>\n\t<div class="support-section">\n\t\t<h3>'+(null==(n=t("panel_help_version_header",[e.browser,e.version]))?"":n)+'</h3>\n\t\t<a href="https://www.ghostery.com/about-us/privacy-statements/ghostery-browser-extension/ghostery-browser-extension-end-user-license-agreem/">\n\t\t\t'+(null==(n=t("panel_help_license"))?"":n)+'\n\t\t</a>\n\t\t<a href="https://www.ghostery.com/about-us/privacy-statements/ghostery-browser-extension/ghostery-browser-extension-privacy-statement/">\n\t\t\t'+(null==(n=t("panel_help_privacy_statement"))?"":n)+'\n\t\t</a>\n\t\t<a href="https://www.ghostery.com/">Ghostery.com</a>\n\t</div>\n</div>\n'};

},{}],35:[function(require,module,exports){
"use strict";module.exports=function(l){var n,_="";return _+='<button class="modal-human-web-back" type="button"></button>\n<div style="overflow:auto;height:340px">\n\t<p>'+(null==(n=t("panel_human_web_learn_more_p1"))?"":n)+"</p>\n\t<p>"+(null==(n=t("panel_human_web_learn_more_p2"))?"":n)+"</p>\n\t<p>"+(null==(n=t("panel_human_web_learn_more_p3"))?"":n)+"</p>\n\t<p>"+(null==(n=t("panel_human_web_learn_more_p4"))?"":n)+"</p>\n\n\t<ul>"+(null==(n=t("panel_modal_learn_more_list_title"))?"":n)+"\n\t\t<li>"+(null==(n=t("panel_modal_human_web_learn_more_bullet_1"))?"":n)+"</li>\n\t\t<li>"+(null==(n=t("panel_modal_human_web_learn_more_bullet_2"))?"":n)+"</li>\n\t\t<li>"+(null==(n=t("panel_modal_human_web_learn_more_bullet_3"))?"":n)+"</li>\n\t\t<li>"+(null==(n=t("panel_modal_human_web_learn_more_bullet_4"))?"":n)+"</li>\n\t\t<li>"+(null==(n=t("panel_modal_human_web_learn_more_bullet_5"))?"":n)+"</li>\n\t</ul>\n</div>\n"};

},{}],36:[function(require,module,exports){
"use strict";module.exports=function(n){var l,a="";return a+='<div class="modal-content-container">\n\t<div class="modal-title">'+(null==(l=t("panel_modal_human_web_title"))?"":l)+"</div>\n\t<p>"+(null==(l=t("panel_modal_human_web_p1"))?"":l)+"</p>\n\t<p><b>"+(null==(l=t("panel_modal_human_web_p2"))?"":l)+'</b></p>\n\n\t<div class="modal-button-container">\n\t\t<button class="button human-web-opt-in">'+(null==(l=t("panel_modal_human_web_opt_in"))?"":l)+'</button>\n\t\t<div class="links">\n\t\t\t<a class="human-web-opt-out">'+(null==(l=t("panel_modal_human_web_opt_out"))?"":l)+'</a>\n\t\t</div>\n\t\t<div class="location-container">\n\t\t</div>\n\t</div>\n</div>\n'};

},{}],37:[function(require,module,exports){
"use strict";module.exports=function(l){var _,n="";return n+='<button class="modal-back" type="button"></button>\n<div class="modal-subtitle">'+(null==(_=t("panel_modal_learn_more_subtitle"))?"":_)+"</div>\n<ul>"+(null==(_=t("panel_modal_learn_more_list_title"))?"":_)+"\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_1"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_2"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_3"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_4"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_5"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_6"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_7"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_8"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_9"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_10"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_11"))?"":_)+"</li>\n\t<li>"+(null==(_=t("panel_modal_learn_more_bullet_12"))?"":_)+"</li>\n</ul>\n<ul>"+(null==(_=t("panel_modal_learn_more_end"))?"":_)+"</ul>\n"};

},{}],38:[function(require,module,exports){
"use strict";module.exports=function(n){var l,a="";return a+='<div id="signin-panel">\n\t<div class="row align-center">\n\t\t<div class="small-8 columns">\n\t\t\t<div id="login-email">\n\t\t\t\t<label for="login-input-email">\n\t\t\t\t\t'+(null==(l=t("email_field_label"))?"":l)+'<span class="asterisk">*</span>\n\t\t\t\t\t<input id="login-input-email" type="text" name="email" pattern=".{1,}" autocomplete="off">\n\t\t\t\t</label>\n\t\t\t\t<p class="warning">'+(null==(l=t("invalid_email_login"))?"":l)+'</p>\n\t\t\t</div>\n\t\t\t<div id="login-password">\n\t\t\t\t<label for="login-input-password">\n\t\t\t\t\t'+(null==(l=t("password_field_label"))?"":l)+'<span class="asterisk">*</span>\n\t\t\t\t\t<input id="login-input-password" type="password" name="password" pattern=".{1,}">\n\t\t\t\t</label>\n\t\t\t\t<p class="warning">'+(null==(l=t("password_field_label_required"))?"":l)+'</p>\n\t\t\t</div>\n\t\t\t<div class="account-signin-buttons-container row">\n\t\t\t\t<div class="small-6 columns text-center">\n\t\t\t\t\t<a href="#/dashboard" class="cancel button hollow">\n\t\t\t\t\t\t'+(null==(l=t("button_cancel"))?"":l)+'\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<div class="small-6 columns text-center">\n\t\t\t\t\t<div id="signin-button" class="button">\n\t\t\t\t\t\t'+(null==(l=t("panel_menu_signin"))?"":l)+'\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class="account-panel-action row">\n\t\t<div class="small-6 columns text-center">\n\t\t\t<a href="#/forgot-password">'+(null==(l=t("panel_forgot_password"))?"":l)+'</a>\n\t\t</div>\n\t\t<div class="small-6 columns text-center">\n\t\t\t<a href="#/create-account">'+(null==(l=t("panel_create_account"))?"":l)+'</a>\n\t\t</div>\n\t</div>\n\t<div class="row align-center footer-row">\n\t\t<div class="small-10 columns">\n\t\t\t<div class="account-panel-footer">\n\t\t\t\t<span>\n\t\t\t\t\t'+(null==(l=t("account_signin_privacy_statement"))?"":l)+"\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"};

},{}],39:[function(require,module,exports){
"use strict";module.exports=function(n){var l,a="";return a+='<div id="metrics-modal">\n\t<div class="modal-title">'+(null==(l=t("panel_modal_ghostrank_vc_header"))?"":l)+"</div>\n\t<p>"+(null==(l=t("panel_modal_ghostrank_vc_p1"))?"":l)+"</p>\n\t<p>"+(null==(l=t("panel_modal_ghostrank_vc_p2"))?"":l)+"</p>\n\t<p><b>"+(null==(l=t("panel_modal_ghostrank_vc_p3"))?"":l)+'</b></p>\n\t<div class="modal-button-container">\n\t\t<button class="button metrics-opt-in">'+(null==(l=t("panel_modal_ghostrank_opt_in"))?"":l)+'</button>\n\t\t<div class="links">\n\t\t\t<a class="metrics-opt-out">'+(null==(l=t("panel_modal_ghostrank_opt_out"))?"":l)+'</a>\n\t\t</div>\n\t\t<div class="location-container">\n\t\t</div>\n\t</div>\n</div>\n'};

},{}],40:[function(require,module,exports){
"use strict";module.exports=function(s){var n,e="";return e+='<div id="content-settings">\n\t<div class="row collapse">\n\t\t<div class="fixed-width-left small-12 columns">\n\t\t\t<ul class="tabs vertical" id="settings-tabs" data-tabs data-match-height="true" data-auto-focus="true">\n\t\t\t\t<li class="tabs-title is-active">\n\t\t\t\t\t<a href="#settings-trackers" aria-selected="true"><span>'+(null==(n=t("settings_trackers"))?"":n)+" &amp; "+(null==(n=t("settings_blocking"))?"":n)+'</span></a>\n\t\t\t\t</li>\n\t\t\t\t<li class="tabs-title">\n\t\t\t\t\t<a href="#settings-purple-box"><span>'+(null==(n=t("settings_purple_box"))?"":n)+'</span></a>\n\t\t\t\t</li>\n\t\t\t\t<li class="tabs-title">\n\t\t\t\t\t<a href="#settings-notifications"><span>'+(null==(n=t("settings_notifications"))?"":n)+'</span></a>\n\t\t\t\t</li>\n\t\t\t\t<li class="tabs-title">\n\t\t\t\t\t<a href="#settings-support-ghostery"><span>'+(null==(n=t("settings_support_ghostery"))?"":n)+'</span></a>\n\t\t\t\t</li>\n\t\t\t\t<li class="tabs-title">\n\t\t\t\t\t<a href="#settings-account"><span>'+(null==(n=t("settings_account"))?"":n)+'</span></a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<div class="small-12 fixed-width-right columns">\n\t\t\t<div class="tabs-content vertical" data-tabs-content="settings-tabs">\n\t\t\t\t<!-- ............................ -->\n\t\t\t\t<!--\tTrackers & Blocking panel -->\n\t\t\t\t<!-- ............................ -->\n\t\t\t\t<div class="tabs-panel is-active" id="settings-trackers">\n\t\t\t\t\t<h3>'+(null==(n=t("settings_trackers"))?"":n)+'</h3>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-auto-update">\n\t\t\t\t\t\t\t<label id="settings-auto-update-label" for="settings-auto-update">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_auto_update"))?"":n)+'\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<div class="checkbox-label">\n\t\t\t\t\t\t\t\t<span id="last-updated-span">'+(null==(n=t("settings_last_update"))?"":n)+'</span>&nbsp<span id="last-updated-span-value"></span>\n\t\t\t\t\t\t\t\t<span id="update-now-span" class="blue-header">'+(null==(n=t("settings_update_now"))?"":n)+'</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-show-patterns">\n\t\t\t\t\t\t\t<label id="settings-show-patterns-label" for="settings-show-patterns"><span>'+(null==(n=t("settings_show_patterns"))?"":n)+'</span></label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_show_patterns_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<h5>'+(null==(n=t("settings_highlight_trackers"))?"":n)+"</h5>\n\t\t\t\t\t<img  src='../../app/images/panel/question.svg' data-tooltip title=\""+(null==(n=t("settings_highlight_trackers_tooltip"))?"":n)+'"\n\t\t\t\t\t\t\tdata-template-classes="settings-tooltip click-to-play-img" class="question has-tip">\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t   <div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-enable-click2play">\n\t\t\t\t\t\t\t<label id="settings-enable-click2play-label" for="settings-enable-click2play">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_required_trackers"))?"":n)+'\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-replace-social">\n\t\t\t\t\t\t\t<label id="settings-replace-social-label" for="settings-replace-social">'+(null==(n=t("settings_replace_social"))?"":n)+"</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<h3>"+(null==(n=t("settings_blocking"))?"":n)+'</h3>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-individual-trackers">\n\t\t\t\t\t\t\t<label id="settings-individual-trackers-label" for="settings-individual-trackers">\n\t\t\t\t\t\t\t\t<span>'+(null==(n=t("settings_individual_trackers"))?"":n)+'</span>\n\t\t\t\t\t\t\t</label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_individual_trackers_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-allow-trackers">\n\t\t\t\t\t\t\t<label id="settings-allow-trackers-label" for="settings-allow-trackers"><span>'+(null==(n=t("settings_allow_trackers"))?"":n)+'</span></label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_allow_trackers_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-block-trackers">\n\t\t\t\t\t\t\t<label id="settings-block-trackers-label" for="settings-block-trackers">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_block_trackers"))?"":n)+'\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<!-- ...................... -->\n\t\t\t\t<!--\tPurple box panel  \t-->\n\t\t\t\t<!-- ...................... -->\n\t\t\t\t<div class="tabs-panel" id="settings-purple-box">\n\t\t\t\t\t<h3>'+(null==(n=t("settings_purple_box"))?"":n)+'</h3>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-show-purple-box">\n\t\t\t\t\t\t\t<label id="settings-show-purple-box-label" for="settings-show-purple-box"><span>'+(null==(n=t("settings_show_purple_box"))?"":n)+'</span></label>\n\t\t\t\t\t\t\t<img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_show_purple_box_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="alert-bubble-options dismiss-after-wrap">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t'+(null==(n=t("settings_dismiss_after"))?"":n)+'&colon;\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<select id="settings-dismiss-after">\n\t\t\t\t\t\t\t<option value="0">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_never"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="3">\n\t\t\t\t\t\t\t\t3 '+(null==(n=t("settings_seconds"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="5">\n\t\t\t\t\t\t\t\t5 '+(null==(n=t("settings_seconds"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="10">\n\t\t\t\t\t\t\t\t10 '+(null==(n=t("settings_seconds"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="15">\n\t\t\t\t\t\t\t\t15 '+(null==(n=t("settings_seconds"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="30">\n\t\t\t\t\t\t\t\t30 '+(null==(n=t("settings_seconds"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="alert-bubble-options display-in-wrap">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t'+(null==(n=t("settings_display_in"))?"":n)+'&colon;\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<select id="settings-display-in">\n\t\t\t\t\t\t\t<option value="br">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_bottom_right_corner"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="bl">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_bottom_left_corner"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="tr">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_top_right_corner"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t<option value="tl">\n\t\t\t\t\t\t\t\t'+(null==(n=t("settings_top_left_corner"))?"":n)+'\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-hide-alert-trusted">\n\t\t\t\t\t\t\t<label id="settings-hide-alert-trusted-label" for="settings-hide-alert-trusted"><span>'+(null==(n=t("settings_hide_alert_trusted"))?"":n)+'</span></label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<!-- ...................... -->\n\t\t\t\t<!--\tNotification panel  -->\n\t\t\t\t<!-- ...................... -->\n\t\t\t\t<div class="tabs-panel" id="settings-notifications">\n\t\t\t\t\t<h3>'+(null==(n=t("settings_notifications"))?"":n)+"</h3>\n\t\t\t\t\t<h5>"+(null==(n=t("settings_notify_me"))?"":n)+'</h5><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_notify_me_tooltip"))?"":n)+'">\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-announcements">\n\t\t\t\t\t\t\t<label id="settings-announcements-label" for="settings-announcements">'+(null==(n=t("settings_announcements"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-new-features">\n\t\t\t\t\t\t\t<label id="settings-new-features-label" for="settings-new-features">'+(null==(n=t("settings_new_features"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-defect-fixes">\n\t\t\t\t\t\t\t<label id="settings-defect-fixes-label" for="settings-defect-fixes">'+(null==(n=t("settings_defect_fixes"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-new-trackers">\n\t\t\t\t\t\t\t<label id="settings-new-trackers-label" for="settings-new-trackers">'+(null==(n=t("settings_new_trackers"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-show-reload-banner">\n\t\t\t\t\t\t\t<label id="settings-show-reload-banner-label" for="settings-show-reload-banner">'+(null==(n=t("settings_show_reload_banner"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-show-trackers-banner">\n\t\t\t\t\t\t\t<label id="settings-show-trackers-banner-label" for="settings-show-trackers-banner">'+(null==(n=t("settings_show_trackers_banner"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-show-count-badge">\n\t\t\t\t\t\t\t<label id="settings-show-count-badge-label" for="settings-show-count-badge">'+(null==(n=t("settings_show_tracker_count_badge"))?"":n)+'</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<!-- ................. -->\n\t\t\t\t<!--\tSupport panel  -->\n\t\t\t\t<!-- ................. -->\n\t\t\t\t<div class="tabs-panel" id="settings-support-ghostery">\n\t\t\t\t\t<h3>'+(null==(n=t("settings_support_ghostery"))?"":n)+"</h3>\n\t\t\t\t\t<h5>"+(null==(n=t("settings_support_ghostery_by"))?"":n)+'&colon;</h5>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-share-data">\n\t\t\t\t\t\t\t<label id="settings-share-data-label" for="settings-share-data">\n\t\t\t\t\t\t\t\t<span>'+(null==(n=t("settings_share_data"))?"":n)+'</span>\n\t\t\t\t\t\t\t</label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_share_data_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-share-usage">\n\t\t\t\t\t\t\t<label id="settings-share-usage-label" for="settings-share-usage">\n\t\t\t\t\t\t\t\t<span>'+(null==(n=t("settings_share_usage"))?"":n)+'</span>\n\t\t\t\t\t\t\t</label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_share_usage_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="option-group" id="human-web-section">\n\t\t\t\t\t\t<div class="suboption square-checkbox">\n\t\t\t\t\t\t\t<input type="checkbox" id="settings-share-human-web">\n\t\t\t\t\t\t\t<label id="settings-share-human-web-label" for="settings-share-human-web">\n\t\t\t\t\t\t\t\t<span>'+(null==(n=t("settings_share_human_web"))?"":n)+'</span>\n\t\t\t\t\t\t\t</label><img src=\'../../app/images/panel/question.svg\' data-tooltip data-template-classes="settings-tooltip" class="question has-tip" title="'+(null==(n=t("settings_human_web_tooltip"))?"":n)+'">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<!-- ................. -->\n\t\t\t\t<!--\tAccount panel  -->\n\t\t\t\t<!-- ................. -->\n\t\t\t\t<div class="tabs-panel" id="settings-account">\n\t\t\t\t\t<h3>'+(null==(n=t("settings_account"))?"":n)+'</h3>\n\t\t\t\t\t<div id="settings-account-not-signed">\n\t\t\t\t\t\t<p class="blue-header signin-create">'+(null==(n=t("settings_signin_create_header"))?"":n)+"</p>\n\t\t\t\t\t\t<p>"+(null==(n=t("settings_sign_create_text"))?"":n)+'</p>\n\t\t\t\t\t\t<div class="vgap-46"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id="settings-account-signed">\n\t\t\t\t\t\t<div class="vgap-22"></div>\n\t\t\t\t\t\t<h5 id="settings-account-name">'+(null==(n=t("settings_account_name"))?"":n)+':  <span></span></h5>\n\t\t\t\t\t\t<div class="vgap-4"></div>\n\t\t\t\t\t\t<h5 id="settings-account-email">'+(null==(n=t("settings_account_email"))?"":n)+': <span></span></h5>\n\t\t\t\t\t\t<div class="vgap-4"></div>\n\t\t\t\t\t\t<p class="blue-header edit-account">'+(null==(n=t("settings_edit_account"))?"":n)+'</p>\n\t\t\t\t\t\t<div class="vgap-26"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id="import-export">\n\t\t\t\t\t\t<p class="blue-header export">'+(null==(n=t("settings_export_header"))?"":n)+'</p>\n\t\t\t\t\t\t<p class="regular">'+(null==(n=t("settings_export_text"))?"":n)+'</p>\n\t\t\t\t\t\t<p class="regular export-result"></p>\n\t\t\t\t\t\t<div class="vgap-20"></div>\n\t\t\t\t\t\t<p class="blue-header import">'+(null==(n=t("settings_import_header"))?"":n)+'</p>\n\t\t\t\t\t\t<p class="regular">'+(null==(n=t("settings_import_text"))?"":n)+'</p>\n\t\t\t\t\t\t<p class="regular">'+(null==(n=t("settings_import_warning"))?"":n)+'</p>\n\t\t\t\t\t\t<p class="regular import-result"></p>\n\t\t\t\t\t\t<input type="file" id="select-file" name="select-file"/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n\n'};

},{}],41:[function(require,module,exports){
"use strict";module.exports=function(n){var s,a="";return a+='<div id="content-summary" class="flex vertical align-middle">\n\t<div class="tracker-count-total">\n\t\t<span class="count"></span>\n\t\t<span class="text"></span>\n\t</div>\n\t<div class="tracker-found-text">'+(null==(s=t("summary_found_on"))?"":s)+'</div>\n\t<div class="tracker-host">http://www.</div>\n\t<div class="tracker-category-wheel">\n\t\t<div id="categories-donut"></div>\n\t\t<div class="categories-donut-count"></div>\n\t</div>\n\t<div class="tracker-count-blocked" style="display:none;">\n\t\t<span class="count"></span>\n\t\t<span class="text">'+(null==(s=t("summary_blocked"))?"":s)+'</span>\n\t</div>\n\t<div class="tracker-count-alerts" style="display:none;">\n\t\t<span class="count"></span>\n\t\t<span class="text"></span>\n\t</div>\n\t<div class="flex-fill"></div>\n\t<div class="flex-fill not-scanned-title">'+(null==(s=t("summary_page_not_scanned"))?"":s)+'</div>\n\t<div class="flex-fill not-scanned-text">\n\t\t'+(null==(s=t("summary_description_not_scanned_1"))?"":s)+"\n\t\t<br><br>\n\t\t"+(null==(s=t("summary_description_not_scanned_2"))?"":s)+'\n\t</div>\n\t<div class="tracker-latency-total"></div>\n\t<button class="button hollow blocking-controls controls-trust">\n\t\t<svg class="float-left" width="12px" height="15px" viewbox="0 0 12 15">\n\t\t\t<g transform="translate(-16, -7.5)">\n\t\t\t\t<path d="M27.37504,10.4438 L22,9.01884 C21.92496,8.99372 21.82512,8.99372 21.75008,9.01884 L16.37504,10.4438 C16.15008,10.49372 16,10.69372 16,10.91868 C16.02512,14.7438 18.07504,18.29372 21.6,20.66876 C21.67504,20.71868 21.77504,20.7438 21.87504,20.7438 C21.97504,20.7438 22.07504,20.71868 22.15008,20.66876 C25.67504,18.29372 27.72496,14.7438 27.75008,10.91868 C27.75008,10.69372 27.6,10.49372 27.37504,10.4438 L27.37504,10.4438 Z"></path>\n\t\t\t</g>\n\t\t</svg>\n\t\t<span class="button-not-hover">'+(null==(s=t("summary_trust_site"))?"":s)+'</span>\n\t\t<span class="button-hover">'+(null==(s=t("summary_undo"))?"":s)+'</span>\n\t</button>\n\t<button class="button hollow blocking-controls controls-restrict">\n\t\t<svg class="float-left" width="11px" height="15px" viewbox="0 0 12 15">\n\t\t\t<g transform="translate(-4, -2)">\n\t\t\t\t<path d="M5.55172414,8.72413793 L5.00983788,8.72413793 C4.44608245,8.72413793 4,9.1710752 4,9.72240026 L4,16.0017377 C4,16.5550537 4.45211982,17 5.00983788,17 L14.3694725,17 C14.9332279,17 15.3793103,16.5530627 15.3793103,16.0017377 L15.3793103,9.72240026 C15.3793103,9.16908422 14.9271905,8.72413793 14.3694725,8.72413793 L13.8275862,8.72413793 L13.8275862,6.14413585 C13.8275862,3.85883621 11.9749714,2 9.68965517,2 C7.40898913,2 5.55172414,3.85539282 5.55172414,6.14413585 L5.55172414,8.72413793 Z M6.24137931,8.75429684 L6.24137931,6.14072417 C6.24137931,4.23475139 7.78480627,2.68965517 9.68965517,2.68965517 C11.5940853,2.68965517 13.137931,4.23329227 13.137931,6.13864323 L13.137931,8.78402473 L6.24137931,8.75429684 Z"></path>\n\t\t\t</g>\n\t\t</svg>\n\t\t<span class="button-not-hover">'+(null==(s=t("summary_restrict_site"))?"":s)+'</span>\n\t\t<span class="button-hover">'+(null==(s=t("summary_undo"))?"":s)+'</span>\n\t</button>\n\t<button class="button hollow blocking-controls controls-pause">\n\t\t<span class="button-not-active">'+(null==(s=t("summary_pause_ghostery"))?"":s)+'</span>\n\t\t<span class="button-active">'+(null==(s=t("summary_resume_ghostery"))?"":s)+'</span>\n\t</button>\n\t<div class="map-trackers">'+(null==(s=t("summary_map_these_trackers"))?"":s)+"</div>\n</div>\n"};

},{}],42:[function(require,module,exports){
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(t){function e(t){if(void 0===Function.prototype.name){var e=/function\s([^(]{1,})\(/,i=e.exec(t.toString());return i&&i.length>1?i[1].trim():""}return void 0===t.prototype?t.constructor.name:t.prototype.constructor.name}function i(t){return!!/true/.test(t)||!/false/.test(t)&&(isNaN(1*t)?t:parseFloat(t))}function n(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}var o="6.2.4",s={version:o,_plugins:{},_uuids:[],rtl:function(){return"rtl"===t("html").attr("dir")},plugin:function(t,i){var o=i||e(t),s=n(o);this._plugins[s]=this[o]=t},registerPlugin:function(t,i){var o=i?n(i):e(t.constructor).toLowerCase();t.uuid=this.GetYoDigits(6,o),t.$element.attr("data-"+o)||t.$element.attr("data-"+o,t.uuid),t.$element.data("zfPlugin")||t.$element.data("zfPlugin",t),t.$element.trigger("init.zf."+o),this._uuids.push(t.uuid)},unregisterPlugin:function(t){var i=n(e(t.$element.data("zfPlugin").constructor));this._uuids.splice(this._uuids.indexOf(t.uuid),1),t.$element.removeAttr("data-"+i).removeData("zfPlugin").trigger("destroyed.zf."+i);for(var o in t)t[o]=null},reInit:function(e){var i=e instanceof t;try{if(i)e.each(function(){t(this).data("zfPlugin")._init()});else{var o="undefined"==typeof e?"undefined":_typeof(e),s=this,a={object:function(e){e.forEach(function(e){e=n(e),t("[data-"+e+"]").foundation("_init")})},string:function(){e=n(e),t("[data-"+e+"]").foundation("_init")},undefined:function(){this.object(Object.keys(s._plugins))}};a[o](e)}}catch(t){console.error(t)}finally{return e}},GetYoDigits:function(t,e){return t=t||6,Math.round(Math.pow(36,t+1)-Math.random()*Math.pow(36,t)).toString(36).slice(1)+(e?"-"+e:"")},reflow:function(e,n){"undefined"==typeof n?n=Object.keys(this._plugins):"string"==typeof n&&(n=[n]);var o=this;t.each(n,function(n,s){var a=o._plugins[s],r=t(e).find("[data-"+s+"]").addBack("[data-"+s+"]");r.each(function(){var e=t(this),n={};if(e.data("zfPlugin"))return void console.warn("Tried to initialize "+s+" on an element that already has a Foundation plugin.");e.attr("data-options")&&e.attr("data-options").split(";").forEach(function(t,e){var o=t.split(":").map(function(t){return t.trim()});o[0]&&(n[o[0]]=i(o[1]))});try{e.data("zfPlugin",new a(t(this),n))}catch(t){console.error(t)}finally{return}})})},getFnName:e,transitionend:function(t){var e,i={transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend"},n=document.createElement("div");for(var o in i)"undefined"!=typeof n.style[o]&&(e=i[o]);return e?e:(e=setTimeout(function(){t.triggerHandler("transitionend",[t])},1),"transitionend")}};s.util={throttle:function(t,e){var i=null;return function(){var n=this,o=arguments;null===i&&(i=setTimeout(function(){t.apply(n,o),i=null},e))}}};var a=function(i){var n="undefined"==typeof i?"undefined":_typeof(i),o=t("meta.foundation-mq"),a=t(".no-js");if(o.length||t('<meta class="foundation-mq">').appendTo(document.head),a.length&&a.removeClass("no-js"),"undefined"===n)s.MediaQuery._init(),s.reflow(this);else{if("string"!==n)throw new TypeError("We're sorry, "+n+" is not a valid parameter. You must use a string representing the method you wish to invoke.");var r=Array.prototype.slice.call(arguments,1),l=this.data("zfPlugin");if(void 0===l||void 0===l[i])throw new ReferenceError("We're sorry, '"+i+"' is not an available method for "+(l?e(l):"this element")+".");1===this.length?l[i].apply(l,r):this.each(function(e,n){l[i].apply(t(n).data("zfPlugin"),r)})}return this};window.Foundation=s,t.fn.foundation=a,function(){Date.now&&window.Date.now||(window.Date.now=Date.now=function(){return(new Date).getTime()});for(var t=["webkit","moz"],e=0;e<t.length&&!window.requestAnimationFrame;++e){var i=t[e];window.requestAnimationFrame=window[i+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i+"CancelAnimationFrame"]||window[i+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var n=0;window.requestAnimationFrame=function(t){var e=Date.now(),i=Math.max(n+16,e);return setTimeout(function(){t(n=i)},i-e)},window.cancelAnimationFrame=clearTimeout}window.performance&&window.performance.now||(window.performance={start:Date.now(),now:function(){return Date.now()-this.start}})}(),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),i=this,n=function(){},o=function(){return i.apply(this instanceof n?this:t,e.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(n.prototype=this.prototype),o.prototype=new n,o})}(jQuery),!function(t){function e(t,e,n,o){var s,a,r,l,d=i(t);if(e){var h=i(e);a=d.offset.top+d.height<=h.height+h.offset.top,s=d.offset.top>=h.offset.top,r=d.offset.left>=h.offset.left,l=d.offset.left+d.width<=h.width+h.offset.left}else a=d.offset.top+d.height<=d.windowDims.height+d.windowDims.offset.top,s=d.offset.top>=d.windowDims.offset.top,r=d.offset.left>=d.windowDims.offset.left,l=d.offset.left+d.width<=d.windowDims.width;var u=[a,s,r,l];return n?r===l==1:o?s===a==1:u.indexOf(!1)===-1}function i(t,e){if(t=t.length?t[0]:t,t===window||t===document)throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");var i=t.getBoundingClientRect(),n=t.parentNode.getBoundingClientRect(),o=document.body.getBoundingClientRect(),s=window.pageYOffset,a=window.pageXOffset;return{width:i.width,height:i.height,offset:{top:i.top+s,left:i.left+a},parentDims:{width:n.width,height:n.height,offset:{top:n.top+s,left:n.left+a}},windowDims:{width:o.width,height:o.height,offset:{top:s,left:a}}}}function n(t,e,n,o,s,a){var r=i(t),l=e?i(e):null;switch(n){case"top":return{left:Foundation.rtl()?l.offset.left-r.width+l.width:l.offset.left,top:l.offset.top-(r.height+o)};case"left":return{left:l.offset.left-(r.width+s),top:l.offset.top};case"right":return{left:l.offset.left+l.width+s,top:l.offset.top};case"center top":return{left:l.offset.left+l.width/2-r.width/2,top:l.offset.top-(r.height+o)};case"center bottom":return{left:a?s:l.offset.left+l.width/2-r.width/2,top:l.offset.top+l.height+o};case"center left":return{left:l.offset.left-(r.width+s),top:l.offset.top+l.height/2-r.height/2};case"center right":return{left:l.offset.left+l.width+s+1,top:l.offset.top+l.height/2-r.height/2};case"center":return{left:r.windowDims.offset.left+r.windowDims.width/2-r.width/2,top:r.windowDims.offset.top+r.windowDims.height/2-r.height/2};case"reveal":return{left:(r.windowDims.width-r.width)/2,top:r.windowDims.offset.top+o};case"reveal full":return{left:r.windowDims.offset.left,top:r.windowDims.offset.top};case"left bottom":return{left:l.offset.left,top:l.offset.top+l.height};case"right bottom":return{left:l.offset.left+l.width+s-r.width,top:l.offset.top+l.height};default:return{left:Foundation.rtl()?l.offset.left-r.width+l.width:l.offset.left+s,top:l.offset.top+l.height+o}}}Foundation.Box={ImNotTouchingYou:e,GetDimensions:i,GetOffsets:n}}(jQuery),!function(t){function e(t){var e={};for(var i in t)e[t[i]]=t[i];return e}var i={9:"TAB",13:"ENTER",27:"ESCAPE",32:"SPACE",37:"ARROW_LEFT",38:"ARROW_UP",39:"ARROW_RIGHT",40:"ARROW_DOWN"},n={},o={keys:e(i),parseKey:function(t){var e=i[t.which||t.keyCode]||String.fromCharCode(t.which).toUpperCase();return t.shiftKey&&(e="SHIFT_"+e),t.ctrlKey&&(e="CTRL_"+e),t.altKey&&(e="ALT_"+e),e},handleKey:function(e,i,o){var s,a,r,l=n[i],d=this.parseKey(e);if(!l)return console.warn("Component not defined!");if(s="undefined"==typeof l.ltr?l:Foundation.rtl()?t.extend({},l.ltr,l.rtl):t.extend({},l.rtl,l.ltr),a=s[d],r=o[a],r&&"function"==typeof r){var h=r.apply();(o.handled||"function"==typeof o.handled)&&o.handled(h)}else(o.unhandled||"function"==typeof o.unhandled)&&o.unhandled()},findFocusable:function(e){return e.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function(){return!(!t(this).is(":visible")||t(this).attr("tabindex")<0)})},register:function(t,e){n[t]=e}};Foundation.Keyboard=o}(jQuery);var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(t){function e(t){var e={};return"string"!=typeof t?e:(t=t.trim().slice(1,-1))?e=t.split("&").reduce(function(t,e){var i=e.replace(/\+/g," ").split("="),n=i[0],o=i[1];return n=decodeURIComponent(n),o=void 0===o?null:decodeURIComponent(o),t.hasOwnProperty(n)?Array.isArray(t[n])?t[n].push(o):t[n]=[t[n],o]:t[n]=o,t},{}):e}var i={queries:[],current:"",_init:function(){var i,n=this,o=t(".foundation-mq").css("font-family");i=e(o);for(var s in i)i.hasOwnProperty(s)&&n.queries.push({name:s,value:"only screen and (min-width: "+i[s]+")"});this.current=this._getCurrentSize(),this._watcher()},atLeast:function(t){var e=this.get(t);return!!e&&window.matchMedia(e).matches},get:function(t){for(var e in this.queries)if(this.queries.hasOwnProperty(e)){var i=this.queries[e];if(t===i.name)return i.value}return null},_getCurrentSize:function(){for(var t,e=0;e<this.queries.length;e++){var i=this.queries[e];window.matchMedia(i.value).matches&&(t=i)}return"object"===("undefined"==typeof t?"undefined":_typeof(t))?t.name:t},_watcher:function(){var e=this;t(window).on("resize.zf.mediaquery",function(){var i=e._getCurrentSize(),n=e.current;i!==n&&(e.current=i,t(window).trigger("changed.zf.mediaquery",[i,n]))})}};Foundation.MediaQuery=i,window.matchMedia||(window.matchMedia=function(){var t=window.styleMedia||window.media;if(!t){var e=document.createElement("style"),i=document.getElementsByTagName("script")[0],n=null;e.type="text/css",e.id="matchmediajs-test",i&&i.parentNode&&i.parentNode.insertBefore(e,i),n="getComputedStyle"in window&&window.getComputedStyle(e,null)||e.currentStyle,t={matchMedium:function(t){var i="@media "+t+"{ #matchmediajs-test { width: 1px; } }";return e.styleSheet?e.styleSheet.cssText=i:e.textContent=i,"1px"===n.width}}}return function(e){return{matches:t.matchMedium(e||"all"),media:e||"all"}}}()),Foundation.MediaQuery=i}(jQuery),!function(t){function e(t,e,i){function n(r){a||(a=window.performance.now()),s=r-a,i.apply(e),s<t?o=window.requestAnimationFrame(n,e):(window.cancelAnimationFrame(o),e.trigger("finished.zf.animate",[e]).triggerHandler("finished.zf.animate",[e]))}var o,s,a=null;o=window.requestAnimationFrame(n)}function i(e,i,s,a){function r(){e||i.hide(),l(),a&&a.apply(i)}function l(){i[0].style.transitionDuration=0,i.removeClass(d+" "+h+" "+s)}if(i=t(i).eq(0),i.length){var d=e?n[0]:n[1],h=e?o[0]:o[1];l(),i.addClass(s).css("transition","none"),requestAnimationFrame(function(){i.addClass(d),e&&i.show()}),requestAnimationFrame(function(){i[0].offsetWidth,i.css("transition","").addClass(h)}),i.one(Foundation.transitionend(i),r)}}var n=["mui-enter","mui-leave"],o=["mui-enter-active","mui-leave-active"],s={animateIn:function(t,e,n){i(!0,t,e,n)},animateOut:function(t,e,n){i(!1,t,e,n)}};Foundation.Move=e,Foundation.Motion=s}(jQuery),!function(t){var e={Feather:function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"zf";e.attr("role","menubar");var n=e.find("li").attr({role:"menuitem"}),o="is-"+i+"-submenu",s=o+"-item",a="is-"+i+"-submenu-parent";e.find("a:first").attr("tabindex",0),n.each(function(){var e=t(this),i=e.children("ul");i.length&&(e.addClass(a).attr({"aria-haspopup":!0,"aria-expanded":!1,"aria-label":e.children("a:first").text()}),i.addClass("submenu "+o).attr({"data-submenu":"","aria-hidden":!0,role:"menu"})),e.parent("[data-submenu]").length&&e.addClass("is-submenu-item "+s)})},Burn:function(t,e){var i=(t.find("li").removeAttr("tabindex"),"is-"+e+"-submenu"),n=i+"-item",o="is-"+e+"-submenu-parent";t.find(">li, .menu, .menu > li").removeClass(i+" "+n+" "+o+" is-submenu-item submenu is-active").removeAttr("data-submenu").css("display","")}};Foundation.Nest=e}(jQuery),!function(t){function e(t,e,i){var n,o,s=this,a=e.duration,r=Object.keys(t.data())[0]||"timer",l=-1;this.isPaused=!1,this.restart=function(){l=-1,clearTimeout(o),this.start()},this.start=function(){this.isPaused=!1,clearTimeout(o),l=l<=0?a:l,t.data("paused",!1),n=Date.now(),o=setTimeout(function(){e.infinite&&s.restart(),i&&"function"==typeof i&&i()},l),t.trigger("timerstart.zf."+r)},this.pause=function(){this.isPaused=!0,clearTimeout(o),t.data("paused",!0);var e=Date.now();l-=e-n,t.trigger("timerpaused.zf."+r)}}function i(e,i){function n(){o--,0===o&&i()}var o=e.length;0===o&&i(),e.each(function(){this.complete?n():"undefined"!=typeof this.naturalWidth&&this.naturalWidth>0?n():t(this).one("load",function(){n()})})}Foundation.Timer=e,Foundation.onImagesLoaded=i}(jQuery),function(t){function e(){this.removeEventListener("touchmove",i),this.removeEventListener("touchend",e),d=!1}function i(i){if(t.spotSwipe.preventDefault&&i.preventDefault(),d){var n,o=i.touches[0].pageX,a=(i.touches[0].pageY,s-o);l=(new Date).getTime()-r,Math.abs(a)>=t.spotSwipe.moveThreshold&&l<=t.spotSwipe.timeThreshold&&(n=a>0?"left":"right"),n&&(i.preventDefault(),e.call(this),t(this).trigger("swipe",n).trigger("swipe"+n))}}function n(t){1==t.touches.length&&(s=t.touches[0].pageX,a=t.touches[0].pageY,d=!0,r=(new Date).getTime(),this.addEventListener("touchmove",i,!1),this.addEventListener("touchend",e,!1))}function o(){this.addEventListener&&this.addEventListener("touchstart",n,!1)}t.spotSwipe={version:"1.0.0",enabled:"ontouchstart"in document.documentElement,preventDefault:!1,moveThreshold:75,timeThreshold:200};var s,a,r,l,d=!1;t.event.special.swipe={setup:o},t.each(["left","up","down","right"],function(){t.event.special["swipe"+this]={setup:function(){t(this).on("swipe",t.noop)}}})}(jQuery),!function(t){t.fn.addTouch=function(){this.each(function(i,n){t(n).bind("touchstart touchmove touchend touchcancel",function(){e(event)})});var e=function(t){var e,i=t.changedTouches,n=i[0],o={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup"},s=o[t.type];"MouseEvent"in window&&"function"==typeof window.MouseEvent?e=new window.MouseEvent(s,{bubbles:!0,cancelable:!0,screenX:n.screenX,screenY:n.screenY,clientX:n.clientX,clientY:n.clientY}):(e=document.createEvent("MouseEvent"),e.initMouseEvent(s,!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null)),n.target.dispatchEvent(e)}}}(jQuery);var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(t){function e(){s(),n(),o(),i()}function i(e){var i=t("[data-yeti-box]"),n=["dropdown","tooltip","reveal"];if(e&&("string"==typeof e?n.push(e):"object"===("undefined"==typeof e?"undefined":_typeof(e))&&"string"==typeof e[0]?n.concat(e):console.error("Plugin names must be strings")),i.length){var o=n.map(function(t){return"closeme.zf."+t}).join(" ");t(window).off(o).on(o,function(e,i){var n=e.namespace.split(".")[0],o=t("[data-"+n+"]").not('[data-yeti-box="'+i+'"]');o.each(function(){var e=t(this);e.triggerHandler("close.zf.trigger",[e])})})}}function n(e){var i=void 0,n=t("[data-resize]");n.length&&t(window).off("resize.zf.trigger").on("resize.zf.trigger",function(o){i&&clearTimeout(i),i=setTimeout(function(){a||n.each(function(){t(this).triggerHandler("resizeme.zf.trigger")}),n.attr("data-events","resize")},e||10)})}function o(e){var i=void 0,n=t("[data-scroll]");n.length&&t(window).off("scroll.zf.trigger").on("scroll.zf.trigger",function(o){i&&clearTimeout(i),i=setTimeout(function(){a||n.each(function(){t(this).triggerHandler("scrollme.zf.trigger")}),n.attr("data-events","scroll")},e||10)})}function s(){if(!a)return!1;var e=document.querySelectorAll("[data-resize], [data-scroll], [data-mutate]"),i=function(e){var i=t(e[0].target);switch(i.attr("data-events")){case"resize":i.triggerHandler("resizeme.zf.trigger",[i]);break;case"scroll":i.triggerHandler("scrollme.zf.trigger",[i,window.pageYOffset]);break;default:return!1}};if(e.length)for(var n=0;n<=e.length-1;n++){var o=new a(i);o.observe(e[n],{attributes:!0,childList:!1,characterData:!1,subtree:!1,attributeFilter:["data-events"]})}}var a=function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if(t[e]+"MutationObserver"in window)return window[t[e]+"MutationObserver"];return!1}(),r=function(e,i){e.data(i).split(" ").forEach(function(n){t("#"+n)["close"===i?"trigger":"triggerHandler"](i+".zf.trigger",[e])})};t(document).on("click.zf.trigger","[data-open]",function(){r(t(this),"open")}),t(document).on("click.zf.trigger","[data-close]",function(){var e=t(this).data("close");e?r(t(this),"close"):t(this).trigger("close.zf.trigger")}),t(document).on("click.zf.trigger","[data-toggle]",function(){r(t(this),"toggle")}),t(document).on("close.zf.trigger","[data-closable]",function(e){e.stopPropagation();var i=t(this).data("closable");""!==i?Foundation.Motion.animateOut(t(this),i,function(){t(this).trigger("closed.zf")}):t(this).fadeOut().trigger("closed.zf")}),t(document).on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",function(){var e=t(this).data("toggle-focus");t("#"+e).triggerHandler("toggle.zf.trigger",[t(this)])}),t(window).on("load",function(){e()}),Foundation.IHearYou=e}(jQuery);var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(t){var e=function(){function e(i,n){_classCallCheck(this,e),this.$element=i,this.options=t.extend({},e.defaults,this.$element.data(),n),this._init(),Foundation.registerPlugin(this,"Accordion"),Foundation.Keyboard.register("Accordion",{ENTER:"toggle",SPACE:"toggle",ARROW_DOWN:"next",ARROW_UP:"previous"})}return _createClass(e,[{key:"_init",value:function(){this.$element.attr("role","tablist"),this.$tabs=this.$element.children("li, [data-accordion-item]"),this.$tabs.each(function(e,i){var n=t(i),o=n.children("[data-tab-content]"),s=o[0].id||Foundation.GetYoDigits(6,"accordion"),a=i.id||s+"-label";n.find("a:first").attr({"aria-controls":s,role:"tab",id:a,"aria-expanded":!1,"aria-selected":!1}),o.attr({role:"tabpanel","aria-labelledby":a,"aria-hidden":!0,id:s})});var e=this.$element.find(".is-active").children("[data-tab-content]");e.length&&this.down(e,!0),this._events()}},{key:"_events",value:function(){var e=this;this.$tabs.each(function(){var i=t(this),n=i.children("[data-tab-content]");n.length&&i.children("a").off("click.zf.accordion keydown.zf.accordion").on("click.zf.accordion",function(t){t.preventDefault(),e.toggle(n)}).on("keydown.zf.accordion",function(t){Foundation.Keyboard.handleKey(t,"Accordion",{toggle:function(){e.toggle(n)},next:function(){var t=i.next().find("a").focus();e.options.multiExpand||t.trigger("click.zf.accordion")},previous:function(){var t=i.prev().find("a").focus();e.options.multiExpand||t.trigger("click.zf.accordion")},handled:function(){t.preventDefault(),t.stopPropagation()}})})})}},{key:"toggle",value:function(t){t.parent().hasClass("is-active")?this.up(t):this.down(t)}},{key:"down",value:function(e,i){var n=this;if(e.attr("aria-hidden",!1).parent("[data-tab-content]").addBack().parent().addClass("is-active"),!this.options.multiExpand&&!i){var o=this.$element.children(".is-active").children("[data-tab-content]");o.length&&this.up(o.not(e))}e.slideDown(this.options.slideSpeed,function(){n.$element.trigger("down.zf.accordion",[e])}),t("#"+e.attr("aria-labelledby")).attr({"aria-expanded":!0,"aria-selected":!0})}},{key:"up",value:function(e){var i=e.parent().siblings(),n=this;(this.options.allowAllClosed||i.hasClass("is-active"))&&e.parent().hasClass("is-active")&&(e.slideUp(n.options.slideSpeed,function(){n.$element.trigger("up.zf.accordion",[e])}),e.attr("aria-hidden",!0).parent().removeClass("is-active"),t("#"+e.attr("aria-labelledby")).attr({"aria-expanded":!1,"aria-selected":!1}))}},{key:"destroy",value:function(){this.$element.find("[data-tab-content]").stop(!0).slideUp(0).css("display",""),this.$element.find("a").off(".zf.accordion"),Foundation.unregisterPlugin(this)}}]),e}();e.defaults={slideSpeed:250,multiExpand:!1,allowAllClosed:!1},Foundation.plugin(e,"Accordion")}(jQuery);var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(t){var e=function(){function e(i,n){_classCallCheck(this,e),this.$element=i,this.options=t.extend({},e.defaults,this.$element.data(),n),this._init(),Foundation.registerPlugin(this,"Dropdown"),Foundation.Keyboard.register("Dropdown",{ENTER:"open",SPACE:"open",ESCAPE:"close",TAB:"tab_forward",SHIFT_TAB:"tab_backward"})}return _createClass(e,[{key:"_init",value:function(){var e=this.$element.attr("id");this.$anchor=t(t('[data-toggle="'+e+'"]').length?'[data-toggle="'+e+'"]':'[data-open="'+e+'"]'),this.$anchor.attr({"aria-controls":e,"data-is-focus":!1,"data-yeti-box":e,"aria-haspopup":!0,"aria-expanded":!1}),this.options.positionClass=this.getPositionClass(),this.counter=4,this.usedPositions=[],this.$element.attr({"aria-hidden":"true","data-yeti-box":e,"data-resize":e,"aria-labelledby":this.$anchor[0].id||Foundation.GetYoDigits(6,"dd-anchor")}),this._events()}},{key:"getPositionClass",value:function(){var t=this.$element[0].className.match(/(top|left|right|bottom)/g);t=t?t[0]:"";var e=/float-(\S+)/.exec(this.$anchor[0].className);e=e?e[1]:"";var i=e?e+" "+t:t;return i}},{key:"_reposition",value:function(t){this.usedPositions.push(t?t:"bottom"),!t&&this.usedPositions.indexOf("top")<0?this.$element.addClass("top"):"top"===t&&this.usedPositions.indexOf("bottom")<0?this.$element.removeClass(t):"left"===t&&this.usedPositions.indexOf("right")<0?this.$element.removeClass(t).addClass("right"):"right"===t&&this.usedPositions.indexOf("left")<0?this.$element.removeClass(t).addClass("left"):!t&&this.usedPositions.indexOf("top")>-1&&this.usedPositions.indexOf("left")<0?this.$element.addClass("left"):"top"===t&&this.usedPositions.indexOf("bottom")>-1&&this.usedPositions.indexOf("left")<0?this.$element.removeClass(t).addClass("left"):"left"===t&&this.usedPositions.indexOf("right")>-1&&this.usedPositions.indexOf("bottom")<0?this.$element.removeClass(t):"right"===t&&this.usedPositions.indexOf("left")>-1&&this.usedPositions.indexOf("bottom")<0?this.$element.removeClass(t):this.$element.removeClass(t),this.classChanged=!0,this.counter--}},{key:"_setPosition",value:function(){if("false"===this.$anchor.attr("aria-expanded"))return!1;var t=this.getPositionClass(),e=Foundation.Box.GetDimensions(this.$element),i=(Foundation.Box.GetDimensions(this.$anchor),"left"===t?"left":"right"===t?"left":"top"),n="top"===i?"height":"width";if("height"===n?this.options.vOffset:this.options.hOffset,e.width>=e.windowDims.width||!this.counter&&!Foundation.Box.ImNotTouchingYou(this.$element))return this.$element.offset(Foundation.Box.GetOffsets(this.$element,this.$anchor,"center bottom",this.options.vOffset,this.options.hOffset,!0)).css({width:e.windowDims.width-2*this.options.hOffset,height:"auto"}),this.classChanged=!0,!1;for(this.$element.offset(Foundation.Box.GetOffsets(this.$element,this.$anchor,t,this.options.vOffset,this.options.hOffset));!Foundation.Box.ImNotTouchingYou(this.$element,!1,!0)&&this.counter;)this._reposition(t),this._setPosition()}},{key:"_events",value:function(){var e=this;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":this._setPosition.bind(this)}),this.options.hover&&(this.$anchor.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){t('body[data-whatinput="mouse"]').is("*")&&(clearTimeout(e.timeout),e.timeout=setTimeout(function(){e.open(),e.$anchor.data("hover",!0)},e.options.hoverDelay))}).on("mouseleave.zf.dropdown",function(){clearTimeout(e.timeout),e.timeout=setTimeout(function(){e.close(),e.$anchor.data("hover",!1)},e.options.hoverDelay)}),this.options.hoverPane&&this.$element.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){clearTimeout(e.timeout)}).on("mouseleave.zf.dropdown",function(){clearTimeout(e.timeout),e.timeout=setTimeout(function(){e.close(),e.$anchor.data("hover",!1)},e.options.hoverDelay)})),this.$anchor.add(this.$element).on("keydown.zf.dropdown",function(i){var n=t(this),o=Foundation.Keyboard.findFocusable(e.$element);Foundation.Keyboard.handleKey(i,"Dropdown",{tab_forward:function(){e.$element.find(":focus").is(o.eq(-1))&&(e.options.trapFocus?(o.eq(0).focus(),i.preventDefault()):e.close())},tab_backward:function(){(e.$element.find(":focus").is(o.eq(0))||e.$element.is(":focus"))&&(e.options.trapFocus?(o.eq(-1).focus(),i.preventDefault()):e.close())},open:function(){n.is(e.$anchor)&&(e.open(),e.$element.attr("tabindex",-1).focus(),i.preventDefault())},close:function(){e.close(),e.$anchor.focus()}})})}},{key:"_addBodyHandler",value:function(){var e=t(document.body).not(this.$element),i=this;e.off("click.zf.dropdown").on("click.zf.dropdown",function(t){i.$anchor.is(t.target)||i.$anchor.find(t.target).length||i.$element.find(t.target).length||(i.close(),e.off("click.zf.dropdown"))})}},{key:"open",value:function(){if(this.$element.trigger("closeme.zf.dropdown",this.$element.attr("id")),this.$anchor.addClass("hover").attr({"aria-expanded":!0}),this._setPosition(),this.$element.addClass("is-open").attr({"aria-hidden":!1}),this.options.autoFocus){var t=Foundation.Keyboard.findFocusable(this.$element);t.length&&t.eq(0).focus()}this.options.closeOnClick&&this._addBodyHandler(),this.$element.trigger("show.zf.dropdown",[this.$element])}},{key:"close",value:function(){if(!this.$element.hasClass("is-open"))return!1;if(this.$element.removeClass("is-open").attr({"aria-hidden":!0}),this.$anchor.removeClass("hover").attr("aria-expanded",!1),this.classChanged){var t=this.getPositionClass();t&&this.$element.removeClass(t),this.$element.addClass(this.options.positionClass).css({height:"",width:""}),this.classChanged=!1,this.counter=4,this.usedPositions.length=0}this.$element.trigger("hide.zf.dropdown",[this.$element])}},{key:"toggle",value:function(){if(this.$element.hasClass("is-open")){if(this.$anchor.data("hover"))return;this.close()}else this.open()}},{key:"destroy",value:function(){this.$element.off(".zf.trigger").hide(),this.$anchor.off(".zf.dropdown"),Foundation.unregisterPlugin(this)}}]),e}();e.defaults={hoverDelay:250,hover:!1,hoverPane:!1,vOffset:1,hOffset:1,positionClass:"",trapFocus:!1,autoFocus:!1,closeOnClick:!1},Foundation.plugin(e,"Dropdown")}(jQuery);var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(t){function e(){return/iP(ad|hone|od).*OS/.test(window.navigator.userAgent)}function i(){return/Android/.test(window.navigator.userAgent)}function n(){return e()||i()}var o=function(){function e(i,n){_classCallCheck(this,e),this.$element=i,this.options=t.extend({},e.defaults,this.$element.data(),n),this._init(),Foundation.registerPlugin(this,"Reveal"),Foundation.Keyboard.register("Reveal",{ENTER:"open",SPACE:"open",ESCAPE:"close",TAB:"tab_forward",SHIFT_TAB:"tab_backward"})}return _createClass(e,[{key:"_init",value:function(){this.id=this.$element.attr("id"),this.isActive=!1,this.cached={mq:Foundation.MediaQuery.current},this.isMobile=n(),this.$anchor=t(t('[data-open="'+this.id+'"]').length?'[data-open="'+this.id+'"]':'[data-toggle="'+this.id+'"]'),this.$anchor.attr({"aria-controls":this.id,"aria-haspopup":!0,tabindex:0}),(this.options.fullScreen||this.$element.hasClass("full"))&&(this.options.fullScreen=!0,this.options.overlay=!1),this.options.overlay&&!this.$overlay&&(this.$overlay=this._makeOverlay(this.id)),this.$element.attr({role:"dialog","aria-hidden":!0,"data-yeti-box":this.id,"data-resize":this.id}),this.$overlay?this.$element.detach().appendTo(this.$overlay):(this.$element.detach().appendTo(t("body")),this.$element.addClass("without-overlay")),this._events(),this.options.deepLink&&window.location.hash==="#"+this.id&&t(window).one("load.zf.reveal",this.open.bind(this))}},{key:"_makeOverlay",value:function(e){var i=t("<div></div>").addClass("reveal-overlay").appendTo("body");return i}},{key:"_updatePosition",value:function(){var e,i,n=this.$element.outerWidth(),o=t(window).width(),s=this.$element.outerHeight(),a=t(window).height();e="auto"===this.options.hOffset?parseInt((o-n)/2,10):parseInt(this.options.hOffset,10),i="auto"===this.options.vOffset?s>a?parseInt(Math.min(100,a/10),10):parseInt((a-s)/4,10):parseInt(this.options.vOffset,10),this.$element.css({top:i+"px"}),this.$overlay&&"auto"===this.options.hOffset||(this.$element.css({left:e+"px"}),this.$element.css({margin:"0px"}))}},{key:"_events",value:function(){var e=this,i=this;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":function(n,o){if(n.target===i.$element[0]||t(n.target).parents("[data-closable]")[0]===o)return e.close.apply(e)},"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":function(){i._updatePosition()}}),this.$anchor.length&&this.$anchor.on("keydown.zf.reveal",function(t){13!==t.which&&32!==t.which||(t.stopPropagation(),t.preventDefault(),i.open())}),this.options.closeOnClick&&this.options.overlay&&this.$overlay.off(".zf.reveal").on("click.zf.reveal",function(e){e.target!==i.$element[0]&&!t.contains(i.$element[0],e.target)&&t.contains(document,e.target)&&i.close()}),this.options.deepLink&&t(window).on("popstate.zf.reveal:"+this.id,this._handleState.bind(this))}},{key:"_handleState",value:function(t){window.location.hash!=="#"+this.id||this.isActive?this.close():this.open()}},{key:"open",value:function(){var e=this;if(this.options.deepLink){var i="#"+this.id;window.history.pushState?window.history.pushState(null,null,i):window.location.hash=i}if(this.isActive=!0,this.$element.css({visibility:"hidden"}).show().scrollTop(0),this.options.overlay&&this.$overlay.css({visibility:"hidden"}).show(),this._updatePosition(),this.$element.hide().css({visibility:""}),this.$overlay&&(this.$overlay.css({visibility:""}).hide(),this.$element.hasClass("fast")?this.$overlay.addClass("fast"):this.$element.hasClass("slow")&&this.$overlay.addClass("slow")),this.options.multipleOpened||this.$element.trigger("closeme.zf.reveal",this.id),this.options.animationIn){var n;!function(){var t=function(){n.$element.attr({"aria-hidden":!1,tabindex:-1}).focus()};n=e,e.options.overlay&&Foundation.Motion.animateIn(e.$overlay,"fade-in"),Foundation.Motion.animateIn(e.$element,e.options.animationIn,function(){e.focusableElements=Foundation.Keyboard.findFocusable(e.$element),t()})}()}else this.options.overlay&&this.$overlay.show(0),
this.$element.show(this.options.showDelay);this.$element.attr({"aria-hidden":!1,tabindex:-1}).focus(),this.$element.trigger("open.zf.reveal"),this.isMobile?(this.originalScrollPos=window.pageYOffset,t("html, body").addClass("is-reveal-open")):t("body").addClass("is-reveal-open"),setTimeout(function(){e._extraHandlers()},0)}},{key:"_extraHandlers",value:function(){var e=this;this.focusableElements=Foundation.Keyboard.findFocusable(this.$element),this.options.overlay||!this.options.closeOnClick||this.options.fullScreen||t("body").on("click.zf.reveal",function(i){i.target!==e.$element[0]&&!t.contains(e.$element[0],i.target)&&t.contains(document,i.target)&&e.close()}),this.options.closeOnEsc&&t(window).on("keydown.zf.reveal",function(t){Foundation.Keyboard.handleKey(t,"Reveal",{close:function(){e.options.closeOnEsc&&(e.close(),e.$anchor.focus())}})}),this.$element.on("keydown.zf.reveal",function(i){var n=t(this);Foundation.Keyboard.handleKey(i,"Reveal",{tab_forward:function(){return e.focusableElements=Foundation.Keyboard.findFocusable(e.$element),e.$element.find(":focus").is(e.focusableElements.eq(-1))?(e.focusableElements.eq(0).focus(),!0):0===e.focusableElements.length||void 0},tab_backward:function(){return e.focusableElements=Foundation.Keyboard.findFocusable(e.$element),e.$element.find(":focus").is(e.focusableElements.eq(0))||e.$element.is(":focus")?(e.focusableElements.eq(-1).focus(),!0):0===e.focusableElements.length||void 0},open:function(){e.$element.find(":focus").is(e.$element.find("[data-close]"))?setTimeout(function(){e.$anchor.focus()},1):n.is(e.focusableElements)&&e.open()},close:function(){e.options.closeOnEsc&&(e.close(),e.$anchor.focus())},handled:function(t){t&&i.preventDefault()}})})}},{key:"close",value:function(){function e(){i.isMobile?(t("html, body").removeClass("is-reveal-open"),i.originalScrollPos&&(t("body").scrollTop(i.originalScrollPos),i.originalScrollPos=null)):t("body").removeClass("is-reveal-open"),i.$element.attr("aria-hidden",!0),i.$element.trigger("closed.zf.reveal")}if(!this.isActive||!this.$element.is(":visible"))return!1;var i=this;this.options.animationOut?(this.options.overlay?Foundation.Motion.animateOut(this.$overlay,"fade-out",e):e(),Foundation.Motion.animateOut(this.$element,this.options.animationOut)):(this.options.overlay?this.$overlay.hide(0,e):e(),this.$element.hide(this.options.hideDelay)),this.options.closeOnEsc&&t(window).off("keydown.zf.reveal"),!this.options.overlay&&this.options.closeOnClick&&t("body").off("click.zf.reveal"),this.$element.off("keydown.zf.reveal"),this.options.resetOnClose&&this.$element.html(this.$element.html()),this.isActive=!1,i.options.deepLink&&(window.history.replaceState?window.history.replaceState("",document.title,window.location.pathname):window.location.hash="")}},{key:"toggle",value:function(){this.isActive?this.close():this.open()}},{key:"destroy",value:function(){this.options.overlay&&(this.$element.appendTo(t("body")),this.$overlay.hide().off().remove()),this.$element.hide().off(),this.$anchor.off(".zf"),t(window).off(".zf.reveal:"+this.id),Foundation.unregisterPlugin(this)}}]),e}();o.defaults={animationIn:"",animationOut:"",showDelay:0,hideDelay:0,closeOnClick:!0,closeOnEsc:!0,multipleOpened:!1,vOffset:"auto",hOffset:"auto",fullScreen:!1,btmOffsetPct:10,overlay:!0,resetOnClose:!1,deepLink:!1},Foundation.plugin(o,"Reveal")}(jQuery);var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(t){var e=function(){function e(i,n){_classCallCheck(this,e),this.$element=i,this.options=t.extend({},e.defaults,this.$element.data(),n),this._init(),Foundation.registerPlugin(this,"Tabs"),Foundation.Keyboard.register("Tabs",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"previous",ARROW_DOWN:"next",ARROW_LEFT:"previous"})}return _createClass(e,[{key:"_init",value:function(){var e=this;if(this.$tabTitles=this.$element.find("."+this.options.linkClass),this.$tabContent=t('[data-tabs-content="'+this.$element[0].id+'"]'),this.$tabTitles.each(function(){var i=t(this),n=i.find("a"),o=i.hasClass("is-active"),s=n[0].hash.slice(1),a=n[0].id?n[0].id:s+"-label",r=t("#"+s);i.attr({role:"presentation"}),n.attr({role:"tab","aria-controls":s,"aria-selected":o,id:a}),r.attr({role:"tabpanel","aria-hidden":!o,"aria-labelledby":a}),o&&e.options.autoFocus&&n.focus()}),this.options.matchHeight){var i=this.$tabContent.find("img");i.length?Foundation.onImagesLoaded(i,this._setHeight.bind(this)):this._setHeight()}this._events()}},{key:"_events",value:function(){this._addKeyHandler(),this._addClickHandler(),this._setHeightMqHandler=null,this.options.matchHeight&&(this._setHeightMqHandler=this._setHeight.bind(this),t(window).on("changed.zf.mediaquery",this._setHeightMqHandler))}},{key:"_addClickHandler",value:function(){var e=this;this.$element.off("click.zf.tabs").on("click.zf.tabs","."+this.options.linkClass,function(i){i.preventDefault(),i.stopPropagation(),t(this).hasClass("is-active")||e._handleTabChange(t(this))})}},{key:"_addKeyHandler",value:function(){var e=this;e.$element.find("li:first-of-type"),e.$element.find("li:last-of-type"),this.$tabTitles.off("keydown.zf.tabs").on("keydown.zf.tabs",function(i){if(9!==i.which){var n,o,s=t(this),a=s.parent("ul").children("li");a.each(function(i){if(t(this).is(s))return void(e.options.wrapOnKeys?(n=0===i?a.last():a.eq(i-1),o=i===a.length-1?a.first():a.eq(i+1)):(n=a.eq(Math.max(0,i-1)),o=a.eq(Math.min(i+1,a.length-1))))}),Foundation.Keyboard.handleKey(i,"Tabs",{open:function(){s.find('[role="tab"]').focus(),e._handleTabChange(s)},previous:function(){n.find('[role="tab"]').focus(),e._handleTabChange(n)},next:function(){o.find('[role="tab"]').focus(),e._handleTabChange(o)},handled:function(){i.stopPropagation(),i.preventDefault()}})}})}},{key:"_handleTabChange",value:function(e){var i=e.find('[role="tab"]'),n=i[0].hash,o=this.$tabContent.find(n),s=this.$element.find("."+this.options.linkClass+".is-active").removeClass("is-active").find('[role="tab"]').attr({"aria-selected":"false"});t("#"+s.attr("aria-controls")).removeClass("is-active").attr({"aria-hidden":"true"}),e.addClass("is-active"),i.attr({"aria-selected":"true"}),o.addClass("is-active").attr({"aria-hidden":"false"}),this.$element.trigger("change.zf.tabs",[e])}},{key:"selectTab",value:function(t){var e;e="object"===("undefined"==typeof t?"undefined":_typeof(t))?t[0].id:t,e.indexOf("#")<0&&(e="#"+e);var i=this.$tabTitles.find('[href="'+e+'"]').parent("."+this.options.linkClass);this._handleTabChange(i)}},{key:"_setHeight",value:function(){var e=0;this.$tabContent.find("."+this.options.panelClass).css("height","").each(function(){var i=t(this),n=i.hasClass("is-active");n||i.css({visibility:"hidden",display:"block"});var o=this.getBoundingClientRect().height;n||i.css({visibility:"",display:""}),e=o>e?o:e}).css("height",e+"px")}},{key:"destroy",value:function(){this.$element.find("."+this.options.linkClass).off(".zf.tabs").hide().end().find("."+this.options.panelClass).hide(),this.options.matchHeight&&null!=this._setHeightMqHandler&&t(window).off("changed.zf.mediaquery",this._setHeightMqHandler),Foundation.unregisterPlugin(this)}}]),e}();e.defaults={autoFocus:!1,wrapOnKeys:!0,matchHeight:!1,linkClass:"tabs-title",panelClass:"tabs-panel"},Foundation.plugin(e,"Tabs")}(jQuery);var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(t){var e=function(){function e(i,n){_classCallCheck(this,e),this.$element=i,this.options=t.extend({},e.defaults,this.$element.data(),n),this.isActive=!1,this.isClick=!1,this._init(),Foundation.registerPlugin(this,"Tooltip")}return _createClass(e,[{key:"_init",value:function(){var e=this.$element.attr("aria-describedby")||Foundation.GetYoDigits(6,"tooltip");this.options.positionClass=this.options.positionClass||this._getPositionClass(this.$element),this.options.tipText=this.options.tipText||this.$element.attr("title"),this.template=this.options.template?t(this.options.template):this._buildTemplate(e),this.template.appendTo(document.body).text(this.options.tipText).hide(),this.$element.attr({title:"","aria-describedby":e,"data-yeti-box":e,"data-toggle":e,"data-resize":e}).addClass(this.options.triggerClass),this.usedPositions=[],this.counter=4,this.classChanged=!1,this._events()}},{key:"_getPositionClass",value:function(t){if(!t)return"";var e=t[0].className.match(/\b(top|left|right)\b/g);return e=e?e[0]:""}},{key:"_buildTemplate",value:function(e){var i=(this.options.tooltipClass+" "+this.options.positionClass+" "+this.options.templateClasses).trim(),n=t("<div></div>").addClass(i).attr({role:"tooltip","aria-hidden":!0,"data-is-active":!1,"data-is-focus":!1,id:e});return n}},{key:"_reposition",value:function(t){this.usedPositions.push(t?t:"bottom"),!t&&this.usedPositions.indexOf("top")<0?this.template.addClass("top"):"top"===t&&this.usedPositions.indexOf("bottom")<0?this.template.removeClass(t):"left"===t&&this.usedPositions.indexOf("right")<0?this.template.removeClass(t).addClass("right"):"right"===t&&this.usedPositions.indexOf("left")<0?this.template.removeClass(t).addClass("left"):!t&&this.usedPositions.indexOf("top")>-1&&this.usedPositions.indexOf("left")<0?this.template.addClass("left"):"top"===t&&this.usedPositions.indexOf("bottom")>-1&&this.usedPositions.indexOf("left")<0?this.template.removeClass(t).addClass("left"):"left"===t&&this.usedPositions.indexOf("right")>-1&&this.usedPositions.indexOf("bottom")<0?this.template.removeClass(t):"right"===t&&this.usedPositions.indexOf("left")>-1&&this.usedPositions.indexOf("bottom")<0?this.template.removeClass(t):this.template.removeClass(t),this.classChanged=!0,this.counter--}},{key:"_setPosition",value:function(){var t=this._getPositionClass(this.template),e=Foundation.Box.GetDimensions(this.template),i=Foundation.Box.GetDimensions(this.$element),n="left"===t?"left":"right"===t?"left":"top",o="top"===n?"height":"width";if("height"===o?this.options.vOffset:this.options.hOffset,e.width>=e.windowDims.width||!this.counter&&!Foundation.Box.ImNotTouchingYou(this.template))return this.template.offset(Foundation.Box.GetOffsets(this.template,this.$element,"center bottom",this.options.vOffset,this.options.hOffset,!0)).css({width:i.windowDims.width-2*this.options.hOffset,height:"auto"}),!1;for(this.template.offset(Foundation.Box.GetOffsets(this.template,this.$element,"center "+(t||"bottom"),this.options.vOffset,this.options.hOffset));!Foundation.Box.ImNotTouchingYou(this.template)&&this.counter;)this._reposition(t),this._setPosition()}},{key:"show",value:function(){if("all"!==this.options.showOn&&!Foundation.MediaQuery.atLeast(this.options.showOn))return!1;var t=this;this.template.css("visibility","hidden").show(),this._setPosition(),this.$element.trigger("closeme.zf.tooltip",this.template.attr("id")),this.template.attr({"data-is-active":!0,"aria-hidden":!1}),t.isActive=!0,this.template.stop().hide().css("visibility","").fadeIn(this.options.fadeInDuration,function(){}),this.$element.trigger("show.zf.tooltip")}},{key:"hide",value:function(){var t=this;this.template.stop().attr({"aria-hidden":!0,"data-is-active":!1}).fadeOut(this.options.fadeOutDuration,function(){t.isActive=!1,t.isClick=!1,t.classChanged&&(t.template.removeClass(t._getPositionClass(t.template)).addClass(t.options.positionClass),t.usedPositions=[],t.counter=4,t.classChanged=!1)}),this.$element.trigger("hide.zf.tooltip")}},{key:"_events",value:function(){var t=this,e=(this.template,!1);this.options.disableHover||this.$element.on("mouseenter.zf.tooltip",function(e){t.isActive||(t.timeout=setTimeout(function(){t.show()},t.options.hoverDelay))}).on("mouseleave.zf.tooltip",function(i){clearTimeout(t.timeout),(!e||t.isClick&&!t.options.clickOpen)&&t.hide()}),this.options.clickOpen?this.$element.on("mousedown.zf.tooltip",function(e){e.stopImmediatePropagation(),t.isClick||(t.isClick=!0,!t.options.disableHover&&t.$element.attr("tabindex")||t.isActive||t.show())}):this.$element.on("mousedown.zf.tooltip",function(e){e.stopImmediatePropagation(),t.isClick=!0}),this.options.disableForTouch||this.$element.on("tap.zf.tooltip touchend.zf.tooltip",function(e){t.isActive?t.hide():t.show()}),this.$element.on({"close.zf.trigger":this.hide.bind(this)}),this.$element.on("focus.zf.tooltip",function(i){return e=!0,t.isClick?(t.options.clickOpen||(e=!1),!1):void t.show()}).on("focusout.zf.tooltip",function(i){e=!1,t.isClick=!1,t.hide()}).on("resizeme.zf.trigger",function(){t.isActive&&t._setPosition()})}},{key:"toggle",value:function(){this.isActive?this.hide():this.show()}},{key:"destroy",value:function(){this.$element.attr("title",this.template.text()).off(".zf.trigger .zf.tootip").removeAttr("aria-describedby").removeAttr("data-yeti-box").removeAttr("data-toggle").removeAttr("data-resize"),this.template.remove(),Foundation.unregisterPlugin(this)}}]),e}();e.defaults={disableForTouch:!1,hoverDelay:200,fadeInDuration:150,fadeOutDuration:150,disableHover:!1,templateClasses:"",tooltipClass:"tooltip",triggerClass:"has-tip",showOn:"small",template:"",tipText:"",touchCloseText:"Tap to close.",clickOpen:!0,positionClass:"",vOffset:10,hOffset:12},Foundation.plugin(e,"Tooltip")}(jQuery);

},{}],43:[function(require,module,exports){
(function (global){
!function(t){var e="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global;if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(i,n,s){e.Backbone=t(e,s,i,n)});else if("undefined"!=typeof exports){var i,n=require("underscore");try{i=require("jquery")}catch(t){}t(e,exports,n,i)}else e.Backbone=t(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}(function(t,e,i,n){var s=t.Backbone,r=Array.prototype.slice;e.VERSION="1.3.3",e.$=n,e.noConflict=function(){return t.Backbone=s,this},e.emulateHTTP=!1,e.emulateJSON=!1;var a=function(t,e,n){switch(t){case 1:return function(){return i[e](this[n])};case 2:return function(t){return i[e](this[n],t)};case 3:return function(t,s){return i[e](this[n],h(t,this),s)};case 4:return function(t,s,r){return i[e](this[n],h(t,this),s,r)};default:return function(){var t=r.call(arguments);return t.unshift(this[n]),i[e].apply(i,t)}}},o=function(t,e,n){i.each(e,function(e,s){i[s]&&(t.prototype[s]=a(e,s,n))})},h=function(t,e){return i.isFunction(t)?t:i.isObject(t)&&!e._isModel(t)?u(t):i.isString(t)?function(e){return e.get(t)}:t},u=function(t){var e=i.matches(t);return function(t){return e(t.attributes)}},c=e.Events={},l=/\s+/,d=function(t,e,n,s,r){var a,o=0;if(n&&"object"==typeof n){void 0!==s&&"context"in r&&void 0===r.context&&(r.context=s);for(a=i.keys(n);o<a.length;o++)e=d(t,e,a[o],n[a[o]],r)}else if(n&&l.test(n))for(a=n.split(l);o<a.length;o++)e=t(e,a[o],s,r);else e=t(e,n,s,r);return e};c.on=function(t,e,i){return f(this,t,e,i)};var f=function(t,e,i,n,s){if(t._events=d(g,t._events||{},e,i,{context:n,ctx:t,listening:s}),s){var r=t._listeners||(t._listeners={});r[s.id]=s}return t};c.listenTo=function(t,e,n){if(!t)return this;var s=t._listenId||(t._listenId=i.uniqueId("l")),r=this._listeningTo||(this._listeningTo={}),a=r[s];if(!a){var o=this._listenId||(this._listenId=i.uniqueId("l"));a=r[s]={obj:t,objId:s,id:o,listeningTo:r,count:0}}return f(t,e,n,this,a),this};var g=function(t,e,i,n){if(i){var s=t[e]||(t[e]=[]),r=n.context,a=n.ctx,o=n.listening;o&&o.count++,s.push({callback:i,context:r,ctx:r||a,listening:o})}return t};c.off=function(t,e,i){return this._events?(this._events=d(v,this._events,t,e,{context:i,listeners:this._listeners}),this):this},c.stopListening=function(t,e,n){var s=this._listeningTo;if(!s)return this;for(var r=t?[t._listenId]:i.keys(s),a=0;a<r.length;a++){var o=s[r[a]];if(!o)break;o.obj.off(e,n,this)}return this};var v=function(t,e,n,s){if(t){var r,a=0,o=s.context,h=s.listeners;if(e||n||o){for(var u=e?[e]:i.keys(t);a<u.length;a++){e=u[a];var c=t[e];if(!c)break;for(var l=[],d=0;d<c.length;d++){var f=c[d];n&&n!==f.callback&&n!==f.callback._callback||o&&o!==f.context?l.push(f):(r=f.listening,r&&0===--r.count&&(delete h[r.id],delete r.listeningTo[r.objId]))}l.length?t[e]=l:delete t[e]}return t}for(var g=i.keys(h);a<g.length;a++)r=h[g[a]],delete h[r.id],delete r.listeningTo[r.objId]}};c.once=function(t,e,n){var s=d(p,{},t,e,i.bind(this.off,this));return"string"==typeof t&&null==n&&(e=void 0),this.on(s,e,n)},c.listenToOnce=function(t,e,n){var s=d(p,{},e,n,i.bind(this.stopListening,this,t));return this.listenTo(t,s)};var p=function(t,e,n,s){if(n){var r=t[e]=i.once(function(){s(e,r),n.apply(this,arguments)});r._callback=n}return t};c.trigger=function(t){if(!this._events)return this;for(var e=Math.max(0,arguments.length-1),i=Array(e),n=0;n<e;n++)i[n]=arguments[n+1];return d(m,this._events,t,void 0,i),this};var m=function(t,e,i,n){if(t){var s=t[e],r=t.all;s&&r&&(r=r.slice()),s&&_(s,n),r&&_(r,[e].concat(n))}return t},_=function(t,e){var i,n=-1,s=t.length,r=e[0],a=e[1],o=e[2];switch(e.length){case 0:for(;++n<s;)(i=t[n]).callback.call(i.ctx);return;case 1:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r);return;case 2:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,a);return;case 3:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,a,o);return;default:for(;++n<s;)(i=t[n]).callback.apply(i.ctx,e);return}};c.bind=c.on,c.unbind=c.off,i.extend(e,c);var y=e.Model=function(t,e){var n=t||{};e||(e={}),this.cid=i.uniqueId(this.cidPrefix),this.attributes={},e.collection&&(this.collection=e.collection),e.parse&&(n=this.parse(n,e)||{});var s=i.result(this,"defaults");n=i.defaults(i.extend({},s,n),s),this.set(n,e),this.changed={},this.initialize.apply(this,arguments)};i.extend(y.prototype,c,{changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return null!=this.get(t)},matches:function(t){return!!i.iteratee(t,this)(this.attributes)},set:function(t,e,n){if(null==t)return this;var s;if("object"==typeof t?(s=t,n=e):(s={})[t]=e,n||(n={}),!this._validate(s,n))return!1;var r=n.unset,a=n.silent,o=[],h=this._changing;this._changing=!0,h||(this._previousAttributes=i.clone(this.attributes),this.changed={});var u=this.attributes,c=this.changed,l=this._previousAttributes;for(var d in s)e=s[d],i.isEqual(u[d],e)||o.push(d),i.isEqual(l[d],e)?delete c[d]:c[d]=e,r?delete u[d]:u[d]=e;if(this.idAttribute in s&&(this.id=this.get(this.idAttribute)),!a){o.length&&(this._pending=n);for(var f=0;f<o.length;f++)this.trigger("change:"+o[f],this,u[o[f]],n)}if(h)return this;if(!a)for(;this._pending;)n=this._pending,this._pending=!1,this.trigger("change",this,n);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var n in this.attributes)e[n]=void 0;return this.set(e,i.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!i.isEmpty(this.changed):i.has(this.changed,t)},changedAttributes:function(t){if(!t)return!!this.hasChanged()&&i.clone(this.changed);var e=this._changing?this._previousAttributes:this.attributes,n={};for(var s in t){var r=t[s];i.isEqual(e[s],r)||(n[s]=r)}return!!i.size(n)&&n},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=i.extend({parse:!0},t);var e=this,n=t.success;return t.success=function(i){var s=t.parse?e.parse(i,t):i;return!!e.set(s,t)&&(n&&n.call(t.context,e,i,t),void e.trigger("sync",e,i,t))},B(this,t),this.sync("read",this,t)},save:function(t,e,n){var s;null==t||"object"==typeof t?(s=t,n=e):(s={})[t]=e,n=i.extend({validate:!0,parse:!0},n);var r=n.wait;if(s&&!r){if(!this.set(s,n))return!1}else if(!this._validate(s,n))return!1;var a=this,o=n.success,h=this.attributes;n.success=function(t){a.attributes=h;var e=n.parse?a.parse(t,n):t;return r&&(e=i.extend({},s,e)),!(e&&!a.set(e,n))&&(o&&o.call(n.context,a,t,n),void a.trigger("sync",a,t,n))},B(this,n),s&&r&&(this.attributes=i.extend({},h,s));var u=this.isNew()?"create":n.patch?"patch":"update";"patch"!==u||n.attrs||(n.attrs=s);var c=this.sync(u,this,n);return this.attributes=h,c},destroy:function(t){t=t?i.clone(t):{};var e=this,n=t.success,s=t.wait,r=function(){e.stopListening(),e.trigger("destroy",e,e.collection,t)};t.success=function(i){s&&r(),n&&n.call(t.context,e,i,t),e.isNew()||e.trigger("sync",e,i,t)};var a=!1;return this.isNew()?i.defer(t.success):(B(this,t),a=this.sync("delete",this,t)),s||r(),a},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||F();if(this.isNew())return t;var e=this.get(this.idAttribute);return t.replace(/[^\/]$/,"$&/")+encodeURIComponent(e)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.extend({},t,{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=i.extend({},this.attributes,t);var n=this.validationError=this.validate(t,e)||null;return!n||(this.trigger("invalid",this,n,i.extend(e,{validationError:n})),!1)}});var b={keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1};o(y,b,"attributes");var x=e.Collection=function(t,e){e||(e={}),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,i.extend({silent:!0},e))},w={add:!0,remove:!0,merge:!0},E={add:!0,remove:!1},I=function(t,e,i){i=Math.min(Math.max(i,0),t.length);var n,s=Array(t.length-i),r=e.length;for(n=0;n<s.length;n++)s[n]=t[n+i];for(n=0;n<r;n++)t[n+i]=e[n];for(n=0;n<s.length;n++)t[n+r+i]=s[n]};i.extend(x.prototype,c,{model:y,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:!1},e,E))},remove:function(t,e){e=i.extend({},e);var n=!i.isArray(t);t=n?[t]:t.slice();var s=this._removeModels(t,e);return!e.silent&&s.length&&(e.changes={added:[],merged:[],removed:s},this.trigger("update",this,e)),n?s[0]:s},set:function(t,e){if(null!=t){e=i.extend({},w,e),e.parse&&!this._isModel(t)&&(t=this.parse(t,e)||[]);var n=!i.isArray(t);t=n?[t]:t.slice();var s=e.at;null!=s&&(s=+s),s>this.length&&(s=this.length),s<0&&(s+=this.length+1);var r,a,o=[],h=[],u=[],c=[],l={},d=e.add,f=e.merge,g=e.remove,v=!1,p=this.comparator&&null==s&&e.sort!==!1,m=i.isString(this.comparator)?this.comparator:null;for(a=0;a<t.length;a++){r=t[a];var _=this.get(r);if(_){if(f&&r!==_){var y=this._isModel(r)?r.attributes:r;e.parse&&(y=_.parse(y,e)),_.set(y,e),u.push(_),p&&!v&&(v=_.hasChanged(m))}l[_.cid]||(l[_.cid]=!0,o.push(_)),t[a]=_}else d&&(r=t[a]=this._prepareModel(r,e),r&&(h.push(r),this._addReference(r,e),l[r.cid]=!0,o.push(r)))}if(g){for(a=0;a<this.length;a++)r=this.models[a],l[r.cid]||c.push(r);c.length&&this._removeModels(c,e)}var b=!1,x=!p&&d&&g;if(o.length&&x?(b=this.length!==o.length||i.some(this.models,function(t,e){return t!==o[e]}),this.models.length=0,I(this.models,o,0),this.length=this.models.length):h.length&&(p&&(v=!0),I(this.models,h,null==s?this.length:s),this.length=this.models.length),v&&this.sort({silent:!0}),!e.silent){for(a=0;a<h.length;a++)null!=s&&(e.index=s+a),r=h[a],r.trigger("add",r,this,e);(v||b)&&this.trigger("sort",this,e),(h.length||c.length||u.length)&&(e.changes={added:h,removed:c,merged:u},this.trigger("update",this,e))}return n?t[0]:t}},reset:function(t,e){e=e?i.clone(e):{};for(var n=0;n<this.models.length;n++)this._removeReference(this.models[n],e);return e.previousModels=this.models,this._reset(),t=this.add(t,i.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t)},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t)},slice:function(){return r.apply(this.models,arguments)},get:function(t){if(null!=t)return this._byId[t]||this._byId[this.modelId(t.attributes||t)]||t.cid&&this._byId[t.cid]},has:function(t){return null!=this.get(t)},at:function(t){return t<0&&(t+=this.length),this.models[t]},where:function(t,e){return this[e?"find":"filter"](t)},findWhere:function(t){return this.where(t,!0)},sort:function(t){var e=this.comparator;if(!e)throw new Error("Cannot sort a set without a comparator");t||(t={});var n=e.length;return i.isFunction(e)&&(e=i.bind(e,this)),1===n||i.isString(e)?this.models=this.sortBy(e):this.models.sort(e),t.silent||this.trigger("sort",this,t),this},pluck:function(t){return this.map(t+"")},fetch:function(t){t=i.extend({parse:!0},t);var e=t.success,n=this;return t.success=function(i){var s=t.reset?"reset":"set";n[s](i,t),e&&e.call(t.context,n,i,t),n.trigger("sync",n,i,t)},B(this,t),this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};var n=e.wait;if(t=this._prepareModel(t,e),!t)return!1;n||this.add(t,e);var s=this,r=e.success;return e.success=function(t,e,i){n&&s.add(t,i),r&&r.call(i.context,t,e,i)},t.save(null,e),t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(t){return t[this.model.prototype.idAttribute||"id"]},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(t,e){if(this._isModel(t))return t.collection||(t.collection=this),t;e=e?i.clone(e):{},e.collection=this;var n=new this.model(t,e);return n.validationError?(this.trigger("invalid",this,n.validationError,e),!1):n},_removeModels:function(t,e){for(var i=[],n=0;n<t.length;n++){var s=this.get(t[n]);if(s){var r=this.indexOf(s);this.models.splice(r,1),this.length--,delete this._byId[s.cid];var a=this.modelId(s.attributes);null!=a&&delete this._byId[a],e.silent||(e.index=r,s.trigger("remove",s,this,e)),i.push(s),this._removeReference(s,e)}}return i},_isModel:function(t){return t instanceof y},_addReference:function(t,e){this._byId[t.cid]=t;var i=this.modelId(t.attributes);null!=i&&(this._byId[i]=t),t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){delete this._byId[t.cid];var i=this.modelId(t.attributes);null!=i&&delete this._byId[i],this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,n){if(e){if(("add"===t||"remove"===t)&&i!==this)return;if("destroy"===t&&this.remove(e,n),"change"===t){var s=this.modelId(e.previousAttributes()),r=this.modelId(e.attributes);s!==r&&(null!=s&&delete this._byId[s],null!=r&&(this._byId[r]=e))}}this.trigger.apply(this,arguments)}});var S={forEach:3,each:3,map:3,collect:3,reduce:0,foldl:0,inject:0,reduceRight:0,foldr:0,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3,findIndex:3,findLastIndex:3};o(x,S,"models");var k=e.View=function(t){this.cid=i.uniqueId("view"),i.extend(this,i.pick(t,P)),this._ensureElement(),this.initialize.apply(this,arguments)},T=/^(\S+)\s*(.*)$/,P=["model","collection","el","id","attributes","className","tagName","events"];i.extend(k.prototype,c,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this._removeElement(),this.stopListening(),this},_removeElement:function(){this.$el.remove()},setElement:function(t){return this.undelegateEvents(),this._setElement(t),this.delegateEvents(),this},_setElement:function(t){this.$el=t instanceof e.$?t:e.$(t),this.el=this.$el[0]},delegateEvents:function(t){if(t||(t=i.result(this,"events")),!t)return this;this.undelegateEvents();for(var e in t){var n=t[e];if(i.isFunction(n)||(n=this[n]),n){var s=e.match(T);this.delegate(s[1],s[2],i.bind(n,this))}}return this},delegate:function(t,e,i){return this.$el.on(t+".delegateEvents"+this.cid,e,i),this},undelegateEvents:function(){return this.$el&&this.$el.off(".delegateEvents"+this.cid),this},undelegate:function(t,e,i){return this.$el.off(t+".delegateEvents"+this.cid,e,i),this},_createElement:function(t){return document.createElement(t)},_ensureElement:function(){if(this.el)this.setElement(i.result(this,"el"));else{var t=i.extend({},i.result(this,"attributes"));this.id&&(t.id=i.result(this,"id")),this.className&&(t.class=i.result(this,"className")),this.setElement(this._createElement(i.result(this,"tagName"))),this._setAttributes(t)}},_setAttributes:function(t){this.$el.attr(t)}}),e.sync=function(t,n,s){var r=H[t];i.defaults(s||(s={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:r,dataType:"json"};if(s.url||(a.url=i.result(n,"url")||F()),null!=s.data||!n||"create"!==t&&"update"!==t&&"patch"!==t||(a.contentType="application/json",a.data=JSON.stringify(s.attrs||n.toJSON(s))),s.emulateJSON&&(a.contentType="application/x-www-form-urlencoded",a.data=a.data?{model:a.data}:{}),s.emulateHTTP&&("PUT"===r||"DELETE"===r||"PATCH"===r)){a.type="POST",s.emulateJSON&&(a.data._method=r);var o=s.beforeSend;s.beforeSend=function(t){if(t.setRequestHeader("X-HTTP-Method-Override",r),o)return o.apply(this,arguments)}}"GET"===a.type||s.emulateJSON||(a.processData=!1);var h=s.error;s.error=function(t,e,i){s.textStatus=e,s.errorThrown=i,h&&h.call(s.context,t,e,i)};var u=s.xhr=e.ajax(i.extend(a,s));return n.trigger("request",n,u,s),u};var H={create:"POST",update:"PUT",patch:"PATCH",delete:"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},A=/\((.*?)\)/g,C=/(\(\?)?:\w+/g,R=/\*\w+/g,j=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,c,{initialize:function(){},route:function(t,n,s){i.isRegExp(t)||(t=this._routeToRegExp(t)),i.isFunction(n)&&(s=n,n=""),s||(s=this[n]);var r=this;return e.history.route(t,function(i){var a=r._extractParameters(t,i);r.execute(s,a,n)!==!1&&(r.trigger.apply(r,["route:"+n].concat(a)),r.trigger("route",n,a),e.history.trigger("route",r,n,a))}),this},execute:function(t,e,i){t&&t.apply(this,e)},navigate:function(t,i){return e.history.navigate(t,i),this},_bindRoutes:function(){if(this.routes){this.routes=i.result(this,"routes");for(var t,e=i.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])}},_routeToRegExp:function(t){return t=t.replace(j,"\\$&").replace(A,"(?:$1)?").replace(C,function(t,e){return e?t:"([^/?]+)"}).replace(R,"([^?]*?)"),new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var n=t.exec(e).slice(1);return i.map(n,function(t,e){return e===n.length-1?t||null:t?decodeURIComponent(t):null})}});var N=e.History=function(){this.handlers=[],this.checkUrl=i.bind(this.checkUrl,this),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},M=/^[#\/]|\s+$/g,O=/^\/+|\/+$/g,U=/#.*$/;N.started=!1,i.extend(N.prototype,c,{interval:50,atRoot:function(){var t=this.location.pathname.replace(/[^\/]$/,"$&/");return t===this.root&&!this.getSearch()},matchRoot:function(){var t=this.decodeFragment(this.location.pathname),e=t.slice(0,this.root.length-1)+"/";return e===this.root},decodeFragment:function(t){return decodeURI(t.replace(/%25/g,"%2525"))},getSearch:function(){var t=this.location.href.replace(/#.*/,"").match(/\?.+/);return t?t[0]:""},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getPath:function(){var t=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return"/"===t.charAt(0)?t.slice(1):t},getFragment:function(t){return null==t&&(t=this._usePushState||!this._wantsHashChange?this.getPath():this.getHash()),t.replace(M,"")},start:function(t){if(N.started)throw new Error("Backbone.history has already been started");if(N.started=!0,this.options=i.extend({root:"/"},this.options,t),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._hasHashChange="onhashchange"in window&&(void 0===document.documentMode||document.documentMode>7),this._useHashChange=this._wantsHashChange&&this._hasHashChange,this._wantsPushState=!!this.options.pushState,this._hasPushState=!(!this.history||!this.history.pushState),this._usePushState=this._wantsPushState&&this._hasPushState,this.fragment=this.getFragment(),this.root=("/"+this.root+"/").replace(O,"/"),this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var e=this.root.slice(0,-1)||"/";return this.location.replace(e+"#"+this.getPath()),!0}this._hasPushState&&this.atRoot()&&this.navigate(this.getHash(),{replace:!0})}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe"),this.iframe.src="javascript:0",this.iframe.style.display="none",this.iframe.tabIndex=-1;var n=document.body,s=n.insertBefore(this.iframe,n.firstChild).contentWindow;s.document.open(),s.document.close(),s.location.hash="#"+this.fragment}var r=window.addEventListener||function(t,e){return attachEvent("on"+t,e)};if(this._usePushState?r("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe?r("hashchange",this.checkUrl,!1):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),!this.options.silent)return this.loadUrl()},stop:function(){var t=window.removeEventListener||function(t,e){return detachEvent("on"+t,e)};this._usePushState?t("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe&&t("hashchange",this.checkUrl,!1),this.iframe&&(document.body.removeChild(this.iframe),this.iframe=null),this._checkUrlInterval&&clearInterval(this._checkUrlInterval),N.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();return e===this.fragment&&this.iframe&&(e=this.getHash(this.iframe.contentWindow)),e!==this.fragment&&(this.iframe&&this.navigate(e),void this.loadUrl())},loadUrl:function(t){return!!this.matchRoot()&&(t=this.fragment=this.getFragment(t),i.some(this.handlers,function(e){if(e.route.test(t))return e.callback(t),!0}))},navigate:function(t,e){if(!N.started)return!1;e&&e!==!0||(e={trigger:!!e}),t=this.getFragment(t||"");var i=this.root;""!==t&&"?"!==t.charAt(0)||(i=i.slice(0,-1)||"/");var n=i+t;if(t=this.decodeFragment(t.replace(U,"")),this.fragment!==t){if(this.fragment=t,this._usePushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,n);else{if(!this._wantsHashChange)return this.location.assign(n);if(this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getHash(this.iframe.contentWindow)){var s=this.iframe.contentWindow;e.replace||(s.document.open(),s.document.close()),this._updateHash(s.location,t,e.replace)}}return e.trigger?this.loadUrl(t):void 0}},_updateHash:function(t,e,i){if(i){var n=t.href.replace(/(javascript:|#).*$/,"");t.replace(n+"#"+e)}else t.hash="#"+e}}),e.history=new N;var q=function(t,e){var n,s=this;return n=t&&i.has(t,"constructor")?t.constructor:function(){return s.apply(this,arguments)},i.extend(n,s,e),n.prototype=i.create(s.prototype,t),n.prototype.constructor=n,n.__super__=s.prototype,n};y.extend=x.extend=$.extend=k.extend=N.extend=q;var F=function(){throw new Error('A "url" property or function must be specified')},B=function(t,e){var i=e.error;e.error=function(n){i&&i.call(e.context,t,n,e),t.trigger("error",t,n,e)}};return e});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":49,"underscore":52}],44:[function(require,module,exports){
"use strict";function placeHoldersCount(o){var r=o.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===o[r-2]?2:"="===o[r-1]?1:0}function byteLength(o){return 3*o.length/4-placeHoldersCount(o)}function toByteArray(o){var r,e,t,u,n,p,a=o.length;n=placeHoldersCount(o),p=new Arr(3*a/4-n),t=n>0?a-4:a;var l=0;for(r=0,e=0;r<t;r+=4,e+=3)u=revLookup[o.charCodeAt(r)]<<18|revLookup[o.charCodeAt(r+1)]<<12|revLookup[o.charCodeAt(r+2)]<<6|revLookup[o.charCodeAt(r+3)],p[l++]=u>>16&255,p[l++]=u>>8&255,p[l++]=255&u;return 2===n?(u=revLookup[o.charCodeAt(r)]<<2|revLookup[o.charCodeAt(r+1)]>>4,p[l++]=255&u):1===n&&(u=revLookup[o.charCodeAt(r)]<<10|revLookup[o.charCodeAt(r+1)]<<4|revLookup[o.charCodeAt(r+2)]>>2,p[l++]=u>>8&255,p[l++]=255&u),p}function tripletToBase64(o){return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o]}function encodeChunk(o,r,e){for(var t,u=[],n=r;n<e;n+=3)t=(o[n]<<16)+(o[n+1]<<8)+o[n+2],u.push(tripletToBase64(t));return u.join("")}function fromByteArray(o){for(var r,e=o.length,t=e%3,u="",n=[],p=16383,a=0,l=e-t;a<l;a+=p)n.push(encodeChunk(o,a,a+p>l?l:a+p));return 1===t?(r=o[e-1],u+=lookup[r>>2],u+=lookup[r<<4&63],u+="=="):2===t&&(r=(o[e-2]<<8)+o[e-1],u+=lookup[r>>10],u+=lookup[r>>4&63],u+=lookup[r<<2&63],u+="="),n.push(u),n.join("")}exports.byteLength=byteLength,exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63;

},{}],45:[function(require,module,exports){
(function (global){
"use strict";function typedArraySupport(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(t,e){if(kMaxLength()<e)throw new RangeError("Invalid typed array length");return Buffer.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e),t.__proto__=Buffer.prototype):(null===t&&(t=new Buffer(e)),t.length=e),t}function Buffer(t,e,r){if(!(Buffer.TYPED_ARRAY_SUPPORT||this instanceof Buffer))return new Buffer(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return allocUnsafe(this,t)}return from(this,t,e,r)}function from(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?fromArrayBuffer(t,e,r,n):"string"==typeof e?fromString(t,e,r):fromObject(t,e)}function assertSize(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function alloc(t,e,r,n){return assertSize(e),e<=0?createBuffer(t,e):void 0!==r?"string"==typeof n?createBuffer(t,e).fill(r,n):createBuffer(t,e).fill(r):createBuffer(t,e)}function allocUnsafe(t,e){if(assertSize(e),t=createBuffer(t,e<0?0:0|checked(e)),!Buffer.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function fromString(t,e,r){if("string"==typeof r&&""!==r||(r="utf8"),!Buffer.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|byteLength(e,r);t=createBuffer(t,n);var f=t.write(e,r);return f!==n&&(t=t.slice(0,f)),t}function fromArrayLike(t,e){var r=e.length<0?0:0|checked(e.length);t=createBuffer(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function fromArrayBuffer(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");return e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n),Buffer.TYPED_ARRAY_SUPPORT?(t=e,t.__proto__=Buffer.prototype):t=fromArrayLike(t,e),t}function fromObject(t,e){if(Buffer.isBuffer(e)){var r=0|checked(e.length);return t=createBuffer(t,r),0===t.length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||isnan(e.length)?createBuffer(t,0):fromArrayLike(t,e);if("Buffer"===e.type&&isArray(e.data))return fromArrayLike(t,e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function checked(t){if(t>=kMaxLength())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+kMaxLength().toString(16)+" bytes");return 0|t}function SlowBuffer(t){return+t!=t&&(t=0),Buffer.alloc(+t)}function byteLength(t,e){if(Buffer.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return utf8ToBytes(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(t).length;default:if(n)return utf8ToBytes(t).length;e=(""+e).toLowerCase(),n=!0}}function slowToString(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if(r>>>=0,e>>>=0,r<=e)return"";for(t||(t="utf8");;)switch(t){case"hex":return hexSlice(this,e,r);case"utf8":case"utf-8":return utf8Slice(this,e,r);case"ascii":return asciiSlice(this,e,r);case"latin1":case"binary":return latin1Slice(this,e,r);case"base64":return base64Slice(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function swap(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function bidirectionalIndexOf(t,e,r,n,f){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=f?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(f)return-1;r=t.length-1}else if(r<0){if(!f)return-1;r=0}if("string"==typeof e&&(e=Buffer.from(e,n)),Buffer.isBuffer(e))return 0===e.length?-1:arrayIndexOf(t,e,r,n,f);if("number"==typeof e)return e=255&e,Buffer.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?f?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):arrayIndexOf(t,[e],r,n,f);throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(t,e,r,n,f){function i(t,e){return 1===o?t[e]:t.readUInt16BE(e*o)}var o=1,u=t.length,s=e.length;if(void 0!==n&&(n=String(n).toLowerCase(),"ucs2"===n||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;o=2,u/=2,s/=2,r/=2}var a;if(f){var h=-1;for(a=r;a<u;a++)if(i(t,a)===i(e,h===-1?0:a-h)){if(h===-1&&(h=a),a-h+1===s)return h*o}else h!==-1&&(a-=a-h),h=-1}else for(r+s>u&&(r=u-s),a=r;a>=0;a--){for(var c=!0,l=0;l<s;l++)if(i(t,a+l)!==i(e,l)){c=!1;break}if(c)return a}return-1}function hexWrite(t,e,r,n){r=Number(r)||0;var f=t.length-r;n?(n=Number(n),n>f&&(n=f)):n=f;var i=e.length;if(i%2!==0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var o=0;o<n;++o){var u=parseInt(e.substr(2*o,2),16);if(isNaN(u))return o;t[r+o]=u}return o}function utf8Write(t,e,r,n){return blitBuffer(utf8ToBytes(e,t.length-r),t,r,n)}function asciiWrite(t,e,r,n){return blitBuffer(asciiToBytes(e),t,r,n)}function latin1Write(t,e,r,n){return asciiWrite(t,e,r,n)}function base64Write(t,e,r,n){return blitBuffer(base64ToBytes(e),t,r,n)}function ucs2Write(t,e,r,n){return blitBuffer(utf16leToBytes(e,t.length-r),t,r,n)}function base64Slice(t,e,r){return 0===e&&r===t.length?base64.fromByteArray(t):base64.fromByteArray(t.slice(e,r))}function utf8Slice(t,e,r){r=Math.min(t.length,r);for(var n=[],f=e;f<r;){var i=t[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(f+u<=r){var s,a,h,c;switch(u){case 1:i<128&&(o=i);break;case 2:s=t[f+1],128===(192&s)&&(c=(31&i)<<6|63&s,c>127&&(o=c));break;case 3:s=t[f+1],a=t[f+2],128===(192&s)&&128===(192&a)&&(c=(15&i)<<12|(63&s)<<6|63&a,c>2047&&(c<55296||c>57343)&&(o=c));break;case 4:s=t[f+1],a=t[f+2],h=t[f+3],128===(192&s)&&128===(192&a)&&128===(192&h)&&(c=(15&i)<<18|(63&s)<<12|(63&a)<<6|63&h,c>65535&&c<1114112&&(o=c))}}null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u}return decodeCodePointsArray(n)}function decodeCodePointsArray(t){var e=t.length;if(e<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,t);for(var r="",n=0;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;f<r;++f)n+=String.fromCharCode(127&t[f]);return n}function latin1Slice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;f<r;++f)n+=String.fromCharCode(t[f]);return n}function hexSlice(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var f="",i=e;i<r;++i)f+=toHex(t[i]);return f}function utf16leSlice(t,e,r){for(var n=t.slice(e,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(t,e,r){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(t,e,r,n,f,i){if(!Buffer.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>f||e<i)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function objectWriteUInt16(t,e,r,n){e<0&&(e=65535+e+1);for(var f=0,i=Math.min(t.length-r,2);f<i;++f)t[r+f]=(e&255<<8*(n?f:1-f))>>>8*(n?f:1-f)}function objectWriteUInt32(t,e,r,n){e<0&&(e=4294967295+e+1);for(var f=0,i=Math.min(t.length-r,4);f<i;++f)t[r+f]=e>>>8*(n?f:3-f)&255}function checkIEEE754(t,e,r,n,f,i){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function writeFloat(t,e,r,n,f){return f||checkIEEE754(t,e,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(t,e,r,n,23,4),r+4}function writeDouble(t,e,r,n,f){return f||checkIEEE754(t,e,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(t,e,r,n,52,8),r+8}function base64clean(t){if(t=stringtrim(t).replace(INVALID_BASE64_RE,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function stringtrim(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function toHex(t){return t<16?"0"+t.toString(16):t.toString(16)}function utf8ToBytes(t,e){e=e||1/0;for(var r,n=t.length,f=null,i=[],o=0;o<n;++o){if(r=t.charCodeAt(o),r>55295&&r<57344){if(!f){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(e-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(r<56320){(e-=3)>-1&&i.push(239,191,189),f=r;continue}r=(f-55296<<10|r-56320)+65536}else f&&(e-=3)>-1&&i.push(239,191,189);if(f=null,r<128){if((e-=1)<0)break;i.push(r)}else if(r<2048){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}function utf16leToBytes(t,e){for(var r,n,f,i=[],o=0;o<t.length&&!((e-=2)<0);++o)r=t.charCodeAt(o),n=r>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(t){return base64.toByteArray(base64clean(t))}function blitBuffer(t,e,r,n){for(var f=0;f<n&&!(f+r>=e.length||f>=t.length);++f)e[f+r]=t[f];return f}function isnan(t){return t!==t}var base64=require("base64-js"),ieee754=require("ieee754"),isArray=require("isarray");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=void 0!==global.TYPED_ARRAY_SUPPORT?global.TYPED_ARRAY_SUPPORT:typedArraySupport(),exports.kMaxLength=kMaxLength(),Buffer.poolSize=8192,Buffer._augment=function(t){return t.__proto__=Buffer.prototype,t},Buffer.from=function(t,e,r){return from(null,t,e,r)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})),Buffer.alloc=function(t,e,r){return alloc(null,t,e,r)},Buffer.allocUnsafe=function(t){return allocUnsafe(null,t)},Buffer.allocUnsafeSlow=function(t){return allocUnsafe(null,t)},Buffer.isBuffer=function(t){return!(null==t||!t._isBuffer)},Buffer.compare=function(t,e){if(!Buffer.isBuffer(t)||!Buffer.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,f=0,i=Math.min(r,n);f<i;++f)if(t[f]!==e[f]){r=t[f],n=e[f];break}return r<n?-1:n<r?1:0},Buffer.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(t,e){if(!isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return Buffer.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=Buffer.allocUnsafe(e),f=0;for(r=0;r<t.length;++r){var i=t[r];if(!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)swap(this,e,e+1);return this},Buffer.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)swap(this,e,e+3),swap(this,e+1,e+2);return this},Buffer.prototype.swap64=function(){var t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)swap(this,e,e+7),swap(this,e+1,e+6),swap(this,e+2,e+5),swap(this,e+3,e+4);return this},Buffer.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?utf8Slice(this,0,t):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(t){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===Buffer.compare(this,t)},Buffer.prototype.inspect=function(){var t="",e=exports.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},Buffer.prototype.compare=function(t,e,r,n,f){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),e<0||r>t.length||n<0||f>this.length)throw new RangeError("out of range index");if(n>=f&&e>=r)return 0;if(n>=f)return-1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,f>>>=0,this===t)return 0;for(var i=f-n,o=r-e,u=Math.min(i,o),s=this.slice(n,f),a=t.slice(e,r),h=0;h<u;++h)if(s[h]!==a[h]){i=s[h],o=a[h];break}return i<o?-1:o<i?1:0},Buffer.prototype.includes=function(t,e,r){return this.indexOf(t,e,r)!==-1},Buffer.prototype.indexOf=function(t,e,r){return bidirectionalIndexOf(this,t,e,r,!0)},Buffer.prototype.lastIndexOf=function(t,e,r){return bidirectionalIndexOf(this,t,e,r,!1)},Buffer.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e=0|e,isFinite(r)?(r=0|r,void 0===n&&(n="utf8")):(n=r,r=void 0)}var f=this.length-e;if((void 0===r||r>f)&&(r=f),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return hexWrite(this,t,e,r);case"utf8":case"utf-8":return utf8Write(this,t,e,r);case"ascii":return asciiWrite(this,t,e,r);case"latin1":case"binary":return latin1Write(this,t,e,r);case"base64":return base64Write(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,t,e,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(t,e){var r=this.length;t=~~t,e=void 0===e?r:~~e,t<0?(t+=r,t<0&&(t=0)):t>r&&(t=r),e<0?(e+=r,e<0&&(e=0)):e>r&&(e=r),e<t&&(e=t);var n;if(Buffer.TYPED_ARRAY_SUPPORT)n=this.subarray(t,e),n.__proto__=Buffer.prototype;else{var f=e-t;n=new Buffer(f,(void 0));for(var i=0;i<f;++i)n[i]=this[i+t]}return n},Buffer.prototype.readUIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return n},Buffer.prototype.readUIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t+--e],f=1;e>0&&(f*=256);)n+=this[t+--e]*f;return n},Buffer.prototype.readUInt8=function(t,e){return e||checkOffset(t,1,this.length),this[t]},Buffer.prototype.readUInt16LE=function(t,e){return e||checkOffset(t,2,this.length),this[t]|this[t+1]<<8},Buffer.prototype.readUInt16BE=function(t,e){return e||checkOffset(t,2,this.length),this[t]<<8|this[t+1]},Buffer.prototype.readUInt32LE=function(t,e){return e||checkOffset(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},Buffer.prototype.readUInt32BE=function(t,e){return e||checkOffset(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},Buffer.prototype.readIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*e)),n},Buffer.prototype.readIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=e,f=1,i=this[t+--n];n>0&&(f*=256);)i+=this[t+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*e)),i},Buffer.prototype.readInt8=function(t,e){return e||checkOffset(t,1,this.length),128&this[t]?(255-this[t]+1)*-1:this[t]},Buffer.prototype.readInt16LE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(t,e){return e||checkOffset(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},Buffer.prototype.readInt32BE=function(t,e){return e||checkOffset(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},Buffer.prototype.readFloatLE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!0,23,4)},Buffer.prototype.readFloatBE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!1,23,4)},Buffer.prototype.readDoubleLE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!0,52,8)},Buffer.prototype.readDoubleBE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!1,52,8)},Buffer.prototype.writeUIntLE=function(t,e,r,n){if(t=+t,e=0|e,r=0|r,!n){var f=Math.pow(2,8*r)-1;checkInt(this,t,e,r,f,0)}var i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},Buffer.prototype.writeUIntBE=function(t,e,r,n){if(t=+t,e=0|e,r=0|r,!n){var f=Math.pow(2,8*r)-1;checkInt(this,t,e,r,f,0)}var i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},Buffer.prototype.writeUInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},Buffer.prototype.writeUInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeUInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeUInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeUInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=0,o=1,u=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===u&&0!==this[e+i-1]&&(u=1),this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=r-1,o=1,u=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===u&&0!==this[e+i+1]&&(u=1),this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},Buffer.prototype.writeInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeFloatLE=function(t,e,r){return writeFloat(this,t,e,!0,r)},Buffer.prototype.writeFloatBE=function(t,e,r){return writeFloat(this,t,e,!1,r)},Buffer.prototype.writeDoubleLE=function(t,e,r){return writeDouble(this,t,e,!0,r)},Buffer.prototype.writeDoubleBE=function(t,e,r){return writeDouble(this,t,e,!1,r)},Buffer.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var f,i=n-r;if(this===t&&r<e&&e<n)for(f=i-1;f>=0;--f)t[f+e]=this[f+r];else if(i<1e3||!Buffer.TYPED_ARRAY_SUPPORT)for(f=0;f<i;++f)t[f+e]=this[f+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+i),e);return i},Buffer.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var f=t.charCodeAt(0);f<256&&(t=f)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t=255&t);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0);var i;if("number"==typeof t)for(i=e;i<r;++i)this[i]=t;else{var o=Buffer.isBuffer(t)?t:utf8ToBytes(new Buffer(t,n).toString()),u=o.length;for(i=0;i<r-e;++i)this[i+e]=o[i%u]}return this};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":44,"ieee754":47,"isarray":48}],46:[function(require,module,exports){
!function(){function n(n){return n&&(n.ownerDocument||n.document||n).documentElement}function t(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function e(n,t){return n<t?-1:n>t?1:n>=t?0:NaN}function r(n){return null===n?NaN:+n}function i(n){return!isNaN(n)}function u(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);r<i;){var u=r+i>>>1;n(t[u],e)<0?r=u+1:i=u}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);r<i;){var u=r+i>>>1;n(t[u],e)>0?i=u:r=u+1}return r}}}function o(n){return n.length}function a(n){for(var t=1;n*t%1;)t*=10;return t}function l(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function c(){this._=Object.create(null)}function f(n){return(n+="")===Mo||n[0]===xo?xo+n:n}function s(n){return(n+="")[0]===xo?n.slice(1):n}function h(n){return f(n)in this._}function p(n){return(n=f(n))in this._&&delete this._[n]}function g(){var n=[];for(var t in this._)n.push(s(t));return n}function v(){var n=0;for(var t in this._)++n;return n}function d(){for(var n in this._)return!1;return!0}function y(){this._=Object.create(null)}function m(n){return n}function M(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function x(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=bo.length;e<r;++e){var i=bo[e]+t;if(i in n)return i}}function b(){}function _(){}function w(n){function t(){for(var t,r=e,i=-1,u=r.length;++i<u;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new c;return t.on=function(t,i){var u,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,u=e.indexOf(o)).concat(e.slice(u+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function S(){ao.event.preventDefault()}function k(){for(var n,t=ao.event;n=t.sourceEvent;)t=n;return t}function N(n){for(var t=new _,e=0,r=arguments.length;++e<r;)t[arguments[e]]=w(t);return t.of=function(e,r){return function(i){try{var u=i.sourceEvent=ao.event;i.target=n,ao.event=i,t[i.type].apply(e,r)}finally{ao.event=u}}},t}function E(n){return wo(n,Eo),n}function A(n){return"function"==typeof n?n:function(){return So(n,this)}}function C(n){return"function"==typeof n?n:function(){return ko(n,this)}}function z(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function u(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ao.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?a:o:n.local?u:i}function L(n){return n.trim().replace(/\s+/g," ")}function q(n){return new RegExp("(?:^|\\s+)"+ao.requote(n)+"(?:\\s+|$)","g")}function T(n){return(n+"").trim().split(/^|\s+/)}function R(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=T(n).map(D);var i=n.length;return"function"==typeof t?r:e}function D(n){var t=q(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",L(i+" "+n))):e.setAttribute("class",L(i.replace(t," ")))}}function P(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function u(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?u:i}function U(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function j(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e===Ao&&t.documentElement.namespaceURI===Ao?t.createElement(n):t.createElementNS(e,n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=ao.ns.qualify(n)).local?e:t}function F(){var n=this.parentNode;n&&n.removeChild(this)}function H(n){return{__data__:n}}function O(n){return function(){return No(this,n)}}function I(n){return arguments.length||(n=e),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Y(n,t){for(var e=0,r=n.length;e<r;e++)for(var i,u=n[e],o=0,a=u.length;o<a;o++)(i=u[o])&&t(i,o,e);return n}function Z(n){return wo(n,zo),n}function V(n){var t,e;return function(r,i,u){var o,a=n[u].update,l=a.length;for(u!=e&&(e=u,t=0),i>=t&&(t=i+1);!(o=a[t])&&++t<l;);return o}}function X(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function i(){var i=l(t,co(arguments));r.call(this),this.addEventListener(n,this[o]=i,i.$=e),i._=t}function u(){var t,e=new RegExp("^__on([^.]+)"+ao.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var o="__on"+n,a=n.indexOf("."),l=$;a>0&&(n=n.slice(0,a));var c=Lo.get(n);return c&&(n=c,l=B),a?t?i:r:t?b:u}function $(n,t){return function(e){var r=ao.event;ao.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ao.event=r}}}function B(n,t){var e=$(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function W(e){var r=".dragsuppress-"+ ++To,i="click"+r,u=ao.select(t(e)).on("touchmove"+r,S).on("dragstart"+r,S).on("selectstart"+r,S);if(null==qo&&(qo=!("onselectstart"in e)&&x(e.style,"userSelect")),qo){var o=n(e).style,a=o[qo];o[qo]="none"}return function(n){if(u.on(r,null),qo&&(o[qo]=a),n){var t=function(){u.on(i,null)};u.on(i,function(){S(),t()},!0),setTimeout(t,0)}}}function J(n,e){e.changedTouches&&(e=e.changedTouches[0]);var r=n.ownerSVGElement||n;if(r.createSVGPoint){var i=r.createSVGPoint();if(Ro<0){var u=t(n);if(u.scrollX||u.scrollY){r=ao.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var o=r[0][0].getScreenCTM();Ro=!(o.f||o.e),r.remove()}}return Ro?(i.x=e.pageX,i.y=e.pageY):(i.x=e.clientX,i.y=e.clientY),i=i.matrixTransform(n.getScreenCTM().inverse()),[i.x,i.y]}var a=n.getBoundingClientRect();return[e.clientX-a.left-n.clientLeft,e.clientY-a.top-n.clientTop]}function G(){return ao.event.changedTouches[0].identifier}function K(n){return n>0?1:n<0?-1:0}function Q(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function nn(n){return n>1?0:n<-1?Uo:Math.acos(n)}function tn(n){return n>1?Ho:n<-1?-Ho:Math.asin(n)}function en(n){return((n=Math.exp(n))-1/n)/2}function rn(n){return((n=Math.exp(n))+1/n)/2}function un(n){return((n=Math.exp(2*n))-1)/(n+1)}function on(n){return(n=Math.sin(n/2))*n}function an(){}function ln(n,t,e){return this instanceof ln?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof ln?new ln(n.h,n.s,n.l):_n(""+n,wn,ln):new ln(n,t,e)}function cn(n,t,e){function r(n){return n>360?n-=360:n<0&&(n+=360),n<60?u+(o-u)*n/60:n<180?o:n<240?u+(o-u)*(240-n)/60:u}function i(n){return Math.round(255*r(n))}var u,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:t<0?0:t>1?1:t,e=e<0?0:e>1?1:e,o=e<=.5?e*(1+t):e+t-e*t,u=2*e-o,new mn(i(n+120),i(n),i(n-120))}function fn(n,t,e){return this instanceof fn?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof fn?new fn(n.h,n.c,n.l):n instanceof hn?gn(n.l,n.a,n.b):gn((n=Sn((n=ao.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new fn(n,t,e)}function sn(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new hn(e,Math.cos(n*=Oo)*t,Math.sin(n)*t)}function hn(n,t,e){return this instanceof hn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof hn?new hn(n.l,n.a,n.b):n instanceof fn?sn(n.h,n.c,n.l):Sn((n=mn(n)).r,n.g,n.b):new hn(n,t,e)}function pn(n,t,e){var r=(n+16)/116,i=r+t/500,u=r-e/200;return i=vn(i)*Ko,r=vn(r)*Qo,u=vn(u)*na,new mn(yn(3.2404542*i-1.5371385*r-.4985314*u),yn(-.969266*i+1.8760108*r+.041556*u),yn(.0556434*i-.2040259*r+1.0572252*u))}function gn(n,t,e){return n>0?new fn(Math.atan2(e,t)*Io,Math.sqrt(t*t+e*e),n):new fn(NaN,NaN,n)}function vn(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function dn(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function yn(n){return Math.round(255*(n<=.00304?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function mn(n,t,e){return this instanceof mn?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof mn?new mn(n.r,n.g,n.b):_n(""+n,mn,cn):new mn(n,t,e)}function Mn(n){return new mn(n>>16,n>>8&255,255&n)}function xn(n){return Mn(n)+""}function bn(n){return n<16?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function _n(n,t,e){var r,i,u,o=0,a=0,l=0;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(Nn(i[0]),Nn(i[1]),Nn(i[2]))}return(u=ra.get(n))?t(u.r,u.g,u.b):(null==n||"#"!==n.charAt(0)||isNaN(u=parseInt(n.slice(1),16))||(4===n.length?(o=(3840&u)>>4,o=o>>4|o,a=240&u,a=a>>4|a,l=15&u,l=l<<4|l):7===n.length&&(o=(16711680&u)>>16,a=(65280&u)>>8,l=255&u)),t(o,a,l))}function wn(n,t,e){var r,i,u=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-u,l=(o+u)/2;return a?(i=l<.5?a/(o+u):a/(2-o-u),r=n==o?(t-e)/a+(t<e?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=NaN,i=l>0&&l<1?0:r),new ln(r,i,l)}function Sn(n,t,e){n=kn(n),t=kn(t),e=kn(e);var r=dn((.4124564*n+.3575761*t+.1804375*e)/Ko),i=dn((.2126729*n+.7151522*t+.072175*e)/Qo),u=dn((.0193339*n+.119192*t+.9503041*e)/na);return hn(116*i-16,500*(r-i),200*(i-u))}function kn(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function Nn(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function En(n){return"function"==typeof n?n:function(){return n}}function An(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),Cn(t,e,n,r)}}function Cn(n,t,e,r){function i(){var n,t=l.status;if(!t&&Ln(l)||t>=200&&t<300||304===t){try{n=e.call(u,l)}catch(n){return void o.error.call(u,n)}o.load.call(u,n)}else o.error.call(u,l)}var u={},o=ao.dispatch("beforesend","progress","load","error"),a={},l=new XMLHttpRequest,c=null;return!this.XDomainRequest||"withCredentials"in l||!/^(http(s)?:)?\/\//.test(n)||(l=new XDomainRequest),"onload"in l?l.onload=l.onerror=i:l.onreadystatechange=function(){l.readyState>3&&i()},l.onprogress=function(n){var t=ao.event;ao.event=n;try{o.progress.call(u,l)}finally{ao.event=t}},u.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?a[n]:(null==t?delete a[n]:a[n]=t+"",u)},u.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",u):t},u.responseType=function(n){return arguments.length?(c=n,u):c},u.response=function(n){return e=n,u},["get","post"].forEach(function(n){u[n]=function(){return u.send.apply(u,[n].concat(co(arguments)))}}),u.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),l.open(e,n,!0),null==t||"accept"in a||(a.accept=t+",*/*"),l.setRequestHeader)for(var f in a)l.setRequestHeader(f,a[f]);return null!=t&&l.overrideMimeType&&l.overrideMimeType(t),null!=c&&(l.responseType=c),null!=i&&u.on("error",i).on("load",function(n){i(null,n)}),o.beforesend.call(u,l),l.send(null==r?null:r),u},u.abort=function(){return l.abort(),u},ao.rebind(u,o,"on"),null==r?u:u.get(zn(r))}function zn(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Ln(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function qn(n,t,e){var r=arguments.length;r<2&&(t=0),r<3&&(e=Date.now());var i=e+t,u={c:n,t:i,n:null};return ua?ua.n=u:ia=u,ua=u,oa||(aa=clearTimeout(aa),oa=1,la(Tn)),u}function Tn(){var n=Rn(),t=Dn()-n;t>24?(isFinite(t)&&(clearTimeout(aa),aa=setTimeout(Tn,t)),oa=0):(oa=1,la(Tn))}function Rn(){for(var n=Date.now(),t=ia;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n;return n}function Dn(){for(var n,t=ia,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:ia=t.n;return ua=n,e}function Pn(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Un(n,t){var e=Math.pow(10,3*mo(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function jn(n){var t=n.decimal,e=n.thousands,r=n.grouping,i=n.currency,u=r&&e?function(n,t){for(var i=n.length,u=[],o=0,a=r[0],l=0;i>0&&a>0&&(l+a+1>t&&(a=Math.max(1,t-l)),u.push(n.substring(i-=a,i+a)),!((l+=a+1)>t));)a=r[o=(o+1)%r.length];return u.reverse().join(e)}:m;return function(n){var e=fa.exec(n),r=e[1]||" ",o=e[2]||">",a=e[3]||"-",l=e[4]||"",c=e[5],f=+e[6],s=e[7],h=e[8],p=e[9],g=1,v="",d="",y=!1,m=!0;switch(h&&(h=+h.substring(1)),(c||"0"===r&&"="===o)&&(c=r="0",o="="),p){case"n":s=!0,p="g";break;case"%":g=100,d="%",p="f";break;case"p":g=100,d="%",p="r";break;case"b":case"o":case"x":case"X":"#"===l&&(v="0"+p.toLowerCase());case"c":m=!1;case"d":y=!0,h=0;break;case"s":g=-1,p="r"}"$"===l&&(v=i[0],d=i[1]),"r"!=p||h||(p="g"),null!=h&&("g"==p?h=Math.max(1,Math.min(21,h)):"e"!=p&&"f"!=p||(h=Math.max(0,Math.min(20,h)))),p=sa.get(p)||Fn;var M=c&&s;return function(n){var e=d;if(y&&n%1)return"";var i=n<0||0===n&&1/n<0?(n=-n,"-"):"-"===a?"":a;if(g<0){var l=ao.formatPrefix(n,h);n=l.scale(n),e=l.symbol+d}else n*=g;n=p(n,h);var x,b,_=n.lastIndexOf(".");if(_<0){var w=m?n.lastIndexOf("e"):-1;w<0?(x=n,b=""):(x=n.substring(0,w),b=n.substring(w))}else x=n.substring(0,_),b=t+n.substring(_+1);!c&&s&&(x=u(x,1/0));var S=v.length+x.length+b.length+(M?0:i.length),k=S<f?new Array(S=f-S+1).join(r):"";return M&&(x=u(k+x,k.length?f-b.length:1/0)),i+=v,n=x+b,("<"===o?i+n+k:">"===o?k+i+n:"^"===o?k.substring(0,S>>=1)+i+n+k.substring(S):i+(M?n:k+n))+e}}}function Fn(n){return n+""}function Hn(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function On(n,t,e){function r(t){var e=n(t),r=u(e,1);return t-e<r-t?e:r}function i(e){return t(e=n(new pa(e-1)),1),e}function u(n,e){return t(n=new pa((+n)),e),n}function o(n,r,u){var o=i(n),a=[];if(u>1)for(;o<r;)e(o)%u||a.push(new Date((+o))),t(o,1);else for(;o<r;)a.push(new Date((+o))),t(o,1);return a}function a(n,t,e){try{pa=Hn;var r=new Hn;return r._=n,o(r,t,e)}finally{pa=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=o;var l=n.utc=In(n);return l.floor=l,l.round=In(r),l.ceil=In(i),l.offset=In(u),l.range=a,n}function In(n){return function(t,e){try{pa=Hn;var r=new Hn;return r._=t,n(r,e)._}finally{pa=Date}}}function Yn(n){function t(n){function t(t){for(var e,i,u,o=[],a=-1,l=0;++a<r;)37===n.charCodeAt(a)&&(o.push(n.slice(l,a)),null!=(i=va[e=n.charAt(++a)])&&(e=n.charAt(++a)),(u=A[e])&&(e=u(t,null==i?"e"===e?" ":"0":i)),o.push(e),l=a+1);return o.push(n.slice(l,a)),o.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},i=e(r,n,t,0);if(i!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var u=null!=r.Z&&pa!==Hn,o=new(u?Hn:pa);return"j"in r?o.setFullYear(r.y,0,r.j):"W"in r||"U"in r?("w"in r||(r.w="W"in r?1:0),o.setFullYear(r.y,0,1),o.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(o.getDay()+5)%7:r.w+7*r.U-(o.getDay()+6)%7)):o.setFullYear(r.y,r.m,r.d),o.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),u?o._:o},t.toString=function(){return n},t}function e(n,t,e,r){for(var i,u,o,a=0,l=t.length,c=e.length;a<l;){if(r>=c)return-1;if(i=t.charCodeAt(a++),37===i){if(o=t.charAt(a++),u=C[o in va?t.charAt(a++):o],!u||(r=u(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){x.lastIndex=0;var r=x.exec(t.slice(e));return r?(n.w=b.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,e){N.lastIndex=0;var r=N.exec(t.slice(e));return r?(n.m=E.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=k.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,r){return e(n,A.c.toString(),t,r)}function l(n,t,r){return e(n,A.x.toString(),t,r)}function c(n,t,r){return e(n,A.X.toString(),t,r)}function f(n,t,e){var r=M.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var s=n.dateTime,h=n.date,p=n.time,g=n.periods,v=n.days,d=n.shortDays,y=n.months,m=n.shortMonths;t.utc=function(n){function e(n){try{pa=Hn;var t=new pa;return t._=n,r(t)}finally{pa=Date}}var r=t(n);return e.parse=function(n){try{pa=Hn;var t=r.parse(n);return t&&t._}finally{pa=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=ct;var M=ao.map(),x=Vn(v),b=Xn(v),_=Vn(d),w=Xn(d),S=Vn(y),k=Xn(y),N=Vn(m),E=Xn(m);g.forEach(function(n,t){M.set(n.toLowerCase(),t)});var A={a:function(n){return d[n.getDay()]},A:function(n){return v[n.getDay()]},b:function(n){return m[n.getMonth()]},B:function(n){return y[n.getMonth()]},c:t(s),d:function(n,t){return Zn(n.getDate(),t,2)},e:function(n,t){return Zn(n.getDate(),t,2)},H:function(n,t){return Zn(n.getHours(),t,2)},I:function(n,t){return Zn(n.getHours()%12||12,t,2)},j:function(n,t){return Zn(1+ha.dayOfYear(n),t,3)},L:function(n,t){return Zn(n.getMilliseconds(),t,3)},m:function(n,t){return Zn(n.getMonth()+1,t,2)},M:function(n,t){return Zn(n.getMinutes(),t,2)},p:function(n){return g[+(n.getHours()>=12)]},S:function(n,t){return Zn(n.getSeconds(),t,2)},U:function(n,t){return Zn(ha.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Zn(ha.mondayOfYear(n),t,2)},x:t(h),X:t(p),y:function(n,t){return Zn(n.getFullYear()%100,t,2)},Y:function(n,t){return Zn(n.getFullYear()%1e4,t,4)},Z:at,"%":function(){return"%"}},C={a:r,A:i,b:u,B:o,c:a,d:tt,e:tt,H:rt,I:rt,j:et,L:ot,m:nt,M:it,p:f,S:ut,U:Bn,w:$n,W:Wn,x:l,X:c,y:Gn,Y:Jn,Z:Kn,"%":lt};return t}function Zn(n,t,e){var r=n<0?"-":"",i=(r?-n:n)+"",u=i.length;return r+(u<e?new Array(e-u+1).join(t)+i:i)}function Vn(n){return new RegExp("^(?:"+n.map(ao.requote).join("|")+")","i")}function Xn(n){for(var t=new c,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function $n(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Bn(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function Wn(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function Jn(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Gn(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.y=Qn(+r[0]),e+r[0].length):-1}function Kn(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function Qn(n){return n+(n>68?1900:2e3)}function nt(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function tt(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function et(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function rt(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function it(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ut(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ot(n,t,e){da.lastIndex=0;var r=da.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function at(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=mo(t)/60|0,i=mo(t)%60;return e+Zn(r,"0",2)+Zn(i,"0",2)}function lt(n,t,e){ya.lastIndex=0;var r=ya.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function ct(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function ft(){}function st(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}function ht(n,t){n&&ba.hasOwnProperty(n.type)&&ba[n.type](n,t)}function pt(n,t,e){var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1],r[2]);t.lineEnd()}function gt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)pt(n[e],t,1);t.polygonEnd()}function vt(){function n(n,t){n*=Oo,t=t*Oo/2+Uo/4;var e=n-r,o=e>=0?1:-1,a=o*e,l=Math.cos(t),c=Math.sin(t),f=u*c,s=i*l+f*Math.cos(a),h=f*o*Math.sin(a);wa.add(Math.atan2(h,s)),r=n,i=l,u=c}var t,e,r,i,u;Sa.point=function(o,a){Sa.point=n,r=(t=o)*Oo,i=Math.cos(a=(e=a)*Oo/2+Uo/4),u=Math.sin(a)},Sa.lineEnd=function(){n(t,e)}}function dt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function yt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function mt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Mt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function xt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function bt(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function _t(n){return[Math.atan2(n[1],n[0]),tn(n[2])]}function wt(n,t){return mo(n[0]-t[0])<Do&&mo(n[1]-t[1])<Do}function St(n,t){n*=Oo;var e=Math.cos(t*=Oo);kt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function kt(n,t,e){++ka,Ea+=(n-Ea)/ka,Aa+=(t-Aa)/ka,Ca+=(e-Ca)/ka}function Nt(){function n(n,i){n*=Oo;var u=Math.cos(i*=Oo),o=u*Math.cos(n),a=u*Math.sin(n),l=Math.sin(i),c=Math.atan2(Math.sqrt((c=e*l-r*a)*c+(c=r*o-t*l)*c+(c=t*a-e*o)*c),t*o+e*a+r*l);Na+=c,za+=c*(t+(t=o)),La+=c*(e+(e=a)),qa+=c*(r+(r=l)),kt(t,e,r)}var t,e,r;Pa.point=function(i,u){i*=Oo;var o=Math.cos(u*=Oo);t=o*Math.cos(i),e=o*Math.sin(i),r=Math.sin(u),Pa.point=n,kt(t,e,r)}}function Et(){Pa.point=St}function At(){function n(n,t){n*=Oo;var e=Math.cos(t*=Oo),o=e*Math.cos(n),a=e*Math.sin(n),l=Math.sin(t),c=i*l-u*a,f=u*o-r*l,s=r*a-i*o,h=Math.sqrt(c*c+f*f+s*s),p=r*o+i*a+u*l,g=h&&-nn(p)/h,v=Math.atan2(h,p);Ta+=g*c,Ra+=g*f,Da+=g*s,Na+=v,za+=v*(r+(r=o)),La+=v*(i+(i=a)),qa+=v*(u+(u=l)),kt(r,i,u)}var t,e,r,i,u;Pa.point=function(o,a){t=o,e=a,Pa.point=n,o*=Oo;var l=Math.cos(a*=Oo);r=l*Math.cos(o),i=l*Math.sin(o),u=Math.sin(a),kt(r,i,u)},Pa.lineEnd=function(){n(t,e),Pa.lineEnd=Et,Pa.point=St}}function Ct(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function zt(){return!0}function Lt(n,t,e,r,i){var u=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(wt(e,r)){i.lineStart();for(var a=0;a<t;++a)i.point((e=n[a])[0],e[1]);return void i.lineEnd()}var l=new Tt(e,n,null,(!0)),c=new Tt(e,null,l,(!1));l.o=c,u.push(l),o.push(c),l=new Tt(r,n,null,(!1)),c=new Tt(r,null,l,(!0)),l.o=c,u.push(l),o.push(c)}}),o.sort(t),qt(u),qt(o),u.length){for(var a=0,l=e,c=o.length;a<c;++a)o[a].e=l=!l;for(var f,s,h=u[0];;){for(var p=h,g=!0;p.v;)if((p=p.n)===h)return;f=p.z,i.lineStart();do{if(p.v=p.o.v=!0,p.e){if(g)for(var a=0,c=f.length;a<c;++a)i.point((s=f[a])[0],s[1]);else r(p.x,p.n.x,1,i);p=p.n}else{if(g){f=p.p.z;for(var a=f.length-1;a>=0;--a)i.point((s=f[a])[0],s[1])}else r(p.x,p.p.x,-1,i);p=p.p}p=p.o,f=p.z,g=!g}while(!p.v);i.lineEnd()}}}function qt(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.n=e=n[r],e.p=i,i=e;i.n=e=n[0],e.p=i}}function Tt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Rt(n,t,e,r){return function(i,u){function o(t,e){var r=i(t,e);n(t=r[0],e=r[1])&&u.point(t,e)}function a(n,t){var e=i(n,t);d.point(e[0],e[1])}function l(){m.point=a,d.lineStart()}function c(){m.point=o,d.lineEnd()}function f(n,t){v.push([n,t]);var e=i(n,t);x.point(e[0],e[1])}function s(){x.lineStart(),v=[]}function h(){f(v[0][0],v[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(v.pop(),g.push(v),v=null,r)if(1&t){n=e[0];var i,r=n.length-1,o=-1;if(r>0){for(b||(u.polygonStart(),b=!0),u.lineStart();++o<r;)u.point((i=n[o])[0],i[1]);u.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),p.push(e.filter(Dt))}var p,g,v,d=t(u),y=i.invert(r[0],r[1]),m={point:o,lineStart:l,lineEnd:c,polygonStart:function(){m.point=f,m.lineStart=s,m.lineEnd=h,p=[],g=[]},polygonEnd:function(){m.point=o,m.lineStart=l,m.lineEnd=c,p=ao.merge(p);var n=Ot(y,g);p.length?(b||(u.polygonStart(),b=!0),Lt(p,Ut,n,e,u)):n&&(b||(u.polygonStart(),b=!0),u.lineStart(),e(null,null,1,u),u.lineEnd()),b&&(u.polygonEnd(),b=!1),p=g=null},sphere:function(){u.polygonStart(),u.lineStart(),e(null,null,1,u),u.lineEnd(),u.polygonEnd()}},M=Pt(),x=t(M),b=!1;return m}}function Dt(n){return n.length>1}function Pt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:b,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Ut(n,t){return((n=n.x)[0]<0?n[1]-Ho-Do:Ho-n[1])-((t=t.x)[0]<0?t[1]-Ho-Do:Ho-t[1])}function jt(n){var t,e=NaN,r=NaN,i=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(u,o){var a=u>0?Uo:-Uo,l=mo(u-e);mo(l-Uo)<Do?(n.point(e,r=(r+o)/2>0?Ho:-Ho),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(a,r),n.point(u,r),t=0):i!==a&&l>=Uo&&(mo(e-i)<Do&&(e-=i*Do),mo(u-a)<Do&&(u-=a*Do),r=Ft(e,r,u,o),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=u,r=o),i=a},lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}}function Ft(n,t,e,r){var i,u,o=Math.sin(n-e);return mo(o)>Do?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*o)):(t+r)/2}function Ht(n,t,e,r){var i;if(null==n)i=e*Ho,r.point(-Uo,i),r.point(0,i),r.point(Uo,i),r.point(Uo,0),r.point(Uo,-i),r.point(0,-i),r.point(-Uo,-i),r.point(-Uo,0),r.point(-Uo,i);else if(mo(n[0]-t[0])>Do){var u=n[0]<t[0]?Uo:-Uo;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)}else r.point(t[0],t[1])}function Ot(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,o=0;wa.reset();for(var a=0,l=t.length;a<l;++a){var c=t[a],f=c.length;if(f)for(var s=c[0],h=s[0],p=s[1]/2+Uo/4,g=Math.sin(p),v=Math.cos(p),d=1;;){d===f&&(d=0),n=c[d];var y=n[0],m=n[1]/2+Uo/4,M=Math.sin(m),x=Math.cos(m),b=y-h,_=b>=0?1:-1,w=_*b,S=w>Uo,k=g*M;if(wa.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),u+=S?b+_*jo:b,S^h>=e^y>=e){var N=mt(dt(s),dt(n));bt(N);var E=mt(i,N);bt(E);var A=(S^b>=0?-1:1)*tn(E[2]);(r>A||r===A&&(N[0]||N[1]))&&(o+=S^b>=0?1:-1)}if(!d++)break;h=y,g=M,v=x,s=n}}return(u<-Do||u<Do&&wa<-Do)^1&o}function It(n){function t(n,t){return Math.cos(n)*Math.cos(t)>u}function e(n){var e,u,l,c,f;return{lineStart:function(){c=l=!1,f=1},point:function(s,h){var p,g=[s,h],v=t(s,h),d=o?v?0:i(s,h):v?i(s+(s<0?Uo:-Uo),h):0;if(!e&&(c=l=v)&&n.lineStart(),v!==l&&(p=r(e,g),(wt(e,p)||wt(g,p))&&(g[0]+=Do,g[1]+=Do,v=t(g[0],g[1]))),v!==l)f=0,v?(n.lineStart(),p=r(g,e),n.point(p[0],p[1])):(p=r(e,g),n.point(p[0],p[1]),n.lineEnd()),e=p;else if(a&&e&&o^v){var y;d&u||!(y=r(g,e,!0))||(f=0,o?(n.lineStart(),n.point(y[0][0],y[0][1]),n.point(y[1][0],y[1][1]),n.lineEnd()):(n.point(y[1][0],y[1][1]),n.lineEnd(),n.lineStart(),n.point(y[0][0],y[0][1])))}!v||e&&wt(e,g)||n.point(g[0],g[1]),e=g,l=v,u=d},lineEnd:function(){l&&n.lineEnd(),e=null},clean:function(){return f|(c&&l)<<1}}}function r(n,t,e){var r=dt(n),i=dt(t),o=[1,0,0],a=mt(r,i),l=yt(a,a),c=a[0],f=l-c*c;if(!f)return!e&&n;var s=u*l/f,h=-u*c/f,p=mt(o,a),g=xt(o,s),v=xt(a,h);Mt(g,v);var d=p,y=yt(g,d),m=yt(d,d),M=y*y-m*(yt(g,g)-1);if(!(M<0)){var x=Math.sqrt(M),b=xt(d,(-y-x)/m);if(Mt(b,g),b=_t(b),!e)return b;var _,w=n[0],S=t[0],k=n[1],N=t[1];S<w&&(_=w,w=S,S=_);var E=S-w,A=mo(E-Uo)<Do,C=A||E<Do;if(!A&&N<k&&(_=k,k=N,N=_),C?A?k+N>0^b[1]<(mo(b[0]-w)<Do?k:N):k<=b[1]&&b[1]<=N:E>Uo^(w<=b[0]&&b[0]<=S)){var z=xt(d,(-y+x)/m);return Mt(z,g),[b,_t(z)]}}}function i(t,e){var r=o?n:Uo-n,i=0;return t<-r?i|=1:t>r&&(i|=2),e<-r?i|=4:e>r&&(i|=8),i}var u=Math.cos(n),o=u>0,a=mo(u)>Do,l=ve(n,6*Oo);return Rt(t,e,l,o?[0,-n]:[-Uo,n-Uo])}function Yt(n,t,e,r){return function(i){var u,o=i.a,a=i.b,l=o.x,c=o.y,f=a.x,s=a.y,h=0,p=1,g=f-l,v=s-c;if(u=n-l,g||!(u>0)){if(u/=g,g<0){if(u<h)return;u<p&&(p=u)}else if(g>0){if(u>p)return;u>h&&(h=u)}if(u=e-l,g||!(u<0)){if(u/=g,g<0){if(u>p)return;u>h&&(h=u)}else if(g>0){if(u<h)return;u<p&&(p=u)}if(u=t-c,v||!(u>0)){if(u/=v,v<0){if(u<h)return;u<p&&(p=u)}else if(v>0){if(u>p)return;u>h&&(h=u)}if(u=r-c,v||!(u<0)){if(u/=v,v<0){if(u>p)return;u>h&&(h=u)}else if(v>0){if(u<h)return;u<p&&(p=u)}return h>0&&(i.a={x:l+h*g,y:c+h*v}),p<1&&(i.b={x:l+p*g,y:c+p*v}),i}}}}}}function Zt(n,t,e,r){function i(r,i){return mo(r[0]-n)<Do?i>0?0:3:mo(r[0]-e)<Do?i>0?2:1:mo(r[1]-t)<Do?i>0?1:0:i>0?3:2}function u(n,t){return o(n.x,t.x)}function o(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(a){function l(n){for(var t=0,e=d.length,r=n[1],i=0;i<e;++i)for(var u,o=1,a=d[i],l=a.length,c=a[0];o<l;++o)u=a[o],c[1]<=r?u[1]>r&&Q(c,u,n)>0&&++t:u[1]<=r&&Q(c,u,n)<0&&--t,c=u;return 0!==t}function c(u,a,l,c){var f=0,s=0;if(null==u||(f=i(u,l))!==(s=i(a,l))||o(u,a)<0^l>0){do c.point(0===f||3===f?n:e,f>1?r:t);while((f=(f+l+4)%4)!==s)}else c.point(a[0],a[1])}function f(i,u){return n<=i&&i<=e&&t<=u&&u<=r}function s(n,t){f(n,t)&&a.point(n,t)}function h(){C.point=g,d&&d.push(y=[]),S=!0,w=!1,b=_=NaN}function p(){v&&(g(m,M),x&&w&&E.rejoin(),v.push(E.buffer())),C.point=s,w&&a.lineEnd()}function g(n,t){n=Math.max(-ja,Math.min(ja,n)),t=Math.max(-ja,Math.min(ja,t));var e=f(n,t);if(d&&y.push([n,t]),S)m=n,M=t,x=e,S=!1,e&&(a.lineStart(),a.point(n,t));else if(e&&w)a.point(n,t);else{var r={a:{x:b,y:_},b:{x:n,y:t}};A(r)?(w||(a.lineStart(),a.point(r.a.x,r.a.y)),a.point(r.b.x,r.b.y),e||a.lineEnd(),k=!1):e&&(a.lineStart(),a.point(n,t),k=!1)}b=n,_=t,w=e}var v,d,y,m,M,x,b,_,w,S,k,N=a,E=Pt(),A=Yt(n,t,e,r),C={point:s,lineStart:h,lineEnd:p,polygonStart:function(){a=E,v=[],d=[],k=!0},polygonEnd:function(){a=N,v=ao.merge(v);var t=l([n,r]),e=k&&t,i=v.length;(e||i)&&(a.polygonStart(),e&&(a.lineStart(),c(null,null,1,a),a.lineEnd()),i&&Lt(v,u,t,c,a),a.polygonEnd()),v=d=y=null}};return C}}function Vt(n){var t=0,e=Uo/3,r=ae(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*Uo/180,e=n[1]*Uo/180):[t/Uo*180,e/Uo*180]},i}function Xt(n,t){function e(n,t){var e=Math.sqrt(u-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),o-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,u=1+r*(2*i-r),o=Math.sqrt(u)/i;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/i,tn((u-(n*n+e*e)*i*i)/(2*i))]},e}function $t(){function n(n,t){Ha+=i*n-r*t,r=n,i=t}var t,e,r,i;Va.point=function(u,o){Va.point=n,t=r=u,e=i=o},Va.lineEnd=function(){n(t,e)}}function Bt(n,t){n<Oa&&(Oa=n),n>Ya&&(Ya=n),t<Ia&&(Ia=t),t>Za&&(Za=t)}function Wt(){function n(n,t){o.push("M",n,",",t,u)}function t(n,t){o.push("M",n,",",t),a.point=e}function e(n,t){o.push("L",n,",",t)}function r(){a.point=n}function i(){o.push("Z")}var u=Jt(4.5),o=[],a={point:n,lineStart:function(){a.point=t},lineEnd:r,polygonStart:function(){a.lineEnd=i},polygonEnd:function(){a.lineEnd=r,a.point=n},pointRadius:function(n){return u=Jt(n),a},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return a}function Jt(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function Gt(n,t){Ea+=n,Aa+=t,++Ca}function Kt(){function n(n,r){var i=n-t,u=r-e,o=Math.sqrt(i*i+u*u);za+=o*(t+n)/2,La+=o*(e+r)/2,qa+=o,Gt(t=n,e=r)}var t,e;$a.point=function(r,i){$a.point=n,Gt(t=r,e=i)}}function Qt(){$a.point=Gt}function ne(){function n(n,t){var e=n-r,u=t-i,o=Math.sqrt(e*e+u*u);za+=o*(r+n)/2,La+=o*(i+t)/2,qa+=o,o=i*n-r*t,Ta+=o*(r+n),Ra+=o*(i+t),Da+=3*o,Gt(r=n,i=t)}var t,e,r,i;$a.point=function(u,o){$a.point=n,Gt(t=r=u,e=i=o)},$a.lineEnd=function(){n(t,e)}}function te(n){function t(t,e){n.moveTo(t+o,e),n.arc(t,e,o,0,jo)}function e(t,e){n.moveTo(t,e),a.point=r}function r(t,e){n.lineTo(t,e)}function i(){a.point=t}function u(){n.closePath()}var o=4.5,a={point:t,lineStart:function(){a.point=e},lineEnd:i,polygonStart:function(){a.lineEnd=u},polygonEnd:function(){a.lineEnd=i,a.point=t},pointRadius:function(n){return o=n,a},result:b};return a}function ee(n){function t(n){return(a?r:e)(n)}function e(t){return ue(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){M=NaN,S.point=u,t.lineStart()}function u(e,r){var u=dt([e,r]),o=n(e,r);i(M,x,m,b,_,w,M=o[0],x=o[1],m=e,b=u[0],_=u[1],w=u[2],a,t),t.point(M,x)}function o(){S.point=e,
t.lineEnd()}function l(){r(),S.point=c,S.lineEnd=f}function c(n,t){u(s=n,h=t),p=M,g=x,v=b,d=_,y=w,S.point=u}function f(){i(M,x,m,b,_,w,p,g,s,v,d,y,a,t),S.lineEnd=o,o()}var s,h,p,g,v,d,y,m,M,x,b,_,w,S={point:e,lineStart:r,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=l},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function i(t,e,r,a,l,c,f,s,h,p,g,v,d,y){var m=f-t,M=s-e,x=m*m+M*M;if(x>4*u&&d--){var b=a+p,_=l+g,w=c+v,S=Math.sqrt(b*b+_*_+w*w),k=Math.asin(w/=S),N=mo(mo(w)-1)<Do||mo(r-h)<Do?(r+h)/2:Math.atan2(_,b),E=n(N,k),A=E[0],C=E[1],z=A-t,L=C-e,q=M*z-m*L;(q*q/x>u||mo((m*z+M*L)/x-.5)>.3||a*p+l*g+c*v<o)&&(i(t,e,r,a,l,c,A,C,N,b/=S,_/=S,w,d,y),y.point(A,C),i(A,C,N,b,_,w,f,s,h,p,g,v,d,y))}}var u=.5,o=Math.cos(30*Oo),a=16;return t.precision=function(n){return arguments.length?(a=(u=n*n)>0&&16,t):Math.sqrt(u)},t}function re(n){var t=ee(function(t,e){return n([t*Io,e*Io])});return function(n){return le(t(n))}}function ie(n){this.stream=n}function ue(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function oe(n){return ae(function(){return n})()}function ae(n){function t(n){return n=a(n[0]*Oo,n[1]*Oo),[n[0]*h+l,c-n[1]*h]}function e(n){return n=a.invert((n[0]-l)/h,(c-n[1])/h),n&&[n[0]*Io,n[1]*Io]}function r(){a=Ct(o=se(y,M,x),u);var n=u(v,d);return l=p-n[0]*h,c=g+n[1]*h,i()}function i(){return f&&(f.valid=!1,f=null),t}var u,o,a,l,c,f,s=ee(function(n,t){return n=u(n,t),[n[0]*h+l,c-n[1]*h]}),h=150,p=480,g=250,v=0,d=0,y=0,M=0,x=0,b=Ua,_=m,w=null,S=null;return t.stream=function(n){return f&&(f.valid=!1),f=le(b(o,s(_(n)))),f.valid=!0,f},t.clipAngle=function(n){return arguments.length?(b=null==n?(w=n,Ua):It((w=+n)*Oo),i()):w},t.clipExtent=function(n){return arguments.length?(S=n,_=n?Zt(n[0][0],n[0][1],n[1][0],n[1][1]):m,i()):S},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(p=+n[0],g=+n[1],r()):[p,g]},t.center=function(n){return arguments.length?(v=n[0]%360*Oo,d=n[1]%360*Oo,r()):[v*Io,d*Io]},t.rotate=function(n){return arguments.length?(y=n[0]%360*Oo,M=n[1]%360*Oo,x=n.length>2?n[2]%360*Oo:0,r()):[y*Io,M*Io,x*Io]},ao.rebind(t,s,"precision"),function(){return u=n.apply(this,arguments),t.invert=u.invert&&e,r()}}function le(n){return ue(n,function(t,e){n.point(t*Oo,e*Oo)})}function ce(n,t){return[n,t]}function fe(n,t){return[n>Uo?n-jo:n<-Uo?n+jo:n,t]}function se(n,t,e){return n?t||e?Ct(pe(n),ge(t,e)):pe(n):t||e?ge(t,e):fe}function he(n){return function(t,e){return t+=n,[t>Uo?t-jo:t<-Uo?t+jo:t,e]}}function pe(n){var t=he(n);return t.invert=he(-n),t}function ge(n,t){function e(n,t){var e=Math.cos(t),a=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),f=c*r+a*i;return[Math.atan2(l*u-f*o,a*r-c*i),tn(f*u+l*o)]}var r=Math.cos(n),i=Math.sin(n),u=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),a=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),f=c*u-l*o;return[Math.atan2(l*u+c*o,a*r+f*i),tn(f*r-a*i)]},e}function ve(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,u,o,a){var l=o*t;null!=i?(i=de(e,i),u=de(e,u),(o>0?i<u:i>u)&&(i+=o*jo)):(i=n+o*jo,u=n-.5*l);for(var c,f=i;o>0?f>u:f<u;f-=l)a.point((c=_t([e,-r*Math.cos(f),-r*Math.sin(f)]))[0],c[1])}}function de(n,t){var e=dt(t);e[0]-=n,bt(e);var r=nn(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Do)%(2*Math.PI)}function ye(n,t,e){var r=ao.range(n,t-Do,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function me(n,t,e){var r=ao.range(n,t-Do,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function Me(n){return n.source}function xe(n){return n.target}function be(n,t,e,r){var i=Math.cos(t),u=Math.sin(t),o=Math.cos(r),a=Math.sin(r),l=i*Math.cos(n),c=i*Math.sin(n),f=o*Math.cos(e),s=o*Math.sin(e),h=2*Math.asin(Math.sqrt(on(r-t)+i*o*on(e-n))),p=1/Math.sin(h),g=h?function(n){var t=Math.sin(n*=h)*p,e=Math.sin(h-n)*p,r=e*l+t*f,i=e*c+t*s,o=e*u+t*a;return[Math.atan2(i,r)*Io,Math.atan2(o,Math.sqrt(r*r+i*i))*Io]}:function(){return[n*Io,t*Io]};return g.distance=h,g}function _e(){function n(n,i){var u=Math.sin(i*=Oo),o=Math.cos(i),a=mo((n*=Oo)-t),l=Math.cos(a);Ba+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=r*u-e*o*l)*a),e*u+r*o*l),t=n,e=u,r=o}var t,e,r;Wa.point=function(i,u){t=i*Oo,e=Math.sin(u*=Oo),r=Math.cos(u),Wa.point=n},Wa.lineEnd=function(){Wa.point=Wa.lineEnd=b}}function we(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i);return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),o=Math.cos(i);return[Math.atan2(n*u,r*o),Math.asin(r&&e*u/r)]},e}function Se(n,t){function e(n,t){o>0?t<-Ho+Do&&(t=-Ho+Do):t>Ho-Do&&(t=Ho-Do);var e=o/Math.pow(i(t),u);return[e*Math.sin(u*n),o-e*Math.cos(u*n)]}var r=Math.cos(n),i=function(n){return Math.tan(Uo/4+n/2)},u=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),o=r*Math.pow(i(n),u)/u;return u?(e.invert=function(n,t){var e=o-t,r=K(u)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/u,2*Math.atan(Math.pow(o/r,1/u))-Ho]},e):Ne}function ke(n,t){function e(n,t){var e=u-t;return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),u=r/i+n;return mo(i)<Do?ce:(e.invert=function(n,t){var e=u-t;return[Math.atan2(n,e)/i,u-K(i)*Math.sqrt(n*n+e*e)]},e)}function Ne(n,t){return[n,Math.log(Math.tan(Uo/4+t/2))]}function Ee(n){var t,e=oe(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=u.apply(e,arguments);if(o===e){if(t=null==n){var a=Uo*r(),l=i();u([[l[0]-a,l[1]-a],[l[0]+a,l[1]+a]])}}else t&&(o=null);return o},e.clipExtent(null)}function Ae(n,t){return[Math.log(Math.tan(Uo/4+t/2)),-n]}function Ce(n){return n[0]}function ze(n){return n[1]}function Le(n){for(var t=n.length,e=[0,1],r=2,i=2;i<t;i++){for(;r>1&&Q(n[e[r-2]],n[e[r-1]],n[i])<=0;)--r;e[r++]=i}return e.slice(0,r)}function qe(n,t){return n[0]-t[0]||n[1]-t[1]}function Te(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function Re(n,t,e,r){var i=n[0],u=e[0],o=t[0]-i,a=r[0]-u,l=n[1],c=e[1],f=t[1]-l,s=r[1]-c,h=(a*(l-c)-s*(i-u))/(s*o-a*f);return[i+h*o,l+h*f]}function De(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Pe(){rr(this),this.edge=this.site=this.circle=null}function Ue(n){var t=al.pop()||new Pe;return t.site=n,t}function je(n){Be(n),il.remove(n),al.push(n),rr(n)}function Fe(n){var t=n.circle,e=t.x,r=t.cy,i={x:e,y:r},u=n.P,o=n.N,a=[n];je(n);for(var l=u;l.circle&&mo(e-l.circle.x)<Do&&mo(r-l.circle.cy)<Do;)u=l.P,a.unshift(l),je(l),l=u;a.unshift(l),Be(l);for(var c=o;c.circle&&mo(e-c.circle.x)<Do&&mo(r-c.circle.cy)<Do;)o=c.N,a.push(c),je(c),c=o;a.push(c),Be(c);var f,s=a.length;for(f=1;f<s;++f)c=a[f],l=a[f-1],nr(c.edge,l.site,c.site,i);l=a[0],c=a[s-1],c.edge=Ke(l.site,c.site,null,i),$e(l),$e(c)}function He(n){for(var t,e,r,i,u=n.x,o=n.y,a=il._;a;)if(r=Oe(a,o)-u,r>Do)a=a.L;else{if(i=u-Ie(a,o),!(i>Do)){r>-Do?(t=a.P,e=a):i>-Do?(t=a,e=a.N):t=e=a;break}if(!a.R){t=a;break}a=a.R}var l=Ue(n);if(il.insert(t,l),t||e){if(t===e)return Be(t),e=Ue(t.site),il.insert(l,e),l.edge=e.edge=Ke(t.site,l.site),$e(t),void $e(e);if(!e)return void(l.edge=Ke(t.site,l.site));Be(t),Be(e);var c=t.site,f=c.x,s=c.y,h=n.x-f,p=n.y-s,g=e.site,v=g.x-f,d=g.y-s,y=2*(h*d-p*v),m=h*h+p*p,M=v*v+d*d,x={x:(d*m-p*M)/y+f,y:(h*M-v*m)/y+s};nr(e.edge,c,g,x),l.edge=Ke(c,n,null,x),e.edge=Ke(n,g,null,x),$e(t),$e(e)}}function Oe(n,t){var e=n.site,r=e.x,i=e.y,u=i-t;if(!u)return r;var o=n.P;if(!o)return-(1/0);e=o.site;var a=e.x,l=e.y,c=l-t;if(!c)return a;var f=a-r,s=1/u-1/c,h=f/c;return s?(-h+Math.sqrt(h*h-2*s*(f*f/(-2*c)-l+c/2+i-u/2)))/s+r:(r+a)/2}function Ie(n,t){var e=n.N;if(e)return Oe(e,t);var r=n.site;return r.y===t?r.x:1/0}function Ye(n){this.site=n,this.edges=[]}function Ze(n){for(var t,e,r,i,u,o,a,l,c,f,s=n[0][0],h=n[1][0],p=n[0][1],g=n[1][1],v=rl,d=v.length;d--;)if(u=v[d],u&&u.prepare())for(a=u.edges,l=a.length,o=0;o<l;)f=a[o].end(),r=f.x,i=f.y,c=a[++o%l].start(),t=c.x,e=c.y,(mo(r-t)>Do||mo(i-e)>Do)&&(a.splice(o,0,new tr(Qe(u.site,f,mo(r-s)<Do&&g-i>Do?{x:s,y:mo(t-s)<Do?e:g}:mo(i-g)<Do&&h-r>Do?{x:mo(e-g)<Do?t:h,y:g}:mo(r-h)<Do&&i-p>Do?{x:h,y:mo(t-h)<Do?e:p}:mo(i-p)<Do&&r-s>Do?{x:mo(e-p)<Do?t:s,y:p}:null),u.site,null)),++l)}function Ve(n,t){return t.angle-n.angle}function Xe(){rr(this),this.x=this.y=this.arc=this.site=this.cy=null}function $e(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,i=n.site,u=e.site;if(r!==u){var o=i.x,a=i.y,l=r.x-o,c=r.y-a,f=u.x-o,s=u.y-a,h=2*(l*s-c*f);if(!(h>=-Po)){var p=l*l+c*c,g=f*f+s*s,v=(s*p-c*g)/h,d=(l*g-f*p)/h,s=d+a,y=ll.pop()||new Xe;y.arc=n,y.site=i,y.x=v+o,y.y=s+Math.sqrt(v*v+d*d),y.cy=s,n.circle=y;for(var m=null,M=ol._;M;)if(y.y<M.y||y.y===M.y&&y.x<=M.x){if(!M.L){m=M.P;break}M=M.L}else{if(!M.R){m=M;break}M=M.R}ol.insert(m,y),m||(ul=y)}}}}function Be(n){var t=n.circle;t&&(t.P||(ul=t.N),ol.remove(t),ll.push(t),rr(t),n.circle=null)}function We(n){for(var t,e=el,r=Yt(n[0][0],n[0][1],n[1][0],n[1][1]),i=e.length;i--;)t=e[i],(!Je(t,n)||!r(t)||mo(t.a.x-t.b.x)<Do&&mo(t.a.y-t.b.y)<Do)&&(t.a=t.b=null,e.splice(i,1))}function Je(n,t){var e=n.b;if(e)return!0;var r,i,u=n.a,o=t[0][0],a=t[1][0],l=t[0][1],c=t[1][1],f=n.l,s=n.r,h=f.x,p=f.y,g=s.x,v=s.y,d=(h+g)/2,y=(p+v)/2;if(v===p){if(d<o||d>=a)return;if(h>g){if(u){if(u.y>=c)return}else u={x:d,y:l};e={x:d,y:c}}else{if(u){if(u.y<l)return}else u={x:d,y:c};e={x:d,y:l}}}else if(r=(h-g)/(v-p),i=y-r*d,r<-1||r>1)if(h>g){if(u){if(u.y>=c)return}else u={x:(l-i)/r,y:l};e={x:(c-i)/r,y:c}}else{if(u){if(u.y<l)return}else u={x:(c-i)/r,y:c};e={x:(l-i)/r,y:l}}else if(p<v){if(u){if(u.x>=a)return}else u={x:o,y:r*o+i};e={x:a,y:r*a+i}}else{if(u){if(u.x<o)return}else u={x:a,y:r*a+i};e={x:o,y:r*o+i}}return n.a=u,n.b=e,!0}function Ge(n,t){this.l=n,this.r=t,this.a=this.b=null}function Ke(n,t,e,r){var i=new Ge(n,t);return el.push(i),e&&nr(i,n,t,e),r&&nr(i,t,n,r),rl[n.i].edges.push(new tr(i,n,t)),rl[t.i].edges.push(new tr(i,t,n)),i}function Qe(n,t,e){var r=new Ge(n,null);return r.a=t,r.b=e,el.push(r),r}function nr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function tr(n,t,e){var r=n.a,i=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(i.x-r.x,r.y-i.y):Math.atan2(r.x-i.x,i.y-r.y)}function er(){this._=null}function rr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function ir(n,t){var e=t,r=t.R,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function ur(n,t){var e=t,r=t.L,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function or(n){for(;n.L;)n=n.L;return n}function ar(n,t){var e,r,i,u=n.sort(lr).pop();for(el=[],rl=new Array(n.length),il=new er,ol=new er;;)if(i=ul,u&&(!i||u.y<i.y||u.y===i.y&&u.x<i.x))u.x===e&&u.y===r||(rl[u.i]=new Ye(u),He(u),e=u.x,r=u.y),u=n.pop();else{if(!i)break;Fe(i.arc)}t&&(We(t),Ze(t));var o={cells:rl,edges:el};return il=ol=el=rl=null,o}function lr(n,t){return t.y-n.y||t.x-n.x}function cr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function fr(n){return n.x}function sr(n){return n.y}function hr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function pr(n,t,e,r,i,u){if(!n(t,e,r,i,u)){var o=.5*(e+i),a=.5*(r+u),l=t.nodes;l[0]&&pr(n,l[0],e,r,o,a),l[1]&&pr(n,l[1],o,r,i,a),l[2]&&pr(n,l[2],e,a,o,u),l[3]&&pr(n,l[3],o,a,i,u)}}function gr(n,t,e,r,i,u,o){var a,l=1/0;return function n(c,f,s,h,p){if(!(f>u||s>o||h<r||p<i)){if(g=c.point){var g,v=t-c.x,d=e-c.y,y=v*v+d*d;if(y<l){var m=Math.sqrt(l=y);r=t-m,i=e-m,u=t+m,o=e+m,a=g}}for(var M=c.nodes,x=.5*(f+h),b=.5*(s+p),_=t>=x,w=e>=b,S=w<<1|_,k=S+4;S<k;++S)if(c=M[3&S])switch(3&S){case 0:n(c,f,s,x,b);break;case 1:n(c,x,s,h,b);break;case 2:n(c,f,b,x,p);break;case 3:n(c,x,b,h,p)}}}(n,r,i,u,o),a}function vr(n,t){n=ao.rgb(n),t=ao.rgb(t);var e=n.r,r=n.g,i=n.b,u=t.r-e,o=t.g-r,a=t.b-i;return function(n){return"#"+bn(Math.round(e+u*n))+bn(Math.round(r+o*n))+bn(Math.round(i+a*n))}}function dr(n,t){var e,r={},i={};for(e in n)e in t?r[e]=Mr(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function yr(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function mr(n,t){var e,r,i,u=fl.lastIndex=sl.lastIndex=0,o=-1,a=[],l=[];for(n+="",t+="";(e=fl.exec(n))&&(r=sl.exec(t));)(i=r.index)>u&&(i=t.slice(u,i),a[o]?a[o]+=i:a[++o]=i),(e=e[0])===(r=r[0])?a[o]?a[o]+=r:a[++o]=r:(a[++o]=null,l.push({i:o,x:yr(e,r)})),u=sl.lastIndex;return u<t.length&&(i=t.slice(u),a[o]?a[o]+=i:a[++o]=i),a.length<2?l[0]?(t=l[0].x,function(n){return t(n)+""}):function(){return t}:(t=l.length,function(n){for(var e,r=0;r<t;++r)a[(e=l[r]).i]=e.x(n);return a.join("")})}function Mr(n,t){for(var e,r=ao.interpolators.length;--r>=0&&!(e=ao.interpolators[r](n,t)););return e}function xr(n,t){var e,r=[],i=[],u=n.length,o=t.length,a=Math.min(n.length,t.length);for(e=0;e<a;++e)r.push(Mr(n[e],t[e]));for(;e<u;++e)i[e]=n[e];for(;e<o;++e)i[e]=t[e];return function(n){for(e=0;e<a;++e)i[e]=r[e](n);return i}}function br(n){return function(t){return t<=0?0:t>=1?1:n(t)}}function _r(n){return function(t){return 1-n(1-t)}}function wr(n){return function(t){return.5*(t<.5?n(2*t):2-n(2-2*t))}}function Sr(n){return n*n}function kr(n){return n*n*n}function Nr(n){if(n<=0)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(n<.5?e:3*(n-t)+e-.75)}function Er(n){return function(t){return Math.pow(t,n)}}function Ar(n){return 1-Math.cos(n*Ho)}function Cr(n){return Math.pow(2,10*(n-1))}function zr(n){return 1-Math.sqrt(1-n*n)}function Lr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/jo*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*jo/t)}}function qr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Tr(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Rr(n,t){n=ao.hcl(n),t=ao.hcl(t);var e=n.h,r=n.c,i=n.l,u=t.h-e,o=t.c-r,a=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:u<-180&&(u+=360),function(n){return sn(e+u*n,r+o*n,i+a*n)+""}}function Dr(n,t){n=ao.hsl(n),t=ao.hsl(t);var e=n.h,r=n.s,i=n.l,u=t.h-e,o=t.s-r,a=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:u<-180&&(u+=360),function(n){return cn(e+u*n,r+o*n,i+a*n)+""}}function Pr(n,t){n=ao.lab(n),t=ao.lab(t);var e=n.l,r=n.a,i=n.b,u=t.l-e,o=t.a-r,a=t.b-i;return function(n){return pn(e+u*n,r+o*n,i+a*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function jr(n){var t=[n.a,n.b],e=[n.c,n.d],r=Hr(t),i=Fr(t,e),u=Hr(Or(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Io,this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*Io:0}function Fr(n,t){return n[0]*t[0]+n[1]*t[1]}function Hr(n){var t=Math.sqrt(Fr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Or(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Ir(n){return n.length?n.pop()+",":""}function Yr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push("translate(",null,",",null,")");r.push({i:i-4,x:yr(n[0],t[0])},{i:i-2,x:yr(n[1],t[1])})}else(t[0]||t[1])&&e.push("translate("+t+")")}function Zr(n,t,e,r){n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({i:e.push(Ir(e)+"rotate(",null,")")-2,x:yr(n,t)})):t&&e.push(Ir(e)+"rotate("+t+")")}function Vr(n,t,e,r){n!==t?r.push({i:e.push(Ir(e)+"skewX(",null,")")-2,x:yr(n,t)}):t&&e.push(Ir(e)+"skewX("+t+")")}function Xr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push(Ir(e)+"scale(",null,",",null,")");r.push({i:i-4,x:yr(n[0],t[0])},{i:i-2,x:yr(n[1],t[1])})}else 1===t[0]&&1===t[1]||e.push(Ir(e)+"scale("+t+")")}function $r(n,t){var e=[],r=[];return n=ao.transform(n),t=ao.transform(t),Yr(n.translate,t.translate,e,r),Zr(n.rotate,t.rotate,e,r),Vr(n.skew,t.skew,e,r),Xr(n.scale,t.scale,e,r),n=t=null,function(n){for(var t,i=-1,u=r.length;++i<u;)e[(t=r[i]).i]=t.x(n);return e.join("")}}function Br(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function Wr(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),i=e.pop(),u=r.pop(),o=null;i===u;)o=i,i=e.pop(),u=r.pop();return o}function Qr(n){n.fixed|=2}function ni(n){n.fixed&=-7}function ti(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ei(n){n.fixed&=-5}function ri(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var u,o=n.nodes,a=o.length,l=-1;++l<a;)u=o[l],null!=u&&(ri(u,t,e),n.charge+=u.charge,r+=u.charge*u.cx,i+=u.charge*u.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var c=t*e[n.point.index];n.charge+=n.pointCharge=c,r+=c*n.point.x,i+=c*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function ii(n,t){return ao.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=fi,n}function ui(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(i=n.children)&&(r=i.length))for(var r,i;--r>=0;)e.push(i[r])}function oi(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(u=n.children)&&(i=u.length))for(var i,u,o=-1;++o<i;)e.push(u[o]);for(;null!=(n=r.pop());)t(n)}function ai(n){return n.children}function li(n){return n.value}function ci(n,t){return t.value-n.value}function fi(n){return ao.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function si(n){return n.x}function hi(n){return n.y}function pi(n,t,e){n.y0=t,n.y=e}function gi(n){return ao.range(n.length)}function vi(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function di(n){for(var t,e=1,r=0,i=n[0][1],u=n.length;e<u;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function yi(n){return n.reduce(mi,0)}function mi(n,t){return n+t[1]}function Mi(n,t){return xi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function xi(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r;return u}function bi(n){return[ao.min(n),ao.max(n)]}function _i(n,t){return n.value-t.value}function wi(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Si(n,t){n._pack_next=t,t._pack_prev=n}function ki(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Ni(n){function t(n){f=Math.min(n.x-n.r,f),s=Math.max(n.x+n.r,s),h=Math.min(n.y-n.r,h),p=Math.max(n.y+n.r,p)}if((e=n.children)&&(c=e.length)){var e,r,i,u,o,a,l,c,f=1/0,s=-(1/0),h=1/0,p=-(1/0);if(e.forEach(Ei),r=e[0],r.x=-r.r,r.y=0,t(r),c>1&&(i=e[1],i.x=i.r,i.y=0,t(i),c>2))for(u=e[2],zi(r,i,u),t(u),wi(r,u),r._pack_prev=u,wi(u,i),i=r._pack_next,o=3;o<c;o++){zi(r,i,u=e[o]);var g=0,v=1,d=1;for(a=i._pack_next;a!==i;a=a._pack_next,v++)if(ki(a,u)){g=1;break}if(1==g)for(l=r._pack_prev;l!==a._pack_prev&&!ki(l,u);l=l._pack_prev,d++);g?(v<d||v==d&&i.r<r.r?Si(r,i=a):Si(r=l,i),o--):(wi(r,u),i=u,t(u))}var y=(f+s)/2,m=(h+p)/2,M=0;for(o=0;o<c;o++)u=e[o],u.x-=y,u.y-=m,M=Math.max(M,u.r+Math.sqrt(u.x*u.x+u.y*u.y));n.r=M,e.forEach(Ai)}}function Ei(n){n._pack_next=n._pack_prev=n}function Ai(n){delete n._pack_next,delete n._pack_prev}function Ci(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var u=-1,o=i.length;++u<o;)Ci(i[u],t,e,r)}function zi(n,t,e){var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){var o=t.r+e.r,a=i*i+u*u;o*=o,r*=r;var l=.5+(r-o)/(2*a),c=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a);e.x=n.x+l*i+c*u,e.y=n.y+l*u-c*i}else e.x=n.x+r,e.y=n.y}function Li(n,t){return n.parent==t.parent?1:2}function qi(n){var t=n.children;return t.length?t[0]:n.t}function Ti(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function Ri(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Di(n){for(var t,e=0,r=0,i=n.children,u=i.length;--u>=0;)t=i[u],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Pi(n,t,e){return n.a.parent===t.parent?n.a:e}function Ui(n){return 1+ao.max(n,function(n){return n.y})}function ji(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Fi(n){var t=n.children;return t&&t.length?Fi(t[0]):n}function Hi(n){var t,e=n.children;return e&&(t=e.length)?Hi(e[t-1]):n}function Oi(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Ii(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return i<0&&(e+=i/2,i=0),u<0&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function Yi(n){var t=n[0],e=n[n.length-1];return t<e?[t,e]:[e,t]}function Zi(n){return n.rangeExtent?n.rangeExtent():Yi(n.range())}function Vi(n,t,e,r){var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}function Xi(n,t){var e,r=0,i=n.length-1,u=n[r],o=n[i];return o<u&&(e=r,r=i,i=e,e=u,u=o,o=e),n[r]=t.floor(u),n[i]=t.ceil(o),n}function $i(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:_l}function Bi(n,t,e,r){var i=[],u=[],o=0,a=Math.min(n.length,t.length)-1;for(n[a]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=a;)i.push(e(n[o-1],n[o])),u.push(r(t[o-1],t[o]));return function(t){var e=ao.bisect(n,t,1,a)-1;return u[e](i[e](t))}}function Wi(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Bi:Vi,l=r?Wr:Br;return o=i(n,t,l,e),a=i(t,n,l,Mr),u}function u(n){return o(n)}var o,a;return u.invert=function(n){return a(n)},u.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},u.range=function(n){return arguments.length?(t=n,i()):t},u.rangeRound=function(n){return u.range(n).interpolate(Ur)},u.clamp=function(n){return arguments.length?(r=n,i()):r},u.interpolate=function(n){return arguments.length?(e=n,i()):e},u.ticks=function(t){return Qi(n,t)},u.tickFormat=function(t,e){return nu(n,t,e)},u.nice=function(t){return Gi(n,t),i()},u.copy=function(){return Wi(n,t,e,r)},i()}function Ji(n,t){return ao.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Gi(n,t){return Xi(n,$i(Ki(n,t)[2])),Xi(n,$i(Ki(n,t)[2])),n}function Ki(n,t){null==t&&(t=10);var e=Yi(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i;return u<=.15?i*=10:u<=.35?i*=5:u<=.75&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function Qi(n,t){return ao.range.apply(ao,Ki(n,t))}function nu(n,t,e){var r=Ki(n,t);if(e){var i=fa.exec(e);if(i.shift(),"s"===i[8]){var u=ao.formatPrefix(Math.max(mo(r[0]),mo(r[1])));return i[7]||(i[7]="."+tu(u.scale(r[2]))),i[8]="f",e=ao.format(i.join("")),function(n){return e(u.scale(n))+u.symbol}}i[7]||(i[7]="."+eu(i[8],r)),e=i.join("")}else e=",."+tu(r[2])+"f";return ao.format(e)}function tu(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function eu(n,t){var e=tu(t[2]);return n in wl?Math.abs(e-tu(Math.max(mo(t[0]),mo(t[1]))))+ +("e"!==n):e-2*("%"===n)}function ru(n,t,e,r){function i(n){return(e?Math.log(n<0?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function u(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(i(t))}return o.invert=function(t){return u(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(i)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(i)),o):t},o.nice=function(){var t=Xi(r.map(i),e?Math:kl);return n.domain(t),r=t.map(u),o},o.ticks=function(){var n=Yi(r),o=[],a=n[0],l=n[1],c=Math.floor(i(a)),f=Math.ceil(i(l)),s=t%1?2:t;if(isFinite(f-c)){if(e){for(;c<f;c++)for(var h=1;h<s;h++)o.push(u(c)*h);o.push(u(c))}else for(o.push(u(c));c++<f;)for(var h=s-1;h>0;h--)o.push(u(c)*h);for(c=0;o[c]<a;c++);for(f=o.length;o[f-1]>l;f--);o=o.slice(c,f)}return o},o.tickFormat=function(n,e){if(!arguments.length)return Sl;arguments.length<2?e=Sl:"function"!=typeof e&&(e=ao.format(e));var r=Math.max(1,t*n/o.ticks().length);return function(n){var o=n/u(Math.round(i(n)));return o*t<t-.5&&(o*=t),o<=r?e(n):""}},o.copy=function(){return ru(n.copy(),t,e,r)},Ji(o,n)}function iu(n,t,e){function r(t){return n(i(t))}var i=uu(t),u=uu(1/t);return r.invert=function(t){return u(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return Qi(e,n)},r.tickFormat=function(n,t){return nu(e,n,t)},r.nice=function(n){return r.domain(Gi(e,n))},r.exponent=function(o){return arguments.length?(i=uu(t=o),u=uu(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return iu(n.copy(),t,e)},Ji(r,n)}function uu(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function ou(n,t){function e(e){return u[((i.get(e)||("range"===t.t?i.set(e,n.push(e)):NaN))-1)%u.length]}function r(t,e){return ao.range(n.length).map(function(n){return t+e*n})}var i,u,o;return e.domain=function(r){if(!arguments.length)return n;n=[],i=new c;for(var u,o=-1,a=r.length;++o<a;)i.has(u=r[o])||i.set(u,n.push(u));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(u=n,o=0,t={t:"range",a:arguments},e):u},e.rangePoints=function(i,a){arguments.length<2&&(a=0);var l=i[0],c=i[1],f=n.length<2?(l=(l+c)/2,0):(c-l)/(n.length-1+a);return u=r(l+f*a/2,f),o=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(i,a){arguments.length<2&&(a=0);var l=i[0],c=i[1],f=n.length<2?(l=c=Math.round((l+c)/2),0):(c-l)/(n.length-1+a)|0;return u=r(l+Math.round(f*a/2+(c-l-(n.length-1+a)*f)/2),f),o=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(i,a,l){arguments.length<2&&(a=0),arguments.length<3&&(l=a);var c=i[1]<i[0],f=i[c-0],s=i[1-c],h=(s-f)/(n.length-a+2*l);return u=r(f+h*l,h),c&&u.reverse(),o=h*(1-a),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,a,l){arguments.length<2&&(a=0),arguments.length<3&&(l=a);var c=i[1]<i[0],f=i[c-0],s=i[1-c],h=Math.floor((s-f)/(n.length-a+2*l));return u=r(f+Math.round((s-f-(n.length-a)*h)/2),h),c&&u.reverse(),o=Math.round(h*(1-a)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Yi(t.a[0])},e.copy=function(){return ou(n,t)},e.domain(n)}function au(n,t){function u(){var e=0,r=t.length;for(a=[];++e<r;)a[e-1]=ao.quantile(n,e/r);return o}function o(n){if(!isNaN(n=+n))return t[ao.bisect(a,n)]}var a;return o.domain=function(t){return arguments.length?(n=t.map(r).filter(i).sort(e),u()):n},o.range=function(n){return arguments.length?(t=n,u()):t},o.quantiles=function(){return a},o.invertExtent=function(e){return e=t.indexOf(e),e<0?[NaN,NaN]:[e>0?a[e-1]:n[0],e<a.length?a[e]:n[n.length-1]]},o.copy=function(){return au(n,t)},u()}function lu(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(u*(t-n))))]}function i(){return u=e.length/(t-n),o=e.length-1,r}var u,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=t<0?NaN:t/u+n,[t,t+1/u]},r.copy=function(){return lu(n,t,e)},i()}function cu(n,t){function e(e){if(e<=e)return t[ao.bisect(n,e)]}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return cu(n,t)},e}function fu(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Qi(n,t)},t.tickFormat=function(t,e){return nu(n,t,e)},t.copy=function(){return fu(n)},t}function su(){return 0}function hu(n){return n.innerRadius}function pu(n){return n.outerRadius}function gu(n){return n.startAngle}function vu(n){return n.endAngle}function du(n){return n&&n.padAngle}function yu(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function mu(n,t,e,r,i){var u=n[0]-t[0],o=n[1]-t[1],a=(i?r:-r)/Math.sqrt(u*u+o*o),l=a*o,c=-a*u,f=n[0]+l,s=n[1]+c,h=t[0]+l,p=t[1]+c,g=(f+h)/2,v=(s+p)/2,d=h-f,y=p-s,m=d*d+y*y,M=e-r,x=f*p-h*s,b=(y<0?-1:1)*Math.sqrt(Math.max(0,M*M*m-x*x)),_=(x*y-d*b)/m,w=(-x*d-y*b)/m,S=(x*y+d*b)/m,k=(-x*d+y*b)/m,N=_-g,E=w-v,A=S-g,C=k-v;return N*N+E*E>A*A+C*C&&(_=S,w=k),[[_-l,w-c],[_*e/M,w*e/M]]}function Mu(n){function t(t){function o(){c.push("M",u(n(f),a))}for(var l,c=[],f=[],s=-1,h=t.length,p=En(e),g=En(r);++s<h;)i.call(this,l=t[s],s)?f.push([+p.call(this,l,s),+g.call(this,l,s)]):f.length&&(o(),f=[]);return f.length&&o(),c.length?c.join(""):null}var e=Ce,r=ze,i=zt,u=xu,o=u.key,a=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?u=n:(u=Ll.get(n)||xu).key,t):o},t.tension=function(n){return arguments.length?(a=n,t):a},t}function xu(n){return n.length>1?n.join("L"):n+"Z"}function bu(n){return n.join("L")+"Z"}function _u(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function wu(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function Su(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function ku(n,t){return n.length<4?xu(n):n[1]+Au(n.slice(1,-1),Cu(n,t))}function Nu(n,t){return n.length<3?bu(n):n[0]+Au((n.push(n[0]),n),Cu([n[n.length-2]].concat(n,[n[1]]),t))}function Eu(n,t){return n.length<3?xu(n):n[0]+Au(n,Cu(n,t))}function Au(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return xu(n);var e=n.length!=t.length,r="",i=n[0],u=n[1],o=t[0],a=o,l=1;if(e&&(r+="Q"+(u[0]-2*o[0]/3)+","+(u[1]-2*o[1]/3)+","+u[0]+","+u[1],i=n[1],l=2),t.length>1){a=t[1],u=n[l],l++,r+="C"+(i[0]+o[0])+","+(i[1]+o[1])+","+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1];for(var c=2;c<t.length;c++,l++)u=n[l],a=t[c],r+="S"+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1]}if(e){var f=n[l];r+="Q"+(u[0]+2*a[0]/3)+","+(u[1]+2*a[1]/3)+","+f[0]+","+f[1]}return r}function Cu(n,t){for(var e,r=[],i=(1-t)/2,u=n[0],o=n[1],a=1,l=n.length;++a<l;)e=u,u=o,o=n[a],r.push([i*(o[0]-e[0]),i*(o[1]-e[1])]);return r}function zu(n){if(n.length<3)return xu(n);var t=1,e=n.length,r=n[0],i=r[0],u=r[1],o=[i,i,i,(r=n[1])[0]],a=[u,u,u,r[1]],l=[i,",",u,"L",Ru(Rl,o),",",Ru(Rl,a)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),Du(l,o,a);return n.pop(),l.push("L",r),l.join("")}function Lu(n){if(n.length<4)return xu(n);for(var t,e=[],r=-1,i=n.length,u=[0],o=[0];++r<3;)t=n[r],u.push(t[0]),o.push(t[1]);for(e.push(Ru(Rl,u)+","+Ru(Rl,o)),--r;++r<i;)t=n[r],u.shift(),u.push(t[0]),o.shift(),o.push(t[1]),Du(e,u,o);return e.join("")}function qu(n){for(var t,e,r=-1,i=n.length,u=i+4,o=[],a=[];++r<4;)e=n[r%i],o.push(e[0]),a.push(e[1]);for(t=[Ru(Rl,o),",",Ru(Rl,a)],--r;++r<u;)e=n[r%i],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),Du(t,o,a);return t.join("")}function Tu(n,t){var e=n.length-1;if(e)for(var r,i,u=n[0][0],o=n[0][1],a=n[e][0]-u,l=n[e][1]-o,c=-1;++c<=e;)r=n[c],i=c/e,r[0]=t*r[0]+(1-t)*(u+i*a),r[1]=t*r[1]+(1-t)*(o+i*l);return zu(n)}function Ru(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Du(n,t,e){n.push("C",Ru(ql,t),",",Ru(ql,e),",",Ru(Tl,t),",",Ru(Tl,e),",",Ru(Rl,t),",",Ru(Rl,e))}function Pu(n,t){return(t[1]-n[1])/(t[0]-n[0])}function Uu(n){for(var t=0,e=n.length-1,r=[],i=n[0],u=n[1],o=r[0]=Pu(i,u);++t<e;)r[t]=(o+(o=Pu(i=u,u=n[t+1])))/2;return r[t]=o,r}function ju(n){for(var t,e,r,i,u=[],o=Uu(n),a=-1,l=n.length-1;++a<l;)t=Pu(n[a],n[a+1]),mo(t)<Do?o[a]=o[a+1]=0:(e=o[a]/t,r=o[a+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),o[a]=i*e,o[a+1]=i*r));for(a=-1;++a<=l;)i=(n[Math.min(l,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),u.push([i||0,o[a]*i||0]);return u}function Fu(n){return n.length<3?xu(n):n[0]+Au(n,ju(n))}function Hu(n){for(var t,e,r,i=-1,u=n.length;++i<u;)t=n[i],e=t[0],r=t[1]-Ho,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Ou(n){function t(t){function l(){v.push("M",a(n(y),s),f,c(n(d.reverse()),s),"Z")}for(var h,p,g,v=[],d=[],y=[],m=-1,M=t.length,x=En(e),b=En(i),_=e===r?function(){
return p}:En(r),w=i===u?function(){return g}:En(u);++m<M;)o.call(this,h=t[m],m)?(d.push([p=+x.call(this,h,m),g=+b.call(this,h,m)]),y.push([+_.call(this,h,m),+w.call(this,h,m)])):d.length&&(l(),d=[],y=[]);return d.length&&l(),v.length?v.join(""):null}var e=Ce,r=Ce,i=0,u=ze,o=zt,a=xu,l=a.key,c=a,f="L",s=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=u=n,t):u},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(u=n,t):u},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(l="function"==typeof n?a=n:(a=Ll.get(n)||xu).key,c=a.reverse||a,f=a.closed?"M":"L",t):l},t.tension=function(n){return arguments.length?(s=n,t):s},t}function Iu(n){return n.radius}function Yu(n){return[n.x,n.y]}function Zu(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Ho;return[e*Math.cos(r),e*Math.sin(r)]}}function Vu(){return 64}function Xu(){return"circle"}function $u(n){var t=Math.sqrt(n/Uo);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Bu(n){return function(){var t,e,r;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,r.timer.t=NaN,--t.count?delete t[e]:delete this[n],t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}function Wu(n,t,e){return wo(n,Ol),n.namespace=t,n.id=e,n}function Ju(n,t,e,r){var i=n.id,u=n.namespace;return Y(n,"function"==typeof e?function(n,o,a){n[u][i].tween.set(t,r(e.call(n,n.__data__,o,a)))}:(e=r(e),function(n){n[u][i].tween.set(t,e)}))}function Gu(n){return null==n&&(n=""),function(){this.textContent=n}}function Ku(n){return null==n?"__transition__":"__transition_"+n+"__"}function Qu(n,t,e,r,i){function u(n){var t=v.delay;return f.t=t+l,t<=n?o(n-t):void(f.c=o)}function o(e){var i=g.active,u=g[i];u&&(u.timer.c=null,u.timer.t=NaN,--g.count,delete g[i],u.event&&u.event.interrupt.call(n,n.__data__,u.index));for(var o in g)if(+o<r){var c=g[o];c.timer.c=null,c.timer.t=NaN,--g.count,delete g[o]}f.c=a,qn(function(){return f.c&&a(e||1)&&(f.c=null,f.t=NaN),1},0,l),g.active=r,v.event&&v.event.start.call(n,n.__data__,t),p=[],v.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&p.push(r)}),h=v.ease,s=v.duration}function a(i){for(var u=i/s,o=h(u),a=p.length;a>0;)p[--a].call(n,o);if(u>=1)return v.event&&v.event.end.call(n,n.__data__,t),--g.count?delete g[r]:delete n[e],1}var l,f,s,h,p,g=n[e]||(n[e]={active:0,count:0}),v=g[r];v||(l=i.time,f=qn(u,0,l),v=g[r]={tween:new c,time:l,timer:f,delay:i.delay,duration:i.duration,ease:i.ease,index:t},i=null,++g.count)}function no(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function to(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function eo(n){return n.toISOString()}function ro(n,t,e){function r(t){return n(t)}function i(n,e){var r=n[1]-n[0],i=r/e,u=ao.bisect(Jl,i);return u==Jl.length?[t.year,Ki(n.map(function(n){return n/31536e6}),e)[2]]:u?t[i/Jl[u-1]<Jl[u]/i?u-1:u]:[Ql,Ki(n,e)[2]]}return r.invert=function(t){return io(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(io)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,io(+e+1),t).length}var u=r.domain(),o=Yi(u),a=null==n?i(o,10):"number"==typeof n&&i(o,n);return a&&(n=a[0],t=a[1]),r.domain(Xi(u,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=io(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=io(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Yi(r.domain()),u=null==n?i(e,10):"number"==typeof n?i(e,n):!n.range&&[{range:n},t];return u&&(n=u[0],t=u[1]),n.range(e[0],io(+e[1]+1),t<1?1:t)},r.tickFormat=function(){return e},r.copy=function(){return ro(n.copy(),t,e)},Ji(r,n)}function io(n){return new Date(n)}function uo(n){return JSON.parse(n.responseText)}function oo(n){var t=fo.createRange();return t.selectNode(fo.body),t.createContextualFragment(n.responseText)}var ao={version:"3.5.17"},lo=[].slice,co=function(n){return lo.call(n)},fo=this.document;if(fo)try{co(fo.documentElement.childNodes)[0].nodeType}catch(n){co=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),fo)try{fo.createElement("DIV").style.setProperty("opacity",0,"")}catch(n){var so=this.Element.prototype,ho=so.setAttribute,po=so.setAttributeNS,go=this.CSSStyleDeclaration.prototype,vo=go.setProperty;so.setAttribute=function(n,t){ho.call(this,n,t+"")},so.setAttributeNS=function(n,t,e){po.call(this,n,t,e+"")},go.setProperty=function(n,t,e){vo.call(this,n,t+"",e)}}ao.ascending=e,ao.descending=function(n,t){return t<n?-1:t>n?1:t>=n?0:NaN},ao.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ao.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ao.extent=function(n,t){var e,r,i,u=-1,o=n.length;if(1===arguments.length){for(;++u<o;)if(null!=(r=n[u])&&r>=r){e=i=r;break}for(;++u<o;)null!=(r=n[u])&&(e>r&&(e=r),i<r&&(i=r))}else{for(;++u<o;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=i=r;break}for(;++u<o;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),i<r&&(i=r))}return[e,i]},ao.sum=function(n,t){var e,r=0,u=n.length,o=-1;if(1===arguments.length)for(;++o<u;)i(e=+n[o])&&(r+=e);else for(;++o<u;)i(e=+t.call(n,n[o],o))&&(r+=e);return r},ao.mean=function(n,t){var e,u=0,o=n.length,a=-1,l=o;if(1===arguments.length)for(;++a<o;)i(e=r(n[a]))?u+=e:--l;else for(;++a<o;)i(e=r(t.call(n,n[a],a)))?u+=e:--l;if(l)return u/l},ao.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},ao.median=function(n,t){var u,o=[],a=n.length,l=-1;if(1===arguments.length)for(;++l<a;)i(u=r(n[l]))&&o.push(u);else for(;++l<a;)i(u=r(t.call(n,n[l],l)))&&o.push(u);if(o.length)return ao.quantile(o.sort(e),.5)},ao.variance=function(n,t){var e,u,o=n.length,a=0,l=0,c=-1,f=0;if(1===arguments.length)for(;++c<o;)i(e=r(n[c]))&&(u=e-a,a+=u/++f,l+=u*(e-a));else for(;++c<o;)i(e=r(t.call(n,n[c],c)))&&(u=e-a,a+=u/++f,l+=u*(e-a));if(f>1)return l/(f-1)},ao.deviation=function(){var n=ao.variance.apply(this,arguments);return n?Math.sqrt(n):n};var yo=u(e);ao.bisectLeft=yo.left,ao.bisect=ao.bisectRight=yo.right,ao.bisector=function(n){return u(1===n.length?function(t,r){return e(n(t),r)}:n)},ao.shuffle=function(n,t,e){(u=arguments.length)<3&&(e=n.length,u<2&&(t=0));for(var r,i,u=e-t;u;)i=Math.random()*u--|0,r=n[u+t],n[u+t]=n[i+t],n[i+t]=r;return n},ao.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ao.pairs=function(n){for(var t,e=0,r=n.length-1,i=n[0],u=new Array(r<0?0:r);e<r;)u[e]=[t=i,i=n[++e]];return u},ao.transpose=function(n){if(!(i=n.length))return[];for(var t=-1,e=ao.min(n,o),r=new Array(e);++t<e;)for(var i,u=-1,a=r[t]=new Array(i);++u<i;)a[u]=n[u][t];return r},ao.zip=function(){return ao.transpose(arguments)},ao.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ao.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ao.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ao.merge=function(n){for(var t,e,r,i=n.length,u=-1,o=0;++u<i;)o+=n[u].length;for(e=new Array(o);--i>=0;)for(r=n[i],t=r.length;--t>=0;)e[--o]=r[t];return e};var mo=Math.abs;ao.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,i=[],u=a(mo(e)),o=-1;if(n*=u,t*=u,e*=u,e<0)for(;(r=n+e*++o)>t;)i.push(r/u);else for(;(r=n+e*++o)<t;)i.push(r/u);return i},ao.map=function(n,t){var e=new c;if(n instanceof c)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,i=-1,u=n.length;if(1===arguments.length)for(;++i<u;)e.set(i,n[i]);else for(;++i<u;)e.set(t.call(n,r=n[i],i),r)}else for(var o in n)e.set(o,n[o]);return e};var Mo="__proto__",xo="\0";l(c,{has:h,get:function(n){return this._[f(n)]},set:function(n,t){return this._[f(n)]=t},remove:p,keys:g,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:s(t),value:this._[t]});return n},size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,s(t),this._[t])}}),ao.nest=function(){function n(t,o,a){if(a>=u.length)return r?r.call(i,o):e?o.sort(e):o;for(var l,f,s,h,p=-1,g=o.length,v=u[a++],d=new c;++p<g;)(h=d.get(l=v(f=o[p])))?h.push(f):d.set(l,[f]);return t?(f=t(),s=function(e,r){f.set(e,n(t,r,a))}):(f={},s=function(e,r){f[e]=n(t,r,a)}),d.forEach(s),f}function t(n,e){if(e>=u.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,i={},u=[],o=[];return i.map=function(t,e){return n(e,t,0)},i.entries=function(e){return t(n(ao.map,e,0),0)},i.key=function(n){return u.push(n),i},i.sortKeys=function(n){return o[u.length-1]=n,i},i.sortValues=function(n){return e=n,i},i.rollup=function(n){return r=n,i},i},ao.set=function(n){var t=new y;if(n)for(var e=0,r=n.length;e<r;++e)t.add(n[e]);return t},l(y,{has:h,add:function(n){return this._[f(n+="")]=!0,n},remove:p,values:g,size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,s(t))}}),ao.behavior={},ao.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=M(n,t,t[e]);return n};var bo=["webkit","ms","moz","Moz","o","O"];ao.dispatch=function(){for(var n=new _,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=w(n);return n},_.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ao.event=null,ao.requote=function(n){return n.replace(_o,"\\$&")};var _o=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,wo={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},So=function(n,t){return t.querySelector(n)},ko=function(n,t){return t.querySelectorAll(n)},No=function(n,t){var e=n.matches||n[x(n,"matchesSelector")];return(No=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(So=function(n,t){return Sizzle(n,t)[0]||null},ko=Sizzle,No=Sizzle.matchesSelector),ao.selection=function(){return ao.select(fo.documentElement)};var Eo=ao.selection.prototype=[];Eo.select=function(n){var t,e,r,i,u=[];n=A(n);for(var o=-1,a=this.length;++o<a;){u.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var l=-1,c=r.length;++l<c;)(i=r[l])?(t.push(e=n.call(i,i.__data__,l,o)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return E(u)},Eo.selectAll=function(n){var t,e,r=[];n=C(n);for(var i=-1,u=this.length;++i<u;)for(var o=this[i],a=-1,l=o.length;++a<l;)(e=o[a])&&(r.push(t=co(n.call(e,e.__data__,a,i))),t.parentNode=e);return E(r)};var Ao="http://www.w3.org/1999/xhtml",Co={svg:"http://www.w3.org/2000/svg",xhtml:Ao,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ao.ns={prefix:Co,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),Co.hasOwnProperty(e)?{space:Co[e],local:n}:n}},Eo.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ao.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(z(t,n[t]));return this}return this.each(z(n,t))},Eo.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=T(n)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!q(n[i]).test(t))return!1;return!0}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},Eo.style=function(n,e,r){var i=arguments.length;if(i<3){if("string"!=typeof n){i<2&&(e="");for(r in n)this.each(P(r,n[r],e));return this}if(i<2){var u=this.node();return t(u).getComputedStyle(u,null).getPropertyValue(n)}r=""}return this.each(P(n,e,r))},Eo.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(U(t,n[t]));return this}return this.each(U(n,t))},Eo.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Eo.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Eo.append=function(n){return n=j(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Eo.insert=function(n,t){return n=j(n),t=A(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},Eo.remove=function(){return this.each(F)},Eo.data=function(n,t){function e(n,e){var r,i,u,o=n.length,s=e.length,h=Math.min(o,s),p=new Array(s),g=new Array(s),v=new Array(o);if(t){var d,y=new c,m=new Array(o);for(r=-1;++r<o;)(i=n[r])&&(y.has(d=t.call(i,i.__data__,r))?v[r]=i:y.set(d,i),m[r]=d);for(r=-1;++r<s;)(i=y.get(d=t.call(e,u=e[r],r)))?i!==!0&&(p[r]=i,i.__data__=u):g[r]=H(u),y.set(d,!0);for(r=-1;++r<o;)r in m&&y.get(m[r])!==!0&&(v[r]=n[r])}else{for(r=-1;++r<h;)i=n[r],u=e[r],i?(i.__data__=u,p[r]=i):g[r]=H(u);for(;r<s;++r)g[r]=H(e[r]);for(;r<o;++r)v[r]=n[r]}g.update=p,g.parentNode=p.parentNode=v.parentNode=n.parentNode,a.push(g),l.push(p),f.push(v)}var r,i,u=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++u<o;)(i=r[u])&&(n[u]=i.__data__);return n}var a=Z([]),l=E([]),f=E([]);if("function"==typeof n)for(;++u<o;)e(r=this[u],n.call(r,r.parentNode.__data__,u));else for(;++u<o;)e(r=this[u],n);return l.enter=function(){return a},l.exit=function(){return f},l},Eo.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Eo.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=O(n));for(var u=0,o=this.length;u<o;u++){i.push(t=[]),t.parentNode=(e=this[u]).parentNode;for(var a=0,l=e.length;a<l;a++)(r=e[a])&&n.call(r,r.__data__,a,u)&&t.push(r)}return E(i)},Eo.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),u=e);return this},Eo.sort=function(n){n=I.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Eo.each=function(n){return Y(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Eo.call=function(n){var t=co(arguments);return n.apply(t[0]=this,t),this},Eo.empty=function(){return!this.node()},Eo.node=function(){for(var n=0,t=this.length;n<t;n++)for(var e=this[n],r=0,i=e.length;r<i;r++){var u=e[r];if(u)return u}return null},Eo.size=function(){var n=0;return Y(this,function(){++n}),n};var zo=[];ao.selection.enter=Z,ao.selection.enter.prototype=zo,zo.append=Eo.append,zo.empty=Eo.empty,zo.node=Eo.node,zo.call=Eo.call,zo.size=Eo.size,zo.select=function(n){for(var t,e,r,i,u,o=[],a=-1,l=this.length;++a<l;){r=(i=this[a]).update,o.push(t=[]),t.parentNode=i.parentNode;for(var c=-1,f=i.length;++c<f;)(u=i[c])?(t.push(r[c]=e=n.call(i.parentNode,u.__data__,c,a)),e.__data__=u.__data__):t.push(null)}return E(o)},zo.insert=function(n,t){return arguments.length<2&&(t=V(this)),Eo.insert.call(this,n,t)},ao.select=function(t){var e;return"string"==typeof t?(e=[So(t,fo)],e.parentNode=fo.documentElement):(e=[t],e.parentNode=n(t)),E([e])},ao.selectAll=function(n){var t;return"string"==typeof n?(t=co(ko(n,fo)),t.parentNode=fo.documentElement):(t=co(n),t.parentNode=null),E([t])},Eo.on=function(n,t,e){var r=arguments.length;if(r<3){if("string"!=typeof n){r<2&&(t=!1);for(e in n)this.each(X(e,n[e],t));return this}if(r<2)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(X(n,t,e))};var Lo=ao.map({mouseenter:"mouseover",mouseleave:"mouseout"});fo&&Lo.forEach(function(n){"on"+n in fo&&Lo.remove(n)});var qo,To=0;ao.mouse=function(n){return J(n,k())};var Ro=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;ao.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=k().changedTouches),t)for(var r,i=0,u=t.length;i<u;++i)if((r=t[i]).identifier===e)return J(n,r)},ao.behavior.drag=function(){function n(){this.on("mousedown.drag",u).on("touchstart.drag",o)}function e(n,t,e,u,o){return function(){function a(){var n,e,r=t(h,v);r&&(n=r[0]-M[0],e=r[1]-M[1],g|=n|e,M=r,p({type:"drag",x:r[0]+c[0],y:r[1]+c[1],dx:n,dy:e}))}function l(){t(h,v)&&(y.on(u+d,null).on(o+d,null),m(g),p({type:"dragend"}))}var c,f=this,s=ao.event.target.correspondingElement||ao.event.target,h=f.parentNode,p=r.of(f,arguments),g=0,v=n(),d=".drag"+(null==v?"":"-"+v),y=ao.select(e(s)).on(u+d,a).on(o+d,l),m=W(s),M=t(h,v);i?(c=i.apply(f,arguments),c=[c.x-M[0],c.y-M[1]]):c=[0,0],p({type:"dragstart"})}}var r=N(n,"drag","dragstart","dragend"),i=null,u=e(b,ao.mouse,t,"mousemove","mouseup"),o=e(G,ao.touch,m,"touchmove","touchend");return n.origin=function(t){return arguments.length?(i=t,n):i},ao.rebind(n,r,"on")},ao.touches=function(n,t){return arguments.length<2&&(t=k().touches),t?co(t).map(function(t){var e=J(n,t);return e.identifier=t.identifier,e}):[]};var Do=1e-6,Po=Do*Do,Uo=Math.PI,jo=2*Uo,Fo=jo-Do,Ho=Uo/2,Oo=Uo/180,Io=180/Uo,Yo=Math.SQRT2,Zo=2,Vo=4;ao.interpolateZoom=function(n,t){var e,r,i=n[0],u=n[1],o=n[2],a=t[0],l=t[1],c=t[2],f=a-i,s=l-u,h=f*f+s*s;if(h<Po)r=Math.log(c/o)/Yo,e=function(n){return[i+n*f,u+n*s,o*Math.exp(Yo*n*r)]};else{var p=Math.sqrt(h),g=(c*c-o*o+Vo*h)/(2*o*Zo*p),v=(c*c-o*o-Vo*h)/(2*c*Zo*p),d=Math.log(Math.sqrt(g*g+1)-g),y=Math.log(Math.sqrt(v*v+1)-v);r=(y-d)/Yo,e=function(n){var t=n*r,e=rn(d),a=o/(Zo*p)*(e*un(Yo*t+d)-en(d));return[i+a*f,u+a*s,o*e/rn(Yo*t+d)]}}return e.duration=1e3*r,e},ao.behavior.zoom=function(){function n(n){n.on(L,s).on($o+".zoom",p).on("dblclick.zoom",g).on(R,h)}function e(n){return[(n[0]-k.x)/k.k,(n[1]-k.y)/k.k]}function r(n){return[n[0]*k.k+k.x,n[1]*k.k+k.y]}function i(n){k.k=Math.max(A[0],Math.min(A[1],n))}function u(n,t){t=r(t),k.x+=n[0]-t[0],k.y+=n[1]-t[1]}function o(t,e,r,o){t.__chart__={x:k.x,y:k.y,k:k.k},i(Math.pow(2,o)),u(d=e,r),t=ao.select(t),C>0&&(t=t.transition().duration(C)),t.call(n.event)}function a(){b&&b.domain(x.range().map(function(n){return(n-k.x)/k.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-k.y)/k.k}).map(_.invert))}function l(n){z++||n({type:"zoomstart"})}function c(n){a(),n({type:"zoom",scale:k.k,translate:[k.x,k.y]})}function f(n){--z||(n({type:"zoomend"}),d=null)}function s(){function n(){a=1,u(ao.mouse(i),h),c(o)}function r(){s.on(q,null).on(T,null),p(a),f(o)}var i=this,o=D.of(i,arguments),a=0,s=ao.select(t(i)).on(q,n).on(T,r),h=e(ao.mouse(i)),p=W(i);Hl.call(i),l(o)}function h(){function n(){var n=ao.touches(g);return p=k.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=e(n))}),n}function t(){var t=ao.event.target;ao.select(t).on(x,r).on(b,a),_.push(t);for(var e=ao.event.changedTouches,i=0,u=e.length;i<u;++i)d[e[i].identifier]=null;var l=n(),c=Date.now();if(1===l.length){if(c-M<500){var f=l[0];o(g,f,d[f.identifier],Math.floor(Math.log(k.k)/Math.LN2)+1),S()}M=c}else if(l.length>1){var f=l[0],s=l[1],h=f[0]-s[0],p=f[1]-s[1];y=h*h+p*p}}function r(){var n,t,e,r,o=ao.touches(g);Hl.call(g);for(var a=0,l=o.length;a<l;++a,r=null)if(e=o[a],r=d[e.identifier]){if(t)break;n=e,t=r}if(r){var f=(f=e[0]-n[0])*f+(f=e[1]-n[1])*f,s=y&&Math.sqrt(f/y);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+r[0])/2,(t[1]+r[1])/2],i(s*p)}M=null,u(n,t),c(v)}function a(){if(ao.event.touches.length){for(var t=ao.event.changedTouches,e=0,r=t.length;e<r;++e)delete d[t[e].identifier];for(var i in d)return void n()}ao.selectAll(_).on(m,null),w.on(L,s).on(R,h),N(),f(v)}var p,g=this,v=D.of(g,arguments),d={},y=0,m=".zoom-"+ao.event.changedTouches[0].identifier,x="touchmove"+m,b="touchend"+m,_=[],w=ao.select(g),N=W(g);t(),l(v),w.on(L,null).on(R,t)}function p(){var n=D.of(this,arguments);m?clearTimeout(m):(Hl.call(this),v=e(d=y||ao.mouse(this)),l(n)),m=setTimeout(function(){m=null,f(n)},50),S(),i(Math.pow(2,.002*Xo())*k.k),u(d,v),c(n)}function g(){var n=ao.mouse(this),t=Math.log(k.k)/Math.LN2;o(this,n,e(n),ao.event.shiftKey?Math.ceil(t)-1:Math.floor(t)+1)}var v,d,y,m,M,x,b,_,w,k={x:0,y:0,k:1},E=[960,500],A=Bo,C=250,z=0,L="mousedown.zoom",q="mousemove.zoom",T="mouseup.zoom",R="touchstart.zoom",D=N(n,"zoomstart","zoom","zoomend");return $o||($o="onwheel"in fo?(Xo=function(){return-ao.event.deltaY*(ao.event.deltaMode?120:1)},"wheel"):"onmousewheel"in fo?(Xo=function(){return ao.event.wheelDelta},"mousewheel"):(Xo=function(){return-ao.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=D.of(this,arguments),t=k;jl?ao.select(this).transition().each("start.zoom",function(){k=this.__chart__||{x:0,y:0,k:1},l(n)}).tween("zoom:zoom",function(){var e=E[0],r=E[1],i=d?d[0]:e/2,u=d?d[1]:r/2,o=ao.interpolateZoom([(i-k.x)/k.k,(u-k.y)/k.k,e/k.k],[(i-t.x)/t.k,(u-t.y)/t.k,e/t.k]);return function(t){var r=o(t),a=e/r[2];this.__chart__=k={x:i-r[0]*a,y:u-r[1]*a,k:a},c(n)}}).each("interrupt.zoom",function(){f(n)}).each("end.zoom",function(){f(n)}):(this.__chart__=k,l(n),c(n),f(n))})},n.translate=function(t){return arguments.length?(k={x:+t[0],y:+t[1],k:k.k},a(),n):[k.x,k.y]},n.scale=function(t){return arguments.length?(k={x:k.x,y:k.y,k:null},i(+t),a(),n):k.k},n.scaleExtent=function(t){return arguments.length?(A=null==t?Bo:[+t[0],+t[1]],n):A},n.center=function(t){return arguments.length?(y=t&&[+t[0],+t[1]],n):y},n.size=function(t){return arguments.length?(E=t&&[+t[0],+t[1]],n):E},n.duration=function(t){return arguments.length?(C=+t,n):C},n.x=function(t){return arguments.length?(b=t,x=t.copy(),k={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),k={x:0,y:0,k:1},n):w},ao.rebind(n,D,"on")};var Xo,$o,Bo=[0,1/0];ao.color=an,an.prototype.toString=function(){return this.rgb()+""},ao.hsl=ln;var Wo=ln.prototype=new an;Wo.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,this.l/n)},Wo.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,n*this.l)},Wo.rgb=function(){return cn(this.h,this.s,this.l)},ao.hcl=fn;var Jo=fn.prototype=new an;Jo.brighter=function(n){return new fn(this.h,this.c,Math.min(100,this.l+Go*(arguments.length?n:1)))},Jo.darker=function(n){return new fn(this.h,this.c,Math.max(0,this.l-Go*(arguments.length?n:1)))},Jo.rgb=function(){return sn(this.h,this.c,this.l).rgb()},ao.lab=hn;var Go=18,Ko=.95047,Qo=1,na=1.08883,ta=hn.prototype=new an;ta.brighter=function(n){return new hn(Math.min(100,this.l+Go*(arguments.length?n:1)),this.a,this.b)},ta.darker=function(n){return new hn(Math.max(0,this.l-Go*(arguments.length?n:1)),this.a,this.b)},ta.rgb=function(){return pn(this.l,this.a,this.b)},ao.rgb=mn;var ea=mn.prototype=new an;ea.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&t<i&&(t=i),e&&e<i&&(e=i),r&&r<i&&(r=i),new mn(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new mn(i,i,i)},ea.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new mn(n*this.r,n*this.g,n*this.b)},ea.hsl=function(){return wn(this.r,this.g,this.b)},ea.toString=function(){return"#"+bn(this.r)+bn(this.g)+bn(this.b)};var ra=ao.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});ra.forEach(function(n,t){ra.set(n,Mn(t))}),ao.functor=En,ao.xhr=An(m),ao.dsv=function(n,t){function e(n,e,u){arguments.length<3&&(u=e,e=null);var o=Cn(n,t,null==e?r:i(e),u);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:i(n)):e},o}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function u(t){return t.map(o).join(n)}function o(n){return a.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var a=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(f>=c)return o;if(i)return i=!1,u;var t=f;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}f=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++f):10===r&&(i=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;f<c;){var r=n.charCodeAt(f++),a=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(f)&&(++f,++a);else if(r!==l)continue;return n.slice(t,f-a)}return n.slice(t)}for(var r,i,u={},o={},a=[],c=n.length,f=0,s=0;(r=e())!==o;){for(var h=[];r!==u&&r!==o;)h.push(r),r=e();t&&null==(h=t(h,s++))||a.push(h)}return a},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new y,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(u).join("\n")},e},ao.csv=ao.dsv(",","text/csv"),ao.tsv=ao.dsv("\t","text/tab-separated-values");var ia,ua,oa,aa,la=this[x(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ao.timer=function(){qn.apply(this,arguments)},ao.timer.flush=function(){Rn(),Dn()},ao.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var ca=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(Un);ao.formatPrefix=function(n,t){var e=0;return(n=+n)&&(n<0&&(n*=-1),t&&(n=ao.round(n,Pn(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),ca[8+e/3]};var fa=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,sa=ao.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ao.round(n,Pn(n,t))).toFixed(Math.max(0,Math.min(20,Pn(n*(1+1e-15),t))))}}),ha=ao.time={},pa=Date;Hn.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){ga.setUTCDate.apply(this._,arguments)},setDay:function(){ga.setUTCDay.apply(this._,arguments)},setFullYear:function(){ga.setUTCFullYear.apply(this._,arguments)},setHours:function(){ga.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){ga.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){ga.setUTCMinutes.apply(this._,arguments)},setMonth:function(){ga.setUTCMonth.apply(this._,arguments)},setSeconds:function(){ga.setUTCSeconds.apply(this._,arguments)},setTime:function(){ga.setTime.apply(this._,arguments)}};var ga=Date.prototype;ha.year=On(function(n){return n=ha.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ha.years=ha.year.range,ha.years.utc=ha.year.utc.range,ha.day=On(function(n){var t=new pa(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ha.days=ha.day.range,ha.days.utc=ha.day.utc.range,ha.dayOfYear=function(n){var t=ha.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=ha[n]=On(function(n){return(n=ha.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ha.year(n).getDay();return Math.floor((ha.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ha[n+"s"]=e.range,ha[n+"s"].utc=e.utc.range,ha[n+"OfYear"]=function(n){var e=ha.year(n).getDay();return Math.floor((ha.dayOfYear(n)+(e+t)%7)/7)}}),ha.week=ha.sunday,ha.weeks=ha.sunday.range,ha.weeks.utc=ha.sunday.utc.range,ha.weekOfYear=ha.sundayOfYear;var va={"-":"",_:" ",0:"0"},da=/^\s*\d+/,ya=/^%/;ao.locale=function(n){return{numberFormat:jn(n),timeFormat:Yn(n)}};var ma=ao.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});ao.format=ma.numberFormat,ao.geo={},ft.prototype={s:0,t:0,add:function(n){st(n,this.t,Ma),st(Ma.s,this.s,this),this.s?this.t+=Ma.t:this.s=Ma.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var Ma=new ft;ao.geo.stream=function(n,t){n&&xa.hasOwnProperty(n.type)?xa[n.type](n,t):ht(n,t)};var xa={Feature:function(n,t){ht(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)ht(e[r].geometry,t)}},ba={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){pt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)pt(e[r],t,0)},Polygon:function(n,t){gt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)gt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)ht(e[r],t)}};ao.geo.area=function(n){return _a=0,ao.geo.stream(n,Sa),_a};var _a,wa=new ft,Sa={sphere:function(){_a+=4*Uo},point:b,lineStart:b,lineEnd:b,polygonStart:function(){wa.reset(),Sa.lineStart=vt},polygonEnd:function(){var n=2*wa;_a+=n<0?4*Uo+n:n,Sa.lineStart=Sa.lineEnd=Sa.point=b}};ao.geo.bounds=function(){function n(n,t){M.push(x=[f=n,h=n]),t<s&&(s=t),t>p&&(p=t)}function t(t,e){var r=dt([t*Oo,e*Oo]);if(y){var i=mt(y,r),u=[i[1],-i[0],0],o=mt(u,i);bt(o),o=_t(o);var l=t-g,c=l>0?1:-1,v=o[0]*Io*c,d=mo(l)>180;if(d^(c*g<v&&v<c*t)){var m=o[1]*Io;m>p&&(p=m)}else if(v=(v+360)%360-180,d^(c*g<v&&v<c*t)){var m=-o[1]*Io;m<s&&(s=m)}else e<s&&(s=e),e>p&&(p=e);d?t<g?a(f,t)>a(f,h)&&(h=t):a(t,h)>a(f,h)&&(f=t):h>=f?(t<f&&(f=t),t>h&&(h=t)):t>g?a(f,t)>a(f,h)&&(h=t):a(t,h)>a(f,h)&&(f=t)}else n(t,e);y=r,g=t}function e(){b.point=t}function r(){x[0]=f,x[1]=h,b.point=n,y=null}function i(n,e){if(y){var r=n-g;m+=mo(r)>180?r+(r>0?360:-360):r}else v=n,d=e;Sa.point(n,e),t(n,e)}function u(){Sa.lineStart()}function o(){i(v,d),Sa.lineEnd(),mo(m)>Do&&(f=-(h=180)),x[0]=f,x[1]=h,y=null}function a(n,t){return(t-=n)<0?t+360:t}function l(n,t){return n[0]-t[0]}function c(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var f,s,h,p,g,v,d,y,m,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=i,b.lineStart=u,b.lineEnd=o,m=0,Sa.polygonStart()},polygonEnd:function(){Sa.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,wa<0?(f=-(h=180),s=-(p=90)):m>Do?p=90:m<-Do&&(s=-90),x[0]=f,x[1]=h}};return function(n){p=h=-(f=s=1/0),M=[],ao.geo.stream(n,b);var t=M.length;if(t){M.sort(l);for(var e,r=1,i=M[0],u=[i];r<t;++r)e=M[r],c(e[0],i)||c(e[1],i)?(a(i[0],e[1])>a(i[0],i[1])&&(i[1]=e[1]),a(e[0],i[1])>a(i[0],i[1])&&(i[0]=e[0])):u.push(i=e);for(var o,e,g=-(1/0),t=u.length-1,r=0,i=u[t];r<=t;i=e,++r)e=u[r],(o=a(i[1],e[0]))>g&&(g=o,f=e[0],h=i[1])}return M=x=null,f===1/0||s===1/0?[[NaN,NaN],[NaN,NaN]]:[[f,s],[h,p]]}}(),ao.geo.centroid=function(n){ka=Na=Ea=Aa=Ca=za=La=qa=Ta=Ra=Da=0,ao.geo.stream(n,Pa);var t=Ta,e=Ra,r=Da,i=t*t+e*e+r*r;return i<Po&&(t=za,e=La,r=qa,Na<Do&&(t=Ea,e=Aa,r=Ca),i=t*t+e*e+r*r,i<Po)?[NaN,NaN]:[Math.atan2(e,t)*Io,tn(r/Math.sqrt(i))*Io]};var ka,Na,Ea,Aa,Ca,za,La,qa,Ta,Ra,Da,Pa={sphere:b,point:St,lineStart:Nt,lineEnd:Et,polygonStart:function(){Pa.lineStart=At},polygonEnd:function(){Pa.lineStart=Nt}},Ua=Rt(zt,jt,Ht,[-Uo,-Uo/2]),ja=1e9;ao.geo.clipExtent=function(){var n,t,e,r,i,u,o={stream:function(n){return i&&(i.valid=!1),i=u(n),i.valid=!0,i},extent:function(a){return arguments.length?(u=Zt(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),i&&(i.valid=!1,i=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(ao.geo.conicEqualArea=function(){return Vt(Xt)}).raw=Xt,ao.geo.albers=function(){return ao.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ao.geo.albersUsa=function(){function n(n){var u=n[0],o=n[1];return t=null,e(u,o),t||(r(u,o),t)||i(u,o),t}var t,e,r,i,u=ao.geo.albers(),o=ao.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=ao.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&i<.234&&r>=-.425&&r<-.214?o:i>=.166&&i<.234&&r>=-.214&&r<-.115?a:u).invert(n)},n.stream=function(n){var t=u.stream(n),e=o.stream(n),r=a.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(u.precision(t),o.precision(t),a.precision(t),n):u.precision()},n.scale=function(t){return arguments.length?(u.scale(t),o.scale(.35*t),a.scale(t),n.translate(u.translate())):u.scale()},n.translate=function(t){if(!arguments.length)return u.translate();var c=u.scale(),f=+t[0],s=+t[1];return e=u.translate(t).clipExtent([[f-.455*c,s-.238*c],[f+.455*c,s+.238*c]]).stream(l).point,r=o.translate([f-.307*c,s+.201*c]).clipExtent([[f-.425*c+Do,s+.12*c+Do],[f-.214*c-Do,s+.234*c-Do]]).stream(l).point,i=a.translate([f-.205*c,s+.212*c]).clipExtent([[f-.214*c+Do,s+.166*c+Do],[f-.115*c-Do,s+.234*c-Do]]).stream(l).point,n},n.scale(1070)};var Fa,Ha,Oa,Ia,Ya,Za,Va={point:b,lineStart:b,lineEnd:b,polygonStart:function(){Ha=0,Va.lineStart=$t},polygonEnd:function(){Va.lineStart=Va.lineEnd=Va.point=b,Fa+=mo(Ha/2)}},Xa={point:Bt,lineStart:b,lineEnd:b,polygonStart:b,polygonEnd:b},$a={point:Gt,lineStart:Kt,lineEnd:Qt,polygonStart:function(){$a.lineStart=ne},polygonEnd:function(){$a.point=Gt,$a.lineStart=Kt,$a.lineEnd=Qt}};ao.geo.path=function(){function n(n){return n&&("function"==typeof a&&u.pointRadius(+a.apply(this,arguments)),o&&o.valid||(o=i(u)),ao.geo.stream(n,o)),u.result()}function t(){return o=null,n}var e,r,i,u,o,a=4.5;return n.area=function(n){return Fa=0,ao.geo.stream(n,i(Va)),Fa},n.centroid=function(n){return Ea=Aa=Ca=za=La=qa=Ta=Ra=Da=0,ao.geo.stream(n,i($a)),Da?[Ta/Da,Ra/Da]:qa?[za/qa,La/qa]:Ca?[Ea/Ca,Aa/Ca]:[NaN,NaN]},n.bounds=function(n){return Ya=Za=-(Oa=Ia=1/0),ao.geo.stream(n,i(Xa)),[[Oa,Ia],[Ya,Za]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||re(n):m,t()):e},n.context=function(n){return arguments.length?(u=null==(r=n)?new Wt:new te(n),"function"!=typeof a&&u.pointRadius(a),t()):r},n.pointRadius=function(t){return arguments.length?(a="function"==typeof t?t:(u.pointRadius(+t),+t),n):a},n.projection(ao.geo.albersUsa()).context(null)},ao.geo.transform=function(n){return{stream:function(t){var e=new ie(t);for(var r in n)e[r]=n[r];return e}}},ie.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},ao.geo.projection=oe,ao.geo.projectionMutator=ae,(ao.geo.equirectangular=function(){return oe(ce)}).raw=ce.invert=ce,ao.geo.rotation=function(n){function t(t){return t=n(t[0]*Oo,t[1]*Oo),t[0]*=Io,t[1]*=Io,t}return n=se(n[0]%360*Oo,n[1]*Oo,n.length>2?n[2]*Oo:0),t.invert=function(t){return t=n.invert(t[0]*Oo,t[1]*Oo),t[0]*=Io,t[1]*=Io,t},t},fe.invert=ce,ao.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=se(-n[0]*Oo,-n[1]*Oo,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=Io,n[1]*=Io}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=ve((t=+r)*Oo,i*Oo),n):t},n.precision=function(r){return arguments.length?(e=ve(t*Oo,(i=+r)*Oo),n):i},n.angle(90)},ao.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Oo,i=n[1]*Oo,u=t[1]*Oo,o=Math.sin(r),a=Math.cos(r),l=Math.sin(i),c=Math.cos(i),f=Math.sin(u),s=Math.cos(u);return Math.atan2(Math.sqrt((e=s*o)*e+(e=c*f-l*s*a)*e),l*f+c*s*a)},ao.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ao.range(Math.ceil(u/d)*d,i,d).map(h).concat(ao.range(Math.ceil(c/y)*y,l,y).map(p)).concat(ao.range(Math.ceil(r/g)*g,e,g).filter(function(n){return mo(n%d)>Do}).map(f)).concat(ao.range(Math.ceil(a/v)*v,o,v).filter(function(n){return mo(n%y)>Do}).map(s))}var e,r,i,u,o,a,l,c,f,s,h,p,g=10,v=g,d=90,y=360,m=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(u).concat(p(l).slice(1),h(i).reverse().slice(1),p(c).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(u=+t[0][0],i=+t[1][0],c=+t[0][1],l=+t[1][1],u>i&&(t=u,u=i,i=t),c>l&&(t=c,c=l,l=t),n.precision(m)):[[u,c],[i,l]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],a=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),a>o&&(t=a,a=o,o=t),n.precision(m)):[[r,a],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],y=+t[1],n):[d,y]},n.minorStep=function(t){return arguments.length?(g=+t[0],v=+t[1],n):[g,v]},n.precision=function(t){return arguments.length?(m=+t,f=ye(a,o,90),s=me(r,e,m),h=ye(c,l,90),p=me(u,i,m),n):m},n.majorExtent([[-180,-90+Do],[180,90-Do]]).minorExtent([[-180,-80-Do],[180,80+Do]])},ao.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=Me,i=xe;return n.distance=function(){return ao.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ao.geo.interpolate=function(n,t){return be(n[0]*Oo,n[1]*Oo,t[0]*Oo,t[1]*Oo)},ao.geo.length=function(n){return Ba=0,ao.geo.stream(n,Wa),Ba};var Ba,Wa={sphere:b,point:b,lineStart:_e,lineEnd:b,polygonStart:b,polygonEnd:b},Ja=we(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ao.geo.azimuthalEqualArea=function(){return oe(Ja)}).raw=Ja;var Ga=we(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},m);(ao.geo.azimuthalEquidistant=function(){return oe(Ga)}).raw=Ga,(ao.geo.conicConformal=function(){return Vt(Se)}).raw=Se,(ao.geo.conicEquidistant=function(){return Vt(ke)}).raw=ke;var Ka=we(function(n){return 1/n},Math.atan);(ao.geo.gnomonic=function(){return oe(Ka)}).raw=Ka,Ne.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ho]},(ao.geo.mercator=function(){return Ee(Ne)}).raw=Ne;var Qa=we(function(){return 1},Math.asin);(ao.geo.orthographic=function(){return oe(Qa)}).raw=Qa;var nl=we(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ao.geo.stereographic=function(){return oe(nl)}).raw=nl,Ae.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Ho]},(ao.geo.transverseMercator=function(){var n=Ee(Ae),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Ae,ao.geom={},ao.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i=En(e),u=En(r),o=n.length,a=[],l=[];for(t=0;t<o;t++)a.push([+i.call(this,n[t],t),+u.call(this,n[t],t),t]);for(a.sort(qe),t=0;t<o;t++)l.push([a[t][0],-a[t][1]]);var c=Le(a),f=Le(l),s=f[0]===c[0],h=f[f.length-1]===c[c.length-1],p=[];for(t=c.length-1;t>=0;--t)p.push(n[a[c[t]][2]]);for(t=+s;t<f.length-h;++t)p.push(n[a[f[t]][2]]);return p}var e=Ce,r=ze;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ao.geom.polygon=function(n){return wo(n,tl),n};var tl=ao.geom.polygon.prototype=[];tl.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},tl.centroid=function(n){var t,e,r=-1,i=this.length,u=0,o=0,a=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=a,a=this[r],e=t[0]*a[1]-a[0]*t[1],u+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e;return[u*n,o*n]},tl.clip=function(n){for(var t,e,r,i,u,o,a=De(n),l=-1,c=this.length-De(this),f=this[c-1];++l<c;){for(t=n.slice(),n.length=0,i=this[l],u=t[(r=t.length-a)-1],e=-1;++e<r;)o=t[e],Te(o,f,i)?(Te(u,f,i)||n.push(Re(u,o,f,i)),n.push(o)):Te(u,f,i)&&n.push(Re(u,o,f,i)),u=o;a&&n.push(n[0]),f=i}return n};var el,rl,il,ul,ol,al=[],ll=[];Ye.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(Ve),t.length},tr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},er.prototype={insert:function(n,t){var e,r,i;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=or(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(i=r.R,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.R&&(ir(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ur(this,r))):(i=r.L,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.L&&(ur(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ir(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,i=n.U,u=n.L,o=n.R;if(e=u?o?or(o):u:o,i?i.L===n?i.L=e:i.R=e:this._=e,u&&o?(r=e.C,e.C=n.C,e.L=u,u.U=e,e!==o?(i=e.U,e.U=n.U,n=e.R,i.L=n,e.R=o,o.U=e):(e.U=i,i=e,n=e.R)):(r=n.C,n=e),n&&(n.U=i),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===i.L){if(t=i.R,t.C&&(t.C=!1,i.C=!0,ir(this,i),t=i.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,ur(this,t),t=i.R),t.C=i.C,i.C=t.R.C=!1,ir(this,i),n=this._;break}}else if(t=i.L,t.C&&(t.C=!1,i.C=!0,ur(this,i),t=i.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,ir(this,t),t=i.L),t.C=i.C,i.C=t.L.C=!1,ur(this,i),n=this._;break}t.C=!0,n=i,i=i.U}while(!n.C);n&&(n.C=!1)}}},ao.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=a[0][0],i=a[0][1],u=a[1][0],o=a[1][1];return ar(e(n),a).cells.forEach(function(e,a){var l=e.edges,c=e.site,f=t[a]=l.length?l.map(function(n){var t=n.start();return[t.x,t.y]}):c.x>=r&&c.x<=u&&c.y>=i&&c.y<=o?[[r,o],[u,o],[u,i],[r,i]]:[];f.point=n[a]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(u(n,t)/Do)*Do,y:Math.round(o(n,t)/Do)*Do,i:t}})}var r=Ce,i=ze,u=r,o=i,a=cl;return n?t(n):(t.links=function(n){return ar(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return ar(e(n)).cells.forEach(function(e,r){for(var i,u,o=e.site,a=e.edges.sort(Ve),l=-1,c=a.length,f=a[c-1].edge,s=f.l===o?f.r:f.l;++l<c;)i=f,u=s,f=a[l].edge,s=f.l===o?f.r:f.l,r<u.i&&r<s.i&&cr(o,u,s)<0&&t.push([n[r],n[u.i],n[s.i]])}),t},t.x=function(n){return arguments.length?(u=En(r=n),t):r},t.y=function(n){return arguments.length?(o=En(i=n),t):i},t.clipExtent=function(n){return arguments.length?(a=null==n?cl:n,t):a===cl?null:a},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):a===cl?null:a&&a[1]},t)};var cl=[[-1e6,-1e6],[1e6,1e6]];ao.geom.delaunay=function(n){return ao.geom.voronoi().triangles(n)},ao.geom.quadtree=function(n,t,e,r,i){function u(n){function u(n,t,e,r,i,u,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var l=n.x,f=n.y;if(null!=l)if(mo(l-e)+mo(f-r)<.01)c(n,t,e,r,i,u,o,a);else{var s=n.point;n.x=n.y=n.point=null,c(n,s,l,f,i,u,o,a),c(n,t,e,r,i,u,o,a)}else n.x=e,n.y=r,n.point=t}else c(n,t,e,r,i,u,o,a)}function c(n,t,e,r,i,o,a,l){var c=.5*(i+a),f=.5*(o+l),s=e>=c,h=r>=f,p=h<<1|s;n.leaf=!1,n=n.nodes[p]||(n.nodes[p]=hr()),s?i=c:a=c,h?o=f:l=f,u(n,t,e,r,i,o,a,l)}var f,s,h,p,g,v,d,y,m,M=En(a),x=En(l);if(null!=t)v=t,d=e,y=r,m=i;else if(y=m=-(v=d=1/0),s=[],h=[],g=n.length,o)for(p=0;p<g;++p)f=n[p],f.x<v&&(v=f.x),f.y<d&&(d=f.y),f.x>y&&(y=f.x),f.y>m&&(m=f.y),s.push(f.x),h.push(f.y);else for(p=0;p<g;++p){var b=+M(f=n[p],p),_=+x(f,p);b<v&&(v=b),_<d&&(d=_),b>y&&(y=b),_>m&&(m=_),s.push(b),h.push(_)}var w=y-v,S=m-d;w>S?m=d+w:y=v+S;var k=hr();if(k.add=function(n){u(k,n,+M(n,++p),+x(n,p),v,d,y,m)},k.visit=function(n){pr(n,k,v,d,y,m)},k.find=function(n){return gr(k,n[0],n[1],v,d,y,m)},p=-1,null==t){for(;++p<g;)u(k,n[p],s[p],h[p],v,d,y,m);--p}else n.forEach(k.add);return s=h=n=f=null,k}var o,a=Ce,l=ze;return(o=arguments.length)?(a=fr,l=sr,3===o&&(i=e,r=t,e=t=0),u(n)):(u.x=function(n){return arguments.length?(a=n,u):a},u.y=function(n){return arguments.length?(l=n,u):l},u.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),u):null==t?null:[[t,e],[r,i]]},u.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),u):null==t?null:[r-t,i-e]},u)},ao.interpolateRgb=vr,ao.interpolateObject=dr,ao.interpolateNumber=yr,ao.interpolateString=mr;var fl=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,sl=new RegExp(fl.source,"g");ao.interpolate=Mr,ao.interpolators=[function(n,t){var e=typeof t;return("string"===e?ra.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?vr:mr:t instanceof an?vr:Array.isArray(t)?xr:"object"===e&&isNaN(t)?dr:yr)(n,t)}],ao.interpolateArray=xr;var hl=function(){return m},pl=ao.map({linear:hl,poly:Er,quad:function(){return Sr},cubic:function(){return kr},sin:function(){return Ar},exp:function(){return Cr},circle:function(){return zr},elastic:Lr,back:qr,bounce:function(){return Tr}}),gl=ao.map({in:m,out:_r,"in-out":wr,"out-in":function(n){return wr(_r(n))}});ao.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=pl.get(e)||hl,r=gl.get(r)||m,br(r(e.apply(null,lo.call(arguments,1))))},ao.interpolateHcl=Rr,ao.interpolateHsl=Dr,ao.interpolateLab=Pr,ao.interpolateRound=Ur,ao.transform=function(n){var t=fo.createElementNS(ao.ns.prefix.svg,"g");return(ao.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new jr(e?e.matrix:vl)})(n)},jr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var vl={a:1,b:0,c:0,d:1,e:0,f:0};ao.interpolateTransform=$r,ao.layout={},ao.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},ao.layout.chord=function(){function n(){var n,c,s,h,p,g={},v=[],d=ao.range(u),y=[];for(e=[],r=[],n=0,h=-1;++h<u;){for(c=0,p=-1;++p<u;)c+=i[h][p];v.push(c),y.push(ao.range(u)),n+=c}for(o&&d.sort(function(n,t){return o(v[n],v[t])}),a&&y.forEach(function(n,t){n.sort(function(n,e){return a(i[t][n],i[t][e])})}),n=(jo-f*u)/n,c=0,h=-1;++h<u;){for(s=c,p=-1;++p<u;){var m=d[h],M=y[m][p],x=i[m][M],b=c,_=c+=x*n;g[m+"-"+M]={index:m,subindex:M,startAngle:b,endAngle:_,value:x}}r[m]={index:m,startAngle:s,endAngle:c,value:v[m]},c+=f}for(h=-1;++h<u;)for(p=h-1;++p<u;){var w=g[h+"-"+p],S=g[p+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}l&&t()}function t(){e.sort(function(n,t){return l((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,u,o,a,l,c={},f=0;return c.matrix=function(n){return arguments.length?(u=(i=n)&&i.length,e=r=null,c):i},c.padding=function(n){return arguments.length?(f=n,e=r=null,c):f},c.sortGroups=function(n){return arguments.length?(o=n,e=r=null,c):o},c.sortSubgroups=function(n){return arguments.length?(a=n,e=null,c):a},c.sortChords=function(n){return arguments.length?(l=n,e&&t(),c):l},c.chords=function(){return e||n(),e},c.groups=function(){return r||n(),r},c},ao.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var u=t.cx-n.x,o=t.cy-n.y,a=i-e,l=u*u+o*o;if(a*a/y<l){if(l<v){var c=t.charge/l;n.px-=u*c,n.py-=o*c}return!0}if(t.point&&l&&l<v){var c=t.pointCharge/l;n.px-=u*c,n.py-=o*c}}return!t.charge}}function t(n){n.px=ao.event.x,n.py=ao.event.y,l.resume()}var e,r,i,u,o,a,l={},c=ao.dispatch("start","tick","end"),f=[1,1],s=.9,h=dl,p=yl,g=-30,v=ml,d=.1,y=.64,M=[],x=[];return l.tick=function(){if((i*=.99)<.005)return e=null,c.end({type:"end",alpha:i=0}),!0;var t,r,l,h,p,v,y,m,b,_=M.length,w=x.length;for(r=0;r<w;++r)l=x[r],h=l.source,p=l.target,m=p.x-h.x,b=p.y-h.y,(v=m*m+b*b)&&(v=i*o[r]*((v=Math.sqrt(v))-u[r])/v,m*=v,b*=v,p.x-=m*(y=h.weight+p.weight?h.weight/(h.weight+p.weight):.5),p.y-=b*y,h.x+=m*(y=1-y),h.y+=b*y);if((y=i*d)&&(m=f[0]/2,b=f[1]/2,r=-1,y))for(;++r<_;)l=M[r],l.x+=(m-l.x)*y,l.y+=(b-l.y)*y;if(g)for(ri(t=ao.geom.quadtree(M),i,a),r=-1;++r<_;)(l=M[r]).fixed||t.visit(n(l));for(r=-1;++r<_;)l=M[r],l.fixed?(l.x=l.px,l.y=l.py):(l.x-=(l.px-(l.px=l.x))*s,l.y-=(l.py-(l.py=l.y))*s);c.tick({type:"tick",alpha:i})},l.nodes=function(n){return arguments.length?(M=n,l):M},l.links=function(n){return arguments.length?(x=n,l):x},l.size=function(n){return arguments.length?(f=n,l):f},l.linkDistance=function(n){return arguments.length?(h="function"==typeof n?n:+n,l):h},l.distance=l.linkDistance,l.linkStrength=function(n){return arguments.length?(p="function"==typeof n?n:+n,l):p},l.friction=function(n){return arguments.length?(s=+n,l):s},l.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,l):g},l.chargeDistance=function(n){return arguments.length?(v=n*n,l):Math.sqrt(v)},l.gravity=function(n){return arguments.length?(d=+n,l):d},l.theta=function(n){return arguments.length?(y=n*n,l):Math.sqrt(y)},l.alpha=function(n){return arguments.length?(n=+n,i?n>0?i=n:(e.c=null,e.t=NaN,e=null,c.end({type:"end",alpha:i=0})):n>0&&(c.start({type:"start",alpha:i=n}),e=qn(l.tick)),l):i},l.start=function(){function n(n,r){if(!e){for(e=new Array(i),l=0;l<i;++l)e[l]=[];for(l=0;l<c;++l){var u=x[l];e[u.source.index].push(u.target),e[u.target.index].push(u.source)}}for(var o,a=e[t],l=-1,f=a.length;++l<f;)if(!isNaN(o=a[l][n]))return o;return Math.random()*r}var t,e,r,i=M.length,c=x.length,s=f[0],v=f[1];for(t=0;t<i;++t)(r=M[t]).index=t,r.weight=0;for(t=0;t<c;++t)r=x[t],"number"==typeof r.source&&(r.source=M[r.source]),"number"==typeof r.target&&(r.target=M[r.target]),++r.source.weight,++r.target.weight;for(t=0;t<i;++t)r=M[t],isNaN(r.x)&&(r.x=n("x",s)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(u=[],"function"==typeof h)for(t=0;t<c;++t)u[t]=+h.call(this,x[t],t);else for(t=0;t<c;++t)u[t]=h;if(o=[],"function"==typeof p)for(t=0;t<c;++t)o[t]=+p.call(this,x[t],t);else for(t=0;t<c;++t)o[t]=p;if(a=[],"function"==typeof g)for(t=0;t<i;++t)a[t]=+g.call(this,M[t],t);else for(t=0;t<i;++t)a[t]=g;return l.resume()},l.resume=function(){return l.alpha(.1)},l.stop=function(){return l.alpha(0)},l.drag=function(){return r||(r=ao.behavior.drag().origin(m).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",ni)),arguments.length?void this.on("mouseover.force",ti).on("mouseout.force",ei).call(r):r},ao.rebind(l,c,"on")};var dl=20,yl=1,ml=1/0;ao.layout.hierarchy=function(){function n(i){var u,o=[i],a=[];for(i.depth=0;null!=(u=o.pop());)if(a.push(u),(c=e.call(n,u,u.depth))&&(l=c.length)){for(var l,c,f;--l>=0;)o.push(f=c[l]),f.parent=u,f.depth=u.depth+1;r&&(u.value=0),u.children=c}else r&&(u.value=+r.call(n,u,u.depth)||0),delete u.children;return oi(i,function(n){var e,i;t&&(e=n.children)&&e.sort(t),r&&(i=n.parent)&&(i.value+=n.value)}),a}var t=ci,e=ai,r=li;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(ui(t,function(n){n.children&&(n.value=0)}),oi(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},ao.layout.partition=function(){function n(t,e,r,i){var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(o=u.length)){var o,a,l,c=-1;for(r=t.value?r/t.value:0;++c<o;)n(a=u[c],e,l=a.value*r,i),e+=l}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,t(e[u]));return 1+r}function e(e,u){var o=r.call(this,e,u);return n(o[0],0,i[0],i[1]/t(o[0])),o}var r=ao.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},ii(e,r)},ao.layout.pie=function(){function n(o){var a,l=o.length,c=o.map(function(e,r){return+t.call(n,e,r)}),f=+("function"==typeof r?r.apply(this,arguments):r),s=("function"==typeof i?i.apply(this,arguments):i)-f,h=Math.min(Math.abs(s)/l,+("function"==typeof u?u.apply(this,arguments):u)),p=h*(s<0?-1:1),g=ao.sum(c),v=g?(s-l*p)/g:0,d=ao.range(l),y=[];return null!=e&&d.sort(e===Ml?function(n,t){return c[t]-c[n]}:function(n,t){return e(o[n],o[t])}),d.forEach(function(n){y[n]={data:o[n],value:a=c[n],startAngle:f,endAngle:f+=a*v+p,padAngle:h}}),y}var t=Number,e=Ml,r=0,i=jo,u=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n.padAngle=function(t){return arguments.length?(u=t,n):u},n};var Ml={};ao.layout.stack=function(){function n(a,l){if(!(h=a.length))return a;var c=a.map(function(e,r){return t.call(n,e,r)}),f=c.map(function(t){return t.map(function(t,e){return[u.call(n,t,e),o.call(n,t,e)]})}),s=e.call(n,f,l);c=ao.permute(c,s),f=ao.permute(f,s);var h,p,g,v,d=r.call(n,f,l),y=c[0].length;for(g=0;g<y;++g)for(i.call(n,c[0][g],v=d[g],f[0][g][1]),p=1;p<h;++p)i.call(n,c[p][g],v+=f[p-1][g][1],f[p][g][1]);return a}var t=m,e=gi,r=vi,i=pi,u=si,o=hi;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:xl.get(t)||gi,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:bl.get(t)||vi,n):r},n.x=function(t){return arguments.length?(u=t,n):u},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(i=t,n):i},n};var xl=ao.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(di),u=n.map(yi),o=ao.range(r).sort(function(n,t){return i[n]-i[t]}),a=0,l=0,c=[],f=[];for(t=0;t<r;++t)e=o[t],a<l?(a+=u[e],c.push(e)):(l+=u[e],f.push(e));return f.reverse().concat(c)},reverse:function(n){return ao.range(n.length).reverse()},default:gi}),bl=ao.map({silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,o=[],a=0,l=[];for(e=0;e<u;++e){for(t=0,r=0;t<i;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}for(e=0;e<u;++e)l[e]=(a-o[e])/2;return l},wiggle:function(n){var t,e,r,i,u,o,a,l,c,f=n.length,s=n[0],h=s.length,p=[];for(p[0]=l=c=0,e=1;e<h;++e){for(t=0,i=0;t<f;++t)i+=n[t][e][1];for(t=0,u=0,a=s[e][0]-s[e-1][0];t<f;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);r<t;++r)o+=(n[r][e][1]-n[r][e-1][1])/a;u+=o*n[t][e][1]}p[e]=l-=i?u/i*a:0,l<c&&(c=l)}for(e=0;e<h;++e)p[e]-=c;return p},expand:function(n){var t,e,r,i=n.length,u=n[0].length,o=1/i,a=[];for(e=0;e<u;++e){for(t=0,r=0;t<i;t++)r+=n[t][e][1];if(r)for(t=0;t<i;t++)n[t][e][1]/=r;else for(t=0;t<i;t++)n[t][e][1]=o}for(e=0;e<u;++e)a[e]=0;return a},zero:vi});ao.layout.histogram=function(){function n(n,u){for(var o,a,l=[],c=n.map(e,this),f=r.call(this,c,u),s=i.call(this,f,c,u),u=-1,h=c.length,p=s.length-1,g=t?1:1/h;++u<p;)o=l[u]=[],o.dx=s[u+1]-(o.x=s[u]),o.y=0;if(p>0)for(u=-1;++u<h;)a=c[u],a>=f[0]&&a<=f[1]&&(o=l[ao.bisect(s,a,1,p)-1],o.y+=g,o.push(n[u]));return l}var t=!0,e=Number,r=bi,i=Mi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=En(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return xi(n,t)}:En(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ao.layout.pack=function(){function n(n,u){var o=e.call(this,n,u),a=o[0],l=i[0],c=i[1],f=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(a.x=a.y=0,oi(a,function(n){n.r=+f(n.value)}),oi(a,Ni),r){var s=r*(t?1:Math.max(2*a.r/l,2*a.r/c))/2;oi(a,function(n){n.r+=s}),oi(a,Ni),oi(a,function(n){n.r-=s})}return Ci(a,l/2,c/2,t?1:1/Math.max(2*a.r/l,2*a.r/c)),o}var t,e=ao.layout.hierarchy().sort(_i),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},ii(n,e)},ao.layout.tree=function(){function n(n,i){var f=o.call(this,n,i),s=f[0],h=t(s);if(oi(h,e),h.parent.m=-h.z,ui(h,r),c)ui(s,u);else{var p=s,g=s,v=s;ui(s,function(n){n.x<p.x&&(p=n),n.x>g.x&&(g=n),n.depth>v.depth&&(v=n)});var d=a(p,g)/2-p.x,y=l[0]/(g.x+a(g,p)/2+d),m=l[1]/(v.depth||1);ui(s,function(n){n.x=(n.x+d)*y,n.y=n.depth*m})}return f}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var i,u=t.children,o=0,a=u.length;o<a;++o)r.push((u[o]=i={_:u[o],parent:t,children:(i=u[o].children)&&i.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:o}).a=i);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Di(n);var u=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+a(n._,r._),n.m=n.z-u):n.z=u}else r&&(n.z=r.z+a(n._,r._));n.parent.A=i(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function i(n,t,e){if(t){for(var r,i=n,u=n,o=t,l=i.parent.children[0],c=i.m,f=u.m,s=o.m,h=l.m;o=Ti(o),i=qi(i),o&&i;)l=qi(l),u=Ti(u),u.a=n,r=o.z+s-i.z-c+a(o._,i._),r>0&&(Ri(Pi(o,n,e),n,r),c+=r,f+=r),s+=o.m,c+=i.m,h+=l.m,f+=u.m;o&&!Ti(u)&&(u.t=o,u.m+=s-f),i&&!qi(l)&&(l.t=i,l.m+=c-h,e=n)}return e}function u(n){n.x*=l[0],n.y=n.depth*l[1]}var o=ao.layout.hierarchy().sort(null).value(null),a=Li,l=[1,1],c=null;return n.separation=function(t){return arguments.length?(a=t,n):a},n.size=function(t){return arguments.length?(c=null==(l=t)?u:null,n):c?null:l},n.nodeSize=function(t){return arguments.length?(c=null==(l=t)?null:u,n):c?l:null},ii(n,o)},ao.layout.cluster=function(){function n(n,u){var o,a=t.call(this,n,u),l=a[0],c=0;oi(l,function(n){var t=n.children;t&&t.length?(n.x=ji(t),n.y=Ui(t)):(n.x=o?c+=e(n,o):0,n.y=0,o=n)});var f=Fi(l),s=Hi(l),h=f.x-e(f,s)/2,p=s.x+e(s,f)/2;return oi(l,i?function(n){n.x=(n.x-l.x)*r[0],n.y=(l.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(p-h)*r[0],n.y=(1-(l.y?n.y/l.y:1))*r[1]}),a}var t=ao.layout.hierarchy().sort(null).value(null),e=Li,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ao.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(t<0?0:t),e.area=isNaN(r)||r<=0?0:r}function t(e){var u=e.children;if(u&&u.length){var o,a,l,c=s(e),f=[],h=u.slice(),g=1/0,v="slice"===p?c.dx:"dice"===p?c.dy:"slice-dice"===p?1&e.depth?c.dy:c.dx:Math.min(c.dx,c.dy);for(n(h,c.dx*c.dy/e.value),f.area=0;(l=h.length)>0;)f.push(o=h[l-1]),f.area+=o.area,"squarify"!==p||(a=r(f,v))<=g?(h.pop(),g=a):(f.area-=f.pop().area,i(f,v,c,!1),v=Math.min(c.dx,c.dy),f.length=f.area=0,g=1/0);f.length&&(i(f,v,c,!0),f.length=f.area=0),u.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var u,o=s(t),a=r.slice(),l=[];for(n(a,o.dx*o.dy/t.value),l.area=0;u=a.pop();)l.push(u),l.area+=u.area,null!=u.z&&(i(l,u.z?o.dx:o.dy,o,!a.length),l.length=l.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,u=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(e<u&&(u=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*g/r,r/(t*u*g)):1/0}function i(n,t,e,r){var i,u=-1,o=n.length,a=e.x,c=e.y,f=t?l(n.area/t):0;
if(t==e.dx){for((r||f>e.dy)&&(f=e.dy);++u<o;)i=n[u],i.x=a,i.y=c,i.dy=f,a+=i.dx=Math.min(e.x+e.dx-a,f?l(i.area/f):0);i.z=!0,i.dx+=e.x+e.dx-a,e.y+=f,e.dy-=f}else{for((r||f>e.dx)&&(f=e.dx);++u<o;)i=n[u],i.x=a,i.y=c,i.dx=f,c+=i.dy=Math.min(e.y+e.dy-c,f?l(i.area/f):0);i.z=!1,i.dy+=e.y+e.dy-c,e.x+=f,e.dx-=f}}function u(r){var i=o||a(r),u=i[0];return u.x=u.y=0,u.value?(u.dx=c[0],u.dy=c[1]):u.dx=u.dy=0,o&&a.revalue(u),n([u],u.dx*u.dy/u.value),(o?e:t)(u),h&&(o=i),i}var o,a=ao.layout.hierarchy(),l=Math.round,c=[1,1],f=null,s=Oi,h=!1,p="squarify",g=.5*(1+Math.sqrt(5));return u.size=function(n){return arguments.length?(c=n,u):c},u.padding=function(n){function t(t){var e=n.call(u,t,t.depth);return null==e?Oi(t):Ii(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Ii(t,n)}if(!arguments.length)return f;var r;return s=null==(f=n)?Oi:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,u},u.round=function(n){return arguments.length?(l=n?Math.round:Number,u):l!=Number},u.sticky=function(n){return arguments.length?(h=n,o=null,u):h},u.ratio=function(n){return arguments.length?(g=n,u):g},u.mode=function(n){return arguments.length?(p=n+"",u):p},ii(u,a)},ao.random={normal:function(n,t){var e=arguments.length;return e<2&&(t=1),e<1&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ao.random.normal.apply(ao,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=ao.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;e<n;e++)t+=Math.random();return t}}},ao.scale={};var _l={floor:m,ceil:m};ao.scale.linear=function(){return Wi([0,1],[0,1],Mr,!1)};var wl={s:1,g:1,p:1,r:1,e:1};ao.scale.log=function(){return ru(ao.scale.linear().domain([0,1]),10,!0,[1,10])};var Sl=ao.format(".0e"),kl={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ao.scale.pow=function(){return iu(ao.scale.linear(),1,[0,1])},ao.scale.sqrt=function(){return ao.scale.pow().exponent(.5)},ao.scale.ordinal=function(){return ou([],{t:"range",a:[[]]})},ao.scale.category10=function(){return ao.scale.ordinal().range(Nl)},ao.scale.category20=function(){return ao.scale.ordinal().range(El)},ao.scale.category20b=function(){return ao.scale.ordinal().range(Al)},ao.scale.category20c=function(){return ao.scale.ordinal().range(Cl)};var Nl=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(xn),El=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(xn),Al=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(xn),Cl=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(xn);ao.scale.quantile=function(){return au([],[])},ao.scale.quantize=function(){return lu(0,1,[0,1])},ao.scale.threshold=function(){return cu([.5],[0,1])},ao.scale.identity=function(){return fu([0,1])},ao.svg={},ao.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),c=Math.max(0,+r.apply(this,arguments)),f=o.apply(this,arguments)-Ho,s=a.apply(this,arguments)-Ho,h=Math.abs(s-f),p=f>s?0:1;if(c<n&&(g=c,c=n,n=g),h>=Fo)return t(c,p)+(n?t(n,1-p):"")+"Z";var g,v,d,y,m,M,x,b,_,w,S,k,N=0,E=0,A=[];if((y=(+l.apply(this,arguments)||0)/2)&&(d=u===zl?Math.sqrt(n*n+c*c):+u.apply(this,arguments),p||(E*=-1),c&&(E=tn(d/c*Math.sin(y))),n&&(N=tn(d/n*Math.sin(y)))),c){m=c*Math.cos(f+E),M=c*Math.sin(f+E),x=c*Math.cos(s-E),b=c*Math.sin(s-E);var C=Math.abs(s-f-2*E)<=Uo?0:1;if(E&&yu(m,M,x,b)===p^C){var z=(f+s)/2;m=c*Math.cos(z),M=c*Math.sin(z),x=b=null}}else m=M=0;if(n){_=n*Math.cos(s-N),w=n*Math.sin(s-N),S=n*Math.cos(f+N),k=n*Math.sin(f+N);var L=Math.abs(f-s+2*N)<=Uo?0:1;if(N&&yu(_,w,S,k)===1-p^L){var q=(f+s)/2;_=n*Math.cos(q),w=n*Math.sin(q),S=k=null}}else _=w=0;if(h>Do&&(g=Math.min(Math.abs(c-n)/2,+i.apply(this,arguments)))>.001){v=n<c^p?0:1;var T=g,R=g;if(h<Uo){var D=null==S?[_,w]:null==x?[m,M]:Re([m,M],[S,k],[x,b],[_,w]),P=m-D[0],U=M-D[1],j=x-D[0],F=b-D[1],H=1/Math.sin(Math.acos((P*j+U*F)/(Math.sqrt(P*P+U*U)*Math.sqrt(j*j+F*F)))/2),O=Math.sqrt(D[0]*D[0]+D[1]*D[1]);R=Math.min(g,(n-O)/(H-1)),T=Math.min(g,(c-O)/(H+1))}if(null!=x){var I=mu(null==S?[_,w]:[S,k],[m,M],c,T,p),Y=mu([x,b],[_,w],c,T,p);g===T?A.push("M",I[0],"A",T,",",T," 0 0,",v," ",I[1],"A",c,",",c," 0 ",1-p^yu(I[1][0],I[1][1],Y[1][0],Y[1][1]),",",p," ",Y[1],"A",T,",",T," 0 0,",v," ",Y[0]):A.push("M",I[0],"A",T,",",T," 0 1,",v," ",Y[0])}else A.push("M",m,",",M);if(null!=S){var Z=mu([m,M],[S,k],n,-R,p),V=mu([_,w],null==x?[m,M]:[x,b],n,-R,p);g===R?A.push("L",V[0],"A",R,",",R," 0 0,",v," ",V[1],"A",n,",",n," 0 ",p^yu(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-p," ",Z[1],"A",R,",",R," 0 0,",v," ",Z[0]):A.push("L",V[0],"A",R,",",R," 0 0,",v," ",Z[0])}else A.push("L",_,",",w)}else A.push("M",m,",",M),null!=x&&A.push("A",c,",",c," 0 ",C,",",p," ",x,",",b),A.push("L",_,",",w),null!=S&&A.push("A",n,",",n," 0 ",L,",",1-p," ",S,",",k);return A.push("Z"),A.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=hu,r=pu,i=su,u=zl,o=gu,a=vu,l=du;return n.innerRadius=function(t){return arguments.length?(e=En(t),n):e},n.outerRadius=function(t){return arguments.length?(r=En(t),n):r},n.cornerRadius=function(t){return arguments.length?(i=En(t),n):i},n.padRadius=function(t){return arguments.length?(u=t==zl?zl:En(t),n):u},n.startAngle=function(t){return arguments.length?(o=En(t),n):o},n.endAngle=function(t){return arguments.length?(a=En(t),n):a},n.padAngle=function(t){return arguments.length?(l=En(t),n):l},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+o.apply(this,arguments)+ +a.apply(this,arguments))/2-Ho;return[Math.cos(t)*n,Math.sin(t)*n]},n};var zl="auto";ao.svg.line=function(){return Mu(m)};var Ll=ao.map({linear:xu,"linear-closed":bu,step:_u,"step-before":wu,"step-after":Su,basis:zu,"basis-open":Lu,"basis-closed":qu,bundle:Tu,cardinal:Eu,"cardinal-open":ku,"cardinal-closed":Nu,monotone:Fu});Ll.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var ql=[0,2/3,1/3,0],Tl=[0,1/3,2/3,0],Rl=[0,1/6,2/3,1/6];ao.svg.line.radial=function(){var n=Mu(Hu);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},wu.reverse=Su,Su.reverse=wu,ao.svg.area=function(){return Ou(m)},ao.svg.area.radial=function(){var n=Ou(Hu);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ao.svg.chord=function(){function n(n,a){var l=t(this,u,n,a),c=t(this,o,n,a);return"M"+l.p0+r(l.r,l.p1,l.a1-l.a0)+(e(l,c)?i(l.r,l.p1,l.r,l.p0):i(l.r,l.p1,c.r,c.p0)+r(c.r,c.p1,c.a1-c.a0)+i(c.r,c.p1,l.r,l.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),u=a.call(n,i,r),o=l.call(n,i,r)-Ho,f=c.call(n,i,r)-Ho;return{r:u,a0:o,a1:f,p0:[u*Math.cos(o),u*Math.sin(o)],p1:[u*Math.cos(f),u*Math.sin(f)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Uo)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var u=Me,o=xe,a=Iu,l=gu,c=vu;return n.radius=function(t){return arguments.length?(a=En(t),n):a},n.source=function(t){return arguments.length?(u=En(t),n):u},n.target=function(t){return arguments.length?(o=En(t),n):o},n.startAngle=function(t){return arguments.length?(l=En(t),n):l},n.endAngle=function(t){return arguments.length?(c=En(t),n):c},n},ao.svg.diagonal=function(){function n(n,i){var u=t.call(this,n,i),o=e.call(this,n,i),a=(u.y+o.y)/2,l=[u,{x:u.x,y:a},{x:o.x,y:a},o];return l=l.map(r),"M"+l[0]+"C"+l[1]+" "+l[2]+" "+l[3]}var t=Me,e=xe,r=Yu;return n.source=function(e){return arguments.length?(t=En(e),n):t},n.target=function(t){return arguments.length?(e=En(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ao.svg.diagonal.radial=function(){var n=ao.svg.diagonal(),t=Yu,e=n.projection;return n.projection=function(n){return arguments.length?e(Zu(t=n)):t},n},ao.svg.symbol=function(){function n(n,r){return(Dl.get(t.call(this,n,r))||$u)(e.call(this,n,r))}var t=Xu,e=Vu;return n.type=function(e){return arguments.length?(t=En(e),n):t},n.size=function(t){return arguments.length?(e=En(t),n):e},n};var Dl=ao.map({circle:$u,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Ul)),e=t*Ul;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Pl),e=t*Pl/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Pl),e=t*Pl/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ao.svg.symbolTypes=Dl.keys();var Pl=Math.sqrt(3),Ul=Math.tan(30*Oo);Eo.transition=function(n){for(var t,e,r=jl||++Il,i=Ku(n),u=[],o=Fl||{time:Date.now(),ease:Nr,delay:0,duration:250},a=-1,l=this.length;++a<l;){u.push(t=[]);for(var c=this[a],f=-1,s=c.length;++f<s;)(e=c[f])&&Qu(e,f,i,r,o),t.push(e)}return Wu(u,i,r)},Eo.interrupt=function(n){return this.each(null==n?Hl:Bu(Ku(n)))};var jl,Fl,Hl=Bu(Ku()),Ol=[],Il=0;Ol.call=Eo.call,Ol.empty=Eo.empty,Ol.node=Eo.node,Ol.size=Eo.size,ao.transition=function(n,t){return n&&n.transition?jl?n.transition(t):n:ao.selection().transition(n)},ao.transition.prototype=Ol,Ol.select=function(n){var t,e,r,i=this.id,u=this.namespace,o=[];n=A(n);for(var a=-1,l=this.length;++a<l;){o.push(t=[]);for(var c=this[a],f=-1,s=c.length;++f<s;)(r=c[f])&&(e=n.call(r,r.__data__,f,a))?("__data__"in r&&(e.__data__=r.__data__),Qu(e,f,u,i,r[u][i]),t.push(e)):t.push(null)}return Wu(o,u,i)},Ol.selectAll=function(n){var t,e,r,i,u,o=this.id,a=this.namespace,l=[];n=C(n);for(var c=-1,f=this.length;++c<f;)for(var s=this[c],h=-1,p=s.length;++h<p;)if(r=s[h]){u=r[a][o],e=n.call(r,r.__data__,h,c),l.push(t=[]);for(var g=-1,v=e.length;++g<v;)(i=e[g])&&Qu(i,g,a,o,u),t.push(i)}return Wu(l,a,o)},Ol.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=O(n));for(var u=0,o=this.length;u<o;u++){i.push(t=[]);for(var e=this[u],a=0,l=e.length;a<l;a++)(r=e[a])&&n.call(r,r.__data__,a,u)&&t.push(r)}return Wu(i,this.namespace,this.id)},Ol.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Y(this,null==t?function(t){t[r][e].tween.remove(n)}:function(i){i[r][e].tween.set(n,t)})},Ol.attr=function(n,t){function e(){this.removeAttribute(a)}function r(){this.removeAttributeNS(a.space,a.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(a);return e!==n&&(t=o(e,n),function(n){this.setAttribute(a,t(n))})})}function u(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(a.space,a.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(a.space,a.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?$r:Mr,a=ao.ns.qualify(n);return Ju(this,"attr."+n,t,a.local?u:i)},Ol.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ao.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},Ol.style=function(n,e,r){function i(){this.style.removeProperty(n)}function u(e){return null==e?i:(e+="",function(){var i,u=t(this).getComputedStyle(this,null).getPropertyValue(n);return u!==e&&(i=Mr(u,e),function(t){this.style.setProperty(n,i(t),r)})})}var o=arguments.length;if(o<3){if("string"!=typeof n){o<2&&(e="");for(r in n)this.style(r,n[r],e);return this}r=""}return Ju(this,"style."+n,e,u)},Ol.styleTween=function(n,e,r){function i(i,u){var o=e.call(this,i,u,t(this).getComputedStyle(this,null).getPropertyValue(n));return o&&function(t){this.style.setProperty(n,o(t),r)}}return arguments.length<3&&(r=""),this.tween("style."+n,i)},Ol.text=function(n){return Ju(this,"text",n,Gu)},Ol.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Ol.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=ao.ease.apply(ao,arguments)),Y(this,function(r){r[e][t].ease=n}))},Ol.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Y(this,"function"==typeof n?function(r,i,u){r[e][t].delay=+n.call(r,r.__data__,i,u)}:(n=+n,function(r){r[e][t].delay=n}))},Ol.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Y(this,"function"==typeof n?function(r,i,u){r[e][t].duration=Math.max(1,n.call(r,r.__data__,i,u))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Ol.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var i=Fl,u=jl;try{jl=e,Y(this,function(t,i,u){Fl=t[r][e],n.call(t,t.__data__,i,u)})}finally{Fl=i,jl=u}}else Y(this,function(i){var u=i[r][e];(u.event||(u.event=ao.dispatch("start","end","interrupt"))).on(n,t)});return this},Ol.transition=function(){for(var n,t,e,r,i=this.id,u=++Il,o=this.namespace,a=[],l=0,c=this.length;l<c;l++){a.push(n=[]);for(var t=this[l],f=0,s=t.length;f<s;f++)(e=t[f])&&(r=e[o][i],Qu(e,f,o,u,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return Wu(a,o,u)},ao.svg.axis=function(){function n(n){n.each(function(){var n,c=ao.select(this),f=this.__chart__||e,s=this.__chart__=e.copy(),h=null==l?s.ticks?s.ticks.apply(s,a):s.domain():l,p=null==t?s.tickFormat?s.tickFormat.apply(s,a):m:t,g=c.selectAll(".tick").data(h,s),v=g.enter().insert("g",".domain").attr("class","tick").style("opacity",Do),d=ao.transition(g.exit()).style("opacity",Do).remove(),y=ao.transition(g.order()).style("opacity",1),M=Math.max(i,0)+o,x=Zi(s),b=c.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),ao.transition(b));v.append("line"),v.append("text");var w,S,k,N,E=v.select("line"),A=y.select("line"),C=g.select("text").text(p),z=v.select("text"),L=y.select("text"),q="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=no,w="x",k="y",S="x2",N="y2",C.attr("dy",q<0?"0em":".71em").style("text-anchor","middle"),_.attr("d","M"+x[0]+","+q*u+"V0H"+x[1]+"V"+q*u)):(n=to,w="y",k="x",S="y2",N="x2",C.attr("dy",".32em").style("text-anchor",q<0?"end":"start"),_.attr("d","M"+q*u+","+x[0]+"H0V"+x[1]+"H"+q*u)),E.attr(N,q*i),z.attr(k,q*M),A.attr(S,0).attr(N,q*i),L.attr(w,0).attr(k,q*M),s.rangeBand){var T=s,R=T.rangeBand()/2;f=s=function(n){return T(n)+R}}else f.rangeBand?f=s:d.call(n,s,f);v.call(n,f,s),y.call(n,s,s)})}var t,e=ao.scale.linear(),r=Yl,i=6,u=6,o=3,a=[10],l=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Zl?t+"":Yl,n):r},n.ticks=function(){return arguments.length?(a=co(arguments),n):a},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(i=+t,u=+arguments[e-1],n):i},n.innerTickSize=function(t){return arguments.length?(i=+t,n):i},n.outerTickSize=function(t){return arguments.length?(u=+t,n):u},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var Yl="bottom",Zl={top:1,right:1,bottom:1,left:1};ao.svg.brush=function(){function n(t){t.each(function(){var t=ao.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",u).on("touchstart.brush",u),o=t.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var a=t.selectAll(".resize").data(v,m);a.exit().remove(),a.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Vl[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),a.style("display",n.empty()?"none":null);var l,s=ao.transition(t),h=ao.transition(o);c&&(l=Zi(c),h.attr("x",l[0]).attr("width",l[1]-l[0]),r(s)),f&&(l=Zi(f),h.attr("y",l[0]).attr("height",l[1]-l[0]),i(s)),e(s)})}function e(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function r(n){n.select(".extent").attr("x",s[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1]-s[0])}function i(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function u(){function u(){32==ao.event.keyCode&&(C||(M=null,L[0]-=s[1],L[1]-=h[1],C=2),S())}function v(){32==ao.event.keyCode&&2==C&&(L[0]+=s[1],L[1]+=h[1],C=0,S())}function d(){var n=ao.mouse(b),t=!1;x&&(n[0]+=x[0],n[1]+=x[1]),C||(ao.event.altKey?(M||(M=[(s[0]+s[1])/2,(h[0]+h[1])/2]),L[0]=s[+(n[0]<M[0])],L[1]=h[+(n[1]<M[1])]):M=null),E&&y(n,c,0)&&(r(k),t=!0),A&&y(n,f,1)&&(i(k),t=!0),t&&(e(k),w({type:"brush",mode:C?"move":"resize"}))}function y(n,t,e){var r,i,u=Zi(t),l=u[0],c=u[1],f=L[e],v=e?h:s,d=v[1]-v[0];if(C&&(l-=f,c-=d+f),r=(e?g:p)?Math.max(l,Math.min(c,n[e])):n[e],C?i=(r+=f)+d:(M&&(f=Math.max(l,Math.min(c,2*M[e]-r))),f<r?(i=r,r=f):i=f),v[0]!=r||v[1]!=i)return e?a=null:o=null,v[0]=r,v[1]=i,!0}function m(){d(),k.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ao.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),z(),w({type:"brushend"})}var M,x,b=this,_=ao.select(ao.event.target),w=l.of(b,arguments),k=ao.select(b),N=_.datum(),E=!/^(n|s)$/.test(N)&&c,A=!/^(e|w)$/.test(N)&&f,C=_.classed("extent"),z=W(b),L=ao.mouse(b),q=ao.select(t(b)).on("keydown.brush",u).on("keyup.brush",v);if(ao.event.changedTouches?q.on("touchmove.brush",d).on("touchend.brush",m):q.on("mousemove.brush",d).on("mouseup.brush",m),k.interrupt().selectAll("*").interrupt(),C)L[0]=s[0]-L[0],L[1]=h[0]-L[1];else if(N){var T=+/w$/.test(N),R=+/^n/.test(N);x=[s[1-T]-L[0],h[1-R]-L[1]],L[0]=s[T],L[1]=h[R]}else ao.event.altKey&&(M=L.slice());k.style("pointer-events","none").selectAll(".resize").style("display",null),ao.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),d()}var o,a,l=N(n,"brushstart","brush","brushend"),c=null,f=null,s=[0,0],h=[0,0],p=!0,g=!0,v=Xl[0];return n.event=function(n){n.each(function(){var n=l.of(this,arguments),t={x:s,y:h,i:o,j:a},e=this.__chart__||t;this.__chart__=t,jl?ao.select(this).transition().each("start.brush",function(){o=e.i,a=e.j,s=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=xr(s,t.x),r=xr(h,t.y);return o=a=null,function(i){s=t.x=e(i),h=t.y=r(i),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){o=t.i,a=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,v=Xl[!c<<1|!f],n):c},n.y=function(t){return arguments.length?(f=t,v=Xl[!c<<1|!f],n):f},n.clamp=function(t){return arguments.length?(c&&f?(p=!!t[0],g=!!t[1]):c?p=!!t:f&&(g=!!t),n):c&&f?[p,g]:c?p:f?g:null},n.extent=function(t){var e,r,i,u,l;return arguments.length?(c&&(e=t[0],r=t[1],f&&(e=e[0],r=r[0]),o=[e,r],c.invert&&(e=c(e),r=c(r)),r<e&&(l=e,e=r,r=l),e==s[0]&&r==s[1]||(s=[e,r])),f&&(i=t[0],u=t[1],c&&(i=i[1],u=u[1]),a=[i,u],f.invert&&(i=f(i),u=f(u)),u<i&&(l=i,i=u,u=l),i==h[0]&&u==h[1]||(h=[i,u])),n):(c&&(o?(e=o[0],r=o[1]):(e=s[0],r=s[1],c.invert&&(e=c.invert(e),r=c.invert(r)),r<e&&(l=e,e=r,r=l))),f&&(a?(i=a[0],u=a[1]):(i=h[0],u=h[1],f.invert&&(i=f.invert(i),u=f.invert(u)),u<i&&(l=i,i=u,u=l))),c&&f?[[e,i],[r,u]]:c?[e,r]:f&&[i,u])},n.clear=function(){return n.empty()||(s=[0,0],h=[0,0],o=a=null),n},n.empty=function(){return!!c&&s[0]==s[1]||!!f&&h[0]==h[1]},ao.rebind(n,l,"on")};var Vl={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Xl=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],$l=ha.format=ma.timeFormat,Bl=$l.utc,Wl=Bl("%Y-%m-%dT%H:%M:%S.%LZ");$l.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?eo:Wl,eo.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},eo.toString=Wl.toString,ha.second=On(function(n){return new pa(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ha.seconds=ha.second.range,ha.seconds.utc=ha.second.utc.range,ha.minute=On(function(n){return new pa(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ha.minutes=ha.minute.range,ha.minutes.utc=ha.minute.utc.range,ha.hour=On(function(n){var t=n.getTimezoneOffset()/60;return new pa(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ha.hours=ha.hour.range,ha.hours.utc=ha.hour.utc.range,ha.month=On(function(n){return n=ha.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ha.months=ha.month.range,ha.months.utc=ha.month.utc.range;var Jl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],Gl=[[ha.second,1],[ha.second,5],[ha.second,15],[ha.second,30],[ha.minute,1],[ha.minute,5],[ha.minute,15],[ha.minute,30],[ha.hour,1],[ha.hour,3],[ha.hour,6],[ha.hour,12],[ha.day,1],[ha.day,2],[ha.week,1],[ha.month,1],[ha.month,3],[ha.year,1]],Kl=$l.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",zt]]),Ql={range:function(n,t,e){return ao.range(Math.ceil(n/e)*e,+t,e).map(io)},floor:m,ceil:m};Gl.year=ha.year,ha.scale=function(){return ro(ao.scale.linear(),Gl,Kl)};var nc=Gl.map(function(n){return[n[0].utc,n[1]]}),tc=Bl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",zt]]);nc.year=ha.year.utc,ha.scale.utc=function(){return ro(ao.scale.linear(),nc,tc)},ao.text=An(function(n){return n.responseText}),ao.json=function(n,t){return Cn(n,"application/json",uo,t)},ao.html=function(n,t){return Cn(n,"text/html",oo,t)},ao.xml=An(function(n){return n.responseXML}),"function"==typeof define&&define.amd?(this.d3=ao,define(ao)):"object"==typeof module&&module.exports?module.exports=ao:this.d3=ao}();

},{}],47:[function(require,module,exports){
exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:(s?-1:1)*(1/0);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l};

},{}],48:[function(require,module,exports){
var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)};

},{}],49:[function(require,module,exports){
!function(e,t){"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){function n(e){var t=!!e&&"length"in e&&e.length,n=oe.type(e);return"function"!==n&&!oe.isWindow(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}function r(e,t,n){if(oe.isFunction(t))return oe.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return oe.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(ge.test(t))return oe.filter(t,e,n);t=oe.filter(t,e)}return oe.grep(e,function(e){return Z.call(t,e)>-1!==n})}function i(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}function o(e){var t={};return oe.each(e.match(we)||[],function(e,n){t[n]=!0}),t}function s(){G.removeEventListener("DOMContentLoaded",s),e.removeEventListener("load",s),oe.ready()}function a(){this.expando=oe.expando+a.uid++}function u(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(je,"-$&").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n||"false"!==n&&("null"===n?null:+n+""===n?+n:Se.test(n)?oe.parseJSON(n):n)}catch(e){}Ne.set(e,t,n)}else n=void 0;return n}function l(e,t,n,r){var i,o=1,s=20,a=r?function(){return r.cur()}:function(){return oe.css(e,t,"")},u=a(),l=n&&n[3]||(oe.cssNumber[t]?"":"px"),c=(oe.cssNumber[t]||"px"!==l&&+u)&&Ae.exec(oe.css(e,t));if(c&&c[3]!==l){l=l||c[3],n=n||[],c=+u||1;do o=o||".5",c/=o,oe.style(e,t,c+l);while(o!==(o=a()/u)&&1!==o&&--s)}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}function c(e,t){var n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[];return void 0===t||t&&oe.nodeName(e,t)?oe.merge([e],n):n}function f(e,t){for(var n=0,r=e.length;n<r;n++)Ee.set(e[n],"globalEval",!t||Ee.get(t[n],"globalEval"))}function p(e,t,n,r,i){for(var o,s,a,u,l,p,d=t.createDocumentFragment(),h=[],g=0,v=e.length;g<v;g++)if(o=e[g],o||0===o)if("object"===oe.type(o))oe.merge(h,o.nodeType?[o]:o);else if(Re.test(o)){for(s=s||d.appendChild(t.createElement("div")),a=(Oe.exec(o)||["",""])[1].toLowerCase(),u=Pe[a]||Pe._default,s.innerHTML=u[1]+oe.htmlPrefilter(o)+u[2],p=u[0];p--;)s=s.lastChild;oe.merge(h,s.childNodes),s=d.firstChild,s.textContent=""}else h.push(t.createTextNode(o));for(d.textContent="",g=0;o=h[g++];)if(r&&oe.inArray(o,r)>-1)i&&i.push(o);else if(l=oe.contains(o.ownerDocument,o),s=c(d.appendChild(o),"script"),l&&f(s),n)for(p=0;o=s[p++];)Fe.test(o.type||"")&&n.push(o);return d}function d(){return!0}function h(){return!1}function g(){try{return G.activeElement}catch(e){}}function v(e,t,n,r,i,o){var s,a;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(a in t)v(e,a,n,r,t[a],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),i===!1)i=h;else if(!i)return e;return 1===o&&(s=i,i=function(e){return oe().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=oe.guid++)),e.each(function(){oe.event.add(this,t,i,r,n)})}function m(e,t){return oe.nodeName(e,"table")&&oe.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function y(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function x(e){var t=Xe.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function b(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(Ee.hasData(e)&&(o=Ee.access(e),s=Ee.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)oe.event.add(t,i,l[i][n])}Ne.hasData(e)&&(a=Ne.access(e),u=oe.extend({},a),Ne.set(t,u))}}function w(e,t){var n=t.nodeName.toLowerCase();"input"===n&&He.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function T(e,t,n,r){t=J.apply([],t);var i,o,s,a,u,l,f=0,d=e.length,h=d-1,g=t[0],v=oe.isFunction(g);if(v||d>1&&"string"==typeof g&&!re.checkClone&&_e.test(g))return e.each(function(i){var o=e.eq(i);v&&(t[0]=g.call(this,i,o.html())),T(o,t,n,r)});if(d&&(i=p(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(s=oe.map(c(i,"script"),y),a=s.length;f<d;f++)u=i,f!==h&&(u=oe.clone(u,!0,!0),a&&oe.merge(s,c(u,"script"))),n.call(e[f],u,f);if(a)for(l=s[s.length-1].ownerDocument,oe.map(s,x),f=0;f<a;f++)u=s[f],Fe.test(u.type||"")&&!Ee.access(u,"globalEval")&&oe.contains(l,u)&&(u.src?oe._evalUrl&&oe._evalUrl(u.src):oe.globalEval(u.textContent.replace(ze,"")))}return e}function C(e,t,n){for(var r,i=t?oe.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||oe.cleanData(c(r)),r.parentNode&&(n&&oe.contains(r.ownerDocument,r)&&f(c(r,"script")),r.parentNode.removeChild(r));return e}function k(e,t){var n=oe(t.createElement(e)).appendTo(t.body),r=oe.css(n[0],"display");return n.detach(),r}function E(e){var t=G,n=Ve[e];return n||(n=k(e,t),"none"!==n&&n||(Ue=(Ue||oe("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),t=Ue[0].contentDocument,t.write(),t.close(),n=k(e,t),Ue.detach()),Ve[e]=n),n}function N(e,t,n){var r,i,o,s,a=e.style;return n=n||Qe(e),s=n?n.getPropertyValue(t)||n[t]:void 0,""!==s&&void 0!==s||oe.contains(e.ownerDocument,e)||(s=oe.style(e,t)),n&&!re.pixelMarginRight()&&Ge.test(s)&&Ye.test(t)&&(r=a.width,i=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=r,a.minWidth=i,a.maxWidth=o),void 0!==s?s+"":s}function S(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function j(e){if(e in rt)return e;for(var t=e[0].toUpperCase()+e.slice(1),n=nt.length;n--;)if(e=nt[n]+t,e in rt)return e}function D(e,t,n){var r=Ae.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function A(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;o<4;o+=2)"margin"===n&&(s+=oe.css(e,n+qe[o],!0,i)),r?("content"===n&&(s-=oe.css(e,"padding"+qe[o],!0,i)),"margin"!==n&&(s-=oe.css(e,"border"+qe[o]+"Width",!0,i))):(s+=oe.css(e,"padding"+qe[o],!0,i),"padding"!==n&&(s+=oe.css(e,"border"+qe[o]+"Width",!0,i)));return s}function q(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Qe(e),s="border-box"===oe.css(e,"boxSizing",!1,o);if(i<=0||null==i){if(i=N(e,t,o),(i<0||null==i)&&(i=e.style[t]),Ge.test(i))return i;r=s&&(re.boxSizingReliable()||i===e.style[t]),i=parseFloat(i)||0}return i+A(e,t,n||(s?"border":"content"),r,o)+"px"}function L(e,t){for(var n,r,i,o=[],s=0,a=e.length;s<a;s++)r=e[s],r.style&&(o[s]=Ee.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Le(r)&&(o[s]=Ee.access(r,"olddisplay",E(r.nodeName)))):(i=Le(r),"none"===n&&i||Ee.set(r,"olddisplay",i?n:oe.css(r,"display"))));for(s=0;s<a;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}function H(e,t,n,r,i){return new H.prototype.init(e,t,n,r,i)}function O(){return e.setTimeout(function(){it=void 0}),it=oe.now()}function F(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)n=qe[r],i["margin"+n]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function P(e,t,n){for(var r,i=(I.tweeners[t]||[]).concat(I.tweeners["*"]),o=0,s=i.length;o<s;o++)if(r=i[o].call(n,t,e))return r}function R(e,t,n){var r,i,o,s,a,u,l,c,f=this,p={},d=e.style,h=e.nodeType&&Le(e),g=Ee.get(e,"fxshow");n.queue||(a=oe._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,f.always(function(){f.always(function(){a.unqueued--,oe.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],l=oe.css(e,"display"),c="none"===l?Ee.get(e,"olddisplay")||E(e.nodeName):l,"inline"===c&&"none"===oe.css(e,"float")&&(d.display="inline-block")),n.overflow&&(d.overflow="hidden",f.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],st.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(h?"hide":"show")){if("show"!==i||!g||void 0===g[r])continue;h=!0}p[r]=g&&g[r]||oe.style(e,r)}else l=void 0;if(oe.isEmptyObject(p))"inline"===("none"===l?E(e.nodeName):l)&&(d.display=l);else{g?"hidden"in g&&(h=g.hidden):g=Ee.access(e,"fxshow",{}),o&&(g.hidden=!h),h?oe(e).show():f.done(function(){oe(e).hide()}),f.done(function(){var t;Ee.remove(e,"fxshow");for(t in p)oe.style(e,t,p[t])});for(r in p)s=P(h?g[r]:0,r,f),r in g||(g[r]=s.start,h&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function M(e,t){var n,r,i,o,s;for(n in e)if(r=oe.camelCase(n),i=t[r],o=e[n],oe.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=oe.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function I(e,t,n){var r,i,o=0,s=I.prefilters.length,a=oe.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=it||O(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;s<u;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),o<1&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:oe.extend({},t),opts:oe.extend(!0,{specialEasing:{},easing:oe.easing._default},n),originalProperties:t,originalOptions:n,startTime:it||O(),duration:n.duration,tweens:[],createTween:function(t,n){var r=oe.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(a.notifyWith(e,[l,1,0]),a.resolveWith(e,[l,t])):a.rejectWith(e,[l,t]),this}}),c=l.props;for(M(c,l.opts.specialEasing);o<s;o++)if(r=I.prefilters[o].call(l,e,c,l.opts))return oe.isFunction(r.stop)&&(oe._queueHooks(l.elem,l.opts.queue).stop=oe.proxy(r.stop,r)),r;return oe.map(c,P,l),oe.isFunction(l.opts.start)&&l.opts.start.call(e,l),oe.fx.timer(oe.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function W(e){return e.getAttribute&&e.getAttribute("class")||""}function $(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(we)||[];if(oe.isFunction(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function B(e,t,n,r){function i(a){var u;return o[a]=!0,oe.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||s||o[l]?s?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1)}),u}var o={},s=e===Nt;return i(t.dataTypes[0])||!o["*"]&&i("*")}function _(e,t){var n,r,i=oe.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&oe.extend(!0,e,r),e}function X(e,t,n){for(var r,i,o,s,a=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}if(o)return o!==u[0]&&u.unshift(o),n[o]}function z(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e.throws)t=s(t);else try{t=s(t)}catch(e){return{state:"parsererror",error:s?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}function U(e,t,n,r){var i;if(oe.isArray(t))oe.each(t,function(t,i){n||At.test(e)?r(e,i):U(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==oe.type(t))r(e,t);else for(i in t)U(e+"["+i+"]",t[i],n,r)}function V(e){return oe.isWindow(e)?e:9===e.nodeType&&e.defaultView}var Y=[],G=e.document,Q=Y.slice,J=Y.concat,K=Y.push,Z=Y.indexOf,ee={},te=ee.toString,ne=ee.hasOwnProperty,re={},ie="2.2.4",oe=function(e,t){return new oe.fn.init(e,t)},se=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,ae=/^-ms-/,ue=/-([\da-z])/gi,le=function(e,t){return t.toUpperCase()};oe.fn=oe.prototype={jquery:ie,constructor:oe,selector:"",length:0,toArray:function(){return Q.call(this)},get:function(e){return null!=e?e<0?this[e+this.length]:this[e]:Q.call(this)},pushStack:function(e){var t=oe.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e){return oe.each(this,e)},map:function(e){return this.pushStack(oe.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(Q.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:K,sort:Y.sort,splice:Y.splice},oe.extend=oe.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[a]||{},a++),"object"==typeof s||oe.isFunction(s)||(s={}),a===u&&(s=this,a--);a<u;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(oe.isPlainObject(r)||(i=oe.isArray(r)))?(i?(i=!1,o=n&&oe.isArray(n)?n:[]):o=n&&oe.isPlainObject(n)?n:{},s[t]=oe.extend(l,o,r)):void 0!==r&&(s[t]=r));return s},oe.extend({expando:"jQuery"+(ie+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===oe.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){var t=e&&e.toString();return!oe.isArray(e)&&t-parseFloat(t)+1>=0},isPlainObject:function(e){var t;if("object"!==oe.type(e)||e.nodeType||oe.isWindow(e))return!1;if(e.constructor&&!ne.call(e,"constructor")&&!ne.call(e.constructor.prototype||{},"isPrototypeOf"))return!1;for(t in e);return void 0===t||ne.call(e,t)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?ee[te.call(e)]||"object":typeof e},globalEval:function(e){var t,n=eval;e=oe.trim(e),e&&(1===e.indexOf("use strict")?(t=G.createElement("script"),t.text=e,G.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(ae,"ms-").replace(ue,le)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t){var r,i=0;if(n(e))for(r=e.length;i<r&&t.call(e[i],i,e[i])!==!1;i++);else for(i in e)if(t.call(e[i],i,e[i])===!1)break;return e},trim:function(e){return null==e?"":(e+"").replace(se,"")},makeArray:function(e,t){var r=t||[];return null!=e&&(n(Object(e))?oe.merge(r,"string"==typeof e?[e]:e):K.call(r,e)),r},inArray:function(e,t,n){return null==t?-1:Z.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,s=e.length,a=!n;o<s;o++)r=!t(e[o],o),r!==a&&i.push(e[o]);return i},map:function(e,t,r){var i,o,s=0,a=[];if(n(e))for(i=e.length;s<i;s++)o=t(e[s],s,r),null!=o&&a.push(o);else for(s in e)o=t(e[s],s,r),null!=o&&a.push(o);return J.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),oe.isFunction(e))return r=Q.call(arguments,2),i=function(){return e.apply(t||this,r.concat(Q.call(arguments)))},i.guid=e.guid=e.guid||oe.guid++,i},now:Date.now,support:re}),"function"==typeof Symbol&&(oe.fn[Symbol.iterator]=Y[Symbol.iterator]),oe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){ee["[object "+t+"]"]=t.toLowerCase()});var ce=function(e){function t(e,t,n,r){var i,o,s,a,u,l,f,d,h=t&&t.ownerDocument,g=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==g&&9!==g&&11!==g)return n;if(!r&&((t?t.ownerDocument||t:W)!==L&&q(t),t=t||L,O)){if(11!==g&&(l=me.exec(e)))if(i=l[1]){if(9===g){if(!(s=t.getElementById(i)))return n;if(s.id===i)return n.push(s),n}else if(h&&(s=h.getElementById(i))&&M(t,s)&&s.id===i)return n.push(s),n}else{if(l[2])return K.apply(n,t.getElementsByTagName(e)),n;if((i=l[3])&&w.getElementsByClassName&&t.getElementsByClassName)return K.apply(n,t.getElementsByClassName(i)),n}if(w.qsa&&!z[e+" "]&&(!F||!F.test(e))){if(1!==g)h=t,d=e;else if("object"!==t.nodeName.toLowerCase()){for((a=t.getAttribute("id"))?a=a.replace(xe,"\\$&"):t.setAttribute("id",a=I),f=E(e),o=f.length,u=pe.test(a)?"#"+a:"[id='"+a+"']";o--;)f[o]=u+" "+p(f[o]);d=f.join(","),h=ye.test(e)&&c(t.parentNode)||t}if(d)try{return K.apply(n,h.querySelectorAll(d)),n}catch(e){}finally{a===I&&t.removeAttribute("id")}}}return S(e.replace(ae,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>T.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[];return e}function r(e){return e[I]=!0,e}function i(e){var t=L.createElement("div");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=n.length;r--;)T.attrHandle[n[r]]=t}function s(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||V)-(~e.sourceIndex||V);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function a(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function u(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function l(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),s=o.length;s--;)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}function c(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}function f(){}function p(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function d(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=B++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,s){var a,u,l,c=[$,o];if(s){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,s))return!0}else for(;t=t[r];)if(1===t.nodeType||i){if(l=t[I]||(t[I]={}),u=l[t.uniqueID]||(l[t.uniqueID]={}),(a=u[r])&&a[0]===$&&a[1]===o)return c[2]=a[2];if(u[r]=c,c[2]=e(t,n,s))return!0}}}function h(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function g(e,n,r){for(var i=0,o=n.length;i<o;i++)t(e,n[i],r);return r}function v(e,t,n,r,i){for(var o,s=[],a=0,u=e.length,l=null!=t;a<u;a++)(o=e[a])&&(n&&!n(o,r,i)||(s.push(o),l&&t.push(a)));return s}function m(e,t,n,i,o,s){return i&&!i[I]&&(i=m(i)),o&&!o[I]&&(o=m(o,s)),r(function(r,s,a,u){var l,c,f,p=[],d=[],h=s.length,m=r||g(t||"*",a.nodeType?[a]:a,[]),y=!e||!r&&t?m:v(m,p,e,a,u),x=n?o||(r?e:h||i)?[]:s:y;if(n&&n(y,x,a,u),i)for(l=v(x,d),i(l,[],a,u),c=l.length;c--;)(f=l[c])&&(x[d[c]]=!(y[d[c]]=f));if(r){if(o||e){if(o){for(l=[],c=x.length;c--;)(f=x[c])&&l.push(y[c]=f);o(null,x=[],l,u)}for(c=x.length;c--;)(f=x[c])&&(l=o?ee(r,f):p[c])>-1&&(r[l]=!(s[l]=f))}}else x=v(x===s?x.splice(h,x.length):x),o?o(null,s,x,u):K.apply(s,x)})}function y(e){for(var t,n,r,i=e.length,o=T.relative[e[0].type],s=o||T.relative[" "],a=o?1:0,u=d(function(e){return e===t},s,!0),l=d(function(e){return ee(t,e)>-1},s,!0),c=[function(e,n,r){var i=!o&&(r||n!==j)||((t=n).nodeType?u(e,n,r):l(e,n,r));return t=null,i}];a<i;a++)if(n=T.relative[e[a].type])c=[d(h(c),n)];else{if(n=T.filter[e[a].type].apply(null,e[a].matches),n[I]){for(r=++a;r<i&&!T.relative[e[r].type];r++);return m(a>1&&h(c),a>1&&p(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(ae,"$1"),n,a<r&&y(e.slice(a,r)),r<i&&y(e=e.slice(r)),r<i&&p(e))}c.push(n)}return h(c)}function x(e,n){var i=n.length>0,o=e.length>0,s=function(r,s,a,u,l){var c,f,p,d=0,h="0",g=r&&[],m=[],y=j,x=r||o&&T.find.TAG("*",l),b=$+=null==y?1:Math.random()||.1,w=x.length;for(l&&(j=s===L||s||l);h!==w&&null!=(c=x[h]);h++){if(o&&c){for(f=0,s||c.ownerDocument===L||(q(c),a=!O);p=e[f++];)if(p(c,s||L,a)){u.push(c);break}l&&($=b)}i&&((c=!p&&c)&&d--,r&&g.push(c))}if(d+=h,i&&h!==d){for(f=0;p=n[f++];)p(g,m,s,a);if(r){if(d>0)for(;h--;)g[h]||m[h]||(m[h]=Q.call(u));m=v(m)}K.apply(u,m),l&&!r&&m.length>0&&d+n.length>1&&t.uniqueSort(u)}return l&&($=b,j=y),g};return i?r(s):s}var b,w,T,C,k,E,N,S,j,D,A,q,L,H,O,F,P,R,M,I="sizzle"+1*new Date,W=e.document,$=0,B=0,_=n(),X=n(),z=n(),U=function(e,t){return e===t&&(A=!0),0},V=1<<31,Y={}.hasOwnProperty,G=[],Q=G.pop,J=G.push,K=G.push,Z=G.slice,ee=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},te="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",ne="[\\x20\\t\\r\\n\\f]",re="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ie="\\["+ne+"*("+re+")(?:"+ne+"*([*^$|!~]?=)"+ne+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+re+"))|)"+ne+"*\\]",oe=":("+re+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+ie+")*)|.*)\\)|)",se=new RegExp(ne+"+","g"),ae=new RegExp("^"+ne+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ne+"+$","g"),ue=new RegExp("^"+ne+"*,"+ne+"*"),le=new RegExp("^"+ne+"*([>+~]|"+ne+")"+ne+"*"),ce=new RegExp("="+ne+"*([^\\]'\"]*?)"+ne+"*\\]","g"),fe=new RegExp(oe),pe=new RegExp("^"+re+"$"),de={ID:new RegExp("^#("+re+")"),CLASS:new RegExp("^\\.("+re+")"),TAG:new RegExp("^("+re+"|[*])"),ATTR:new RegExp("^"+ie),PSEUDO:new RegExp("^"+oe),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ne+"*(even|odd|(([+-]|)(\\d*)n|)"+ne+"*(?:([+-]|)"+ne+"*(\\d+)|))"+ne+"*\\)|)","i"),bool:new RegExp("^(?:"+te+")$","i"),needsContext:new RegExp("^"+ne+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ne+"*((?:-\\d)?\\d*)"+ne+"*\\)|)(?=[^-]|$)","i")},he=/^(?:input|select|textarea|button)$/i,ge=/^h\d$/i,ve=/^[^{]+\{\s*\[native \w/,me=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ye=/[+~]/,xe=/'|\\/g,be=new RegExp("\\\\([\\da-f]{1,6}"+ne+"?|("+ne+")|.)","ig"),we=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},Te=function(){q()};try{K.apply(G=Z.call(W.childNodes),W.childNodes),G[W.childNodes.length].nodeType}catch(e){K={apply:G.length?function(e,t){J.apply(e,Z.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}w=t.support={},k=t.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},q=t.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:W;return r!==L&&9===r.nodeType&&r.documentElement?(L=r,H=L.documentElement,O=!k(L),(n=L.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",Te,!1):n.attachEvent&&n.attachEvent("onunload",Te)),w.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),w.getElementsByTagName=i(function(e){return e.appendChild(L.createComment("")),!e.getElementsByTagName("*").length}),w.getElementsByClassName=ve.test(L.getElementsByClassName),w.getById=i(function(e){return H.appendChild(e).id=I,!L.getElementsByName||!L.getElementsByName(I).length}),w.getById?(T.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&O){var n=t.getElementById(e);return n?[n]:[]}},T.filter.ID=function(e){var t=e.replace(be,we);return function(e){return e.getAttribute("id")===t}}):(delete T.find.ID,T.filter.ID=function(e){var t=e.replace(be,we);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}}),T.find.TAG=w.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):w.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},T.find.CLASS=w.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&O)return t.getElementsByClassName(e)},P=[],F=[],(w.qsa=ve.test(L.querySelectorAll))&&(i(function(e){H.appendChild(e).innerHTML="<a id='"+I+"'></a><select id='"+I+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&F.push("[*^$]="+ne+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||F.push("\\["+ne+"*(?:value|"+te+")"),e.querySelectorAll("[id~="+I+"-]").length||F.push("~="),e.querySelectorAll(":checked").length||F.push(":checked"),e.querySelectorAll("a#"+I+"+*").length||F.push(".#.+[+~]")}),i(function(e){var t=L.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&F.push("name"+ne+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||F.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),F.push(",.*:")})),(w.matchesSelector=ve.test(R=H.matches||H.webkitMatchesSelector||H.mozMatchesSelector||H.oMatchesSelector||H.msMatchesSelector))&&i(function(e){w.disconnectedMatch=R.call(e,"div"),R.call(e,"[s!='']:x"),P.push("!=",oe)}),F=F.length&&new RegExp(F.join("|")),P=P.length&&new RegExp(P.join("|")),t=ve.test(H.compareDocumentPosition),M=t||ve.test(H.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},U=t?function(e,t){if(e===t)return A=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n?n:(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&n||!w.sortDetached&&t.compareDocumentPosition(e)===n?e===L||e.ownerDocument===W&&M(W,e)?-1:t===L||t.ownerDocument===W&&M(W,t)?1:D?ee(D,e)-ee(D,t):0:4&n?-1:1)}:function(e,t){if(e===t)return A=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],u=[t];if(!i||!o)return e===L?-1:t===L?1:i?-1:o?1:D?ee(D,e)-ee(D,t):0;if(i===o)return s(e,t);for(n=e;n=n.parentNode;)a.unshift(n);for(n=t;n=n.parentNode;)u.unshift(n);for(;a[r]===u[r];)r++;return r?s(a[r],u[r]):a[r]===W?-1:u[r]===W?1:0},L):L},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==L&&q(e),n=n.replace(ce,"='$1']"),w.matchesSelector&&O&&!z[n+" "]&&(!P||!P.test(n))&&(!F||!F.test(n)))try{var r=R.call(e,n);if(r||w.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return t(n,L,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==L&&q(e),M(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==L&&q(e);var n=T.attrHandle[t.toLowerCase()],r=n&&Y.call(T.attrHandle,t.toLowerCase())?n(e,t,!O):void 0;return void 0!==r?r:w.attributes||!O?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0;if(A=!w.detectDuplicates,D=!w.sortStable&&e.slice(0),e.sort(U),A){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return D=null,e},C=t.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=C(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=C(t);return n},T=t.selectors={cacheLength:50,createPseudo:r,match:de,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(be,we),e[3]=(e[3]||e[4]||e[5]||"").replace(be,we),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return de.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&fe.test(n)&&(t=E(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(be,we).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=_[e+" "];return t||(t=new RegExp("(^|"+ne+")"+e+"("+ne+"|$)"))&&_(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e);return null==o?"!="===n:!n||(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o.replace(se," ")+" ").indexOf(r)>-1:"|="===n&&(o===r||o.slice(0,r.length+1)===r+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==s?"nextSibling":"previousSibling",v=t.parentNode,m=a&&t.nodeName.toLowerCase(),y=!u&&!a,x=!1;if(v){if(o){for(;g;){for(p=t;p=p[g];)if(a?p.nodeName.toLowerCase()===m:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[s?v.firstChild:v.lastChild],s&&y){for(p=v,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d&&l[2],p=d&&v.childNodes[d];p=++d&&p&&p[g]||(x=d=0)||h.pop();)if(1===p.nodeType&&++x&&p===t){c[e]=[$,d,x];break}}else if(y&&(p=t,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d),x===!1)for(;(p=++d&&p&&p[g]||(x=d=0)||h.pop())&&((a?p.nodeName.toLowerCase()!==m:1!==p.nodeType)||!++x||(y&&(f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),c[e]=[$,x]),p!==t)););return x-=i,x===r||x%r===0&&x/r>=0}}},PSEUDO:function(e,n){var i,o=T.pseudos[e]||T.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e);return o[I]?o(n):o.length>1?(i=[e,e,"",n],T.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),s=i.length;s--;)r=ee(e,i[s]),e[r]=!(t[r]=i[s])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=N(e.replace(ae,"$1"));return i[I]?r(function(e,t,n,r){for(var o,s=i(e,null,r,[]),a=e.length;a--;)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){return e=e.replace(be,we),function(t){return(t.textContent||t.innerText||C(t)).indexOf(e)>-1}}),lang:r(function(e){return pe.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(be,we).toLowerCase(),function(t){var n;do if(n=O?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===H},focus:function(e){return e===L.activeElement&&(!L.hasFocus||L.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!T.pseudos.empty(e)},header:function(e){return ge.test(e.nodeName)},input:function(e){return he.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:l(function(){return[0]}),last:l(function(e,t){return[t-1]}),eq:l(function(e,t,n){return[n<0?n+t:n]}),even:l(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:l(function(e,t){for(var n=1;n<t;n+=2)e.push(n);
return e}),lt:l(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:l(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},T.pseudos.nth=T.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})T.pseudos[b]=a(b);for(b in{submit:!0,reset:!0})T.pseudos[b]=u(b);return f.prototype=T.filters=T.pseudos,T.setFilters=new f,E=t.tokenize=function(e,n){var r,i,o,s,a,u,l,c=X[e+" "];if(c)return n?0:c.slice(0);for(a=e,u=[],l=T.preFilter;a;){r&&!(i=ue.exec(a))||(i&&(a=a.slice(i[0].length)||a),u.push(o=[])),r=!1,(i=le.exec(a))&&(r=i.shift(),o.push({value:r,type:i[0].replace(ae," ")}),a=a.slice(r.length));for(s in T.filter)!(i=de[s].exec(a))||l[s]&&!(i=l[s](i))||(r=i.shift(),o.push({value:r,type:s,matches:i}),a=a.slice(r.length));if(!r)break}return n?a.length:a?t.error(e):X(e,u).slice(0)},N=t.compile=function(e,t){var n,r=[],i=[],o=z[e+" "];if(!o){for(t||(t=E(e)),n=t.length;n--;)o=y(t[n]),o[I]?r.push(o):i.push(o);o=z(e,x(i,r)),o.selector=e}return o},S=t.select=function(e,t,n,r){var i,o,s,a,u,l="function"==typeof e&&e,f=!r&&E(e=l.selector||e);if(n=n||[],1===f.length){if(o=f[0]=f[0].slice(0),o.length>2&&"ID"===(s=o[0]).type&&w.getById&&9===t.nodeType&&O&&T.relative[o[1].type]){if(t=(T.find.ID(s.matches[0].replace(be,we),t)||[])[0],!t)return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=de.needsContext.test(e)?0:o.length;i--&&(s=o[i],!T.relative[a=s.type]);)if((u=T.find[a])&&(r=u(s.matches[0].replace(be,we),ye.test(o[0].type)&&c(t.parentNode)||t))){if(o.splice(i,1),e=r.length&&p(o),!e)return K.apply(n,r),n;break}}return(l||N(e,f))(r,t,!O,n,!t||ye.test(e)&&c(t.parentNode)||t),n},w.sortStable=I.split("").sort(U).join("")===I,w.detectDuplicates=!!A,q(),w.sortDetached=i(function(e){return 1&e.compareDocumentPosition(L.createElement("div"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),w.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(te,function(e,t,n){var r;if(!n)return e[t]===!0?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(e);oe.find=ce,oe.expr=ce.selectors,oe.expr[":"]=oe.expr.pseudos,oe.uniqueSort=oe.unique=ce.uniqueSort,oe.text=ce.getText,oe.isXMLDoc=ce.isXML,oe.contains=ce.contains;var fe=function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&oe(e).is(n))break;r.push(e)}return r},pe=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},de=oe.expr.match.needsContext,he=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,ge=/^.[^:#\[\.,]*$/;oe.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?oe.find.matchesSelector(r,e)?[r]:[]:oe.find.matches(e,oe.grep(t,function(e){return 1===e.nodeType}))},oe.fn.extend({find:function(e){var t,n=this.length,r=[],i=this;if("string"!=typeof e)return this.pushStack(oe(e).filter(function(){for(t=0;t<n;t++)if(oe.contains(i[t],this))return!0}));for(t=0;t<n;t++)oe.find(e,i[t],r);return r=this.pushStack(n>1?oe.unique(r):r),r.selector=this.selector?this.selector+" "+e:e,r},filter:function(e){return this.pushStack(r(this,e||[],!1))},not:function(e){return this.pushStack(r(this,e||[],!0))},is:function(e){return!!r(this,"string"==typeof e&&de.test(e)?oe(e):e||[],!1).length}});var ve,me=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,ye=oe.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||ve,"string"==typeof e){if(r="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:me.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof oe?t[0]:t,oe.merge(this,oe.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:G,!0)),he.test(r[1])&&oe.isPlainObject(t))for(r in t)oe.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=G.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=G,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):oe.isFunction(e)?void 0!==n.ready?n.ready(e):e(oe):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),oe.makeArray(e,this))};ye.prototype=oe.fn,ve=oe(G);var xe=/^(?:parents|prev(?:Until|All))/,be={children:!0,contents:!0,next:!0,prev:!0};oe.fn.extend({has:function(e){var t=oe(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(oe.contains(this,t[e]))return!0})},closest:function(e,t){for(var n,r=0,i=this.length,o=[],s=de.test(e)||"string"!=typeof e?oe(e,t||this.context):0;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(s?s.index(n)>-1:1===n.nodeType&&oe.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?oe.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?Z.call(oe(e),this[0]):Z.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(oe.uniqueSort(oe.merge(this.get(),oe(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),oe.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return fe(e,"parentNode")},parentsUntil:function(e,t,n){return fe(e,"parentNode",n)},next:function(e){return i(e,"nextSibling")},prev:function(e){return i(e,"previousSibling")},nextAll:function(e){return fe(e,"nextSibling")},prevAll:function(e){return fe(e,"previousSibling")},nextUntil:function(e,t,n){return fe(e,"nextSibling",n)},prevUntil:function(e,t,n){return fe(e,"previousSibling",n)},siblings:function(e){return pe((e.parentNode||{}).firstChild,e)},children:function(e){return pe(e.firstChild)},contents:function(e){return e.contentDocument||oe.merge([],e.childNodes)}},function(e,t){oe.fn[e]=function(n,r){var i=oe.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=oe.filter(r,i)),this.length>1&&(be[e]||oe.uniqueSort(i),xe.test(e)&&i.reverse()),this.pushStack(i)}});var we=/\S+/g;oe.Callbacks=function(e){e="string"==typeof e?o(e):oe.extend({},e);var t,n,r,i,s=[],a=[],u=-1,l=function(){for(i=e.once,r=t=!0;a.length;u=-1)for(n=a.shift();++u<s.length;)s[u].apply(n[0],n[1])===!1&&e.stopOnFalse&&(u=s.length,n=!1);e.memory||(n=!1),t=!1,i&&(s=n?[]:"")},c={add:function(){return s&&(n&&!t&&(u=s.length-1,a.push(n)),function t(n){oe.each(n,function(n,r){oe.isFunction(r)?e.unique&&c.has(r)||s.push(r):r&&r.length&&"string"!==oe.type(r)&&t(r)})}(arguments),n&&!t&&l()),this},remove:function(){return oe.each(arguments,function(e,t){for(var n;(n=oe.inArray(t,s,n))>-1;)s.splice(n,1),n<=u&&u--}),this},has:function(e){return e?oe.inArray(e,s)>-1:s.length>0},empty:function(){return s&&(s=[]),this},disable:function(){return i=a=[],s=n="",this},disabled:function(){return!s},lock:function(){return i=a=[],n||(s=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=n||[],n=[e,n.slice?n.slice():n],a.push(n),t||l()),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},oe.extend({Deferred:function(e){var t=[["resolve","done",oe.Callbacks("once memory"),"resolved"],["reject","fail",oe.Callbacks("once memory"),"rejected"],["notify","progress",oe.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return oe.Deferred(function(n){oe.each(t,function(t,o){var s=oe.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&oe.isFunction(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[o[0]+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?oe.extend(e,r):r}},i={};return r.pipe=r.then,oe.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=Q.call(arguments),s=o.length,a=1!==s||e&&oe.isFunction(e.promise)?s:0,u=1===a?e:oe.Deferred(),l=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?Q.call(arguments):i,r===t?u.notifyWith(n,r):--a||u.resolveWith(n,r)}};if(s>1)for(t=new Array(s),n=new Array(s),r=new Array(s);i<s;i++)o[i]&&oe.isFunction(o[i].promise)?o[i].promise().progress(l(i,n,t)).done(l(i,r,o)).fail(u.reject):--a;return a||u.resolveWith(r,o),u.promise()}});var Te;oe.fn.ready=function(e){return oe.ready.promise().done(e),this},oe.extend({isReady:!1,readyWait:1,holdReady:function(e){e?oe.readyWait++:oe.ready(!0)},ready:function(e){(e===!0?--oe.readyWait:oe.isReady)||(oe.isReady=!0,e!==!0&&--oe.readyWait>0||(Te.resolveWith(G,[oe]),oe.fn.triggerHandler&&(oe(G).triggerHandler("ready"),oe(G).off("ready"))))}}),oe.ready.promise=function(t){return Te||(Te=oe.Deferred(),"complete"===G.readyState||"loading"!==G.readyState&&!G.documentElement.doScroll?e.setTimeout(oe.ready):(G.addEventListener("DOMContentLoaded",s),e.addEventListener("load",s))),Te.promise(t)},oe.ready.promise();var Ce=function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===oe.type(n)){i=!0;for(a in n)Ce(e,t,a,n[a],!0,o,s)}else if(void 0!==r&&(i=!0,oe.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(oe(e),n)})),t))for(;a<u;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},ke=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};a.uid=1,a.prototype={register:function(e,t){var n=t||{};return e.nodeType?e[this.expando]=n:Object.defineProperty(e,this.expando,{value:n,writable:!0,configurable:!0}),e[this.expando]},cache:function(e){if(!ke(e))return{};var t=e[this.expando];return t||(t={},ke(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[t]=n;else for(r in t)i[r]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][t]},access:function(e,t,n){var r;return void 0===t||t&&"string"==typeof t&&void 0===n?(r=this.get(e,t),void 0!==r?r:this.get(e,oe.camelCase(t))):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r,i,o=e[this.expando];if(void 0!==o){if(void 0===t)this.register(e);else{oe.isArray(t)?r=t.concat(t.map(oe.camelCase)):(i=oe.camelCase(t),t in o?r=[t,i]:(r=i,r=r in o?[r]:r.match(we)||[])),n=r.length;for(;n--;)delete o[r[n]]}(void 0===t||oe.isEmptyObject(o))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!oe.isEmptyObject(t)}};var Ee=new a,Ne=new a,Se=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,je=/[A-Z]/g;oe.extend({hasData:function(e){return Ne.hasData(e)||Ee.hasData(e)},data:function(e,t,n){return Ne.access(e,t,n)},removeData:function(e,t){Ne.remove(e,t)},_data:function(e,t,n){return Ee.access(e,t,n)},_removeData:function(e,t){Ee.remove(e,t)}}),oe.fn.extend({data:function(e,t){var n,r,i,o=this[0],s=o&&o.attributes;if(void 0===e){if(this.length&&(i=Ne.get(o),1===o.nodeType&&!Ee.get(o,"hasDataAttrs"))){for(n=s.length;n--;)s[n]&&(r=s[n].name,0===r.indexOf("data-")&&(r=oe.camelCase(r.slice(5)),u(o,r,i[r])));Ee.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){Ne.set(this,e)}):Ce(this,function(t){var n,r;if(o&&void 0===t){if(n=Ne.get(o,e)||Ne.get(o,e.replace(je,"-$&").toLowerCase()),void 0!==n)return n;if(r=oe.camelCase(e),n=Ne.get(o,r),void 0!==n)return n;if(n=u(o,r,void 0),void 0!==n)return n}else r=oe.camelCase(e),this.each(function(){var n=Ne.get(this,r);Ne.set(this,r,t),e.indexOf("-")>-1&&void 0!==n&&Ne.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){Ne.remove(this,e)})}}),oe.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Ee.get(e,t),n&&(!r||oe.isArray(n)?r=Ee.access(e,t,oe.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=oe.queue(e,t),r=n.length,i=n.shift(),o=oe._queueHooks(e,t),s=function(){oe.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Ee.get(e,n)||Ee.access(e,n,{empty:oe.Callbacks("once memory").add(function(){Ee.remove(e,[t+"queue",n])})})}}),oe.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?oe.queue(this[0],e):void 0===t?this:this.each(function(){var n=oe.queue(this,e,t);oe._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&oe.dequeue(this,e)})},dequeue:function(e){return this.each(function(){oe.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=oe.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";s--;)n=Ee.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var De=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Ae=new RegExp("^(?:([+-])=|)("+De+")([a-z%]*)$","i"),qe=["Top","Right","Bottom","Left"],Le=function(e,t){return e=t||e,"none"===oe.css(e,"display")||!oe.contains(e.ownerDocument,e)},He=/^(?:checkbox|radio)$/i,Oe=/<([\w:-]+)/,Fe=/^$|\/(?:java|ecma)script/i,Pe={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};Pe.optgroup=Pe.option,Pe.tbody=Pe.tfoot=Pe.colgroup=Pe.caption=Pe.thead,Pe.th=Pe.td;var Re=/<|&#?\w+;/;!function(){var e=G.createDocumentFragment(),t=e.appendChild(G.createElement("div")),n=G.createElement("input");n.setAttribute("type","radio"),n.setAttribute("checked","checked"),n.setAttribute("name","t"),t.appendChild(n),re.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",re.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var Me=/^key/,Ie=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,We=/^([^.]*)(?:\.(.+)|)/;oe.event={global:{},add:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,d,h,g,v=Ee.get(e);if(v)for(n.handler&&(o=n,n=o.handler,i=o.selector),n.guid||(n.guid=oe.guid++),(u=v.events)||(u=v.events={}),(s=v.handle)||(s=v.handle=function(t){return"undefined"!=typeof oe&&oe.event.triggered!==t.type?oe.event.dispatch.apply(e,arguments):void 0}),t=(t||"").match(we)||[""],l=t.length;l--;)a=We.exec(t[l])||[],d=g=a[1],h=(a[2]||"").split(".").sort(),d&&(f=oe.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=oe.event.special[d]||{},c=oe.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&oe.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||(p=u[d]=[],p.delegateCount=0,f.setup&&f.setup.call(e,r,h,s)!==!1||e.addEventListener&&e.addEventListener(d,s)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),oe.event.global[d]=!0)},remove:function(e,t,n,r,i){var o,s,a,u,l,c,f,p,d,h,g,v=Ee.hasData(e)&&Ee.get(e);if(v&&(u=v.events)){for(t=(t||"").match(we)||[""],l=t.length;l--;)if(a=We.exec(t[l])||[],d=g=a[1],h=(a[2]||"").split(".").sort(),d){for(f=oe.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=u[d]||[],a=a[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=p.length;o--;)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));s&&!p.length&&(f.teardown&&f.teardown.call(e,h,v.handle)!==!1||oe.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)oe.event.remove(e,d+t[l],n,r,!0);oe.isEmptyObject(u)&&Ee.remove(e,"handle events")}},dispatch:function(e){e=oe.event.fix(e);var t,n,r,i,o,s=[],a=Q.call(arguments),u=(Ee.get(this,"events")||{})[e.type]||[],l=oe.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){for(s=oe.event.handlers.call(this,e,u),t=0;(i=s[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!e.isImmediatePropagationStopped();)e.rnamespace&&!e.rnamespace.test(o.namespace)||(e.handleObj=o,e.data=o.data,r=((oe.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),void 0!==r&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()));return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&("click"!==e.type||isNaN(e.button)||e.button<1))for(;u!==this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(r=[],n=0;n<a;n++)o=t[n],i=o.selector+" ",void 0===r[i]&&(r[i]=o.needsContext?oe(i,this).index(u)>-1:oe.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return a<t.length&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,o=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||G,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},fix:function(e){if(e[oe.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];for(s||(this.fixHooks[i]=s=Ie.test(i)?this.mouseHooks:Me.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new oe.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n];return e.target||(e.target=G),3===e.target.nodeType&&(e.target=e.target.parentNode),s.filter?s.filter(e,o):e},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==g()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===g()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&oe.nodeName(this,"input"))return this.click(),!1},_default:function(e){return oe.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},oe.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},oe.Event=function(e,t){return this instanceof oe.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&e.returnValue===!1?d:h):this.type=e,t&&oe.extend(this,t),this.timeStamp=e&&e.timeStamp||oe.now(),void(this[oe.expando]=!0)):new oe.Event(e,t)},oe.Event.prototype={constructor:oe.Event,isDefaultPrevented:h,isPropagationStopped:h,isImmediatePropagationStopped:h,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=d,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=d,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=d,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},oe.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){oe.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||oe.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),oe.fn.extend({on:function(e,t,n,r){return v(this,e,t,n,r)},one:function(e,t,n,r){return v(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,oe(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return t!==!1&&"function"!=typeof t||(n=t,t=void 0),n===!1&&(n=h),this.each(function(){oe.event.remove(this,e,n,t)})}});var $e=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,Be=/<script|<style|<link/i,_e=/checked\s*(?:[^=]|=\s*.checked.)/i,Xe=/^true\/(.*)/,ze=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;oe.extend({htmlPrefilter:function(e){return e.replace($e,"<$1></$2>")},clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=oe.contains(e.ownerDocument,e);if(!(re.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||oe.isXMLDoc(e)))for(s=c(a),o=c(e),r=0,i=o.length;r<i;r++)w(o[r],s[r]);if(t)if(n)for(o=o||c(e),s=s||c(a),r=0,i=o.length;r<i;r++)b(o[r],s[r]);else b(e,a);return s=c(a,"script"),s.length>0&&f(s,!u&&c(e,"script")),a},cleanData:function(e){for(var t,n,r,i=oe.event.special,o=0;void 0!==(n=e[o]);o++)if(ke(n)){if(t=n[Ee.expando]){if(t.events)for(r in t.events)i[r]?oe.event.remove(n,r):oe.removeEvent(n,r,t.handle);n[Ee.expando]=void 0}n[Ne.expando]&&(n[Ne.expando]=void 0)}}}),oe.fn.extend({domManip:T,detach:function(e){return C(this,e,!0)},remove:function(e){return C(this,e)},text:function(e){return Ce(this,function(e){return void 0===e?oe.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return T(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=m(this,e);t.appendChild(e)}})},prepend:function(){return T(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=m(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return T(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return T(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(oe.cleanData(c(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return oe.clone(this,e,t)})},html:function(e){return Ce(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Be.test(e)&&!Pe[(Oe.exec(e)||["",""])[1].toLowerCase()]){e=oe.htmlPrefilter(e);try{for(;n<r;n++)t=this[n]||{},1===t.nodeType&&(oe.cleanData(c(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return T(this,arguments,function(t){var n=this.parentNode;oe.inArray(this,e)<0&&(oe.cleanData(c(this)),n&&n.replaceChild(t,this))},e)}}),oe.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){oe.fn[e]=function(e){for(var n,r=[],i=oe(e),o=i.length-1,s=0;s<=o;s++)n=s===o?this:this.clone(!0),oe(i[s])[t](n),K.apply(r,n.get());return this.pushStack(r)}});var Ue,Ve={HTML:"block",BODY:"block"},Ye=/^margin/,Ge=new RegExp("^("+De+")(?!px)[a-z%]+$","i"),Qe=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Je=function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i},Ke=G.documentElement;!function(){function t(){a.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",a.innerHTML="",Ke.appendChild(s);var t=e.getComputedStyle(a);n="1%"!==t.top,o="2px"===t.marginLeft,r="4px"===t.width,a.style.marginRight="50%",i="4px"===t.marginRight,Ke.removeChild(s)}var n,r,i,o,s=G.createElement("div"),a=G.createElement("div");a.style&&(a.style.backgroundClip="content-box",a.cloneNode(!0).style.backgroundClip="",re.clearCloneStyle="content-box"===a.style.backgroundClip,s.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",s.appendChild(a),oe.extend(re,{pixelPosition:function(){return t(),n},boxSizingReliable:function(){return null==r&&t(),r},pixelMarginRight:function(){return null==r&&t(),i},reliableMarginLeft:function(){return null==r&&t(),o},reliableMarginRight:function(){var t,n=a.appendChild(G.createElement("div"));return n.style.cssText=a.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",n.style.marginRight=n.style.width="0",a.style.width="1px",Ke.appendChild(s),t=!parseFloat(e.getComputedStyle(n).marginRight),Ke.removeChild(s),a.removeChild(n),t}}))}();var Ze=/^(none|table(?!-c[ea]).+)/,et={position:"absolute",visibility:"hidden",display:"block"},tt={letterSpacing:"0",fontWeight:"400"},nt=["Webkit","O","Moz","ms"],rt=G.createElement("div").style;oe.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=N(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{float:"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=oe.camelCase(t),u=e.style;return t=oe.cssProps[a]||(oe.cssProps[a]=j(a)||a),s=oe.cssHooks[t]||oe.cssHooks[a],void 0===n?s&&"get"in s&&void 0!==(i=s.get(e,!1,r))?i:u[t]:(o=typeof n,"string"===o&&(i=Ae.exec(n))&&i[1]&&(n=l(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(oe.cssNumber[a]?"":"px")),re.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&void 0===(n=s.set(e,n,r))||(u[t]=n)),void 0)}},css:function(e,t,n,r){var i,o,s,a=oe.camelCase(t);return t=oe.cssProps[a]||(oe.cssProps[a]=j(a)||a),s=oe.cssHooks[t]||oe.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),void 0===i&&(i=N(e,t,r)),"normal"===i&&t in tt&&(i=tt[t]),""===n||n?(o=parseFloat(i),n===!0||isFinite(o)?o||0:i):i}}),oe.each(["height","width"],function(e,t){oe.cssHooks[t]={get:function(e,n,r){if(n)return Ze.test(oe.css(e,"display"))&&0===e.offsetWidth?Je(e,et,function(){return q(e,t,r)}):q(e,t,r)},set:function(e,n,r){var i,o=r&&Qe(e),s=r&&A(e,t,r,"border-box"===oe.css(e,"boxSizing",!1,o),o);return s&&(i=Ae.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=oe.css(e,t)),D(e,n,s)}}}),oe.cssHooks.marginLeft=S(re.reliableMarginLeft,function(e,t){if(t)return(parseFloat(N(e,"marginLeft"))||e.getBoundingClientRect().left-Je(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),oe.cssHooks.marginRight=S(re.reliableMarginRight,function(e,t){if(t)return Je(e,{display:"inline-block"},N,[e,"marginRight"])}),oe.each({margin:"",padding:"",border:"Width"},function(e,t){oe.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+qe[r]+t]=o[r]||o[r-2]||o[0];return i}},Ye.test(e)||(oe.cssHooks[e+t].set=D)}),oe.fn.extend({css:function(e,t){return Ce(this,function(e,t,n){var r,i,o={},s=0;if(oe.isArray(t)){for(r=Qe(e),i=t.length;s<i;s++)o[t[s]]=oe.css(e,t[s],!1,r);return o}return void 0!==n?oe.style(e,t,n):oe.css(e,t)},e,t,arguments.length>1)},show:function(){return L(this,!0)},hide:function(){return L(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Le(this)?oe(this).show():oe(this).hide()})}}),oe.Tween=H,H.prototype={constructor:H,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||oe.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(oe.cssNumber[n]?"":"px")},cur:function(){var e=H.propHooks[this.prop];return e&&e.get?e.get(this):H.propHooks._default.get(this)},run:function(e){var t,n=H.propHooks[this.prop];return this.options.duration?this.pos=t=oe.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):H.propHooks._default.set(this),this}},H.prototype.init.prototype=H.prototype,H.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=oe.css(e.elem,e.prop,""),t&&"auto"!==t?t:0)},set:function(e){oe.fx.step[e.prop]?oe.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[oe.cssProps[e.prop]]&&!oe.cssHooks[e.prop]?e.elem[e.prop]=e.now:oe.style(e.elem,e.prop,e.now+e.unit)}}},H.propHooks.scrollTop=H.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},oe.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},oe.fx=H.prototype.init,oe.fx.step={};var it,ot,st=/^(?:toggle|show|hide)$/,at=/queueHooks$/;oe.Animation=oe.extend(I,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return l(n.elem,e,Ae.exec(t),n),n}]},tweener:function(e,t){oe.isFunction(e)?(t=e,e=["*"]):e=e.match(we);for(var n,r=0,i=e.length;r<i;r++)n=e[r],I.tweeners[n]=I.tweeners[n]||[],I.tweeners[n].unshift(t)},prefilters:[R],prefilter:function(e,t){t?I.prefilters.unshift(e):I.prefilters.push(e)}}),oe.speed=function(e,t,n){var r=e&&"object"==typeof e?oe.extend({},e):{complete:n||!n&&t||oe.isFunction(e)&&e,duration:e,easing:n&&t||t&&!oe.isFunction(t)&&t};return r.duration=oe.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in oe.fx.speeds?oe.fx.speeds[r.duration]:oe.fx.speeds._default,null!=r.queue&&r.queue!==!0||(r.queue="fx"),r.old=r.complete,r.complete=function(){oe.isFunction(r.old)&&r.old.call(this),r.queue&&oe.dequeue(this,r.queue)},r},oe.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Le).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=oe.isEmptyObject(e),o=oe.speed(t,n,r),s=function(){var t=I(this,oe.extend({},e),o);(i||Ee.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=oe.timers,s=Ee.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&at.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||oe.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=Ee.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=oe.timers,s=r?r.length:0;for(n.finish=!0,oe.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<s;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),oe.each(["toggle","show","hide"],function(e,t){var n=oe.fn[t];oe.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(F(t,!0),e,r,i)}}),oe.each({slideDown:F("show"),slideUp:F("hide"),slideToggle:F("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){oe.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),oe.timers=[],oe.fx.tick=function(){var e,t=0,n=oe.timers;for(it=oe.now();t<n.length;t++)e=n[t],e()||n[t]!==e||n.splice(t--,1);n.length||oe.fx.stop(),it=void 0},oe.fx.timer=function(e){
oe.timers.push(e),e()?oe.fx.start():oe.timers.pop()},oe.fx.interval=13,oe.fx.start=function(){ot||(ot=e.setInterval(oe.fx.tick,oe.fx.interval))},oe.fx.stop=function(){e.clearInterval(ot),ot=null},oe.fx.speeds={slow:600,fast:200,_default:400},oe.fn.delay=function(t,n){return t=oe.fx?oe.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=G.createElement("input"),t=G.createElement("select"),n=t.appendChild(G.createElement("option"));e.type="checkbox",re.checkOn=""!==e.value,re.optSelected=n.selected,t.disabled=!0,re.optDisabled=!n.disabled,e=G.createElement("input"),e.value="t",e.type="radio",re.radioValue="t"===e.value}();var ut,lt=oe.expr.attrHandle;oe.fn.extend({attr:function(e,t){return Ce(this,oe.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){oe.removeAttr(this,e)})}}),oe.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?oe.prop(e,t,n):(1===o&&oe.isXMLDoc(e)||(t=t.toLowerCase(),i=oe.attrHooks[t]||(oe.expr.match.bool.test(t)?ut:void 0)),void 0!==n?null===n?void oe.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:(r=oe.find.attr(e,t),null==r?void 0:r))},attrHooks:{type:{set:function(e,t){if(!re.radioValue&&"radio"===t&&oe.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(we);if(o&&1===e.nodeType)for(;n=o[i++];)r=oe.propFix[n]||n,oe.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)}}),ut={set:function(e,t,n){return t===!1?oe.removeAttr(e,n):e.setAttribute(n,n),n}},oe.each(oe.expr.match.bool.source.match(/\w+/g),function(e,t){var n=lt[t]||oe.find.attr;lt[t]=function(e,t,r){var i,o;return r||(o=lt[t],lt[t]=i,i=null!=n(e,t,r)?t.toLowerCase():null,lt[t]=o),i}});var ct=/^(?:input|select|textarea|button)$/i,ft=/^(?:a|area)$/i;oe.fn.extend({prop:function(e,t){return Ce(this,oe.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[oe.propFix[e]||e]})}}),oe.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&oe.isXMLDoc(e)||(t=oe.propFix[t]||t,i=oe.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=oe.find.attr(e,"tabindex");return t?parseInt(t,10):ct.test(e.nodeName)||ft.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),re.optSelected||(oe.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),oe.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){oe.propFix[this.toLowerCase()]=this});var pt=/[\t\r\n\f]/g;oe.fn.extend({addClass:function(e){var t,n,r,i,o,s,a,u=0;if(oe.isFunction(e))return this.each(function(t){oe(this).addClass(e.call(this,t,W(this)))});if("string"==typeof e&&e)for(t=e.match(we)||[];n=this[u++];)if(i=W(n),r=1===n.nodeType&&(" "+i+" ").replace(pt," ")){for(s=0;o=t[s++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");a=oe.trim(r),i!==a&&n.setAttribute("class",a)}return this},removeClass:function(e){var t,n,r,i,o,s,a,u=0;if(oe.isFunction(e))return this.each(function(t){oe(this).removeClass(e.call(this,t,W(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof e&&e)for(t=e.match(we)||[];n=this[u++];)if(i=W(n),r=1===n.nodeType&&(" "+i+" ").replace(pt," ")){for(s=0;o=t[s++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");a=oe.trim(r),i!==a&&n.setAttribute("class",a)}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):oe.isFunction(e)?this.each(function(n){oe(this).toggleClass(e.call(this,n,W(this),t),t)}):this.each(function(){var t,r,i,o;if("string"===n)for(r=0,i=oe(this),o=e.match(we)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else void 0!==e&&"boolean"!==n||(t=W(this),t&&Ee.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||e===!1?"":Ee.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+W(n)+" ").replace(pt," ").indexOf(t)>-1)return!0;return!1}});var dt=/\r/g,ht=/[\x20\t\r\n\f]+/g;oe.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=oe.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,oe(this).val()):e,null==i?i="":"number"==typeof i?i+="":oe.isArray(i)&&(i=oe.map(i,function(e){return null==e?"":e+""})),t=oe.valHooks[this.type]||oe.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return t=oe.valHooks[i.type]||oe.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:(n=i.value,"string"==typeof n?n.replace(dt,""):null==n?"":n)}}}),oe.extend({valHooks:{option:{get:function(e){var t=oe.find.attr(e,"value");return null!=t?t:oe.trim(oe.text(e)).replace(ht," ")}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||i<0,s=o?null:[],a=o?i+1:r.length,u=i<0?a:o?i:0;u<a;u++)if(n=r[u],(n.selected||u===i)&&(re.optDisabled?!n.disabled:null===n.getAttribute("disabled"))&&(!n.parentNode.disabled||!oe.nodeName(n.parentNode,"optgroup"))){if(t=oe(n).val(),o)return t;s.push(t)}return s},set:function(e,t){for(var n,r,i=e.options,o=oe.makeArray(t),s=i.length;s--;)r=i[s],(r.selected=oe.inArray(oe.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),oe.each(["radio","checkbox"],function(){oe.valHooks[this]={set:function(e,t){if(oe.isArray(t))return e.checked=oe.inArray(oe(e).val(),t)>-1}},re.checkOn||(oe.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var gt=/^(?:focusinfocus|focusoutblur)$/;oe.extend(oe.event,{trigger:function(t,n,r,i){var o,s,a,u,l,c,f,p=[r||G],d=ne.call(t,"type")?t.type:t,h=ne.call(t,"namespace")?t.namespace.split("."):[];if(s=a=r=r||G,3!==r.nodeType&&8!==r.nodeType&&!gt.test(d+oe.event.triggered)&&(d.indexOf(".")>-1&&(h=d.split("."),d=h.shift(),h.sort()),l=d.indexOf(":")<0&&"on"+d,t=t[oe.expando]?t:new oe.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=h.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:oe.makeArray(n,[t]),f=oe.event.special[d]||{},i||!f.trigger||f.trigger.apply(r,n)!==!1)){if(!i&&!f.noBubble&&!oe.isWindow(r)){for(u=f.delegateType||d,gt.test(u+d)||(s=s.parentNode);s;s=s.parentNode)p.push(s),a=s;a===(r.ownerDocument||G)&&p.push(a.defaultView||a.parentWindow||e)}for(o=0;(s=p[o++])&&!t.isPropagationStopped();)t.type=o>1?u:f.bindType||d,c=(Ee.get(s,"events")||{})[t.type]&&Ee.get(s,"handle"),c&&c.apply(s,n),c=l&&s[l],c&&c.apply&&ke(s)&&(t.result=c.apply(s,n),t.result===!1&&t.preventDefault());return t.type=d,i||t.isDefaultPrevented()||f._default&&f._default.apply(p.pop(),n)!==!1||!ke(r)||l&&oe.isFunction(r[d])&&!oe.isWindow(r)&&(a=r[l],a&&(r[l]=null),oe.event.triggered=d,r[d](),oe.event.triggered=void 0,a&&(r[l]=a)),t.result}},simulate:function(e,t,n){var r=oe.extend(new oe.Event,n,{type:e,isSimulated:!0});oe.event.trigger(r,null,t)}}),oe.fn.extend({trigger:function(e,t){return this.each(function(){oe.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return oe.event.trigger(e,t,n,!0)}}),oe.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){oe.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),oe.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),re.focusin="onfocusin"in e,re.focusin||oe.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){oe.event.simulate(t,e.target,oe.event.fix(e))};oe.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=Ee.access(r,t);i||r.addEventListener(e,n,!0),Ee.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=Ee.access(r,t)-1;i?Ee.access(r,t,i):(r.removeEventListener(e,n,!0),Ee.remove(r,t))}}});var vt=e.location,mt=oe.now(),yt=/\?/;oe.parseJSON=function(e){return JSON.parse(e+"")},oe.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||oe.error("Invalid XML: "+t),n};var xt=/#.*$/,bt=/([?&])_=[^&]*/,wt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Tt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ct=/^(?:GET|HEAD)$/,kt=/^\/\//,Et={},Nt={},St="*/".concat("*"),jt=G.createElement("a");jt.href=vt.href,oe.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:vt.href,type:"GET",isLocal:Tt.test(vt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":St,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":oe.parseJSON,"text xml":oe.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_(_(e,oe.ajaxSettings),t):_(oe.ajaxSettings,e)},ajaxPrefilter:$(Et),ajaxTransport:$(Nt),ajax:function(t,n){function r(t,n,r,a){var l,f,y,x,w,C=n;2!==b&&(b=2,u&&e.clearTimeout(u),i=void 0,s=a||"",T.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(x=X(p,T,r)),x=z(p,x,T,l),l?(p.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(oe.lastModified[o]=w),w=T.getResponseHeader("etag"),w&&(oe.etag[o]=w)),204===t||"HEAD"===p.type?C="nocontent":304===t?C="notmodified":(C=x.state,f=x.data,y=x.error,l=!y)):(y=C,!t&&C||(C="error",t<0&&(t=0))),T.status=t,T.statusText=(n||C)+"",l?g.resolveWith(d,[f,C,T]):g.rejectWith(d,[T,C,y]),T.statusCode(m),m=void 0,c&&h.trigger(l?"ajaxSuccess":"ajaxError",[T,p,l?f:y]),v.fireWith(d,[T,C]),c&&(h.trigger("ajaxComplete",[T,p]),--oe.active||oe.event.trigger("ajaxStop")))}"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,s,a,u,l,c,f,p=oe.ajaxSetup({},n),d=p.context||p,h=p.context&&(d.nodeType||d.jquery)?oe(d):oe.event,g=oe.Deferred(),v=oe.Callbacks("once memory"),m=p.statusCode||{},y={},x={},b=0,w="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!a)for(a={};t=wt.exec(s);)a[t[1].toLowerCase()]=t[2];t=a[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?s:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=x[n]=x[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(b<2)for(t in e)m[t]=[m[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||w;return i&&i.abort(t),r(0,t),this}};if(g.promise(T).complete=v.add,T.success=T.done,T.error=T.fail,p.url=((t||p.url||vt.href)+"").replace(xt,"").replace(kt,vt.protocol+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=oe.trim(p.dataType||"*").toLowerCase().match(we)||[""],null==p.crossDomain){l=G.createElement("a");try{l.href=p.url,l.href=l.href,p.crossDomain=jt.protocol+"//"+jt.host!=l.protocol+"//"+l.host}catch(e){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=oe.param(p.data,p.traditional)),B(Et,p,n,T),2===b)return T;c=oe.event&&p.global,c&&0===oe.active++&&oe.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Ct.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(yt.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=bt.test(o)?o.replace(bt,"$1_="+mt++):o+(yt.test(o)?"&":"?")+"_="+mt++)),p.ifModified&&(oe.lastModified[o]&&T.setRequestHeader("If-Modified-Since",oe.lastModified[o]),oe.etag[o]&&T.setRequestHeader("If-None-Match",oe.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&T.setRequestHeader("Content-Type",p.contentType),T.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+St+"; q=0.01":""):p.accepts["*"]);for(f in p.headers)T.setRequestHeader(f,p.headers[f]);if(p.beforeSend&&(p.beforeSend.call(d,T,p)===!1||2===b))return T.abort();w="abort";for(f in{success:1,error:1,complete:1})T[f](p[f]);if(i=B(Nt,p,n,T)){if(T.readyState=1,c&&h.trigger("ajaxSend",[T,p]),2===b)return T;p.async&&p.timeout>0&&(u=e.setTimeout(function(){T.abort("timeout")},p.timeout));try{b=1,i.send(y,r)}catch(e){if(!(b<2))throw e;r(-1,e)}}else r(-1,"No Transport");return T},getJSON:function(e,t,n){return oe.get(e,t,n,"json")},getScript:function(e,t){return oe.get(e,void 0,t,"script")}}),oe.each(["get","post"],function(e,t){oe[t]=function(e,n,r,i){return oe.isFunction(n)&&(i=i||r,r=n,n=void 0),oe.ajax(oe.extend({url:e,type:t,dataType:i,data:n,success:r},oe.isPlainObject(e)&&e))}}),oe._evalUrl=function(e){return oe.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,throws:!0})},oe.fn.extend({wrapAll:function(e){var t;return oe.isFunction(e)?this.each(function(t){oe(this).wrapAll(e.call(this,t))}):(this[0]&&(t=oe(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return oe.isFunction(e)?this.each(function(t){oe(this).wrapInner(e.call(this,t))}):this.each(function(){var t=oe(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=oe.isFunction(e);return this.each(function(n){oe(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){oe.nodeName(this,"body")||oe(this).replaceWith(this.childNodes)}).end()}}),oe.expr.filters.hidden=function(e){return!oe.expr.filters.visible(e)},oe.expr.filters.visible=function(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0};var Dt=/%20/g,At=/\[\]$/,qt=/\r?\n/g,Lt=/^(?:submit|button|image|reset|file)$/i,Ht=/^(?:input|select|textarea|keygen)/i;oe.param=function(e,t){var n,r=[],i=function(e,t){t=oe.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(void 0===t&&(t=oe.ajaxSettings&&oe.ajaxSettings.traditional),oe.isArray(e)||e.jquery&&!oe.isPlainObject(e))oe.each(e,function(){i(this.name,this.value)});else for(n in e)U(n,e[n],t,i);return r.join("&").replace(Dt,"+")},oe.fn.extend({serialize:function(){return oe.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=oe.prop(this,"elements");return e?oe.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!oe(this).is(":disabled")&&Ht.test(this.nodeName)&&!Lt.test(e)&&(this.checked||!He.test(e))}).map(function(e,t){var n=oe(this).val();return null==n?null:oe.isArray(n)?oe.map(n,function(e){return{name:t.name,value:e.replace(qt,"\r\n")}}):{name:t.name,value:n.replace(qt,"\r\n")}}).get()}}),oe.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Ot={0:200,1223:204},Ft=oe.ajaxSettings.xhr();re.cors=!!Ft&&"withCredentials"in Ft,re.ajax=Ft=!!Ft,oe.ajaxTransport(function(t){var n,r;if(re.cors||Ft&&!t.crossDomain)return{send:function(i,o){var s,a=t.xhr();if(a.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(s in t.xhrFields)a[s]=t.xhrFields[s];t.mimeType&&a.overrideMimeType&&a.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(s in i)a.setRequestHeader(s,i[s]);n=function(e){return function(){n&&(n=r=a.onload=a.onerror=a.onabort=a.onreadystatechange=null,"abort"===e?a.abort():"error"===e?"number"!=typeof a.status?o(0,"error"):o(a.status,a.statusText):o(Ot[a.status]||a.status,a.statusText,"text"!==(a.responseType||"text")||"string"!=typeof a.responseText?{binary:a.response}:{text:a.responseText},a.getAllResponseHeaders()))}},a.onload=n(),r=a.onerror=n("error"),void 0!==a.onabort?a.onabort=r:a.onreadystatechange=function(){4===a.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{a.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),oe.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return oe.globalEval(e),e}}}),oe.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),oe.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=oe("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),G.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Pt=[],Rt=/(=)\?(?=&|$)|\?\?/;oe.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Pt.pop()||oe.expando+"_"+mt++;return this[e]=!0,e}}),oe.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(Rt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rt.test(t.data)&&"data");if(a||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=oe.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(Rt,"$1"+i):t.jsonp!==!1&&(t.url+=(yt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||oe.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){void 0===o?oe(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Pt.push(i)),s&&oe.isFunction(o)&&o(s[0]),s=o=void 0}),"script"}),oe.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||G;var r=he.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=p([e],t,i),i&&i.length&&oe(i).remove(),oe.merge([],r.childNodes))};var Mt=oe.fn.load;oe.fn.load=function(e,t,n){if("string"!=typeof e&&Mt)return Mt.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>-1&&(r=oe.trim(e.slice(a)),e=e.slice(0,a)),oe.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),s.length>0&&oe.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?oe("<div>").append(oe.parseHTML(e)).find(r):e)}).always(n&&function(e,t){s.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},oe.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){oe.fn[t]=function(e){return this.on(t,e)}}),oe.expr.filters.animated=function(e){return oe.grep(oe.timers,function(t){return e===t.elem}).length},oe.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=oe.css(e,"position"),f=oe(e),p={};"static"===c&&(e.style.position="relative"),a=f.offset(),o=oe.css(e,"top"),u=oe.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=f.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),oe.isFunction(t)&&(t=t.call(e,n,oe.extend({},a))),null!=t.top&&(p.top=t.top-a.top+s),null!=t.left&&(p.left=t.left-a.left+i),"using"in t?t.using.call(e,p):f.css(p)}},oe.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){oe.offset.setOffset(this,e,t)});var t,n,r=this[0],i={top:0,left:0},o=r&&r.ownerDocument;if(o)return t=o.documentElement,oe.contains(t,r)?(i=r.getBoundingClientRect(),n=V(o),{top:i.top+n.pageYOffset-t.clientTop,left:i.left+n.pageXOffset-t.clientLeft}):i},position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===oe.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),oe.nodeName(e[0],"html")||(r=e.offset()),r.top+=oe.css(e[0],"borderTopWidth",!0),r.left+=oe.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-oe.css(n,"marginTop",!0),left:t.left-r.left-oe.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===oe.css(e,"position");)e=e.offsetParent;return e||Ke})}}),oe.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;oe.fn[e]=function(r){return Ce(this,function(e,r,i){var o=V(e);return void 0===i?o?o[t]:e[r]:void(o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i)},e,r,arguments.length)}}),oe.each(["top","left"],function(e,t){oe.cssHooks[t]=S(re.pixelPosition,function(e,n){if(n)return n=N(e,t),Ge.test(n)?oe(e).position()[t]+"px":n})}),oe.each({Height:"height",Width:"width"},function(e,t){oe.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){oe.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return Ce(this,function(t,n,r){var i;return oe.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?oe.css(t,n,s):oe.style(t,n,r,s)},t,o?r:void 0,o,null)}})}),oe.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},size:function(){return this.length}}),oe.fn.andSelf=oe.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return oe});var It=e.jQuery,Wt=e.$;return oe.noConflict=function(t){return e.$===oe&&(e.$=Wt),t&&e.jQuery===oe&&(e.jQuery=It),oe},t||(e.jQuery=e.$=oe),oe});

},{}],50:[function(require,module,exports){
!function(e,a){"object"==typeof exports&&"undefined"!=typeof module?module.exports=a():"function"==typeof define&&define.amd?define(a):e.moment=a()}(this,function(){"use strict";function e(){return ln.apply(null,arguments)}function a(e){ln=e}function t(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function s(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function n(e){var a;for(a in e)return!1;return!0}function r(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function _(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function d(e,a){var t,s=[];for(t=0;t<e.length;++t)s.push(a(e[t],t));return s}function i(e,a){return Object.prototype.hasOwnProperty.call(e,a)}function o(e,a){for(var t in a)i(a,t)&&(e[t]=a[t]);return i(a,"toString")&&(e.toString=a.toString),i(a,"valueOf")&&(e.valueOf=a.valueOf),e}function m(e,a,t,s){return Ya(e,a,t,s,!0).utc()}function u(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null}}function l(e){return null==e._pf&&(e._pf=u()),e._pf}function M(e){if(null==e._isValid){var a=l(e),t=hn.call(a.parsedDateParts,function(e){return null!=e}),s=!isNaN(e._d.getTime())&&a.overflow<0&&!a.empty&&!a.invalidMonth&&!a.invalidWeekday&&!a.nullInput&&!a.invalidFormat&&!a.userInvalidated&&(!a.meridiem||a.meridiem&&t);if(e._strict&&(s=s&&0===a.charsLeftOver&&0===a.unusedTokens.length&&void 0===a.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return s;e._isValid=s}return e._isValid}function h(e){var a=m(NaN);return null!=e?o(l(a),e):l(a).userInvalidated=!0,a}function L(e){return void 0===e}function c(e,a){var t,s,n;if(L(a._isAMomentObject)||(e._isAMomentObject=a._isAMomentObject),L(a._i)||(e._i=a._i),L(a._f)||(e._f=a._f),L(a._l)||(e._l=a._l),L(a._strict)||(e._strict=a._strict),L(a._tzm)||(e._tzm=a._tzm),L(a._isUTC)||(e._isUTC=a._isUTC),L(a._offset)||(e._offset=a._offset),L(a._pf)||(e._pf=l(a)),L(a._locale)||(e._locale=a._locale),Ln.length>0)for(t in Ln)s=Ln[t],n=a[s],L(n)||(e[s]=n);return e}function Y(a){c(this,a),this._d=new Date(null!=a._d?a._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),cn===!1&&(cn=!0,e.updateOffset(this),cn=!1)}function y(e){return e instanceof Y||null!=e&&null!=e._isAMomentObject}function p(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function f(e){var a=+e,t=0;return 0!==a&&isFinite(a)&&(t=p(a)),t}function k(e,a,t){var s,n=Math.min(e.length,a.length),r=Math.abs(e.length-a.length),_=0;for(s=0;s<n;s++)(t&&e[s]!==a[s]||!t&&f(e[s])!==f(a[s]))&&_++;return _+r}function D(a){e.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function T(a,t){var s=!0;return o(function(){if(null!=e.deprecationHandler&&e.deprecationHandler(null,a),s){for(var n,r=[],_=0;_<arguments.length;_++){if(n="","object"==typeof arguments[_]){n+="\n["+_+"] ";for(var d in arguments[0])n+=d+": "+arguments[0][d]+", ";n=n.slice(0,-2)}else n=arguments[_];r.push(n)}D(a+"\nArguments: "+Array.prototype.slice.call(r).join("")+"\n"+(new Error).stack),s=!1}return t.apply(this,arguments)},t)}function g(a,t){null!=e.deprecationHandler&&e.deprecationHandler(a,t),Yn[a]||(D(t),Yn[a]=!0)}function w(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function v(e){var a,t;for(t in e)a=e[t],w(a)?this[t]=a:this["_"+t]=a;this._config=e,this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function S(e,a){var t,n=o({},e);for(t in a)i(a,t)&&(s(e[t])&&s(a[t])?(n[t]={},o(n[t],e[t]),o(n[t],a[t])):null!=a[t]?n[t]=a[t]:delete n[t]);for(t in e)i(e,t)&&!i(a,t)&&s(e[t])&&(n[t]=o({},n[t]));return n}function H(e){null!=e&&this.set(e)}function b(e,a,t){var s=this._calendar[e]||this._calendar.sameElse;return w(s)?s.call(a,t):s}function j(e){var a=this._longDateFormat[e],t=this._longDateFormat[e.toUpperCase()];return a||!t?a:(this._longDateFormat[e]=t.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])}function x(){return this._invalidDate}function P(e){return this._ordinal.replace("%d",e)}function W(e,a,t,s){var n=this._relativeTime[t];return w(n)?n(e,a,t,s):n.replace(/%d/i,e)}function A(e,a){var t=this._relativeTime[e>0?"future":"past"];return w(t)?t(a):t.replace(/%s/i,a)}function E(e,a){var t=e.toLowerCase();Sn[t]=Sn[t+"s"]=Sn[a]=e}function F(e){return"string"==typeof e?Sn[e]||Sn[e.toLowerCase()]:void 0}function z(e){var a,t,s={};for(t in e)i(e,t)&&(a=F(t),a&&(s[a]=e[t]));return s}function O(e,a){Hn[e]=a}function J(e){var a=[];for(var t in e)a.push({unit:t,priority:Hn[t]});return a.sort(function(e,a){return e.priority-a.priority}),a}function R(a,t){return function(s){return null!=s?(C(this,a,s),e.updateOffset(this,t),this):I(this,a)}}function I(e,a){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+a]():NaN}function C(e,a,t){e.isValid()&&e._d["set"+(e._isUTC?"UTC":"")+a](t)}function G(e){return e=F(e),w(this[e])?this[e]():this}function N(e,a){if("object"==typeof e){e=z(e);for(var t=J(e),s=0;s<t.length;s++)this[t[s].unit](e[t[s].unit])}else if(e=F(e),w(this[e]))return this[e](a);return this}function U(e,a,t){var s=""+Math.abs(e),n=a-s.length,r=e>=0;return(r?t?"+":"":"-")+Math.pow(10,Math.max(0,n)).toString().substr(1)+s}function V(e,a,t,s){var n=s;"string"==typeof s&&(n=function(){return this[s]()}),e&&(Pn[e]=n),a&&(Pn[a[0]]=function(){return U(n.apply(this,arguments),a[1],a[2])}),t&&(Pn[t]=function(){return this.localeData().ordinal(n.apply(this,arguments),e)})}function $(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function K(e){var a,t,s=e.match(bn);for(a=0,t=s.length;a<t;a++)Pn[s[a]]?s[a]=Pn[s[a]]:s[a]=$(s[a]);return function(a){var n,r="";for(n=0;n<t;n++)r+=s[n]instanceof Function?s[n].call(a,e):s[n];return r}}function Z(e,a){return e.isValid()?(a=q(a,e.localeData()),xn[a]=xn[a]||K(a),xn[a](e)):e.localeData().invalidDate()}function q(e,a){function t(e){return a.longDateFormat(e)||e}var s=5;for(jn.lastIndex=0;s>=0&&jn.test(e);)e=e.replace(jn,t),jn.lastIndex=0,s-=1;return e}function B(e,a,t){qn[e]=w(a)?a:function(e,s){return e&&t?t:a}}function Q(e,a){return i(qn,e)?qn[e](a._strict,a._locale):new RegExp(X(e))}function X(e){return ee(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,a,t,s,n){return a||t||s||n}))}function ee(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function ae(e,a){var t,s=a;for("string"==typeof e&&(e=[e]),r(a)&&(s=function(e,t){t[a]=f(e)}),t=0;t<e.length;t++)Bn[e[t]]=s}function te(e,a){ae(e,function(e,t,s,n){s._w=s._w||{},a(e,s._w,s,n)})}function se(e,a,t){null!=a&&i(Bn,e)&&Bn[e](a,t._a,t,e)}function ne(e,a){return new Date(Date.UTC(e,a+1,0)).getUTCDate()}function re(e,a){return e?t(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||ir).test(a)?"format":"standalone"][e.month()]:this._months}function _e(e,a){return e?t(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[ir.test(a)?"format":"standalone"][e.month()]:this._monthsShort}function de(e,a,t){var s,n,r,_=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=m([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return t?"MMM"===a?(n=dr.call(this._shortMonthsParse,_),n!==-1?n:null):(n=dr.call(this._longMonthsParse,_),n!==-1?n:null):"MMM"===a?(n=dr.call(this._shortMonthsParse,_),n!==-1?n:(n=dr.call(this._longMonthsParse,_),n!==-1?n:null)):(n=dr.call(this._longMonthsParse,_),n!==-1?n:(n=dr.call(this._shortMonthsParse,_),n!==-1?n:null))}function ie(e,a,t){var s,n,r;if(this._monthsParseExact)return de.call(this,e,a,t);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(n=m([2e3,s]),t&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(n,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(n,"").replace(".","")+"$","i")),t||this._monthsParse[s]||(r="^"+this.months(n,"")+"|^"+this.monthsShort(n,""),this._monthsParse[s]=new RegExp(r.replace(".",""),"i")),t&&"MMMM"===a&&this._longMonthsParse[s].test(e))return s;if(t&&"MMM"===a&&this._shortMonthsParse[s].test(e))return s;if(!t&&this._monthsParse[s].test(e))return s}}function oe(e,a){var t;if(!e.isValid())return e;if("string"==typeof a)if(/^\d+$/.test(a))a=f(a);else if(a=e.localeData().monthsParse(a),!r(a))return e;return t=Math.min(e.date(),ne(e.year(),a)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](a,t),e}function me(a){return null!=a?(oe(this,a),e.updateOffset(this,!0),this):I(this,"Month")}function ue(){return ne(this.year(),this.month())}function le(e){return this._monthsParseExact?(i(this,"_monthsRegex")||he.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(i(this,"_monthsShortRegex")||(this._monthsShortRegex=ur),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)}function Me(e){return this._monthsParseExact?(i(this,"_monthsRegex")||he.call(this),e?this._monthsStrictRegex:this._monthsRegex):(i(this,"_monthsRegex")||(this._monthsRegex=lr),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)}function he(){function e(e,a){return a.length-e.length}var a,t,s=[],n=[],r=[];for(a=0;a<12;a++)t=m([2e3,a]),s.push(this.monthsShort(t,"")),n.push(this.months(t,"")),r.push(this.months(t,"")),r.push(this.monthsShort(t,""));for(s.sort(e),n.sort(e),r.sort(e),a=0;a<12;a++)s[a]=ee(s[a]),n[a]=ee(n[a]);for(a=0;a<24;a++)r[a]=ee(r[a]);this._monthsRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+n.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+s.join("|")+")","i")}function Le(e){return ce(e)?366:365}function ce(e){return e%4===0&&e%100!==0||e%400===0}function Ye(){return ce(this.year())}function ye(e,a,t,s,n,r,_){var d=new Date(e,a,t,s,n,r,_);return e<100&&e>=0&&isFinite(d.getFullYear())&&d.setFullYear(e),d}function pe(e){var a=new Date(Date.UTC.apply(null,arguments));return e<100&&e>=0&&isFinite(a.getUTCFullYear())&&a.setUTCFullYear(e),a}function fe(e,a,t){var s=7+a-t,n=(7+pe(e,0,s).getUTCDay()-a)%7;return-n+s-1}function ke(e,a,t,s,n){var r,_,d=(7+t-s)%7,i=fe(e,s,n),o=1+7*(a-1)+d+i;return o<=0?(r=e-1,_=Le(r)+o):o>Le(e)?(r=e+1,_=o-Le(e)):(r=e,_=o),{year:r,dayOfYear:_}}function De(e,a,t){var s,n,r=fe(e.year(),a,t),_=Math.floor((e.dayOfYear()-r-1)/7)+1;return _<1?(n=e.year()-1,s=_+Te(n,a,t)):_>Te(e.year(),a,t)?(s=_-Te(e.year(),a,t),n=e.year()+1):(n=e.year(),s=_),{week:s,year:n}}function Te(e,a,t){var s=fe(e,a,t),n=fe(e+1,a,t);return(Le(e)-s+n)/7}function ge(e){return De(e,this._week.dow,this._week.doy).week}function we(){return this._week.dow}function ve(){return this._week.doy}function Se(e){var a=this.localeData().week(this);return null==e?a:this.add(7*(e-a),"d")}function He(e){var a=De(this,1,4).week;return null==e?a:this.add(7*(e-a),"d")}function be(e,a){return"string"!=typeof e?e:isNaN(e)?(e=a.weekdaysParse(e),"number"==typeof e?e:null):parseInt(e,10)}function je(e,a){return"string"==typeof e?a.weekdaysParse(e)%7||7:isNaN(e)?null:e}function xe(e,a){return e?t(this._weekdays)?this._weekdays[e.day()]:this._weekdays[this._weekdays.isFormat.test(a)?"format":"standalone"][e.day()]:this._weekdays}function Pe(e){return e?this._weekdaysShort[e.day()]:this._weekdaysShort}function We(e){return e?this._weekdaysMin[e.day()]:this._weekdaysMin}function Ae(e,a,t){var s,n,r,_=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=m([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return t?"dddd"===a?(n=dr.call(this._weekdaysParse,_),n!==-1?n:null):"ddd"===a?(n=dr.call(this._shortWeekdaysParse,_),n!==-1?n:null):(n=dr.call(this._minWeekdaysParse,_),n!==-1?n:null):"dddd"===a?(n=dr.call(this._weekdaysParse,_),n!==-1?n:(n=dr.call(this._shortWeekdaysParse,_),n!==-1?n:(n=dr.call(this._minWeekdaysParse,_),n!==-1?n:null))):"ddd"===a?(n=dr.call(this._shortWeekdaysParse,_),n!==-1?n:(n=dr.call(this._weekdaysParse,_),n!==-1?n:(n=dr.call(this._minWeekdaysParse,_),n!==-1?n:null))):(n=dr.call(this._minWeekdaysParse,_),n!==-1?n:(n=dr.call(this._weekdaysParse,_),n!==-1?n:(n=dr.call(this._shortWeekdaysParse,_),n!==-1?n:null)))}function Ee(e,a,t){var s,n,r;if(this._weekdaysParseExact)return Ae.call(this,e,a,t);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(n=m([2e3,1]).day(s),t&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(n,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(n,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(n,"").replace(".",".?")+"$","i")),this._weekdaysParse[s]||(r="^"+this.weekdays(n,"")+"|^"+this.weekdaysShort(n,"")+"|^"+this.weekdaysMin(n,""),this._weekdaysParse[s]=new RegExp(r.replace(".",""),"i")),t&&"dddd"===a&&this._fullWeekdaysParse[s].test(e))return s;if(t&&"ddd"===a&&this._shortWeekdaysParse[s].test(e))return s;if(t&&"dd"===a&&this._minWeekdaysParse[s].test(e))return s;if(!t&&this._weekdaysParse[s].test(e))return s}}function Fe(e){if(!this.isValid())return null!=e?this:NaN;var a=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=be(e,this.localeData()),this.add(e-a,"d")):a}function ze(e){if(!this.isValid())return null!=e?this:NaN;var a=(this.day()+7-this.localeData()._week.dow)%7;return null==e?a:this.add(e-a,"d")}function Oe(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var a=je(e,this.localeData());return this.day(this.day()%7?a:a-7)}return this.day()||7}function Je(e){return this._weekdaysParseExact?(i(this,"_weekdaysRegex")||Ce.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(i(this,"_weekdaysRegex")||(this._weekdaysRegex=yr),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)}function Re(e){return this._weekdaysParseExact?(i(this,"_weekdaysRegex")||Ce.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(i(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=pr),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}function Ie(e){return this._weekdaysParseExact?(i(this,"_weekdaysRegex")||Ce.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(i(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=fr),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function Ce(){function e(e,a){return a.length-e.length}var a,t,s,n,r,_=[],d=[],i=[],o=[];for(a=0;a<7;a++)t=m([2e3,1]).day(a),s=this.weekdaysMin(t,""),n=this.weekdaysShort(t,""),r=this.weekdays(t,""),_.push(s),d.push(n),i.push(r),o.push(s),o.push(n),o.push(r);for(_.sort(e),d.sort(e),i.sort(e),o.sort(e),a=0;a<7;a++)d[a]=ee(d[a]),i[a]=ee(i[a]),o[a]=ee(o[a]);this._weekdaysRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+d.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+_.join("|")+")","i")}function Ge(){return this.hours()%12||12}function Ne(){return this.hours()||24}function Ue(e,a){V(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),a)})}function Ve(e,a){return a._meridiemParse}function $e(e){return"p"===(e+"").toLowerCase().charAt(0)}function Ke(e,a,t){return e>11?t?"pm":"PM":t?"am":"AM"}function Ze(e){return e?e.toLowerCase().replace("_","-"):e}function qe(e){for(var a,t,s,n,r=0;r<e.length;){for(n=Ze(e[r]).split("-"),a=n.length,t=Ze(e[r+1]),t=t?t.split("-"):null;a>0;){if(s=Be(n.slice(0,a).join("-")))return s;if(t&&t.length>=a&&k(n,t,!0)>=a-1)break;a--}r++}return null}function Be(e){var a=null;if(!wr[e]&&"undefined"!=typeof module&&module&&module.exports)try{a=kr._abbr,require("./locale/"+e),Qe(a)}catch(e){}return wr[e]}function Qe(e,a){var t;return e&&(t=L(a)?aa(e):Xe(e,a),t&&(kr=t)),kr._abbr}function Xe(e,a){if(null!==a){var t=gr;if(a.abbr=e,null!=wr[e])g("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),t=wr[e]._config;else if(null!=a.parentLocale){if(null==wr[a.parentLocale])return vr[a.parentLocale]||(vr[a.parentLocale]=[]),vr[a.parentLocale].push({name:e,config:a}),null;t=wr[a.parentLocale]._config}return wr[e]=new H(S(t,a)),vr[e]&&vr[e].forEach(function(e){Xe(e.name,e.config)}),Qe(e),wr[e]}return delete wr[e],null}function ea(e,a){if(null!=a){var t,s=gr;null!=wr[e]&&(s=wr[e]._config),a=S(s,a),t=new H(a),t.parentLocale=wr[e],wr[e]=t,Qe(e)}else null!=wr[e]&&(null!=wr[e].parentLocale?wr[e]=wr[e].parentLocale:null!=wr[e]&&delete wr[e]);return wr[e]}function aa(e){var a;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return kr;if(!t(e)){if(a=Be(e))return a;e=[e]}return qe(e)}function ta(){return fn(wr)}function sa(e){var a,t=e._a;return t&&l(e).overflow===-2&&(a=t[Xn]<0||t[Xn]>11?Xn:t[er]<1||t[er]>ne(t[Qn],t[Xn])?er:t[ar]<0||t[ar]>24||24===t[ar]&&(0!==t[tr]||0!==t[sr]||0!==t[nr])?ar:t[tr]<0||t[tr]>59?tr:t[sr]<0||t[sr]>59?sr:t[nr]<0||t[nr]>999?nr:-1,l(e)._overflowDayOfYear&&(a<Qn||a>er)&&(a=er),l(e)._overflowWeeks&&a===-1&&(a=rr),l(e)._overflowWeekday&&a===-1&&(a=_r),l(e).overflow=a),e}function na(e){var a,t,s,n,r,_,d=e._i,i=Sr.exec(d)||Hr.exec(d);if(i){for(l(e).iso=!0,a=0,t=jr.length;a<t;a++)if(jr[a][1].exec(i[1])){n=jr[a][0],s=jr[a][2]!==!1;break}if(null==n)return void(e._isValid=!1);if(i[3]){for(a=0,t=xr.length;a<t;a++)if(xr[a][1].exec(i[3])){r=(i[2]||" ")+xr[a][0];break}if(null==r)return void(e._isValid=!1)}if(!s&&null!=r)return void(e._isValid=!1);if(i[4]){if(!br.exec(i[4]))return void(e._isValid=!1);_="Z"}e._f=n+(r||"")+(_||""),ma(e)}else e._isValid=!1}function ra(a){var t=Pr.exec(a._i);return null!==t?void(a._d=new Date((+t[1]))):(na(a),void(a._isValid===!1&&(delete a._isValid,e.createFromInputFallback(a))))}function _a(e,a,t){return null!=e?e:null!=a?a:t}function da(a){var t=new Date(e.now());return a._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}function ia(e){var a,t,s,n,r=[];if(!e._d){for(s=da(e),e._w&&null==e._a[er]&&null==e._a[Xn]&&oa(e),e._dayOfYear&&(n=_a(e._a[Qn],s[Qn]),e._dayOfYear>Le(n)&&(l(e)._overflowDayOfYear=!0),t=pe(n,0,e._dayOfYear),e._a[Xn]=t.getUTCMonth(),e._a[er]=t.getUTCDate()),a=0;a<3&&null==e._a[a];++a)e._a[a]=r[a]=s[a];for(;a<7;a++)e._a[a]=r[a]=null==e._a[a]?2===a?1:0:e._a[a];24===e._a[ar]&&0===e._a[tr]&&0===e._a[sr]&&0===e._a[nr]&&(e._nextDay=!0,e._a[ar]=0),e._d=(e._useUTC?pe:ye).apply(null,r),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[ar]=24)}}function oa(e){var a,t,s,n,r,_,d,i;if(a=e._w,null!=a.GG||null!=a.W||null!=a.E)r=1,_=4,t=_a(a.GG,e._a[Qn],De(ya(),1,4).year),s=_a(a.W,1),n=_a(a.E,1),(n<1||n>7)&&(i=!0);else{r=e._locale._week.dow,_=e._locale._week.doy;var o=De(ya(),r,_);t=_a(a.gg,e._a[Qn],o.year),s=_a(a.w,o.week),null!=a.d?(n=a.d,(n<0||n>6)&&(i=!0)):null!=a.e?(n=a.e+r,(a.e<0||a.e>6)&&(i=!0)):n=r}s<1||s>Te(t,r,_)?l(e)._overflowWeeks=!0:null!=i?l(e)._overflowWeekday=!0:(d=ke(t,s,n,r,_),e._a[Qn]=d.year,e._dayOfYear=d.dayOfYear)}function ma(a){if(a._f===e.ISO_8601)return void na(a);a._a=[],l(a).empty=!0;var t,s,n,r,_,d=""+a._i,i=d.length,o=0;for(n=q(a._f,a._locale).match(bn)||[],t=0;t<n.length;t++)r=n[t],s=(d.match(Q(r,a))||[])[0],s&&(_=d.substr(0,d.indexOf(s)),_.length>0&&l(a).unusedInput.push(_),d=d.slice(d.indexOf(s)+s.length),o+=s.length),Pn[r]?(s?l(a).empty=!1:l(a).unusedTokens.push(r),se(r,s,a)):a._strict&&!s&&l(a).unusedTokens.push(r);l(a).charsLeftOver=i-o,d.length>0&&l(a).unusedInput.push(d),a._a[ar]<=12&&l(a).bigHour===!0&&a._a[ar]>0&&(l(a).bigHour=void 0),l(a).parsedDateParts=a._a.slice(0),l(a).meridiem=a._meridiem,a._a[ar]=ua(a._locale,a._a[ar],a._meridiem),ia(a),sa(a)}function ua(e,a,t){var s;return null==t?a:null!=e.meridiemHour?e.meridiemHour(a,t):null!=e.isPM?(s=e.isPM(t),s&&a<12&&(a+=12),s||12!==a||(a=0),a):a}function la(e){var a,t,s,n,r;if(0===e._f.length)return l(e).invalidFormat=!0,void(e._d=new Date(NaN));for(n=0;n<e._f.length;n++)r=0,a=c({},e),null!=e._useUTC&&(a._useUTC=e._useUTC),a._f=e._f[n],ma(a),M(a)&&(r+=l(a).charsLeftOver,r+=10*l(a).unusedTokens.length,l(a).score=r,(null==s||r<s)&&(s=r,t=a));o(e,t||a)}function Ma(e){if(!e._d){var a=z(e._i);e._a=d([a.year,a.month,a.day||a.date,a.hour,a.minute,a.second,a.millisecond],function(e){return e&&parseInt(e,10)}),ia(e)}}function ha(e){var a=new Y(sa(La(e)));return a._nextDay&&(a.add(1,"d"),a._nextDay=void 0),a}function La(e){var a=e._i,s=e._f;return e._locale=e._locale||aa(e._l),null===a||void 0===s&&""===a?h({nullInput:!0}):("string"==typeof a&&(e._i=a=e._locale.preparse(a)),y(a)?new Y(sa(a)):(_(a)?e._d=a:t(s)?la(e):s?ma(e):ca(e),M(e)||(e._d=null),e))}function ca(a){var s=a._i;void 0===s?a._d=new Date(e.now()):_(s)?a._d=new Date(s.valueOf()):"string"==typeof s?ra(a):t(s)?(a._a=d(s.slice(0),function(e){return parseInt(e,10)}),ia(a)):"object"==typeof s?Ma(a):r(s)?a._d=new Date(s):e.createFromInputFallback(a)}function Ya(e,a,r,_,d){var i={};return r!==!0&&r!==!1||(_=r,r=void 0),(s(e)&&n(e)||t(e)&&0===e.length)&&(e=void 0),i._isAMomentObject=!0,i._useUTC=i._isUTC=d,i._l=r,i._i=e,i._f=a,i._strict=_,ha(i)}function ya(e,a,t,s){return Ya(e,a,t,s,!1)}function pa(e,a){var s,n;if(1===a.length&&t(a[0])&&(a=a[0]),!a.length)return ya();for(s=a[0],n=1;n<a.length;++n)a[n].isValid()&&!a[n][e](s)||(s=a[n]);return s}function fa(){var e=[].slice.call(arguments,0);return pa("isBefore",e)}function ka(){var e=[].slice.call(arguments,0);return pa("isAfter",e)}function Da(e){var a=z(e),t=a.year||0,s=a.quarter||0,n=a.month||0,r=a.week||0,_=a.day||0,d=a.hour||0,i=a.minute||0,o=a.second||0,m=a.millisecond||0;this._milliseconds=+m+1e3*o+6e4*i+1e3*d*60*60,this._days=+_+7*r,this._months=+n+3*s+12*t,this._data={},this._locale=aa(),this._bubble()}function Ta(e){return e instanceof Da}function ga(e){return e<0?Math.round(-1*e)*-1:Math.round(e)}function wa(e,a){V(e,0,0,function(){var e=this.utcOffset(),t="+";return e<0&&(e=-e,t="-"),t+U(~~(e/60),2)+a+U(~~e%60,2)})}function va(e,a){var t=(a||"").match(e);if(null===t)return null;var s=t[t.length-1]||[],n=(s+"").match(Fr)||["-",0,0],r=+(60*n[1])+f(n[2]);return 0===r?0:"+"===n[0]?r:-r}function Sa(a,t){var s,n;return t._isUTC?(s=t.clone(),n=(y(a)||_(a)?a.valueOf():ya(a).valueOf())-s.valueOf(),s._d.setTime(s._d.valueOf()+n),e.updateOffset(s,!1),s):ya(a).local()}function Ha(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function ba(a,t){var s,n=this._offset||0;if(!this.isValid())return null!=a?this:NaN;if(null!=a){if("string"==typeof a){if(a=va($n,a),null===a)return this}else Math.abs(a)<16&&(a=60*a);return!this._isUTC&&t&&(s=Ha(this)),this._offset=a,this._isUTC=!0,null!=s&&this.add(s,"m"),n!==a&&(!t||this._changeInProgress?Ua(this,Ra(a-n,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,e.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?n:Ha(this)}function ja(e,a){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,a),this):-this.utcOffset()}function xa(e){return this.utcOffset(0,e)}function Pa(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Ha(this),"m")),this}function Wa(){if(null!=this._tzm)this.utcOffset(this._tzm);else if("string"==typeof this._i){var e=va(Vn,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this}function Aa(e){return!!this.isValid()&&(e=e?ya(e).utcOffset():0,(this.utcOffset()-e)%60===0)}function Ea(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Fa(){if(!L(this._isDSTShifted))return this._isDSTShifted;var e={};if(c(e,this),e=La(e),e._a){var a=e._isUTC?m(e._a):ya(e._a);this._isDSTShifted=this.isValid()&&k(e._a,a.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function za(){return!!this.isValid()&&!this._isUTC}function Oa(){return!!this.isValid()&&this._isUTC}function Ja(){return!!this.isValid()&&this._isUTC&&0===this._offset}function Ra(e,a){var t,s,n,_=e,d=null;return Ta(e)?_={ms:e._milliseconds,d:e._days,M:e._months}:r(e)?(_={},a?_[a]=e:_.milliseconds=e):(d=zr.exec(e))?(t="-"===d[1]?-1:1,_={y:0,d:f(d[er])*t,h:f(d[ar])*t,m:f(d[tr])*t,s:f(d[sr])*t,ms:f(ga(1e3*d[nr]))*t}):(d=Or.exec(e))?(t="-"===d[1]?-1:1,_={y:Ia(d[2],t),M:Ia(d[3],t),w:Ia(d[4],t),d:Ia(d[5],t),h:Ia(d[6],t),m:Ia(d[7],t),s:Ia(d[8],t)}):null==_?_={}:"object"==typeof _&&("from"in _||"to"in _)&&(n=Ga(ya(_.from),ya(_.to)),_={},_.ms=n.milliseconds,_.M=n.months),s=new Da(_),Ta(e)&&i(e,"_locale")&&(s._locale=e._locale),s}function Ia(e,a){var t=e&&parseFloat(e.replace(",","."));return(isNaN(t)?0:t)*a}function Ca(e,a){var t={milliseconds:0,months:0};return t.months=a.month()-e.month()+12*(a.year()-e.year()),e.clone().add(t.months,"M").isAfter(a)&&--t.months,t.milliseconds=+a-+e.clone().add(t.months,"M"),t}function Ga(e,a){var t;return e.isValid()&&a.isValid()?(a=Sa(a,e),e.isBefore(a)?t=Ca(e,a):(t=Ca(a,e),t.milliseconds=-t.milliseconds,t.months=-t.months),t):{milliseconds:0,months:0}}function Na(e,a){return function(t,s){var n,r;return null===s||isNaN(+s)||(g(a,"moment()."+a+"(period, number) is deprecated. Please use moment()."+a+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),r=t,t=s,s=r),t="string"==typeof t?+t:t,n=Ra(t,s),Ua(this,n,e),this}}function Ua(a,t,s,n){var r=t._milliseconds,_=ga(t._days),d=ga(t._months);a.isValid()&&(n=null==n||n,r&&a._d.setTime(a._d.valueOf()+r*s),_&&C(a,"Date",I(a,"Date")+_*s),d&&oe(a,I(a,"Month")+d*s),n&&e.updateOffset(a,_||d))}function Va(e,a){var t=e.diff(a,"days",!0);return t<-6?"sameElse":t<-1?"lastWeek":t<0?"lastDay":t<1?"sameDay":t<2?"nextDay":t<7?"nextWeek":"sameElse"}function $a(a,t){var s=a||ya(),n=Sa(s,this).startOf("day"),r=e.calendarFormat(this,n)||"sameElse",_=t&&(w(t[r])?t[r].call(this,s):t[r]);return this.format(_||this.localeData().calendar(r,this,ya(s)))}function Ka(){return new Y(this)}function Za(e,a){var t=y(e)?e:ya(e);return!(!this.isValid()||!t.isValid())&&(a=F(L(a)?"millisecond":a),"millisecond"===a?this.valueOf()>t.valueOf():t.valueOf()<this.clone().startOf(a).valueOf())}function qa(e,a){var t=y(e)?e:ya(e);return!(!this.isValid()||!t.isValid())&&(a=F(L(a)?"millisecond":a),"millisecond"===a?this.valueOf()<t.valueOf():this.clone().endOf(a).valueOf()<t.valueOf())}function Ba(e,a,t,s){return s=s||"()",("("===s[0]?this.isAfter(e,t):!this.isBefore(e,t))&&(")"===s[1]?this.isBefore(a,t):!this.isAfter(a,t))}function Qa(e,a){var t,s=y(e)?e:ya(e);return!(!this.isValid()||!s.isValid())&&(a=F(a||"millisecond"),"millisecond"===a?this.valueOf()===s.valueOf():(t=s.valueOf(),this.clone().startOf(a).valueOf()<=t&&t<=this.clone().endOf(a).valueOf()))}function Xa(e,a){return this.isSame(e,a)||this.isAfter(e,a)}function et(e,a){return this.isSame(e,a)||this.isBefore(e,a)}function at(e,a,t){var s,n,r,_;return this.isValid()?(s=Sa(e,this),s.isValid()?(n=6e4*(s.utcOffset()-this.utcOffset()),a=F(a),"year"===a||"month"===a||"quarter"===a?(_=tt(this,s),"quarter"===a?_/=3:"year"===a&&(_/=12)):(r=this-s,_="second"===a?r/1e3:"minute"===a?r/6e4:"hour"===a?r/36e5:"day"===a?(r-n)/864e5:"week"===a?(r-n)/6048e5:r),t?_:p(_)):NaN):NaN}function tt(e,a){var t,s,n=12*(a.year()-e.year())+(a.month()-e.month()),r=e.clone().add(n,"months");return a-r<0?(t=e.clone().add(n-1,"months"),s=(a-r)/(r-t)):(t=e.clone().add(n+1,"months"),s=(a-r)/(t-r)),-(n+s)||0}function st(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function nt(){var e=this.clone().utc();return 0<e.year()&&e.year()<=9999?w(Date.prototype.toISOString)?this.toDate().toISOString():Z(e,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):Z(e,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function rt(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e="moment",a="";this.isLocal()||(e=0===this.utcOffset()?"moment.utc":"moment.parseZone",a="Z");var t="["+e+'("]',s=0<this.year()&&this.year()<=9999?"YYYY":"YYYYYY",n="-MM-DD[T]HH:mm:ss.SSS",r=a+'[")]';return this.format(t+s+n+r)}function _t(a){a||(a=this.isUtc()?e.defaultFormatUtc:e.defaultFormat);var t=Z(this,a);return this.localeData().postformat(t)}function dt(e,a){return this.isValid()&&(y(e)&&e.isValid()||ya(e).isValid())?Ra({to:this,from:e}).locale(this.locale()).humanize(!a):this.localeData().invalidDate()}function it(e){return this.from(ya(),e)}function ot(e,a){return this.isValid()&&(y(e)&&e.isValid()||ya(e).isValid())?Ra({from:this,to:e}).locale(this.locale()).humanize(!a):this.localeData().invalidDate()}function mt(e){return this.to(ya(),e)}function ut(e){var a;return void 0===e?this._locale._abbr:(a=aa(e),null!=a&&(this._locale=a),this)}function lt(){return this._locale}function Mt(e){switch(e=F(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this}function ht(e){return e=F(e),void 0===e||"millisecond"===e?this:("date"===e&&(e="day"),this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms"))}function Lt(){return this._d.valueOf()-6e4*(this._offset||0)}function ct(){return Math.floor(this.valueOf()/1e3)}function Yt(){return new Date(this.valueOf())}function yt(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]}function pt(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}}function ft(){return this.isValid()?this.toISOString():null}function kt(){return M(this)}function Dt(){return o({},l(this))}function Tt(){return l(this).overflow}function gt(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function wt(e,a){V(0,[e,e.length],0,a)}function vt(e){return jt.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function St(e){return jt.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)}function Ht(){return Te(this.year(),1,4)}function bt(){var e=this.localeData()._week;return Te(this.year(),e.dow,e.doy)}function jt(e,a,t,s,n){var r;return null==e?De(this,s,n).year:(r=Te(e,s,n),a>r&&(a=r),xt.call(this,e,a,t,s,n))}function xt(e,a,t,s,n){var r=ke(e,a,t,s,n),_=pe(r.year,0,r.dayOfYear);return this.year(_.getUTCFullYear()),this.month(_.getUTCMonth()),this.date(_.getUTCDate()),this}function Pt(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)}function Wt(e){var a=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?a:this.add(e-a,"d")}function At(e,a){a[nr]=f(1e3*("0."+e))}function Et(){return this._isUTC?"UTC":""}function Ft(){return this._isUTC?"Coordinated Universal Time":""}function zt(e){return ya(1e3*e)}function Ot(){return ya.apply(null,arguments).parseZone()}function Jt(e){return e}function Rt(e,a,t,s){var n=aa(),r=m().set(s,a);return n[t](r,e)}function It(e,a,t){if(r(e)&&(a=e,e=void 0),e=e||"",null!=a)return Rt(e,a,t,"month");var s,n=[];for(s=0;s<12;s++)n[s]=Rt(e,s,t,"month");return n;
}function Ct(e,a,t,s){"boolean"==typeof e?(r(a)&&(t=a,a=void 0),a=a||""):(a=e,t=a,e=!1,r(a)&&(t=a,a=void 0),a=a||"");var n=aa(),_=e?n._week.dow:0;if(null!=t)return Rt(a,(t+_)%7,s,"day");var d,i=[];for(d=0;d<7;d++)i[d]=Rt(a,(d+_)%7,s,"day");return i}function Gt(e,a){return It(e,a,"months")}function Nt(e,a){return It(e,a,"monthsShort")}function Ut(e,a,t){return Ct(e,a,t,"weekdays")}function Vt(e,a,t){return Ct(e,a,t,"weekdaysShort")}function $t(e,a,t){return Ct(e,a,t,"weekdaysMin")}function Kt(){var e=this._data;return this._milliseconds=Zr(this._milliseconds),this._days=Zr(this._days),this._months=Zr(this._months),e.milliseconds=Zr(e.milliseconds),e.seconds=Zr(e.seconds),e.minutes=Zr(e.minutes),e.hours=Zr(e.hours),e.months=Zr(e.months),e.years=Zr(e.years),this}function Zt(e,a,t,s){var n=Ra(a,t);return e._milliseconds+=s*n._milliseconds,e._days+=s*n._days,e._months+=s*n._months,e._bubble()}function qt(e,a){return Zt(this,e,a,1)}function Bt(e,a){return Zt(this,e,a,-1)}function Qt(e){return e<0?Math.floor(e):Math.ceil(e)}function Xt(){var e,a,t,s,n,r=this._milliseconds,_=this._days,d=this._months,i=this._data;return r>=0&&_>=0&&d>=0||r<=0&&_<=0&&d<=0||(r+=864e5*Qt(as(d)+_),_=0,d=0),i.milliseconds=r%1e3,e=p(r/1e3),i.seconds=e%60,a=p(e/60),i.minutes=a%60,t=p(a/60),i.hours=t%24,_+=p(t/24),n=p(es(_)),d+=n,_-=Qt(as(n)),s=p(d/12),d%=12,i.days=_,i.months=d,i.years=s,this}function es(e){return 4800*e/146097}function as(e){return 146097*e/4800}function ts(e){var a,t,s=this._milliseconds;if(e=F(e),"month"===e||"year"===e)return a=this._days+s/864e5,t=this._months+es(a),"month"===e?t:t/12;switch(a=this._days+Math.round(as(this._months)),e){case"week":return a/7+s/6048e5;case"day":return a+s/864e5;case"hour":return 24*a+s/36e5;case"minute":return 1440*a+s/6e4;case"second":return 86400*a+s/1e3;case"millisecond":return Math.floor(864e5*a)+s;default:throw new Error("Unknown unit "+e)}}function ss(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*f(this._months/12)}function ns(e){return function(){return this.as(e)}}function rs(e){return e=F(e),this[e+"s"]()}function _s(e){return function(){return this._data[e]}}function ds(){return p(this.days()/7)}function is(e,a,t,s,n){return n.relativeTime(a||1,!!t,e,s)}function os(e,a,t){var s=Ra(e).abs(),n=u_(s.as("s")),r=u_(s.as("m")),_=u_(s.as("h")),d=u_(s.as("d")),i=u_(s.as("M")),o=u_(s.as("y")),m=n<l_.s&&["s",n]||r<=1&&["m"]||r<l_.m&&["mm",r]||_<=1&&["h"]||_<l_.h&&["hh",_]||d<=1&&["d"]||d<l_.d&&["dd",d]||i<=1&&["M"]||i<l_.M&&["MM",i]||o<=1&&["y"]||["yy",o];return m[2]=a,m[3]=+e>0,m[4]=t,is.apply(null,m)}function ms(e){return void 0===e?u_:"function"==typeof e&&(u_=e,!0)}function us(e,a){return void 0!==l_[e]&&(void 0===a?l_[e]:(l_[e]=a,!0))}function ls(e){var a=this.localeData(),t=os(this,!e,a);return e&&(t=a.pastFuture(+this,t)),a.postformat(t)}function Ms(){var e,a,t,s=M_(this._milliseconds)/1e3,n=M_(this._days),r=M_(this._months);e=p(s/60),a=p(e/60),s%=60,e%=60,t=p(r/12),r%=12;var _=t,d=r,i=n,o=a,m=e,u=s,l=this.asSeconds();return l?(l<0?"-":"")+"P"+(_?_+"Y":"")+(d?d+"M":"")+(i?i+"D":"")+(o||m||u?"T":"")+(o?o+"H":"")+(m?m+"M":"")+(u?u+"S":""):"P0D"}function hs(e,a){var t=e.split("_");return a%10===1&&a%100!==11?t[0]:a%10>=2&&a%10<=4&&(a%100<10||a%100>=20)?t[1]:t[2]}function Ls(e,a,t){var s={mm:a?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:a?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===t?a?"хвіліна":"хвіліну":"h"===t?a?"гадзіна":"гадзіну":e+" "+hs(s[t],+e)}function cs(e,a,t){var s={mm:"munutenn",MM:"miz",dd:"devezh"};return e+" "+ps(s[t],e)}function Ys(e){switch(ys(e)){case 1:case 3:case 4:case 5:case 9:return e+" bloaz";default:return e+" vloaz"}}function ys(e){return e>9?ys(e%10):e}function ps(e,a){return 2===a?fs(e):e}function fs(e){var a={m:"v",b:"v",d:"z"};return void 0===a[e.charAt(0)]?e:a[e.charAt(0)]+e.substring(1)}function ks(e,a,t){var s=e+" ";switch(t){case"m":return a?"jedna minuta":"jedne minute";case"mm":return s+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta";case"h":return a?"jedan sat":"jednog sata";case"hh":return s+=1===e?"sat":2===e||3===e||4===e?"sata":"sati";case"dd":return s+=1===e?"dan":"dana";case"MM":return s+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci";case"yy":return s+=1===e?"godina":2===e||3===e||4===e?"godine":"godina"}}function Ds(e){return e>1&&e<5&&1!==~~(e/10)}function Ts(e,a,t,s){var n=e+" ";switch(t){case"s":return a||s?"pár sekund":"pár sekundami";case"m":return a?"minuta":s?"minutu":"minutou";case"mm":return a||s?n+(Ds(e)?"minuty":"minut"):n+"minutami";case"h":return a?"hodina":s?"hodinu":"hodinou";case"hh":return a||s?n+(Ds(e)?"hodiny":"hodin"):n+"hodinami";case"d":return a||s?"den":"dnem";case"dd":return a||s?n+(Ds(e)?"dny":"dní"):n+"dny";case"M":return a||s?"měsíc":"měsícem";case"MM":return a||s?n+(Ds(e)?"měsíce":"měsíců"):n+"měsíci";case"y":return a||s?"rok":"rokem";case"yy":return a||s?n+(Ds(e)?"roky":"let"):n+"lety"}}function gs(e,a,t,s){var n={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return a?n[t][0]:n[t][1]}function ws(e,a,t,s){var n={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[e+" Tage",e+" Tagen"],M:["ein Monat","einem Monat"],MM:[e+" Monate",e+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[e+" Jahre",e+" Jahren"]};return a?n[t][0]:n[t][1]}function vs(e,a,t,s){var n={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[e+" minuti",e+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[e+" tunni",e+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[e+" kuu",e+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[e+" aasta",e+" aastat"]};return a?n[t][2]?n[t][2]:n[t][1]:s?n[t][0]:n[t][1]}function Ss(e,a,t,s){var n="";switch(t){case"s":return s?"muutaman sekunnin":"muutama sekunti";case"m":return s?"minuutin":"minuutti";case"mm":n=s?"minuutin":"minuuttia";break;case"h":return s?"tunnin":"tunti";case"hh":n=s?"tunnin":"tuntia";break;case"d":return s?"päivän":"päivä";case"dd":n=s?"päivän":"päivää";break;case"M":return s?"kuukauden":"kuukausi";case"MM":n=s?"kuukauden":"kuukautta";break;case"y":return s?"vuoden":"vuosi";case"yy":n=s?"vuoden":"vuotta"}return n=Hs(e,s)+" "+n}function Hs(e,a){return e<10?a?N_[e]:G_[e]:e}function bs(e,a,t){var s=e+" ";switch(t){case"m":return a?"jedna minuta":"jedne minute";case"mm":return s+=1===e?"minuta":2===e||3===e||4===e?"minute":"minuta";case"h":return a?"jedan sat":"jednog sata";case"hh":return s+=1===e?"sat":2===e||3===e||4===e?"sata":"sati";case"dd":return s+=1===e?"dan":"dana";case"MM":return s+=1===e?"mjesec":2===e||3===e||4===e?"mjeseca":"mjeseci";case"yy":return s+=1===e?"godina":2===e||3===e||4===e?"godine":"godina"}}function js(e,a,t,s){var n=e;switch(t){case"s":return s||a?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(s||a?" perc":" perce");case"mm":return n+(s||a?" perc":" perce");case"h":return"egy"+(s||a?" óra":" órája");case"hh":return n+(s||a?" óra":" órája");case"d":return"egy"+(s||a?" nap":" napja");case"dd":return n+(s||a?" nap":" napja");case"M":return"egy"+(s||a?" hónap":" hónapja");case"MM":return n+(s||a?" hónap":" hónapja");case"y":return"egy"+(s||a?" év":" éve");case"yy":return n+(s||a?" év":" éve")}return""}function xs(e){return(e?"":"[múlt] ")+"["+ed[this.day()]+"] LT[-kor]"}function Ps(e){return e%100===11||e%10!==1}function Ws(e,a,t,s){var n=e+" ";switch(t){case"s":return a||s?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return a?"mínúta":"mínútu";case"mm":return Ps(e)?n+(a||s?"mínútur":"mínútum"):a?n+"mínúta":n+"mínútu";case"hh":return Ps(e)?n+(a||s?"klukkustundir":"klukkustundum"):n+"klukkustund";case"d":return a?"dagur":s?"dag":"degi";case"dd":return Ps(e)?a?n+"dagar":n+(s?"daga":"dögum"):a?n+"dagur":n+(s?"dag":"degi");case"M":return a?"mánuður":s?"mánuð":"mánuði";case"MM":return Ps(e)?a?n+"mánuðir":n+(s?"mánuði":"mánuðum"):a?n+"mánuður":n+(s?"mánuð":"mánuði");case"y":return a||s?"ár":"ári";case"yy":return Ps(e)?n+(a||s?"ár":"árum"):n+(a||s?"ár":"ári")}}function As(e,a,t,s){var n={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return a?n[t][0]:n[t][1]}function Es(e){var a=e.substr(0,e.indexOf(" "));return zs(a)?"a "+e:"an "+e}function Fs(e){var a=e.substr(0,e.indexOf(" "));return zs(a)?"viru "+e:"virun "+e}function zs(e){if(e=parseInt(e,10),isNaN(e))return!1;if(e<0)return!0;if(e<10)return 4<=e&&e<=7;if(e<100){var a=e%10,t=e/10;return zs(0===a?t:a)}if(e<1e4){for(;e>=10;)e/=10;return zs(e)}return e/=1e3,zs(e)}function Os(e,a,t,s){return a?"kelios sekundės":s?"kelių sekundžių":"kelias sekundes"}function Js(e,a,t,s){return a?Is(t)[0]:s?Is(t)[1]:Is(t)[2]}function Rs(e){return e%10===0||e>10&&e<20}function Is(e){return sd[e].split("_")}function Cs(e,a,t,s){var n=e+" ";return 1===e?n+Js(e,a,t[0],s):a?n+(Rs(e)?Is(t)[1]:Is(t)[0]):s?n+Is(t)[1]:n+(Rs(e)?Is(t)[1]:Is(t)[2])}function Gs(e,a,t){return t?a%10===1&&a%100!==11?e[2]:e[3]:a%10===1&&a%100!==11?e[0]:e[1]}function Ns(e,a,t){return e+" "+Gs(nd[t],e,a)}function Us(e,a,t){return Gs(nd[t],e,a)}function Vs(e,a){return a?"dažas sekundes":"dažām sekundēm"}function $s(e,a,t,s){var n="";if(a)switch(t){case"s":n="काही सेकंद";break;case"m":n="एक मिनिट";break;case"mm":n="%d मिनिटे";break;case"h":n="एक तास";break;case"hh":n="%d तास";break;case"d":n="एक दिवस";break;case"dd":n="%d दिवस";break;case"M":n="एक महिना";break;case"MM":n="%d महिने";break;case"y":n="एक वर्ष";break;case"yy":n="%d वर्षे"}else switch(t){case"s":n="काही सेकंदां";break;case"m":n="एका मिनिटा";break;case"mm":n="%d मिनिटां";break;case"h":n="एका तासा";break;case"hh":n="%d तासां";break;case"d":n="एका दिवसा";break;case"dd":n="%d दिवसां";break;case"M":n="एका महिन्या";break;case"MM":n="%d महिन्यां";break;case"y":n="एका वर्षा";break;case"yy":n="%d वर्षां"}return n.replace(/%d/i,e)}function Ks(e){return e%10<5&&e%10>1&&~~(e/10)%10!==1}function Zs(e,a,t){var s=e+" ";switch(t){case"m":return a?"minuta":"minutę";case"mm":return s+(Ks(e)?"minuty":"minut");case"h":return a?"godzina":"godzinę";case"hh":return s+(Ks(e)?"godziny":"godzin");case"MM":return s+(Ks(e)?"miesiące":"miesięcy");case"yy":return s+(Ks(e)?"lata":"lat")}}function qs(e,a,t){var s={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},n=" ";return(e%100>=20||e>=100&&e%100===0)&&(n=" de "),e+n+s[t]}function Bs(e,a){var t=e.split("_");return a%10===1&&a%100!==11?t[0]:a%10>=2&&a%10<=4&&(a%100<10||a%100>=20)?t[1]:t[2]}function Qs(e,a,t){var s={mm:a?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===t?a?"минута":"минуту":e+" "+Bs(s[t],+e)}function Xs(e){return e>1&&e<5}function en(e,a,t,s){var n=e+" ";switch(t){case"s":return a||s?"pár sekúnd":"pár sekundami";case"m":return a?"minúta":s?"minútu":"minútou";case"mm":return a||s?n+(Xs(e)?"minúty":"minút"):n+"minútami";case"h":return a?"hodina":s?"hodinu":"hodinou";case"hh":return a||s?n+(Xs(e)?"hodiny":"hodín"):n+"hodinami";case"d":return a||s?"deň":"dňom";case"dd":return a||s?n+(Xs(e)?"dni":"dní"):n+"dňami";case"M":return a||s?"mesiac":"mesiacom";case"MM":return a||s?n+(Xs(e)?"mesiace":"mesiacov"):n+"mesiacmi";case"y":return a||s?"rok":"rokom";case"yy":return a||s?n+(Xs(e)?"roky":"rokov"):n+"rokmi"}}function an(e,a,t,s){var n=e+" ";switch(t){case"s":return a||s?"nekaj sekund":"nekaj sekundami";case"m":return a?"ena minuta":"eno minuto";case"mm":return n+=1===e?a?"minuta":"minuto":2===e?a||s?"minuti":"minutama":e<5?a||s?"minute":"minutami":a||s?"minut":"minutami";case"h":return a?"ena ura":"eno uro";case"hh":return n+=1===e?a?"ura":"uro":2===e?a||s?"uri":"urama":e<5?a||s?"ure":"urami":a||s?"ur":"urami";case"d":return a||s?"en dan":"enim dnem";case"dd":return n+=1===e?a||s?"dan":"dnem":2===e?a||s?"dni":"dnevoma":a||s?"dni":"dnevi";case"M":return a||s?"en mesec":"enim mesecem";case"MM":return n+=1===e?a||s?"mesec":"mesecem":2===e?a||s?"meseca":"mesecema":e<5?a||s?"mesece":"meseci":a||s?"mesecev":"meseci";case"y":return a||s?"eno leto":"enim letom";case"yy":return n+=1===e?a||s?"leto":"letom":2===e?a||s?"leti":"letoma":e<5?a||s?"leta":"leti":a||s?"let":"leti"}}function tn(e){var a=e;return a=e.indexOf("jaj")!==-1?a.slice(0,-3)+"leS":e.indexOf("jar")!==-1?a.slice(0,-3)+"waQ":e.indexOf("DIS")!==-1?a.slice(0,-3)+"nem":a+" pIq"}function sn(e){var a=e;return a=e.indexOf("jaj")!==-1?a.slice(0,-3)+"Hu’":e.indexOf("jar")!==-1?a.slice(0,-3)+"wen":e.indexOf("DIS")!==-1?a.slice(0,-3)+"ben":a+" ret"}function nn(e,a,t,s){var n=rn(e);switch(t){case"mm":return n+" tup";case"hh":return n+" rep";case"dd":return n+" jaj";case"MM":return n+" jar";case"yy":return n+" DIS"}}function rn(e){var a=Math.floor(e%1e3/100),t=Math.floor(e%100/10),s=e%10,n="";return a>0&&(n+=xd[a]+"vatlh"),t>0&&(n+=(""!==n?" ":"")+xd[t]+"maH"),s>0&&(n+=(""!==n?" ":"")+xd[s]),""===n?"pagh":n}function _n(e,a,t,s){var n={s:["viensas secunds","'iensas secunds"],m:["'n míut","'iens míut"],mm:[e+" míuts",""+e+" míuts"],h:["'n þora","'iensa þora"],hh:[e+" þoras",""+e+" þoras"],d:["'n ziua","'iensa ziua"],dd:[e+" ziuas",""+e+" ziuas"],M:["'n mes","'iens mes"],MM:[e+" mesen",""+e+" mesen"],y:["'n ar","'iens ar"],yy:[e+" ars",""+e+" ars"]};return s?n[t][0]:a?n[t][0]:n[t][1]}function dn(e,a){var t=e.split("_");return a%10===1&&a%100!==11?t[0]:a%10>=2&&a%10<=4&&(a%100<10||a%100>=20)?t[1]:t[2]}function on(e,a,t){var s={mm:a?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:a?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===t?a?"хвилина":"хвилину":"h"===t?a?"година":"годину":e+" "+dn(s[t],+e)}function mn(e,a){var t={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},s=/(\[[ВвУу]\]) ?dddd/.test(a)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(a)?"genitive":"nominative";return t[s][e.day()]}function un(e){return function(){return e+"о"+(11===this.hours()?"б":"")+"] LT"}}var ln,Mn;Mn=Array.prototype.some?Array.prototype.some:function(e){for(var a=Object(this),t=a.length>>>0,s=0;s<t;s++)if(s in a&&e.call(this,a[s],s,a))return!0;return!1};var hn=Mn,Ln=e.momentProperties=[],cn=!1,Yn={};e.suppressDeprecationWarnings=!1,e.deprecationHandler=null;var yn;yn=Object.keys?Object.keys:function(e){var a,t=[];for(a in e)i(e,a)&&t.push(a);return t};var pn,fn=yn,kn={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Dn={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Tn="Invalid date",gn="%d",wn=/\d{1,2}/,vn={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Sn={},Hn={},bn=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,jn=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,xn={},Pn={},Wn=/\d/,An=/\d\d/,En=/\d{3}/,Fn=/\d{4}/,zn=/[+-]?\d{6}/,On=/\d\d?/,Jn=/\d\d\d\d?/,Rn=/\d\d\d\d\d\d?/,In=/\d{1,3}/,Cn=/\d{1,4}/,Gn=/[+-]?\d{1,6}/,Nn=/\d+/,Un=/[+-]?\d+/,Vn=/Z|[+-]\d\d:?\d\d/gi,$n=/Z|[+-]\d\d(?::?\d\d)?/gi,Kn=/[+-]?\d+(\.\d{1,3})?/,Zn=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,qn={},Bn={},Qn=0,Xn=1,er=2,ar=3,tr=4,sr=5,nr=6,rr=7,_r=8;pn=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var a;for(a=0;a<this.length;++a)if(this[a]===e)return a;return-1};var dr=pn;V("M",["MM",2],"Mo",function(){return this.month()+1}),V("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),V("MMMM",0,0,function(e){return this.localeData().months(this,e)}),E("month","M"),O("month",8),B("M",On),B("MM",On,An),B("MMM",function(e,a){return a.monthsShortRegex(e)}),B("MMMM",function(e,a){return a.monthsRegex(e)}),ae(["M","MM"],function(e,a){a[Xn]=f(e)-1}),ae(["MMM","MMMM"],function(e,a,t,s){var n=t._locale.monthsParse(e,s,t._strict);null!=n?a[Xn]=n:l(t).invalidMonth=e});var ir=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,or="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),mr="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),ur=Zn,lr=Zn;V("Y",0,0,function(){var e=this.year();return e<=9999?""+e:"+"+e}),V(0,["YY",2],0,function(){return this.year()%100}),V(0,["YYYY",4],0,"year"),V(0,["YYYYY",5],0,"year"),V(0,["YYYYYY",6,!0],0,"year"),E("year","y"),O("year",1),B("Y",Un),B("YY",On,An),B("YYYY",Cn,Fn),B("YYYYY",Gn,zn),B("YYYYYY",Gn,zn),ae(["YYYYY","YYYYYY"],Qn),ae("YYYY",function(a,t){t[Qn]=2===a.length?e.parseTwoDigitYear(a):f(a)}),ae("YY",function(a,t){t[Qn]=e.parseTwoDigitYear(a)}),ae("Y",function(e,a){a[Qn]=parseInt(e,10)}),e.parseTwoDigitYear=function(e){return f(e)+(f(e)>68?1900:2e3)};var Mr=R("FullYear",!0);V("w",["ww",2],"wo","week"),V("W",["WW",2],"Wo","isoWeek"),E("week","w"),E("isoWeek","W"),O("week",5),O("isoWeek",5),B("w",On),B("ww",On,An),B("W",On),B("WW",On,An),te(["w","ww","W","WW"],function(e,a,t,s){a[s.substr(0,1)]=f(e)});var hr={dow:0,doy:6};V("d",0,"do","day"),V("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),V("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),V("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),V("e",0,0,"weekday"),V("E",0,0,"isoWeekday"),E("day","d"),E("weekday","e"),E("isoWeekday","E"),O("day",11),O("weekday",11),O("isoWeekday",11),B("d",On),B("e",On),B("E",On),B("dd",function(e,a){return a.weekdaysMinRegex(e)}),B("ddd",function(e,a){return a.weekdaysShortRegex(e)}),B("dddd",function(e,a){return a.weekdaysRegex(e)}),te(["dd","ddd","dddd"],function(e,a,t,s){var n=t._locale.weekdaysParse(e,s,t._strict);null!=n?a.d=n:l(t).invalidWeekday=e}),te(["d","e","E"],function(e,a,t,s){a[s]=f(e)});var Lr="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),cr="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Yr="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),yr=Zn,pr=Zn,fr=Zn;V("H",["HH",2],0,"hour"),V("h",["hh",2],0,Ge),V("k",["kk",2],0,Ne),V("hmm",0,0,function(){return""+Ge.apply(this)+U(this.minutes(),2)}),V("hmmss",0,0,function(){return""+Ge.apply(this)+U(this.minutes(),2)+U(this.seconds(),2)}),V("Hmm",0,0,function(){return""+this.hours()+U(this.minutes(),2)}),V("Hmmss",0,0,function(){return""+this.hours()+U(this.minutes(),2)+U(this.seconds(),2)}),Ue("a",!0),Ue("A",!1),E("hour","h"),O("hour",13),B("a",Ve),B("A",Ve),B("H",On),B("h",On),B("HH",On,An),B("hh",On,An),B("hmm",Jn),B("hmmss",Rn),B("Hmm",Jn),B("Hmmss",Rn),ae(["H","HH"],ar),ae(["a","A"],function(e,a,t){t._isPm=t._locale.isPM(e),t._meridiem=e}),ae(["h","hh"],function(e,a,t){a[ar]=f(e),l(t).bigHour=!0}),ae("hmm",function(e,a,t){var s=e.length-2;a[ar]=f(e.substr(0,s)),a[tr]=f(e.substr(s)),l(t).bigHour=!0}),ae("hmmss",function(e,a,t){var s=e.length-4,n=e.length-2;a[ar]=f(e.substr(0,s)),a[tr]=f(e.substr(s,2)),a[sr]=f(e.substr(n)),l(t).bigHour=!0}),ae("Hmm",function(e,a,t){var s=e.length-2;a[ar]=f(e.substr(0,s)),a[tr]=f(e.substr(s))}),ae("Hmmss",function(e,a,t){var s=e.length-4,n=e.length-2;a[ar]=f(e.substr(0,s)),a[tr]=f(e.substr(s,2)),a[sr]=f(e.substr(n))});var kr,Dr=/[ap]\.?m?\.?/i,Tr=R("Hours",!0),gr={calendar:kn,longDateFormat:Dn,invalidDate:Tn,ordinal:gn,ordinalParse:wn,relativeTime:vn,months:or,monthsShort:mr,week:hr,weekdays:Lr,weekdaysMin:Yr,weekdaysShort:cr,meridiemParse:Dr},wr={},vr={},Sr=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Hr=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,br=/Z|[+-]\d\d(?::?\d\d)?/,jr=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],xr=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Pr=/^\/?Date\((\-?\d+)/i;e.createFromInputFallback=T("value provided is not in a recognized ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),e.ISO_8601=function(){};var Wr=T("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=ya.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:h()}),Ar=T("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=ya.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:h()}),Er=function(){return Date.now?Date.now():+new Date};wa("Z",":"),wa("ZZ",""),B("Z",$n),B("ZZ",$n),ae(["Z","ZZ"],function(e,a,t){t._useUTC=!0,t._tzm=va($n,e)});var Fr=/([\+\-]|\d\d)/gi;e.updateOffset=function(){};var zr=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,Or=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;Ra.fn=Da.prototype;var Jr=Na(1,"add"),Rr=Na(-1,"subtract");e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",e.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var Ir=T("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});V(0,["gg",2],0,function(){return this.weekYear()%100}),V(0,["GG",2],0,function(){return this.isoWeekYear()%100}),wt("gggg","weekYear"),wt("ggggg","weekYear"),wt("GGGG","isoWeekYear"),wt("GGGGG","isoWeekYear"),E("weekYear","gg"),E("isoWeekYear","GG"),O("weekYear",1),O("isoWeekYear",1),B("G",Un),B("g",Un),B("GG",On,An),B("gg",On,An),B("GGGG",Cn,Fn),B("gggg",Cn,Fn),B("GGGGG",Gn,zn),B("ggggg",Gn,zn),te(["gggg","ggggg","GGGG","GGGGG"],function(e,a,t,s){a[s.substr(0,2)]=f(e)}),te(["gg","GG"],function(a,t,s,n){t[n]=e.parseTwoDigitYear(a)}),V("Q",0,"Qo","quarter"),E("quarter","Q"),O("quarter",7),B("Q",Wn),ae("Q",function(e,a){a[Xn]=3*(f(e)-1)}),V("D",["DD",2],"Do","date"),E("date","D"),O("date",9),B("D",On),B("DD",On,An),B("Do",function(e,a){return e?a._ordinalParse:a._ordinalParseLenient}),ae(["D","DD"],er),ae("Do",function(e,a){a[er]=f(e.match(On)[0],10)});var Cr=R("Date",!0);V("DDD",["DDDD",3],"DDDo","dayOfYear"),E("dayOfYear","DDD"),O("dayOfYear",4),B("DDD",In),B("DDDD",En),ae(["DDD","DDDD"],function(e,a,t){t._dayOfYear=f(e)}),V("m",["mm",2],0,"minute"),E("minute","m"),O("minute",14),B("m",On),B("mm",On,An),ae(["m","mm"],tr);var Gr=R("Minutes",!1);V("s",["ss",2],0,"second"),E("second","s"),O("second",15),B("s",On),B("ss",On,An),ae(["s","ss"],sr);var Nr=R("Seconds",!1);V("S",0,0,function(){return~~(this.millisecond()/100)}),V(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),V(0,["SSS",3],0,"millisecond"),V(0,["SSSS",4],0,function(){return 10*this.millisecond()}),V(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),V(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),V(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),V(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),V(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),E("millisecond","ms"),O("millisecond",16),B("S",In,Wn),B("SS",In,An),B("SSS",In,En);var Ur;for(Ur="SSSS";Ur.length<=9;Ur+="S")B(Ur,Nn);for(Ur="S";Ur.length<=9;Ur+="S")ae(Ur,At);var Vr=R("Milliseconds",!1);V("z",0,0,"zoneAbbr"),V("zz",0,0,"zoneName");var $r=Y.prototype;$r.add=Jr,$r.calendar=$a,$r.clone=Ka,$r.diff=at,$r.endOf=ht,$r.format=_t,$r.from=dt,$r.fromNow=it,$r.to=ot,$r.toNow=mt,$r.get=G,$r.invalidAt=Tt,$r.isAfter=Za,$r.isBefore=qa,$r.isBetween=Ba,$r.isSame=Qa,$r.isSameOrAfter=Xa,$r.isSameOrBefore=et,$r.isValid=kt,$r.lang=Ir,$r.locale=ut,$r.localeData=lt,$r.max=Ar,$r.min=Wr,$r.parsingFlags=Dt,$r.set=N,$r.startOf=Mt,$r.subtract=Rr,$r.toArray=yt,$r.toObject=pt,$r.toDate=Yt,$r.toISOString=nt,$r.inspect=rt,$r.toJSON=ft,$r.toString=st,$r.unix=ct,$r.valueOf=Lt,$r.creationData=gt,$r.year=Mr,$r.isLeapYear=Ye,$r.weekYear=vt,$r.isoWeekYear=St,$r.quarter=$r.quarters=Pt,$r.month=me,$r.daysInMonth=ue,$r.week=$r.weeks=Se,$r.isoWeek=$r.isoWeeks=He,$r.weeksInYear=bt,$r.isoWeeksInYear=Ht,$r.date=Cr,$r.day=$r.days=Fe,$r.weekday=ze,$r.isoWeekday=Oe,$r.dayOfYear=Wt,$r.hour=$r.hours=Tr,$r.minute=$r.minutes=Gr,$r.second=$r.seconds=Nr,$r.millisecond=$r.milliseconds=Vr,$r.utcOffset=ba,$r.utc=xa,$r.local=Pa,$r.parseZone=Wa,$r.hasAlignedHourOffset=Aa,$r.isDST=Ea,$r.isLocal=za,$r.isUtcOffset=Oa,$r.isUtc=Ja,$r.isUTC=Ja,$r.zoneAbbr=Et,$r.zoneName=Ft,$r.dates=T("dates accessor is deprecated. Use date instead.",Cr),$r.months=T("months accessor is deprecated. Use month instead",me),$r.years=T("years accessor is deprecated. Use year instead",Mr),$r.zone=T("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",ja),$r.isDSTShifted=T("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",Fa);var Kr=H.prototype;Kr.calendar=b,Kr.longDateFormat=j,Kr.invalidDate=x,Kr.ordinal=P,Kr.preparse=Jt,Kr.postformat=Jt,Kr.relativeTime=W,Kr.pastFuture=A,Kr.set=v,Kr.months=re,Kr.monthsShort=_e,Kr.monthsParse=ie,Kr.monthsRegex=Me,Kr.monthsShortRegex=le,Kr.week=ge,Kr.firstDayOfYear=ve,Kr.firstDayOfWeek=we,Kr.weekdays=xe,Kr.weekdaysMin=We,Kr.weekdaysShort=Pe,Kr.weekdaysParse=Ee,Kr.weekdaysRegex=Je,Kr.weekdaysShortRegex=Re,Kr.weekdaysMinRegex=Ie,Kr.isPM=$e,Kr.meridiem=Ke,Qe("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var a=e%10,t=1===f(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t}}),e.lang=T("moment.lang is deprecated. Use moment.locale instead.",Qe),e.langData=T("moment.langData is deprecated. Use moment.localeData instead.",aa);var Zr=Math.abs,qr=ns("ms"),Br=ns("s"),Qr=ns("m"),Xr=ns("h"),e_=ns("d"),a_=ns("w"),t_=ns("M"),s_=ns("y"),n_=_s("milliseconds"),r_=_s("seconds"),__=_s("minutes"),d_=_s("hours"),i_=_s("days"),o_=_s("months"),m_=_s("years"),u_=Math.round,l_={s:45,m:45,h:22,d:26,M:11},M_=Math.abs,h_=Da.prototype;h_.abs=Kt,h_.add=qt,h_.subtract=Bt,h_.as=ts,h_.asMilliseconds=qr,h_.asSeconds=Br,h_.asMinutes=Qr,h_.asHours=Xr,h_.asDays=e_,h_.asWeeks=a_,h_.asMonths=t_,h_.asYears=s_,h_.valueOf=ss,h_._bubble=Xt,h_.get=rs,h_.milliseconds=n_,h_.seconds=r_,h_.minutes=__,h_.hours=d_,h_.days=i_,h_.weeks=ds,h_.months=o_,h_.years=m_,h_.humanize=ls,h_.toISOString=Ms,h_.toString=Ms,h_.toJSON=Ms,h_.locale=ut,h_.localeData=lt,h_.toIsoString=T("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Ms),h_.lang=Ir,V("X",0,0,"unix"),V("x",0,0,"valueOf"),B("x",Un),B("X",Kn),ae("X",function(e,a,t){t._d=new Date(1e3*parseFloat(e,10))}),ae("x",function(e,a,t){t._d=new Date(f(e))}),e.version="2.17.1",a(ya),e.fn=$r,e.min=fa,e.max=ka,e.now=Er,e.utc=m,e.unix=zt,e.months=Gt,e.isDate=_,e.locale=Qe,e.invalid=h,e.duration=Ra,e.isMoment=y,e.weekdays=Ut,e.parseZone=Ot,e.localeData=aa,e.isDuration=Ta,e.monthsShort=Nt,e.weekdaysMin=$t,e.defineLocale=Xe,e.updateLocale=ea,e.locales=ta,e.weekdaysShort=Vt,e.normalizeUnits=F,e.relativeTimeRounding=ms,e.relativeTimeThreshold=us,e.calendarFormat=Va,e.prototype=$r,e.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(e){return/^nm$/i.test(e)},meridiem:function(e,a,t){return e<12?t?"vm":"VM":t?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}}),e.defineLocale("ar-dz",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"أح_إث_ثلا_أر_خم_جم_سب".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:0,doy:4}});var L_={1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",0:"0"},c_=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},Y_={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},y_=function(e){return function(a,t,s,n){var r=c_(a),_=Y_[e][c_(a)];return 2===r&&(_=_[t?0:1]),_.replace(/%d/i,a)}},p_=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];e.defineLocale("ar-ly",{months:p_,monthsShort:p_,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,a,t){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:y_("s"),m:y_("m"),mm:y_("m"),h:y_("h"),hh:y_("h"),d:y_("d"),dd:y_("d"),M:y_("M"),MM:y_("M"),y:y_("y"),yy:y_("y")},preparse:function(e){
return e.replace(/\u200f/g,"").replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return L_[e]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),e.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}});var f_={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},k_={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"};e.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,a,t){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(e){return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(e){return k_[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return f_[e]}).replace(/,/g,"،")},week:{dow:0,doy:6}}),e.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}});var D_={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},T_={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},g_=function(e){return 0===e?0:1===e?1:2===e?2:e%100>=3&&e%100<=10?3:e%100>=11?4:5},w_={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},v_=function(e){return function(a,t,s,n){var r=g_(a),_=w_[e][g_(a)];return 2===r&&(_=_[t?0:1]),_.replace(/%d/i,a)}},S_=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"];e.defineLocale("ar",{months:S_,monthsShort:S_,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(e){return"م"===e},meridiem:function(e,a,t){return e<12?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:v_("s"),m:v_("m"),mm:v_("m"),h:v_("h"),hh:v_("h"),d:v_("d"),dd:v_("d"),M:v_("M"),MM:v_("M"),y:v_("y"),yy:v_("y")},preparse:function(e){return e.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(e){return T_[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return D_[e]}).replace(/,/g,"،")},week:{dow:6,doy:12}});var H_={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"};e.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(e){return/^(gündüz|axşam)$/.test(e)},meridiem:function(e,a,t){return e<4?"gecə":e<12?"səhər":e<17?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(e){if(0===e)return e+"-ıncı";var a=e%10,t=e%100-a,s=e>=100?100:null;return e+(H_[a]||H_[t]||H_[s])},week:{dow:1,doy:7}}),e.defineLocale("be",{months:{format:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),standalone:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")},monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:{format:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),standalone:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),isFormat:/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/},weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:Ls,mm:Ls,h:Ls,hh:Ls,d:"дзень",dd:Ls,M:"месяц",MM:Ls,y:"год",yy:Ls},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(e){return/^(дня|вечара)$/.test(e)},meridiem:function(e,a,t){return e<4?"ночы":e<12?"раніцы":e<17?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(e,a){switch(a){case"M":case"d":case"DDD":case"w":case"W":return e%10!==2&&e%10!==3||e%100===12||e%100===13?e+"-ы":e+"-і";case"D":return e+"-га";default:return e}},week:{dow:1,doy:7}}),e.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var a=e%10,t=e%100;return 0===e?e+"-ев":0===t?e+"-ен":t>10&&t<20?e+"-ти":1===a?e+"-ви":2===a?e+"-ри":7===a||8===a?e+"-ми":e+"-ти"},week:{dow:1,doy:7}});var b_={1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"},j_={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"};e.defineLocale("bn",{months:"জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),weekdaysMin:"রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কয়েক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(e){return e.replace(/[১২৩৪৫৬৭৮৯০]/g,function(e){return j_[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return b_[e]})},meridiemParse:/রাত|সকাল|দুপুর|বিকাল|রাত/,meridiemHour:function(e,a){return 12===e&&(e=0),"রাত"===a&&e>=4||"দুপুর"===a&&e<5||"বিকাল"===a?e+12:e},meridiem:function(e,a,t){return e<4?"রাত":e<10?"সকাল":e<17?"দুপুর":e<20?"বিকাল":"রাত"},week:{dow:0,doy:6}});var x_={1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"},P_={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"};e.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(e){return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(e){return P_[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return x_[e]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,meridiemHour:function(e,a){return 12===e&&(e=0),"མཚན་མོ"===a&&e>=4||"ཉིན་གུང"===a&&e<5||"དགོང་དག"===a?e+12:e},meridiem:function(e,a,t){return e<4?"མཚན་མོ":e<10?"ཞོགས་ཀས":e<17?"ཉིན་གུང":e<20?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),e.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:cs,h:"un eur",hh:"%d eur",d:"un devezh",dd:cs,M:"ur miz",MM:cs,y:"ur bloaz",yy:Ys},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(e){var a=1===e?"añ":"vet";return e+a},week:{dow:1,doy:4}}),e.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:ks,mm:ks,h:ks,hh:ks,d:"dan",dd:ks,M:"mjesec",MM:ks,y:"godinu",yy:ks},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),e.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),monthsParseExact:!0,weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"d'aquí %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(e,a){var t=1===e?"r":2===e?"n":3===e?"r":4===e?"t":"è";return"w"!==a&&"W"!==a||(t="a"),e+t},week:{dow:1,doy:4}});var W_="leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),A_="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");e.defineLocale("cs",{months:W_,monthsShort:A_,monthsParse:function(e,a){var t,s=[];for(t=0;t<12;t++)s[t]=new RegExp("^"+e[t]+"$|^"+a[t]+"$","i");return s}(W_,A_),shortMonthsParse:function(e){var a,t=[];for(a=0;a<12;a++)t[a]=new RegExp("^"+e[a]+"$","i");return t}(A_),longMonthsParse:function(e){var a,t=[];for(a=0;a<12;a++)t[a]=new RegExp("^"+e[a]+"$","i");return t}(W_),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:Ts,m:Ts,mm:Ts,h:Ts,hh:Ts,d:Ts,dd:Ts,M:Ts,MM:Ts,y:Ts,yy:Ts},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(e){var a=/сехет$/i.exec(e)?"рен":/ҫул$/i.exec(e)?"тан":"ран";return e+a},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),e.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(e){var a=e,t="",s=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return a>20?t=40===a||50===a||60===a||80===a||100===a?"fed":"ain":a>0&&(t=s[a]),e+t},week:{dow:1,doy:4}}),e.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:gs,mm:"%d Minuten",h:gs,hh:"%d Stunden",d:gs,dd:gs,M:gs,MM:gs,y:gs,yy:gs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[heute um] LT [Uhr]",sameElse:"L",nextDay:"[morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:ws,mm:"%d Minuten",h:ws,hh:"%d Stunden",d:ws,dd:ws,M:ws,MM:ws,y:ws,yy:ws},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var E_=["ޖެނުއަރީ","ފެބްރުއަރީ","މާރިޗު","އޭޕްރީލު","މޭ","ޖޫން","ޖުލައި","އޯގަސްޓު","ސެޕްޓެމްބަރު","އޮކްޓޯބަރު","ނޮވެމްބަރު","ޑިސެމްބަރު"],F_=["އާދިއްތަ","ހޯމަ","އަންގާރަ","ބުދަ","ބުރާސްފަތި","ހުކުރު","ހޮނިހިރު"];e.defineLocale("dv",{months:E_,monthsShort:E_,weekdays:F_,weekdaysShort:F_,weekdaysMin:"އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/M/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/މކ|މފ/,isPM:function(e){return"މފ"===e},meridiem:function(e,a,t){return e<12?"މކ":"މފ"},calendar:{sameDay:"[މިއަދު] LT",nextDay:"[މާދަމާ] LT",nextWeek:"dddd LT",lastDay:"[އިއްޔެ] LT",lastWeek:"[ފާއިތުވި] dddd LT",sameElse:"L"},relativeTime:{future:"ތެރޭގައި %s",past:"ކުރިން %s",s:"ސިކުންތުކޮޅެއް",m:"މިނިޓެއް",mm:"މިނިޓު %d",h:"ގަޑިއިރެއް",hh:"ގަޑިއިރު %d",d:"ދުވަހެއް",dd:"ދުވަސް %d",M:"މަހެއް",MM:"މަސް %d",y:"އަހަރެއް",yy:"އަހަރު %d"},preparse:function(e){return e.replace(/،/g,",")},postformat:function(e){return e.replace(/,/g,"،")},week:{dow:7,doy:12}}),e.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(e,a){return/D/.test(a.substring(0,a.indexOf("MMMM")))?this._monthsGenitiveEl[e.month()]:this._monthsNominativeEl[e.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(e,a,t){return e>11?t?"μμ":"ΜΜ":t?"πμ":"ΠΜ"},isPM:function(e){return"μ"===(e+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(e,a){var t=this._calendarEl[e],s=a&&a.hours();return w(t)&&(t=t.apply(a)),t.replace("{}",s%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),e.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t}}),e.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("en-ie",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("en-nz",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-an de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(e){return"p"===e.charAt(0).toLowerCase()},meridiem:function(e,a,t){return e>11?t?"p.t.m.":"P.T.M.":t?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}});var z_="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),O_="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");
e.defineLocale("es-do",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,a){return/-MMM-/.test(a)?O_[e.month()]:z_[e.month()]},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY h:mm A",LLLL:"dddd, D [de] MMMM [de] YYYY h:mm A"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}});var J_="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),R_="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");e.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(e,a){return/-MMM-/.test(a)?R_[e.month()]:J_[e.month()]},monthsParseExact:!0,weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"do_lu_ma_mi_ju_vi_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),e.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:vs,m:vs,mm:vs,h:vs,hh:vs,d:vs,dd:"%d päeva",M:vs,MM:vs,y:vs,yy:vs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),monthsParseExact:!0,weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});var I_={1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"},C_={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"};e.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(e){return/بعد از ظهر/.test(e)},meridiem:function(e,a,t){return e<12?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(e){return e.replace(/[۰-۹]/g,function(e){return C_[e]}).replace(/،/g,",")},postformat:function(e){return e.replace(/\d/g,function(e){return I_[e]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}});var G_="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),N_=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",G_[7],G_[8],G_[9]];e.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:Ss,m:Ss,mm:Ss,h:Ss,hh:Ss,d:Ss,dd:Ss,M:Ss,MM:Ss,y:Ss,yy:Ss},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(e){return e+(1===e?"er":"e")}}),e.defineLocale("fr-ch",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(e){return e+(1===e?"er":"e")},week:{dow:1,doy:4}}),e.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),monthsParseExact:!0,weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(e){return e+(1===e?"er":"")},week:{dow:1,doy:4}});var U_="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),V_="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");e.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(e,a){return/-MMM-/.test(a)?V_[e.month()]:U_[e.month()]},monthsParseExact:!0,weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});var $_=["Am Faoilleach","An Gearran","Am Màrt","An Giblean","An Cèitean","An t-Ògmhios","An t-Iuchar","An Lùnastal","An t-Sultain","An Dàmhair","An t-Samhain","An Dùbhlachd"],K_=["Faoi","Gear","Màrt","Gibl","Cèit","Ògmh","Iuch","Lùn","Sult","Dàmh","Samh","Dùbh"],Z_=["Didòmhnaich","Diluain","Dimàirt","Diciadain","Diardaoin","Dihaoine","Disathairne"],q_=["Did","Dil","Dim","Dic","Dia","Dih","Dis"],B_=["Dò","Lu","Mà","Ci","Ar","Ha","Sa"];e.defineLocale("gd",{months:$_,monthsShort:K_,monthsParseExact:!0,weekdays:Z_,weekdaysShort:q_,weekdaysMin:B_,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[An-diugh aig] LT",nextDay:"[A-màireach aig] LT",nextWeek:"dddd [aig] LT",lastDay:"[An-dè aig] LT",lastWeek:"dddd [seo chaidh] [aig] LT",sameElse:"L"},relativeTime:{future:"ann an %s",past:"bho chionn %s",s:"beagan diogan",m:"mionaid",mm:"%d mionaidean",h:"uair",hh:"%d uairean",d:"latha",dd:"%d latha",M:"mìos",MM:"%d mìosan",y:"bliadhna",yy:"%d bliadhna"},ordinalParse:/\d{1,2}(d|na|mh)/,ordinal:function(e){var a=1===e?"d":e%10===2?"na":"mh";return e+a},week:{dow:1,doy:4}}),e.defineLocale("gl",{months:"xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro".split("_"),monthsShort:"xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"domingo_luns_martes_mércores_xoves_venres_sábado".split("_"),weekdaysShort:"dom._lun._mar._mér._xov._ven._sáb.".split("_"),weekdaysMin:"do_lu_ma_mé_xo_ve_sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(e){return 0===e.indexOf("un")?"n"+e:"en "+e},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),e.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(e){return 2===e?"שעתיים":e+" שעות"},d:"יום",dd:function(e){return 2===e?"יומיים":e+" ימים"},M:"חודש",MM:function(e){return 2===e?"חודשיים":e+" חודשים"},y:"שנה",yy:function(e){return 2===e?"שנתיים":e%10===0&&10!==e?e+" שנה":e+" שנים"}},meridiemParse:/אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,isPM:function(e){return/^(אחה"צ|אחרי הצהריים|בערב)$/.test(e)},meridiem:function(e,a,t){return e<5?"לפנות בוקר":e<10?"בבוקר":e<12?t?'לפנה"צ':"לפני הצהריים":e<18?t?'אחה"צ':"אחרי הצהריים":"בערב"}});var Q_={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},X_={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};e.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return X_[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return Q_[e]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(e,a){return 12===e&&(e=0),"रात"===a?e<4?e:e+12:"सुबह"===a?e:"दोपहर"===a?e>=10?e:e+12:"शाम"===a?e+12:void 0},meridiem:function(e,a,t){return e<4?"रात":e<10?"सुबह":e<17?"दोपहर":e<20?"शाम":"रात"},week:{dow:0,doy:6}}),e.defineLocale("hr",{months:{format:"siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),standalone:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")},monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:bs,mm:bs,h:bs,hh:bs,d:"dan",dd:bs,M:"mjesec",MM:bs,y:"godinu",yy:bs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});var ed="vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");e.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(e){return"u"===e.charAt(1).toLowerCase()},meridiem:function(e,a,t){return e<12?t===!0?"de":"DE":t===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return xs.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return xs.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:js,m:js,mm:js,h:js,hh:js,d:js,dd:js,M:js,MM:js,y:js,yy:js},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("hy-am",{months:{format:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_"),standalone:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_")},monthsShort:"հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),weekdays:"կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_"),weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(e){return/^(ցերեկվա|երեկոյան)$/.test(e)},meridiem:function(e){return e<4?"գիշերվա":e<12?"առավոտվա":e<17?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(e,a){switch(a){case"DDD":case"w":case"W":case"DDDo":return 1===e?e+"-ին":e+"-րդ";default:return e}},week:{dow:1,doy:7}}),e.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(e,a){return 12===e&&(e=0),"pagi"===a?e:"siang"===a?e>=11?e:e+12:"sore"===a||"malam"===a?e+12:void 0},meridiem:function(e,a,t){return e<11?"pagi":e<15?"siang":e<19?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),e.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:Ws,m:Ws,mm:Ws,h:"klukkustund",hh:Ws,d:Ws,dd:Ws,M:Ws,MM:Ws,y:Ws,yy:Ws},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"Do_Lu_Ma_Me_Gi_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(e){return(/^[0-9].+$/.test(e)?"tra":"in")+" "+e},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),e.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"Ah時m分s秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah時m分",LLLL:"YYYY年M月D日Ah時m分 dddd"},meridiemParse:/午前|午後/i,isPM:function(e){return"午後"===e},meridiem:function(e,a,t){return e<12?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},ordinalParse:/\d{1,2}日/,ordinal:function(e,a){switch(a){case"d":case"D":case"DDD":return e+"日";default:return e}},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),e.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(e,a){return 12===e&&(e=0),"enjing"===a?e:"siyang"===a?e>=11?e:e+12:"sonten"===a||"ndalu"===a?e+12:void 0},meridiem:function(e,a,t){return e<11?"enjing":e<15?"siyang":e<19?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),e.defineLocale("ka",{months:{standalone:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),format:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:{standalone:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),format:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_"),isFormat:/(წინა|შემდეგ)/},weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(e){return/(წამი|წუთი|საათი|წელი)/.test(e)?e.replace(/ი$/,"ში"):e+"ში"},past:function(e){return/(წამი|წუთი|საათი|დღე|თვე)/.test(e)?e.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(e)?e.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(e){return 0===e?e:1===e?e+"-ლი":e<20||e<=100&&e%20===0||e%100===0?"მე-"+e:e+"-ე"},week:{dow:1,doy:7}});var ad={0:"-ші",1:"-ші",2:"-ші",3:"-ші",4:"-ші",5:"-ші",6:"-шы",7:"-ші",8:"-ші",9:"-шы",10:"-шы",20:"-шы",30:"-шы",40:"-шы",50:"-ші",60:"-шы",70:"-ші",80:"-ші",90:"-шы",100:"-ші"};e.defineLocale("kk",{months:"қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split("_"),monthsShort:"қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),weekdays:"жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split("_"),weekdaysShort:"жек_дүй_сей_сәр_бей_жұм_сен".split("_"),weekdaysMin:"жк_дй_сй_ср_бй_жм_сн".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгін сағат] LT",nextDay:"[Ертең сағат] LT",nextWeek:"dddd [сағат] LT",lastDay:"[Кеше сағат] LT",lastWeek:"[Өткен аптаның] dddd [сағат] LT",sameElse:"L"},relativeTime:{future:"%s ішінде",past:"%s бұрын",s:"бірнеше секунд",m:"бір минут",mm:"%d минут",h:"бір сағат",hh:"%d сағат",d:"бір күн",dd:"%d күн",M:"бір ай",MM:"%d ай",y:"бір жыл",yy:"%d жыл"},ordinalParse:/\d{1,2}-(ші|шы)/,ordinal:function(e){var a=e%10,t=e>=100?100:null;return e+(ad[e]||ad[a]||ad[t])},week:{dow:1,doy:7}}),e.defineLocale("km",{months:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[ថ្ងៃនេះ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}}),e.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h시 m분",LLLL:"YYYY년 MMMM D일 dddd A h시 m분"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇 초",ss:"%d초",m:"일분",mm:"%d분",h:"한 시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한 달",MM:"%d달",y:"일 년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(e){return"오후"===e},meridiem:function(e,a,t){return e<12?"오전":"오후"}});var td={0:"-чү",1:"-чи",2:"-чи",3:"-чү",4:"-чү",5:"-чи",6:"-чы",7:"-чи",8:"-чи",9:"-чу",10:"-чу",20:"-чы",30:"-чу",40:"-чы",50:"-чү",60:"-чы",70:"-чи",80:"-чи",90:"-чу",100:"-чү"};e.defineLocale("ky",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),weekdays:"Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split("_"),weekdaysShort:"Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),weekdaysMin:"Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Бүгүн саат] LT",nextDay:"[Эртең саат] LT",nextWeek:"dddd [саат] LT",lastDay:"[Кече саат] LT",lastWeek:"[Өткен аптанын] dddd [күнү] [саат] LT",sameElse:"L"
},relativeTime:{future:"%s ичинде",past:"%s мурун",s:"бирнече секунд",m:"бир мүнөт",mm:"%d мүнөт",h:"бир саат",hh:"%d саат",d:"бир күн",dd:"%d күн",M:"бир ай",MM:"%d ай",y:"бир жыл",yy:"%d жыл"},ordinalParse:/\d{1,2}-(чи|чы|чү|чу)/,ordinal:function(e){var a=e%10,t=e>=100?100:null;return e+(td[e]||td[a]||td[t])},week:{dow:1,doy:7}}),e.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),monthsParseExact:!0,weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:Es,past:Fs,s:"e puer Sekonnen",m:As,mm:"%d Minutten",h:As,hh:"%d Stonnen",d:As,dd:"%d Deeg",M:As,MM:"%d Méint",y:As,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("lo",{months:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),monthsShort:"ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),weekdays:"ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysShort:"ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),weekdaysMin:"ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"ວັນdddd D MMMM YYYY HH:mm"},meridiemParse:/ຕອນເຊົ້າ|ຕອນແລງ/,isPM:function(e){return"ຕອນແລງ"===e},meridiem:function(e,a,t){return e<12?"ຕອນເຊົ້າ":"ຕອນແລງ"},calendar:{sameDay:"[ມື້ນີ້ເວລາ] LT",nextDay:"[ມື້ອື່ນເວລາ] LT",nextWeek:"[ວັນ]dddd[ໜ້າເວລາ] LT",lastDay:"[ມື້ວານນີ້ເວລາ] LT",lastWeek:"[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",sameElse:"L"},relativeTime:{future:"ອີກ %s",past:"%sຜ່ານມາ",s:"ບໍ່ເທົ່າໃດວິນາທີ",m:"1 ນາທີ",mm:"%d ນາທີ",h:"1 ຊົ່ວໂມງ",hh:"%d ຊົ່ວໂມງ",d:"1 ມື້",dd:"%d ມື້",M:"1 ເດືອນ",MM:"%d ເດືອນ",y:"1 ປີ",yy:"%d ປີ"},ordinalParse:/(ທີ່)\d{1,2}/,ordinal:function(e){return"ທີ່"+e}});var sd={m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"};e.defineLocale("lt",{months:{format:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),standalone:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),isFormat:/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/},monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:{format:"sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split("_"),standalone:"sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),isFormat:/dddd HH:mm/},weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:Os,m:Js,mm:Cs,h:Js,hh:Cs,d:Js,dd:Cs,M:Js,MM:Cs,y:Js,yy:Cs},ordinalParse:/\d{1,2}-oji/,ordinal:function(e){return e+"-oji"},week:{dow:1,doy:4}});var nd={m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")};e.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:Vs,m:Us,mm:Ns,h:Us,hh:Ns,d:Us,dd:Ns,M:Us,MM:Ns,y:Us,yy:Ns},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var rd={words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,a){return 1===e?a[0]:e>=2&&e<=4?a[1]:a[2]},translate:function(e,a,t){var s=rd.words[t];return 1===t.length?a?s[0]:s[1]:e+" "+rd.correctGrammaticalCase(e,s)}};e.defineLocale("me",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:rd.translate,mm:rd.translate,h:rd.translate,hh:rd.translate,d:"dan",dd:rd.translate,M:"mjesec",MM:rd.translate,y:"godinu",yy:rd.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),e.defineLocale("mi",{months:"Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea".split("_"),monthsShort:"Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split("_"),monthsRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,monthsShortStrictRegex:/(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,weekdays:"Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei".split("_"),weekdaysShort:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),weekdaysMin:"Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [i] HH:mm",LLLL:"dddd, D MMMM YYYY [i] HH:mm"},calendar:{sameDay:"[i teie mahana, i] LT",nextDay:"[apopo i] LT",nextWeek:"dddd [i] LT",lastDay:"[inanahi i] LT",lastWeek:"dddd [whakamutunga i] LT",sameElse:"L"},relativeTime:{future:"i roto i %s",past:"%s i mua",s:"te hēkona ruarua",m:"he meneti",mm:"%d meneti",h:"te haora",hh:"%d haora",d:"he ra",dd:"%d ra",M:"he marama",MM:"%d marama",y:"he tau",yy:"%d tau"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),e.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"[Во] dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(e){var a=e%10,t=e%100;return 0===e?e+"-ев":0===t?e+"-ен":t>10&&t<20?e+"-ти":1===a?e+"-ви":2===a?e+"-ри":7===a||8===a?e+"-ми":e+"-ти"},week:{dow:1,doy:7}}),e.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),monthsParseExact:!0,weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,meridiemHour:function(e,a){return 12===e&&(e=0),"രാത്രി"===a&&e>=4||"ഉച്ച കഴിഞ്ഞ്"===a||"വൈകുന്നേരം"===a?e+12:e},meridiem:function(e,a,t){return e<4?"രാത്രി":e<12?"രാവിലെ":e<17?"ഉച്ച കഴിഞ്ഞ്":e<20?"വൈകുന്നേരം":"രാത്രി"}});var _d={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},dd={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};e.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%sमध्ये",past:"%sपूर्वी",s:$s,m:$s,mm:$s,h:$s,hh:$s,d:$s,dd:$s,M:$s,MM:$s,y:$s,yy:$s},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return dd[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return _d[e]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(e,a){return 12===e&&(e=0),"रात्री"===a?e<4?e:e+12:"सकाळी"===a?e:"दुपारी"===a?e>=10?e:e+12:"सायंकाळी"===a?e+12:void 0},meridiem:function(e,a,t){return e<4?"रात्री":e<10?"सकाळी":e<17?"दुपारी":e<20?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),e.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,a){return 12===e&&(e=0),"pagi"===a?e:"tengahari"===a?e>=11?e:e+12:"petang"===a||"malam"===a?e+12:void 0},meridiem:function(e,a,t){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),e.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(e,a){return 12===e&&(e=0),"pagi"===a?e:"tengahari"===a?e>=11?e:e+12:"petang"===a||"malam"===a?e+12:void 0},meridiem:function(e,a,t){return e<11?"pagi":e<15?"tengahari":e<19?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}});var id={1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"},od={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"};e.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(e){return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(e){return od[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return id[e]})},week:{dow:1,doy:4}}),e.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),monthsParseExact:!0,weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"sø._ma._ti._on._to._fr._lø.".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] HH:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var md={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},ud={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};e.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),monthsParseExact:!0,weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आ._सो._मं._बु._बि._शु._श.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return ud[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return md[e]})},meridiemParse:/राति|बिहान|दिउँसो|साँझ/,meridiemHour:function(e,a){return 12===e&&(e=0),"राति"===a?e<4?e:e+12:"बिहान"===a?e:"दिउँसो"===a?e>=10?e:e+12:"साँझ"===a?e+12:void 0},meridiem:function(e,a,t){return e<3?"राति":e<12?"बिहान":e<16?"दिउँसो":e<20?"साँझ":"राति"},calendar:{sameDay:"[आज] LT",nextDay:"[भोलि] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडि",s:"केही क्षण",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:0,doy:6}});var ld="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),Md="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),hd=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],Ld=/^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;e.defineLocale("nl-be",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,a){return/-MMM-/.test(a)?Md[e.month()]:ld[e.month()]},monthsRegex:Ld,monthsShortRegex:Ld,monthsStrictRegex:/^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:hd,longMonthsParse:hd,shortMonthsParse:hd,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}});var cd="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),Yd="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),yd=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],pd=/^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;e.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(e,a){return/-MMM-/.test(a)?Yd[e.month()]:cd[e.month()]},monthsRegex:pd,monthsShortRegex:pd,monthsStrictRegex:/^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:yd,longMonthsParse:yd,shortMonthsParse:yd,weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(e){return e+(1===e||8===e||e>=20?"ste":"de")},week:{dow:1,doy:4}}),e.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd D. MMMM YYYY [kl.] HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var fd={1:"੧",2:"੨",3:"੩",4:"੪",5:"੫",6:"੬",7:"੭",8:"੮",9:"੯",0:"੦"},kd={"੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","੦":"0"};e.defineLocale("pa-in",{months:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),monthsShort:"ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),weekdays:"ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split("_"),weekdaysShort:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),weekdaysMin:"ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),longDateFormat:{LT:"A h:mm ਵਜੇ",LTS:"A h:mm:ss ਵਜੇ",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm ਵਜੇ",LLLL:"dddd, D MMMM YYYY, A h:mm ਵਜੇ"},calendar:{sameDay:"[ਅਜ] LT",nextDay:"[ਕਲ] LT",nextWeek:"dddd, LT",lastDay:"[ਕਲ] LT",lastWeek:"[ਪਿਛਲੇ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ਵਿੱਚ",past:"%s ਪਿਛਲੇ",s:"ਕੁਝ ਸਕਿੰਟ",m:"ਇਕ ਮਿੰਟ",mm:"%d ਮਿੰਟ",h:"ਇੱਕ ਘੰਟਾ",hh:"%d ਘੰਟੇ",d:"ਇੱਕ ਦਿਨ",dd:"%d ਦਿਨ",M:"ਇੱਕ ਮਹੀਨਾ",MM:"%d ਮਹੀਨੇ",y:"ਇੱਕ ਸਾਲ",yy:"%d ਸਾਲ"},preparse:function(e){return e.replace(/[੧੨੩੪੫੬੭੮੯੦]/g,function(e){return kd[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return fd[e]})},meridiemParse:/ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,meridiemHour:function(e,a){return 12===e&&(e=0),"ਰਾਤ"===a?e<4?e:e+12:"ਸਵੇਰ"===a?e:"ਦੁਪਹਿਰ"===a?e>=10?e:e+12:"ਸ਼ਾਮ"===a?e+12:void 0},meridiem:function(e,a,t){return e<4?"ਰਾਤ":e<10?"ਸਵੇਰ":e<17?"ਦੁਪਹਿਰ":e<20?"ਸ਼ਾਮ":"ਰਾਤ"},week:{dow:0,doy:6}});var Dd="styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),Td="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");e.defineLocale("pl",{months:function(e,a){return""===a?"("+Td[e.month()]+"|"+Dd[e.month()]+")":/D MMMM/.test(a)?Td[e.month()]:Dd[e.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"ndz_pon_wt_śr_czw_pt_sob".split("_"),weekdaysMin:"Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:Zs,mm:Zs,h:Zs,hh:Zs,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:Zs,y:"rok",yy:Zs},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"poucos segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),e.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),e.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:qs,h:"o oră",hh:qs,d:"o zi",dd:qs,M:"o lună",MM:qs,y:"un an",yy:qs},week:{dow:1,doy:7}});var gd=[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i];e.defineLocale("ru",{months:{format:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),standalone:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_")},monthsShort:{format:"янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),standalone:"янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_")},weekdays:{standalone:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),format:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_"),isFormat:/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/},weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:gd,longMonthsParse:gd,shortMonthsParse:gd,monthsRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsShortRegex:/^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,monthsStrictRegex:/^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,monthsShortStrictRegex:/^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В следующее] dddd [в] LT";case 1:case 2:case 4:return"[В следующий] dddd [в] LT";case 3:case 5:case 6:return"[В следующую] dddd [в] LT"}},lastWeek:function(e){if(e.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:Qs,mm:Qs,h:"час",hh:Qs,d:"день",dd:Qs,M:"месяц",MM:Qs,y:"год",yy:Qs},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(e){return/^(дня|вечера)$/.test(e)},meridiem:function(e,a,t){return e<4?"ночи":e<12?"утра":e<17?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(e,a){switch(a){case"M":case"d":case"DDD":return e+"-й";case"D":return e+"-го";case"w":case"W":return e+"-я";default:return e}},week:{dow:1,doy:7}}),e.defineLocale("se",{months:"ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split("_"),monthsShort:"ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),weekdays:"sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split("_"),weekdaysShort:"sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),
weekdaysMin:"s_v_m_g_d_b_L".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"MMMM D. [b.] YYYY",LLL:"MMMM D. [b.] YYYY [ti.] HH:mm",LLLL:"dddd, MMMM D. [b.] YYYY [ti.] HH:mm"},calendar:{sameDay:"[otne ti] LT",nextDay:"[ihttin ti] LT",nextWeek:"dddd [ti] LT",lastDay:"[ikte ti] LT",lastWeek:"[ovddit] dddd [ti] LT",sameElse:"L"},relativeTime:{future:"%s geažes",past:"maŋit %s",s:"moadde sekunddat",m:"okta minuhta",mm:"%d minuhtat",h:"okta diimmu",hh:"%d diimmut",d:"okta beaivi",dd:"%d beaivvit",M:"okta mánnu",MM:"%d mánut",y:"okta jahki",yy:"%d jagit"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(e){return e+" වැනි"},meridiemParse:/පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,isPM:function(e){return"ප.ව."===e||"පස් වරු"===e},meridiem:function(e,a,t){return e>11?t?"ප.ව.":"පස් වරු":t?"පෙ.ව.":"පෙර වරු"}});var wd="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),vd="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");e.defineLocale("sk",{months:wd,monthsShort:vd,weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:en,m:en,mm:en,h:en,hh:en,d:en,dd:en,M:en,MM:en,y:en,yy:en},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:an,m:an,mm:an,h:an,hh:an,d:an,dd:an,M:an,MM:an,y:an,yy:an},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),e.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),weekdaysParseExact:!0,meridiemParse:/PD|MD/,isPM:function(e){return"M"===e.charAt(0)},meridiem:function(e,a,t){return e<12?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var Sd={words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(e,a){return 1===e?a[0]:e>=2&&e<=4?a[1]:a[2]},translate:function(e,a,t){var s=Sd.words[t];return 1===t.length?a?s[0]:s[1]:e+" "+Sd.correctGrammaticalCase(e,s)}};e.defineLocale("sr-cyrl",{months:"јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split("_"),monthsShort:"јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),monthsParseExact:!0,weekdays:"недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),weekdaysShort:"нед._пон._уто._сре._чет._пет._суб.".split("_"),weekdaysMin:"не_по_ут_ср_че_пе_су".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var e=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:Sd.translate,mm:Sd.translate,h:Sd.translate,hh:Sd.translate,d:"дан",dd:Sd.translate,M:"месец",MM:Sd.translate,y:"годину",yy:Sd.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}});var Hd={words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(e,a){return 1===e?a[0]:e>=2&&e<=4?a[1]:a[2]},translate:function(e,a,t){var s=Hd.words[t];return 1===t.length?a?s[0]:s[1]:e+" "+Hd.correctGrammaticalCase(e,s)}};e.defineLocale("sr",{months:"januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),monthsParseExact:!0,weekdays:"nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sre._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var e=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return e[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:Hd.translate,mm:Hd.translate,h:Hd.translate,hh:Hd.translate,d:"dan",dd:Hd.translate,M:"mesec",MM:Hd.translate,y:"godinu",yy:Hd.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),e.defineLocale("ss",{months:"Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),monthsShort:"Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),weekdays:"Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),weekdaysShort:"Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),weekdaysMin:"Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",m:"umzuzu",mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(e,a,t){return e<11?"ekuseni":e<15?"emini":e<19?"entsambama":"ebusuku"},meridiemHour:function(e,a){return 12===e&&(e=0),"ekuseni"===a?e:"emini"===a?e>=11?e:e+12:"entsambama"===a||"ebusuku"===a?0===e?0:e+12:void 0},ordinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,doy:4}}),e.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [kl.] HH:mm",LLLL:"dddd D MMMM YYYY [kl.] HH:mm",lll:"D MMM YYYY HH:mm",llll:"ddd D MMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"e":1===a?"a":2===a?"a":"e";return e+t},week:{dow:1,doy:4}}),e.defineLocale("sw",{months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[leo saa] LT",nextDay:"[kesho saa] LT",nextWeek:"[wiki ijayo] dddd [saat] LT",lastDay:"[jana] LT",lastWeek:"[wiki iliyopita] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"masiku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},week:{dow:1,doy:7}});var bd={1:"௧",2:"௨",3:"௩",4:"௪",5:"௫",6:"௬",7:"௭",8:"௮",9:"௯",0:"௦"},jd={"௧":"1","௨":"2","௩":"3","௪":"4","௫":"5","௬":"6","௭":"7","௮":"8","௯":"9","௦":"0"};e.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(e){return e+"வது"},preparse:function(e){return e.replace(/[௧௨௩௪௫௬௭௮௯௦]/g,function(e){return jd[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return bd[e]})},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(e,a,t){return e<2?" யாமம்":e<6?" வைகறை":e<10?" காலை":e<14?" நண்பகல்":e<18?" எற்பாடு":e<22?" மாலை":" யாமம்"},meridiemHour:function(e,a){return 12===e&&(e=0),"யாமம்"===a?e<2?e:e+12:"வைகறை"===a||"காலை"===a?e:"நண்பகல்"===a&&e>=10?e:e+12},week:{dow:0,doy:6}}),e.defineLocale("te",{months:"జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split("_"),monthsShort:"జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split("_"),monthsParseExact:!0,weekdays:"ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split("_"),weekdaysShort:"ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),weekdaysMin:"ఆ_సో_మం_బు_గు_శు_శ".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[నేడు] LT",nextDay:"[రేపు] LT",nextWeek:"dddd, LT",lastDay:"[నిన్న] LT",lastWeek:"[గత] dddd, LT",sameElse:"L"},relativeTime:{future:"%s లో",past:"%s క్రితం",s:"కొన్ని క్షణాలు",m:"ఒక నిమిషం",mm:"%d నిమిషాలు",h:"ఒక గంట",hh:"%d గంటలు",d:"ఒక రోజు",dd:"%d రోజులు",M:"ఒక నెల",MM:"%d నెలలు",y:"ఒక సంవత్సరం",yy:"%d సంవత్సరాలు"},ordinalParse:/\d{1,2}వ/,ordinal:"%dవ",meridiemParse:/రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,meridiemHour:function(e,a){return 12===e&&(e=0),"రాత్రి"===a?e<4?e:e+12:"ఉదయం"===a?e:"మధ్యాహ్నం"===a?e>=10?e:e+12:"సాయంత్రం"===a?e+12:void 0},meridiem:function(e,a,t){return e<4?"రాత్రి":e<10?"ఉదయం":e<17?"మధ్యాహ్నం":e<20?"సాయంత్రం":"రాత్రి"},week:{dow:0,doy:6}}),e.defineLocale("tet",{months:"Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez".split("_"),weekdays:"Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu".split("_"),weekdaysShort:"Dom_Seg_Ters_Kua_Kint_Sext_Sab".split("_"),weekdaysMin:"Do_Seg_Te_Ku_Ki_Sex_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Ohin iha] LT",nextDay:"[Aban iha] LT",nextWeek:"dddd [iha] LT",lastDay:"[Horiseik iha] LT",lastWeek:"dddd [semana kotuk] [iha] LT",sameElse:"L"},relativeTime:{future:"iha %s",past:"%s liuba",s:"minutu balun",m:"minutu ida",mm:"minutus %d",h:"horas ida",hh:"horas %d",d:"loron ida",dd:"loron %d",M:"fulan ida",MM:"fulan %d",y:"tinan ida",yy:"tinan %d"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),monthsParseExact:!0,weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H:mm",LLLL:"วันddddที่ D MMMM YYYY เวลา H:mm"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(e){return"หลังเที่ยง"===e},meridiem:function(e,a,t){return e<12?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),e.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"LT [ngayong araw]",nextDay:"[Bukas ng] LT",nextWeek:"LT [sa susunod na] dddd",lastDay:"LT [kahapon]",lastWeek:"LT [noong nakaraang] dddd",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}});var xd="pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");e.defineLocale("tlh",{months:"tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split("_"),monthsShort:"jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split("_"),monthsParseExact:!0,weekdays:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysShort:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),weekdaysMin:"lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[DaHjaj] LT",nextDay:"[wa’leS] LT",nextWeek:"LLL",lastDay:"[wa’Hu’] LT",lastWeek:"LLL",sameElse:"L"},relativeTime:{future:tn,past:sn,s:"puS lup",m:"wa’ tup",mm:nn,h:"wa’ rep",hh:nn,d:"wa’ jaj",dd:nn,M:"wa’ jar",MM:nn,y:"wa’ DIS",yy:nn},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});var Pd={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"};return e.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(e){if(0===e)return e+"'ıncı";var a=e%10,t=e%100-a,s=e>=100?100:null;return e+(Pd[a]||Pd[t]||Pd[s])},week:{dow:1,doy:7}}),e.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY HH.mm",LLLL:"dddd, [li] D. MMMM [dallas] YYYY HH.mm"},meridiemParse:/d\'o|d\'a/i,isPM:function(e){return"d'o"===e.toLowerCase()},meridiem:function(e,a,t){return e>11?t?"d'o":"D'O":t?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:_n,m:_n,mm:_n,h:_n,hh:_n,d:_n,dd:_n,M:_n,MM:_n,y:_n,yy:_n},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),e.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),e.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),e.defineLocale("uk",{months:{format:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),standalone:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")},monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:mn,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:un("[Сьогодні "),nextDay:un("[Завтра "),lastDay:un("[Вчора "),nextWeek:un("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return un("[Минулої] dddd [").call(this);case 1:case 2:case 4:return un("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:on,mm:on,h:"годину",hh:on,d:"день",dd:on,M:"місяць",MM:on,y:"рік",yy:on},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(e){return/^(дня|вечора)$/.test(e)},meridiem:function(e,a,t){return e<4?"ночі":e<12?"ранку":e<17?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(e,a){switch(a){case"M":case"d":case"DDD":case"w":case"W":return e+"-й";case"D":return e+"-го";default:return e}},week:{dow:1,doy:7}}),e.defineLocale("uz",{months:"январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),e.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),monthsParseExact:!0,weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysParseExact:!0,meridiemParse:/sa|ch/i,isPM:function(e){return/^ch$/i.test(e)},meridiem:function(e,a,t){return e<12?t?"sa":"SA":t?"ch":"CH"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(e){return e},week:{dow:1,doy:4}}),e.defineLocale("x-pseudo",{months:"J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split("_"),monthsShort:"J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split("_"),monthsParseExact:!0,weekdays:"S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split("_"),weekdaysShort:"S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),weekdaysMin:"S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[T~ódá~ý át] LT",nextDay:"[T~ómó~rró~w át] LT",nextWeek:"dddd [át] LT",lastDay:"[Ý~ést~érdá~ý át] LT",lastWeek:"[L~ást] dddd [át] LT",sameElse:"L"},relativeTime:{future:"í~ñ %s",past:"%s á~gó",s:"á ~féw ~sécó~ñds",m:"á ~míñ~úté",mm:"%d m~íñú~tés",h:"á~ñ hó~úr",hh:"%d h~óúrs",d:"á ~dáý",dd:"%d d~áýs",M:"á ~móñ~th",MM:"%d m~óñt~hs",y:"á ~ýéár",yy:"%d ý~éárs"},ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var a=e%10,t=1===~~(e%100/10)?"th":1===a?"st":2===a?"nd":3===a?"rd":"th";return e+t},week:{dow:1,doy:4}}),e.defineLocale("yo",{months:"Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀".split("_"),monthsShort:"Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀".split("_"),weekdays:"Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta".split("_"),weekdaysShort:"Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá".split("_"),weekdaysMin:"Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Ònì ni] LT",nextDay:"[Ọ̀la ni] LT",nextWeek:"dddd [Ọsẹ̀ tón'bọ] [ni] LT",lastDay:"[Àna ni] LT",lastWeek:"dddd [Ọsẹ̀ tólọ́] [ni] LT",sameElse:"L"},relativeTime:{future:"ní %s",past:"%s kọjá",s:"ìsẹjú aayá die",m:"ìsẹjú kan",mm:"ìsẹjú %d",h:"wákati kan",hh:"wákati %d",d:"ọjọ́ kan",dd:"ọjọ́ %d",M:"osù kan",MM:"osù %d",y:"ọdún kan",yy:"ọdún %d"},ordinalParse:/ọjọ́\s\d{1,2}/,ordinal:"ọjọ́ %d",week:{dow:1,doy:4}}),e.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah点mm分",LLLL:"YYYY年MMMD日ddddAh点mm分",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah点mm分",llll:"YYYY年MMMD日ddddAh点mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,a){return 12===e&&(e=0),"凌晨"===a||"早上"===a||"上午"===a?e:"下午"===a||"晚上"===a?e+12:e>=11?e:e+12},meridiem:function(e,a,t){var s=100*e+a;return s<600?"凌晨":s<900?"早上":s<1130?"上午":s<1230?"中午":s<1800?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var a,t;return a=e().startOf("week"),t=this.diff(a,"days")>=7?"[下]":"[本]",0===this.minutes()?t+"dddAh点整":t+"dddAh点mm"},lastWeek:function(){var a,t;return a=e().startOf("week"),t=this.unix()<a.unix()?"[上]":"[本]",0===this.minutes()?t+"dddAh点整":t+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(e,a){switch(a){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"周";default:return e}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),e.defineLocale("zh-hk",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah點mm分",LLLL:"YYYY年MMMD日ddddAh點mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah點mm分",llll:"YYYY年MMMD日ddddAh點mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,a){return 12===e&&(e=0),"凌晨"===a||"早上"===a||"上午"===a?e:"中午"===a?e>=11?e:e+12:"下午"===a||"晚上"===a?e+12:void 0},meridiem:function(e,a,t){var s=100*e+a;return s<600?"凌晨":s<900?"早上":s<1130?"上午":s<1230?"中午":s<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(e,a){switch(a){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"週";default:return e}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}}),e.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah點mm分",LLLL:"YYYY年MMMD日ddddAh點mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah點mm分",llll:"YYYY年MMMD日ddddAh點mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(e,a){return 12===e&&(e=0),"凌晨"===a||"早上"===a||"上午"===a?e:"中午"===a?e>=11?e:e+12:"下午"===a||"晚上"===a?e+12:void 0},meridiem:function(e,a,t){var s=100*e+a;return s<600?"凌晨":s<900?"早上":s<1130?"上午":s<1230?"中午":s<1800?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(e,a){switch(a){case"d":case"D":case"DDD":return e+"日";case"M":return e+"月";case"w":case"W":return e+"週";default:return e}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"1 分鐘",mm:"%d 分鐘",h:"1 小時",hh:"%d 小時",d:"1 天",dd:"%d 天",M:"1 個月",MM:"%d 個月",y:"1 年",yy:"%d 年"}}),e.locale("en"),e});

},{}],51:[function(require,module,exports){
/**
 * UAParser.js v0.7.12
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.12',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function () {

            var result, i = 0, j, k, p, q, matches, match, args = arguments;

            // loop through all regexes maps
            while (i < args.length && !matches) {

                var regex = args[i],       // even sequence (0,2,4,..)
                    props = args[i + 1];   // odd sequence (1,3,5,..)

                // construct object barebones
                if (typeof result === UNDEF_TYPE) {
                    result = {};
                    for (p in props) {
                        if (props.hasOwnProperty(p)){
                            q = props[p];
                            if (typeof q === OBJ_TYPE) {
                                result[q[0]] = undefined;
                            } else {
                                result[q] = undefined;
                            }
                        }
                    }
                }

                // try matching uastring with regexes
                j = k = 0;
                while (j < regex.length && !matches) {
                    matches = regex[j++].exec(this.getUA());
                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        result[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        result[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                result[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            return result;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /android.+samsungbrowser\/([\w\.]+)/i,
            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            /(qqbrowser)[\/\s]?([\w\.]+)/i
                                                                                // QQBrowser
            ], [NAME, VERSION], [

            /(uc\s?browser)[\/\s]?([\w\.]+)/i,
            /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,
            /juc.+(ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS
            ], [VERSION, [NAME, 'Facebook']], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Phone'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /(nexus\s6p)/i                                                      // Huawei Nexus 6P
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                    // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [

            /android.+a000(1)\s+build/i                                         // OnePlus
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /\s(tablet)[;\/]/i,                                                 // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL]

            /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(R1001)/i                                                          // Oppo R1001
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /(X9006)/i                                                          // Oppo Find 7a
            ], [[MODEL, 'Find 7a'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R2001)/i                                                          // Oppo YOYO R2001
            ], [[MODEL, 'Yoyo R2001'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R815)/i                                                           // Oppo Clover R815
            ], [[MODEL, 'Clover R815'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
             /(U707)/i                                                          // Oppo Find Way S
            ], [[MODEL, 'Find Way S'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,                  // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                  // Haiku
            ], [NAME, VERSION],[

            /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i              // iOS
            ], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////


    var UAParser = function (uastring, extensions) {

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = mapper.rgx.apply(this, rgxmap.browser);
            browser.major = util.major(browser.version);
            return browser;
        };
        this.getCPU = function () {
            return mapper.rgx.apply(this, rgxmap.cpu);
        };
        this.getDevice = function () {
            return mapper.rgx.apply(this, rgxmap.device);
        };
        this.getEngine = function () {
            return mapper.rgx.apply(this, rgxmap.engine);
        };
        this.getOS = function () {
            return mapper.rgx.apply(this, rgxmap.os);
        };
        this.getResult = function() {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };


    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window.jQuery || window.Zepto;
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function() {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

},{}],52:[function(require,module,exports){
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&i<o;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&i<u;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&i<a;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,y=c.bind,d=Object.create,g=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(void 0===t)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(e<2||null==r)return r;for(var u=1;u<e;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;c<a;c++){var f=o[c];t&&void 0!==r[f]||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(d)return d(n);g.prototype=n;var t=new g;return g.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&t<=A};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;e<u;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;e<u;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;o<u;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;if(e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),void 0!==e&&e!==-1)return n[e]},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-(1/0),o=-(1/0);if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;a<c;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-(1/0)&&i===-(1/0))&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;a<c;a++)e=n[a],e<i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u<o||u===1/0&&i===1/0)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;i<e;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(r<e||void 0===e)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){if(null!=n)return null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){if(null!=n)return null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);o<a;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;f<l;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);o<a;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);e<u;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;o<r&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;e<t;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);e<u;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);i<o;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;i<e;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(y&&n.bind===y)return y.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;o<u;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(e<=1)throw new Error("bindAll must be passed function names");for(t=1;t<e;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,l<=0||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;f<t&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){if(--n<1)return t.apply(this,arguments)}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),n<=1&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;a<i;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;e<u;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;i<o;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;a<c;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;i<e;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n||(k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length)},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return void 0===n},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;u<n;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return void 0===e&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(n){throw n.source=i,n}var a=function(n){return o.call(this,n,m)},c=t.variable||"obj";return a.source="function("+c+"){\n"+i+"}",a},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);

},{}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Globals {
	constructor() {
		this.DEBUG = chrome.runtime.getManifest().debug || false;
		this.LOG = this.DEBUG && chrome.runtime.getManifest().log;
		this.EXTENSION_NAME = chrome.runtime.getManifest().name || 'Ghostery';
		this.EXTENSION_VERSION = chrome.runtime.getManifest().version;
		this.BROWSER_INFO = { displayName: '', name: '', token: '', version: '', os: 'other' };

		this.JUST_INSTALLED = false;
		this.JUST_UPGRADED = false;
		this.HOTFIX = false;
		this.LET_REDIRECTS_THROUGH = false;
		this.C2P_LOADED = false;
		this.NOTIFICATIONS_LOADED = false;
		this.hotfix_alert_shown = false;
		this.upgrade_alert_shown = false;

		this.GHOSTERY_DOMAIN = this.DEBUG ? 'ghosterystage' : 'ghostery';
		this.METRICS_SUB_DOMAIN = this.DEBUG ? 'staging-d' : 'd';
		this.CMP_SUB_DOMAIN = this.DEBUG ? 'staging-cmp-cdn' : 'cmp-cdn';
		this.CDN_SUB_DOMAIN = this.DEBUG ? 'staging-cdn' : 'cdn';

		this.REDIRECT_MAP = new Map();
		this.BLOCKED_REDIRECT_DATA = {};
		this.EXCLUDES = ["extension.ghostery.com", "extension.ghosterystage.com", "extension.ghosterydev.com", "signon.ghostery.com", "signon.ghosterystage.com", "account.ghostery.com", "account.ghosterystage.com"];

		this.SYNC_ARRAY = ['enable_autoupdate', 'show_tracker_urls', 'enable_click2play', 'enable_click2play_social', 'toggle_individual_trackers', 'ignore_first_party', 'block_by_default', 'show_alert', 'alert_expanded', 'alert_bubble_timeout', 'alert_bubble_pos', 'hide_alert_trusted', 'show_cmp', 'notify_upgrade_updates', 'notify_hotfix_updates', 'notify_library_updates', 'reload_banner_status', 'trackers_banner_status', 'show_badge', 'ghostrank', 'ghostrank_dismissed', 'enable_metrics', 'metrics_dismissed', 'enable_human_web', 'human_web_dismissed', 'account_dismissed', 'tour_alert_dismissed', 'import_callout_dismissed', 'site_whitelist', 'site_blacklist', 'selected_app_ids', 'site_specific_blocks', 'site_specific_unblocks'];

		this.buildBrowserInfo();
	}

	buildBrowserInfo() {
		var ua = (0, _uaParserJs2.default)(navigator.userAgent),
		    browser = ua.browser.name.toLowerCase(),
		    version = ua.browser.version,
		    platform = ua.os.name.toLowerCase();

		if (browser.includes('edge')) {
			this.BROWSER_INFO.displayName = 'Edge';
			this.BROWSER_INFO.name = 'edge';
			this.BROWSER_INFO.token = 'ed';
		} else if (browser.includes('opera')) {
			this.BROWSER_INFO.displayName = 'Opera';
			this.BROWSER_INFO.name = 'opera';
			this.BROWSER_INFO.token = 'op';
		} else if (browser.includes('chrome')) {
			this.BROWSER_INFO.displayName = 'Chrome';
			this.BROWSER_INFO.name = 'chrome';
			this.BROWSER_INFO.token = 'ch';
		} else if (browser.includes('firefox')) {
			this.BROWSER_INFO.displayName = 'Firefox';
			this.BROWSER_INFO.name = 'firefox';
			this.BROWSER_INFO.token = 'ff';
		} else if (browser.includes('yandex')) {
			this.BROWSER_INFO.displayName = 'Yandex';
			this.BROWSER_INFO.name = 'yandex';
			this.BROWSER_INFO.token = 'yx';
		}

		if (platform.includes('mac')) {
			this.BROWSER_INFO.os = 'mac';
		} else if (platform.includes('win')) {
			this.BROWSER_INFO.os = 'win';
		} else if (platform.includes('linux')) {
			this.BROWSER_INFO.os = 'linux';
		} else if (platform.includes('android')) {
			this.BROWSER_INFO.os = 'android';
		}

		this.BROWSER_INFO.version = version;
	}
}

exports.default = new Globals();
module.exports = exports['default'];

},{"ua-parser-js":51}],54:[function(require,module,exports){
(function (Buffer){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.log = log;
exports.pref = pref;
exports.prefsGet = prefsGet;
exports.prefsSet = prefsSet;
exports.hashCode = hashCode;
exports.decodeJwt = decodeJwt;


const DEBUG = chrome.runtime.getManifest().debug || false;
const LOG = DEBUG && chrome.runtime.getManifest().log;

function log(...args) {
	if (!LOG) {
		return false;
	}

	var errors = args.toString().toLowerCase().indexOf('error');

	args.unshift(new Date().toLocaleTimeString() + '\t');

	if (errors !== -1) {
		console.error.apply(console, args);
	} else {
		console.log.apply(console, args);
	}
}

function pref(key, value) {
	if (typeof value === 'undefined') {
		return prefsGet(key);
	} else {
		let valueObj = {};
		valueObj[key] = value;
		return prefsSet(valueObj);
	}
}

function prefsGet(...args) {
	return new Promise(function (resolve, reject) {
		chrome.storage.local.get(args, function (items) {
			if (chrome.runtime.lastError) {
				log("prefsGet ERROR", chrome.runtime.lastError);
				reject(new Error(chrome.runtime.lastError));
			} else {
				var result = null;
				if (args.length === 1) {
					var key = args[0];
					if (items && items.hasOwnProperty(key)) {
						result = items[key];
					}
				} else {
					result = {};
					args.forEach(function (key) {
						result[key] = null;
						if (items && items.hasOwnProperty(key)) {
							result[key] = items[key];
						}
					});
				}
				resolve(result);
			}
		});
	});
}

function prefsSet(prefs) {
	return new Promise(function (resolve, reject) {
		if (typeof prefs !== 'undefined') {
			chrome.storage.local.set(prefs, function () {
				if (chrome.runtime.lastError) {
					log("prefsSet ERROR", chrome.runtime.lastError);
					reject(new Error(chrome.runtime.lastError));
				} else {
					resolve(prefs);
				}
			});
		} else {
			log("prefsSet ERROR", chrome.runtime.lastError);
			reject(new Error(chrome.runtime.lastError));
		}
	});
}

function hashCode(str) {
	var hash = 0,
	    character,
	    i;

	if (str.length === 0) {
		return hash;
	}

	for (i = 0; i < str.length; i++) {
		character = str.charCodeAt(i);
		hash = (hash << 5) - hash + character;
		hash = hash & hash;
	}

	return hash;
}

function decodeJwt(token) {
	var segments = token.split('.');

	if (segments.length !== 3) {
		return null;
	}

	var headerSeg = segments[0];
	var payloadSeg = segments[1];
	var signatureSeg = segments[2];

	var header = JSON.parse(_base64urlDecode(headerSeg));
	var payload = JSON.parse(_base64urlDecode(payloadSeg));

	return {
		header: header,
		payload: payload,
		signature: signatureSeg
	};
}

function _base64urlDecode(str) {
	return new Buffer(_base64urlUnescape(str), 'base64').toString();
}

function _base64urlUnescape(str) {
	str += new Array(5 - str.length % 4).join('=');
	return str.replace(/\-/g, '+').replace(/_/g, '/');
}

}).call(this,require("buffer").Buffer)

},{"buffer":45}]},{},[1])

//# sourceMappingURL=panel.js.map
