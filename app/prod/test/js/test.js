(function(root) {

	var asap = (typeof setImmediate === 'function' && setImmediate) ||
		function(fn) { setTimeout(fn, 1); };

	function bind(fn, thisArg) {
		return function() {
			fn.apply(thisArg, arguments);
		}
	}

	var isArray = Array.isArray || function(value) { return Object.prototype.toString.call(value) === "[object Array]" };

	function Promise(fn) {
		if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function') throw new TypeError('not a function');
		this._state = null;
		this._value = null;
		this._deferreds = []

		doResolve(fn, bind(resolve, this), bind(reject, this))
	}

	function handle(deferred) {
		var me = this;
		if (this._state === null) {
			this._deferreds.push(deferred);
			return
		}
		asap(function() {
			var cb = me._state ? deferred.onFulfilled : deferred.onRejected
			if (cb === null) {
				(me._state ? deferred.resolve : deferred.reject)(me._value);
				return;
			}
			var ret;
			try {
				ret = cb(me._value);
			}
			catch (e) {
				deferred.reject(e);
				return;
			}
			deferred.resolve(ret);
		})
	}

	function resolve(newValue) {
		try {
			if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				var then = newValue.then;
				if (typeof then === 'function') {
					doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
					return;
				}
			}
			this._state = true;
			this._value = newValue;
			finale.call(this);
		} catch (e) { reject.call(this, e); }
	}

	function reject(newValue) {
		this._state = false;
		this._value = newValue;
		finale.call(this);
	}

	function finale() {
		for (var i = 0, len = this._deferreds.length; i < len; i++) {
			handle.call(this, this._deferreds[i]);
		}
		this._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, resolve, reject){
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.resolve = resolve;
		this.reject = reject;
	}

	function doResolve(fn, onFulfilled, onRejected) {
		var done = false;
		try {
			fn(function (value) {
				if (done) return;
				done = true;
				onFulfilled(value);
			}, function (reason) {
				if (done) return;
				done = true;
				onRejected(reason);
			})
		} catch (ex) {
			if (done) return;
			done = true;
			onRejected(ex);
		}
	}

	Promise.prototype['catch'] = function (onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function(onFulfilled, onRejected) {
		var me = this;
		return new Promise(function(resolve, reject) {
			handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
		})
	};

	Promise.all = function () {
		var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

		return new Promise(function (resolve, reject) {
			if (args.length === 0) return resolve([]);
			var remaining = args.length;
			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						var then = val.then;
						if (typeof then === 'function') {
							then.call(val, function (val) { res(i, val) }, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}
			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function (value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for(var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};

	Promise._setImmediateFn = function _setImmediateFn(fn) {
		asap = fn;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		root.Promise = Promise;
	}

})(this);

(function() {
  'use strict';

  if (self.fetch) {
	return
  }

  function normalizeName(name) {
	if (typeof name !== 'string') {
	  name = String(name)
	}
	if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	  throw new TypeError('Invalid character in header field name')
	}
	return name.toLowerCase()
  }

  function normalizeValue(value) {
	if (typeof value !== 'string') {
	  value = String(value)
	}
	return value
  }

  function Headers(headers) {
	this.map = {}

	if (headers instanceof Headers) {
	  headers.forEach(function(value, name) {
		this.append(name, value)
	  }, this)

	} else if (headers) {
	  Object.getOwnPropertyNames(headers).forEach(function(name) {
		this.append(name, headers[name])
	  }, this)
	}
  }

  Headers.prototype.append = function(name, value) {
	name = normalizeName(name)
	value = normalizeValue(value)
	var list = this.map[name]
	if (!list) {
	  list = []
	  this.map[name] = list
	}
	list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
	delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
	var values = this.map[normalizeName(name)]
	return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
	return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
	return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
	this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
	Object.getOwnPropertyNames(this.map).forEach(function(name) {
	  this.map[name].forEach(function(value) {
		callback.call(thisArg, value, name, this)
	  }, this)
	}, this)
  }

  function consumed(body) {
	if (body.bodyUsed) {
	  return Promise.reject(new TypeError('Already read'))
	}
	body.bodyUsed = true
  }

  function fileReaderReady(reader) {
	return new Promise(function(resolve, reject) {
	  reader.onload = function() {
		resolve(reader.result)
	  }
	  reader.onerror = function() {
		reject(reader.error)
	  }
	})
  }

  function readBlobAsArrayBuffer(blob) {
	var reader = new FileReader()
	reader.readAsArrayBuffer(blob)
	return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
	var reader = new FileReader()
	reader.readAsText(blob)
	return fileReaderReady(reader)
  }

  var support = {
	blob: 'FileReader' in self && 'Blob' in self && (function() {
	  try {
		new Blob();
		return true
	  } catch(e) {
		return false
	  }
	})(),
	formData: 'FormData' in self,
	arrayBuffer: 'ArrayBuffer' in self
  }

  function Body() {
	this.bodyUsed = false


	this._initBody = function(body) {
	  this._bodyInit = body
	  if (typeof body === 'string') {
		this._bodyText = body
	  } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
		this._bodyBlob = body
	  } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
		this._bodyFormData = body
	  } else if (!body) {
		this._bodyText = ''
	  } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	  } else {
		throw new Error('unsupported BodyInit type')
	  }
	}

	if (support.blob) {
	  this.blob = function() {
		var rejected = consumed(this)
		if (rejected) {
		  return rejected
		}

		if (this._bodyBlob) {
		  return Promise.resolve(this._bodyBlob)
		} else if (this._bodyFormData) {
		  throw new Error('could not read FormData body as blob')
		} else {
		  return Promise.resolve(new Blob([this._bodyText]))
		}
	  }

	  this.arrayBuffer = function() {
		return this.blob().then(readBlobAsArrayBuffer)
	  }

	  this.text = function() {
		var rejected = consumed(this)
		if (rejected) {
		  return rejected
		}

		if (this._bodyBlob) {
		  return readBlobAsText(this._bodyBlob)
		} else if (this._bodyFormData) {
		  throw new Error('could not read FormData body as text')
		} else {
		  return Promise.resolve(this._bodyText)
		}
	  }
	} else {
	  this.text = function() {
		var rejected = consumed(this)
		return rejected ? rejected : Promise.resolve(this._bodyText)
	  }
	}

	if (support.formData) {
	  this.formData = function() {
		return this.text().then(decode)
	  }
	}

	this.json = function() {
	  return this.text().then(JSON.parse)
	}

	return this
  }

  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
	var upcased = method.toUpperCase()
	return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
	options = options || {}
	var body = options.body
	if (Request.prototype.isPrototypeOf(input)) {
	  if (input.bodyUsed) {
		throw new TypeError('Already read')
	  }
	  this.url = input.url
	  this.credentials = input.credentials
	  if (!options.headers) {
		this.headers = new Headers(input.headers)
	  }
	  this.method = input.method
	  this.mode = input.mode
	  if (!body) {
		body = input._bodyInit
		input.bodyUsed = true
	  }
	} else {
	  this.url = input
	}

	this.credentials = options.credentials || this.credentials || 'omit'
	if (options.headers || !this.headers) {
	  this.headers = new Headers(options.headers)
	}
	this.method = normalizeMethod(options.method || this.method || 'GET')
	this.mode = options.mode || this.mode || null
	this.referrer = null

	if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	  throw new TypeError('Body not allowed for GET or HEAD requests')
	}
	this._initBody(body)
  }

  Request.prototype.clone = function() {
	return new Request(this)
  }

  function decode(body) {
	var form = new FormData()
	body.trim().split('&').forEach(function(bytes) {
	  if (bytes) {
		var split = bytes.split('=')
		var name = split.shift().replace(/\+/g, ' ')
		var value = split.join('=').replace(/\+/g, ' ')
		form.append(decodeURIComponent(name), decodeURIComponent(value))
	  }
	})
	return form
  }

  function headers(xhr) {
	var head = new Headers()
	var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	pairs.forEach(function(header) {
	  var split = header.trim().split(':')
	  var key = split.shift().trim()
	  var value = split.join(':').trim()
	  head.append(key, value)
	})
	return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
	if (!options) {
	  options = {}
	}

	this._initBody(bodyInit)
	this.type = 'default'
	this.status = options.status
	this.ok = this.status >= 200 && this.status < 300
	this.statusText = options.statusText
	this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	this.url = options.url || ''
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
	return new Response(this._bodyInit, {
	  status: this.status,
	  statusText: this.statusText,
	  headers: new Headers(this.headers),
	  url: this.url
	})
  }

  Response.error = function() {
	var response = new Response(null, {status: 0, statusText: ''})
	response.type = 'error'
	return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
	if (redirectStatuses.indexOf(status) === -1) {
	  throw new RangeError('Invalid status code')
	}

	return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
	return new Promise(function(resolve, reject) {
	  var request
	  if (Request.prototype.isPrototypeOf(input) && !init) {
		request = input
	  } else {
		request = new Request(input, init)
	  }

	  var xhr = new XMLHttpRequest()

	  function responseURL() {
		if ('responseURL' in xhr) {
		  return xhr.responseURL
		}

		if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
		  return xhr.getResponseHeader('X-Request-URL')
		}

		return;
	  }

	  xhr.onload = function() {
		var status = (xhr.status === 1223) ? 204 : xhr.status
		if (status < 100 || status > 599) {
		  reject(new TypeError('Network request failed'))
		  return
		}
		var options = {
		  status: status,
		  statusText: xhr.statusText,
		  headers: headers(xhr),
		  url: responseURL()
		}
		var body = 'response' in xhr ? xhr.response : xhr.responseText;
		resolve(new Response(body, options))
	  }

	  xhr.onerror = function() {
		reject(new TypeError('Network request failed'))
	  }

	  xhr.open(request.method, request.url, true)

	  if (request.credentials === 'include') {
		xhr.withCredentials = true
	  }

	  if ('responseType' in xhr && support.blob) {
		xhr.responseType = 'blob'
	  }

	  request.headers.forEach(function(value, name) {
		xhr.setRequestHeader(name, value)
	  })

	  xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	})
  }
  self.fetch.polyfill = true
})();

