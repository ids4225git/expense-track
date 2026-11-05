// =============================================================
// CARD — white box with a hairline border
// =============================================================
// Props:
//   - title:     heading text (optional)
//   - action:    element shown on the right of the heading (optional)
//   - className: extra classes (optional)
// When there is a title, the section is labelled by it so screen
// readers announce "Monthly spending, region" etc.
// =============================================================

import { useId } from 'react';

function Card({ title, action, className = '', children }) {
  const titleId = useId();

  return (
    <section
      className={`card ${className}`.trim()}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <div className="card-header">
          <h2 id={titleId} className="card-title">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default Card;
