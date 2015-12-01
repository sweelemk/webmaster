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
});