import React from 'react';
import './LoadingScreen.scss';
import { useApp } from '../../hooks/useApp';

function LoadingScreen() {
  const { isMobile } = useApp();

  return (
    <div className={`${isMobile ? 'ring-mobile' : 'ring'}`}>
      <div className="text">Loading</div>
    </div>
  );
}

export default LoadingScreen;
