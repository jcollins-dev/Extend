// 3rd party
import React, { useEffect, useRef, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { trim } from 'lodash';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Helper functions
import { formatDate } from 'helpers';

// Components
import { BaseTable, Button, Checkbox, InformationTooltip, Input, Loader } from 'components';

// API
import {
  useLazyGetMachineOnboardingPartsByIdsQuery,
  useGetPartsInBomNotLinkedToERPQuery,
  useGetPartsInAssemblyNotLinkedToERPQuery,
  useUpdateModifiedPartsNumberMutation
} from 'api';

// Types
import { ChangeEvent, ColumnConfig, Id } from 'types';
import {
  OnboardingMachine,
  PartNode,
  PartNodeExtension,
  PartUpdate
} from 'types/machine-management';
interface SelectablePartNode extends PartNode {
  checked: boolean;
  assembly?: string;
}
interface SelectablePartNodeExtension extends PartNodeExtension {
  checked: boolean;
  assembly?: string;
}

// Theming
import theme from 'themes';

// Constants
import { JBTRoutes } from 'constants/routes';

// Styling
const RootContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ContentOuterContainer = styled.div<ContentContainerProps>`
  width: 100%;
  height: ${(props) =>
    props.pxFromTop ? `calc(100vh - ${props.pxFromTop / 16}rem - 4.875rem)` : '80vh'};
  overflow-y: scroll;
  overflow-x: hidden;
`;

interface ContentContainerProps {
  pxFromTop?: number;
}
const ContentContainer = styled.div`
  width: 100%;
  height: 44rem;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;
const TableTitle = styled.div`
  width: 100%;
  margin: 2rem;
  display: flex;
  padding-right: 4rem;
  justify-content: space-between;
`;

const TableTitleText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const EditsButtonContainer = styled.div``;

const TableHeaderContainer = styled.div`
  & > div {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  tbody {
    display: none;
  }
`;

const TableContainer = styled.div`
  padding: 0 2rem;
`;

const TableDataContainer = styled.div`
  max-height: 12rem;
  overflow-y: scroll;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey3};
  border-top: none;

  & > div {
    border: none;
  }
`;

const CheckboxContainer = styled.div`
  width: 1.5625rem;
  height: 1.5625rem;
`;

const ButtonsContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
  height: 4.6875rem;
  padding-right: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: white;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  position: relative;

  button {
    margin: 1rem;
    width: auto;
  }
`;

const PreviousEditTitleContainer = styled.div`
  display: flex;

  div:first-child {
    margin-right: 0.5rem;
  }
`;

export const columnConfigs = (
  //sortState: Record<string, SortState>,
  onRowCheck: (rowType: 'assembly' | 'part', partId: Id, checked: boolean) => void,
  handleSkuChange: (rowType: 'assembly' | 'part', partId: Id, newSku: string) => void,
  dataType: 'assembly' | 'part',
  allChecked: boolean
): ColumnConfig[] => {
  return [
    {
      title: (
        <Checkbox
          checked={allChecked}
          onChange={(event) => onRowCheck(dataType, 'all', event.target.checked)}
        />
      ),
      dataIndex: 'checked',
      key: 'checked',
      width: '3.125rem',
      /*sortState: undefined,*/
      render: function (value, record) {
        const checked = !!value;
        const item =
          dataType === 'assembly'
            ? (record as SelectablePartNodeExtension)
            : (record as SelectablePartNode);
        return {
          children: (
            <Column>
              {item.editedSku ? (
                <CheckboxContainer>
                  <Checkbox
                    checked={checked}
                    onChange={(event) =>
                      onRowCheck(
                        dataType,
                        dataType === 'assembly'
                          ? ((item as SelectablePartNodeExtension).partId as string)
                          : (item as SelectablePartNode).id,
                        event.target.checked
                      )
                    }
                  />
                </CheckboxContainer>
              ) : (
                <CheckboxContainer />
              )}
            </Column>
          )
        };
      }
    },
    {
      title: 'Part Number',
      dataIndex: 'sku',
      key: 'sku',
      width: '15.5rem',
      render(value, record) {
        const item =
          dataType === 'assembly'
            ? (record as SelectablePartNodeExtension)
            : (record as SelectablePartNode);
        return {
          children: (
            <Column>
              <Input
                type="text"
                defaultValue={item.sku as string}
                onChange={(e: ChangeEvent) => {
                  const newValue = trim(e.target.value);
                  const itemId =
                    dataType === 'assembly'
                      ? ((item as SelectablePartNodeExtension).partId as string)
                      : (item as SelectablePartNode).id;
                  handleSkuChange(dataType, itemId, newValue);
                }}
              />
            </Column>
          )
        };
      }
    },
    {
      title: 'Assembly',
      dataIndex: 'assembly',
      key: 'assembly',
      width: '15.5rem',
      render(value) {
        return {
          children: <Column>{value || '-'}</Column>
        };
      }
    },
    {
      title: (
        <PreviousEditTitleContainer>
          <div>Previous User Edit</div>
          <InformationTooltip
            placement="top"
            tooltipText={`This column displays the edits made the last time a diagram PDF for this machine was ingested. To apply these last edits, please select the checkbox and click "apply last edits".`}
          />
        </PreviousEditTitleContainer>
      ),
      dataIndex: 'editedSku',
      key: 'editedSku',
      width: '15.5rem',
      render(value) {
        return {
          children: <Column>{value || '-'}</Column>
        };
      }
    },
    {
      title: 'Part Description',
      dataIndex: 'description',
      key: 'description',
      width: '15.5rem',
      render(value) {
        return {
          children: <Column>{value || '-'}</Column>
        };
      }
    },
    {
      title: 'Last Modified',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '15.5rem',
      render(value) {
        return {
          children: <Column>{value ? formatDate(value as string, 'short-year4') : 'N/A'}</Column>
        };
      }
    }
  ];
};

export const ReviewPartNumber = ({ machine }: { machine?: OnboardingMachine }): JSX.Element => {
  const { nextStep } = useWizard();
  const [modifiedParts, setModifiedParts] = useState<SelectablePartNode[]>([]);
  const [modifiedAssemblies, setModifiedAssemblies] = useState<SelectablePartNodeExtension[]>([]);

  // Element top variables
  const [pxFromTop, setPxFromTop] = useState<number>(0);
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elRef && elRef.current) {
      setPxFromTop(elRef.current.offsetTop);
    }
  }, [elRef]);

  // API hooks
  const { data: bomData, isFetching: isBomDataFetching } = useGetPartsInBomNotLinkedToERPQuery(
    machine ? machine.id : skipToken
  );
  const { data: assemblyData, isFetching: isAssemblyDataFetching } =
    useGetPartsInAssemblyNotLinkedToERPQuery(machine ? machine.id : skipToken);
  const [updateModifiedParts] = useUpdateModifiedPartsNumberMutation();
  const [getPartsTrigger, { data: allParts, isFetching: fetchingParts }] =
    useLazyGetMachineOnboardingPartsByIdsQuery();

  // Retieve all of the machine's parts so that the part's parents can be found
  // and added to the columns
  useEffect(() => {
    if (machine) {
      getPartsTrigger({
        subParts: false,
        onlyImages: false,
        flagAssemblies: true,
        includeResources: false,
        machineId: machine.id,
        businessUnitId: machine.businessUnitId
      });
    }
  }, [machine]);

  // Update the selectable parts when the API updates
  useEffect(() => {
    if (bomData && allParts) {
      const updatedSelectableParts: SelectablePartNode[] = bomData.map((part) => {
        const parentPart = allParts.find((item) =>
          part.parentSku ? part.parentSku === item.sku : false
        );
        const assemblyLabel = parentPart
          ? `${parentPart.sku}${
              parentPart.manualDescription
                ? `: ${parentPart.manualDescription}`
                : parentPart.description
                ? `: ${parentPart.description}`
                : ''
            }`
          : undefined;
        return {
          ...part,
          checked: false,
          assembly: assemblyLabel
        };
      });

      setModifiedParts(updatedSelectableParts);
    }
  }, [bomData, allParts]);

  // Update the selectable assemblies when the API updates
  useEffect(() => {
    if (assemblyData && allParts) {
      const updatedSelectableAssemblies: SelectablePartNodeExtension[] = assemblyData.map(
        (assembly) => {
          const parentPart = allParts.find((item) =>
            assembly.parentSku ? assembly.parentSku === item.sku : false
          );
          const assemblyLabel = parentPart
            ? `${parentPart.sku}${
                parentPart.manualDescription
                  ? `: ${parentPart.manualDescription}`
                  : parentPart.description
                  ? `: ${parentPart.description}`
                  : ''
              }`
            : undefined;
          return {
            ...assembly,
            checked: false,
            assembly: assemblyLabel
          };
        }
      );

      setModifiedAssemblies(updatedSelectableAssemblies);
    }
  }, [assemblyData, allParts]);

  const onRowCheck = (rowType: 'assembly' | 'part', id: Id, checked: boolean) => {
    if (rowType === 'assembly') {
      setModifiedAssemblies(
        modifiedAssemblies.map((assembly) => ({
          ...assembly,
          checked:
            (id === 'all' && Boolean(assembly.editedSku)) || id === assembly.partId
              ? checked
              : assembly.checked
        }))
      );
    } else {
      setModifiedParts(
        modifiedParts.map((part) => ({
          ...part,
          checked:
            (id === 'all' && Boolean(part.editedSku)) || id === part.id ? checked : part.checked
        }))
      );
    }
  };

  const handleSkuChange = (rowType: 'assembly' | 'part', id: Id, newSku: string) => {
    if (rowType === 'assembly') {
      setModifiedAssemblies(
        modifiedAssemblies.map((assembly) => ({
          ...assembly,
          sku: assembly.partId === id ? newSku : assembly.sku
        }))
      );
    } else {
      setModifiedParts(
        modifiedParts.map((part) => ({ ...part, sku: part.id === id ? newSku : part.sku }))
      );
    }
  };

  const handleSubmitPartEdits = async () => {
    if (machine) {
      const partsToUpdate: PartUpdate[] = modifiedParts
        .filter((part) => part.checked)
        .map((part) => ({
          [part.id]: part.editedSku as string
        }));
      await updateModifiedParts({ machineId: machine.id, modifiedParts: partsToUpdate })
        .unwrap()
        .then(() => {
          toast.success(`Previous edits successfully applied`);
        })
        .catch((error) => {
          toast.error(`Failed to save previous edits!: ${error.data}`);
        });
    }
  };

  const handleSubmitAssemblyEdits = async () => {
    if (machine) {
      const assembliesToUpdate: PartUpdate[] = modifiedAssemblies
        .filter((assembly) => assembly.checked)
        .map((assembly) => ({
          [assembly.partId as string]: assembly.editedSku as string
        }));
      await updateModifiedParts({ machineId: machine.id, modifiedParts: assembliesToUpdate })
        .unwrap()
        .then(() => {
          toast.success(`Previous edits successfully applied.`);
        })
        .catch((error) => {
          toast.error(`Failed to save previous edits!: ${error.data}`);
        });
    }
  };

  const numPartsWithEdits = modifiedParts.filter((part) => part.editedSku).length;
  const numPartsChecked = modifiedParts.filter((part) => part.checked).length;
  const allPartsChecked = numPartsWithEdits > 0 && numPartsChecked === numPartsWithEdits;
  const numAssembliesWithEdits = modifiedAssemblies.filter((assembly) => assembly.editedSku).length;
  const numAssembliesChecked = modifiedAssemblies.filter((part) => part.checked).length;
  const allAssembliesChecked =
    numAssembliesWithEdits > 0 && numAssembliesChecked === numAssembliesWithEdits;

  const handleCancel = () => {
    if (machine) window.location.assign(JBTRoutes.onboardingPage.replace(':machineId', machine.id));
  };

  return (
    <RootContainer>
      <ContentOuterContainer ref={elRef} pxFromTop={pxFromTop}>
        <ContentContainer>
          <TableTitle>
            <TableTitleText>
              {`Parts found in BOM but not Linked to ERP${
                modifiedParts.length > 0 ? ` (${modifiedParts.length})` : ''
              }`}
            </TableTitleText>
            <EditsButtonContainer>
              <Button disabled={numPartsChecked <= 0} onClick={() => handleSubmitPartEdits()}>
                {`Apply previous edits`}
              </Button>
            </EditsButtonContainer>
          </TableTitle>
          {isBomDataFetching || fetchingParts ? (
            <Loader margin="auto" />
          ) : (
            modifiedParts.length > 0 && (
              <TableContainer>
                {/* Header */}
                <TableHeaderContainer>
                  <BaseTable
                    columnConfigs={columnConfigs(
                      onRowCheck,
                      handleSkuChange,
                      'part',
                      allPartsChecked
                    )}
                    data={[]}
                    outerBorderColor={theme.colors.lightGrey3}
                    borderRadius="0.5rem"
                  />
                </TableHeaderContainer>
                <TableDataContainer>
                  <BaseTable
                    columnConfigs={columnConfigs(
                      onRowCheck,
                      handleSkuChange,
                      'part',
                      allPartsChecked
                    )}
                    alternatingRowColoring={false}
                    data={modifiedParts}
                    borderBottomRow
                    outerBorderColor={theme.colors.lightGrey3}
                    borderRadius="0.5rem"
                    showHeader={false}
                  />
                </TableDataContainer>
              </TableContainer>
            )
          )}
          <TableTitle>
            <TableTitleText>
              {`Assemblies found in BOM but not Linked to ERP${
                modifiedAssemblies.length > 0 ? ` (${modifiedAssemblies.length})` : ''
              }`}
            </TableTitleText>
            <EditsButtonContainer>
              <Button
                disabled={numAssembliesChecked <= 0}
                onClick={() => handleSubmitAssemblyEdits()}
              >
                {`Apply previous edits`}
              </Button>
            </EditsButtonContainer>
          </TableTitle>
          {isAssemblyDataFetching || fetchingParts ? (
            <Loader margin="auto" />
          ) : (
            modifiedAssemblies.length > 0 && (
              <TableContainer>
                {/* Header */}
                <TableHeaderContainer>
                  <BaseTable
                    columnConfigs={columnConfigs(
                      onRowCheck,
                      handleSkuChange,
                      'assembly',
                      allAssembliesChecked
                    )}
                    data={[]}
                    outerBorderColor={theme.colors.lightGrey3}
                    borderRadius="0.5rem"
                  />
                </TableHeaderContainer>
                <TableDataContainer>
                  <BaseTable
                    columnConfigs={columnConfigs(
                      onRowCheck,
                      handleSkuChange,
                      'assembly',
                      allAssembliesChecked
                    )}
                    alternatingRowColoring={false}
                    data={modifiedAssemblies}
                    borderBottomRow
                    outerBorderColor={theme.colors.lightGrey3}
                    borderRadius="0.5rem"
                    showHeader={false}
                  />
                </TableDataContainer>
              </TableContainer>
            )
          )}
        </ContentContainer>
      </ContentOuterContainer>
      <ButtonsContainer>
        <Button disabled={false} variant="thin" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          bgColor={theme.colors.mediumBlue}
          variant={'primary'}
          onClick={async () => {
            if (bomData && assemblyData && machine && modifiedParts.length > 0) {
              // Get the modified parts first
              let updates: PartUpdate[] = modifiedParts
                .filter((part) => {
                  const originalPart = bomData.find((item) => item.id === part.id);
                  return originalPart ? part.sku && part.sku !== originalPart.sku : false;
                })
                .map((part) => ({ [part.id]: part.sku as string }));

              // Then add in the modified assemblies
              const changedAssemblies: PartUpdate[] = modifiedAssemblies
                .filter((assembly) => {
                  const originalAssembly = assemblyData.find(
                    (item) => item.partId && item.partId === assembly.partId
                  );
                  return originalAssembly
                    ? assembly.sku && assembly.sku !== originalAssembly.sku
                    : false;
                })
                .map((assembly) => ({
                  [assembly.partId as string]: assembly.sku as string
                }));
              updates = updates.concat(changedAssemblies);

              if (updates.length > 0) {
                await updateModifiedParts({ machineId: machine.id, modifiedParts: updates })
                  .unwrap()
                  .then(() => {
                    toast.success(`Changes successfully submitted.`);
                    nextStep();
                  })
                  .catch((error) => {
                    toast.error(`SKU update failed!: ${error.data}`);
                  });
              }
            }
            nextStep();
          }}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </RootContainer>
  );
};
