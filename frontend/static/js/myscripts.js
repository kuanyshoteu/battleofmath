
    

    $('.register-btn').click(function(e) {
        url = '/api/register/'
        name = $('.new_name').val()
        phone = $('.new_username').val()
        mail = $('.new_mail').val()
        new_password = $('.new_password').val()
        new_password2 = $('.new_password2').val()
        console.log(name, phone, mail)
        if (name.length > 0 && phone.length > 0 && mail.length > 0 && new_password.length > 0 && new_password==new_password2) {        
            $.ajax({
                url: url,
                data: {
                    'name':name,
                    'phone':phone,
                    'mail':mail,
                    'password1':new_password,
                    'password2':new_password2,
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data.res)
                    if (data.res == 'ok') {
                        $('.reg_wrong_phone').hide()
                        $('.reg_fill_all').hide()
                        $('.reg_wrong_pass').hide()
                        location.reload()
                    }
                    else if (data.res == 'second_user'){
                        $('.reg_wrong_phone').show()
                    }
                    else if (data.res == 'not_equal_password'){
                        $('.reg_wrong_pass').show()
                    }
                }
            })
        }
        else{
            $('.reg_fill_all').show()
        }
    });
    $('.login-btn').click(function(e) {
        url = '/api/login/'
        username = $('.username').val()
        password = $('.password').val()
        $('.wrong_login').hide('fast')
        $.ajax({
            url: url,
            data: {
                'username':username,
                'password':password
            },
            dataType: 'json',
            success: function (data) {
                if (data.res == 'login') {
                    $('.wrong_login').hide()
                    location.reload()
                }
                else if (data.res == 'error'){
                    $('.wrong_login').show('fast')
                }
            }
        })        
    });
    $('.dir_teach_chose').click(function(e) {
        $('.dir_teach_chose.chosen').removeClass('chosen')
        $(this).addClass('chosen')
        $('.dir_teach_check').hide()
        $(this).find('.check').show()
    })
    $('.sign_slogan').click(function(e) {
        $('.sign_slogan.chosen').removeClass('chosen')
        $(this).addClass('chosen')
        $('.slogan_check').hide()
        $(this).find('.check').show()
    })
    $('.register-btn2').click(function(e) {
        $('.reg_wrong_phone').hide()
        $('.reg_fill_all').hide()
        $('.reg_wrong_pass').hide()
        url = '/api/register/'
        name = $('.sign_dir_name').val()
        mail = $('.sign_mail').val()
        course = document.location.hash
        new_password = $('.sign_password').val()
        new_password2 = $('.sign_password2').val()
        if (name.length > 0 && mail.length > 0 && new_password.length > 0 && new_password == new_password2) {
            $(this).addClass('disabled')
            $('.next_step_load').show()
            $.ajax({
                url: url,
                data: {
                    'name':name,
                    'mail':mail,
                    'password1':new_password,
                    'password2':new_password2,
                    'course':course,
                },
                dataType: 'json',
                success: function (data) {
                    if (data.res == 'ok') {
                        window.location.replace('/');
                    }
                    else if (data.res == 'second_user') {
                        $('.register-btn2').removeClass('disabled')
                        $('.reg_wrong_phone').show()
                    }
                }
            })
        }
        else{
            $(this).removeClass('disabled')
            $('.reg_fill_all2').show()
        }
    });
    $('.update_pswd-btn').click(function(e) {
        url = '/api/update_pswd/'
        mail = $('.update_pswd_mail').val()
        $('.loading').show()
        $(this).addClass('disabled')
        $.ajax({
            url: url,
            data: {
                'mail':mail,
            },
            dataType: 'json',
            success: function (data) {
                if (data.ok) {
                    $('.wrong_mail_update_pswd').hide()
                    $('.ok_update_pswd').show()
                }
                else{
                    $('.wrong_mail_update_pswd').show()
                    $('.ok_update_pswd').hide()
                }
                $('.loading').hide()
            }
        })        
    });
    $('.reset_pswd').click(function(e) {
        url = '/api/reset_pswrd/'
        password1 = $('.reset_password1').val()
        password2 = $('.reset_password2').val()
        id = $(this).attr('id')
        $('.success_change_pswrd').hide()
        $.ajax({
            url: url,
            data: {
                'password1':password1,
                'password2':password2,
                'id':id,
            },
            dataType: 'json',
            success: function (data) {
                $('.success_change_pswrd').show()
            }
        })        
    });
  


    $(".open_group_details_urok").click(function (event) {
        event.preventDefault();
        var this_ = $(this)
        var table_id = '#' + this_.attr("id") + 'details_urok'
        $(table_id).fadeToggle();
    })
    $(".add_group_btn_urok").click(function (e) {
        e.preventDefault()
        var this_ = $(this)
        var squadUrl = this_.attr("data-href")
        if (squadUrl) {
            $.ajax({
                url: squadUrl,
                data: {
                    'topic_id':this_.attr("topic_id"),
                    'squad_id':this_.attr("squad_id"),
                    'isin':this_.attr("isin"),
                },
                success: function (data) {
                    if (this_.attr("isin") == 'yes') {
                        this_.css('background-color', '#F2F2F2')
                        this_.css('color', 'black')
                        this_.attr('isin', 'no')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").css('background-color', '#F2F2F2')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").css('color', 'black')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").attr('isin', 'no')

                        $('.' + this_.attr("topic_id") + this_.attr("squad_id") + 'squad_results_urok').hide()
                        $('.' + this_.attr("topic_id") + this_.attr("squad_id") + 'squad_results').hide()
                    }
                    else {
                        this_.css('background-color', '#5181b8')
                        this_.css('color', 'white')
                        this_.attr('isin', 'yes')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").css('background-color', '#5181b8')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").css('color', 'white')
                        $('#' + this_.attr("topic_id") + this_.attr("squad_id") + "add_group_btn").attr('isin', 'yes')

                        $('.' + this_.attr("topic_id") + this_.attr("squad_id") + 'squad_results_urok').show()
                        $('.' + this_.attr("topic_id") + this_.attr("squad_id") + 'squad_results').show()
                    }
                }, error: function (error) {
                    console.log('error')
                }

            })
        }
    })
    $(".task_answer").change(function () {
        var this_ = $(this)
        var pageUrl = this_.attr("data-href")
        var answer = $(this).val();
        if (pageUrl) {
            $.ajax({
                url: pageUrl,
                data: {
                    'id':this_.attr("id"),
                    'answer':answer
                },
                dataType: 'json',
                success: function (data) {
                    this_.attr('placeholder', answer);
                }
            });
        }
    });
    $(document).on("click", '.delete_task', function () {
        var this_ = $(this)
        var pageUrl = this_.attr("data-href")
        if (pageUrl) {
            $.ajax({
                url: pageUrl,
                data: {
                    'id':this_.attr("id"),
                },
                dataType: 'json',
                success: function (data) {
                    location.reload()
                }
            });
        }
    });
    $(".change_task").click(function () {
        var this_ = $(this)
        var pageUrl = this_.attr("data-href")
        id = this_.attr("id")
        topic_id = this_.attr("topic_id")
        var text = $('.change_task_textland' + topic_id).val()
        var cost = $('.change_task_costland' + topic_id).val()
        console.log(text, cost, $('.change_task_text' + topic_id))
        var answer = ""
        var variant = ""
        if( $(".task_type_" + topic_id).attr("type") == "input" ){
            answer = answer + document.getElementsByClassName('change_task_answer_land' + topic_id)[0].value + "&"
        }
        if( $(".task_type_" + topic_id).attr("type") == "test" ){
            for(var i = 0; i < document.getElementsByClassName("option_" + topic_id).length; i++){
                var old_variant = document.getElementsByClassName("option_" + topic_id)[i].getAttribute("value")
                variant = variant + document.getElementsByClassName("variant_value_"+topic_id +'v'+ old_variant)[0].value+"&"
                if(document.getElementsByClassName("option_" + topic_id)[i].checked){
                    answer = answer + document.getElementsByClassName("variant_value_"+topic_id +'v'+ old_variant)[0].value+"&"
                }
            }
        }

        if (pageUrl) {
            $.ajax({
                url: pageUrl,
                data: {
                    'id':id,
                    'text':text,
                    'cost':cost,
                    'answer':answer,
                    'variant':variant,
                },
                dataType: 'json',
                success: function (data) {
                    location.reload()
                }
            });
        }
    });
    $("#mobMenuBtn").click(function(){
        mobMenu = $("#mobMenu")
        if (mobMenu.hasClass("hidden")){
            mobMenu.removeClass("hidden")
        }
        else{
            mobMenu.addClass("hidden")
        }
    })