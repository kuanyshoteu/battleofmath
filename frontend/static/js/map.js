span = document.getElementById("urls")
crntCourseId = parseInt(span.getAttribute('crntcourseid'))
myCourses(crntCourseId)

function startCourse(courseId){
    url = span.getAttribute('startCourse')
    $.ajax({
        url: url,
        data: {
            'courseId':courseId
        },
        dataType: 'json',
        success: function (data) {
            courseBox = document.getElementById('allCourseBox')
            courseBox.innerHTML = ''
            myCourses(courseId)
        }
    })
}
function myCourses(courseId){
    url = span.getAttribute('mycourses')
    $.ajax({
        url: url,
        data: {},
        dataType: 'json',
        success: function (data) {
            course_list = data.course_list
            span.setAttribute('crntCourseId', courseId)
            fillCourses(data.new_student, courseId)
            if (data.new_student == false){
                myLessons(courseId)
            }
        }
    })
}

function myLessons(courseId){
    url = span.getAttribute('mylessons')
    $.ajax({
        url: url,
        data: {
            "courseId":courseId,
        },
        dataType: 'json',
        success: function (data) {
            createIslands(data).then((result) => {
                islandCircle = result[0]
                island_list = result[1]
                last_lesson_id = result[2]
                createConstants(islandCircle, island_list.length)
                constructMap(last_lesson_id, island_list, islandCircle)                
            })
        }
    })
}

function createIslands(data){
    island_list = data.islands_list
    map = document.getElementById('map')
    map.innerHTML = ''
    islandBoxOrig = document.getElementById('islandBoxOrig')
    for (let i = 0; i < island_list.length; i++) {
        if (i % 2 == 0){
            var islandBox = islandBoxOrig.cloneNode(true);
            map.appendChild(islandBox)
        }
        islandCircleOrig = document.getElementById('islandCircleOrig')
        const islandCircle = islandCircleOrig.cloneNode(true);

        islandId = island_list[i][0]
        islandTitle = island_list[i][1]
        islandImg = island_list[i][2]

        islandCircle.getElementsByClassName('islandTitle')[0].innerHTML = islandTitle
        islandCircle.setAttribute('id', 'island'+islandId)
        // islandCircle.getElementsByClassName('islandImg')[0].setAttribute('src', islandImg)

        islandAddLesson = islandCircle.getElementsByClassName('islandAddLesson')
        if(islandAddLesson.length > 0){
            islandAddLesson = islandAddLesson[0]
            islandAddLesson.setAttribute('onclick', 'createLesson(' + islandId + ')')
        }
        
        islandBox.appendChild(islandCircle)
        return new Promise((resolve, reject) => {
            resolve([islandCircle, island_list[i][3], data.last_lesson_id]);
          });
    }
}
function createConstants(islandCircle, quantity){
    lessonCircleOrig = document.getElementById("lesson")
    lessonCardOrig = document.getElementById("lessonCardOrig")
    
    mapW = islandCircle.offsetWidth
    mapH = islandCircle.offsetHeight
    mapTopStart = islandCircle.offsetTop
    mapLeftStart = islandCircle.offsetLeft
    
    coordsMap1 = [[mapW*1/10, mapH*1/2], [mapW*1/4-20, mapH*7/12], [mapW/2, mapH*2/3], [mapW*2/3-10, mapH*2/5+20]]
    circleNumberInLine = Math.max(1, parseInt((quantity - coordsMap1.length) / (coordsMap1.length-1)))
    
    lineIndexes = []
    crntLineIndex = 0
    distancesX = []
    distancesY = []
    for(var i = 0; i < coordsMap1.length - 1; i++){
        lineIndexes.push(crntLineIndex)
        crntLineIndex += circleNumberInLine * (i+1) + 1 
        if(i == coordsMap1.length - 2){
            if(crntLineIndex < quantity){
                circleNumberInLine += quantity - crntLineIndex
            }
        }
        
        distancesX.push((coordsMap1[i+1][0] - coordsMap1[i][0]) / circleNumberInLine)
        distancesY.push((coordsMap1[i+1][1] - coordsMap1[i][1]) / circleNumberInLine)
    }
    lineNumber = 0
    coordLessons = []
    for(var i = 0; i < quantity; i++){
        if(i == lineIndexes[lineNumber]){
            crntCircleLeft = mapLeftStart + coordsMap1[i][0]
            crntCircleTop = mapTopStart + coordsMap1[i][1]
            lineNumber += 1
        }
        else{
            crntCircleLeft += distancesX[lineNumber - 1]
            crntCircleTop += distancesY[lineNumber - 1]
        }
        coordLessons.push([crntCircleLeft, crntCircleTop])
    }
}

