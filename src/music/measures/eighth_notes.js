/**
 * @file EighthNotes sheet music measure
 */
class EighthNotes extends VoiceMeasure {

  /**
   * Construct eigth note phrase from tabs e.g. 8 entries for a 4/4 bar.
   * @param {...number[]} tabs The list of note/chord/rest scale indices.
   */
  constructor(...tabs) {
    super();
    let i = 0;
    tabs.forEach((entry) => {
      entry.forEach((scaleIndex) =>
        this.addNote(i / 2, 0.4, scaleIndex)
      );
      i = i + 1;
    });
  }
}
