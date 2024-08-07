/**
 * Note abstraction
 */
type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type NoteArray = Array<Note>;

// Musical note
export class Note {
  /**
   *  Usage: Can take a note by name or by pitch and octave.
   *
   *  Examples:
   *    new Note('A');
   *    new Note('C4');
   *    new Note('B', 3);
   */
  constructor(
    readonly pitch: Pitch,
    readonly octave: number = 4,
    public custom_color?: string,
  ) {}

  static C4 = Note.fromString('C4');
  static G5 = Note.fromString('G5');

  /**
   * Converts a note to a value, starting from A0 as 0.
   *
   * Note that the octave number increases after B, meaning that it starts with
   * A0, B0, then C1, D1, etc.
   */
  get value() {
    const nameValue =
      (this.pitch.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 5) % 7;
    return nameValue + this.octave * 7 - 5;
  }

  /**
   * Creates a note from a string.
   *
   * Example: Note.fromString('C4') => new Note('C', 4)
   */
  static fromString(note: string) {
    return new Note(note[0] as Pitch, Number.parseInt(note[note.length - 1]));
  }

  static fromValue(value: number) {
    const pitch = 'ABCDEFG'[value % 7] as Pitch;
    const octave = Math.floor((value + 5) / 7);
    return new Note(pitch, octave);
  }

  static random({ low = Note.C4, high = Note.G5 }: { low: Note; high: Note }) {
    if (low.value > high.value) {
      throw new Error('Invalid range: low note must be lower than high note.');
    }
    const value_range = high.value - low.value + 1;
    const value = Math.floor(Math.random() * value_range) + low.value;
    return Note.fromValue(value);
  }

  // Note as string, e.g. 'C4'.
  get string() {
    return `${this.pitch}${this.octave}`;
  }

  // Duration in seconds.
  get duration() {
    return 0.5;
  }

  // play() {
  //   const synth = new Tone.Synth().toDestination();
  //   // const amsynth = new Tone.AMSynth().toDestination();
  //   // const fmsynth = new Tone.FMSynth().toDestination();
  //   const now = Tone.now();

  //   // const noteString = this.asString();
  //   const noteDuration = '4n';
  //   synth.triggerAttackRelease(noteString, noteDuration, now);
  //   // amsynth.triggerAttackRelease('C4', '8n', now + 1);
  //   // fmsynth.triggerAttackRelease('C4', '8n', now + 2);
  // }
}

/**
 * Musical score.
 *
 * Represents a sequence of notes.
 *
 * TODO: Add support for multiple instruments.
 * TODO: Should clef be here?
 */
export class Score {
  constructor(
    readonly notes: Array<Note>,
    readonly clef?: string,
  ) {}

  // static fromString(score: string) {
  //   return new Score();
  // }

  /**
   * Set up a score with random notes.
   * @param duration The duration of the score in seconds (@ 60 bpm).
   *
   * TODO: Currently only allows quarternotes at 1bpm
   */

  static random(duration: number, range: { low: Note; high: Note }) {
    const notes = Array.from({ length: duration }, () => {
      return Note.random(range);
    });

    return new Score(notes, 'treble');
  }

  /**
   * Get the total duration.
   */
  get duration() {
    return this.notes.length;
  }

  /**
   * Get subsection of notes in given duration range.
   *
   * @param start The start time of the range.
   * @param duration The duration of the range.
   */
  getNotesInRange(start: number, duration: number) {
    return this.notes.slice(start, start + duration);
  }

  /**
   * Resets all note colors.
   */
  resetNotes() {
    this.notes.forEach((note) => (note.custom_color = undefined));
  }
}
