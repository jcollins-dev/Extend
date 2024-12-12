import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { MapStyle } from 'types/protein';

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: ReactNode;
  customMapStyle?: MapStyle[];
}

const Map = ({
  onClick,
  onIdle,
  children,
  style,
  customMapStyle,
  ...options
}: MapProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new google.maps.Map(ref.current, {}));
    }
    if (map) {
      map.mapTypes.set(
        'styled_map',
        new google.maps.StyledMapType(customMapStyle as google.maps.MapTypeStyle[], {
          name: 'Styled Map'
        })
      );
      map.setMapTypeId('styled_map');
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      let onClickListener: google.maps.MapsEventListener;
      if (onClick) {
        onClickListener = map.addListener('click', onClick);
      }

      let onIdleListener: google.maps.MapsEventListener;
      if (onIdle) {
        onIdleListener = map.addListener('idle', () => onIdle(map));
      }
      return () => {
        if (onClickListener) {
          onClickListener.remove();
        }
        if (onIdleListener) {
          onIdleListener.remove();
        }
      };
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

Map.defaultProps = {
  customMapStyle: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5'
        }
      ]
    } as MapStyle,
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    } as MapStyle,
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161'
        }
      ]
    } as MapStyle,
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f5f5'
        }
      ]
    } as MapStyle,
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd'
        }
      ]
    } as MapStyle,
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee'
        }
      ]
    } as MapStyle,
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575'
        }
      ]
    } as MapStyle,
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5'
        }
      ]
    } as MapStyle,
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    } as MapStyle,
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    } as MapStyle,
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575'
        }
      ]
    } as MapStyle,
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dadada'
        }
      ]
    } as MapStyle,
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161'
        }
      ]
    } as MapStyle,
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    } as MapStyle,
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5'
        }
      ]
    } as MapStyle,
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee'
        }
      ]
    } as MapStyle,
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#c9c9c9'
        }
      ]
    } as MapStyle,
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e'
        }
      ]
    } as MapStyle
  ]
};

export default Map;
