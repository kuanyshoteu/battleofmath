$('.change_lang_do').click(function(){url=$(this).parent().attr('url')
status=$(this).attr('status')
$.ajax({url:url,data:{'status':status,},dataType:'json',success:function(data){location.reload()}})})
$('.change_schooler_password').click(function(){url=$('.data').attr('change_schooler_password')
id=$('.data').attr('crnt_manager_id')
$('.schooler_new_password_load').show()
$('.change_schooler_password').addClass('disabled')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('.schooler_new_password').show()
$('.schooler_new_password').text(data.password)
$('.change_schooler_password').removeClass('disabled')
$('.schooler_new_password_load').hide()
$('.change_schooler_password_exp').show()}})})
$('.show_manager_data').click(function(){url=$('.data').attr('show_manager_data')
id=$(this).attr('id')
$('.manager_data').modal('show')
$('.data').attr('crnt_manager_id',id)
$('.schooler_new_password').hide()
$('.change_schooler_password_exp').hide()
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('.crnt_manager_name').text(data.name)
$('.manager_name_change').val(data.name)
$('.manager_phone_change').val(data.phone)
$('.manager_mail_change').val(data.mail)}})})
$('.delete_manager_show_modal').click(function(){parent=$(this).parent()
id=parent.find('.show_manager_data').attr('id')
name=parent.find('.manager_name').text()
$('.data').attr('crnt_manager_id',id)
$('.delete_manager_name').text(name)
$('.delete_manager_modal').modal('show')
console.log('xkxkxk')})
$('.delete_manager').click(function(){url=$('.data').attr('delete_manager')
id=$('.data').attr('crnt_manager_id')
$('.delete_manager').addClass('disabled')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('.show_manager_data'+id).addClass('textg')
$('.show_manager_data'+id).removeClass('textblue')
$('.show_manager_data'+id).find('.manager_status').text("доступен до "+data.end_work)
parent.find('.delete_manager').hide()
$('.managers_num_crnt').text(data.active_managers)
$('.delete_manager_modal').modal('hide')
$('.delete_manager').removeClass('disabled')}})})
$('.save_manager_data').click(function(){url=$('.data').attr('save_manager_data')
id=$('.data').attr('crnt_manager_id')
name=$('.manager_name_change').val()
phone=$('.manager_phone_change').val()
mail=$('.manager_mail_change').val()
$(this).addClass('disabled')
$('.save_manager_load').show()
$('.save_manager_check').hide()
$.ajax({url:url,data:{'id':id,'name':name,'phone':phone,'mail':mail,},dataType:'json',success:function(data){$('.show_manager_data'+id).text(name)
$('.save_manager_data').removeClass('disabled')
$('.save_manager_load').hide()
$('.save_manager_check').show()}})})
$('.get_full_version').click(function(e){e.stopPropagation()
$('.get_full_version_modal').modal('show')})
$('.free_trial').click(function(e){url=$(this).attr('url')
managers_num=$('.managers_num').val()
$('.connect_full_version').addClass('disabled')
$('.free_trial').addClass('disabled')
$('.no_free_trial').hide()
$('.get_tarif_load').show()
$.ajax({url:url,data:{'managers_num':managers_num,},dataType:'json',success:function(data){if(data.ok=='ok'||data.ok=='already'){location.reload();}
else{$('.no_free_trial').show()}
$('.connect_full_version').removeClass('disabled')
$('.free_trial').removeClass('disabled')
$('.get_tarif_load').hide()}})})
$('.connect_full_version').click(function(e){managers_num=$('.managers_num').val()
if(managers_num==undefined){managers_num=$('.managers_num_crnt').text()}
cost=parseInt(remove_spaces($('.tarif_cost').text()))
tarif_cost_input=$('.choose_tarif_input:checked').attr('id')
if(tarif_cost_input=='choose_tarif_6'){month='6'
description='Оплата за '+month+' месяцев подписки'}
else if(tarif_cost_input=='choose_tarif_1'){month='12'
description='Оплата за '+month+' месяцев подписки'}
else if(tarif_cost_input=='choose_tarif_2'){month='24'
description='Оплата за '+month+' месяцев подписки'}
show_vidget(month,managers_num,cost,description)})
$('.tarif_new_managers').click(function(e){month='0'
managers_num=$('.managers_num_tarif').val()
cost=parseInt(remove_spaces($('.new_managers_cost').text()))
desc2=' новых менеджеров'
if(managers_num==1){desc2=' нового менеджера'}
description='Оплата за '+managers_num+desc2
show_vidget(month,managers_num,cost,description)})
function remove_spaces(text){while(text.search(' ')>0){text=text.replace(' ','')}
return text}
function show_vidget(month,managers_num,cost,description){url=$('.show_vidget_url').attr('url')
$('.no_free_trial').hide()
$.ajax({url:url,data:{},dataType:'json',success:function(data){$('.get_tarif_load').hide()
publicId=data.publicId
invoiceId=data.invoiceId
accountId=data.accountId
var widget=new cp.CloudPayments();widget.charge({publicId:publicId,description:description,amount:cost,currency:'KZT',invoiceId:invoiceId,accountId:accountId,skin:"mini",data:{'month':month,'managers_num':managers_num,}})
if(month!='0'){$('.connect_full_version').removeClass('disabled')}}})}
$('.choose_tarif').click(function(){input=$(this).find('.choose_tarif_input')
$('.choose_tarif').each(function(){o_input=$(this).find('.choose_tarif_input')
o_input.prop('checked',false)})
input.prop('checked',true)
managers_num=$('.managers_num').val()
if(managers_num==undefined){managers_num=$('.managers_num_crnt').text()}
calc_tarif_cost(managers_num)})
$('.managers_num_tarif').on('change',function(){managers_num=$(this).val()
left_days=parseInt($('.tarif_left_days').text())/30
tarif_cost=(2500*left_days*managers_num).toFixed(0)
console.log($('.tarif_left_days').text(),left_days,managers_num)
tarif_cost=add_spaces_to_cost(tarif_cost)
$('.new_managers_cost').text(tarif_cost)})
$('.managers_num').on('change',function(){managers_num=$('.managers_num').val()
calc_tarif_cost(managers_num)})
function calc_tarif_cost(managers_num){managers_num=parseInt(managers_num)
tarif_cost_input=$('.choose_tarif_input:checked').attr('id')
discount_text=''
is_dot=true
if(tarif_cost_input=='choose_tarif_6'){tarif_cost=2500*6*managers_num}
else if(tarif_cost_input=='choose_tarif_1'){tarif_cost=2500*12*managers_num
tarif_cost=tarif_cost-tarif_cost*0.1
discount_text="со скидкой"}
else if(tarif_cost_input=='choose_tarif_2'){tarif_cost=2500*24*managers_num
tarif_cost=tarif_cost-tarif_cost*0.2
discount_text="со скидкой"}
if(tarif_cost<=0){tarif_cost=0
$('.connect_full_version').addClass('disabled')}
else{$('.connect_full_version').removeClass('disabled')}
if(is_dot){temp_str=add_spaces_to_cost(tarif_cost)}
else{temp_str=tarif_cost}
$('.tarif_cost').text(temp_str)}
function add_spaces_to_cost(tarif_cost){tarif_cost=tarif_cost+''
temp_str=''
j=1
for(var i=tarif_cost.length-1;i>=0;i--){temp_str=tarif_cost[i]+temp_str
if(j%3==0){temp_str=' '+temp_str}
j+=1}
return temp_str}
$('.newpost_title').on('input',function(){$('.save_post.disabled').addClass('blue')
$('.save_post.disabled').removeClass('disabled')
val=$(this).val()
$('.pred_title').text(val)})
$('.school_cities_edit').on('keyup',function(e){text=$(this).text()
url=$(this).attr('suggest_url')
position=window.getSelection().anchorOffset
indexstart=position
for(var i=position-1;i>=0;i--){indexstart=i;if(text[i]===','){break;}
else if(text[i]===' '){break;}}
newtext=text.slice(indexstart,position)
$.ajax({url:url,data:{'text':newtext,},dataType:'json',success:function(data){$('.suggest_city').empty()
for(var i=0;i<data.res.length;i++){$('<a onclick="add_suggested_city('+"'"+data.res[i]+"'"+')" class="ui button mini white shadow_small pt5 pl5 pr5 pb5 border1 mr5">'+data.res[i]+'</a>').appendTo('.suggest_city')}}})})
$('.save_vk_group').click(function(e){url=$(this).attr('url')
id=$(this).attr('id')
name=$(this).attr('name')
$.ajax({url:url,data:{'id':id,'name':name,},dataType:'json',success:function(data){window.location.replace(data.url);}})})
$('.update_hints').click(function(e){url=$(this).attr('url')
$.ajax({url:url,data:{},dataType:'json',success:function(data){location.reload();}})})
$('.choose_cat').click(function(e){if($(this).attr('status')=='chosen'){$(this).removeClass('green')
$(this).attr('status','none')}
else{$(this).addClass('green')
$(this).attr('status','chosen')}
ids=''
$('.choose_cat.green').each(function(){if($(this).attr('id')){ids+=$(this).attr('id')+'p'}})
url=$('.data').attr('url')
id=$('.data').attr('id')
if($(this).attr('order')){$('.cat_order').removeClass('green')
$(this).addClass('green')}
order=$('.cat_order.green').attr('order')
$('.loading').show()
$.ajax({url:url,data:{'id':id,'ids':ids,'order':order,},dataType:'json',success:function(data){schools=data.res
console.log('started')
update_list(schools)
$('.loading').hide()}})})
function update_list(schools){$('.schools_list').empty()
console.log('len',schools.length)
$('.schools_len').text(schools.length)
for(var i=0;i<schools.length;i++){url=schools[i][0]
title=schools[i][1]
img=schools[i][2]
address=schools[i][3]
content=schools[i][4]
rating=schools[i][5]
if(img==''){img='background-image: url('+img+')'
textin=''}
else{img='background-image: url(/static/images/fon4.jpg)'
textin=title}
school=$('.school_box_orig').clone()
school.removeClass('school_box_orig')
school.find('.landbox').attr('href',url)
school.find('.land_box1').attr('style',img+';padding-top: 50px;')
$('<span class="not_in_mobile">'+textin+'</span>').appendTo(school.find('.land_box1'))
school.find('.school_box_title').text(title)
school.find('.school_box_address').text(address)
school.find('.school_box_slogan').text(content)
school.find('.school_box_rating').text(rating)
rating_cont=school.find('.rating_stars')
rating=parseInt(rating)
for(var j=0;j<rating;j++){filled_star=$('.filled_star').clone()
filled_star.removeClass('filled_star')
filled_star.appendTo(rating_cont)}
for(var j=rating;j<5;j++){empty_star=$('.empty_star').clone()
empty_star.removeClass('empty_star')
empty_star.appendTo(rating_cont)}
school.appendTo('.schools_list')}}
$('.open_new_card_form1').click(function(e){$('#new_card_form1').modal('show');$('.wrong_mail_error').hide();console.log('open_new_card_form1')
$('.alreadyregistered').hide()
$('.wrong_mail_error').hide()
$('.new_card_load').hide()})
$('.add_card_head').click(function(e){$('.new_card_saved1').hide()
this_=$(this)
var id=this_.attr("id")
var url=this_.attr("url")
var name=$('.new_card_name1').val()
var phone=$('.new_card_phone1').val()
var mail=$('.new_card_mail1').val()
var comment=$('.new_card_comment1').val()
$('.alreadyregistered').hide()
$('.wrong_mail_error').hide()
ok=false
if(mail!=''){for(var i=mail.length-1;i>=0;i--){if(mail[i]=='@'){ok=true;break;}}}
else{ok=true;}
console.log('dddd',ok)
if(ok){this_.addClass('disabled')
$('.new_card_load').show()
$.ajax({url:url,data:{'name':name,'phone':phone,'mail':mail,'comment':comment,'id':id,},dataType:'json',success:function(data){this_.removeClass('disabled')
$('.new_card_load').hide()
if(data.already_registered){$('.alreadyregistered'+id).show()}
else{$('.new_card_saved1').show()}}})}
else{$('.wrong_mail_error').show()}});$('.connect_sm').click(function(e){url=$(this).attr('url')
status=$(this).attr('status')
$.ajax({url:url,data:{'status':status,},dataType:'json',success:function(data){window.location.replace(data.url);}})})
$('.update_finance').click(function(e){url=$(this).attr('update_url')
$.ajax({url:url,data:{},dataType:'json',success:function(data){if(data.ok){$('#school_money').text('0тг')
$('.finance_update_author').text(data.author)
$('.finance_update_date').text(data.date)
$('#hint_f2').text('Обновлено')}}})})
$('.show_finance_update').on({mouseenter:function(){$('#hint_f').show()
author=$('.finance_update_author')
if(author.attr('status')=='hidden'){$('#loading_f_update').show()
url=$(this).attr('get_url')
$.ajax({url:url,data:{},dataType:'json',success:function(data){$('#loading_f_update').hide()
$('.finance_update_author').text(data.author)
$('.finance_update_date').text(data.date)
author.attr('status','filled')}})}},mouseleave:function(){$('#hint_f').hide()}})
$('.update_finance').on({mouseenter:function(){$('#hint_f2').show()},mouseleave:function(){$('#hint_f2').hide()}})
$('.open_sq_finance').click(function(e){$('.sq_finance').modal('show')
id=$(this).attr('id')
url=$('.salary_url').attr('group_finance')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('.group_subjects').empty()
$('.sq_students').empty()
$('.group_title').text(data.res_squad[0])
$('.group_teacher').text(data.res_squad[1])
$('.group_teacher').attr('href',data.res_squad[2])
$('.sq_cost').text(data.res_squad[3])
for(var i=0;i<data.res_subjects.length;i++){title=data.res_subjects[i][0]
cost=data.res_subjects[i][1]
color=data.res_subjects[i][2]
$('<div class="mt0 mb5 ui segment dinline pt5 pb5 ml10 textw" style="background-color: '+color+'"> <b>'+title+': <i>'+cost+'</i></b> </div>').appendTo('.group_subjects')}
for(var i=0;i<data.res.length;i++){name=data.res[i][0]
url=data.res[i][1]
first_present=data.res[i][2]
closed_months=data.res[i][3]
$('<div class="four wide column pl0 pt0"><div class="ui segment text-center pt5 pb5"> <b>'+name+'</b><br>'+first_present+'<br> Оплачено за '+closed_months+' месяцев </div> </div>').appendTo('.sq_students')}}})})
$('.manager_office').click(function(e){this_=$(this)
id=this_.attr('id')
office=this_.attr('office')
url=$('.data').attr('crm_option_url2')
if($('.check_moderator').attr('status')=='True'){url=url+'?type=moderator&mod_school_id='+$('.day_id').attr('group_id')}
$.ajax({url:url,data:{'id':id,'office':office,},dataType:'json',success:function(data){if(data.added){this_.addClass('green')}
else{this_.removeClass('green')}}})})
$('.move_money_send').click(function(e){from=$('.move_money_from').val()
to=$('.move_money_to').val()
amount=$('.move_money_amount').val()
id=$(this).attr('id')
$('.move_money_loading').show()
url=$(this).attr('url')
$('.move_money_success').hide()
$.ajax({url:url,data:{'id':id,'from':from,'to':to,'amount':amount,},dataType:'json',success:function(data){if(data.ok=='NotEnouph'){}
else if(data.ok==true){$('.move_money_loading').hide()
$('.move_money_success').show()
$('.nm_money'+from).text(data.from)
$('.nm_money'+to).text(data.to)}}})})
$('.change_show_type').change(function(e){checked=$(this).prop('checked')
if(checked){$('.map_show').show()
$('.list_show').hide()}
else{$('.list_show').show()
$('.map_show').hide()}})
$('.make_public').click(function(e){checked=$(this).prop('checked')
id=$(this).attr('id')
url=$(this).attr('url')
$.ajax({url:url,data:{'id':id,'checked':checked,},dataType:'json',success:function(data){}})})
$('.make_public_cost').click(function(e){checked=$(this).prop('checked')
id=$(this).attr('id')
url=$(this).attr('url')
$.ajax({url:url,data:{'id':id,'checked':checked,},dataType:'json',success:function(data){}})})
$('.dis').click(function(e){student_id=$('.discount_student_name').attr('id')
squad_id=$('.discount_group_title').attr('id')
url=$('.instance_data').attr('set_student_discounts')
this_=$(this)
id=this_.attr('id')
$.ajax({url:url,data:{'id':id,'student_id':student_id,'squad_id':squad_id,},dataType:'json',success:function(data){if(data.add){console.log('add')
this_.addClass('green')}
else{console.log('remove')
this_.removeClass('green')}}})})
$('.add_job').click(function(e){id=$(this).attr('id')
url=$(this).attr('url')
title=$('.new_job_title'+id).val()
$.ajax({url:url,data:{'id':id,'title':title,},dataType:'json',success:function(data){location.reload()}})})
$('.yes_delete_job').click(function(e){id=$(this).attr('id')
url=$(this).attr('url')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){if(data.ok){location.reload()}
else{$('.delete_job_error').show()}}})})
$('.subject_period').click(function(e){$('.subject_period').removeClass('green')
$(this).addClass('green')
newstatus=$(this).attr('status')
$('.get_subject_period').attr('value',newstatus)})
$('.download_report').click(function(e){url=$(this).attr('url');first_report=$('.first_report').val();second_report=$('.second_report').val();$.ajax({url:url,data:{'first_report':first_report,'second_report':second_report,},dataType:'json',success:function(data){}})})
$('.get_manager_actions').click(function(e){url=$(this).attr('url')
id=$(this).attr('id')
$('#manager_actions'+id).modal('show')
$.ajax({url:url,data:{"id":id,},dataType:'json',success:function(data){if(data.student){prof='Студент'}
else if(data.teacher){prof='Учитель'}
else{prof='Менеджер'}
$('.set_manager_actions'+id).empty()
res=data.res
table=''
for(var i=res.length-1;i>=0;i--){crnt='<td class="border">'+res[i][0]+'</td>'
crnt+='<td class="border">'+res[i][1]+'</td>'
crnt+='<td class="border">'+res[i][2]+'</td>'
table+='<tr style="color: #222;"> '+crnt+' </tr>'}
$('<table id="keywords" cellspacing="0" cellpadding="0" style="color: #222;">'+' <thead> <tr style="color: #222;"> <th>'+prof+'</th> <th>Время</th> <th>Действие</th> </tr>'+' </thead> <tbody> '+table+' </tbody> </table>').appendTo('.set_manager_actions'+id)}})})
$('.get_teacher_actions').click(function(e){url=$(this).attr('url')
id=$(this).attr('id')
$('#teacher_actions'+id).modal('show')
$.ajax({url:url,data:{"id":id,},dataType:'json',success:function(data){prof='Преподаватель'
$('.set_teacher_actions'+id).empty()
res=data.res
table=''
for(var i=res.length-1;i>=0;i--){crnt='<td class="border">'+res[i][0]+'</td>'
crnt+='<td class="border">'+res[i][1]+'</td>'
crnt+='<td class="border">'+res[i][2]+'</td>'
table+='<tr style="color: #222;"> '+crnt+' </tr>'}
$('<table id="keywords" cellspacing="0" cellpadding="0" style="color: #222;">'+' <thead> <tr style="color: #222;"> <th>'+prof+'</th> <th>Время</th> <th>Действие</th> </tr>'+' </thead> <tbody> '+table+' </tbody> </table>').appendTo('.set_teacher_actions'+id)}})})
$('.make_zaiavka_new').click(function(e){url='/api/make_zaiavka/'
id=$(this).attr('id')
name=$('.zaiavka_name').val()
phone=$('.zaiavka_phone').val()
course=$(this).attr('course')
$.ajax({url:url,data:{"id":id,"name":name,"phone":phone,"course":course,},dataType:'json',success:function(data){if(data.ok){console.log('ok')
$('.make_zaiavka').hide()
$('.ok_zaiavka').show()
$('.ok_zaiavka_new').show()}}})})
$('.close_modal2').click(function(e){$('#zaiavka_modal').hide('fast')
$('.darker').hide()})
$(".show_school_type").click(function(){if($(this).is(':checked')){height=parseInt($('.cattop').css('height'))
$('.schools_show_map').show()
$('.schools_show_list').hide()}
else{$('.schools_show_map').hide()
$('.schools_show_list').show()}});$('.make_zaiavka').click(function(e){course=$(this).attr('course')
if($(this).attr('status')=='auth'){url='/api/make_zaiavka/'
id=$(this).attr('id')
$.ajax({url:url,data:{"id":id,"course":course,},dataType:'json',success:function(data){if(data.ok){$('.ok_zaiavka-1').show()
$('.make_zaiavka-1').hide()
$('.ok_zaiavka'+course).show()
$('.make_zaiavka'+course).hide()}}})}
else{$('#zaiavka_modal').show('fast')
$('.make_zaiavka_new').attr('course',course)
$('.darker').show()}
e.stopPropagation();})
$('.create_school').click(function(e){url=$(this).attr('url');$('.not_success_created').hide()
$('.success_created').hide()
title=$('.new_school_title').val();slogan=$('.new_school_slogan').val();name=$('.new_school_name').val();phone=$('.new_school_phone').val();version=$('.new_school_version').val();if(title==''||slogan==''||name==""||phone==""||version==""){$('.not_success_created').show()}
else{$.ajax({url:url,data:{'title':title,'slogan':slogan,'name':name,'phone':phone,'version':version,},dataType:'json',success:function(data){console.log(data)
if(data.ok){$('.success_created').show()
title=$('.new_school_title').val('');slogan=$('.new_school_slogan').val('');name=$('.new_school_name').val('');phone=$('.new_school_phone').val('');$('.director_password').text(data.password)}}})}})
$('.create_worker').click(function(e){url=$(this).attr('url');$('.not_success_created_worker').hide()
$('.success_created_worker').hide()
this_=document.getElementById('new_worker_prof');prof_id=this_.options[this_.selectedIndex].value;school=$('.new_worker_school').val();name=$('.new_worker_name').val();phone=$('.new_worker_phone').val();mail=$('.new_worker_mail').val();if(school==''||name==''||phone==''){$('.not_success_created_worker').show()}
else{$.ajax({url:url,data:{'school':school,'name':name,'phone':phone,'mail':mail,'prof_id':prof_id,'mail':mail,},dataType:'json',success:function(data){if(data.ok){$('.success_created_worker').show()
$('.worker_password').text(data.password);$('.create_worker').addClass('disabled')}
else{$('.not_success_created_worker').show()}}})}})
$('.worker_saved_password').click(function(e){$('.create_worker').removeClass('disabled');$('.new_worker_school').val();$('.new_worker_name').val('');$('.new_worker_phone').val('');$('.new_worker_mail').val('');})
$('.show_money_history').click(function(e){url=$(this).attr('url')
$('.money_history').modal('show')
$.ajax({url:url,data:{},dataType:'json',success:function(data){for(var i=0;i<data.res.length;i++){$('<tr style="color: #222;"><td class="border">'+data.res[i][0]+'</td><td class="border">'+data.res[i][1]+'</td><td class="border">'+data.res[i][2]+'</td>').appendTo('.history_cont')}}})})
$('.new_money_object').click(function(e){url=$(this).attr('url')
title=$('.new_money_title').val()
amount=$('.new_money_amount').val()
$('.success_new_money').hide()
$.ajax({url:url,data:{'title':title,'amount':amount,},dataType:'json',success:function(data){$('.new_money_title').val('')
$('.new_money_amount').val('')
$('.success_new_money').show()}})})
$('.delete_school_banner').click(function(e){url=$(this).attr('url')
if($('.check_moderator').attr('status')=='True'){url=url+'?type=moderator&mod_school_id='+$('.day_id').attr('group_id')}
console.log($('.check_moderator').attr('status'),$('.day_id').attr('group_id'),'dd')
id=$(this).attr('id')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('#banner'+id).hide('fast')}})})
$('.save_review').click(function(e){number=$('.result_rating').attr('number')
url=$(this).attr('url')
text=$('.review_text').val()
$.ajax({url:url,data:{'text':text,'number':number,},dataType:'json',success:function(data){if(data.nouser){$('.review_error').show()}
else{$('.review_error').hide()
number=parseInt(number)
stars=''
notstars=''
for(var i=1;i<=number;i++){stars+='<i class="icon star"></i>'}
for(var i=number+1;i<=5;i++){notstars+='<i class="icon star"></i>'}
rev='<div class="schoolLanding__content-review-comment__rating"> <span class="organization__info-rating-icon active">'+
stars+'</span> <span class="organization__info-rating-icon"> '+notstars+' </span> </div> <div class="schoolLanding__content-review-comment__text"> '+text+' </div> <div class="schoolLanding__content-review-comment__about"> <span class="schoolLanding__content-review-comment__about-left"> <span class="schoolLanding__content-review-comment__about-name">'+data.name+'</span> <span class="schoolLanding__content-review-comment__about-date">'+data.timestamp+'</span> </span> </div>'
$(rev).appendTo('.schoolLanding__content-review-comment')
$('.review_text').val('')
$('.wright_review').hide()
$('.thanks_review').show()}}})})
$('.make_review').click(function(e){number=parseInt($(this).attr('number'))
$('.result_rating').attr('number',number)
for(var i=0;i<=number;i++){$('#star'+i).attr('style','color: #D4C14A;')}
for(var i=number+1;i<=5;i++){$('#star'+i).attr('style','')}
$('.wright_review').show()})
$('.delete_cabinet').click(function(e){this_=$(this)
id=this_.parent().attr('id')
e.stopPropagation()
url=this_.attr('url')
if($('.check_moderator').attr('status')=='True'){url=url+'?type=moderator&mod_school_id='+$('.day_id').attr('group_id')}
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){this_.parent().parent().hide('fast')}})})
$('.cabinet_details').click(function(e){id=$(this).attr('id')
title=$(this).find('.cabinet_title').text()
if(id=='-1'){$('.cabinet_title_head').text('Новый кабинет')}
else{$('.cabinet_title_head').text('Кабинет '+title)}
capacity=parseInt($(this).find('.cabinet_capacity').text())
$('.data').attr('crnt_cabinet',id)
$('.add_cabinet_modal').modal('show')
$('.office_cabinet_create_title').val(title)
$('.office_cabinet_create_capacity').val(capacity)})
$('.save_office_cabinet').click(function(e){this_=$(this)
url=this_.attr('url')
title=$('.office_cabinet_create_title').val()
capacity=$('.office_cabinet_create_capacity').val()
id=$('.data').attr('crnt_cabinet')
this_.addClass('disabled')
$('.cabinet_loader').show()
$.ajax({url:url,data:{'title':title,'capacity':capacity,'id':id,},dataType:'json',success:function(data){if(id=='-1'){cabinet=$('.cabinet_orig').clone(true)
cabinet.removeClass('cabinet_orig')
cabinet.find('.cabinet_details').attr('id',data.cid)
cabinet.appendTo('.all_cabinets')}
else{cabinet=$('.cab'+id)}
cabinet.find('.cabinet_title').text(title)
cabinet.find('.cabinet_capacity').text(capacity)
this_.removeClass('disabled')
$('.cabinet_loader').hide()
$('.add_cabinet_modal').modal('hide')}})});$('.save_school_title').click(function(e){url=$(this).attr('url')
if($('.check_moderator').attr('status')=='True'){url=url+'?type=moderator&mod_school_id='+$('.day_id').attr('group_id')}
id=$(this).attr('id')
status=$(this).attr('status')
if(status=='worktime'){part1=$('.school_'+status+'_edit1').val()
part2=$('.school_'+status+'_edit2').val()
if(part1==''||part2==''){text='По предварительной записи'}
else{text=part1+'-'+part2}}
else if(status=='cities'){text=$('.school_'+status+'_edit').text()}
else{text=$('.school_'+status+'_edit').val()}
$.ajax({url:url,data:{'text':text,'id':id,'status':status},dataType:'json',success:function(data){$('.school_'+status+'_form').hide();$('.school_'+status).text(text);if(status=='site'){$('.school_site').attr('href',text)}}})});$('.login-btn').click(function(e){url='/api/login/'
username=$('.username').val()
password=$('.password').val()
$('.wrong_login').hide()
$.ajax({url:url,data:{'username':username,'password':password},dataType:'json',success:function(data){if(data.res=='login'){location.reload()}
else if(data.res=='error'){$('.wrong_login').show()}}})});$('.register-btn').click(function(e){url='/api/register/'
name=$('.new_name').val()
phone=$('.new_username').val()
mail=$('.new_mail').val()
new_password=$('.new_password').val()
new_password2=$('.new_password2').val()
console.log(name,phone,mail)
if(name.length>0&&phone.length>0&&mail.length>0&&new_password.length>0&&new_password==new_password2){$.ajax({url:url,data:{'name':name,'phone':phone,'mail':mail,'password1':new_password,'password2':new_password2,},dataType:'json',success:function(data){console.log(data.res)
if(data.res=='ok'){$('.reg_wrong_phone').hide()
$('.reg_fill_all').hide()
$('.reg_wrong_pass').hide()
location.reload()}
else if(data.res=='second_user'){$('.reg_wrong_phone').show()}
else if(data.res=='not_equal_password'){$('.reg_wrong_pass').show()}}})}
else{$('.reg_fill_all').show()}});$('.login-btn2').click(function(e){url='/api/login/'
username=$('.username2').val()
password=$('.password2').val()
$('.wrong_login').hide('fast')
$.ajax({url:url,data:{'username':username,'password':password},dataType:'json',success:function(data){if(data.res=='login'){$('.wrong_login').hide()
location.reload()}
else if(data.res=='error'){$('.wrong_login').show('fast')}}})});$('.dir_teach_chose').click(function(e){$('.dir_teach_chose.chosen').removeClass('chosen')
$(this).addClass('chosen')
$('.dir_teach_check').hide()
$(this).find('.check').show()})
$('.sign_slogan').click(function(e){$('.sign_slogan.chosen').removeClass('chosen')
$(this).addClass('chosen')
$('.slogan_check').hide()
$(this).find('.check').show()})
$('.register-btn2').click(function(e){$('.reg_wrong_phone').hide()
$('.reg_fill_all').hide()
$('.reg_wrong_pass').hide()
url='/api/register/'
name=$('.sign_dir_name').val()
mail=$('.sign_mail').val()
course=document.location.hash
new_password=$('.sign_password').val()
new_password2=$('.sign_password2').val()
if(name.length>0&&mail.length>0&&new_password.length>0&&new_password==new_password2){$(this).addClass('disabled')
$('.next_step_load').show()
$.ajax({url:url,data:{'name':name,'mail':mail,'password1':new_password,'password2':new_password2,'course':course,},dataType:'json',success:function(data){if(data.res=='ok'){window.location.replace('/');}
else if(data.res=='second_user'){$('.register-btn2').removeClass('disabled')
$('.reg_wrong_phone').show()}}})}
else{$(this).removeClass('disabled')
$('.reg_fill_all2').show()}});$('.update_pswd-btn').click(function(e){url='/api/update_pswd/'
mail=$('.update_pswd_mail').val()
$('.loading').show()
$(this).addClass('disabled')
$.ajax({url:url,data:{'mail':mail,},dataType:'json',success:function(data){if(data.ok){$('.wrong_mail_update_pswd').hide()
$('.ok_update_pswd').show()}
else{$('.wrong_mail_update_pswd').show()
$('.ok_update_pswd').hide()}
$('.loading').hide()}})});$('.reset_pswd').click(function(e){url='/api/reset_pswrd/'
password1=$('.reset_password1').val()
password2=$('.reset_password2').val()
id=$(this).attr('id')
$('.success_change_pswrd').hide()
$.ajax({url:url,data:{'password1':password1,'password2':password2,'id':id,},dataType:'json',success:function(data){$('.success_change_pswrd').show()}})});$('.show_free_cards').click(function(e){url=$(this).attr('url')
checked=$(this).prop('checked')
$.ajax({url:url,data:{'check':checked,},dataType:'json',success:function(data){location.reload()}})});$('.save_salary').click(function(e){url=$('.salary_url').attr('url')
id=$(this).attr('id')
this_=$(this)
salary=$('#salary'+id).val();$.ajax({url:url,data:{'id':id,'salary':salary,},dataType:'json',success:function(data){$('#input'+id).hide();$('#salary_show'+id).show();$('#salary_show_value'+id).text(salary)}})});$('.save_job_salary').click(function(e){url=$('.save_job_salary_url').attr('url')
id=$(this).attr('id')
this_=$(this)
salary=$('#job_salary'+id).val();$.ajax({url:url,data:{'id':id,'salary':salary,},dataType:'json',success:function(data){location.reload();}})});$('.update_hints').click(function(e){url=$(this).attr('url')
console.log('de')
$.ajax({url:url,data:{},dataType:'json',success:function(data){location.reload()}})});$('.open_card_form').click(function(e){$('#card_form'+$(this).attr('id')).modal('show')})
$('.change_mode').click(function(e){if($('.dataconst').attr('page_mode')=='norm'){$('.body').addClass('oveflowy_h')
$('.schedule_body').removeClass('oveflowx_h')
$('.schedule_body').addClass('oveflowx_a')
$('#group-details').addClass('oveflowy_h')
$('.content-container').addClass('oveflowy_h')
$('.dataconst').attr('page_mode','horz')}
else{$('.body').removeClass('oveflowy_h')
$('.schedule_body').addClass('oveflowx_h')
$('.schedule_body').removeClass('oveflowx_a')
$('#group-details').removeClass('oveflowy_h')
$('.content-container').removeClass('oveflowy_h')
$('.dataconst').attr('page_mode','norm')}})
$('.change_subject_category').on('change',function(e){id=$(this).attr('id')
this_=document.getElementById(id);object_id=this_.options[this_.selectedIndex].value;url=$(this).attr('url')
$.ajax({url:url,data:{'object_id':object_id,},dataType:'json',success:function(data){}});})
$('.change_subject_age').on('change',function(e){id=$(this).attr('id')
this_=document.getElementById(id);object_id=this_.options[this_.selectedIndex].value;url=$(this).attr('url')
$.ajax({url:url,data:{'object_id':object_id,},dataType:'json',success:function(data){}});})
$('.change_squad_office').on('change',function(e){id=$(this).attr('id')
this_=document.getElementById(id);object_id=this_.options[this_.selectedIndex].value;url=$(this).attr('url')
$.ajax({url:url,data:{'object_id':object_id,},dataType:'json',success:function(data){}});})
$('.add_student').on('click',function(e){console.log('d')
var name=$('.new_student_name').val()
var phone=$('.new_student_phone').val()
var mail=$('.new_student_mail').val()
var squad_id=$('.current_squad').attr("id")
$.ajax({url:$('.register_to_school_url').attr('url'),data:{'name':name,'phone':phone,'mail':mail,'squad_id':squad_id,'status':'student',},dataType:'json',success:function(data){$('.new_student_name').attr('class','')
$('.new_student_phone').attr('class','')
$('.new_student_mail').attr('class','')
password_place=document.getElementById('password_place')
password=document.createElement('span')
password.innerHTML=data.password
password_place.appendChild(password)
$('#password_place').attr('id','')
tr=document.createElement('tr')
td=document.createElement('td')
textarea=document.createElement('textarea')
textarea.setAttribute('class','new_student_name')
td.appendChild(textarea)
tr.appendChild(td)
td2=document.createElement('td')
textarea=document.createElement('textarea')
textarea.setAttribute('class','new_student_phone')
td2.appendChild(textarea)
tr.appendChild(td2)
td3=document.createElement('td')
textarea=document.createElement('textarea')
textarea.setAttribute('class','new_student_mail')
td3.appendChild(textarea)
tr.appendChild(td3)
td4=document.createElement('td')
td4.setAttribute('id','password_place')
tr.appendChild(td4)
tbody=document.getElementById('create_student_rows')
tbody.appendChild(tr)}});})
$('.update_schedule').click(function(event){$.ajax({url:$(this).attr('url'),data:{},dataType:'json',success:function(data){location.reload()}});})
$('.delete_post').click(function(event){var id=$(this).attr('id')
$.ajax({url:$(this).attr('url'),data:{'post_id':id,},dataType:'json',success:function(data){$('.post_details'+id).hide('fast')}});})
$('.create_new_post').on('click',function(e){this_=$(this)
var text=$('.new_post_area').val()
var file=document.getElementById('postfile').files[0];var url=this_.attr('url')
var xhr=new XMLHttpRequest();var csrfToken=xhr.getResponseHeader('x-csrf-token');xhr.open('post',url,true);xhr.setRequestHeader('x-csrf-token',csrfToken);xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");xhr.setRequestHeader("Accept","application/json");xhr.send(file);});$('.show_post_form').click(function(event){$('.new_post_details').show('fast')
event.stopPropagation();})
$("body").click(function(e){$('.new_post_details').hide('fast');});$('.profile_name').click(function(event){if($(this).attr('status')=='0'){$('.profile_links').show()
$(this).attr('status','1')}
else{$(this).attr('status','0')
$('.profile_links').hide()}})
$('.tell_about_corruption').click(function(event){var text=$('.corruption_text').val()
$.ajax({url:$(this).attr('url'),data:{'text':text,},dataType:'json',success:function(data){if(data.ok){$('.thanks').attr('style','background-color: #65C063;color: #fff;display: block;')}}});})
$('.show_att_chart').click(function(event){$('.attendances').hide()
$('.att_charts').show()
$('.show_att_chart').hide()
$('.show_attendances').show()})
$('.show_attendances').click(function(event){$('.att_charts').hide()
$('.attendances').show()
$('.show_attendances').hide()
$('.show_att_chart').show()})
$('.open_point').click(function(event){})
$(".switch_att_btn").click(function(event){event.preventDefault();var this_=$(this)
var topic_id=this_.attr('topic_id')
var module_id=this_.attr('module_id')
current_class=this_.attr('class')
for(var i=0;i<document.getElementsByClassName('switch_att_btn'+module_id).length;i++){document.getElementsByClassName('switch_att_btn'+module_id)[i].setAttribute('class','switch_att_btn switch_att_btn'+module_id)}
for(var i=0;i<document.getElementsByClassName('ppr'+module_id).length;i++){document.getElementsByClassName('ppr'+module_id)[i].setAttribute('class','topic ppr ppr'+module_id)}
this_.attr('class',current_class+' switch_att_btn_active switch_att_btn')
$('#topic'+topic_id+module_id).attr('class','topic_active ppr ppr'+module_id)})
$('.open_attendance').click(function(event){var id=$(this).attr('id')
for(var i=0;i<document.getElementsByClassName('subject_attendance').length;i++){document.getElementsByClassName('subject_attendance')[i].setAttribute('style','display:none;')}
document.getElementById('subject'+id).setAttribute('style','display:block')})
$('.continue').click(function(event){$(this).hide()
$(".continue_div").show()})
$('.openchart').on('click',function(e){id=$(this).attr('id')
if($(this).attr('status')=='closed'){$('#chart'+id).show('slow')
$(this).attr('status','opened')
$('#icondown'+id).show()
$('#iconright'+id).hide()}
else{$('#chart'+id).hide('slow')
$(this).attr('status','closed')
$('#icondown'+id).hide()
$('#iconright'+id).show()}});$(".content-markdown").each(function(){var content=$(this).text()
var markedContent=marked(content)
$(this).html(markedContent)});$(".open_form_trener").click(function(event){event.preventDefault();$(".form_trener").fadeToggle();});$(".open_subject_form").click(function(event){event.preventDefault();$(".subject_form"+$(this).attr('id')).fadeToggle();});$(".change_subject").click(function(){var this_=$(this)
id=this_.attr("id")
var pageUrl=this_.attr("data-href")
var title=$('#subject_title'+id).val();var text=$('#id_text'+id).val();var cost=$('#subject_cost'+id).val();if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("id"),'title':title,'cost':cost,'text':text,},dataType:'json',success:function(data){document.getElementById(this_.attr("id")+'title').innerHTML=title
document.getElementById(this_.attr("id")+'text').innerHTML=marked(text)
document.getElementById(this_.attr("id")+'cost').innerHTML=cost
$(".subject_form"+id).fadeToggle();}});}});$(".open_form").click(function(event){event.preventDefault();$(".update_form").fadeToggle();})
$(".open_comments").click(function(event){event.preventDefault();$(".comments").fadeToggle();})
$(".open_docs").click(function(event){event.preventDefault();$(".docs").fadeToggle();})
$(".open_page").click(function(event){event.preventDefault();var this_=$(this)
var page=this_.attr('page')
$("#detailed_info").attr('class','ui tab');$("#all_squads").attr('class','ui tab');$("#attendance").attr('class','ui tab');$("#zaiavki").attr('class','ui tab');if(page=='profile_info'){$("#detailed_info").attr('class','ui tab active');}
if(page=='profile_zaiavki'){$("#zaiavki").attr('class','ui tab active');}
if(page=='profile_attendance'){$("#attendance").attr('class','ui tab active');}
if(page=='profile_squads'){$("#all_squads").attr('class','ui tab active');}})
$(".open_students_table").click(function(event){event.preventDefault();var this_=$(this)
var page=this_.attr('page')
for(var i=0;i<document.getElementsByClassName('tab').length;i++){document.getElementsByClassName('tab')[i].setAttribute('class','ui tab')}
$("#"+page).attr('class','ui tab active');})
$(".save_zaiavka").click(function(event){event.preventDefault();var this_=$(this)
var Url=this_.attr("data-href")
var name=$('.zaiavka_name').val()
var phone=$('.zaiavka_phone').val()
if(Url){$.ajax({url:Url,method:"GET",data:{'name':name,'phone':phone},success:function(data){$(".ok_zaiavka").show()},error:function(error){}})}})
$(".open_form_status").click(function(event){event.preventDefault();$(".update_status").fadeToggle();})
$(".open_form_topic").click(function(event){event.preventDefault();$(".create_topic").fadeToggle();})
$(".open_form_task").click(function(event){event.preventDefault();var this_=$(this)
var form_id='.'+this_.attr("id")+'add_task'
$(form_id).fadeToggle();})
$(".open_add_child").click(function(event){event.preventDefault();var this_=$(this)
var form_id='.'+this_.attr("id")+'add_child'
$(form_id).fadeToggle();})
$(".open_groups").click(function(event){event.preventDefault();var this_=$(this)
var form_id='.'+'groups'+this_.attr("id")
$(form_id).fadeToggle();})
$(".open_group_details").click(function(event){event.preventDefault();var this_=$(this)
var table_id='#'+this_.attr("id")+'details';$(table_id).fadeToggle();})
$(".open_group_details_hmw").click(function(event){event.preventDefault();var this_=$(this)
var table_id='#'+this_.attr("id")+'details_hmw'
$(table_id).fadeToggle();})
$(".open_group_details_cls").click(function(event){event.preventDefault();var this_=$(this)
var table_id='#'+this_.attr("id")+'details_cls'
$(table_id).fadeToggle();})
$(".open_chart").click(function(event){event.preventDefault();var this_=$(this)
$('#'+this_.attr("id")+'chart').fadeToggle();})
$(".delete_zaiavka").click(function(e){e.preventDefault()
var this_=$(this)
var icon='#zaiavka'+this_.attr("id")
var name='#zaiavka_name_'+this_.attr("id")
var phone='#zaiavka_phone_'+this_.attr("id")
var time='#zaiavka_time_'+this_.attr("id")
var changeUrl=this_.attr("data-href")
if(changeUrl){$.ajax({url:changeUrl,method:"GET",data:{},success:function(data){$(icon).css('display','none')
$(name).css('text-decoration','line-through')
$(name).css('color','grey')
$(phone).css('text-decoration','line-through')
$(phone).css('color','grey')
$(time).css('text-decoration','line-through')
$(time).css('color','grey')},error:function(error){console.log('error')}})}})
$(".delete_follow").click(function(e){e.preventDefault()
var this_=$(this)
var icon='#follow'+this_.attr("id")
var user='#follow_user_'+this_.attr("id")
var group='#follow_group_'+this_.attr("id")
var phone='#follow_phone_'+this_.attr("id")
var time='#follow_time_'+this_.attr("id")
var changeUrl=this_.attr("data-href")
if(changeUrl){$.ajax({url:changeUrl,method:"GET",data:{},success:function(data){$(icon).css('display','none')
$(user).css('text-decoration','line-through')
$(user).css('color','grey')
$(group).css('text-decoration','line-through')
$(group).css('color','grey')
$(phone).css('text-decoration','line-through')
$(phone).css('color','grey')
$(time).css('text-decoration','line-through')
$(time).css('color','grey')},error:function(error){console.log('error')}})}})
$(".change_status").click(function(e){e.preventDefault()
var Url=$(this).attr("data-href")
status=$(".textarea_status").val()
$.ajax({url:Url,method:"GET",data:{'status':status},success:function(data){hisstatus=document.getElementsByClassName('hisstatus')[0]
hisstatus.innerHTML=status},error:function(error){}})})
$(".add_group_btn").click(function(e){e.preventDefault()
var this_=$(this)
var squadUrl=this_.attr("data-href")
if(squadUrl){$.ajax({url:squadUrl,data:{'topic_id':this_.attr("topic_id"),'squad_id':this_.attr("squad_id"),'isin':this_.attr("isin"),},success:function(data){if(this_.attr("isin")=='yes'){this_.css('background-color','#F2F2F2')
this_.css('color','black')
this_.attr('isin','no')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").css('background-color','#F2F2F2')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").css('color','black')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").attr('isin','no')
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results').hide()
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results_urok').hide()}
else{this_.css('background-color','#5181b8')
this_.css('color','white')
this_.attr('isin','yes')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").css('background-color','#5181b8')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").css('color','white')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn_urok").attr('isin','yes')
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results').show()
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results_urok').show()}},error:function(error){console.log('error')}})}})
$(document).on("click",'.save_grade',function(){event.preventDefault();var this_=$(this)
var pageUrl=$('.attendance_change_url').attr("url")
var grade=this_.attr('grade')
var id=this_.attr('id')
if(pageUrl){$.ajax({url:pageUrl,method:"GET",data:{'id':id,'grade':grade,},success:function(data){$('.grade'+id).removeClass('blue')
this_.addClass('blue')},error:function(error){console.log('error')}})}})
$(".present").click(function(event){event.preventDefault();var this_=$(this)
var pageUrl=this_.attr("data-href")
if(pageUrl){$.ajax({url:pageUrl,method:"GET",data:{'id':this_.attr("id2"),'attendance':'present',},success:function(data){var attendance='#'+'att'+this_.attr("id2")
var absent='#'+'absent'+this_.attr("id2")
var late='#'+'late'+this_.attr("id2")
$(attendance).attr('value','present');this_.css('background-color','#21BA45');this_.css('color','white');$(absent).css('background-color','#e5ebf1');$(absent).css('color','rgba(0, 0, 0, 0.9)');$(late).css('background-color','#e5ebf1');$(late).css('color','rgba(0, 0, 0, 0.9)');},error:function(error){console.log('error')}})}})
$(".absent").click(function(event){event.preventDefault();var this_=$(this)
var pageUrl=this_.attr("data-href")
if(pageUrl){$.ajax({url:pageUrl,method:"GET",data:{'id':this_.attr("id2"),'attendance':'absent',},success:function(data){var attendance='#'+'att'+this_.attr("id2");var present='#'+'present'+this_.attr("id2");var late='#'+'late'+this_.attr("id2");$(attendance).attr('value','absent');this_.css('background-color','#DB2828');this_.css('color','white');$(present).css('background-color','#e5ebf1');$(present).css('color','rgba(0, 0, 0, 0.9)');$(late).css('background-color','#e5ebf1');$(late).css('color','rgba(0, 0, 0, 0.9)');},error:function(error){console.log('error')}})}})
$(".late").click(function(event){event.preventDefault();var this_=$(this)
var pageUrl=this_.attr("data-href")
var attendance='#'+'att'+this_.attr("id2")
if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("id2"),'attendance':'late',},success:function(data){var absent='#'+'absent'+this_.attr("id2")
var present='#'+'present'+this_.attr("id2")
$(attendance).attr('value','late');this_.css('background-color','#FBBD08')
this_.css('color','white')
$(absent).css('background-color','#e5ebf1')
$(absent).css('color','rgba(0, 0, 0, 0.9)')
$(present).css('background-color','#e5ebf1')
$(present).css('color','rgba(0, 0, 0, 0.9)')},error:function(error){console.log('error')}})}})
$(".grade").change(function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
var grade=$(this).val();if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("name"),'grade':grade},dataType:'json',success:function(data){}});}});$(".zhurnal_grade").click(function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
var grade=$('#grade'+this_.attr("name")).val();if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("name"),'grade':grade},dataType:'json',success:function(data){}});}});$(".open_group_details_urok").click(function(event){event.preventDefault();var this_=$(this)
var table_id='#'+this_.attr("id")+'details_urok'
$(table_id).fadeToggle();})
$(".add_group_btn_urok").click(function(e){e.preventDefault()
var this_=$(this)
var squadUrl=this_.attr("data-href")
if(squadUrl){$.ajax({url:squadUrl,data:{'topic_id':this_.attr("topic_id"),'squad_id':this_.attr("squad_id"),'isin':this_.attr("isin"),},success:function(data){if(this_.attr("isin")=='yes'){this_.css('background-color','#F2F2F2')
this_.css('color','black')
this_.attr('isin','no')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").css('background-color','#F2F2F2')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").css('color','black')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").attr('isin','no')
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results_urok').hide()
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results').hide()}
else{this_.css('background-color','#5181b8')
this_.css('color','white')
this_.attr('isin','yes')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").css('background-color','#5181b8')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").css('color','white')
$('#'+this_.attr("topic_id")+this_.attr("squad_id")+"add_group_btn").attr('isin','yes')
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results_urok').show()
$('.'+this_.attr("topic_id")+this_.attr("squad_id")+'squad_results').show()}},error:function(error){console.log('error')}})}})
$(".task_answer").change(function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
var answer=$(this).val();if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("id"),'answer':answer},dataType:'json',success:function(data){this_.attr('placeholder',answer);}});}});$(document).on("click",'.delete_task',function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("id"),},dataType:'json',success:function(data){location.reload()}});}});$(".change_task").click(function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
id=this_.attr("id")
topic_id=this_.attr("topic_id")
var text=$('.change_task_textland'+topic_id).val()
var cost=$('.change_task_costland'+topic_id).val()
console.log(text,cost,$('.change_task_text'+topic_id))
var answer=""
var variant=""
if($(".task_type_"+topic_id).attr("type")=="input"){answer=answer+document.getElementsByClassName('change_task_answer_land'+topic_id)[0].value+"&"}
if($(".task_type_"+topic_id).attr("type")=="test"){for(var i=0;i<document.getElementsByClassName("option_"+topic_id).length;i++){var old_variant=document.getElementsByClassName("option_"+topic_id)[i].getAttribute("value")
variant=variant+document.getElementsByClassName("variant_value_"+topic_id+'v'+old_variant)[0].value+"&"
if(document.getElementsByClassName("option_"+topic_id)[i].checked){answer=answer+document.getElementsByClassName("variant_value_"+topic_id+'v'+old_variant)[0].value+"&"}}}
if(pageUrl){$.ajax({url:pageUrl,data:{'id':id,'text':text,'cost':cost,'answer':answer,'variant':variant,},dataType:'json',success:function(data){location.reload()}});}});;!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,checkVisibility:!0,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",slideTransition:"",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g>0;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i,g-=1;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;c<d;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.$stage.children(".center").removeClass("center"),this.settings.center&&this.$stage.children().eq(this.current()).addClass("center")}}],e.prototype.initializeStage=function(){this.$stage=this.$element.find("."+this.settings.stageClass),this.$stage.length||(this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+">",{class:this.settings.stageClass}).wrap(a("<div/>",{class:this.settings.stageOuterClass})),this.$element.append(this.$stage.parent()))},e.prototype.initializeItems=function(){var b=this.$element.find(".owl-item");if(b.length)return this._items=b.get().map(function(b){return a(b)}),this._mergers=this._items.map(function(){return 1}),void this.refresh();this.replace(this.$element.children().not(this.$stage.parent())),this.isVisible()?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)},e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var a,b,c;a=this.$element.find("img"),b=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,c=this.$element.children(b).width(),a.length&&c<=0&&this.preloadAutoWidthImages(a)}this.initializeStage(),this.initializeItems(),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.isVisible=function(){return!this.settings.checkVisibility||this.$element.is(":visible")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){a<=b&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};b<c;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return!!this._items.length&&(this._width!==this.$element.width()&&(!!this.isVisible()&&(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized")))))},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),!1!==this.settings.responsive&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var e=-1,f=30,g=this.width(),h=this.coordinates();return this.settings.freeDrag||a.each(h,a.proxy(function(a,i){return"left"===c&&b>i-f&&b<i+f?e=a:"right"===c&&b>i-g-f&&b<i-g+f?e=a+1:this.op(b,"<",i)&&this.op(b,">",h[a+1]!==d?h[a+1]:i-g)&&(e="left"===c?a+1:a),-1===e},this)),this.settings.loop||(this.op(b,">",h[this.minimum()])?e=b=this.minimum():this.op(b,"<",h[this.maximum()])&&(e=b=this.maximum())),e},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"+(this.settings.slideTransition?" "+this.settings.slideTransition:"")}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){(a=this.normalize(a))!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||c<1?a=d:(a<0||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){if(b=this._items.length)for(c=this._items[--b].width(),d=this.$element.width();b--&&!((c+=this._items[b].width()+this.settings.margin)>d););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2==0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(e<0),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=-1*f*g),a=c+e,(d=((a-h)%g+g)%g+h)!==a&&d-e<=i&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.isVisible()&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){if(a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0)))return!1;this.leave("animating"),this.trigger("translated")},e.prototype.viewport=function(){var d;return this.options.responsiveBaseElement!==b?d=a(this.options.responsiveBaseElement).width():b.innerWidth?d=b.innerWidth:c.documentElement&&c.documentElement.clientWidth?d=c.documentElement.clientWidth:console.warn("Can not detect viewport width."),d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){(a=this.normalize(a,!0))!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),!1!==this.settings.responsive&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$stage.remove(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:a<c;case">":return d?a<c:a>c;case">=":return d?a<=c:a>=c;case"<=":return d?a>=c:a<=c}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&-1!==a.namespace.indexOf("owl")?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.isVisible(),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.isVisible()!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type)){var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&-1*e||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);for(c.lazyLoadEager>0&&(e+=c.lazyLoadEager,c.loop&&(g-=c.lazyLoadEager,e++));f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1,lazyLoadEager:0},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src")||f.attr("data-srcset");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):f.is("source")?f.one("load.owl.lazy",a.proxy(function(){this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("srcset",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":'url("'+g+'")',opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(c){this._core=c,this._previousHeight=null,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"===a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._intervalId=null;var d=this;a(b).on("load",function(){d._core.settings.autoHeight&&d.update()}),a(b).resize(function(){d._core.settings.autoHeight&&(null!=d._intervalId&&clearTimeout(d._intervalId),d._intervalId=setTimeout(function(){d.update()},250))})};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.settings.lazyLoad,e=this._core.$stage.children().toArray().slice(b,c),f=[],g=0;a.each(e,function(b,c){f.push(a(c).height())}),g=Math.max.apply(null,f),g<=1&&d&&this._previousHeight&&(g=this._previousHeight),this._previousHeight=g,this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?"width:"+c.width+"px;height:"+c.height+"px;":"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(c){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?a("<div/>",{class:"owl-video-tn "+j,srcType:c}):a("<div/>",{class:"owl-video-tn",style:"opacity:1;background-image:url("+c+")"}),b.after(d),b.after(e)};if(b.wrap(a("<div/>",{class:"owl-video-wrapper",style:g})),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length)return l(h.attr(i)),h.remove(),!1;"youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}})},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),c=a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'),c.attr("height",h),c.attr("width",g),"youtube"===f.type?c.attr("src","//www.youtube.com/embed/"+f.id+"?autoplay=1&rel=0&v="+f.id):"vimeo"===f.type?c.attr("src","//player.vimeo.com/video/"+f.id+"?autoplay=1"):"vzaar"===f.type&&c.attr("src","//view.vzaar.com/"+f.id+"/player?autoplay=true"),a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&a.support.animation&&a.support.transition){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.one(a.support.animation.end,c).css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g)),f&&e.one(a.support.animation.end,c).addClass("animated owl-animated-in").addClass(f))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.onTransitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._call=null,this._time=0,this._timeout=0,this._paused=!0,this._handlers={"changed.owl.carousel":a.proxy(function(a){a.namespace&&"settings"===a.property.name?this._core.settings.autoplay?this.play():this.stop():a.namespace&&"position"===a.property.name&&this._paused&&(this._time=0)},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoplay&&this.play()},this),"play.owl.autoplay":a.proxy(function(a,b,c){a.namespace&&this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(a){a.namespace&&this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.play()},this),"touchstart.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"touchend.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this.play()},this)},this._core.$element.on(this._handlers),this._core.options=a.extend({},e.Defaults,this._core.options)};e.Defaults={autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1},e.prototype._next=function(d){this._call=b.setTimeout(a.proxy(this._next,this,d),this._timeout*(Math.round(this.read()/this._timeout)+1)-this.read()),this._core.is("interacting")||c.hidden||this._core.next(d||this._core.settings.autoplaySpeed)},e.prototype.read=function(){return(new Date).getTime()-this._time},e.prototype.play=function(c,d){var e;this._core.is("rotating")||this._core.enter("rotating"),c=c||this._core.settings.autoplayTimeout,e=Math.min(this._time%(this._timeout||c),c),this._paused?(this._time=this.read(),this._paused=!1):b.clearTimeout(this._call),this._time+=this.read()%c-e,this._timeout=c,this._call=b.setTimeout(a.proxy(this._next,this,d),c-e)},e.prototype.stop=function(){this._core.is("rotating")&&(this._time=0,this._paused=!0,b.clearTimeout(this._call),this._core.leave("rotating"))},e.prototype.pause=function(){this._core.is("rotating")&&!this._paused&&(this._time=this.read(),this._paused=!0,b.clearTimeout(this._call))},e.prototype.destroy=function(){var a,b;this.stop();for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(b){this._core=b,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){b.namespace&&this._core.settings.dotsData&&this._templates.push('<div class="'+this._core.settings.dotClass+'">'+a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot")+"</div>")},this),"added.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,0,this._templates.pop())},this),"remove.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&this.draw()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&!this._initialized&&(this._core.trigger("initialize",null,"navigation"),this.initialize(),this.update(),this.draw(),this._initialized=!0,this._core.trigger("initialized",null,"navigation"))},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._initialized&&(this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation"))},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers)};e.Defaults={nav:!1,navText:['<span aria-label="Previous">&#x2039;</span>','<span aria-label="Next">&#x203a;</span>'],navSpeed:!1,navElement:'button type="button" role="presentation"',navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotsData:!1,dotsSpeed:!1,dotsContainer:!1},e.prototype.initialize=function(){var b,c=this._core.settings;this._controls.$relative=(c.navContainer?a(c.navContainer):a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"),this._controls.$previous=a("<"+c.navElement+">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click",a.proxy(function(a){this.prev(c.navSpeed)},this)),this._controls.$next=a("<"+c.navElement+">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click",a.proxy(function(a){this.next(c.navSpeed)},this)),c.dotsData||(this._templates=[a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),this._controls.$absolute=(c.dotsContainer?a(c.dotsContainer):a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"),this._controls.$absolute.on("click","button",a.proxy(function(b){var d=a(b.target).parent().is(this._controls.$absolute)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(d,c.dotsSpeed)},this));for(b in this._overrides)this._core[b]=a.proxy(this[b],this)},e.prototype.destroy=function(){var a,b,c,d,e;e=this._core.settings;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)"$relative"===b&&e.navContainer?this._controls[b].html(""):this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},e.prototype.update=function(){var a,b,c,d=this._core.clones().length/2,e=d+this._core.items().length,f=this._core.maximum(!0),g=this._core.settings,h=g.center||g.autoWidth||g.dotsData?1:g.dotsEach||g.items;if("page"!==g.slideBy&&(g.slideBy=Math.min(g.slideBy,g.items)),g.dots||"page"==g.slideBy)for(this._pages=[],a=d,b=0,c=0;a<e;a++){if(b>=h||0===b){if(this._pages.push({start:Math.min(f,a-d),end:a-d+h-1}),Math.min(f,a-d)===f)break;b=0,++c}b+=this._core.mergers(this._core.relative(a))}},e.prototype.draw=function(){var b,c=this._core.settings,d=this._core.items().length<=c.items,e=this._core.relative(this._core.current()),f=c.loop||c.rewind;this._controls.$relative.toggleClass("disabled",!c.nav||d),c.nav&&(this._controls.$previous.toggleClass("disabled",!f&&e<=this._core.minimum(!0)),this._controls.$next.toggleClass("disabled",!f&&e>=this._core.maximum(!0))),this._controls.$absolute.toggleClass("disabled",!c.dots||d),c.dots&&(b=this._pages.length-this._controls.$absolute.children().length,c.dotsData&&0!==b?this._controls.$absolute.html(this._templates.join("")):b>0?this._controls.$absolute.append(new Array(b+1).join(this._templates[0])):b<0&&this._controls.$absolute.children().slice(b).remove(),this._controls.$absolute.find(".active").removeClass("active"),this._controls.$absolute.children().eq(a.inArray(this.current(),this._pages)).addClass("active"))},e.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotsData?1:c.dotsEach||c.items)}},e.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,a.proxy(function(a,c){return a.start<=b&&a.end>=b},this)).pop()},e.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},e.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},e.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},e.prototype.to=function(b,c,d){var e;!d&&this._pages.length?(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c)):a.proxy(this._overrides.to,this._core)(b,c)},a.fn.owlCarousel.Constructor.Plugins.Navigation=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(c){this._core=c,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(c){c.namespace&&"URLHash"===this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");if(!c)return;this._hashes[c]=b.content}},this),"changed.owl.carousel":a.proxy(function(c){if(c.namespace&&"position"===c.property.name){var d=this._core.items(this._core.relative(this._core.current())),e=a.map(this._hashes,function(a,b){return a===d?b:null}).join();if(!e||b.location.hash.slice(1)===e)return;b.location.hash=e}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(a){var c=b.location.hash.substring(1),e=this._core.$stage.children(),f=this._hashes[c]&&e.index(this._hashes[c]);f!==d&&f!==this._core.current()&&this._core.to(this._core.relative(f),!1,!0)},this))};e.Defaults={URLhashListener:!1},e.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){function e(b,c){var e=!1,f=b.charAt(0).toUpperCase()+b.slice(1);return a.each((b+" "+h.join(f+" ")+f).split(" "),function(a,b){if(g[b]!==d)return e=!c||b,!1}),e}function f(a){return e(a,!0)}var g=a("<support>").get(0).style,h="Webkit Moz O ms".split(" "),i={transition:{end:{WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}},animation:{end:{WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd",animation:"animationend"}}},j={csstransforms:function(){return!!e("transform")},csstransforms3d:function(){return!!e("perspective")},csstransitions:function(){return!!e("transition")},cssanimations:function(){return!!e("animation")}};j.csstransitions()&&(a.support.transition=new String(f("transition")),a.support.transition.end=i.transition.end[a.support.transition]),j.cssanimations()&&(a.support.animation=new String(f("animation")),a.support.animation.end=i.animation.end[a.support.animation]),j.csstransforms()&&(a.support.transform=new String(f("transform")),a.support.transform3d=j.csstransforms3d())}(window.Zepto||window.jQuery,window,document);;!function(t,e,i){!function(){var s,a,n,h="2.2.3",o="datepicker",r=".datepicker-here",c=!1,d='<div class="datepicker"><i class="datepicker--pointer"></i><nav class="datepicker--nav"></nav><div class="datepicker--content"></div></div>',l={classes:"",inline:!1,language:"ru",startDate:new Date,firstDay:"",weekends:[6,0],dateFormat:"",altField:"",altFieldDateFormat:"@",toggleSelected:!0,keyboardNav:!0,position:"bottom left",offset:12,view:"days",minView:"days",showOtherMonths:!0,selectOtherMonths:!0,moveToOtherMonthsOnSelect:!0,showOtherYears:!0,selectOtherYears:!0,moveToOtherYearsOnSelect:!0,minDate:"",maxDate:"",disableNavWhenOutOfRange:!0,multipleDates:!1,multipleDatesSeparator:",",range:!1,todayButton:!1,clearButton:!1,showEvent:"focus",autoClose:!1,monthsField:"monthsShort",prevHtml:'<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',nextHtml:'<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',navTitles:{days:"MM, <i>yyyy</i>",months:"yyyy",years:"yyyy1 - yyyy2"},timepicker:!1,onlyTimepicker:!1,dateTimeSeparator:" ",timeFormat:"",minHours:0,maxHours:24,minMinutes:0,maxMinutes:59,hoursStep:1,minutesStep:1,onSelect:"",onShow:"",onHide:"",onChangeMonth:"",onChangeYear:"",onChangeDecade:"",onChangeView:"",onRenderCell:""},u={ctrlRight:[17,39],ctrlUp:[17,38],ctrlLeft:[17,37],ctrlDown:[17,40],shiftRight:[16,39],shiftUp:[16,38],shiftLeft:[16,37],shiftDown:[16,40],altUp:[18,38],altRight:[18,39],altLeft:[18,37],altDown:[18,40],ctrlShiftUp:[16,17,38]},m=function(t,a){this.el=t,this.$el=e(t),this.opts=e.extend(!0,{},l,a,this.$el.data()),s==i&&(s=e("body")),this.opts.startDate||(this.opts.startDate=new Date),"INPUT"==this.el.nodeName&&(this.elIsInput=!0),this.opts.altField&&(this.$altField="string"==typeof this.opts.altField?e(this.opts.altField):this.opts.altField),this.inited=!1,this.visible=!1,this.silent=!1,this.currentDate=this.opts.startDate,this.currentView=this.opts.view,this._createShortCuts(),this.selectedDates=[],this.views={},this.keys=[],this.minRange="",this.maxRange="",this._prevOnSelectValue="",this.init()};n=m,n.prototype={VERSION:h,viewIndexes:["days","months","years"],init:function(){c||this.opts.inline||!this.elIsInput||this._buildDatepickersContainer(),this._buildBaseHtml(),this._defineLocale(this.opts.language),this._syncWithMinMaxDates(),this.elIsInput&&(this.opts.inline||(this._setPositionClasses(this.opts.position),this._bindEvents()),this.opts.keyboardNav&&!this.opts.onlyTimepicker&&this._bindKeyboardEvents(),this.$datepicker.on("mousedown",this._onMouseDownDatepicker.bind(this)),this.$datepicker.on("mouseup",this._onMouseUpDatepicker.bind(this))),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.timepicker&&(this.timepicker=new e.fn.datepicker.Timepicker(this,this.opts),this._bindTimepickerEvents()),this.opts.onlyTimepicker&&this.$datepicker.addClass("-only-timepicker-"),this.views[this.currentView]=new e.fn.datepicker.Body(this,this.currentView,this.opts),this.views[this.currentView].show(),this.nav=new e.fn.datepicker.Navigation(this,this.opts),this.view=this.currentView,this.$el.on("clickCell.adp",this._onClickCell.bind(this)),this.$datepicker.on("mouseenter",".datepicker--cell",this._onMouseEnterCell.bind(this)),this.$datepicker.on("mouseleave",".datepicker--cell",this._onMouseLeaveCell.bind(this)),this.inited=!0},_createShortCuts:function(){this.minDate=this.opts.minDate?this.opts.minDate:new Date(-86399999136e5),this.maxDate=this.opts.maxDate?this.opts.maxDate:new Date(86399999136e5)},_bindEvents:function(){this.$el.on(this.opts.showEvent+".adp",this._onShowEvent.bind(this)),this.$el.on("mouseup.adp",this._onMouseUpEl.bind(this)),this.$el.on("blur.adp",this._onBlur.bind(this)),this.$el.on("keyup.adp",this._onKeyUpGeneral.bind(this)),e(t).on("resize.adp",this._onResize.bind(this)),e("body").on("mouseup.adp",this._onMouseUpBody.bind(this))},_bindKeyboardEvents:function(){this.$el.on("keydown.adp",this._onKeyDown.bind(this)),this.$el.on("keyup.adp",this._onKeyUp.bind(this)),this.$el.on("hotKey.adp",this._onHotKey.bind(this))},_bindTimepickerEvents:function(){this.$el.on("timeChange.adp",this._onTimeChange.bind(this))},isWeekend:function(t){return-1!==this.opts.weekends.indexOf(t)},_defineLocale:function(t){"string"==typeof t?(this.loc=e.fn.datepicker.language[t],this.loc||(console.warn("Can't find language \""+t+'" in Datepicker.language, will use "ru" instead'),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru)),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,e.fn.datepicker.language[t])):this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,t),this.opts.dateFormat&&(this.loc.dateFormat=this.opts.dateFormat),this.opts.timeFormat&&(this.loc.timeFormat=this.opts.timeFormat),""!==this.opts.firstDay&&(this.loc.firstDay=this.opts.firstDay),this.opts.timepicker&&(this.loc.dateFormat=[this.loc.dateFormat,this.loc.timeFormat].join(this.opts.dateTimeSeparator)),this.opts.onlyTimepicker&&(this.loc.dateFormat=this.loc.timeFormat);var i=this._getWordBoundaryRegExp;(this.loc.timeFormat.match(i("aa"))||this.loc.timeFormat.match(i("AA")))&&(this.ampm=!0)},_buildDatepickersContainer:function(){c=!0,s.append('<div class="datepickers-container" id="datepickers-container"></div>'),a=e("#datepickers-container")},_buildBaseHtml:function(){var t,i=e('<div class="datepicker-inline">');t="INPUT"==this.el.nodeName?this.opts.inline?i.insertAfter(this.$el):a:i.appendTo(this.$el),this.$datepicker=e(d).appendTo(t),this.$content=e(".datepicker--content",this.$datepicker),this.$nav=e(".datepicker--nav",this.$datepicker)},_triggerOnChange:function(){if(!this.selectedDates.length){if(""===this._prevOnSelectValue)return;return this._prevOnSelectValue="",this.opts.onSelect("","",this)}var t,e=this.selectedDates,i=n.getParsedDate(e[0]),s=this,a=new Date(i.year,i.month,i.date,i.hours,i.minutes);t=e.map(function(t){return s.formatDate(s.loc.dateFormat,t)}).join(this.opts.multipleDatesSeparator),(this.opts.multipleDates||this.opts.range)&&(a=e.map(function(t){var e=n.getParsedDate(t);return new Date(e.year,e.month,e.date,e.hours,e.minutes)})),this._prevOnSelectValue=t,this.opts.onSelect(t,a,this)},next:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month+1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year+1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year+10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},prev:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month-1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year-1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year-10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},formatDate:function(t,e){e=e||this.date;var i,s=t,a=this._getWordBoundaryRegExp,h=this.loc,o=n.getLeadingZeroNum,r=n.getDecade(e),c=n.getParsedDate(e),d=c.fullHours,l=c.hours,u=t.match(a("aa"))||t.match(a("AA")),m="am",p=this._replacer;switch(this.opts.timepicker&&this.timepicker&&u&&(i=this.timepicker._getValidHoursFromDate(e,u),d=o(i.hours),l=i.hours,m=i.dayPeriod),!0){case/@/.test(s):s=s.replace(/@/,e.getTime());case/aa/.test(s):s=p(s,a("aa"),m);case/AA/.test(s):s=p(s,a("AA"),m.toUpperCase());case/dd/.test(s):s=p(s,a("dd"),c.fullDate);case/d/.test(s):s=p(s,a("d"),c.date);case/DD/.test(s):s=p(s,a("DD"),h.days[c.day]);case/D/.test(s):s=p(s,a("D"),h.daysShort[c.day]);case/mm/.test(s):s=p(s,a("mm"),c.fullMonth);case/m/.test(s):s=p(s,a("m"),c.month+1);case/MM/.test(s):s=p(s,a("MM"),this.loc.months[c.month]);case/M/.test(s):s=p(s,a("M"),h.monthsShort[c.month]);case/ii/.test(s):s=p(s,a("ii"),c.fullMinutes);case/i/.test(s):s=p(s,a("i"),c.minutes);case/hh/.test(s):s=p(s,a("hh"),d);case/h/.test(s):s=p(s,a("h"),l);case/yyyy/.test(s):s=p(s,a("yyyy"),c.year);case/yyyy1/.test(s):s=p(s,a("yyyy1"),r[0]);case/yyyy2/.test(s):s=p(s,a("yyyy2"),r[1]);case/yy/.test(s):s=p(s,a("yy"),c.year.toString().slice(-2))}return s},_replacer:function(t,e,i){return t.replace(e,function(t,e,s,a){return e+i+a})},_getWordBoundaryRegExp:function(t){var e="\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;";return new RegExp("(^|>|"+e+")("+t+")($|<|"+e+")","g")},selectDate:function(t){var e=this,i=e.opts,s=e.parsedDate,a=e.selectedDates,h=a.length,o="";if(Array.isArray(t))return void t.forEach(function(t){e.selectDate(t)});if(t instanceof Date){if(this.lastSelectedDate=t,this.timepicker&&this.timepicker._setTime(t),e._trigger("selectDate",t),this.timepicker&&(t.setHours(this.timepicker.hours),t.setMinutes(this.timepicker.minutes)),"days"==e.view&&t.getMonth()!=s.month&&i.moveToOtherMonthsOnSelect&&(o=new Date(t.getFullYear(),t.getMonth(),1)),"years"==e.view&&t.getFullYear()!=s.year&&i.moveToOtherYearsOnSelect&&(o=new Date(t.getFullYear(),0,1)),o&&(e.silent=!0,e.date=o,e.silent=!1,e.nav._render()),i.multipleDates&&!i.range){if(h===i.multipleDates)return;e._isSelected(t)||e.selectedDates.push(t)}else i.range?2==h?(e.selectedDates=[t],e.minRange=t,e.maxRange=""):1==h?(e.selectedDates.push(t),e.maxRange?e.minRange=t:e.maxRange=t,n.bigger(e.maxRange,e.minRange)&&(e.maxRange=e.minRange,e.minRange=t),e.selectedDates=[e.minRange,e.maxRange]):(e.selectedDates=[t],e.minRange=t):e.selectedDates=[t];e._setInputValue(),i.onSelect&&e._triggerOnChange(),i.autoClose&&!this.timepickerIsActive&&(i.multipleDates||i.range?i.range&&2==e.selectedDates.length&&e.hide():e.hide()),e.views[this.currentView]._render()}},removeDate:function(t){var e=this.selectedDates,i=this;if(t instanceof Date)return e.some(function(s,a){return n.isSame(s,t)?(e.splice(a,1),i.selectedDates.length?i.lastSelectedDate=i.selectedDates[i.selectedDates.length-1]:(i.minRange="",i.maxRange="",i.lastSelectedDate=""),i.views[i.currentView]._render(),i._setInputValue(),i.opts.onSelect&&i._triggerOnChange(),!0):void 0})},today:function(){this.silent=!0,this.view=this.opts.minView,this.silent=!1,this.date=new Date,this.opts.todayButton instanceof Date&&this.selectDate(this.opts.todayButton)},clear:function(){this.selectedDates=[],this.minRange="",this.maxRange="",this.views[this.currentView]._render(),this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()},update:function(t,i){var s=arguments.length,a=this.lastSelectedDate;return 2==s?this.opts[t]=i:1==s&&"object"==typeof t&&(this.opts=e.extend(!0,this.opts,t)),this._createShortCuts(),this._syncWithMinMaxDates(),this._defineLocale(this.opts.language),this.nav._addButtonsIfNeed(),this.opts.onlyTimepicker||this.nav._render(),this.views[this.currentView]._render(),this.elIsInput&&!this.opts.inline&&(this._setPositionClasses(this.opts.position),this.visible&&this.setPosition(this.opts.position)),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.onlyTimepicker&&this.$datepicker.addClass("-only-timepicker-"),this.opts.timepicker&&(a&&this.timepicker._handleDate(a),this.timepicker._updateRanges(),this.timepicker._updateCurrentTime(),a&&(a.setHours(this.timepicker.hours),a.setMinutes(this.timepicker.minutes))),this._setInputValue(),this},_syncWithMinMaxDates:function(){var t=this.date.getTime();this.silent=!0,this.minTime>t&&(this.date=this.minDate),this.maxTime<t&&(this.date=this.maxDate),this.silent=!1},_isSelected:function(t,e){var i=!1;return this.selectedDates.some(function(s){return n.isSame(s,t,e)?(i=s,!0):void 0}),i},_setInputValue:function(){var t,e=this,i=e.opts,s=e.loc.dateFormat,a=i.altFieldDateFormat,n=e.selectedDates.map(function(t){return e.formatDate(s,t)});i.altField&&e.$altField.length&&(t=this.selectedDates.map(function(t){return e.formatDate(a,t)}),t=t.join(this.opts.multipleDatesSeparator),this.$altField.val(t)),n=n.join(this.opts.multipleDatesSeparator),this.$el.val(n)},_isInRange:function(t,e){var i=t.getTime(),s=n.getParsedDate(t),a=n.getParsedDate(this.minDate),h=n.getParsedDate(this.maxDate),o=new Date(s.year,s.month,a.date).getTime(),r=new Date(s.year,s.month,h.date).getTime(),c={day:i>=this.minTime&&i<=this.maxTime,month:o>=this.minTime&&r<=this.maxTime,year:s.year>=a.year&&s.year<=h.year};return e?c[e]:c.day},_getDimensions:function(t){var e=t.offset();return{width:t.outerWidth(),height:t.outerHeight(),left:e.left,top:e.top}},_getDateFromCell:function(t){var e=this.parsedDate,s=t.data("year")||e.year,a=t.data("month")==i?e.month:t.data("month"),n=t.data("date")||1;return new Date(s,a,n)},_setPositionClasses:function(t){t=t.split(" ");var e=t[0],i=t[1],s="datepicker -"+e+"-"+i+"- -from-"+e+"-";this.visible&&(s+=" active"),this.$datepicker.removeAttr("class").addClass(s)},setPosition:function(t){t=t||this.opts.position;var e,i,s=this._getDimensions(this.$el),a=this._getDimensions(this.$datepicker),n=t.split(" "),h=this.opts.offset,o=n[0],r=n[1];switch(o){case"top":e=s.top-a.height-h;break;case"right":i=s.left+s.width+h;break;case"bottom":e=s.top+s.height+h;break;case"left":i=s.left-a.width-h}switch(r){case"top":e=s.top;break;case"right":i=s.left+s.width-a.width;break;case"bottom":e=s.top+s.height-a.height;break;case"left":i=s.left;break;case"center":/left|right/.test(o)?e=s.top+s.height/2-a.height/2:i=s.left+s.width/2-a.width/2}this.$datepicker.css({left:i,top:e})},show:function(){var t=this.opts.onShow;this.setPosition(this.opts.position),this.$datepicker.addClass("active"),this.visible=!0,t&&this._bindVisionEvents(t)},hide:function(){var t=this.opts.onHide;this.$datepicker.removeClass("active").css({left:"-100000px"}),this.focused="",this.keys=[],this.inFocus=!1,this.visible=!1,this.$el.blur(),t&&this._bindVisionEvents(t)},down:function(t){this._changeView(t,"down")},up:function(t){this._changeView(t,"up")},_bindVisionEvents:function(t){this.$datepicker.off("transitionend.dp"),t(this,!1),this.$datepicker.one("transitionend.dp",t.bind(this,this,!0))},_changeView:function(t,e){t=t||this.focused||this.date;var i="up"==e?this.viewIndex+1:this.viewIndex-1;i>2&&(i=2),0>i&&(i=0),this.silent=!0,this.date=new Date(t.getFullYear(),t.getMonth(),1),this.silent=!1,this.view=this.viewIndexes[i]},_handleHotKey:function(t){var e,i,s,a=n.getParsedDate(this._getFocusedDate()),h=this.opts,o=!1,r=!1,c=!1,d=a.year,l=a.month,u=a.date;switch(t){case"ctrlRight":case"ctrlUp":l+=1,o=!0;break;case"ctrlLeft":case"ctrlDown":l-=1,o=!0;break;case"shiftRight":case"shiftUp":r=!0,d+=1;break;case"shiftLeft":case"shiftDown":r=!0,d-=1;break;case"altRight":case"altUp":c=!0,d+=10;break;case"altLeft":case"altDown":c=!0,d-=10;break;case"ctrlShiftUp":this.up()}s=n.getDaysCount(new Date(d,l)),i=new Date(d,l,u),u>s&&(u=s),i.getTime()<this.minTime?i=this.minDate:i.getTime()>this.maxTime&&(i=this.maxDate),this.focused=i,e=n.getParsedDate(i),o&&h.onChangeMonth&&h.onChangeMonth(e.month,e.year),r&&h.onChangeYear&&h.onChangeYear(e.year),c&&h.onChangeDecade&&h.onChangeDecade(this.curDecade)},_registerKey:function(t){var e=this.keys.some(function(e){return e==t});e||this.keys.push(t)},_unRegisterKey:function(t){var e=this.keys.indexOf(t);this.keys.splice(e,1)},_isHotKeyPressed:function(){var t,e=!1,i=this,s=this.keys.sort();for(var a in u)t=u[a],s.length==t.length&&t.every(function(t,e){return t==s[e]})&&(i._trigger("hotKey",a),e=!0);return e},_trigger:function(t,e){this.$el.trigger(t,e)},_focusNextCell:function(t,e){e=e||this.cellType;var i=n.getParsedDate(this._getFocusedDate()),s=i.year,a=i.month,h=i.date;if(!this._isHotKeyPressed()){switch(t){case 37:"day"==e?h-=1:"","month"==e?a-=1:"","year"==e?s-=1:"";break;case 38:"day"==e?h-=7:"","month"==e?a-=3:"","year"==e?s-=4:"";break;case 39:"day"==e?h+=1:"","month"==e?a+=1:"","year"==e?s+=1:"";break;case 40:"day"==e?h+=7:"","month"==e?a+=3:"","year"==e?s+=4:""}var o=new Date(s,a,h);o.getTime()<this.minTime?o=this.minDate:o.getTime()>this.maxTime&&(o=this.maxDate),this.focused=o}},_getFocusedDate:function(){var t=this.focused||this.selectedDates[this.selectedDates.length-1],e=this.parsedDate;if(!t)switch(this.view){case"days":t=new Date(e.year,e.month,(new Date).getDate());break;case"months":t=new Date(e.year,e.month,1);break;case"years":t=new Date(e.year,0,1)}return t},_getCell:function(t,i){i=i||this.cellType;var s,a=n.getParsedDate(t),h='.datepicker--cell[data-year="'+a.year+'"]';switch(i){case"month":h='[data-month="'+a.month+'"]';break;case"day":h+='[data-month="'+a.month+'"][data-date="'+a.date+'"]'}return s=this.views[this.currentView].$el.find(h),s.length?s:e("")},destroy:function(){var t=this;t.$el.off(".adp").data("datepicker",""),t.selectedDates=[],t.focused="",t.views={},t.keys=[],t.minRange="",t.maxRange="",t.opts.inline||!t.elIsInput?t.$datepicker.closest(".datepicker-inline").remove():t.$datepicker.remove()},_handleAlreadySelectedDates:function(t,e){this.opts.range?this.opts.toggleSelected?this.removeDate(e):2!=this.selectedDates.length&&this._trigger("clickCell",e):this.opts.toggleSelected&&this.removeDate(e),this.opts.toggleSelected||(this.lastSelectedDate=t,this.opts.timepicker&&(this.timepicker._setTime(t),this.timepicker.update()))},_onShowEvent:function(t){this.visible||this.show()},_onBlur:function(){!this.inFocus&&this.visible&&this.hide()},_onMouseDownDatepicker:function(t){this.inFocus=!0},_onMouseUpDatepicker:function(t){this.inFocus=!1,t.originalEvent.inFocus=!0,t.originalEvent.timepickerFocus||this.$el.focus()},_onKeyUpGeneral:function(t){var e=this.$el.val();e||this.clear()},_onResize:function(){this.visible&&this.setPosition()},_onMouseUpBody:function(t){t.originalEvent.inFocus||this.visible&&!this.inFocus&&this.hide()},_onMouseUpEl:function(t){t.originalEvent.inFocus=!0,setTimeout(this._onKeyUpGeneral.bind(this),4)},_onKeyDown:function(t){var e=t.which;if(this._registerKey(e),e>=37&&40>=e&&(t.preventDefault(),this._focusNextCell(e)),13==e&&this.focused){if(this._getCell(this.focused).hasClass("-disabled-"))return;if(this.view!=this.opts.minView)this.down();else{var i=this._isSelected(this.focused,this.cellType);if(!i)return this.timepicker&&(this.focused.setHours(this.timepicker.hours),this.focused.setMinutes(this.timepicker.minutes)),void this.selectDate(this.focused);this._handleAlreadySelectedDates(i,this.focused)}}27==e&&this.hide()},_onKeyUp:function(t){var e=t.which;this._unRegisterKey(e)},_onHotKey:function(t,e){this._handleHotKey(e)},_onMouseEnterCell:function(t){var i=e(t.target).closest(".datepicker--cell"),s=this._getDateFromCell(i);this.silent=!0,this.focused&&(this.focused=""),i.addClass("-focus-"),this.focused=s,this.silent=!1,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this.focused)&&(this.maxRange=this.minRange,this.minRange=""),this.views[this.currentView]._update())},_onMouseLeaveCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.removeClass("-focus-"),this.silent=!0,this.focused="",this.silent=!1},_onTimeChange:function(t,e,i){var s=new Date,a=this.selectedDates,n=!1;a.length&&(n=!0,s=this.lastSelectedDate),s.setHours(e),s.setMinutes(i),n||this._getCell(s).hasClass("-disabled-")?(this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()):this.selectDate(s)},_onClickCell:function(t,e){this.timepicker&&(e.setHours(this.timepicker.hours),e.setMinutes(this.timepicker.minutes)),this.selectDate(e)},set focused(t){if(!t&&this.focused){var e=this._getCell(this.focused);e.length&&e.removeClass("-focus-")}this._focused=t,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this._focused)&&(this.maxRange=this.minRange,this.minRange="")),this.silent||(this.date=t)},get focused(){return this._focused},get parsedDate(){return n.getParsedDate(this.date)},set date(t){return t instanceof Date?(this.currentDate=t,this.inited&&!this.silent&&(this.views[this.view]._render(),this.nav._render(),this.visible&&this.elIsInput&&this.setPosition()),t):void 0},get date(){return this.currentDate},set view(t){return this.viewIndex=this.viewIndexes.indexOf(t),this.viewIndex<0?void 0:(this.prevView=this.currentView,this.currentView=t,this.inited&&(this.views[t]?this.views[t]._render():this.views[t]=new e.fn.datepicker.Body(this,t,this.opts),this.views[this.prevView].hide(),this.views[t].show(),this.nav._render(),this.opts.onChangeView&&this.opts.onChangeView(t),this.elIsInput&&this.visible&&this.setPosition()),t)},get view(){return this.currentView},get cellType(){return this.view.substring(0,this.view.length-1)},get minTime(){var t=n.getParsedDate(this.minDate);return new Date(t.year,t.month,t.date).getTime()},get maxTime(){var t=n.getParsedDate(this.maxDate);return new Date(t.year,t.month,t.date).getTime()},get curDecade(){return n.getDecade(this.date)}},n.getDaysCount=function(t){return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()},n.getParsedDate=function(t){return{year:t.getFullYear(),month:t.getMonth(),fullMonth:t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,date:t.getDate(),fullDate:t.getDate()<10?"0"+t.getDate():t.getDate(),day:t.getDay(),hours:t.getHours(),fullHours:t.getHours()<10?"0"+t.getHours():t.getHours(),minutes:t.getMinutes(),fullMinutes:t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes()}},n.getDecade=function(t){var e=10*Math.floor(t.getFullYear()/10);return[e,e+9]},n.template=function(t,e){return t.replace(/#\{([\w]+)\}/g,function(t,i){return e[i]||0===e[i]?e[i]:void 0})},n.isSame=function(t,e,i){if(!t||!e)return!1;var s=n.getParsedDate(t),a=n.getParsedDate(e),h=i?i:"day",o={day:s.date==a.date&&s.month==a.month&&s.year==a.year,month:s.month==a.month&&s.year==a.year,year:s.year==a.year};return o[h]},n.less=function(t,e,i){return t&&e?e.getTime()<t.getTime():!1},n.bigger=function(t,e,i){return t&&e?e.getTime()>t.getTime():!1},n.getLeadingZeroNum=function(t){return parseInt(t)<10?"0"+t:t},n.resetTime=function(t){return"object"==typeof t?(t=n.getParsedDate(t),new Date(t.year,t.month,t.date)):void 0},e.fn.datepicker=function(t){return this.each(function(){if(e.data(this,o)){var i=e.data(this,o);i.opts=e.extend(!0,i.opts,t),i.update()}else e.data(this,o,new m(this,t))})},e.fn.datepicker.Constructor=m,e.fn.datepicker.language={ru:{days:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],daysShort:["Вос","Пон","Вто","Сре","Чет","Пят","Суб"],daysMin:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthsShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],today:"Сегодня",clear:"Очистить",dateFormat:"dd.mm.yyyy",timeFormat:"hh:ii",firstDay:1}},e(function(){e(r).datepicker()})}(),function(){var t={days:'<div class="datepicker--days datepicker--body"><div class="datepicker--days-names"></div><div class="datepicker--cells datepicker--cells-days"></div></div>',months:'<div class="datepicker--months datepicker--body"><div class="datepicker--cells datepicker--cells-months"></div></div>',years:'<div class="datepicker--years datepicker--body"><div class="datepicker--cells datepicker--cells-years"></div></div>'},s=e.fn.datepicker,a=s.Constructor;s.Body=function(t,i,s){this.d=t,this.type=i,this.opts=s,this.$el=e(""),this.opts.onlyTimepicker||this.init()},s.Body.prototype={init:function(){this._buildBaseHtml(),this._render(),this._bindEvents()},_bindEvents:function(){this.$el.on("click",".datepicker--cell",e.proxy(this._onClickCell,this))},_buildBaseHtml:function(){this.$el=e(t[this.type]).appendTo(this.d.$content),this.$names=e(".datepicker--days-names",this.$el),this.$cells=e(".datepicker--cells",this.$el)},_getDayNamesHtml:function(t,e,s,a){return e=e!=i?e:t,s=s?s:"",a=a!=i?a:0,a>7?s:7==e?this._getDayNamesHtml(t,0,s,++a):(s+='<div class="datepicker--day-name'+(this.d.isWeekend(e)?" -weekend-":"")+'">'+this.d.loc.daysMin[e]+"</div>",this._getDayNamesHtml(t,++e,s,++a))},_getCellContents:function(t,e){var i="datepicker--cell datepicker--cell-"+e,s=new Date,n=this.d,h=a.resetTime(n.minRange),o=a.resetTime(n.maxRange),r=n.opts,c=a.getParsedDate(t),d={},l=c.date;switch(e){case"day":n.isWeekend(c.day)&&(i+=" -weekend-"),c.month!=this.d.parsedDate.month&&(i+=" -other-month-",r.selectOtherMonths||(i+=" -disabled-"),r.showOtherMonths||(l=""));break;case"month":l=n.loc[n.opts.monthsField][c.month];break;case"year":var u=n.curDecade;l=c.year,(c.year<u[0]||c.year>u[1])&&(i+=" -other-decade-",r.selectOtherYears||(i+=" -disabled-"),r.showOtherYears||(l=""))}return r.onRenderCell&&(d=r.onRenderCell(t,e)||{},l=d.html?d.html:l,i+=d.classes?" "+d.classes:""),r.range&&(a.isSame(h,t,e)&&(i+=" -range-from-"),a.isSame(o,t,e)&&(i+=" -range-to-"),1==n.selectedDates.length&&n.focused?((a.bigger(h,t)&&a.less(n.focused,t)||a.less(o,t)&&a.bigger(n.focused,t))&&(i+=" -in-range-"),a.less(o,t)&&a.isSame(n.focused,t)&&(i+=" -range-from-"),a.bigger(h,t)&&a.isSame(n.focused,t)&&(i+=" -range-to-")):2==n.selectedDates.length&&a.bigger(h,t)&&a.less(o,t)&&(i+=" -in-range-")),a.isSame(s,t,e)&&(i+=" -current-"),n.focused&&a.isSame(t,n.focused,e)&&(i+=" -focus-"),n._isSelected(t,e)&&(i+=" -selected-"),(!n._isInRange(t,e)||d.disabled)&&(i+=" -disabled-"),{html:l,classes:i}},_getDaysHtml:function(t){var e=a.getDaysCount(t),i=new Date(t.getFullYear(),t.getMonth(),1).getDay(),s=new Date(t.getFullYear(),t.getMonth(),e).getDay(),n=i-this.d.loc.firstDay,h=6-s+this.d.loc.firstDay;n=0>n?n+7:n,h=h>6?h-7:h;for(var o,r,c=-n+1,d="",l=c,u=e+h;u>=l;l++)r=t.getFullYear(),o=t.getMonth(),d+=this._getDayHtml(new Date(r,o,l));return d},_getDayHtml:function(t){var e=this._getCellContents(t,"day");return'<div class="'+e.classes+'" data-date="'+t.getDate()+'" data-month="'+t.getMonth()+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_getMonthsHtml:function(t){for(var e="",i=a.getParsedDate(t),s=0;12>s;)e+=this._getMonthHtml(new Date(i.year,s)),s++;return e},_getMonthHtml:function(t){var e=this._getCellContents(t,"month");return'<div class="'+e.classes+'" data-month="'+t.getMonth()+'">'+e.html+"</div>"},_getYearsHtml:function(t){var e=(a.getParsedDate(t),a.getDecade(t)),i=e[0]-1,s="",n=i;for(n;n<=e[1]+1;n++)s+=this._getYearHtml(new Date(n,0));return s},_getYearHtml:function(t){var e=this._getCellContents(t,"year");return'<div class="'+e.classes+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_renderTypes:{days:function(){var t=this._getDayNamesHtml(this.d.loc.firstDay),e=this._getDaysHtml(this.d.currentDate);this.$cells.html(e),this.$names.html(t)},months:function(){var t=this._getMonthsHtml(this.d.currentDate);this.$cells.html(t)},years:function(){var t=this._getYearsHtml(this.d.currentDate);this.$cells.html(t)}},_render:function(){this.opts.onlyTimepicker||this._renderTypes[this.type].bind(this)()},_update:function(){var t,i,s,a=e(".datepicker--cell",this.$cells),n=this;a.each(function(a,h){i=e(this),s=n.d._getDateFromCell(e(this)),t=n._getCellContents(s,n.d.cellType),i.attr("class",t.classes)})},show:function(){this.opts.onlyTimepicker||(this.$el.addClass("active"),this.acitve=!0)},hide:function(){this.$el.removeClass("active"),this.active=!1},_handleClick:function(t){var e=t.data("date")||1,i=t.data("month")||0,s=t.data("year")||this.d.parsedDate.year,a=this.d;if(a.view!=this.opts.minView)return void a.down(new Date(s,i,e));var n=new Date(s,i,e),h=this.d._isSelected(n,this.d.cellType);return h?void a._handleAlreadySelectedDates.bind(a,h,n)():void a._trigger("clickCell",n)},_onClickCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.hasClass("-disabled-")||this._handleClick.bind(this)(i)}}}(),function(){var t='<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div><div class="datepicker--nav-title">#{title}</div><div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',i='<div class="datepicker--buttons"></div>',s='<span class="datepicker--button" data-action="#{action}">#{label}</span>',a=e.fn.datepicker,n=a.Constructor;a.Navigation=function(t,e){this.d=t,this.opts=e,this.$buttonsContainer="",this.init()},a.Navigation.prototype={init:function(){this._buildBaseHtml(),this._bindEvents()},_bindEvents:function(){this.d.$nav.on("click",".datepicker--nav-action",e.proxy(this._onClickNavButton,this)),this.d.$nav.on("click",".datepicker--nav-title",e.proxy(this._onClickNavTitle,this)),this.d.$datepicker.on("click",".datepicker--button",e.proxy(this._onClickNavButton,this))},_buildBaseHtml:function(){this.opts.onlyTimepicker||this._render(),this._addButtonsIfNeed()},_addButtonsIfNeed:function(){this.opts.todayButton&&this._addButton("today"),this.opts.clearButton&&this._addButton("clear")},_render:function(){var i=this._getTitle(this.d.currentDate),s=n.template(t,e.extend({title:i},this.opts));this.d.$nav.html(s),"years"==this.d.view&&e(".datepicker--nav-title",this.d.$nav).addClass("-disabled-"),this.setNavStatus()},_getTitle:function(t){return this.d.formatDate(this.opts.navTitles[this.d.view],t)},_addButton:function(t){this.$buttonsContainer.length||this._addButtonsContainer();var i={action:t,label:this.d.loc[t]},a=n.template(s,i);e("[data-action="+t+"]",this.$buttonsContainer).length||this.$buttonsContainer.append(a)},_addButtonsContainer:function(){this.d.$datepicker.append(i),this.$buttonsContainer=e(".datepicker--buttons",this.d.$datepicker)},setNavStatus:function(){if((this.opts.minDate||this.opts.maxDate)&&this.opts.disableNavWhenOutOfRange){var t=this.d.parsedDate,e=t.month,i=t.year,s=t.date;switch(this.d.view){case"days":this.d._isInRange(new Date(i,e-1,1),"month")||this._disableNav("prev"),this.d._isInRange(new Date(i,e+1,1),"month")||this._disableNav("next");break;case"months":this.d._isInRange(new Date(i-1,e,s),"year")||this._disableNav("prev"),this.d._isInRange(new Date(i+1,e,s),"year")||this._disableNav("next");break;case"years":var a=n.getDecade(this.d.date);this.d._isInRange(new Date(a[0]-1,0,1),"year")||this._disableNav("prev"),this.d._isInRange(new Date(a[1]+1,0,1),"year")||this._disableNav("next")}}},_disableNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).addClass("-disabled-")},_activateNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).removeClass("-disabled-")},_onClickNavButton:function(t){var i=e(t.target).closest("[data-action]"),s=i.data("action");this.d[s]()},_onClickNavTitle:function(t){return e(t.target).hasClass("-disabled-")?void 0:"days"==this.d.view?this.d.view="months":void(this.d.view="years")}}}(),function(){var t='<div class="datepicker--time"><div class="datepicker--time-current">   <span class="datepicker--time-current-hours">#{hourVisible}</span>   <span class="datepicker--time-current-colon">:</span>   <span class="datepicker--time-current-minutes">#{minValue}</span></div><div class="datepicker--time-sliders">   <div class="datepicker--time-row">      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>   </div>   <div class="datepicker--time-row">      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>   </div></div></div>',i=e.fn.datepicker,s=i.Constructor;i.Timepicker=function(t,e){this.d=t,this.opts=e,this.init()},i.Timepicker.prototype={init:function(){var t="input";this._setTime(this.d.date),this._buildHTML(),navigator.userAgent.match(/trident/gi)&&(t="change"),this.d.$el.on("selectDate",this._onSelectDate.bind(this)),this.$ranges.on(t,this._onChangeRange.bind(this)),this.$ranges.on("mouseup",this._onMouseUpRange.bind(this)),this.$ranges.on("mousemove focus ",this._onMouseEnterRange.bind(this)),this.$ranges.on("mouseout blur",this._onMouseOutRange.bind(this))},_setTime:function(t){var e=s.getParsedDate(t);this._handleDate(t),this.hours=e.hours<this.minHours?this.minHours:e.hours,this.minutes=e.minutes<this.minMinutes?this.minMinutes:e.minutes},_setMinTimeFromDate:function(t){this.minHours=t.getHours(),this.minMinutes=t.getMinutes(),this.d.lastSelectedDate&&this.d.lastSelectedDate.getHours()>t.getHours()&&(this.minMinutes=this.opts.minMinutes)},_setMaxTimeFromDate:function(t){this.maxHours=t.getHours(),this.maxMinutes=t.getMinutes(),this.d.lastSelectedDate&&this.d.lastSelectedDate.getHours()<t.getHours()&&(this.maxMinutes=this.opts.maxMinutes)},_setDefaultMinMaxTime:function(){var t=23,e=59,i=this.opts;this.minHours=i.minHours<0||i.minHours>t?0:i.minHours,this.minMinutes=i.minMinutes<0||i.minMinutes>e?0:i.minMinutes,this.maxHours=i.maxHours<0||i.maxHours>t?t:i.maxHours,this.maxMinutes=i.maxMinutes<0||i.maxMinutes>e?e:i.maxMinutes},_validateHoursMinutes:function(t){this.hours<this.minHours?this.hours=this.minHours:this.hours>this.maxHours&&(this.hours=this.maxHours),this.minutes<this.minMinutes?this.minutes=this.minMinutes:this.minutes>this.maxMinutes&&(this.minutes=this.maxMinutes)},_buildHTML:function(){var i=s.getLeadingZeroNum,a={hourMin:this.minHours,hourMax:i(this.maxHours),hourStep:this.opts.hoursStep,hourValue:this.hours,hourVisible:i(this.displayHours),minMin:this.minMinutes,minMax:i(this.maxMinutes),minStep:this.opts.minutesStep,minValue:i(this.minutes)},n=s.template(t,a);this.$timepicker=e(n).appendTo(this.d.$datepicker),this.$ranges=e('[type="range"]',this.$timepicker),this.$hours=e('[name="hours"]',this.$timepicker),this.$minutes=e('[name="minutes"]',this.$timepicker),this.$hoursText=e(".datepicker--time-current-hours",this.$timepicker),this.$minutesText=e(".datepicker--time-current-minutes",this.$timepicker),this.d.ampm&&(this.$ampm=e('<span class="datepicker--time-current-ampm">').appendTo(e(".datepicker--time-current",this.$timepicker)).html(this.dayPeriod),this.$timepicker.addClass("-am-pm-"))},_updateCurrentTime:function(){var t=s.getLeadingZeroNum(this.displayHours),e=s.getLeadingZeroNum(this.minutes);this.$hoursText.html(t),this.$minutesText.html(e),this.d.ampm&&this.$ampm.html(this.dayPeriod)},_updateRanges:function(){this.$hours.attr({min:this.minHours,max:this.maxHours}).val(this.hours),this.$minutes.attr({min:this.minMinutes,max:this.maxMinutes}).val(this.minutes)},_handleDate:function(t){this._setDefaultMinMaxTime(),t&&(s.isSame(t,this.d.opts.minDate)?this._setMinTimeFromDate(this.d.opts.minDate):s.isSame(t,this.d.opts.maxDate)&&this._setMaxTimeFromDate(this.d.opts.maxDate)),this._validateHoursMinutes(t)},update:function(){this._updateRanges(),this._updateCurrentTime()},_getValidHoursFromDate:function(t,e){var i=t,a=t;t instanceof Date&&(i=s.getParsedDate(t),a=i.hours);var n=e||this.d.ampm,h="am";if(n)switch(!0){case 0==a:a=12;break;case 12==a:h="pm";break;case a>11:a-=12,h="pm"}return{hours:a,dayPeriod:h}},set hours(t){this._hours=t;var e=this._getValidHoursFromDate(t);this.displayHours=e.hours,this.dayPeriod=e.dayPeriod},get hours(){return this._hours},_onChangeRange:function(t){var i=e(t.target),s=i.attr("name");this.d.timepickerIsActive=!0,this[s]=i.val(),this._updateCurrentTime(),this.d._trigger("timeChange",[this.hours,this.minutes]),this._handleDate(this.d.lastSelectedDate),this.update()},_onSelectDate:function(t,e){this._handleDate(e),this.update()},_onMouseEnterRange:function(t){var i=e(t.target).attr("name");e(".datepicker--time-current-"+i,this.$timepicker).addClass("-focus-")},_onMouseOutRange:function(t){var i=e(t.target).attr("name");this.d.inFocus||e(".datepicker--time-current-"+i,this.$timepicker).removeClass("-focus-")},_onMouseUpRange:function(t){this.d.timepickerIsActive=!1}}}()}(window,jQuery);;/*! Sortable 1.10.0-rc3 - MIT | git://github.com/SortableJS/Sortable.git */!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Sortable=e()}(this,function(){"use strict";function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function I(i){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},e=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),e.forEach(function(t){var e,n,o;e=i,o=r[n=t],n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o})}return i}function l(t,e){if(null==t)return{};var n,o,i=function(t,e){if(null==t)return{};var n,o,i={},r=Object.keys(t);for(o=0;o<r.length;o++)n=r[o],0<=e.indexOf(n)||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(o=0;o<r.length;o++)n=r[o],0<=e.indexOf(n)||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}function e(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function t(t){return!!navigator.userAgent.match(t)}var y=t(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),E=t(/Edge/i),s=t(/firefox/i),c=t(/safari/i)&&!t(/chrome/i)&&!t(/android/i),n=t(/iP(ad|od|hone)/i),r=t(/chrome/i)&&t(/android/i),u={capture:!1,passive:!1};function d(t,e,n){t.addEventListener(e,n,!y&&u)}function h(t,e,n){t.removeEventListener(e,n,!y&&u)}function f(t,e){if(e){if(">"===e[0]&&(e=e.substring(1)),t)try{if(t.matches)return t.matches(e);if(t.msMatchesSelector)return t.msMatchesSelector(e);if(t.webkitMatchesSelector)return t.webkitMatchesSelector(e)}catch(t){return!1}return!1}}function k(t,e,n,o){if(t){n=n||document;do{if(null!=e&&(">"===e[0]?t.parentNode===n&&f(t,e):f(t,e))||o&&t===n)return t;if(t===n)break}while(t=(i=t).host&&i!==document&&i.host.nodeType?i.host:i.parentNode)}var i;return null}var p,g=/\s+/g;function P(t,e,n){if(t&&e)if(t.classList)t.classList[n?"add":"remove"](e);else{var o=(" "+t.className+" ").replace(g," ").replace(" "+e+" "," ");t.className=(o+(n?" "+e:"")).replace(g," ")}}function R(t,e,n){var o=t&&t.style;if(o){if(void 0===n)return document.defaultView&&document.defaultView.getComputedStyle?n=document.defaultView.getComputedStyle(t,""):t.currentStyle&&(n=t.currentStyle),void 0===e?n:n[e];e in o||-1!==e.indexOf("webkit")||(e="-webkit-"+e),o[e]=n+("string"==typeof n?"":"px")}}function v(t,e){var n="";do{var o=R(t,"transform");o&&"none"!==o&&(n=o+" "+n)}while(!e&&(t=t.parentNode));var i=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix;return i&&new i(n)}function m(t,e,n){if(t){var o=t.getElementsByTagName(e),i=0,r=o.length;if(n)for(;i<r;i++)n(o[i],i);return o}return[]}function M(){return y?document.documentElement:document.scrollingElement}function X(t,e,n,o,i){if(t.getBoundingClientRect||t===window){var r,a,l,s,c,u,d;if(d=t!==window&&t!==M()?(a=(r=t.getBoundingClientRect()).top,l=r.left,s=r.bottom,c=r.right,u=r.height,r.width):(l=a=0,s=window.innerHeight,c=window.innerWidth,u=window.innerHeight,window.innerWidth),(e||n)&&t!==window&&(i=i||t.parentNode,!y))do{if(i&&i.getBoundingClientRect&&("none"!==R(i,"transform")||n&&"static"!==R(i,"position"))){var h=i.getBoundingClientRect();a-=h.top+parseInt(R(i,"border-top-width")),l-=h.left+parseInt(R(i,"border-left-width")),s=a+r.height,c=l+r.width;break}}while(i=i.parentNode);if(o&&t!==window){var f=v(i||t),p=f&&f.a,g=f&&f.d;f&&(s=(a/=g)+(u/=g),c=(l/=p)+(d/=p))}return{top:a,left:l,bottom:s,right:c,width:d,height:u}}}function Y(t,e,n,o){for(var i=A(t,!0),r=(e||X(t))[n];i;){var a=X(i)[o];if(!("top"===o||"left"===o?a<=r:r<=a))return i;if(i===M())break;i=A(i,!1)}return!1}function b(t,e,n){for(var o=0,i=0,r=t.children;i<r.length;){if("none"!==r[i].style.display&&r[i]!==Nt.ghost&&r[i]!==Nt.dragged&&k(r[i],n.draggable,t,!1)){if(o===e)return r[i];o++}i++}return null}function B(t,e){for(var n=t.lastElementChild;n&&(n===Nt.ghost||"none"===R(n,"display")||e&&!f(n,e));)n=n.previousElementSibling;return n||null}function F(t,e){var n=0;if(!t||!t.parentNode)return-1;for(;t=t.previousElementSibling;)"TEMPLATE"===t.nodeName.toUpperCase()||t===Nt.clone||e&&!f(t,e)||n++;return n}function w(t){var e=0,n=0,o=M();if(t)do{var i=v(t),r=i.a,a=i.d;e+=t.scrollLeft*r,n+=t.scrollTop*a}while(t!==o&&(t=t.parentNode));return[e,n]}function A(t,e){if(!t||!t.getBoundingClientRect)return M();var n=t,o=!1;do{if(n.clientWidth<n.scrollWidth||n.clientHeight<n.scrollHeight){var i=R(n);if(n.clientWidth<n.scrollWidth&&("auto"==i.overflowX||"scroll"==i.overflowX)||n.clientHeight<n.scrollHeight&&("auto"==i.overflowY||"scroll"==i.overflowY)){if(!n.getBoundingClientRect||n===document.body)return M();if(o||e)return n;o=!0}}}while(n=n.parentNode);return M()}function D(t,e){return Math.round(t.top)===Math.round(e.top)&&Math.round(t.left)===Math.round(e.left)&&Math.round(t.height)===Math.round(e.height)&&Math.round(t.width)===Math.round(e.width)}function _(e,n){return function(){if(!p){var t=arguments;1===t.length?e.call(this,t[0]):e.apply(this,t),p=setTimeout(function(){p=void 0},n)}}}function H(t,e,n){t.scrollLeft+=e,t.scrollTop+=n}function S(t){var e=window.Polymer,n=window.jQuery||window.Zepto;return e&&e.dom?e.dom(t).cloneNode(!0):n?n(t).clone(!0)[0]:t.cloneNode(!0)}function C(t,e){R(t,"position","absolute"),R(t,"top",e.top),R(t,"left",e.left),R(t,"width",e.width),R(t,"height",e.height)}function T(t){R(t,"position",""),R(t,"top",""),R(t,"left",""),R(t,"width",""),R(t,"height","")}var L="Sortable"+(new Date).getTime();function x(){var e,o=[];return{captureAnimationState:function(){o=[],this.options.animation&&[].slice.call(this.el.children).forEach(function(t){if("none"!==R(t,"display")&&t!==Nt.ghost){o.push({target:t,rect:X(t)});var e=X(t);if(t.thisAnimationDuration){var n=v(t,!0);n&&(e.top-=n.f,e.left-=n.e)}t.fromRect=e}})},addAnimationState:function(t){o.push(t)},removeAnimationState:function(t){o.splice(function(t,e){for(var n in t)if(t.hasOwnProperty(n))for(var o in e)if(e.hasOwnProperty(o)&&e[o]===t[n][o])return Number(n);return-1}(o,{target:t}),1)},animateAll:function(t){var c=this;if(!this.options.animation)return clearTimeout(e),void("function"==typeof t&&t());var u=!1,d=0;o.forEach(function(t){var e=0,n=t.target,o=n.fromRect,i=X(n),r=n.prevFromRect,a=n.prevToRect,l=t.rect,s=v(n,!0);s&&(i.top-=s.f,i.left-=s.e),n.toRect=i,(Y(n,i,"bottom","top")||Y(n,i,"top","bottom")||Y(n,i,"right","left")||Y(n,i,"left","right"))&&(Y(n,l,"bottom","top")||Y(n,l,"top","bottom")||Y(n,l,"right","left")||Y(n,l,"left","right"))&&(Y(n,o,"bottom","top")||Y(n,o,"top","bottom")||Y(n,o,"right","left")||Y(n,o,"left","right"))||(n.thisAnimationDuration&&D(r,i)&&!D(o,i)&&(l.top-i.top)/(l.left-i.left)==(o.top-i.top)/(o.left-i.left)&&(e=function(t,e,n,o){return Math.sqrt(Math.pow(e.top-t.top,2)+Math.pow(e.left-t.left,2))/Math.sqrt(Math.pow(e.top-n.top,2)+Math.pow(e.left-n.left,2))*o.animation}(l,r,a,c.options)),D(i,o)||(n.prevFromRect=o,n.prevToRect=i,e||(e=c.options.animation),c.animate(n,l,e)),e&&(u=!0,d=Math.max(d,e),clearTimeout(n.animationResetTimer),n.animationResetTimer=setTimeout(function(){n.animationTime=0,n.prevFromRect=null,n.fromRect=null,n.prevToRect=null,n.thisAnimationDuration=null},e),n.thisAnimationDuration=e))}),clearTimeout(e),u?e=setTimeout(function(){"function"==typeof t&&t()},d):"function"==typeof t&&t(),o=[]},animate:function(t,e,n){if(n){R(t,"transition",""),R(t,"transform","");var o=X(t),i=v(this.el),r=i&&i.a,a=i&&i.d,l=(e.left-o.left)/(r||1),s=(e.top-o.top)/(a||1);t.animatingX=!!l,t.animatingY=!!s,R(t,"transform","translate3d("+l+"px,"+s+"px,0)"),function(t){t.offsetWidth}(t),R(t,"transition","transform "+n+"ms"+(this.options.easing?" "+this.options.easing:"")),R(t,"transform","translate3d(0,0,0)"),"number"==typeof t.animated&&clearTimeout(t.animated),t.animated=setTimeout(function(){R(t,"transition",""),R(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},n)}}}}var O=[],N={initializeByDefault:!0},j={mount:function(t){for(var e in N)!N.hasOwnProperty(e)||e in t||(t[e]=N[e]);O.push(t)},pluginEvent:function(e,n,o){var i=this;this.eventCanceled=!1;var r=e+"Global";O.forEach(function(t){n[t.pluginName]&&(n[t.pluginName][r]&&(i.eventCanceled=!!n[t.pluginName][r](I({sortable:n},o))),n.options[t.pluginName]&&n[t.pluginName][e]&&(i.eventCanceled=i.eventCanceled||!!n[t.pluginName][e](I({sortable:n},o))))})},initializePlugins:function(o,i,r){for(var t in O.forEach(function(t){var e=t.pluginName;if(o.options[e]||t.initializeByDefault){var n=new t(o,i);(n.sortable=o)[e]=n,a(r,n.options)}}),o.options)if(o.options.hasOwnProperty(t)){var e=this.modifyOption(o,t,o.options[t]);void 0!==e&&(o.options[t]=e)}},getEventOptions:function(e,n){var o={};return O.forEach(function(t){"function"==typeof t.eventOptions&&a(o,t.eventOptions.call(n,e))}),o},modifyOption:function(e,n,o){var i;return O.forEach(function(t){e[t.pluginName]&&t.optionListeners&&"function"==typeof t.optionListeners[n]&&(i=t.optionListeners[n].call(e[t.pluginName],o))}),i}};function K(t){var e,n=t.sortable,o=t.rootEl,i=t.name,r=t.targetEl,a=t.cloneEl,l=t.toEl,s=t.fromEl,c=t.oldIndex,u=t.newIndex,d=t.oldDraggableIndex,h=t.newDraggableIndex,f=t.originalEvent,p=t.putSortable,g=t.eventOptions,v=(n=n||o[L]).options,m="on"+i.charAt(0).toUpperCase()+i.substr(1);!window.CustomEvent||y||E?(e=document.createEvent("Event")).initEvent(i,!0,!0):e=new CustomEvent(i,{bubbles:!0,cancelable:!0}),e.to=l||o,e.from=s||o,e.item=r||o,e.clone=a,e.oldIndex=c,e.newIndex=u,e.oldDraggableIndex=d,e.newDraggableIndex=h,e.originalEvent=f,e.pullMode=p?p.lastPutMode:void 0;var b=I({},g,j.getEventOptions(i,n));for(var w in b)e[w]=b[w];o&&o.dispatchEvent(e),v[m]&&v[m].call(n,e)}function W(t,e,n){var o=2<arguments.length&&void 0!==n?n:{},i=o.evt,r=l(o,["evt"]);j.pluginEvent.bind(Nt)(t,e,I({dragEl:G,parentEl:U,ghostEl:q,rootEl:V,nextEl:Z,lastDownEl:Q,cloneEl:$,cloneHidden:J,dragStarted:st,putSortable:rt,activeSortable:Nt.active,originalEvent:i,oldIndex:tt,oldDraggableIndex:nt,newIndex:et,newDraggableIndex:ot,hideGhostForTarget:xt,unhideGhostForTarget:Ot,cloneNowHidden:function(){J=!0},cloneNowShown:function(){J=!1},dispatchSortableEvent:function(t){z({sortable:e,name:t,originalEvent:i})}},r))}function z(t){K(I({putSortable:rt,cloneEl:$,targetEl:G,rootEl:V,oldIndex:tt,oldDraggableIndex:nt,newIndex:et,newDraggableIndex:ot},t))}if("undefined"==typeof window||!window.document)throw new Error("Sortable.js requires a window with a document");var G,U,q,V,Z,Q,$,J,tt,et,nt,ot,it,rt,at,lt,st,ct,ut,dt,ht,ft=!1,pt=!1,gt=[],vt=!1,mt=!1,bt=[],wt=!1,yt=[],Et=n,Dt=E||y?"cssFloat":"float",_t=!r&&!n&&"draggable"in document.createElement("div"),St=function(){if(y)return!1;var t=document.createElement("x");return t.style.cssText="pointer-events:auto","auto"===t.style.pointerEvents}(),Ct=function(t,e){var n=R(t),o=parseInt(n.width)-parseInt(n.paddingLeft)-parseInt(n.paddingRight)-parseInt(n.borderLeftWidth)-parseInt(n.borderRightWidth),i=b(t,0,e),r=b(t,1,e),a=i&&R(i),l=r&&R(r),s=a&&parseInt(a.marginLeft)+parseInt(a.marginRight)+X(i).width,c=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+X(r).width;if("flex"===n.display)return"column"===n.flexDirection||"column-reverse"===n.flexDirection?"vertical":"horizontal";if("grid"===n.display)return n.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(i&&"none"!==a.float){var u="left"===a.float?"left":"right";return!r||"both"!==l.clear&&l.clear!==u?"horizontal":"vertical"}return i&&("block"===a.display||"flex"===a.display||"table"===a.display||"grid"===a.display||o<=s&&"none"===n[Dt]||r&&"none"===n[Dt]&&o<s+c)?"vertical":"horizontal"},Tt=function(t){function s(a,l){return function(t,e,n,o){var i=t.options.group.name&&e.options.group.name&&t.options.group.name===e.options.group.name;if(null==a&&(l||i))return!0;if(null==a||!1===a)return!1;if(l&&"clone"===a)return a;if("function"==typeof a)return s(a(t,e,n,o),l)(t,e,n,o);var r=(l?t:e).options.group.name;return!0===a||"string"==typeof a&&a===r||a.join&&-1<a.indexOf(r)}}var e={},n=t.group;n&&"object"==o(n)||(n={name:n}),e.name=n.name,e.checkPull=s(n.pull,!0),e.checkPut=s(n.put),e.revertClone=n.revertClone,t.group=e},xt=function(){!St&&q&&R(q,"display","none")},Ot=function(){!St&&q&&R(q,"display","")};document.addEventListener("click",function(t){if(pt)return t.preventDefault(),t.stopPropagation&&t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),pt=!1},!0);function Mt(t){if(G){var e=function(r,a){var l;return gt.some(function(t){if(!B(t)){var e=X(t),n=t[L].options.emptyInsertThreshold,o=r>=e.left-n&&r<=e.right+n,i=a>=e.top-n&&a<=e.bottom+n;return n&&o&&i?l=t:void 0}}),l}((t=t.touches?t.touches[0]:t).clientX,t.clientY);if(e){var n={};for(var o in t)t.hasOwnProperty(o)&&(n[o]=t[o]);n.target=n.rootEl=e,n.preventDefault=void 0,n.stopPropagation=void 0,e[L]._onDragOver(n)}}}function At(t){G&&G.parentNode[L]._isOutsideThisEl(t.target)}function Nt(t,e){if(!t||!t.nodeType||1!==t.nodeType)throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(t));this.el=t,this.options=e=a({},e),t[L]=this;var n={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(t.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return Ct(t,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(t,e){t.setData("Text",e.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:!1!==Nt.supportPointer&&"PointerEvent"in window,emptyInsertThreshold:5};for(var o in j.initializePlugins(this,t,n),n)o in e||(e[o]=n[o]);for(var i in Tt(e),this)"_"===i.charAt(0)&&"function"==typeof this[i]&&(this[i]=this[i].bind(this));this.nativeDraggable=!e.forceFallback&&_t,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?d(t,"pointerdown",this._onTapStart):(d(t,"mousedown",this._onTapStart),d(t,"touchstart",this._onTapStart)),this.nativeDraggable&&(d(t,"dragover",this),d(t,"dragenter",this)),gt.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),a(this,x())}function It(t,e,n,o,i,r,a,l){var s,c,u=t[L],d=u.options.onMove;return!window.CustomEvent||y||E?(s=document.createEvent("Event")).initEvent("move",!0,!0):s=new CustomEvent("move",{bubbles:!0,cancelable:!0}),s.to=e,s.from=t,s.dragged=n,s.draggedRect=o,s.related=i||e,s.relatedRect=r||X(e),s.willInsertAfter=l,s.originalEvent=a,t.dispatchEvent(s),d&&(c=d.call(u,s,a)),c}function kt(t){t.draggable=!1}function Pt(){wt=!1}function Rt(t){for(var e=t.tagName+t.className+t.src+t.href+t.textContent,n=e.length,o=0;n--;)o+=e.charCodeAt(n);return o.toString(36)}function Xt(t){return setTimeout(t,0)}function Yt(t){return clearTimeout(t)}Nt.prototype={constructor:Nt,_isOutsideThisEl:function(t){this.el.contains(t)||t===this.el||(ct=null)},_getDirection:function(t,e){return"function"==typeof this.options.direction?this.options.direction.call(this,t,e,G):this.options.direction},_onTapStart:function(e){if(e.cancelable){var n=this,o=this.el,t=this.options,i=t.preventOnFilter,r=e.type,a=e.touches&&e.touches[0],l=(a||e).target,s=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,c=t.filter;if(function(t){yt.length=0;var e=t.getElementsByTagName("input"),n=e.length;for(;n--;){var o=e[n];o.checked&&yt.push(o)}}(o),!G&&!(/mousedown|pointerdown/.test(r)&&0!==e.button||t.disabled||s.isContentEditable||(l=k(l,t.draggable,o,!1))&&l.animated||Q===l)){if(tt=F(l),nt=F(l,t.draggable),"function"==typeof c){if(c.call(this,e,l,this))return z({sortable:n,rootEl:s,name:"filter",targetEl:l,toEl:o,fromEl:o}),W("filter",n,{evt:e}),void(i&&e.cancelable&&e.preventDefault())}else if(c&&(c=c.split(",").some(function(t){if(t=k(s,t.trim(),o,!1))return z({sortable:n,rootEl:t,name:"filter",targetEl:l,fromEl:o,toEl:o}),W("filter",n,{evt:e}),!0})))return void(i&&e.cancelable&&e.preventDefault());t.handle&&!k(s,t.handle,o,!1)||this._prepareDragStart(e,a,l)}}},_prepareDragStart:function(t,e,n){var o,i=this,r=i.el,a=i.options,l=r.ownerDocument;if(n&&!G&&n.parentNode===r)if(V=r,U=(G=n).parentNode,Z=G.nextSibling,Q=n,it=a.group,at={target:Nt.dragged=G,clientX:(e||t).clientX,clientY:(e||t).clientY},this._lastX=(e||t).clientX,this._lastY=(e||t).clientY,G.style["will-change"]="all",o=function(){W("delayEnded",i,{evt:t}),Nt.eventCanceled?i._onDrop():(i._disableDelayedDragEvents(),!s&&i.nativeDraggable&&(G.draggable=!0),i._triggerDragStart(t,e),z({sortable:i,name:"choose",originalEvent:t}),P(G,a.chosenClass,!0))},a.ignore.split(",").forEach(function(t){m(G,t.trim(),kt)}),d(l,"dragover",Mt),d(l,"mousemove",Mt),d(l,"touchmove",Mt),d(l,"mouseup",i._onDrop),d(l,"touchend",i._onDrop),d(l,"touchcancel",i._onDrop),s&&this.nativeDraggable&&(this.options.touchStartThreshold=4,G.draggable=!0),W("delayStart",this,{evt:t}),!a.delay||a.delayOnTouchOnly&&!e||this.nativeDraggable&&(E||y))o();else{if(Nt.eventCanceled)return void this._onDrop();d(l,"mouseup",i._disableDelayedDrag),d(l,"touchend",i._disableDelayedDrag),d(l,"touchcancel",i._disableDelayedDrag),d(l,"mousemove",i._delayedDragTouchMoveHandler),d(l,"touchmove",i._delayedDragTouchMoveHandler),a.supportPointer&&d(l,"pointermove",i._delayedDragTouchMoveHandler),i._dragStartTimer=setTimeout(o,a.delay)}},_delayedDragTouchMoveHandler:function(t){var e=t.touches?t.touches[0]:t;Math.max(Math.abs(e.clientX-this._lastX),Math.abs(e.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){G&&kt(G),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var t=this.el.ownerDocument;h(t,"mouseup",this._disableDelayedDrag),h(t,"touchend",this._disableDelayedDrag),h(t,"touchcancel",this._disableDelayedDrag),h(t,"mousemove",this._delayedDragTouchMoveHandler),h(t,"touchmove",this._delayedDragTouchMoveHandler),h(t,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(t,e){e=e||"touch"==t.pointerType&&t,!this.nativeDraggable||e?this.options.supportPointer?d(document,"pointermove",this._onTouchMove):d(document,e?"touchmove":"mousemove",this._onTouchMove):(d(G,"dragend",this),d(V,"dragstart",this._onDragStart));try{document.selection?Xt(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch(t){}},_dragStarted:function(t,e){if(ft=!1,V&&G){W("dragStarted",this,{evt:e}),this.nativeDraggable&&d(document,"dragover",At);var n=this.options;t||P(G,n.dragClass,!1),P(G,n.ghostClass,!0),Nt.active=this,t&&this._appendGhost(),z({sortable:this,name:"start",originalEvent:e})}else this._nulling()},_emulateDragOver:function(){if(lt){this._lastX=lt.clientX,this._lastY=lt.clientY,xt();for(var t=document.elementFromPoint(lt.clientX,lt.clientY),e=t;t&&t.shadowRoot&&(t=t.shadowRoot.elementFromPoint(lt.clientX,lt.clientY))!==e;)e=t;if(G.parentNode[L]._isOutsideThisEl(t),e)do{if(e[L]){if(e[L]._onDragOver({clientX:lt.clientX,clientY:lt.clientY,target:t,rootEl:e})&&!this.options.dragoverBubble)break}t=e}while(e=e.parentNode);Ot()}},_onTouchMove:function(t){if(at){var e=this.options,n=e.fallbackTolerance,o=e.fallbackOffset,i=t.touches?t.touches[0]:t,r=q&&v(q),a=q&&r&&r.a,l=q&&r&&r.d,s=Et&&ht&&w(ht),c=(i.clientX-at.clientX+o.x)/(a||1)+(s?s[0]-bt[0]:0)/(a||1),u=(i.clientY-at.clientY+o.y)/(l||1)+(s?s[1]-bt[1]:0)/(l||1),d=t.touches?"translate3d("+c+"px,"+u+"px,0)":"translate("+c+"px,"+u+"px)";if(!Nt.active&&!ft){if(n&&Math.max(Math.abs(i.clientX-this._lastX),Math.abs(i.clientY-this._lastY))<n)return;this._onDragStart(t,!0)}lt=i,R(q,"webkitTransform",d),R(q,"mozTransform",d),R(q,"msTransform",d),R(q,"transform",d),t.cancelable&&t.preventDefault()}},_appendGhost:function(){if(!q){var t=this.options.fallbackOnBody?document.body:V,e=X(G,!0,Et,!0,t),n=this.options;if(Et){for(ht=t;"static"===R(ht,"position")&&"none"===R(ht,"transform")&&ht!==document;)ht=ht.parentNode;ht!==document.body&&ht!==document.documentElement?(ht===document&&(ht=M()),e.top+=ht.scrollTop,e.left+=ht.scrollLeft):ht=M(),bt=w(ht)}P(q=G.cloneNode(!0),n.ghostClass,!1),P(q,n.fallbackClass,!0),P(q,n.dragClass,!0),R(q,"transition",""),R(q,"transform",""),R(q,"box-sizing","border-box"),R(q,"margin",0),R(q,"top",e.top),R(q,"left",e.left),R(q,"width",e.width),R(q,"height",e.height),R(q,"opacity","0.8"),R(q,"position",Et?"absolute":"fixed"),R(q,"zIndex","100000"),R(q,"pointerEvents","none"),Nt.ghost=q,t.appendChild(q)}},_onDragStart:function(t,e){var n=this,o=t.dataTransfer,i=n.options;W("dragStart",this,{evt:t}),Nt.eventCanceled?this._onDrop():(W("setupClone",this),Nt.eventCanceled||(($=S(G)).draggable=!1,$.style["will-change"]="",this._hideClone(),P($,this.options.chosenClass,!1),Nt.clone=$),n.cloneId=Xt(function(){W("clone",n),Nt.eventCanceled||(n.options.removeCloneOnHide||V.insertBefore($,G),n._hideClone(),z({sortable:n,name:"clone"}))}),e||P(G,i.dragClass,!0),e?(pt=!0,n._loopId=setInterval(n._emulateDragOver,50)):(h(document,"mouseup",n._onDrop),h(document,"touchend",n._onDrop),h(document,"touchcancel",n._onDrop),o&&(o.effectAllowed="move",i.setData&&i.setData.call(n,o,G)),d(document,"drop",n),R(G,"transform","translateZ(0)")),ft=!0,n._dragStartId=Xt(n._dragStarted.bind(n,e,t)),d(document,"selectstart",n),st=!0,c&&R(document.body,"user-select","none"))},_onDragOver:function(n){var o,i,r,a,l=this.el,s=n.target,e=this.options,t=e.group,c=Nt.active,u=it===t,d=e.sort,h=rt||c,f=this,p=!1;if(!wt){if(void 0!==n.preventDefault&&n.cancelable&&n.preventDefault(),s=k(s,e.draggable,l,!0),O("dragOver"),Nt.eventCanceled)return p;if(G.contains(n.target)||s.animated&&s.animatingX&&s.animatingY||f._ignoreWhileAnimating===s)return A(!1);if(pt=!1,c&&!e.disabled&&(u?d||(r=!V.contains(G)):rt===this||(this.lastPutMode=it.checkPull(this,c,G,n))&&t.checkPut(this,c,G,n))){if(a="vertical"===this._getDirection(n,s),o=X(G),O("dragOverValid"),Nt.eventCanceled)return p;if(r)return U=V,M(),this._hideClone(),O("revert"),Nt.eventCanceled||(Z?V.insertBefore(G,Z):V.appendChild(G)),A(!0);var g=B(l,e.draggable);if(!g||function(t,e,n){var o=X(B(n.el,n.options.draggable));return e?t.clientX>o.right+10||t.clientX<=o.right&&t.clientY>o.bottom&&t.clientX>=o.left:t.clientX>o.right&&t.clientY>o.top||t.clientX<=o.right&&t.clientY>o.bottom+10}(n,a,this)&&!g.animated){if(g===G)return A(!1);if(g&&l===n.target&&(s=g),s&&(i=X(s)),!1!==It(V,l,G,o,s,i,n,!!s))return M(),l.appendChild(G),U=l,N(),A(!0)}else if(s.parentNode===l){i=X(s);var v,m,b,w=G.parentNode!==l,y=!function(t,e,n){var o=n?t.left:t.top,i=n?t.right:t.bottom,r=n?t.width:t.height,a=n?e.left:e.top,l=n?e.right:e.bottom,s=n?e.width:e.height;return o===a||i===l||o+r/2===a+s/2}(G.animated&&G.toRect||o,s.animated&&s.toRect||i,a),E=a?"top":"left",D=Y(s,null,"top","top")||Y(G,null,"top","top"),_=D?D.scrollTop:void 0;if(ct!==s&&(m=i[E],vt=!1,mt=!y&&e.invertSwap||w),0!==(v=function(t,e,n,o,i,r,a,l){var s=o?t.clientY:t.clientX,c=o?n.height:n.width,u=o?n.top:n.left,d=o?n.bottom:n.right,h=!1;if(!a)if(l&&dt<c*i){if(!vt&&(1===ut?u+c*r/2<s:s<d-c*r/2)&&(vt=!0),vt)h=!0;else if(1===ut?s<u+dt:d-dt<s)return-ut}else if(u+c*(1-i)/2<s&&s<d-c*(1-i)/2)return function(t){return F(G)<F(t)?1:-1}(e);if((h=h||a)&&(s<u+c*r/2||d-c*r/2<s))return u+c/2<s?1:-1;return 0}(n,s,i,a,y?1:e.swapThreshold,null==e.invertedSwapThreshold?e.swapThreshold:e.invertedSwapThreshold,mt,ct===s)))for(var S=F(G);S-=v,(b=U.children[S])&&("none"===R(b,"display")||b===q););if(0===v||b===s)return A(!1);ut=v;var C=(ct=s).nextElementSibling,T=!1,x=It(V,l,G,o,s,i,n,T=1===v);if(!1!==x)return 1!==x&&-1!==x||(T=1===x),wt=!0,setTimeout(Pt,30),M(),T&&!C?l.appendChild(G):s.parentNode.insertBefore(G,T?C:s),D&&H(D,0,_-D.scrollTop),U=G.parentNode,void 0===m||mt||(dt=Math.abs(m-X(s)[E])),N(),A(!0)}if(l.contains(G))return A(!1)}return!1}function O(t,e){W(t,f,I({evt:n,isOwner:u,axis:a?"vertical":"horizontal",revert:r,dragRect:o,targetRect:i,canSort:d,fromSortable:h,target:s,completed:A,onMove:function(t,e){return It(V,l,G,o,t,X(t),n,e)},changed:N},e))}function M(){O("dragOverAnimationCapture"),f.captureAnimationState(),f!==h&&h.captureAnimationState()}function A(t){return O("dragOverCompleted",{insertion:t}),t&&(u?c._hideClone():c._showClone(f),f!==h&&(P(G,rt?rt.options.ghostClass:c.options.ghostClass,!1),P(G,e.ghostClass,!0)),rt!==f&&f!==Nt.active?rt=f:f===Nt.active&&rt&&(rt=null),h===f&&(f._ignoreWhileAnimating=s),f.animateAll(function(){O("dragOverAnimationComplete"),f._ignoreWhileAnimating=null}),f!==h&&(h.animateAll(),h._ignoreWhileAnimating=null)),(s===G&&!G.animated||s===l&&!s.animated)&&(ct=null),e.dragoverBubble||n.rootEl||s===document||(G.parentNode[L]._isOutsideThisEl(n.target),t||Mt(n)),!e.dragoverBubble&&n.stopPropagation&&n.stopPropagation(),p=!0}function N(){et=F(G),ot=F(G,e.draggable),z({sortable:f,name:"change",toEl:l,newIndex:et,newDraggableIndex:ot,originalEvent:n})}},_ignoreWhileAnimating:null,_offMoveEvents:function(){h(document,"mousemove",this._onTouchMove),h(document,"touchmove",this._onTouchMove),h(document,"pointermove",this._onTouchMove),h(document,"dragover",Mt),h(document,"mousemove",Mt),h(document,"touchmove",Mt)},_offUpEvents:function(){var t=this.el.ownerDocument;h(t,"mouseup",this._onDrop),h(t,"touchend",this._onDrop),h(t,"pointerup",this._onDrop),h(t,"touchcancel",this._onDrop),h(document,"selectstart",this)},_onDrop:function(t){var e=this.el,n=this.options;et=F(G),ot=F(G,n.draggable),W("drop",this,{evt:t}),et=F(G),ot=F(G,n.draggable),Nt.eventCanceled||(vt=mt=ft=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Yt(this.cloneId),Yt(this._dragStartId),this.nativeDraggable&&(h(document,"drop",this),h(e,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),c&&R(document.body,"user-select",""),t&&(st&&(t.cancelable&&t.preventDefault(),n.dropBubble||t.stopPropagation()),q&&q.parentNode&&q.parentNode.removeChild(q),(V===U||rt&&"clone"!==rt.lastPutMode)&&$&&$.parentNode&&$.parentNode.removeChild($),G&&(this.nativeDraggable&&h(G,"dragend",this),kt(G),G.style["will-change"]="",st&&!ft&&P(G,rt?rt.options.ghostClass:this.options.ghostClass,!1),P(G,this.options.chosenClass,!1),z({sortable:this,name:"unchoose",toEl:U,newIndex:null,newDraggableIndex:null,originalEvent:t}),V!==U?(0<=et&&(z({rootEl:U,name:"add",toEl:U,fromEl:V,originalEvent:t}),z({sortable:this,name:"remove",toEl:U,originalEvent:t}),z({rootEl:U,name:"sort",toEl:U,fromEl:V,originalEvent:t}),z({sortable:this,name:"sort",toEl:U,originalEvent:t})),rt&&rt.save()):et!==tt&&0<=et&&(z({sortable:this,name:"update",toEl:U,originalEvent:t}),z({sortable:this,name:"sort",toEl:U,originalEvent:t})),Nt.active&&(null!=et&&-1!==et||(et=tt,ot=nt),z({sortable:this,name:"end",toEl:U,originalEvent:t}),this.save())))),this._nulling()},_nulling:function(){W("nulling",this),V=G=U=q=Z=$=Q=J=at=lt=st=et=ot=tt=nt=ct=ut=rt=it=Nt.dragged=Nt.ghost=Nt.clone=Nt.active=null,yt.forEach(function(t){t.checked=!0}),yt.length=0},handleEvent:function(t){switch(t.type){case"drop":case"dragend":this._onDrop(t);break;case"dragenter":case"dragover":G&&(this._onDragOver(t),function(t){t.dataTransfer&&(t.dataTransfer.dropEffect="move");t.cancelable&&t.preventDefault()}(t));break;case"selectstart":t.preventDefault()}},toArray:function(){for(var t,e=[],n=this.el.children,o=0,i=n.length,r=this.options;o<i;o++)k(t=n[o],r.draggable,this.el,!1)&&e.push(t.getAttribute(r.dataIdAttr)||Rt(t));return e},sort:function(t){var o={},i=this.el;this.toArray().forEach(function(t,e){var n=i.children[e];k(n,this.options.draggable,i,!1)&&(o[t]=n)},this),t.forEach(function(t){o[t]&&(i.removeChild(o[t]),i.appendChild(o[t]))})},save:function(){var t=this.options.store;t&&t.set&&t.set(this)},closest:function(t,e){return k(t,e||this.options.draggable,this.el,!1)},option:function(t,e){var n=this.options;if(void 0===e)return n[t];var o=j.modifyOption(this,t,e);n[t]=void 0!==o?o:e,"group"===t&&Tt(n)},destroy:function(){W("destroy",this);var t=this.el;t[L]=null,h(t,"mousedown",this._onTapStart),h(t,"touchstart",this._onTapStart),h(t,"pointerdown",this._onTapStart),this.nativeDraggable&&(h(t,"dragover",this),h(t,"dragenter",this)),Array.prototype.forEach.call(t.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),gt.splice(gt.indexOf(this.el),1),this.el=t=null},_hideClone:function(){if(!J){if(W("hideClone",this),Nt.eventCanceled)return;R($,"display","none"),this.options.removeCloneOnHide&&$.parentNode&&$.parentNode.removeChild($),J=!0}},_showClone:function(t){if("clone"===t.lastPutMode){if(J){if(W("showClone",this),Nt.eventCanceled)return;V.contains(G)&&!this.options.group.revertClone?V.insertBefore($,G):Z?V.insertBefore($,Z):V.appendChild($),this.options.group.revertClone&&this._animate(G,$),R($,"display",""),J=!1}}else this._hideClone()}},d(document,"touchmove",function(t){(Nt.active||ft)&&t.cancelable&&t.preventDefault()}),Nt.utils={on:d,off:h,css:R,find:m,is:function(t,e){return!!k(t,e,t,!1)},extend:function(t,e){if(t&&e)for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},throttle:_,closest:k,toggleClass:P,clone:S,index:F,nextTick:Xt,cancelNextTick:Yt,detectDirection:Ct,getChild:b},Nt.mount=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e[0].constructor===Array&&(e=e[0]),e.forEach(function(t){if(!t.prototype||!t.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(el));t.utils&&(Nt.utils=I({},Nt.utils,t.utils)),j.mount(t)})},Nt.create=function(t,e){return new Nt(t,e)};var Bt,Ft,Ht,Lt,jt,Kt,Wt=[],zt=!(Nt.version="1.10.0-rc3");function Gt(){Wt.forEach(function(t){clearInterval(t.pid)}),Wt=[]}function Ut(){clearInterval(Kt)}function qt(t){var e=t.originalEvent,n=t.putSortable,o=t.dragEl,i=t.activeSortable,r=t.dispatchSortableEvent,a=t.hideGhostForTarget,l=t.unhideGhostForTarget,s=n||i;a();var c=document.elementFromPoint(e.clientX,e.clientY);l(),s&&!s.el.contains(c)&&(r("spill"),this.onSpill(o))}var Vt,Zt=_(function(n,t,e,o){if(t.scroll){var i,r=t.scrollSensitivity,a=t.scrollSpeed,l=M(),s=!1;Ft!==e&&(Ft=e,Gt(),Bt=t.scroll,i=t.scrollFn,!0===Bt&&(Bt=A(e,!0)));var c=0,u=Bt;do{var d=u,h=X(d),f=h.top,p=h.bottom,g=h.left,v=h.right,m=h.width,b=h.height,w=void 0,y=void 0,E=d.scrollWidth,D=d.scrollHeight,_=R(d),S=d.scrollLeft,C=d.scrollTop;y=d===l?(w=m<E&&("auto"===_.overflowX||"scroll"===_.overflowX||"visible"===_.overflowX),b<D&&("auto"===_.overflowY||"scroll"===_.overflowY||"visible"===_.overflowY)):(w=m<E&&("auto"===_.overflowX||"scroll"===_.overflowX),b<D&&("auto"===_.overflowY||"scroll"===_.overflowY));var T=w&&(Math.abs(v-n.clientX)<=r&&S+m<E)-(Math.abs(g-n.clientX)<=r&&!!S),x=y&&(Math.abs(p-n.clientY)<=r&&C+b<D)-(Math.abs(f-n.clientY)<=r&&!!C);if(!Wt[c])for(var O=0;O<=c;O++)Wt[O]||(Wt[O]={});Wt[c].vx==T&&Wt[c].vy==x&&Wt[c].el===d||(Wt[c].el=d,Wt[c].vx=T,Wt[c].vy=x,clearInterval(Wt[c].pid),0==T&&0==x||(s=!0,Wt[c].pid=setInterval(function(){o&&0===this.layer&&Nt.active._onTouchMove(jt);var t=Wt[this.layer].vy?Wt[this.layer].vy*a:0,e=Wt[this.layer].vx?Wt[this.layer].vx*a:0;"function"==typeof i&&"continue"!==i.call(Nt.dragged.parentNode[L],e,t,n,jt,Wt[this.layer].el)||H(Wt[this.layer].el,e,t)}.bind({layer:c}),24))),c++}while(t.bubbleScroll&&u!==l&&(u=A(u,!1)));zt=s}},30);function Qt(){}function $t(){}Qt.prototype={startIndex:null,dragStart:function(t){var e=t.oldDraggableIndex;this.startIndex=e},onSpill:function(t){this.sortable.captureAnimationState();var e=b(this.sortable.el,this.startIndex,this.sortable.options);e?this.sortable.el.insertBefore(t,e):this.sortable.el.appendChild(t),this.sortable.animateAll()},drop:qt},a(Qt,{pluginName:"revertOnSpill"}),$t.prototype={onSpill:function(t){this.sortable.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),this.sortable.animateAll()},drop:qt},a($t,{pluginName:"removeOnSpill"});var Jt,te,ee,ne,oe,ie=[],re=[],ae=!1,le=!1,se=!1;function ce(n,o){re.forEach(function(t){var e=o.children[t.sortableIndex+(n?Number(i):0)];e?o.insertBefore(t,e):o.appendChild(t)})}function ue(){ie.forEach(function(t){t!==ee&&t.parentNode&&t.parentNode.removeChild(t)})}return Nt.mount(new function(){function t(){for(var t in this.options={scroll:!0,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0},this)"_"===t.charAt(0)&&"function"==typeof this[t]&&(this[t]=this[t].bind(this))}return t.prototype={dragStarted:function(t){var e=t.originalEvent;this.sortable.nativeDraggable?d(document,"dragover",this._handleAutoScroll):this.sortable.options.supportPointer?d(document,"pointermove",this._handleFallbackAutoScroll):e.touches?d(document,"touchmove",this._handleFallbackAutoScroll):d(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var e=t.originalEvent;this.sortable.options.dragOverBubble||e.rootEl||this._handleAutoScroll(e)},drop:function(){this.sortable.nativeDraggable?h(document,"dragover",this._handleAutoScroll):(h(document,"pointermove",this._handleFallbackAutoScroll),h(document,"touchmove",this._handleFallbackAutoScroll),h(document,"mousemove",this._handleFallbackAutoScroll)),Ut(),Gt(),clearTimeout(p),p=void 0},nulling:function(){jt=Ft=Bt=zt=Kt=Ht=Lt=null,Wt.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(e,n){var o=this,i=e.clientX,r=e.clientY,t=document.elementFromPoint(i,r);if(jt=e,n||E||y||c){Zt(e,this.options,t,n);var a=A(t,!0);!zt||Kt&&i===Ht&&r===Lt||(Kt&&Ut(),Kt=setInterval(function(){var t=A(document.elementFromPoint(i,r),!0);t!==a&&(a=t,Gt()),Zt(e,o.options,t,n)},10),Ht=i,Lt=r)}else{if(!this.sortable.options.bubbleScroll||A(t,!0)===M())return void Gt();Zt(e,this.options,A(t,!1),!1)}}},a(t,{pluginName:"scroll",initializeByDefault:!0})}),Nt.mount($t,Qt),Nt.mount(new function(){function t(){this.options={swapClass:"sortable-swap-highlight"}}return t.prototype={dragStart:function(t){var e=t.dragEl;Vt=e},dragOverValid:function(t){var e=t.completed,n=t.target,o=t.onMove,i=t.activeSortable,r=t.changed;if(i.options.swap){var a=this.sortable.el,l=this.sortable.options;if(n&&n!==a){var s=Vt;Vt=!1!==o(n)?(P(n,l.swapClass,!0),n):null,s&&s!==Vt&&P(s,l.swapClass,!1)}return r(),e(!0)}},drop:function(t){var e=t.activeSortable,n=t.putSortable,o=t.dragEl,i=n||this.sortable,r=this.sortable.options;Vt&&P(Vt,r.swapClass,!1),Vt&&(r.swap||n&&n.options.swap)&&o!==Vt&&(i.captureAnimationState(),i!==e&&e.captureAnimationState(),function(t,e){var n,o,i=t.parentNode,r=e.parentNode;if(!i||!r||i.isEqualNode(e)||r.isEqualNode(t))return;n=F(t),o=F(e),i.isEqualNode(r)&&n<o&&o++;i.insertBefore(e,i.children[n]),r.insertBefore(t,r.children[o])}(o,Vt),i.animateAll(),i!==e&&e.animateAll())},nulling:function(){Vt=null}},a(t,{pluginName:"swap",eventOptions:function(){return{swapItem:Vt}}})}),Nt.mount(new function(){function t(o){for(var t in this)"_"===t.charAt(0)&&"function"==typeof this[t]&&(this[t]=this[t].bind(this));o.options.supportPointer?d(document,"pointerup",this._deselectMultiDrag):(d(document,"mouseup",this._deselectMultiDrag),d(document,"touchend",this._deselectMultiDrag)),d(document,"keydown",this._checkKeyDown),d(document,"keyup",this._checkKeyUp),this.options={selectedClass:"sortable-selected",multiDragKey:null,setData:function(t,e){var n="";ie.length&&te===o?ie.forEach(function(t,e){n+=(e?", ":"")+t.textContent}):n=e.textContent,t.setData("Text",n)}}}return t.prototype={multiDragKeyDown:!1,isMultiDrag:!1,delayStartGlobal:function(t){var e=t.dragEl;ee=e},delayEnded:function(){this.isMultiDrag=~ie.indexOf(ee)},setupClone:function(t){var e=t.sortable;if(this.isMultiDrag){for(var n=0;n<ie.length;n++)re.push(S(ie[n])),re[n].sortableIndex=ie[n].sortableIndex,re[n].draggable=!1,re[n].style["will-change"]="",P(re[n],e.options.selectedClass,!1),ie[n]===ee&&P(re[n],e.options.chosenClass,!1);return e._hideClone(),!0}},clone:function(t){var e=t.sortable,n=t.rootEl,o=t.dispatchSortableEvent;if(this.isMultiDrag)return!e.options.removeCloneOnHide&&ie.length&&te===e?(ce(!0,n),o("clone"),!0):void 0},showClone:function(t){var e=t.cloneNowShown,n=t.rootEl;if(this.isMultiDrag)return ce(!1,n),re.forEach(function(t){R(t,"display","")}),e(),!(oe=!1)},hideClone:function(t){var e=t.sortable,n=t.cloneNowHidden;if(this.isMultiDrag)return re.forEach(function(t){R(t,"display","none"),e.options.removeCloneOnHide&&t.parentNode&&t.parentNode.removeChild(t)}),n(),oe=!0},dragStartGlobal:function(t){t.sortable;!this.isMultiDrag&&te&&te.multiDrag._deselectMultiDrag(),ie.forEach(function(t){t.sortableIndex=F(t)}),ie=ie.sort(function(t,e){return t.sortableIndex-e.sortableIndex}),se=!0},dragStarted:function(t){var e=t.sortable;if(this.isMultiDrag){if(e.options.sort&&(e.captureAnimationState(),e.options.animation)){ie.forEach(function(t){t!==ee&&R(t,"position","absolute")});var n=X(ee,!1,!0,!0);ie.forEach(function(t){t!==ee&&C(t,n)}),ae=le=!0}e.animateAll(function(){ae=le=!1,e.options.animation&&ie.forEach(function(t){T(t)}),e.options.sort&&ue()})}},dragOver:function(t){var e=t.target,n=t.completed;if(le&&~ie.indexOf(e))return n(!1)},revert:function(t){var e=t.fromSortable,n=t.rootEl,o=t.sortable,r=t.dragRect;1<ie.length&&(ie.forEach(function(t){o.addAnimationState({target:t,rect:le?X(t):r}),T(t),t.fromRect=r,e.removeAnimationState(t)}),le=!1,function(n,o){ie.forEach(function(t){var e=o.children[t.sortableIndex+(n?Number(i):0)];e?o.insertBefore(t,e):o.appendChild(t)})}(!o.options.removeCloneOnHide,n))},dragOverCompleted:function(t){var e=t.sortable,n=t.isOwner,o=t.insertion,i=t.activeSortable,r=t.parentEl,a=t.putSortable,l=e.options;if(o){if(n&&i._hideClone(),ae=!1,l.animation&&1<ie.length&&(le||!n&&!i.options.sort&&!a)){var s=X(ee,!1,!0,!0);ie.forEach(function(t){t!==ee&&(C(t,s),r.appendChild(t))}),le=!0}if(!n)if(le||ue(),1<ie.length){var c=oe;i._showClone(e),i.options.animation&&!oe&&c&&re.forEach(function(t){i.addAnimationState({target:t,rect:ne}),t.fromRect=ne,t.thisAnimationDuration=null})}else i._showClone(e)}},dragOverAnimationCapture:function(t){var e=t.dragRect,n=t.isOwner,o=t.activeSortable;if(ie.forEach(function(t){t.thisAnimationDuration=null}),o.options.animation&&!n&&o.multiDrag.isMultiDrag){ne=a({},e);var i=v(ee,!0);ne.top-=i.f,ne.left-=i.e}},dragOverAnimationComplete:function(){le&&(le=!1,ue())},drop:function(t){var e=t.originalEvent,n=t.rootEl,o=t.parentEl,i=t.sortable,r=t.dispatchSortableEvent,a=t.oldIndex,l=t.putSortable,s=l||this.sortable;if(e){var c=i.options,u=o.children;if(!se)if(c.multiDragKey&&!this.multiDragKeyDown&&this._deselectMultiDrag(),P(ee,c.selectedClass,!~ie.indexOf(ee)),~ie.indexOf(ee))ie.splice(ie.indexOf(ee),1),Jt=null,K({sortable:i,rootEl:n,name:"deselect",targetEl:ee,originalEvt:e});else{if(ie.push(ee),K({sortable:i,rootEl:n,name:"select",targetEl:ee,originalEvt:e}),(!c.multiDragKey||this.multiDragKeyDown)&&e.shiftKey&&Jt&&i.el.contains(Jt)){var d,h,f=F(Jt),p=F(ee);if(~f&&~p&&f!==p)for(d=f<p?(h=f,p):(h=p,f+1);h<d;h++)~ie.indexOf(u[h])||(P(u[h],c.selectedClass,!0),ie.push(u[h]),K({sortable:i,rootEl:n,name:"select",targetEl:u[h],originalEvt:e}))}else Jt=ee;te=s}if(se&&this.isMultiDrag){if((o[L].options.sort||o!==n)&&1<ie.length){var g=X(ee),v=F(ee,":not(."+this.options.selectedClass+")");if(!ae&&c.animation&&(ee.thisAnimationDuration=null),s.captureAnimationState(),!ae&&(c.animation&&(ee.fromRect=g,ie.forEach(function(t){if(t.thisAnimationDuration=null,t!==ee){var e=le?X(t):g;t.fromRect=e,s.addAnimationState({target:t,rect:e})}})),ue(),ie.forEach(function(t){u[v]?o.insertBefore(t,u[v]):o.appendChild(t),v++}),a===F(ee))){var m=!1;ie.forEach(function(t){t.sortableIndex===F(t)||(m=!0)}),m&&r("update")}ie.forEach(function(t){T(t)}),s.animateAll()}te=s}(n===o||l&&"clone"!==l.lastPutMode)&&re.forEach(function(t){t.parentNode&&t.parentNode.removeChild(t)})}},nullingGlobal:function(){this.isMultiDrag=se=!1,re.length=0},destroy:function(){this._deselectMultiDrag(),h(document,"pointerup",this._deselectMultiDrag),h(document,"mouseup",this._deselectMultiDrag),h(document,"touchend",this._deselectMultiDrag),h(document,"keydown",this._checkKeyDown),h(document,"keyup",this._checkKeyUp)},_deselectMultiDrag:function(t){if(!se&&te===this.sortable&&!(t&&k(t.target,this.sortable.options.draggable,this.sortable.el,!1)||t&&0!==t.button))for(;ie.length;){var e=ie[0];P(e,this.sortable.options.selectedClass,!1),ie.shift(),K({sortable:this.sortable,rootEl:this.sortable.el,name:"deselect",targetEl:e,originalEvt:t})}},_checkKeyDown:function(t){t.key===this.sortable.options.multiDragKey&&(this.multiDragKeyDown=!0)},_checkKeyUp:function(t){t.key===this.sortable.options.multiDragKey&&(this.multiDragKeyDown=!1)}},a(t,{pluginName:"multiDrag",utils:{select:function(t){var e=t.parentNode[L];e&&e.options.multiDrag&&!~ie.indexOf(t)&&(te&&te!==e&&(te.multiDrag._deselectMultiDrag(),te=e),P(t,e.options.selectedClass,!0),ie.push(t))},deselect:function(t){var e=t.parentNode[L],n=ie.indexOf(t);e&&e.options.multiDrag&&~n&&(P(t,e.options.selectedClass,!1),ie.splice(n,1))}},eventOptions:function(){var n=this,o=[],i=[];return ie.forEach(function(t){var e;o.push({multiDragElement:t,index:t.sortableIndex}),e=le&&t!==ee?-1:le?F(t,":not(."+n.options.selectedClass+")"):F(t),i.push({multiDragElement:t,index:e})}),{items:e(ie),clones:[].concat(re),oldIndicies:o,newIndicies:i}},optionListeners:{multiDragKey:function(t){return"ctrl"===(t=t.toLowerCase())?t="Control":1<t.length&&(t=t.charAt(0).toUpperCase()+t.substr(1)),t}}})}),Nt});;$(document).ready(function(){$('#landing__gallery-close').on('click',function(){$('.schoolLanding__header-gallery').css('display','none');});$('.schoolLanding__header-wrapper').on('click',function(){$('.schoolLanding__header-gallery').css('display','block');var sync1=$("#schoolLanding__header-gallery__sliderone");var sync2=$("#schoolLanding__header-gallery__slidertwo");var slidesPerPage=10;var syncedSecondary=true;sync1.owlCarousel({items:1,nav:true,dots:true,loop:true,responsiveRefreshRate:200,navText:['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #fff;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>','<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #fff;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],}).on('changed.owl.carousel',syncPosition);sync2.on('initialized.owl.carousel',function(){sync2.find(".owl-item").eq(0).addClass("current");}).owlCarousel({items:slidesPerPage,dots:true,nav:true,smartSpeed:200,slideSpeed:500,slideBy:slidesPerPage,responsiveRefreshRate:100,responsive:{1180:{items:slidesPerPage},860:{items:8},768:{items:6},480:{items:4},320:{items:3}}}).on('changed.owl.carousel',syncPosition2);function syncPosition(el){var count=el.item.count-1;var current=Math.round(el.item.index-(el.item.count/2)-.5);if(current<0){current=count;}
if(current>count){current=0;}
sync2.find(".owl-item").removeClass("current").eq(current).addClass("current");var onscreen=sync2.find('.owl-item.active').length-1;var start=sync2.find('.owl-item.active').first().index();var end=sync2.find('.owl-item.active').last().index();if(current>end){sync2.data('owl.carousel').to(current,100,true);}
if(current<start){sync2.data('owl.carousel').to(current-onscreen,100,true);}}
function syncPosition2(el){if(syncedSecondary){var number=el.item.index;sync1.data('owl.carousel').to(number,100,true);}}
sync2.on("click",".owl-item",function(e){e.preventDefault();var number=$(this).index();sync1.data('owl.carousel').to(number,300,true);});});$('.schoolLanding__content-category__item').on('click',function(){$('.schoolLanding__content-services__item').hide()
$('.schoolLanding__content-category__item').removeClass('active');$(this).toggleClass('active');id=$(this).attr('id')
$('.category'+id).show()});var item_count=parseInt($('.schoolLanding__content-teacher').length);$('.schoolLanding__content-teachers').owlCarousel({loop:true,autoplay:true,autoplayTimeout:3000,margin:10,dots:false,nav:false,items:5,onInitialize:function(event){if(item_count<4){$('.schoolLanding__content-teachers').css({'display':'flex','justifyContent':'center'})
this.options.loop=false;console.log('less one')}
else{this.options.loop=true;console.log('more one')}},})
$('.map_phone-main').on('click',function(){$('.map_phone-main').hide();$('.map_phone-other').show();$(this).hide()});$('.map_phone-main2').on('click',function(){$('.map_phone-other2').show();});var summWeight=0;var summSlides=$('.map_sameorg-item').length;$('.select__prev').on('click',function(){if(summWeight!==0){var itemWeight=$('.map_sameorg-item:first-child').outerWidth();summWeight-=itemWeight;$('.map_sameorg-item').css('left','-'+summWeight+'px');}
if(summWeight===0){$('.select__next').css('color','#285c8a')
$('.select__prev').css('color','#99b1c6')}});$('.select__next').on('click',function(){var itemWeight=$('.map_sameorg-item').outerWidth();if(summWeight!==summSlides*itemWeight-itemWeight){summWeight+=itemWeight;$('.map_sameorg-item').css('left','-'+summWeight+'px')}
if(summWeight===summSlides*itemWeight-itemWeight){$('.select__next').css('color','#99b1c6')
$('.select__prev').css('color','#285c8a')}});let number=document.getElementById('number-counter');let start=0;if(number&&parseInt(number.textContent>0)){let end=+number.textContent;let ticks=20;let speed=70;let randomNumbers=[end]
for(let i=0;i<ticks-1;i++){randomNumbers.unshift(Math.floor(Math.random()*(end-start+1)+start));}
randomNumbers.sort((a,b)=>{return a-b});let x=0;let interval=setInterval(function(){number.innerHTML=randomNumbers.shift();if(++x===ticks){window.clearInterval(interval);}},speed);}
$(document).on('click','.kanban-column-add__open',function(){$(this).parent().removeClass('kanban-column-add__hidden').addClass('kanban-column-add__showed');$('.kanban-column-add input').focus();});$(document).on('click','.kanban-column-add i',function(){$(this).parent().removeClass('kanban-column-add__showed').addClass('kanban-column-add__hidden');});$(document).on('click','.kanban-column-add button',function(){let inputVal=$('.kanban-column-add input').val();let elem=$(`<div class="kanban-column"><div class="kanban-column-item"><h5>${inputVal}</h5></div><div class="kanban-column-item__add kanban-column-add-item__hidden"><a class="kanban-column-item-add__open">+ Добавьте еще одну карточку</a><input placeholder="Ввести заголовок для этой карточки" type="text"><button>Добавить карточку</button><i class="icon close icon"></i></div></div>`);if(inputVal!==''){$(this).parent().parent().before(elem);$(this).siblings('input').val('').focus();}});$(document).on('click','.kanban-column-item-add__open',function(){$(this).parent().removeClass('kanban-column-add-item__hidden').addClass('kanban-column-add-item__showed');$('.kanban-column-item__add input').focus();});$(this).on('click','.kanban-column-item__add i',function(){$(this).parent().removeClass('kanban-column-add-item__showed').addClass('kanban-column-add-item__hidden');});$(document).on('click','.kanban-column-item__add button',function(){let input=$(this).siblings('input');let inputVal=input.val();let elem=$(`<div class="kanban-column-task" draggable="true">${inputVal}</div>`)
if(inputVal!=='')$(this).parent().siblings().append(elem);input.val('');input.focus();});$(document).on('click','.kanban-column-task',function(){$('#kanban-modal').modal('show');});$(document).on('click','.kanban-modal-icon-close',function(){$('#kanban-modal').modal('hide');});$(document).on('click','.kanban-modal-desc',function(){$('.kanban-modal-desc').addClass('kanban-modal-desc-hidden');$('.kanban-modal-desc__text-block').removeClass('kanban-modal-desc-hidden');$('.kanban-modal-desc__text').focus();});$('.kanban-modal-desc__text-block-btn').on('click',function(){let kanbanTextBlock=$('.kanban-modal-desc');kanbanTextBlock.text($('.kanban-modal-desc__text').val())
kanbanTextBlock.removeClass('kanban-modal-desc-hidden');$('.kanban-modal-desc__text-block').addClass('kanban-modal-desc-hidden');if(kanbanTextBlock.text()!=='Добавить более подробное описание...'){kanbanTextBlock.addClass('kanban-modal-desc-edited');}
if(kanbanTextBlock.text()===''){kanbanTextBlock.text('Добавить более подробное описание...');kanbanTextBlock.removeClass('kanban-modal-desc-edited')}});$('.kanban-modal-desc__text-block-btn__close').on('click',function(){let kanbanTextBlock=$('.kanban-modal-desc');kanbanTextBlock.removeClass('kanban-modal-desc-hidden');$('.kanban-modal-desc__text-block').addClass('kanban-modal-desc-hidden');$('.kanban-modal-desc__text').val(kanbanTextBlock.text());});$('.kanban-modal-features__modal-input').datepicker({timepicker:true});$('.kanban-modal-features__modal-input').data(['datepicker'])
$('#kanban-modal-features__item-clock').on('click',function(){console.log('Clicked')
$('.kanban-modal-features__modal').css('display','block');$('.kanban-modal-features__modal-input').focus();});$('.kanban-modal-features__modal-btn').on('click',function(){$('.kanban-modal-features__modal').css('display','none');});var firstDragEl=document.querySelectorAll('.kanban-column-item');for(item of firstDragEl){new Sortable(item,{group:"colums",handle:".kanban-column-task",draggable:".kanban-column-task",ghostClass:"sortable-ghost",onAdd:function(evt){var itemEl=evt.item;},onUpdate:function(evt){var itemEl=evt.item;},onRemove:function(evt){var itemEl=evt.item;}});}});;$(document).ready(function(){$('.squad_office_filter').on('change',function(e){filter_squads()})
filter_squads()
async function filter_squads(){obj=$('.squad_filter.green').attr('option')
if(obj=='all'){$('.sq_all').show()}
else{$('.sq_all').hide()
squad_office=$('.squad_office_filter option:selected').val()
if(obj=='regular'){$('.online_False').show()
$('.ind_False').show()}
else if(obj=='online'){$('.online_True').show()}
else if(obj=='individual'){$('.ind_True').show()}
if(obj=='empty'){$('.empty_True').show()}
else{$('.empty_True').hide()}}}
async function change_squad_filter(obj){console.log('obj',obj)
$('.squad_filter').removeClass('green')
$('.squad_filter').addClass('white')
$('.'+obj+'_filter').addClass('green')
$('.'+obj+'_filter').removeClass('white')}
$('.squad_filter').click(async function(e){await change_squad_filter($(this).attr('option'))
filter_squads()})
$('.subject_cat_filter').on('change',function(e){filter_subjects()})
filter_subjects()
async function filter_subjects(){obj=$('.subject_filter.green').attr('option')
if(obj=='all'){$('.catall').show()}
else{$('.catall').hide()
if(obj=='regular'){$('.online_False').show()
$('.ind_False').show()}
else if(obj=='online'){$('.online_True').show()}
else if(obj=='individual'){$('.ind_True').show()}}}
async function change_subject_filter(obj){console.log('obj',obj)
$('.subject_filter').removeClass('green')
$('.subject_filter').addClass('white')
$('.'+obj+'_filter').addClass('green')
$('.'+obj+'_filter').removeClass('white')}
$('.subject_filter').click(async function(e){await change_subject_filter($(this).attr('option'))
filter_subjects()})
$('.online_option').click(function(e){url=$('.data').attr('online_option_url')
id=$('.data').attr('id')
option=$(this).attr('option')
$('.online_option_load').addClass('active')
$.ajax({url:url,data:{'id':id,'option':option,},dataType:'json',success:function(data){$('.online_option_load').removeClass('active')
$('.online_option').removeClass('green')
$('.online_option').addClass('white')
$('.online_option_'+option).addClass('green')
$('.online_option_'+option).removeClass('white')}})})
$('.individual_option').click(function(e){url=$('.data').attr('individual_option_url')
id=$('.data').attr('id')
option=$(this).attr('option')
$('.individual_option_load').addClass('active')
$.ajax({url:url,data:{'id':id,'option':option,},dataType:'json',success:function(data){$('.individual_option_load').removeClass('active')
$('.individual_option').removeClass('green')
$('.individual_option').addClass('white')
$('.individual_option_'+option).addClass('green')
$('.individual_option_'+option).removeClass('white')}})})
$('.right_option').click(function(e){id=$(this).attr('id')
$('.officefilter').hide()
$('.office'+id).show()
$('.right_option').removeClass('shadow_small')
$(this).addClass('shadow_small')})
$('.choose_color').click(function(e){url=$('.choose_color_def').attr('url')
id=$(this).attr('id')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){$('.choose_color_def').css('background-color',id)}})})
$('.make_alive').click(function(e){this_=$(this)
url=this_.attr('url')
id=this_.attr('id')
$.ajax({url:url,data:{'id':id,},dataType:'json',success:function(data){this_.hide()
$('.success_alive'+id).show()}})})
$('.constday_choose').click(function(e){if($(this).attr('class').indexOf("green")>=0){$(this).removeClass('green')}
else{$(this).addClass('green')}})
$('.search_group_show').on('click',function(e){$('.hint_students_group').show()})
$('.search_students_group').on('input',function(e){text=$(this).val()
url=$(this).attr('url')
if(text.length==0){$('.hint_students_group').hide()}
else{$.ajax({url:url,data:{'text':text,},dataType:'json',success:function(data){$('.hint_students_group').show()
$('.hint_students_group').empty()
console.log(data.res)
for(var i=0;i<data.res.length;i++){id=data.res[i][0]
name=data.res[i][1]
image=data.res[i][2]
check='<i class="icon check circle green studenticon'+id+'" style="display:none;"></i>'
sign='+'
if(data.res[i][3]){check='<i class="icon check circle green studenticon'+id+'"></i>'
sign='-'}
$('<div class="search_group_link"> <img class="search-group-img" src="'+image+'" alt="photo"> <span class="search-group-name">'+name+'</span> '+check+' <a class="ui button mini blue add_student add_student'+id+' search_group_add" onclick="add_student('+"'"+id+"'"+')" id="'+id+'">'+sign+'</a> </div>').appendTo('.hint_students_group')}}})}});$('.start_searching_groups').on('input',function(e){text=$(this).val()
url=$(this).attr('url')
if(text.length==0){$('.show_search_groups').hide()}
else{$.ajax({url:url,data:{'text':text,},dataType:'json',success:function(data){$('.show_search_groups').show()
$('.show_search_groups').empty()
for(var i=0;i<data.res.length;i++){title=data.res[i][0]
url=data.res[i][1]
$('<div class="full-w "><a style="text-align:left;" href="'+url+'" class="no_padding ui button blue full-w search-item"> <span class="search-group-name">'+title+'</span> </a></div>').appendTo('.show_search_groups')}}})}});$('.start_searching_subjects').on('input',function(e){text=$(this).val()
url=$(this).attr('url')
if(text.length==0){$('.show_search_subjects').hide()}
else{$.ajax({url:url,data:{'text':text,},dataType:'json',success:function(data){$('.show_search_subjects').show()
$('.show_search_subjects').empty()
for(var i=0;i<data.res.length;i++){title=data.res[i][0]
url=data.res[i][1]
image=data.res[i][2]
if(image==''){image='/static/images/squad.png'}
$('<div class="full-w "><a style="text-align:left;" href="'+url+'" class="full-w search-item textw ui button small blue pt5 pb5 pl10 pr10"><span class="search-group-name">'+title+'</span> </a></div>').appendTo('.show_search_subjects')}}})}});$('.det').on('click',function(e){this_=$(this)
console.log('work0')
$.ajax({url:'http://www.pinocchio.kz/subjects/api/squad_list/26/',method:"GET",data:{},success:function(data){document.getElementById('detder').innerHTML=data.calendar;},error:function(error){console.log('error')}})});$('.change_teacher').on('change',function(e){this_=document.getElementById("change_teacher");teacher_id=this_.options[this_.selectedIndex].value
$.ajax({url:this_.getAttribute('url'),method:"GET",data:{'teacher_id':teacher_id,'squad_id':this_.getAttribute('squad_id'),},success:function(data){},error:function(error){console.log('error')}})});$('.day_window').on('click',function(e){e.preventDefault();this_=$(this)
$('.day_id').attr('id',this_.attr('id'))});$('.add_squad_to_subject').on('click',function(e){var url=$(this).attr('data-href');var subject_id=$(this).attr('id');select=document.getElementsByClassName('selecttt')[0]
var squad_id=select.options[select.selectedIndex].value
$.ajax({url:url,method:"GET",data:{'subject_id':subject_id,'squad_id':squad_id,},success:function(data){location.reload()},error:function(error){console.log('error')}})});$('.delete_squad_from_subject').on('click',function(e){var url=$(this).attr('data-href');var squad_id=$(this).attr('squad_id');var subject_id=$('.instance_id').attr('id')
$.ajax({url:url,method:"GET",data:{'subject_id':subject_id,'squad_id':squad_id,},success:function(data){location.reload()},error:function(error){console.log('error')}})});$('.set_squad_time').on('click',function(e){var url=$(this).attr('data-href');var day=$(this).attr('day');var time=$(this).attr('time');var id='check'+day+time;var checked=document.getElementById(id).checked
var instance_id=$('.instance_id').attr('id');$.ajax({url:url,method:"GET",data:{'day':day,'time':time,'checked':checked,'instance_id':instance_id,},success:function(data){location.reload()},error:function(error){console.log('error')}})});$('.remove_lesson_from_subject').on('click',function(e){var material_id=$(this).attr('material_id');var lesson_id=$(this).attr('lesson_id');var url=$(this).attr('url');$.ajax({url:url,method:"GET",data:{'material_id':material_id,'lesson_id':lesson_id,},success:function(data){$("#lesson_in_material"+material_id+'l'+lesson_id).hide('fast')},error:function(error){console.log('error')}})});$('.open_time_lessons').on('click',function(e){id=$(this).attr('id')
if($(this).attr('status')=='closed'){$('#time_lessons'+id).show('fast')
$(this).attr('status','opened')}
else{$('#time_lessons'+id).hide('fast')
$(this).attr('status','closed')}});$('.open_option').on('click',function(e){for(var i=0;i<document.getElementsByClassName("option").length;i++){document.getElementsByClassName("option")[i].setAttribute('style','display:none;')
document.getElementsByClassName("open_option")[i].setAttribute('class','open_option other_option')}
var id=$(this).attr('name')
$('#'+id).show()
$(this).attr('class','open_option current_option')});$('.open_option2').on('click',function(e){for(var i=0;i<document.getElementsByClassName("option2").length;i++){document.getElementsByClassName("option2")[i].setAttribute('style','display:none;')
document.getElementsByClassName("open_option2")[i].setAttribute('class','open_option2 other_option2')}
var id=$(this).attr('name')
$('#option2'+id).show()
$(this).attr('class','open_option2 current_option2')});$('.add_paper').on('click',function(e){this_=$(this)
var day_id=$('.day_id').attr('id');var paper_id=this_.attr('id');var group_id=$('.day_id').attr('group_id');url=this_.attr('data-href');$.ajax({url:url,method:"GET",data:{'day_id':day_id,'paper_id':paper_id,'group_id':group_id,},success:function(data){location.reload()},error:function(error){console.log('error')}})});$(".open_folder").click(function(event){event.preventDefault();var this_=$(this)
id=this_.attr('id')
title=this_.attr('title')
paper_title=document.getElementsByClassName('parent_title')[0]
paper_title.innerHTML=this_.attr('title')
span=document.createElement('span');span.setAttribute('class','parent_folder_id')
span.setAttribute('parentId',id)
span.setAttribute('parentTitle',title)
span.setAttribute('style','display:none;')
data_div=document.getElementsByClassName('data')[0]
data_div.appendChild(span)
$('.back_to_parent').show()
console.log(this_.attr('title'))
for(i=0;i<document.getElementsByClassName('paper').length;i++){paper=document.getElementsByClassName('paper')[i]
if(paper.getAttribute('parent')==id){paper.setAttribute('style','display:block')}
else{paper.setAttribute('style','display:none')}}
for(i=0;i<document.getElementsByClassName('folder').length;i++){folder=document.getElementsByClassName('folder')[i]
if(folder.getAttribute('parent')==id){folder.setAttribute('style','display:block')}
else{folder.setAttribute('style','display:none')}}});$(".back_to_parent").click(function(event){event.preventDefault();var this_=$(this)
number_of_last=document.getElementsByClassName('parent_folder_id').length-1
last_span=document.getElementsByClassName('parent_folder_id')[number_of_last]
last_span.remove()
pre_last_span=document.getElementsByClassName('parent_folder_id')[number_of_last-1]
id=pre_last_span.getAttribute('parentId')
if(id=='none'){this_.hide()}
console.log(number_of_last,pre_last_span,id)
paper_title=document.getElementsByClassName('parent_title')[0]
paper_title.innerHTML=pre_last_span.getAttribute('parentTitle')
for(i=0;i<document.getElementsByClassName('paper').length;i++){paper=document.getElementsByClassName('paper')[i]
if(paper.getAttribute('parent')==id){paper.setAttribute('style','display:block')}
else{paper.setAttribute('style','display:none')}}
for(i=0;i<document.getElementsByClassName('folder').length;i++){folder=document.getElementsByClassName('folder')[i]
if(folder.getAttribute('parent')==id){folder.setAttribute('style','display:block')}
else{folder.setAttribute('style','display:none')}}});$(".change-btn").click(function(e){e.preventDefault()
var this_=$(this)
var changeUrl=this_.attr("data-href")
var id2="#"+this_.attr("id2")
var inpt='.'+this_.attr("id2")
if(changeUrl){$.ajax({url:changeUrl,method:"GET",data:{},success:function(data){if(this_.attr("value2")=='free'){$(id2).css('background-color','#5181b8')
$(id2).attr('value2','busy')
$(inpt).attr('name',this_.attr("id2")+'busy')}
else{$(id2).css('background-color','#F2F2F2')
$(id2).attr('value2','free')
$(inpt).attr('name',this_.attr("id2")+'free')}},error:function(error){console.log('error')}})}});$(".follow_btn").click(function(e){e.preventDefault()
var this_=$(this)
console.log('de')
var regUrl=this_.attr("data-href")
if(regUrl){$.ajax({url:regUrl,method:"GET",data:{},success:function(data){console.log(data.reg)
if(data.reg){$(".follow_btn").text('Отписаться')
$(".follow_btn").attr('class','ui button tiny follow_btn red')}
else{$(".follow_btn").text('Записаться')
$(".follow_btn").attr('class','ui button tiny follow_btn green')}},error:function(error){console.log(error)}})}});$(".leftt").click(function(e){e.preventDefault();var this_=$(this);current_id=parseInt($('.week_id').attr('id'))
id=current_id-1;var max_week=$('.max_week').attr('id')
if(id>0){$('.week_id').attr('id',id)
$('#week'+current_id).attr('style','display:none')
$('#week'+id).show()}});$(".rightt").click(function(e){e.preventDefault();var this_=$(this);current_id=parseInt($('.week_id').attr('id'))
id=current_id+1;if(id<=parseInt($('#calendar').attr('length'))){$('.week_id').attr('id',id)
$('#week'+current_id).attr('style','display:none')
$('#week'+id).show();}});$(".lefttt").click(function(e){e.preventDefault();var this_=$(this);def=$('.weekhead_id'+this_.attr('id')).attr('def')
weekhead_current_id=parseInt($('.weekhead_id'+this_.attr('id')).attr('id'))
weekhead_id=weekhead_current_id-1
if(weekhead_id>0){$('#weekhead'+def+weekhead_id).show('fast')
$('#weekhead'+def+weekhead_current_id).hide()
$('.weekhead_id'+this_.attr('id')).attr('id',weekhead_id)
console.log(def+weekhead_current_id,weekhead_id)
list=document.getElementsByClassName('week_id'+this_.attr('id'))
for(var i=0;i<list.length;i++){current_id=parseInt(list[i].getAttribute('id'))
id=current_id-1;if(id>0){list[i].setAttribute('id',id)
document.getElementsByClassName('week'+list[i].getAttribute('def')+current_id)[0].setAttribute('style','display:none')
document.getElementsByClassName('week'+list[i].getAttribute('def')+id)[0].setAttribute('style','display:block')}}}});$(".righttt").click(function(e){e.preventDefault();var this_=$(this);def=$('.weekhead_id'+this_.attr('id')).attr('def')
weekhead_current_id=parseInt($('.weekhead_id'+this_.attr('id')).attr('id'))
weekhead_id=weekhead_current_id+1
if(weekhead_id<=parseInt($('#paper'+this_.attr('id')).attr('length'))){$('#weekhead'+def+weekhead_id).show('fast')
$('#weekhead'+def+weekhead_current_id).hide()
$('.weekhead_id'+this_.attr('id')).attr('id',weekhead_id)
console.log(def+weekhead_current_id,weekhead_id)
list=document.getElementsByClassName('week_id'+this_.attr('id'))
for(var i=0;i<list.length;i++){current_id=parseInt(list[i].getAttribute('id'))
id=current_id+1;if(id<=parseInt($('#paper'+this_.attr('id')).attr('length'))){list[i].setAttribute('id',id)
document.getElementsByClassName('week'+list[i].getAttribute('def')+current_id)[0].setAttribute('style','display:none')
document.getElementsByClassName('week'+list[i].getAttribute('def')+id)[0].setAttribute('style','display:block')}}}});});$(document).ready(function(){$('.estimate_lesson').click(function(){lesson_id=$('.lesson_id').attr('id')
var onStar=parseInt($(this).data('value'),10);var stars=$(this).parent().children('li.star');for(i=0;i<stars.length;i++){$(stars[i]).removeClass('selected');}
for(i=0;i<onStar;i++){$(stars[i]).addClass('selected');}
var ratingValue=parseInt($('#stars li.selected').last().data('value'),10);$.ajax({url:$('.estimate_url').attr('url'),data:{'new_rating':ratingValue,'lesson_id':lesson_id,},dataType:'json',success:function(data){$('.thanks').show('fast')}});})
$('.pay_for_course').click(function(){var course_id=$(this).attr('course_id')
$.ajax({url:$(this).attr('url'),data:{'course_id':course_id,},dataType:'json',success:function(data){if(data.ok){$('.bought_course').modal('show')}
else{$('.not_enough_dils').show('fast')}}});})
$(".show_edit").click(function(){for(var i=document.getElementsByClassName('edit').length-1;i>=0;i--){oldclass=document.getElementsByClassName('edit')[i].getAttribute('class')
document.getElementsByClassName('edit')[i].setAttribute('class',oldclass+' edit_visible');}})
$(".new_comment").click(function(){var parent_id=$(this).attr('parent_id')
var content=document.getElementById('comment_content'+parent_id).value
$.ajax({url:$(this).attr('url'),data:{'parent_id':parent_id,'lesson_id':$('.lesson_id').attr('id'),'content':content,},dataType:'json',success:function(data){location.reload()}});})
$(".like_comment").click(function(){this_=$(this)
var id=$(this).attr('id')
$.ajax({url:$(this).attr('url'),data:{'id':id,},dataType:'json',success:function(data){if(data.like){console.log(this_.attr('style'))
$("#likeup"+id).attr('style',"color:#6c9b45 !important;");}
else{$("#dislikedown"+id).attr("style","color:#99b1c6 !important;")}
document.getElementById('likes_number'+id).innerHTML=data.like_num}});})
$(".dislike_comment").click(function(){var id=$(this).attr('id')
$.ajax({url:$(this).attr('url'),data:{'id':id,},dataType:'json',success:function(data){if(data.dislike){$("#dislikedown"+id).attr('style','color:red !important;');}
else{$("#likeup"+id).attr("style","color:#99b1c6 !important;")}
document.getElementById('likes_number'+id).innerHTML=data.like_num}});})
$(".like_lesson").click(function(){this_=$(this)
var id=$(this).attr('id')
$.ajax({url:$(this).attr('url'),data:{'id':id,},dataType:'json',success:function(data){if(data.like){console.log(this_.attr('style'))
$("#likeup_lesson"+id).attr('style',"color:#6c9b45 !important;");}
else{$("#dislikedown_lesson"+id).attr("style","color:#99b1c6 !important;")}
document.getElementById('likes_number_lesson'+id).innerHTML=data.like_num}});})
$(".dislike_lesson").click(function(){var id=$(this).attr('id')
$.ajax({url:$(this).attr('url'),data:{'id':id,},dataType:'json',success:function(data){if(data.dislike){$("#dislikedown_lesson"+id).attr('style','color:red !important;');}
else{$("#likeup_lesson"+id).attr("style","color:#99b1c6 !important;")}
document.getElementById('likes_number_lesson'+id).innerHTML=data.like_num}});})
$(".open_rename_paper").click(function(){var id=$(this).attr('id')
$('.paper_title_'+id).hide()
$('.paper_rename_div_'+id).attr('style','display:inline-block')})
$(".rename_paper").click(function(){var id=$(this).attr('id')
var new_title=document.getElementsByClassName('paper_new_title_'+id)[0].value
$.ajax({url:$(this).attr('url'),data:{'id':$(this).attr('paper_id'),'new_title':new_title,},dataType:'json',success:function(data){location.reload()}});})
$(".delete_paper").click(function(){$.ajax({url:$(this).attr('url'),data:{'id':$(this).attr('id'),},dataType:'json',success:function(data){location.reload()}});})
$(".open_rename_subtheme").click(function(){var id=$(this).attr('id')
$('.subtheme_title_'+id).hide()
$('.subtheme_rename_div_'+id).attr('style','display:inline-block')})
$(".rename_subtheme").click(function(){var id=$(this).attr('id')
var new_title=document.getElementsByClassName('subtheme_new_title_'+id)[0].value
$.ajax({url:$(this).attr('url'),data:{'id':$(this).attr('subtheme_id'),'new_title':new_title,},dataType:'json',success:function(data){location.reload()}});})
$(".open_rewrite_subtheme").click(function(){var id=$(this).attr('id')
$('.subtheme_content_'+id).hide()
$('.subtheme_rewrite_div_'+id).show()})
$(".rewrite_subtheme").click(function(){var id=$(this).attr('id')
var new_content=document.getElementsByClassName('subtheme_new_content_'+id)[0].value
$.ajax({url:$(this).attr('url'),data:{'id':$(this).attr('subtheme_id'),'new_content':new_content,},dataType:'json',success:function(data){location.reload()}});})
$(".delete_subtheme").click(function(){$.ajax({url:$(this).attr('url'),data:{'id':$(this).attr('id'),},dataType:'json',success:function(data){location.reload()}});})
$(document).on("click",'.pastee',function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
var new_parent=this_.attr("new_parent")
$.ajax({url:pageUrl,data:{'school_id':this_.attr("school"),'new_parent':new_parent,},dataType:'json',success:function(data){location.reload()}});});$(".create_docfolder").click(function(){var this_=$(this)
var pageUrl=this_.attr("data-href")
console.log('d')
$.ajax({url:pageUrl,data:{"school_id":this_.attr("school"),'parent_id':this_.attr("parent_id")},dataType:'json',success:function(data){location.reload()}});});$(".delete_doc").click(function(event){event.preventDefault();var this_=$(this);var pageUrl=this_.attr("data-href")
if(pageUrl){$.ajax({url:pageUrl,data:{'id':this_.attr("id"),},dataType:'json',success:function(data){$('#all_doc'+this_.attr('id')).hide('fast');}});}})});window.log=function f(){log.history=log.history||[];log.history.push(arguments);if(this.console){var args=arguments,newarr;args.callee=args.callee.caller;newarr=[].slice.call(args);if(typeof console.log==='object')log.apply.call(console.log,console,newarr);else console.log.apply(console,newarr);}};(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return(window.console={});}}());;$(document).ready(function(){$('#search-input').on('input',function(e){id=$(this).attr('id')
text=$(this).val()
url=$(this).attr('url')
$.ajax({url:url,data:{'text':text,},dataType:'json',success:function(data){$('.search-list').empty();$('.search-list-title').hide()
if(data.res_profiles.length==0&&data.res_subjects.length==0&&data.res_squads.length==0&&data.res_courses.length==0){$('.search-bar').hide()}
else{$('.search-bar').show()}
if(data.res_profiles.length==0){$('.search-list-people').hide();$('.search-list-title-people').hide()}
else{$('.search-list-title-people').show()
$('.search-list-people').show();for(var i=0;i<data.res_profiles.length;i++){name=data.res_profiles[i][0]
url=data.res_profiles[i][1]
image_url=data.res_profiles[i][2]
if(image_url==''){image_url="/static/images/nophoto.svg"}
var element=$('<a class="search-item" href="'+url+'"><img class="search-item-img" src='+image_url+' alt="photo"><span class="search-item-name">'+name+'</span></a>').appendTo('.search-list-people');}}
if(data.res_subjects.length==0){$('.search-list-subjects').hide();$('.search-list-title-subjects').hide()}
else{$('.search-list-subjects').show();$('.search-list-title-subjects').show()
for(var i=0;i<data.res_subjects.length;i++){name=data.res_subjects[i][0]
url=data.res_subjects[i][1]
image_url=data.res_subjects[i][2]
if(image_url==''){image_url="/static/images/nophoto.svg"}
var element=$('<a class="search-item" href="'+url+'"><img class="search-item-img" src='+image_url+' alt="photo"><span class="search-item-name">'+name+'</span></a>').appendTo('.search-list-subjects');}}
if(data.res_squads.length==0){$('.search-list-squads').hide();$('.search-list-title-squads').hide()}
else{$('.search-list-squads').show();$('.search-list-title-squads').show()
for(var i=0;i<data.res_squads.length;i++){name=data.res_squads[i][0]
url=data.res_squads[i][1]
image_url=data.res_squads[i][2]
if(image_url==''){image_url="/static/images/nophoto.svg"}
var element=$('<a class="search-item" href="'+url+'"><img class="search-item-img" src='+image_url+' alt="photo"><span class="search-item-name">'+name+'</span></a>').appendTo('.search-list-classes');}}
if(data.res_courses.length==0){$('.search-list-courses').hide();$('.search-list-title-courses').hide()}
else{$('.search-list-courses').show();$('.search-list-title-courses').show()
for(var i=0;i<data.res_courses.length;i++){name=data.res_courses[i][0]
url=data.res_courses[i][1]
image_url=data.res_courses[i][2]
if(image_url==''){image_url="/static/images/nophoto.svg"}
var element=$('<a class="search-item" href="'+url+'"><img class="search-item-img" src='+image_url+' alt="photo"><span class="search-item-name">'+name+'</span></a>').appendTo('.search-list-courses');}}}});})})
$('#search-input').focus(function(event){$('.search-bar').show();event.stopPropagation();$('.notice-bar').css('display','none');var div=$('.notice');div.css('color','#2D437C');});$('#search-form').click(function(event){$('.search-bar').show();event.stopPropagation();$('.notice-bar').hide();$('.notice').attr('status','hide')
var div=$('.notice');div.css('color','#2D437C');})
$("body").click(function(e){$('.search-bar').hide();});;$('.notice').click(function(event){$('.notice-bar').fadeToggle('fast');$('.search-bar').hide();event.stopPropagation();if($(this).attr('status')=='hide'){$(this).attr('status','show')
$('.bell').attr('style','color:#2D437C;')
$('.notice').css('color','#fff');$('.notification_exists').hide()
url=$(this).attr('url')
$.ajax({url:url,data:{},dataType:'json',success:function(data){$('.notice-list').empty()
for(var i=0;i<data.res.length;i++){author=data.res[i][0]
avatar=data.res[i][1]
if(avatar=='None'){avatar='/static/images/nophoto.svg'}
type=data.res[i][2]
url=data.res[i][3]
text=data.res[i][4]
time=data.res[i][5]
$('<li class="notice-item"> <a class="notice-item-link"> <img class="notice_item_img" src='+avatar+' alt="photo"> </a> <div style="display: inline-block;"> <a class="notice-item-link"> '+author+' </a> <span class="notice-item-name"> опубликовал новость </span> <a href="'+url+'">"'+text+'"</a> <br> <div class="notice_time">'+time+'</div> </div> </li> <div class="ui divider" style="margin: 10px 0;"></div>').appendTo('.notice-list');}}})}
else{$(this).attr('status','hide')
$('.bell').attr('style','color:#2D437C;')}});$('.school_landing').click(function(e){e.stopPropagation();});$('.rename_folder_form').click(function(e){e.stopPropagation();});$('.rename_lesson_form').click(function(e){e.stopPropagation();});$('.hint_students_group').click(function(e){e.stopPropagation();});$('.search_group_show').click(function(e){e.stopPropagation();});$('.search_students_group').click(function(e){e.stopPropagation();});$('.profile_links').click(function(e){e.stopPropagation();});$('.profile_name').click(function(e){e.stopPropagation();});$('.card_comment-textarea').click(function(e){e.stopPropagation();});$('.content').click(function(e){e.stopPropagation();});$('.filter-title').click(function(e){e.stopPropagation();});$('.filter-list').click(function(e){e.stopPropagation();});$('.show_hint_schedule').click(function(e){e.stopPropagation();});$('.show_search_groups').click(function(e){e.stopPropagation();});$('.folder_form').click(function(e){e.stopPropagation();});$("body").click(function(e){$('.hint_schedule').hide()
$('.filter-list').hide()
$('.profile_name').attr('status','0')
$('.notice-bar').hide();var div=$('.notice');div.css('color','#2D437C');$(this).attr('status','hide')
$('.school_landing').hide()
$('.map_phone-main').show();$('.map_phone-other').hide();$('.folder_features').hide();$('.lesson_features').hide();$('.doc_features').hide();$('.rename_folder_form').hide();$('.hint_students_group').hide();$('.profile_links').hide()
$('.card_comment-helper').hide()
$('.search_hint').hide();$('#zaiavka_modal').hide('fast')
$('.darker').hide()
$('.show_search_groups').hide()
$('.show_search_subjects').hide()
$('.bselect').hide()
$('.show_search_students').hide()
$('.folder_form').hide()
$('.change_task_modal').hide()});$('.reg_segment').click(function(e){$('.bselect').hide()});