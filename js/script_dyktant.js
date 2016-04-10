$(document).ready(function () {

    exersice.init();

    $('#detect_exercise').click(function () {

        exersice.verify_answer();

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
    load_all_exersice: function () {
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
                    //exersice.ajaxPreload(jQuery('.exercies_one'),true);
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

    //--------------- show now quetions --------------------
    show_now_quetions: function (index_now) {

        $('.body_text > span').each(function (i) {

            var answers_variant = '';
            var def = $(this).text();
            if(answers[i]){
                var one_answers = answers[i].split('|');

                answers_variant += '<select class="cs-select cs-skin-elastic">' + '<option value="' + def + '" disabled>' + def + '</option>';

                for (var j = 0; j < one_answers.length; j++) {
                    answers_variant += '<option value="' + one_answers[j] + '">' + one_answers[j] + '</option>';
                }

                answers_variant += '</select>';

                //console.info(answers_variant);
                $(this).html(answers_variant);

            }

        });


        (function () {
            [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function (el) {
                new SelectFx(el);
            });
        })();

//        $('.cs-options').each(function(){
//            //console.info($(this).width());
//            $(this)
//                .css(exersice.getPosition(this,200), 0)
//            ;
//        });

        $('.body_text').show(700,function(){
            exersice.ajaxPreload(jQuery('.exercies_one'), false);
            $("#detect_exercise").show();
            $(".icon-fb").show();
        });

    },

    //----------------- verify answer --------------------
    verify_answer: function (index_now) {

        if ($('.cs-selected').length === num.length) {

            $('.body_text > span').each(function (i) {

                var num_answer = $('li', this).index($('.cs-selected', this));
                var right_answer = correct[i];

                if (num_answer == right_answer) {
                    $('.cs-placeholder', this).css('background-color','#7cc576');
                    $('.cs-placeholder', this).css('color','#fff');
                    sum_correct++;
                } else {
                    $('.cs-placeholder', this).css('background-color','#D9534F');
                    $('.cs-placeholder', this).css('color','#fff');
                }

                $(this).addClass('show_rule');

                $('cs-options', this).css('display','none!important');

                //console.info(right_answer, $('li', this).index($('.cs-selected', this)));

                $(this).append('<div class="explanation">' + explanation[i] + '</div>');



            });

//            var testV = function(){
//                $('.body_text > span').each(function (i) {
//
//                    $('li', this).each(function(i){
//                        if(i == 0){
//                            $(this).addClass('cs-selected');
//                        }
//                    });
//
//                });
//            };


            $('span.show_rule').hover(function () {
                clearTimeout($.data(this, 'timer'));
                $('.explanation', this).stop(true, true).slideDown(200);

                var _el = $('.explanation', this);
                var _wWindow = $(window).width();
                var _wLeftOf = $(this).offset().left;
                var _wElement = 240;

                if(_wWindow - _wLeftOf > _wElement){
                    _el.css('left',0);
                }
                else if(_wLeftOf > _wElement){
                    _el.css('right',0);
                }
                else{
                    _el.css('left', -(_wLeftOf+10) );
                }

                //console.info(_wWindow - _wLeftOf, _wElement);

                //$('.explanation', this)
                //    .css(exersice.getPosition(this, 360), 0)
                //;
            }, function () {
                $.data(this, 'timer', setTimeout($.proxy(function () {
                    $('.explanation', this).stop(true, true).slideUp(200);
                }, this), 100));
            });

            exersice.show_result();

        }
        else {
            AjaxForm.Message.error("Заповніть, будь ласка, всі поля!");
            //alert("Заповніть, будь ласка, всі поля!")
        }

    },

    // ----------------- get position -----------------------
    getPosition: function(el, width_el){

        var _window = $(window);
        var _widthOfWindow = _window.width();
        var _widthDifferenceFromXaxisOfRef = _widthOfWindow - $(el).offset().left;
        var position_where = '';

        if(_widthDifferenceFromXaxisOfRef < width_el){
            position_where = 'right';
        }
        else{
            position_where = 'left';
        }

        return position_where;
    },

    //------------------ show result ------------------------
    show_result: function () {
        var id = $("#id-resourse").attr("data-id");
        $.ajax({
            url: '/ajax',
            type: "POST",
            data: {
                action: 'exercies_one_verify',
                points: sum_correct,
                id: id
            },
            dataType: "text",
            timeout: 30000,
            cache: false,
            beforeSend: function () {
                //$(".middle").html('');
                exersice.ajaxPreload(jQuery('.exercies_one'), true);
                //$(".middle").animate({opacity: 'hide'}, 600);

            },
            success: function (answer) {
                exersice.ajaxPreload(jQuery('.exercies_one'), false);
                $('#result > .right').text(sum_correct);
                $('#result > .all').text(num.length);
                $('.result').show();
                $('#detect_exercise').hide();
                $('.yet').show();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$("#loading").text(textStatus);
            }
        });

    },

    //ajaxPreload
    ajaxPreload: function (target, action) {
        if (action === true) {
            jQuery('#ajax_loader').remove();
            target
                .css('position', 'relative')
                .prepend('<div id="ajax_loader">' + '<div class="spinner">' + '  <div class="spinner-container container1">' + '	<div class="circle1"></div>' + '	<div class="circle2"></div>' + '	<div class="circle3"></div>' + '	<div class="circle4"></div>' + '  </div>' + '  <div class="spinner-container container2">' + '	<div class="circle1"></div>' + '	<div class="circle2"></div>' + '	<div class="circle3"></div>' + '	<div class="circle4"></div>' + '  </div>' + '  <div class="spinner-container container3">' + '	<div class="circle1"></div>' + '	<div class="circle2"></div>' + '	<div class="circle3"></div>' + '	<div class="circle4"></div>' + '  </div>' + '</div>	'

                    + '</div>');
            jQuery('#ajax_loader')
                .css({
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'z-index': 500,
                    'width': target.width() - 20 + 'px',
                    'height': target.height() + 'px',
                    'opacity': 0.7
                });
            //console.log(target.height());
        } else {
            jQuery('#ajax_loader').remove();
        }
    },

    init: function () {
        exersice.load_all_exersice();
        $('#result').hide();
        $('#yet').hide();

        $("#yet").click(function(){
            location.reload();
        });

        $("#share").click(function(){
            fb_share_exer();
            return false;
        });
    }

};

function fb_share_exer() {
    var data_url = 'http://ukr-mova.in.ua/' + $('#data_input').attr('data_url');
    FB.ui({
        method: 'feed',
        link: data_url,
        name: "Мій результат: " + sum_correct + "/" + num.length + ". Перевір себе!",
        caption: '',
        description: $('#data_input').attr('data_descript'),
        picture: 'http://ukr-mova.in.ua/' + $('#data_input').attr('data_img')
    }, function (response) {
        //console.log('url', data_url);
        if (response != null) {
            AjaxForm.Message.success("Ви успішно поділились результатом проходження вправи!");
        } else {
            AjaxForm.Message.error("Помилка під час SHARE :(");
        }
    });

}


