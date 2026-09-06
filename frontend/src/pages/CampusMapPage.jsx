import React from 'react';
import { CampusMap } from '../components/CampusMap';

export const CampusMapPage = ({ onSelectFaculty }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
          Interactive Campus Buildings & Facility Layout
        </h1>
        <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px' }}>
          Explore academic blocks, departmental zones, and view live occupancy of professors across blocks.
        </p>
      </div>

      <CampusMap onSelectFaculty={onSelectFaculty} />
    </div>
  );
};
