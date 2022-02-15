fillModule()
function fillModule(){
    urls = document.getElementById("urls")
    url = urls.getAttribute('get_topic_units')
    topic_id = urls.getAttribute('topic_id')
    $.ajax({
        url: url,
        data: {
            'topic_id':topic_id,
        },
        dataType: 'json',
        success: function (data) {
            fillTopic(data.data)
        }
    })
}
function fillTopic(data){
    title = data[0]
    units = data[2]
    document.getElementById("topic_title").innerHTML = title
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        content = unit[0]
        unit_orig = document.getElementById('unit_orig')
        new_unit = unit_orig.cloneNode(true)
        new_unit.innerHTML = content
        units_box = document.getElementById('units_box')
        units_box.appendChild(new_unit)
    }
}