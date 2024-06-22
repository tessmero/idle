/**
 * @file List of tests
 *
 * Used to build the test menu gui in sandbox mode.
 *
 * This is the only file where tests are constructed.
 *
 * Each test's screen is finally constructed the first time it is
 * opened in the test context menu gui (/src/gui/sandbox-menus/tests/)
 *
 * Note that classes always get loaded before
 * non-class files like this one (build/link.py)
 */
const allTests = [

  ['gui', new ToggleMenuTest()],
  ['gui', new CloseButtonTest()],
  ['gui', new TransitionTest()],

  // ['boxes', new NestedBoxesTest()],
  ['boxes', new CircleIntoBoxTest()],
  ['boxes', new BoxToolTutorialTest()],
  ['boxes', new FallThruBoxTest()],
  ['boxes', new LineThruBoxTest()],

  ['tools', new DefaultToolTutorialTest()],
  ['tools', new CircleToolTutorialTest()],
  ['tools', new LineToolTutorialTest()],
  ['tools', new PiToolTutorialTest()],

  ['other', new BasicRainSkillCardTest()],
];
