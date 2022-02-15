get_profile_courses()
async function get_profile_courses(){
    url = document.getElementById("get_profile_courses").getAttribute('url')
    res = []
    $.ajax({
        url: url,
        data: {},
        dataType: 'json',
        success: function (data) {
            constructMap(data.data)
        }
    })
}

async function constructMap(data){
    let screenHeight = screen.height;
    let screenWidth = screen.width;
    let avatar = document.getElementById("avatar")
    let avatarWidth = avatar.offsetWidth
    let avatarHeight = avatar.offsetHeight
    let lessonSize = 20;
    let quantity = data.length;
    let padding = (document.getElementById("profile").offsetWidth - document.getElementsByClassName("container")[0].offsetWidth)/2
    lessonOrig = document.getElementById("lesson")
    let map2Left = 20
    let map2Bottom = avatarHeight + screenHeight/2 - 100 - lessonSize
    x = (screenWidth - padding - lessonSize) / (2*quantity)
    b = (screenWidth - padding - lessonSize) / 2
    if(screenWidth >= 640){
        map2Left = padding + avatarWidth + lessonSize + 50
        map2Bottom = screenHeight/2 + 100
    }
    if(screenWidth >= 1280){
        map2Bottom = screenHeight/2
        b = (screenWidth - avatarWidth - padding - lessonSize - 500) / 2
        x = (screenWidth - avatarWidth - padding - lessonSize - 500) / (2*quantity)
    }
    map2 = document.getElementById('map2')

    a = 10
    h = map2Bottom
    leftM = map2Left
    for (let i = 0; i < quantity; i++) {
        const element = lessonOrig.cloneNode(true);
        
        b = b - x
        olda = a
        a = Math.sqrt(a*a + 2*b*x - x*x)
        leftM = leftM + x
        h = h - (a - olda)

        element.style.top = h + "px"
        element.style.left = leftM + "px"
        element.setAttribute('href', data[i][1])
        console.log('xx', h, leftM)
        map2.appendChild(element)        
    }
}
