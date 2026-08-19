import React from 'react';
import { DotmDrivingLicenseHubView } from '../transport/DotmDrivingLicenseHubView';

interface BluebookTaxViewProps {
  currentLang: 'en' | 'ne';
}

export const BluebookTaxView: React.FC<BluebookTaxViewProps> = ({ currentLang }) => {
  return <DotmDrivingLicenseHubView currentLang={currentLang} initialTab="portals" />;
};
