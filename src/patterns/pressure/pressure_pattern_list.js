let allPressurePatterns = [
    new SpinPressurePattern(),
    new ShakePressurePattern(),
]


function randomPressurePattern(){
    return randChoice(allPressurePatterns)
}