/**
 * Module testing on page to IntHouse
 */

(function () {
	'use strict';

	function Test (config) {
		this.url = config.url;
		this.levels = config.levels;
		this.timeFromStart = config.time;
		this.currentTime = this.timeFromStart;
		this.currentQuest = 0;
		this.progress = 0;
		this.result = 0;

		this.init = function () {
			document.addEventListener('click', this, false);
		};

		this.statusTest = function (str) {
			if (!this.status) {
				this.status = 'pendding';
			}

			if (str && (typeof str) === 'string') {
				this.status = str;
			}

			if (!str) {
				return this.status;
			}
		};

		this.handleEvent = function (e) {
			switch (e.type) {
				case 'click': 
					this.openWindow(e);
					this.checkAge(e);
					this.nextQuest(e);
					this.openFormWrite(e);
					this.closeWindow(e);
				break;
			}
		};

		this.animationOpenWindow = function (duration) {
			$('[data-test]').fadeIn({
				duration: duration,
				complete: function(){
					$(this).addClass("is-visible");
				}
			});
		};

		this.animationOpenPage = function (elem, callback) {
			var prevElem = $('[data-test]').find('.is-active');

			if (!elem || !prevElem) {
				return;
			}

			if (elem[0].hasAttribute('data-test-window')) {

				this._setTime();
			}

			prevElem.removeClass('is-active');
			elem.addClass('is-active');

			if (callback && (callback instanceof Function)) {
				return callback();
			}
		}.bind(this);

		this.animationCloseWindow = function (duration) {
			var popupSelector = $('[data-test]'),
				success = $('.popup__success'),
				forms = $('.popup__form');

			if(!popupSelector.hasClass('is-visible')) {
				return;			
			}
			
			popupSelector
				.removeClass("is-visible")
				.delay(duration)
				.fadeOut({
					duration: duration
				});

			setTimeout(function () {
				forms.addClass('is-active');
				success.removeClass('is-active');
			}, duration);
		};

		this.openWindow = function (e) {
			var target = e.target,
				duration = 500,
				self = this;

			if (!target.hasAttribute('data-test-open')) {

				while (target != document) {
					if (target.hasAttribute('data-test-open')) {
						break;
					}

					target = target.parentNode;
				}
			}

			if (target == document) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			this._load(function () {
				self.animationOpenWindow(duration);
			});
		};

		this.closeWindow = function (e) {
			var target = e.target,
				duration = 500,
				self = this;

			if (!target.hasAttribute('data-test-close') || !target.hasAttribute('data-test')) {

				while (target != document) {
					if (target.hasAttribute('data-test-close') || target.hasAttribute('data-test')) {
						break;
					}

					if (target.classList.contains('popup') && target.parentNode.hasAttribute('data-test')) {
						e.stopPropagation();
						return;
					}

					target = target.parentNode;
				}
			}

			if (target == document) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			this.animationCloseWindow();
			this.resetTest();
		};

		this.resetTest = function () {
			this.countLevels = this.result = this.variant = this.age = this.waiter = null;
			this.statusTest('pendding');
		};

		this.setLevel = function (value, callback) {
			if (!this.levels) {
				this.levels = [];
			}

			if (value) {
				this.levels.push(value.toString());
			}
			
			callback();
		};

		this.openFormWrite = function (e) {
			var target = e.target,
				self = this,
				form, change;

			if (!target.hasAttribute('data-test-review')) {

				while (target != document) {
					if (target.hasAttribute('data-test-review')) {
						break;
					}

					target = target.parentNode;
				}
			}

			if (target == document) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			if (self.age >= 11 && self.age < 18) {
				self.animationOpenPage($('[data-test-writebig]'));
			} else if (self.age >= 18) {
				self.animationOpenPage($('[data-test-writesmall]'));
			};
		};

		this.checkAge = function (e) {
			var target = e.target,
				self = this,
				form, change;

			if (!target.hasAttribute('data-test-valid')) {

				while (target != document) {
					if (target.hasAttribute('data-test-valid')) {
						break;
					}

					target = target.parentNode;
				}
			}

			if (target == document) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			form = document.querySelector('[data-test-validation]');
			change = form.querySelectorAll('input');

			if (form && change && change.length > 0) {
				Array.prototype.forEach.call(change, function (item) {
					if (!self.age) {
						self.age = 0;
					}

					self.age = +item.getAttribute('id').split('_')[0];

					if (!item.checked) {
						return;
					}

					if (self.age >= 11) {
						self.animationOpenPage($('[data-test-window]'));
					} else if (self.age < 11 && self.age > 1) {
						self.animationOpenPage($('[data-test-writebig]'));
					};

				});

				return self.statusTest("resolve");
			}
		};

		this.nextQuest = function (e) {
			var target = e.target,
				self = this,
				form, change;

			if (!target.hasAttribute('data-test-next')) {

				while (target != document) {
					if (target.hasAttribute('data-test-next')) {
						break;
					}

					target = target.parentNode;
				}
			}

			if (target == document) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			form = document.querySelector('[data-test-window]');
			change = form.querySelectorAll('input');

			if (form && change && change.length > 0) {
				Array.prototype.forEach.call(change, function (item, i) {
					var answer = +item.getAttribute('id').split('_')[1],
						check;

					if (!item.checked) {
						return;
					}

					if (answer) {
						if (!self.result) {
							self.result = {};
						}

						if (!self.result[self.data.number]) {
							self.result[self.data.number] = {};
						};

						if (!self.result[self.data.number][self.variant]) {
							self.result[self.data.number][self.variant] = {};
						};

						check = self.data[self.variant][self.currentQuest]['options'][answer-1]['correctly'];

						if (check) {
							self.result[self.data.number][self.variant][self.currentQuest + 1] = check;
						}
					};

					self._nextTestTemplate(self.data);

				});

				return;
			}
		};

		this._getUrlFile = function () {
			if (!this.url || !(this.url.split('.')[0] === this.url)) {
				return;
			}

			if (!this.waiter) {
				this.waiter = [];
			}

			if (this.waiter.length <= 0) {
				if (!this.countLevels || this.countLevels.length <= 0) {
					this.countLevels = config.levels.slice();
				}

				this.waiter = this.countLevels;
			}

			return this.url + this.waiter.shift().toString() + '.json';
		};

		this._setTemplate = function (view, obj) {
			var view = view;

			if (!view || (typeof view !== 'string')) {
				return;
			}

			for (var key in obj) {
				view = view.replace('{' + key + '}', obj[key]);
			}

			return view;
		};

		this.Timer = function (elm, tl) {
			this.initialize = function(elm, tl) {
				this.elem = elm;
				this.tl = tl;
			};
			this.countDown = function() {
				var timer = '';
				var today = new Date();
				var min = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60;
				var sec = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / 1000) % 60 % 60;
				var me = this;

				if ((this.tl - today) > 0) {
					timer = this.addZero(min) + ':' + this.addZero(sec);
					this.currentTime = timer;
					this.elem.innerHTML = timer;
					this.tid = setTimeout(function() {
						me.countDown();
					}, 500);
				} else {
					this.elem.innerHTML = '&#8734;';
					return;
				}
			};
			this.addZero = function(num) {
				return ('0' + num).slice(-2);
			};
			this.getTime = function () {
				return this.currentTime;
			}

			this.initialize.apply(this, arguments);
			this.currentTime;
		};

		this._setTime = function (self) {
			var time = document.querySelector('[data-id="time"]'),
				tlp = new Date(),
				tl = +tlp + 12 * 60 * 1000,
				timer = new this.Timer(time, tl);

			if (!time) {
				return;
			}

			timer.countDown();
			this.currentTime = timer.getTime();
		};

		this._templating = function (data) {
			var head = Views.templates.headFormTest(data),
				content = Views.templates.containerFormTest(data[this.variant][this.currentQuest]),
				view = Views.templates.view(),
				oldElem = document.querySelector('[data-test]');

			if (oldElem) {
				document.body.replaceChild($.parseHTML(this._setTemplate(view, {"head": head, "content": content}))[0], oldElem)
			} else {
				document.body.insertAdjacentHTML('beforeEnd', this._setTemplate(view, {"head": head, "content": content}));
			}
		};

		this._newTestTempalte = function (data, callback) {
			var newTest = document.querySelector('[data-test-window]'),
				head = newTest.querySelector('.form__head'),
				container = newTest.querySelector('.form__container'),
				headContent = Views.templates.headFormTest(data),
				containerContent = Views.templates.containerFormTest(data[this.variant][this.currentQuest]);

			if (!newTest) {
				return;
			}

			head.outerHTML = headContent;
			container.outerHTML = containerContent;

			callback($(newTest), function () {
				return data;
			});
		};

		this._nextTestTemplate = function (data) {
			var workField = document.querySelector('[data-test-window]'),
				content, test;

			if (!workField) {
				return;
			}

			if (this.currentQuest == 24 && Object.keys(this.result[this.data.number][this.variant]).length >= 13) {
				this._successTempalte({
					"number": this.data.number, 
					"level": this.data.level, 
					"result": Object.keys(this.result[this.data.number][this.variant]).length
				}, this.animationOpenPage);
			} else if (this.currentQuest == 24) {
				this._errorTempalte({ 
					"level": this.data.level, 
					"result": Object.keys(this.result[this.data.number][this.variant]).length
				}, this.animationOpenPage);
			}

			this.currentQuest += 1;

			workField.querySelector('.form__container').outerHTML = Views.templates.containerFormTest(data[this.variant][this.currentQuest]);
		};

		this._successTempalte = function (data, callback) {
			var success = document.querySelector('[data-test-onsucces]'),
				content = Views.templates.success(data);

			if (!success) {
				return;
			}

			success.querySelector('[data-id="success"]').innerHTML = content;

			if (Object.keys(this.result).length === 4) {
				this._replaceBtnSuccess($(success));
			}

			callback($(success), function () {
				return data;
			});
		};

		this._replaceBtnSuccess = function (elem) {
			if (!elem) {
				return;
			}

			elem.find('[data-test-open]')[0].outerHTML = '<a href="" class="btn__enroll btn__type-2" data-test-review><span>Запись на собеседование</span></a>';

			return elem;
		};

		this._errorTempalte = function (data, callback) {
			var error = document.querySelector('[data-test-onerror]'),
				content = Views.templates.error(data);

			if (!error) {
				return;
			}

			error.querySelector('[data-id="error"]').innerHTML = content;
			callback($(error), function () {
				return data;
			});
		};

		this._load = function (callback) {
			var url = this._getUrlFile(),
				self = this;

			var importData = fetch(url, {
				method: 'GET'
			});

			importData.then(function (data) {
				return data.json();
			})
			.then(function (res) {
				if (!self.data) {
					self.data = undefined;
				}

				return self.data = res;
			})
			.then(function (data) {
				self.setTableData(data);
				self._random();

				if (!self.currentQuest || self.currentQuest >= 1) {
					self.currentQuest = 0;
				}

				if (self.statusTest() === 'resolve') {
					self._newTestTempalte(self._headsFormsTest, self.animationOpenPage);
				} else {
					self._templating(self._headsFormsTest);
				}
			})
			.then(function () {
				if (!callback || !(callback instanceof Function)) {
					return;
				}

				callback();
			});

			return importData;

		};

		this.setTableData = function (data) {
			if (!data || !(data instanceof Object)) {
				return;
			}

			if (!this._headsFormsTest) {
				this._headsFormsTest = {};
			}

			for (var key in data) {
				if (!data.hasOwnProperty(key.toString())) {
					return;
				}

				this._headsFormsTest[key] = data[key];
			}
		};

		this._random = function () {
			var random = Math.floor(Math.random() * (4)) + 1,
				value;

			switch (random) {
				case 1: value = 'B';
				break;
				case 2: value = 'A';
				break;
				case 3: value = 'C';
				break;
				case 4: value = 'D';
				break;
			}

			if (!this.variant) {
				this.variant = '';
			}

			this.variant = value;
		}
	}

	var test = new Test({
		url: '/prod/test/data/',
		levels: [
			'elementary',
			'pre-intermediate',
			'intermediate',
			'upper-intermediate'
		],
		tempalte: '/prod/test/templates/view.html',
		time: 12
	});

	test.init();
}) ();