// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useTranslation } from 'react-i18next';

// Components
import { Map, MapMarker, KPICard } from 'components';
import Typography from 'components/Typography/Typography';
import { DataRenderer } from 'components/machine-health';

// Api
import { useGetPlantByIdQuery } from 'api';

interface MapCardProps {
  plantId: string;
  zoom?: number;
  heading?: string;
  markerIcon?: string | google.maps.Icon | google.maps.Symbol;
  height?: number;
  mapTypeControl?: boolean;
}

const MachineMapContainer = styled.div<{ height?: number }>`
  display: flex;
  height: ${(props) => (props.height ? `${props.height / 16}rem` : '15.625rem')};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const headerRenderer = (heading?: string, address?: string) => {
  return (
    <HeaderContainer>
      <Typography mb={0} size="1rem" weight="bold">
        {heading}
      </Typography>
      <Typography mb={0} size="0.875rem" weight="normal">
        {address}
      </Typography>
    </HeaderContainer>
  );
};

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const MapCard = ({
  plantId,
  zoom,
  heading,
  markerIcon,
  height,
  mapTypeControl
}: MapCardProps): ReactElement => {
  /**
   * Query get plant by id
   */
  const { data: plant, isFetching, error } = useGetPlantByIdQuery(plantId);
  const { t } = useTranslation(['mh']);
  heading = t('site_location') as string;
  const center = {
    lat: plant?.latitude as number,
    lng: plant?.longitude as number
  };
  const address = `${plant?.addressLine1} ${plant?.addressLine2}, ${plant?.city}, ${plant?.state}, ${plant?.countryName}, ${plant?.zipCode}`;

  return (
    <DataRenderer
      isLoading={isFetching}
      error={error && (t('failed_to_load_data', { ns: 'common' }) as string)}
    >
      <KPICard component={headerRenderer(heading, address)}>
        <MachineMapContainer height={height}>
          <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string} render={render}>
            <Map
              mapTypeControl={mapTypeControl ? mapTypeControl : false}
              center={center}
              zoom={zoom}
              style={{ flexGrow: '1', height: '100%' }}
            >
              <MapMarker icon={markerIcon} key={`key-${address}`} position={center} />
            </Map>
          </Wrapper>
        </MachineMapContainer>
      </KPICard>
    </DataRenderer>
  );
};

MapCard.defaultProps = {
  zoom: 14,
  markerIcon: {
    url: '/assets/imgs/icons/marker.png'
  }
};

export default MapCard;
