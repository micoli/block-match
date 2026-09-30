import type { Gravity, Judgment, Note } from '../game/types';
import { zoneTop } from '../game/view';
import NoteView from './NoteView';

type Props = {
  index: number;
  keyLabel: string;
  notes: Note[];
  gravity: Gravity;
  now: number;
  active: boolean;
  pressed: boolean;
  judgment: Judgment | null;
  onPress: (lane: number) => void;
  onRelease: (lane: number) => void;
};

const Lane = ({ index, keyLabel, notes, gravity, now, active, pressed, judgment, onPress, onRelease }: Props) => (
  <div
    className={`gh-lane gh-lane--${index} ${active ? '' : 'gh-lane--inactive'} ${pressed ? 'gh-lane--pressed' : ''}`}
    onPointerDown={() => onPress(index)}
    onPointerUp={() => onRelease(index)}
    onPointerCancel={() => onRelease(index)}
    onPointerLeave={() => onRelease(index)}
  >
    {notes.map((note) => (
      <NoteView key={note.id} note={note} gravity={gravity} now={now} />
    ))}
    <span className="gh-pad" style={{ top: `${zoneTop(gravity) * 100}%` }}>
      {keyLabel}
    </span>
    {judgment && (
      <span key={judgment.id} className={`gh-flash gh-flash--${judgment.type}`} style={{ top: `${zoneTop(gravity) * 100}%` }} />
    )}
  </div>
);

export default Lane;
