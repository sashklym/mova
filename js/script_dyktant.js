$(document).ready(function(){

    exersice.init();

    (function() {
        [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
            new SelectFx(el);
        } );
    })();

    $('.next').click(function(){
        index_now ++;
        $('.answer_right').hide();
        $('.answer_wrong').hide();

        if(index_now >= num.length){
            exersice.show_result();
        }
        else{
            exersice.show_now_quetions(index_now);
        }

    });

//    $('span.show_rule .cs-select').click(function(){
//       return false;
//    });

	$('span.show_rule').hover(function () {
		clearTimeout($.data(this,'timer'));
		$('.explanation',this).stop(true,true).slideDown(200);
	}, function () {
		$.data(this,'timer', setTimeout($.proxy(function() {
			$('.explanation',this).stop(true,true).slideUp(200);
		}, this), 100));
	});

});

var num = [];
var questions = [];
var answers = [];
var correct = [];
var explanation = [];
var index_now = 0;
var sum_correct = 0;

var exersice = {

	// ************* load all quetions for exercices ***********
	load_all_exersice: function(){
	var id = $('#id-resourse').attr('data-id');
                $.ajax({
                    url: '/ajax',
                    type: "POST",
                    data: { action: 'exercies_one', id: id },
                    dataType: "text",
                	timeout: 30000,
					cache:false,
                    beforeSend: function (){
						//$(".middle").html('');
						exersice.ajaxPreload(jQuery('.exercies_one'),true);
						//$(".middle").animate({opacity: 'hide'}, 600);

                    },
                    success: function (answer){
                        //alert(answer);
                        if(answer == "У вас не достатня кількість смаколиків <br>для проходження вправи <br><a class='send_me' href='/lepetun-smakolyky'>Про смаколики</a>"){
                            $('.quetion').html(answer);
                            exersice.ajaxPreload(jQuery('.exercies_one'),false);
                        }
                        else{
                            exersice.ajaxPreload(jQuery('.exercies_one'),true);
                            index_now = 0;
                            var myObject = eval('(' + answer + ')');
                            for (i in myObject){
                               num [i] = myObject[i]["MIGX_id"];
                               questions [i] = myObject[i]["questions"];
                               answers [i] = myObject[i]["answers"];
                               correct [i] = myObject[i]["correct"];
                               explanation [i] = myObject[i]["explanation"];
                            }
                            //exersice.show_pagination();
                            exersice.show_now_quetions(0);
                        }
                	},
                	error: function (XMLHttpRequest, textStatus, errorThrown){
                	    //$("#loading").text(textStatus);
                	}
                });
	},

    show_pagination: function(){
        var number_step = '';
        for (var i = 0; i < num.length; i++) {
            id = parseInt(num[i]) - 1;
            number_step += '<li id="step'+id+'" data-id="'+id+'">'+num[i]+'</li>'
        }
        $('.number_step').html(number_step);
        $('.number_step').fadeIn();

    },

    //--------------- show now quetions --------------------
    show_now_quetions: function(index_now){


//		var this_element = $('#name_go_1');
//        $('html,body').animate({
//            scrollTop: (this_element.length) ? this_element.offset().top : 0
//        }, 1000);


        $('.body_text > span').each(function(i){

            var answers_variant = '';
            var one_answers = answers[i].split('|');

            for (var j = 0; j < one_answers.length; j++) {
                answers_variant +='<select class="cs-select cs-skin-elastic">'
                                        +'<option value="Будь-яке" disabled>Будь-яке</option>'
                                        +'<option value="Деревина" >Деревина</option>'
                                        +'<option value="Пелети" >Пелети</option>'
                                        +'<option value="Вугілля" >Вугілля</option>'
                                    +'</select>'
                                    +'<div class="explanation"></div>';
            }

            $(this).html(answers_variant);

        });




        exersice.ajaxPreload(jQuery('.exercies_one'),true);
        $(".block_quetion_variantu").animate({opacity: '0.1'}, 500, 'swing', function(){
            $('.quetion').html(questions[index_now]);
            $('.variantu').html(answers_variant);
            $(".block_quetion_variantu").animate({opacity: '1'}, 500, 'swing', function(){

            });
        });

        //console.log(index_now);

    },

    //--------------- show now after result --------------------
    show_after_result: function(index_now){

        var answers_variant = '';
        $('#step'+index_now+'').addClass('active_step_after');

        exersice.ajaxPreload(jQuery('.exercies_one'),true);
        $(".block_quetion_variantu").animate({opacity: '0.1'}, 500, 'swing', function(){
            $('.quetion').html(questions[index_now]);
            $('.variantu').html(answers_variant);
            $(".block_quetion_variantu").animate({opacity: '1'}, 500, 'swing', function(){
                exersice.ajaxPreload(jQuery('.exercies_one'),false);
                $('.info').html(explanation[index_now]);
                $('.answer_wrong').fadeIn(500);
            });
        });

    },

    //----------------- verify answer --------------------
    verify_answer: function(index_now){

//		var this_element = $('#name_go_2');
//        $('html,body').animate({
//            scrollTop: (this_element.length) ? this_element.offset().top : 0
//        }, 1000);

        $('.info').html('');
        if($('input[name=radio]:checked').length > 0){
            $('#verify').hide();
            num_answer = $('input[name=radio]:checked').val();
            right_answer = correct[index_now];
            if(num_answer == right_answer){
                $('.answer_right').fadeIn();
                $('#step'+index_now+'').addClass('right_step');
                $('#step'+index_now+'').removeClass('active_step');
                sum_correct ++;
            }
            else{
                $('.answer_wrong').fadeIn(500);
                $('.info').html(explanation[index_now]);
                $('#step'+index_now+'').removeClass('active_step');
                $('#step'+index_now+'').addClass('wrong_step');
            }
        }
        else{
            alert("Виберіть один із варіантів!")
        }

    },

    //------------------ show result ------------------------
    show_result: function(){
        var id = $("#id-resourse").attr("data-id");
        $.ajax({
            url: '/ajax',
            type: "POST",
            data: { action: 'exercies_one_verify', points: sum_correct, id:id  },
            dataType: "text",
            timeout: 30000,
            cache:false,
            beforeSend: function (){
                //$(".middle").html('');
                exersice.ajaxPreload(jQuery('.exercies_one'),true);
                //$(".middle").animate({opacity: 'hide'}, 600);

            },
            success: function (answer){
                //alert(answer);
                exersice.ajaxPreload(jQuery('.exercies_one'),false);
                $('.man').hide();
                $('.quetion').html('Всього правильних відповідей &ndash; '+sum_correct);
                $('.variantu').html('');
                $('.end_exercise').fadeIn();
                if(sum_correct >=8){
                    $('.man_yes').fadeIn();
                }
                else if(sum_correct >3){
                    $('.man_middle').fadeIn();
                }
                else{
                    $('.man_negative').fadeIn();
                }

                $('#share-fb_exer').on( 'click', fb_share_exer);

                $('.number_step li').click(function(){
                    $('.man').hide();
                    $('.next').hide();
                    $('.buttons .next').show();
                    var id = $(this).attr('data-id');
                    exersice.show_after_result(id);

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
		exersice.load_all_exersice();
	}

};

function fb_share_exer() {
		var data_url = 'http://ukr-mova.in.ua/'+$('#data_input').attr('data_url');
		FB.ui({
			method: 'feed',
			link: data_url,
            name: "Мій результат: "+sum_correct+"/"+num.length+". Перевір себе!",
            caption: 'UKR-MOVA.IN.UA | Мова – ДНК націЇ',
            description: $('#data_input').attr('data_descript'),
            picture: 'http://ukr-mova.in.ua/'+$('#data_input').attr('data_img')
		}, function(response){
		//console.log('url', data_url);
		  if (response != null){
			AjaxForm.Message.success("Ви успішно поділились результатом проходження вправи!");
		  }
		  else {
				AjaxForm.Message.error("Помилка під час SHARE :(");
		  }
		});

}
