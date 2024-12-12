// 3rd party
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Tooltip from 'rc-tooltip';
// Components
import { BaseSelect, BaseTable, Input, NumberPicker } from 'components';
// Types
import { ChangeEvent, ColumnConfig, BaseType } from 'types';
import {
  MaintenanceCreator,
  MaintenanceFrequencyType,
  MaintenceScheduleImportRow,
  MaintenceScheduleImportRowErrorData
} from 'types/maintenance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { validateNumber } from 'helpers';

interface GroupRow extends BaseType {
  rowType: 'group';
  title: string;
  countStr?: string;
  key: string;
}

type TableRow = GroupRow | MaintenceScheduleImportRow;
type UpdateRowValueFunc = (
  rowId: number | undefined,
  key: string,
  value: string | number | boolean | JSX.Element,
  columnName?: string
) => void;
type UpdateRowValidationFunc = (
  rowId: number | undefined,
  errorKey: string,
  errors: MaintenceScheduleImportRowErrorData[]
) => void;
/* End interfaces */

const Root = styled.div`
  width: 100%;
  // height: 500px;
  // max-height: 500px;
`;

const TooltipInformationContainer = styled.div`
  max-width: 20rem;
  max-height: 10rem;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0em;
  text-align: left;
  word-wrap: break-word;
  text-align: justify;
  text-justify: inter-word;
  over-flow: scroll;
  @media (max-width: 768px) {
    max-width: 10rem;
  }
`;
const ErrorMessage = styled.div<{ hasMessage: string | undefined }>`
  color: #ff0000;
  cursor: default;
  font-size: 0.8rem;
  display: ${(props) => {
    if (props.hasMessage && props.hasMessage === 'error') {
      return 'block';
    } else {
      return 'none';
    }
  }};
`;
const BodyRowContainer = styled.tr<{ isGroup: boolean }>`
  background-color: ${(props) => {
    if (props.isGroup) {
      return props.theme.colors.lightGrey1;
    }

    return 'transparent';
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling
`;

// const ActionButtonStyled = styled(ActionButton)`
//   color: ${theme.colors.mediumBlue};
//   background-color: transparent;
//   white-space: nowrap;
// `;

// function TruncatedText({ text }: { text: string }) {
//   const [displayFullText, setDisplayFullText] = useState(false);

//   const toggleDisplayFullText = () => {
//     setDisplayFullText(!displayFullText);
//   };
//   const maxLength = 29;
//   const truncatedText = displayFullText ? text : text.slice(0, maxLength) + '...';

//   return (
//     <>
//       {truncatedText}
//       {text.length > maxLength && (
//         <ActionButtonStyled
//           hideArrow={true}
//           style={{ justifyContent: 'center' }}
//           onClick={toggleDisplayFullText}
//         >
//           {displayFullText ? 'Read Less' : 'Read More'}
//         </ActionButtonStyled>
//       )}
//     </>
//   );
// }

