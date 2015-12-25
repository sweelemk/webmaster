$(document).ready(function () {
	//popups
	(function() {
		var gallery = $('.card__container');
			items = gallery.find('.card__item[rel]');
		items.fancybox({
			padding: 0,
			type:'inline',
			scrolling: 'visible',
			autoHeight: true,
			margin: [50, 10, 10, 10],
			tpl: {
				closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><svg viewBox="0 0 100.4 101" xmlns="http://www.w3.org/2000/svg"><g><path id="svg_3" d="m70.949997,29.77034c-0.781006,-0.781998 -2.047005,-0.781998 -2.828003,0l-17.954998,17.957001l-17.954998,-17.957001c-0.780998,-0.781998 -2.047001,-0.781998 -2.827999,0c-0.781002,0.781002 -0.781002,2.047001 0,2.828003l17.954998,17.956997l-17.954998,17.957005c-0.781002,0.779999 -0.781002,2.047005 0,2.828003c0.390999,0.389999 0.902,0.584999 1.413998,0.584999s1.023003,-0.195 1.414001,-0.584999l17.954998,-17.956005l17.954998,17.956005c0.390999,0.389999 0.902,0.584999 1.414001,0.584999s1.023003,-0.195 1.414001,-0.584999c0.780998,-0.780998 0.780998,-2.048004 0,-2.828003l-17.954998,-17.957005l17.954998,-17.956997c0.781998,-0.780003 0.781998,-2.047001 0,-2.828003zm-20.783001,-29.344997c-27.641998,0 -50.128998,22.487 -50.128998,50.126999c0.002,27.643002 22.491003,50.131001 50.133003,50.131001c27.638996,0 50.124996,-22.488998 50.124996,-50.131001c0,-27.639999 -22.487,-50.126999 -50.129002,-50.126999zm0.004005,96.259007l-0.002007,0c-25.434996,0 -46.128995,-20.695007 -46.130997,-46.131008c0,-25.434998 20.693001,-46.126998 46.128998,-46.126998s46.129009,20.693002 46.129009,46.126998c-0.000008,25.435001 -20.69101,46.131008 -46.125004,46.131008z"/></g></svg></a>',
				next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span><svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M129.6,512c-4.1,0-8.1-1.6-11.1-4.8c-5.7-6.1-5.4-15.7,0.8-21.5l241.2-224.5L119,26.1  c-6-5.9-6.1-15.5-0.3-21.5c5.9-6,15.5-6.1,21.5-0.3L393,250.5c3,2.9,4.7,6.9,4.6,11.1c-0.1,4.2-1.8,8.1-4.8,10.9L139.9,507.9  C137,510.7,133.3,512,129.6,512z"/></svg></span></a>',
				prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span><svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M382.5,512c-3.7,0-7.4-1.3-10.3-4.1L119.2,272.5c-3-2.8-4.8-6.8-4.8-10.9c-0.1-4.2,1.6-8.2,4.6-11.1  L371.9,4.3c6-5.8,15.6-5.7,21.5,0.3c5.8,6,5.7,15.6-0.3,21.5L151.6,261.2l241.2,224.5c6.1,5.7,6.5,15.3,0.8,21.5  C390.6,510.4,386.5,512,382.5,512z"/></svg></span></a>'
			},
			afterLoad: function() {
				//$('html').addClass('space')
			},
			afterClose: function() {
				//$('html').removeClass('space')
			}
			//arrows: false
			// helpers: {
			// 	title: {
			// 		type: 'inside'
			// 	},
			// 	buttons: {
			// 		tpl: '<div id="fancybox-buttons"><ul style="width:132px"><li><a class="btnPrev" title="Previous" href="javascript:;"></a></li><li><a class="btnNext" title="Next" href="javascript:;"></a></li></ul></div>'
			// 	}
			// }
		});
	})();
	

	//tab
	(function(){
		$(".js-tab-nav").each(function(){
			var tab_link = $(this).find("a"),
				tab_item = $(this).find("li"),
				index = tab_link.data("href"),
				parents = $(this).parents(".js-tab-group"),
				tab_cont = parents.find(".js-tab-cont");
				subm = parents.next();

			tab_link.on("click", function() {
				var index = $(this).data("href");
				var activeTab = $(this).parents(".js-tab_group").find("."+index);
				tab_item.removeClass("is-active");
				$(this).parent().addClass("is-active");
				tab_cont.fadeOut(0).removeClass('visible');
				setTimeout(function(){
        	   		parents.find("."+index).addClass('visible')
        		}, 10);
				parents.find("."+index).show();
				return false;
			});
			tab_item.first().addClass("is-active");
			parents.find("."+index).show();
			setTimeout(function(){
        	   		parents.find("."+index).addClass('visible')
        	}, 10);
		});
	})();

	//FOCUS / BLUR POPUP INPUTS
	(function(){
		var parent = $('.field'),
			input = parent.find('.input');

		input.each(function(){
			var this_ = $(this);

			this_.on('focus', function(){
				$(this).parent().addClass('field-filled');
			});
			this_.on( 'blur', function(){
				if($(this).val() === ''){
					$(this).parent().removeClass('field-filled');
				}				
			});

		});
	})();

	//AUTO RESIZE TEXTAREA
	(function(){
		var textarea = $('textarea.input');

		autosize(textarea);

	})();

	//multi-select
	(function(){
		var select = $('.select');

		select.multipleSelect({
			single: true,
			placeholder: "Выберите удобное время"
		});

	})();

	//POPUP INIT

	(function(){
		var duration = 250,
			popupSelector = $('.popup__wrap'),
			innerSelector = $('.popup'),
			html = $('html');
		
		$('.js-popup-link').on('click', function(event){
			if(!$(this).hasClass('.js-popup-data')){
				//tabs();
				$('.popup').find('.tab__list').find('li').first().addClass('is-active');
				$('.popup').find('.tab__menu-container').find('.tab-item').first().find('label:first-child input').prop('checked', true);
			}
			var popup = $(this).data('href');

			html.addClass('space');

			$('.'+popup).fadeIn({
				duration: duration,
				complete: function(){
					$(this).addClass("is-visible");
				}
			});
			event.stopPropagation();
		});

		$(".popup").on("click", function(event){
			event.stopPropagation();
		});

		$(".popup__close, .sucess__close, .popup__wrap").on("click", function(){

			resetTabs();

			if(!popupSelector.hasClass('is-visible')) return;
			
			popupSelector
				.removeClass("is-visible")
				.delay(duration)
				.fadeOut({
					duration: duration,
					complete: function(){
						html.removeClass('space');
					}					
				});
	    });
	})();


	//tab menu
	function tabs(){
		$(".tab__list").each(function(){
			var tab_link = $(this).find("a"),
				tab_item = $(this).find("li"),
				index = tab_link.data("href"),
				parents = $(this).parents(".tab__menu"),
				tab_cont = parents.find(".tab-item");

			tab_link.on("click", function() {
				var index = $(this).data("href");
				var activeTab = $(this).parents(".tab__menu-container").find("."+index);
				tab_item.removeClass("is-active");
				$(this).parent().addClass("is-active");
				tab_cont.fadeOut(0).removeClass('visible');
				setTimeout(function(){
        	   		parents.find("."+index).addClass('visible');        	   		
        		}, 10);
				parents.find("."+index).show().find('label:first-child input').trigger('click');
				//tab_cont.find('label:first-child input').trigger('click');
				return false;
			});
			//if(!$(this).parent().hasClass('popup-checked')){
				tab_item.first().addClass("is-active");
				parents.find("."+index).show();
				setTimeout(function(){
	        	   		parents.find("."+index).addClass('visible')
	        	}, 10);
			//}
			// tab_item.first().addClass("is-active");
			// parents.find("."+index).show();
			// setTimeout(function(){
   //      	   		parents.find("."+index).addClass('visible')
   //      	}, 10);	
		});
	};
	tabs();

	function resetTabs() {
		$(".tab__list").each(function(){
			var this_ = $(this),
				tab_link = $(this).find("a"),
				tab_item = $(this).find("li"),
				index = tab_link.data("href"),
				parents = $(this).parents(".tab__menu"),
				tab_cont = parents.find(".tab-item");

			tab_cont.removeClass('visible').hide();

			setTimeout(function(){
				$('.popup').find('.tab__list').find('li').first().addClass('is-active').siblings().removeClass('is-active');
				$('.popup').find('.tab__menu-container').find('.tab-item').first().find('label:first-child input').trigger('click')//.prop('checked', true);
			}, 200);
			tabs();
		});
	};

	(function(){
		$('.js-popup-data').on('click', function(){
			var this_ = $(this),
				par = this_.parents('.form-data'),
				menu = par.find('.tab__list'),
				menuData = menu.find('.is-active').find('a').data('person'),
				cont = par.find('.tab__menu-container'),
				contData = cont.find('.visible').find('input:checked').data('days');

				//console.log('Person' + menuData, 'days' + contData)

				var tab = $('.popup-checked').find('a[data-person = "' + menuData +'-popup"]'),
					check = $('.popup-checked').find('#' + contData +'-popup'),
					checkVal = check.data('price'),
					select = $('.select__price').find('.price span');

				$('.popup-checked').find('input').prop('checked', false);
				//console.log(checkVal)
				tab.parent().addClass('is-active').siblings().removeClass('is-active');
				check.prop("checked",true).parents('.tab-item').addClass('visible').show().siblings().fadeOut(0).removeClass('visible');
				select.text(checkVal + ' бел.руб.');
		});

	})();

	(function(){
		var select = $('.popup-checked').find('.tab-item');

		select.each(function(){
			var this_ = $(this);
			
			this_.find('input').on('click', function(){
				var price = $(this).data('price');

				$(this).prop("checked",true).parents('.select__price').find('.price span').text(price + ' бел.руб.');
			})
		});

	})();

	function validate() {
		$('.js-validate').each(function(){
			if ($(this).length > 0) {
				$(this).validate({
					submitHandler: function(form) {
						ajaxSubmit(form);
					},
					errorClass: 'has-error',
					rules: {
						username: {
							minlength: 2
						},
						usersurname: {
							minlength: 2
						},
						username1: {
							minlength: 2
						},
						usersurname1: {
							minlength: 2
						},
						username2: {
							minlength: 2
						},
						usersurname2: {
							minlength: 2
						},
						password: {
							minlength: 5
						},
						mobile: {
							minlength: 5
						},
						password1: {
							minlength: 5
						},
						mobile1: {
							minlength: 5
						},
						password2: {
							minlength: 5
						},
						mobile2: {
							minlength: 5
						},
						confirm_password: {
							minlength: 5,
							equalTo: '#password'
						},
						email: {
							email: true
						},
						email1: {
							email: true
						},
						email2: {
							email: true
						},
						tel: {
							minlength: 2,
						},
						address: {
							minlength: 2
						},
						address1: {
							minlength: 2
						},
						address2: {
							minlength: 2
						},
						message: {
							minlength: 4
						},
						field: {
							required: true
						},
						home: {
							minlength: 1
						},
						apartment: {
							minlength: 1
						},
						home1: {
							minlength: 1
						},
						apartment1: {
							minlength: 1
						},
						home2: {
							minlength: 1
						},
						apartment2: {
							minlength: 1
						}
					}
				});
			}
		});
	}
	validate();

	$(".js-btn-submit").on("click", function(){
		var form = $(this).parents(".js-validate");
		var steps = $('.popup__wrap');
		var step = $('.popup__wrap[data-step="'+$(this).attr("data-step")+'"]');
		var check = $(this).parents('.form__cover').find('.tab-item.visible').find(':checked').data('days');
		var price = $(this).parents('.form__cover').find('.tab-item.visible').find(':checked').data('price');
		var tab = $(this).parents('.form__cover').find('.tab__list .is-active').find('a').data('person');
		var contPrice = $('.form__cover').find('.select__price').find('.price span');


		if (form.valid()) {
			steps.removeClass("is-visible").fadeOut();
			step.fadeIn(200).addClass('is-visible');
			step.find('.tab__list').find('a[data-person="'+tab+'"]').parent().addClass('is-active').siblings().removeClass('is-active').addClass('no-active');
			step.find('.tab__menu-container').find('input[data-days="'+check+'"]').parents('.tab-item').show().addClass('visible').siblings().removeClass('visible').hide().addClass('no-active');
			step.find('.tab__menu-container').find('input[data-days="'+check+'"]').prop("checked",true).parents('.tab__menu-container').find('input:not(:checked)').prop("disabled", true);
			contPrice.text(price + 'бел.руб.')
			return false;
		}
		else {
			return false;
		}
	});

	$(".js-prev-step").on("click", function(){
		if ($(this).parent().hasClass("is-active") && !$(this).parent().hasClass("is-current")) {
			var steps = $('.popup__wrap');
			var step = $('.popup__wrap[data-step="'+$(this).attr("data-step")+'"]');
			steps.removeClass("is-visible").fadeOut();
			step.fadeIn(200).addClass("is-visible");
			return false;
		}
		return false;
	});

	(function(){
		$('a[data-scroll]').click(function(){
			var idscroll = $(this).data('scroll');
			$.scrollTo(idscroll, 1000);
			return false;
		});
	})();

	(function(){

		var insta = $('.insta');

		insta.each(function(){
			var this_ = $(this),
				attr = this_.attr('id');

			console.log(attr)

			var feed = new Instafeed({
				clientId: '97ae5f4c024c4a91804f959f43f2635f',
				target: attr,
				get: 'tagged',
				tagName: 'photographyportfolio',
				links: true,
				limit: 16,
				sortBy: 'random',
				resolution: 'thumbnail',
				after: function(){
					if(attr === 'instafeed-mobile') {
						slickInit();
					}
					
				},
				template: '<div class="photo-box"><div class="image-wrap"><a href="{{link}}"><img src="{{image}}"></a></div></div>'
			});
			feed.run();

			$('.btn__sync').on('click', function () {
				$('#instafeed-desktop').empty();
				$('#instafeed-mobile').slick('unslick');
				feed.run();
			});

		});		

	})();

	function slickInit() {
		
		var cont = $('.arrow__slider'),
			slider = $('#instafeed-mobile'),
			next = cont.find('.arrow__next'),
			prev = cont.find('.arrow__prev');

		slider.slick({
			slidesToShow: 2,
			slidesToShow: 2,
			rows: 2,
			arrows: false
		});

		next.on('click', function(){
			slider.slick('slickNext');
		});

		prev.on('click', function(){
			slider.slick('slickPrev');
		});
	}

	//padding header 
	var fixed = function(){
		var header = $('.header').innerHeight(),
			preview = $('.preview');
		if (window.innerWidth && parseInt(window.innerWidth) <= 1023) {
			preview.css('margin-top', 0);
		} else {
			preview.css('margin-top', header);
		}
	};
	fixed();

	window.addEventListener('resize', function(){
		fixed();
	});


	//toggle  menu mobile
	(function(){
		var btnOpen = $('.js-btn-open'),
			btnClose = $('.js-close'),
			menuMobile = $('.mobile-navi'),
			html = $('html'),
			link = menuMobile.find('a[data-scroll]');

		btnOpen.on('click', function(){
			menuMobile.addClass('is-visible');
			html.addClass('space');
		});
		btnClose.on('click', function(){
			menuMobile.removeClass('is-visible');
			html.removeClass('space');
		});
		link.on('click', function(){
			setTimeout(function(){
				menuMobile.removeClass('is-visible');
				html.removeClass('space');
			},700);
		});
	})();

	//Form phone mask
	(function(){
		var mask = $('.js-phone');
		mask.each(function(){
			var this_ = $(this);

			this_.mask("+000 (00) 000 00 00");
		});
	})();
});