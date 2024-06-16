/**
 * @file unit tests
 * Test body register and unregister methods.
 * 05/26/2024
 */
function doUnitTests() {
  // start sim unit tests
  const sim = global.mainScreen.sim;
  console.assert(sim._bodies.size === 3); // 3 bodies in start menu

  // test clearBodies
  const assertClear = () => {
    console.assert(sim._bodies.size === 0);
    console.assert(sim._grabbers.size === 0);
    console.assert(sim.edgeGroup.subgroups.size === 0);

    // expect one leftover group
    console.assert(sim.physicsGroup.subgroups.size === 1);
  };
  sim.clearBodies();
  assertClear();

  // test Body implementations
  let testedBodies = 0;
  const testBody = (b) => {
    sim.addBody(b);
    sim.removeBody(b);
    assertClear();
    testedBodies = testedBodies + 1;
  };
  testBody(new CircleBody(sim, v(0.5, 0.5), 0.1));
  testBody(new CircleBuddy(sim, v(0.5, 0.5), 0.1));
  testBody(new SausageBody(sim, v(0.5, 0.5), v(0.3, 0.3)));
  testBody(new ControlledSausageBody(sim, v(0.5, 0.5), v(0.3, 0.3)));
  testBody(new StarBody(sim, v(0.5, 0.5), 5, 0.05, 0.1));
  testBody(new DefaultControlFrame(new StarBody(sim, v(0.5, 0.5), 5, 0.05, 0.1)));
  testBody(new CrossBody(sim, v(0.5, 0.5), 5, 0.05, 0.1));
  testBody(new DefaultControlFrame(new CrossBody(sim, v(0.5, 0.5), 5, 0.05, 0.1)));
  testBody(new CompassBody(sim, v(0.5, 0.5), 5, 0.05, 0.1));
  testBody(new DefaultControlFrame(new CompassBody(sim, v(0.5, 0.5), 5, 0.05, 0.1)));
  testBody(new SquareBody(sim, v(0.5, 0.5), 0.1));
  testBody(new BoxBuddy(sim, v(0.5, 0.5), 0.1));
  console.log(`${testedBodies} Body subclasses passed tests`);

  // test tool implementations

  let testedTools = 0;
  const testTool = (t) => {

    // emulate input fluke
    // (no mouse up event)
    t.mouseDown(v(0.5, 0.5));
    t.unregister(sim);

    // make sure nothing leaked
    assertClear();

    testedTools = testedTools + 1;
  };
  testTool(new CircleTool(sim));
  testTool(new DefaultTool(sim, 0.1));
  testTool(new LineTool(sim));
  testTool(new BoxTool(sim));
  testTool(new PiTool(sim, 0.1));
  console.log(`${testedTools} Tool subclasses passed tests`);

  // specific test for default tool
  const t = new DefaultTool(sim, 0.1);
  t.mouseDown(v(0.5, 0.5));
  console.assert(sim._grabbers.size === 1);
  t.mouseUp(v(0.5, 0.5));
  console.assert(sim._grabbers.size === 0);
}
