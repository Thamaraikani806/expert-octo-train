import React from 'react';

interface Props {
  total: number;  
  current: number;
  setCurrent: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ total, current, setCurrent }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i + 1)}
          disabled={i + 1 === current}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
