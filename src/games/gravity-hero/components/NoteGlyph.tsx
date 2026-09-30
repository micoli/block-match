import type { NoteKind } from '../game/types';

const NoteGlyph = ({ kind }: { kind: NoteKind }) => (
  <svg className="gh-glyph" viewBox="0 0 24 24" aria-hidden="true">
    <ellipse
      cx="9"
      cy="18"
      rx="5"
      ry="3.6"
      transform="rotate(-20 9 18)"
      fill={kind === 'half' ? 'none' : 'currentColor'}
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M13.6 16.6V3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {kind === 'eighth' && (
      <path d="M13.6 3.5c1 3.5 6 4.5 5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    )}
  </svg>
);

export default NoteGlyph;
