import React, { useState, useEffect } from 'react';

const GAMES = [
  { id: 'homm2', name: 'Heroes of Might and Magic II' },
  { id: 'homm3', name: 'Heroes of Might and Magic III' },
];

export default function GamePathSettings({ open, onClose, onSave, initialPaths }: {
  open: boolean;
  onClose: () => void;
  onSave: (paths: Record<string, string>) => void;
  initialPaths: Record<string, string>;
}) {
  const [paths, setPaths] = useState<Record<string, string>>(initialPaths);

  useEffect(() => { setPaths(initialPaths); }, [initialPaths, open]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', zIndex: 1000 }}>
      <div style={{ background: '#fff', margin: '10% auto', padding: 32, width: 400, borderRadius: 8 }}>
        <h2>Set Game Paths</h2>
        {GAMES.map(g => (
          <div key={g.id} style={{ marginBottom: 16 }}>
            <label>{g.name}</label>
            <input
              style={{ width: '100%' }}
              value={paths[g.id] || ''}
              onChange={e => setPaths(p => ({ ...p, [g.id]: e.target.value }))}
              placeholder={`Path to ${g.name} executable`}
            />
          </div>
        ))}
        <button onClick={() => onSave(paths)} style={{ marginRight: 8 }}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