const PopOverMsg = ({ errorData }: { errorData: MaintenceScheduleImportRowErrorData }) => {
  return (
    <Tooltip
      overlay={
        <TooltipInformationContainer>
          <p style={{ overflow: 'auto' }}>{errorData.errors?.[0]}</p>
        </TooltipInformationContainer>
      }
      placement={'left'}
      overlayClassName="information-tooltip"
    >
      <ErrorMessage
        hasMessage={errorData.hasError ? 'error' : undefined}
        title={errorData.errors?.[0]}
      >
        <FontAwesomeIcon icon={faExclamationCircle} fontSize="0.625rem" />
        &nbsp;&nbsp; Please correct the error
      </ErrorMessage>
    </Tooltip>
  );
};
const getImportRowErrorData = (
  data: MaintenceScheduleImportRowErrorData[] | undefined,
  columnName: string
): MaintenceScheduleImportRowErrorData => {
  let errData: MaintenceScheduleImportRowErrorData = {
    hasError: false,
    columnName: columnName,
    errors: [''],
    errorMessage: ''
  };

  if (data) {
    for (const err of data) {
      if (err.columnName === columnName) {
        if (Object.hasOwn(err, 'hasError')) {
          errData = err;
        } else {
          errData = { ...err, hasError: true };
        }
      }
    }
  }

  return errData;
};
const updateErrorData = (
  data: MaintenceScheduleImportRowErrorData[] | undefined,
  columnName: string,
  val: string
): MaintenceScheduleImportRowErrorData[] => {
  const errors: MaintenceScheduleImportRowErrorData[] = [];
  if (data) {
    data.forEach((err) => {
      if (err.columnName === columnName && val) {
        err = { ...err, hasError: false };
        errors.push(err);
      } else if (err.columnName === columnName && !val) {
        err = { ...err, hasError: true };
        errors.push(err);
      } else {
        errors.push(err);
      }
    });
  }
  return errors;
};
const isValidatePMId = (value: string): boolean => {
  const idParts = value.split('.');
  return ['D', 'W', 'M', 'Y', 'R'].includes(idParts[0].toLocaleUpperCase());
};
// Generate the configurations for each column of this table
const generateColumnConfigs = ({
  updateRow,
  validateRow,
  t
}: {
  updateRow: UpdateRowValueFunc;
  validateRow: UpdateRowValidationFunc;
  t: TFunction<'fpns'[], undefined>;
}): ColumnConfig[] => {
  return [
    {
      title: t('business_unit') as string,
      dataIndex: 'businessUnitName',
      key: 'businessUnitName',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'business_unit';
        const errorData = getImportRowErrorData(data.errorMessages, 'business_unit_name');
        return (
          <>
            <Input
              value={data.businessUnitName}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'businessUnitName',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Business Unit Name', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('machine_id') as string,
      dataIndex: 'salesforceMachineId',
      key: 'salesforceMachineId',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'salesforce_machine_id';
        const errorData = getImportRowErrorData(data.errorMessages, 'salesforce_machine_id');
        return (
          <>
            <Input
              value={data.salesforceMachineId}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'salesforceMachineId',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Machine ID', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('machine_name_*') as string,
      dataIndex: 'machineName',
      key: 'machineName',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'machine_name';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.machineName}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'machineName',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Machine Name', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('unique_id_*') as string,
      dataIndex: 'id',
      key: 'id',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const errorData = getImportRowErrorData(data.errorMessages, 'Unique ID');
        return (
          <>
            <Input
              value={data.id}
              onChange={(event: ChangeEvent) => {
                updateRow(data.rowId, 'id', (event.target as HTMLInputElement).value as string);
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Unique ID', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('pm_id_*') as string,
      dataIndex: 'pmId',
      key: 'pmId',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'pm_id';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'pmId',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              value={data.pmId}
              onBlur={(event: FocusEvent) => {
                let val = (event.target as HTMLInputElement).value as string;

                if (!isValidatePMId(val)) {
                  val = '';
                }
                const errors = updateErrorData(data.errorMessages, 'PM ID', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('description_*') as string,
      dataIndex: 'description',
      key: 'description',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'description';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.description}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'description',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Description', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('subcomponent') as string,
      dataIndex: 'scheduleSubcomponent',
      key: 'scheduleSubcomponent',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'schedule_subcomponent';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.scheduleSubcomponent}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'scheduleSubcomponent',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Sub component', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('frequency_*') as string,
      dataIndex: 'frequency',
      key: 'frequency',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'frequency';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <NumberPicker
              value={data.frequency as number}
              onChange={(event: ChangeEvent) => {
                const val = event.target.valueAsNumber as number;
                const errors = updateErrorData(data.errorMessages, 'Frequency', val.toString());
                updateRow(data.rowId, 'frequency', val, columnName);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('frequency_type_*') as string,
      dataIndex: 'frequencyType',
      key: 'frequencyType',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'frequency_type';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <BaseSelect
              value={data.frequencyType as string}
              handleChange={(event): void => {
                let val = event.target.value as string;
                if (val === 'Select Frequency Type') val = '';
                const errors = updateErrorData(data.errorMessages, 'Frequency Type', val);
                updateRow(
                  data.rowId,
                  'frequencyType',
                  event.target.value as MaintenanceFrequencyType,
                  columnName
                );
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              options={[
                'Select Frequency Type',
                MaintenanceFrequencyType.Cycles,
                MaintenanceFrequencyType.Days,
                MaintenanceFrequencyType.RunHours,
                MaintenanceFrequencyType.Sip
              ]}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('priority') as string,
      dataIndex: 'priority',
      key: 'priority',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'priority';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.priority}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'priority',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Priority', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('duration') as string,
      dataIndex: 'estimatedCompletionTime',
      key: 'estimatedCompletionTime',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'estimated_completion_time';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.estimatedCompletionTime || ''}
              onChange={(event: ChangeEvent) => {
                validateNumber(+event.target.value) &&
                  updateRow(
                    data.rowId,
                    'estimatedCompletionTime',
                    (event.target as HTMLInputElement).value as string,
                    columnName
                  );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Duration', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('detailed_instructions') as string,
      dataIndex: 'detailedInstructions',
      key: 'detailedInstructions',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'detailed_instructions';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <Input
              value={data.detailedInstructions}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'detailedInstructions',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Detailed Instructions', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('skus') as string,
      dataIndex: 'skus',
      key: 'skus',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'skus';
        const errorData = getImportRowErrorData(data.errorMessages, 'skus');
        return (
          <>
            <Input
              value={data.skus}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'skus',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Part Numbers', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('quantities') as string,
      dataIndex: 'quantities',
      key: 'quantities',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'quantities';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);

        return (
          <>
            <Input
              value={data.quantities}
              onChange={(event: ChangeEvent) => {
                updateRow(
                  data.rowId,
                  'quantities',
                  (event.target as HTMLInputElement).value as string,
                  columnName
                );
              }}
              onBlur={(event: FocusEvent) => {
                const val = (event.target as HTMLInputElement).value as string;
                const errors = updateErrorData(data.errorMessages, 'Quantities', val);
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    },
    {
      title: t('creator') as string,
      dataIndex: 'scheduleCreator',
      key: 'scheduleCreator',
      width: '10rem',
      render(value, record) {
        const data = record as MaintenceScheduleImportRow;
        const columnName = 'schedule_creator';
        const errorData = getImportRowErrorData(data.errorMessages, columnName);
        return (
          <>
            <BaseSelect
              value={data.scheduleCreator as string}
              handleChange={(event): void => {
                const errors = updateErrorData(
                  data.errorMessages,
                  'Creator',
                  event.target.value as string
                );
                updateRow(
                  data.rowId,
                  'scheduleCreator',
                  event.target.value as MaintenanceCreator,
                  columnName
                );
                validateRow(data.rowId, 'errorMessages', errors);
              }}
              options={[
                MaintenanceCreator.Customer,
                MaintenanceCreator.Manufacturer,
                MaintenanceCreator.Predictive,
                MaintenanceCreator.User
              ]}
              borderVariant={errorData.hasError ? 'error' : undefined}
            />
            <PopOverMsg errorData={errorData} />
          </>
        );
      }
    }
  ];
};

interface MaintenceScheduleTableProps {
  data: MaintenceScheduleImportRow[];
  isDataLoading?: boolean;
  onRowUpdate: UpdateRowValueFunc;
  onValidation: UpdateRowValidationFunc;
  id?: string;
}

const MaintenceScheduleTable = ({
  data,
  isDataLoading,
  onRowUpdate,
  onValidation,
  id
}: MaintenceScheduleTableProps): ReactElement => {
  const { t } = useTranslation(['fpns', 'common']);
  return (
    <Root>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs({
          updateRow: onRowUpdate,
          validateRow: onValidation,
          t
        })}
        scroll={{ x: '200rem' }}
        data={data}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) => `${(record as TableRow).id}-${index}`}
        borderBottomRow
        bodyRowComponent={BodyRowContainer}
        onRow={(record) => {
          // Pass through props to the BodyRow styled component
          return {
            isGroup: record.rowType === 'group'
          } as React.HTMLAttributes<TableRow>;
        }}
        id={id}
        headerSticky
        verticalAlign={'baseline'}
      />
    </Root>
  );
};

export default MaintenceScheduleTable;
