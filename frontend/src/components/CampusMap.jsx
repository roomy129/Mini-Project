import React, { useState, useEffect } from 'react';
import { Building, MapPin, Users, Info, ChevronRight, UserCheck, Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { api } from '../services/api';

export const CampusMap = ({ highlightedBuilding = null, highlightedFacultyName = null, onSelectFaculty }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildingsData();
  }, []);

  useEffect(() => {
    if (highlightedBuilding && buildings.length > 0) {
      const match = buildings.find(b => b.name.toLowerCase().includes(highlightedBuilding.toLowerCase()) || highlightedBuilding.toLowerCase().includes(b.name.toLowerCase()));
      if (match) {
        setSelectedBuilding(match);
      }
    }
  }, [highlightedBuilding, buildings]);

  const fetchBuildingsData = async () => {
    try {
      setLoading(true);
      const data = await api.getBuildings();
      setBuildings(data.buildings || []);
      if (!selectedBuilding && data.buildings?.length > 0) {
        setSelectedBuilding(data.buildings[0]);
      }
    } catch (err) {
      console.error("Failed to load buildings data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin style={{ width: '22px', height: '22px', color: '#2563eb' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
              Campus Schematic & Building Occupancy Map
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
            Interactive schematic view of campus buildings showing live reported faculty locations.
          </p>
        </div>

        {highlightedFacultyName && (
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <UserCheck style={{ width: '16px', height: '16px', color: '#2563eb' }} />
            <span>
              <strong>{highlightedFacultyName}</strong> is reported in <strong>{highlightedBuilding || 'Campus'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Campus Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Visual Map Layout */}
        <div style={{
          background: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
              CAMPUS SCHEMATIC LAYOUT
            </span>
            <span style={{ fontSize: '0.74rem', background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '9999px', fontWeight: '600' }}>
              6 Academic Blocks
            </span>
          </div>

          {/* Grid of Blocks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {buildings.map((b) => {
              const isSelected = selectedBuilding?.id === b.id;
              const isHighlighted = highlightedBuilding && (
                b.name.toLowerCase().includes(highlightedBuilding.toLowerCase()) ||
                highlightedBuilding.toLowerCase().includes(b.name.toLowerCase())
              );

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  style={{
                    background: isHighlighted ? '#fef3c7' : isSelected ? '#eff6ff' : '#ffffff',
                    border: isHighlighted
                      ? '2px solid #f59e0b'
                      : isSelected
                      ? '2px solid #2563eb'
                      : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected || isHighlighted ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                    transform: isSelected || isHighlighted ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isHighlighted && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: '#f59e0b',
                      color: '#ffffff',
                      fontSize: '0.64rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderBottomLeftRadius: '6px'
                    }}>
                      TARGET LOCATION
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: isHighlighted ? '#f59e0b' : isSelected ? '#2563eb' : '#f1f5f9',
                      color: isHighlighted || isSelected ? '#ffffff' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building style={{ width: '16px', height: '16px' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                        {b.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {b.code} Block • {b.floors_count} Floors
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px', lineHeight: '1.3' }}>
                    {b.description}
                  </p>

                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: b.faculty_count > 0 ? '#059669' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users style={{ width: '13px', height: '13px' }} />
                      {b.faculty_count} Faculty Present
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '16px',
            background: '#ffffff',
            borderRadius: '10px',
            padding: '10px 14px',
            border: '1px solid #e2e8f0',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info style={{ width: '16px', height: '16px', color: '#3b82f6', flexShrink: 0 }} />
            <span>Click any building card to see all faculty members currently reported inside that building.</span>
          </div>
        </div>

        {/* Selected Building Details & Faculty List */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedBuilding ? (
            <>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}>
                    {selectedBuilding.code} BLOCK DETAILS
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {selectedBuilding.floors_count} Floors Available
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
                  {selectedBuilding.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  {selectedBuilding.description}
                </p>
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                  <span>Faculty Currently in this Building ({selectedBuilding.faculty_present?.length || 0})</span>
                </h4>

                {selectedBuilding.faculty_present && selectedBuilding.faculty_present.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedBuilding.faculty_present.map((fac) => (
                      <div
                        key={fac.id}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                            {fac.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {fac.department}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                            {fac.sharing_enabled === 0 ? (
                              <span style={{ color: '#64748b', fontStyle: 'italic' }}>Location sharing restricted</span>
                            ) : (
                              <span>Floor: {fac.floor} • Room: {fac.room}</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <StatusBadge status={fac.status} sharingEnabled={fac.sharing_enabled !== 0} size="sm" />
                          {onSelectFaculty && (
                            <button
                              onClick={() => onSelectFaculty(fac.id)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                color: '#1e40af',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Eye style={{ width: '12px', height: '12px' }} /> View
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b',
                    fontSize: '0.84rem'
                  }}>
                    <Users style={{ width: '28px', height: '28px', color: '#94a3b8', margin: '0 auto 8px', display: 'block' }} />
                    No faculty members are currently reported inside {selectedBuilding.name}.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Select a building from the map to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
