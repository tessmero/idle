// base class for animated transitions
// from start menu to black screen
class FadeOut extends StartAnimStage{
    static random(){
        return randChoice([
            new GridFadeOut(),
            //new NoclearFadeOut(),
        ])
    }
}

