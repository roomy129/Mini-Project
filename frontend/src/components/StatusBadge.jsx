import React from 'react';
import { CheckCircle2, Clock, AlertCircle, EyeOff, Lock } from 'lucide-react';

export const StatusBadge = ({ status, sharingEnabled = true, size = 'md', showLabel = true }) => {
  // If sharing is OFF, display privacy status badge
  if (sharingEnabled === false) {
    return (
      <span className={`status-pill restricted size-${size}`} title="Location sharing restricted by faculty">
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        {showLabel && <span>Sharing Restricted</span>}
      </span>
    );
  }

  switch (status) {
    case 'Available':
      return (
        <span className={`status-pill available size-${size}`}>
          <span className="status-dot"></span>
          {showLabel && <span>Available</span>}
        </span>
      );
    case 'Busy':
      return (
        <span className={`status-pill busy size-${size}`}>
          <span className="status-dot"></span>
          {showLabel && <span>Busy</span>}
        </span>
      );
    case 'Not Available':
      return (
        <span className={`status-pill not-available size-${size}`}>
          <span className="status-dot"></span>
          {showLabel && <span>Not Available</span>}
        </span>
      );
    default:
      return (
        <span className={`status-pill restricted size-${size}`}>
          <span className="status-dot"></span>
          {showLabel && <span>{status || 'Unknown'}</span>}
        </span>
      );
  }
};
