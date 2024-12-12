import React, { useMemo, useState, useCallback } from 'react';
import { BaseSelect, Button, OnboardingDropArea, Typography } from 'components';
import {
  useLazyGetProductTagTemplateQuery,
  useUploadProductsPartMutation,
  useGetPlantsQuery,
  useGetMachinesQuery
} from 'api';
import { Machine, Plant } from 'types';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import theme from 'themes';
import saveAs from 'file-saver';
const ModalHeader = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;

const ModalBody = styled.div`
  padding: 0 1rem 1rem 2rem;
`;

const ButtonsContainer = styled.div`
  width: 50%;
  margin-right: 1rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    margin: 1rem;
  }
`;

const ContainerButtonTemplate = styled.div`
  padding-bottom: 1rem;
`;

export const HeaderModalUploadCategory = (
  <ModalHeader>
    <Typography as="h3" mb={2} size="1.125rem" weight="bold">
      Shop by Category
    </Typography>
  </ModalHeader>
);
export const ModalUploadCategory = ({
  setShowModal
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [selectedMachine, setSelectedMachine] = useState<Machine>();
  const [uploadedProductsPartFile, setUploadedProductsPartFile] = useState<File>();
  const [selectedPlant, setSelectedPlant] = useState<Plant>();
  const { data: plants } = useGetPlantsQuery();
  const { data: machines } = useGetMachinesQuery({
    plantIds: [selectedPlant?.id ? selectedPlant.id : '']
  });
  const [productTagTemplate] = useLazyGetProductTagTemplateQuery();
  const [uploadProductsPart] = useUploadProductsPartMutation();

  const machineList: Machine[] = useMemo(() => {
    if (!machines) {
      return [];
    }
    return machines;
  }, [machines]);
  const plantList: Plant[] = useMemo(() => {
    if (!plants) {
      return [];
    }
    return plants;
  }, [plants]);
  function handleSelectMachine(value: (string | Record<string, unknown>)[]) {
    if (value.length > 0) {
      setSelectedMachine(
        machineList.find(
          (machine) =>
            machine.id === (typeof value[0] !== 'string' ? (value[0].value as string) : value[0])
        )
      );
    } else setSelectedMachine(undefined);
  }
  const handleSelectPlant = (value: (string | Record<string, unknown>)[]) => {
    // If the plant is changing reset any selected machine
    setSelectedMachine(undefined);

    if (value.length > 0) {
      setSelectedPlant(
        plantList.find(
          (plant) =>
            plant.id === (typeof value[0] !== 'string' ? (value[0].value as string) : value[0])
        )
      );
    } else setSelectedPlant(undefined);
  };
  function handleDownloadButton(): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      productTagTemplate()
        .unwrap()
        .then((result) => {
          saveAs(result, `product_tag_template.xlsx`);
        })
        .catch((error) => {
          toast.error('Error occurred while downloading excel');
          console.error(error);
        });
    };
  }

  function closeModal(): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      setShowModal(false);
    };
  }

  const handleContinue = useCallback(() => {
    return () => {
      selectedMachine &&
        uploadedProductsPartFile &&
        uploadProductsPart({
          machineId: selectedMachine.id,
          file: uploadedProductsPartFile,
          skipHeader: true
        })
          .unwrap()
          .then(() => {
            toast.success(`Shop by Category upload successful`);
            setShowModal(false);
          })
          .catch((error) => {
            toast.error(
              `Failed to upload Shop by Category${
                error?.data?.detail ? `: ${error.data.detail}` : ''
              }`
            );
            console.error(error?.data?.detail || error);
          });
    };
  }, [selectedMachine, uploadedProductsPartFile]);

  return (
    <ModalBody>
      <Typography>
        Download a blank &quot;Shop by Category&quot; template, fill out, select a Machine, and drag
        and drop here to upload the shop by category assignments.
      </Typography>
      <ContainerButtonTemplate>
        <Button width="15rem" onClick={handleDownloadButton()}>
          Download Template
        </Button>
      </ContainerButtonTemplate>
      {plantList && (
        <BaseSelect
          options={
            plantList
              ? plantList.map((plant) => {
                  return {
                    value: plant.id,
                    label: plant.name ? plant.name : '',
                    id: plant.id
                  };
                })
              : ['']
          }
          value={selectedPlant ? selectedPlant.id : ''}
          placeholder="Select Customer"
          variant="white"
          searchable
          handleChangeSearch={handleSelectPlant}
        />
      )}
      <br />
      {machineList && (
        <BaseSelect
          options={
            machineList
              ? machineList.map((machine) => {
                  return {
                    value: machine.id,
                    label: machine.description ? machine.description : '',
                    id: machine.id
                  };
                })
              : ['']
          }
          value={selectedMachine ? selectedMachine.id : ''}
          placeholder="Select Machine"
          variant={selectedPlant?.id ? 'white' : 'disabled'}
          searchable
          handleChangeSearch={handleSelectMachine}
        />
      )}
      <br />
      <OnboardingDropArea
        acceptedTypes={{
          'application/vnd.ms-excel': ['.xls', '.xlsx', '.xlsm']
        }}
        file={uploadedProductsPartFile}
        onFileChange={setUploadedProductsPartFile}
        icon={faFileExcel}
      />
      <ButtonsContainer>
        <Button onClick={closeModal()}>Cancel</Button>
        <Button
          bgColor={theme.colors.primaryBlue4}
          disabled={!selectedMachine || !uploadedProductsPartFile}
          onClick={handleContinue()}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </ModalBody>
  );
};
