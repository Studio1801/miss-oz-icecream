import { Fragment } from 'react';
import { useSiteData } from './sheetSync';

/** Website text from the Sheet's "Website Text" tab, falling back to the built-in wording. */
export function useSiteText() {
  const data = useSiteData();
  return (key: string, fallback: string) => {
    const v = data?.text?.[key];
    return typeof v === 'string' && v.trim() ? v : fallback;
  };
}

/** Editable text. Children are the built-in wording; line breaks in the Sheet become <br />. */
export function Txt({ k, children }: { k: string; children: string }) {
  const t = useSiteText();
  const lines = t(k, children).split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
