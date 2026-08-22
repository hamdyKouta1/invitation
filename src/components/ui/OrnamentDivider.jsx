import React from 'react';

/**
 * OrnamentDivider — Gold line with center ornament
 * Used as elegant section dividers throughout the invitation
 */
const OrnamentDivider = ({ symbol = '✦', className = '' }) => (
  <div className={`ornament-divider ${className}`} aria-hidden="true">
    <span className="ornament-divider__line" />
    <span className="ornament-divider__center">{symbol}</span>
    <span className="ornament-divider__line" />
  </div>
);

export default OrnamentDivider;
