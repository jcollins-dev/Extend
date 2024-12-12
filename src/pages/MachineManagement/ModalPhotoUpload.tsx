import React, { useMemo, useState, useCallback } from 'react';
import { BaseSelect, Button, OnboardingMultipleFilesDropArea, Typography } from 'components';
import { useGetBusinessUnitsQuery, useUploadPhotoPartMutation } from 'api';
import { BusinessUnit, SelectChangeHandler } from 'types';
import { PartsPhotoUploadSuccess, PartsPhotoUploadError } from 'types/machine-management';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import styled from 'styled-components';
import theme from 'themes';

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

type errorMap = { [key: string]: string[] };

export const HeaderModalPhotoUpload = (
  <ModalHeader>
    <Typography as="h3" mb={2} size="1.125rem" weight="bold">
      Upload Photos
    </Typography>
  </ModalHeader>
);
export const ModalPhotoUpload = ({
  setShowModal
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [selectedBU, setSelectedBU] = useState<BusinessUnit>();
  const [uploadedProductsPartFile, setUploadedProductsPartFile] = useState<File[] | null>(null);
  const [uploadPhotoPart] = useUploadPhotoPartMutation();
  const { data: businessUnits } = useGetBusinessUnitsQuery();

  const businessUnitsList: BusinessUnit[] = useMemo(() => {
    if (!businessUnits) {
      return [];
    }
    return businessUnits;
  }, [businessUnits]);

  function handleSelectBU(): SelectChangeHandler | undefined {
    return (e) => {
      setSelectedBU(businessUnitsList.find((bu) => bu.id.toString() === e.target.value));
    };
  }

  function closeModal(): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      setShowModal(false);
    };
  }

  const handleContinue = useCallback(() => {
    return () => {
      selectedBU &&
        uploadedProductsPartFile &&
        uploadPhotoPart({
          businessUnit: selectedBU.name,
          files: uploadedProductsPartFile
        })
          .unwrap()
          .then((response) => {
            {
              const successes = response?.success.reduce(function (
                rv: string[],
                cv: PartsPhotoUploadSuccess
              ) {
                rv.push(cv['name']);
                return rv;
              },
              []);
              const errors = response?.errors.reduce(function (
                rv: errorMap,
                cv: PartsPhotoUploadError
              ) {
                (rv[cv['reason']] = rv[cv['reason']] || []).push(cv['name']);
                return rv;
              },
              {});

              if (Array.isArray(successes) && successes.length > 0) {
                toast.success(`${successes.length} files uploaded successfully!`);
              }
              if (errors != undefined) {
                Object.keys(errors).map((item: string) => {
                  toast.warning(`${item}: ${errors[item].join(', ')}`);
                });
              }
              setShowModal(false);
            }
          })
          .catch((error) => {
            console.log(error);
            if (error?.status == 400 && Array.isArray(error?.data?.detail)) {
              console.log(error);
              const errors = error?.data?.detail.reduce(function (
                rv: errorMap,
                cv: PartsPhotoUploadError
              ) {
                (rv[cv['reason']] = rv[cv['reason']] || []).push(cv['name']);
                return rv;
              },
              {});
              Object.keys(errors).map((item: string) => {
                toast.warning(`${item}: ${errors[item].join(', ')}`);
              });
              //error.data.detail.map((item: string) => toast.error(item));
            } else {
              toast.error(
                `Failed to upload image/s for the current BU${
                  error?.data?.detail ? `: ${error.data.detail}` : ''
                }`
              );
            }
            console.error(error?.data?.detail || error);
          });
    };
  }, [selectedBU, uploadedProductsPartFile]);

  return (
    <ModalBody>
      <Typography>
        Select a BU and drag and drop an image or multiple images to upload part photos.
        <p />
        Images are to be uploaded in the following format: NNNNNN__MM.file_ext. Where:
        <p />
        <li>NNNNNN is the part number of the part</li>
        <li>
          __MM is optional but indicates that the image represents a number in a series of images
        </li>
        <li>
          The separator between NNNNNN and MM is a double underscore, &apos;__&apos;, to avoid SKU
          conflicts{' '}
        </li>
        <li>Allowed File Types are JPG, PNG and WEBP</li>
        <li>
          The specified Business Unit must match the Business Unit on record for the part number
        </li>
      </Typography>

      {businessUnitsList && (
        <BaseSelect
          options={
            businessUnitsList
              ? businessUnitsList.map((bu) => {
                  return {
                    value: bu.id.toString(),
                    label: bu.displayName || bu.name,
                    id: bu.id.toString()
                  };
                })
              : ['']
          }
          value={selectedBU ? selectedBU.id.toString() : ''}
          placeholder="Select BU"
          variant="white"
          handleChange={handleSelectBU()}
        />
      )}
      <br />
      <OnboardingMultipleFilesDropArea
        acceptedTypes={{
          'application/image': ['.jpeg', '.webp', '.png', '.jpg']
        }}
        files={uploadedProductsPartFile}
        onFileChange={setUploadedProductsPartFile}
        icon={faImage}
      />
      <ButtonsContainer>
        <Button onClick={closeModal()}>Cancel</Button>
        <Button
          bgColor={theme.colors.primaryBlue4}
          disabled={!selectedBU || !uploadedProductsPartFile}
          onClick={handleContinue()}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </ModalBody>
  );
};
