/**
 * @file stats menu
 *
 * stat entries expand one by one
 *
 * relies on anim states being truncated to range 0-1
 */
STATS_TAB_ANIM = [

  // poke=0 start expanding immediately
  // poke<0 wait before expanding
  {
    t: 0,
    poke: [-1, -0.5, 0],
  },

  {
    t: 1,
    poke: [0.8, 0.85, 1],
  },

  // poke=1 finish expanding exactly at end of anim
  // poke>1 finish expanding early
];
