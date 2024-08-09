import { describe, expect, it } from 'vitest';
import { Note } from './note';

describe('note', () => {
  it('should create a note by name.', () => {
    expect(new Note('C')).toBeDefined();
  });

  it('should create a note by name and octave.', () => {
    expect(new Note('C', 5)).toBeDefined();
  });

  it('should create a note from a string.', () => {
    expect(Note.fromString('C4')).toBeDefined();
  });

  it('should create A0 from value 0.', () => {
    expect(new Note('A', 0).value).toBe(0);
    expect(new Note('B', 0).value).toBe(1);
    expect(new Note('C', 1).value).toBe(2);
    expect(new Note('C', 4).value).toBe(23);
    expect(new Note('C', 5).value).toBe(30);
  });

  it('should create notes from values 0.', () => {
    expect(Note.fromValue(0).string).toBe('A0');
    expect(Note.fromValue(1).string).toBe('B0');
    expect(Note.fromValue(2).string).toBe('C1');
    expect(Note.fromValue(23).string).toBe('C4');
    expect(Note.fromValue(30).string).toBe('C5');
  });

  it('should create same values using constructor and fromString.', () => {
    expect(new Note('A', 0).value).toBe(Note.fromString('A0').value);
    expect(new Note('B', 0).value).toBe(Note.fromString('B0').value);
    expect(new Note('C', 1).value).toBe(Note.fromString('C1').value);
    expect(new Note('C', 4).value).toBe(Note.fromString('C4').value);
    expect(new Note('C', 5).value).toBe(Note.fromString('C5').value);
  });
});
