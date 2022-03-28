urls = document.getElementById("urls")
url = urls.getAttribute('get_page_sections')
page_id = urls.getAttribute('page_id')
fillLesson(page_id, url)
function fillLesson(page_id, url){
    $.ajax({
        url: url,
        data: {
            'page_id':page_id,
        },
        dataType: 'json',
        success: function (data) {
            console.log('xxx')
            fillPage(data.data, page_id)
        }
    })
}
function fillPage(data, page_id){
    title = data[0]
    sections = data[2]
    otherPagesLinks = data[3]
    pagesLinksBox = document.getElementById('pagesLinksBox')
    pagesLinksBox.innerHTML = ''
    document.getElementById("page_title").innerHTML = title

    urls = document.getElementById("urls")
    urls.setAttribute('page_id', page_id)

    for (let i = 0; i < otherPagesLinks.length; i++) {
        const page = otherPagesLinks[i];
        crntid = page[0]
        url = page[1]
        other_title = page[2]
        originPageLink = document.getElementById('originPageLink')
        originPageLink = originPageLink.cloneNode(true)
        originPageLink.setAttribute('onclick', 'fillLesson(' + crntid + ', "' + url + '")')
        originPageLink.innerHTML = i+1
        if(crntid == page_id){
            originPageLink.classList.add('bg-green-200');
        }
        
        pagesLinksBox.appendChild(originPageLink)
    }
    sections_box = document.getElementById('sections_box')
    sections_box.innerHTML = ''
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        content = section[0]
        section_orig = document.getElementById('section_orig')
        new_section = section_orig.cloneNode(true)
        new_section.innerHTML = content
        
        sections_box.appendChild(new_section)
    }
}