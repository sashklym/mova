$(document).ready(function(){

    $(function () {
        $.scrollUp({
            animation: 'fade',
            activeOverlay: '#00FFFF',
            scrollImg: { active: true, type: 'background' }
        });
    });

show_picters.init();

new WOW().init();

});

		$(document).keydown(function(e){
			if (e.which == 37) { // 37 is the left arrow key code.
				//alert('left');
				var id = ($('.prev_work div').attr('data-id'));
				//console.log(id);
				if(id !== undefined){
					show_picters.show_big(id);
					//alert(id);
				}

			};
			if (e.which == 39) { // 39 is the right arrow key code.
				var id = ($('.next_work div').attr('data-id'));
				//console.log(id);
				if(id !== undefined){
					show_picters.show_big(id);
					//alert(id);
				}
			};

		});

var show_picters = {

	// ************* show big picters ***********
	show_big: function(id){
                $.ajax({
                    url: '/ajax',
                    type: "POST",
                    data: { action: 'one_resource', id: id, field: 'listings_galleries' },
                    dataType: "html",
                	timeout: 30000,
					cache:false,
                    beforeSend: function (){
						//$(".middle").html('');
						show_picters.ajaxPreload(jQuery('.one'),true);
						//$(".middle").animate({opacity: 'hide'}, 600);
                        //$("body").css({"overflow":"hidden"});

                    },
                    success: function (answer){
						$(".one").animate({opacity: '0'}, 600, 'swing', function(){
							$(".one").html(answer);
							$(".one").animate({opacity: '1'}, 1000);
							show_picters.init();
							var data_title = $('#data_input').attr('data_title');
							var data_pagetitle = $('#data_input').attr('data_pagetitle');
							var data_url = $('#data_input').attr('data_url');

							history.pushState(null,"title",data_url);
                            $('.breadcrumb .active').text(data_pagetitle);
							$("title").text(data_title);
                            $("body").css({"overflow":"auto"});
						});

                	},
                	error: function (XMLHttpRequest, textStatus, errorThrown){
                	    //$("#loading").text(textStatus);
                	}
                });
	},

        //ajaxPreload
        ajaxPreload: function(target,action){
                if(action===true){
                        jQuery('#ajax_loader').remove();
                        target
                        .css('position','relative')
                        .prepend('<div id="ajax_loader">'
							+'<div class="spinner">'
							+'  <div class="spinner-container container1">'
							+'	<div class="circle1"></div>'
							+'	<div class="circle2"></div>'
							+'	<div class="circle3"></div>'
							+'	<div class="circle4"></div>'
							+'  </div>'
							+'  <div class="spinner-container container2">'
							+'	<div class="circle1"></div>'
							+'	<div class="circle2"></div>'
							+'	<div class="circle3"></div>'
							+'	<div class="circle4"></div>'
							+'  </div>'
							+'  <div class="spinner-container container3">'
							+'	<div class="circle1"></div>'
							+'	<div class="circle2"></div>'
							+'	<div class="circle3"></div>'
							+'	<div class="circle4"></div>'
							+'  </div>'
							+'</div>	'

							+'</div>');
                        jQuery('#ajax_loader')
                        .css({
                                'position': 'absolute',
                                'left': 0,
                                'top': 0,
                                'z-index': 500,
                                'width': target.width()-20+'px',
                                'height': target.height()+'px',
                                'opacity': 0.7
                        });
                        //console.log(target.height());
                }else{
                        jQuery('#ajax_loader').remove();
                }
        },

	init: function(){

				show_picters.ajaxPreload(jQuery('.works'),false);
                var type_page = $('#type_page').attr('data-type');
                if(type_page === 'works'){
                    $('.works img').css({'opacity':0});
                    show_picters.ajaxPreload(jQuery('.works'),true);
					setTimeout('show_picters.show_small()', 1300);

                }
				$('.show_big_pic, .next_work show_big_pic, .next_work show_big_pic').click(function(){

					var id = ($(this).attr('data-id'));
					show_picters.show_big(id);
				});

				$('#share-fb').on( 'click', fb_share );

	}

};

function fb_share() {
		var data_url = 'http://ukr-mova.in.ua/'+$('#data_input').attr('data_url');
		FB.ui({
			method: 'feed',
			link: data_url
		}, function(response){
		//console.log('url', data_url);
		  if (response != null){
			$.ajax({
				url: '/ajax',
				type: "POST",
				data: { action: 'add_points_share'},
				dataType: "text",
				timeout: 30000,
				cache:false,
				beforeSend: function (){

				},
				success: function (answer){
					AjaxForm.Message.success("Ви успішно поділились картинкою, вам + 5 смаколиків :)");
				},
				error: function (XMLHttpRequest, textStatus, errorThrown){
					AjaxForm.Message.error("Помилка під час SHARE картинки :(");
					//$("#loading").text(textStatus);
				}
			});


		  }
		  else {
				AjaxForm.Message.error("Помилка під час SHARE картинки :(");
		  }
		});

}

    function go_content() {

    // Smooth scroll

        var this_element = $('#name_go');
        $('html,body').animate({
            scrollTop: (this_element.length) ? this_element.offset().top : 0
        }, 1000);

    }










