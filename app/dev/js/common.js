$(document).ready(function () {
	//popups
	(function() {
		var gallery = $('.card__container');
			items = gallery.find('.card__item[rel]');
		items.fancybox({
			padding: 0,
			type:'inline',
			scrolling: 'visible',
			margin: [100, 50, 50, 100],
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
		var duration = 500,
			popupSelector = $('.popup__wrap'),
			innerSelector = $('.popup'),
			html = $('html');
		
		$('.js-popup-link').on('click', function(event){
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

		$(".popup__close, .popup__wrap").on("click", function(){	
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
	(function(){
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
        	   		parents.find("."+index).addClass('visible')
        		}, 10);
				parents.find("."+index).show();

				return false;
			});
			if(!$(this).parent().hasClass('popup-checked')){
				tab_item.first().addClass("is-active");
				parents.find("."+index).show();
				setTimeout(function(){
	        	   		parents.find("."+index).addClass('visible')
	        	}, 10);
			}
			// tab_item.first().addClass("is-active");
			// parents.find("."+index).show();
			// setTimeout(function(){
   //      	   		parents.find("."+index).addClass('visible')
   //      	}, 10);	
		});
	})();

	(function(){
		$('.js-popup-data').on('click', function(){
			var this_ = $(this),
				par = this_.parents('.form-data'),
				menu = par.find('.tab__list'),
				menuData = menu.find('.is-active').find('a').data('person'),
				cont = par.find('.tab__menu-container'),
				contData = cont.find('.visible').find('input:checked').data('days');

				console.log('Person' + menuData, 'days' + contData)

				var tab = $('.popup-checked').find('a[data-person = "' + menuData +'-popup"]'),
					check = $('.popup-checked').find('#' + contData +'-popup'),
					checkVal = check.data('price'),
					select = $('.select__price').find('.price span');

				$('.popup-checked').find('input').attr('checked', false);
				console.log(checkVal)
				tab.parent().addClass('is-active').siblings().removeClass('is-active');
				check.attr("checked",true).parents('.tab-item').show().siblings().fadeOut(0);
				select.text(checkVal + ' бел.руб.');
		});

	})();

	(function(){
		var select = $('.popup-checked').find('.tab-item');

		select.each(function(){
			var this_ = $(this);
			
			this_.find('input').on('change', function(){
				var price = $(this).data('price');

				$(this).parents('.select__price').find('.price span').text(price + ' бел.руб.');
			})
		});

	})();

	function validate() {
		$('.js-validate').each(function(){
			if ($(this).length > 0) {
				$(this).validate({
					submitHandler: function(form) {
						//ajaxSubmit(form);
					},
					errorClass: 'has-error',
					rules: {
						username: {
							minlength: 2
						},
						usersurname: {
							minlength: 2
						},
						password: {
							minlength: 5
						},
						mobile: {
							minlength: 5
						},
						confirm_password: {
							minlength: 5,
							equalTo: '#password'
						},
						email: {
							email: true
						},
						tel: {
							minlength: 2,
						},
						address: {
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
			if (form.valid()) {
				steps.removeClass("is-visible").hide();
				step.addClass('is-visible').show();
				return false;
			}
			else {
				return false;
			}
		});
});