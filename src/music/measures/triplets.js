/**
 * @file Triplets sheet music measure
 */
class Triplets extends VoiceMeasure {

  /**
   * Construct triplet phrase from tabs e.g. 12 parameters for 12/4 bar of 4 triplets.
   * @param {...number[]} tabs The list of note/chord/rest scale indices.
   */
  constructor(...tabs) {
    super();
    let i = 0;
    tabs.forEach((entry) => {
      entry.forEach((scaleIndex) =>
        this.addNote(i / 3, 0.2, scaleIndex)
      );
      i = i + 1;
    });
  }
}
