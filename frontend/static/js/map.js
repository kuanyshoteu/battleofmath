myCourses(0)
function myCourses(order){
    url = document.getElementById("urls").getAttribute('mycourses')
    $.ajax({
        url: url,
        data: {},
        dataType: 'json',
        success: function (data) {
            course_list = data.course_list
            crntCourseId = course_list[order][0]
            fillCourses(data.new_student, crntCourseId)
            if (data.new_student == false){
                myLessons(crntCourseId)
            }
        }
    })
}

function startCourse(courseId, order){
    url = document.getElementById("urls").getAttribute('startCourse')
    $.ajax({
        url: url,
        data: {
            'courseId':courseId
        },
        dataType: 'json',
        success: function (data) {
            courseBox = document.getElementById('allCourseBox')
            courseBox.innerHTML = ''
            myCourses(order)
        }
    })
}
function fillCourses(isNewStudent, crntCourseId){
    if(isNewStudent){
        originId = 'allCourseOrigin'
        courseBoxId = 'allCourseBox'
    }
    else{
        originId = 'courseOrigin'
        courseBoxId = 'courseBox'        
    }
    courseBox = document.getElementById(courseBoxId)
    courseBox.innerHTML = ''
    for(var i = 0; i < course_list.length; i++){
        courseId = course_list[i][0]
        courseOrig = document.getElementById(originId)
        courseClone = courseOrig.cloneNode(true)
        if(crntCourseId == courseId){
            courseClone.classList.remove('bg-white');
            courseClone.classList.add('bg-green-200');
            courseClone.getElementsByClassName('startCourse')[0].classList.add('hidden')
        }
        courseClone.getElementsByClassName('courseTitle')[0].innerHTML = course_list[i][1]
        courseClone.getElementsByClassName('courseSlogan')[0].innerHTML = course_list[i][3]
        courseClone.setAttribute("id", "myCourse"+courseId)
        courseClone.getElementsByClassName('startCourse')[0].setAttribute('onclick', 'startCourse(' + courseId + ',' + i + ')')
        courseBox.prepend(courseClone)
    }
}

function myLessons(courseId){
    url = document.getElementById("urls").getAttribute('mylessons')
    $.ajax({
        url: url,
        data: {
            "courseId":courseId,
        },
        dataType: 'json',
        success: function (data) {
            createConstants(data.lesson_list.length)
            constructMap(data.lesson_list)
        }
    })
}

function createConstants(quantity){
    let screenHeight = screen.height;
    let screenWidth = screen.width;
    let avatar = document.getElementById("avatar")
    let avatarWidth = avatar.offsetWidth
    let avatarHeight = avatar.offsetHeight
    let lessonSize = 20;
    
    let padding = (document.getElementById("profile").offsetWidth - document.getElementsByClassName("container")[0].offsetWidth)/2
    lessonCircleOrig = document.getElementById("lesson")
    lessonCardOrig = document.getElementById("lessonCardOrig")
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
}

function constructMap(data){
    constructMap1(data)
    fillLessonCards(data)
}
function fillLessonCards(data){
    for (let i = 0; i < data.length; i++) {
        lessonId = data[i][2]
        lessonCard = document.getElementById("lessonCard" + lessonId)
        description = lessonCard.getElementsByClassName("lessonCardText")[0]
        title = lessonCard.getElementsByClassName("lessonCardTitle")[0]
        title.innerHTML = data[i][0]
        description.innerHTML = data[i][3]
        image = lessonCard.getElementsByClassName("lessonCardImage")[0]
        if (data[i][4] == ""){
            img = '/frontend/static/images/mascot_circle.png'
        }
        image.setAttribute("src", img)
    }
}
function constructMap1(data){
    last_lesson_id = data.last_lesson_id
    for (let i = 0; i < data.length; i++) {
        const lessonCircle = lessonCircleOrig.cloneNode(true);
        const lessonCard = lessonCardOrig.cloneNode(true);

        b = b - x
        olda = a
        a = Math.sqrt(Math.abs(a*a + 2*b*x - x*x))
        leftM = leftM + x
        h = h - (a - olda)
        
        lessonId = data[i][2]
        if(last_lesson_id = lessonId){
            last_lesson_href = data[i][1]
        }
        lessonCircle.innerHTML = i+1
        lessonCircle.style.top = h + "px"
        lessonCircle.style.left = leftM + "px"
        lessonCircle.setAttribute('href', data[i][1])
        lessonCircle.setAttribute('onmouseover', "showLessonCard("+lessonId+")")
        lessonCircle.setAttribute('onmouseleave', "hideLessonCard("+lessonId+")")
        lessonCircle.setAttribute('id', 'lessonCircle'+lessonId)
        lessonCircle.setAttribute('number', lessonId)
        lessonCard.style.top = (h+30) + "px"
        lessonCard.style.left = leftM + "px"
        lessonCard.setAttribute('id', 'lessonCard'+lessonId)
        
        map2.appendChild(lessonCircle)        
        map2.appendChild(lessonCard)        
    }

    findHeroPlace(last_lesson_id, last_lesson_href)
}
function showLessonCard(number){
    lessonCard = document.getElementById("lessonCard"+number)
    lessonCard.classList.remove('hidden');
}
function hideLessonCard(number){
    lessonCard = document.getElementById("lessonCard"+number)
    lessonCard.classList.add('hidden');
}

function findHeroPlace(last_lesson_id, href){
    crntCircle = document.getElementById("lessonCircle"+last_lesson_id)
    hero = document.getElementById("hero")

    hero.setAttribute('href', href)
    hero.setAttribute('onmouseover', "showLessonCard("+last_lesson_id+")")
    hero.setAttribute('onmouseleave', "hideLessonCard("+last_lesson_id+")")

    leftt = crntCircle.offsetLeft + 6
    topp = crntCircle.offsetTop - 30    
    
    hero.style.left = leftt
    hero.style.top = topp
    
    console.log(topp, leftt)
}