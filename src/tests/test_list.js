/**
 * @file List of tests
 *
 * Used to build the test menu gui in sandbox mode.
 *
 * This is the only file where tests should be constructed.
 *
 * Test screens are no constructed until the first time the tests are
 * run in the test context menu /src/gui/sandbox-menus/tests/
 *
 * Note that classes like Test imps always get loaded before
 * non-class files like this one (build/link.py)
 */
const allTests = [

  ['boxes', new BoxToolTutorialTest()],
  ['boxes', new FallThruBoxTest()],
  ['boxes', new LineThruBoxTest()],

  ['tools', new DefaultToolTutorialTest()],
  ['tools', new CircleToolTutorialTest()],
  ['tools', new LineToolTutorialTest()],
  ['tools', new PiToolTutorialTest()],

  ['other', new BasicRainSkillCardTest()],
  ['other', new TransitionTest()],
  ['other', new GuiTest()],
];
