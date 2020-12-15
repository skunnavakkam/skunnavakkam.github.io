desiredGradeForm = document.getElementById('desiredGradeForm')
hoursInput = document.getElementById('hoursInput')

desiredGradeForm.onchange = () => {
    studyAmt = document.getElementById('studyAmt')
    gameAmt = document.getElementById('gameAmt')
    progress = document.getElementById('progress')
    hoursInput = document.getElementById('hoursInput')
    desiredGradeForm = document.getElementById('desiredGradeForm')
    if (desiredGradeForm.value > 8) {
        desiredGradeForm.value = 8
    } 
    if (desiredGradeForm.value < 1) {
        desiredGradeForm.value = 1
    }

    gamePerHrStudied = (-0.86 * desiredGradeForm.value) + 7.43
    totalHr = gamePerHrStudied + 1
    percentGame = Math.round((gamePerHrStudied/totalHr) * 100)
    percentStudy = 100 - percentGame
    studyAmt.style.width = percentStudy + "%"
    gameAmt.style.width = percentGame + "%"
    hoursGaming = Math.round(((hoursInput.value/100) * percentGame)*100)/100
    hoursStudy = Math.round(((hoursInput.value/100) * percentStudy)*100)/100
    studyAmt.innerHTML = "Study for " + hoursStudy + " hours"
    gameAmt.innerHTML = "Game for " + hoursGaming + " hours"
    console.log(percentGame)
}

hoursInput.onchange = () => {
    studyAmt = document.getElementById('studyAmt')
    gameAmt = document.getElementById('gameAmt')
    hoursInput = document.getElementById('hoursInput')
    desiredGradeForm = document.getElementById('desiredGradeForm')
    if (hoursInput.value < 0) {
        hoursInput.value = 0
    }

    gamePerHrStudied = (-0.86 * desiredGradeForm.value) + 7.43
    totalHr = gamePerHrStudied + 1
    percentGame = Math.round((gamePerHrStudied/totalHr) * 100)
    percentStudy = 100 - percentGame
    studyAmt.style.width = percentStudy + "%"
    gameAmt.style.width = percentGame + "%"
    hoursGaming = Math.round(((hoursInput.value/100) * percentGame)*100)/100
    hoursStudy = Math.round(((hoursInput.value/100) * percentStudy)*100)/100
    studyAmt.innerHTML = "Study for " + hoursStudy + " hours"
    gameAmt.innerHTML = "Game for " + hoursGaming + " hours"
    console.log(percentGame)
}

// formula for the regression: -0.86x + 7.43 will be equal to the number of hours gamed per hour study
