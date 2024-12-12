import Button from 'components/Button';
import Typography from 'components/Typography/Typography';
import React from 'react';
import styled from 'styled-components';
import { Plant } from 'types';
import { useTranslation } from 'react-i18next';

interface PlantAutofillTableProps {
  plants?: Plant[];
  autoFillFunction: (plant: Plant) => void;
  showModalFunction: (show: boolean) => void;
}

const TableContainer = styled.div`
  padding-bottom: 2rem;
  padding-left: 3rem;
  padding-right: 2rem;
  padding-top: 0;
`;

const PlantsTable = styled.table`
  width: 100%;
`;

const PlantTableRow = styled.tr`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  max-height: 10rem;
`;

const StyledButton = styled(Button)`
  max-width: 13rem;
`;

const PlantDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlantName = styled.h3`
  margin-bottom: 0;
`;

const PlantAutofillTable = ({
  plants,
  autoFillFunction,
  showModalFunction
}: PlantAutofillTableProps): React.ReactElement => {
  const { t } = useTranslation(['fpns']);
  if (plants === undefined || plants.length === 0) {
    return <h3>No Saved Addresses</h3>;
  }

  return (
    <TableContainer>
      <PlantsTable>
        {plants?.map((plant: Plant) => {
          const plantAddressString = `${plant.addressLine1}${
            plant.addressLine2 ? ', ' + plant.addressLine2 : ''
          }, ${plant.city} ${plant.state}, ${plant.zipCode}`;
          return (
            <PlantTableRow key={plant.id}>
              <PlantDetails>
                <PlantName>{plant.name}</PlantName>
                <Typography variant="body1">
                  <i>{plantAddressString}</i>
                </Typography>
              </PlantDetails>

              <StyledButton
                onClick={() => {
                  autoFillFunction(plant);
                  showModalFunction(false);
                }}
                variant="primary"
              >
                {t('use_this_address')}
              </StyledButton>
            </PlantTableRow>
          );
        })}
      </PlantsTable>
    </TableContainer>
  );
};

export default PlantAutofillTable;
