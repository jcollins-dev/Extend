import React, { ReactElement, useEffect } from 'react';

const MapMarker = ({ ...options }: google.maps.MarkerOptions): ReactElement => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return <></>;
};

export default MapMarker;
