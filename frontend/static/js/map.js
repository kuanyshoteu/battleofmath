myCourses()
function myCourses(){
    url = document.getElementById("urls").getAttribute('mycourses')
    $.ajax({
        url: url,
        data: {},
        dataType: 'json',
        success: function (data) {
            course_list = data.course_list
            if (data.new_student){
                allCourses()
            }
            else{
                courseBox = document.getElementById('courseBox')
                myLessons(course_list[0][0])
                for(var i = 0; i < course_list.length; i++){
                    courseId = course_list[i][0]
                    courseOrig = document.getElementById('courseOrigin')
                    courseClone = courseOrig.cloneNode(true)
                    courseClone.getElementsByClassName('courseTitle')[0].innerHTML = course_list[i][1]
                    courseClone.getElementsByClassName('courseSlogan')[0].innerHTML = course_list[i][3]
                    courseClone.setAttribute("id", "mycourse"+courseId)
                    courseBox.prepend(courseClone)
                }
            }
        }
    })
}

function startCourse(courseId){

}
function allCourses(){
    courseBox = document.getElementById('allCourseBox')
    for(var i = 0; i < course_list.length; i++){
        courseId = course_list[i][0]
        courseOrig = document.getElementById('allCourseOrigin')
        courseClone = courseOrig.cloneNode(true)
        courseClone.getElementsByClassName('courseTitle')[0].innerHTML = course_list[i][1]
        courseClone.getElementsByClassName('courseSlogan')[0].innerHTML = course_list[i][3]
        courseClone.setAttribute("id", "myCourse"+courseId)
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
            findHeroPlace(data.last_lesson_id)
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
    for (let i = 0; i < data.length; i++) {
        const lessonCircle = lessonCircleOrig.cloneNode(true);
        const lessonCard = lessonCardOrig.cloneNode(true);

        b = b - x
        olda = a
        a = Math.sqrt(Math.abs(a*a + 2*b*x - x*x))
        leftM = leftM + x
        h = h - (a - olda)
        
        lessonId = data[i][2]
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
}
function showLessonCard(number){
    lessonCard = document.getElementById("lessonCard"+number)
    lessonCard.classList.remove('hidden');
}
function hideLessonCard(number){
    lessonCard = document.getElementById("lessonCard"+number)
    lessonCard.classList.add('hidden');
}

function findHeroPlace(last_lesson_id){
    crntCircle = document.getElementById("lessonCircle"+last_lesson_id)
    crntCircle.style.left
    crntCircle.style.top
}