function constructMap(last_lesson_id, lesson_list, islandCircle){    
   
    last_lesson_href = lesson_list[0][1]
    for (let i = 0; i < lesson_list.length; i++) {
        const lessonCircle = lessonCircleOrig.cloneNode(true);
        const lessonCard = lessonCardOrig.cloneNode(true);

        lessonId = lesson_list[i][2]
        if(last_lesson_id == lessonId){
            last_lesson_href = lesson_list[i][1]
        }
        lessonCircle.innerHTML = i+1
        console.log(coordLessons)
        lessonCircle.style.left = coordLessons[i][0] + "px"
        lessonCircle.style.top = coordLessons[i][1] + "px"
        lessonCircle.setAttribute('href', lesson_list[i][1])
        lessonCircle.setAttribute('onmouseover', "showLessonCard("+lessonId+")")
        lessonCircle.setAttribute('onmouseleave', "hideLessonCard("+lessonId+")")
        lessonCircle.setAttribute('id', 'lessonCircle'+lessonId)
        lessonCircle.setAttribute('number', lessonId)
        lessonCard.style.top = (coordLessons[i][1]+30) + "px"
        lessonCard.style.left = coordLessons[i][0] + "px"
        lessonCard.setAttribute('id', 'lessonCard'+lessonId)
        
        islandCircle.appendChild(lessonCircle)        
        islandCircle.appendChild(lessonCard)        
    }
    findHeroPlace(last_lesson_id, last_lesson_href)
}

function findHeroPlace(last_lesson_id, href){
    crntCircle = document.getElementById("lessonCircle"+last_lesson_id)
    hero = document.getElementById("hero")

    hero.setAttribute('href', href)
    hero.setAttribute('onmouseover', "showLessonCard("+last_lesson_id+")")
    hero.setAttribute('onmouseleave', "hideLessonCard("+last_lesson_id+")")

    leftt = crntCircle.offsetLeft + 6
    topp = crntCircle.offsetTop - 20    
    
    hero.style.left = leftt
    hero.style.top = topp
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
        courseClone.getElementsByClassName('startCourse')[0].setAttribute('onclick', 'startCourse(' + courseId + ')')
        courseBox.appendChild(courseClone)
    }
}



function fillLessonCards(data){
    lesson_list = data.lesson_list
    for (let i = 0; i < lesson_list.length; i++) {
        lessonId = lesson_list[i][2]
        lessonCard = document.getElementById("lessonCard" + lessonId)
        description = lessonCard.getElementsByClassName("lessonCardText")[0]
        title = lessonCard.getElementsByClassName("lessonCardTitle")[0]
        title.innerHTML = lesson_list[i][0]
        description.innerHTML = lesson_list[i][3]
        image = lessonCard.getElementsByClassName("lessonCardImage")[0]
        if (lesson_list[i][4] == ""){
            img = '/frontend/static/images/mascot_circle.png'
        }
        image.setAttribute("src", img)
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

function createLesson(islandId){
    url = span.getAttribute('createlesson')
    crntCourseId = parseInt(span.getAttribute('crntcourseid'))
    $.ajax({
        url: url,
        data: {
            'island':islandId,
        },
        dataType: 'json',
        success: function (data) {
            myCourses(crntCourseId)
        }
    })
}