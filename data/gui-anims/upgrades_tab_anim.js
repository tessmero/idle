/**
 * @file animation for upgrades tab
 *
 * rows ('stat upgraders') drop in one by one
 *
 * relies on anim states being truncated to range 0-1
 */
UPGRADES_TAB_ANIM = [

  // drop=0 start dropping immediately
  // drop<0 wait before dropping
  {
    t: 0,
    drop: [0, -1, -2],
  },

  // drop=1 finish dropping exactly at end of anim
  // drop>1 finish dropping early
  {
    t: 1,
    drop: [3, 2, 1],
  },
];
