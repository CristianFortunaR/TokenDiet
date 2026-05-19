import React, { useMemo } from 'react';
import { diffWords } from 'diff';

interface DiffViewProps {
  original: string;
  optimized: string;
}

export const DiffView: React.FC<DiffViewProps> = ({ original, optimized }) => {
  const diffParts = useMemo(() => {
    if (!original || !optimized) return [];
    return diffWords(original, optimized);
  }, [original, optimized]);

  if (!original || !optimized) {
    return <div className="diff-view-empty">Run Smart Optimize to see the diff.</div>;
  }

  return (
    <div className="diff-view-container">
      {diffParts.map((part, index) => {
        if (part.added) {
          return <ins key={index} className="diff-added">{part.value}</ins>;
        }
        if (part.removed) {
          return <del key={index} className="diff-removed">{part.value}</del>;
        }
        return <span key={index} className="diff-unchanged">{part.value}</span>;
      })}
    </div>
  );
};
