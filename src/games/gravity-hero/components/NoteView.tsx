import type { Gravity, Note } from '../game/types';
import { noteBox } from '../game/view';
import NoteGlyph from './NoteGlyph';

type Props = { note: Note; gravity: Gravity; now: number };

const NoteView = ({ note, gravity, now }: Props) => {
  const { top, height } = noteBox(gravity, note, now);
  return (
    <div
      className={`gh-note gh-note--${gravity} ${note.status === 'holding' ? 'gh-note--holding' : ''}`}
      style={{ top: `${top * 100}%`, height: `${height * 100}%` }}
    >
      {note.duration > 0 && <span className="gh-note__tail" />}
      <span className="gh-note__head">
        <NoteGlyph kind={note.kind} />
      </span>
    </div>
  );
};

export default NoteView;
