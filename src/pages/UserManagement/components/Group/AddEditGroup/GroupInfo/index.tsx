// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import styled from 'styled-components';

// Components
import { Input, InputLabel, RadioButton, Row } from 'components';

interface Props {
  groupInformation: { name: string; internalAccessGroup: boolean };
  onGroupNameChange: (name: string) => void;
  onGroupAccessChange: (internalAccessGroup: boolean) => void;
}

const MandatoryIndicator = styled.span`
  color: ${({ theme }) => theme.colors.darkRed};
`;

const GroupInfo = ({
  onGroupNameChange,
  onGroupAccessChange,
  groupInformation
}: Props): ReactElement => {
  return (
    <>
      <InputLabel mandatory={true} color={theme.colors.field.select.enabled}>
        Group Name
      </InputLabel>
      <Input
        maxLength={50}
        placeholder="Enter group name (maximum 50 characters)"
        value={(groupInformation && groupInformation.name) ?? ''}
        onChange={(e: { target: { value: string } }) => {
          !(e.target.value.at(-1) === ' ' && groupInformation.name.at(-1) === ' ') &&
            onGroupNameChange(e.target.value);
        }}
        style={{ marginBottom: '1rem' }}
        onBlur={() => {
          onGroupNameChange(groupInformation.name.trim());
        }}
      />
      <InputLabel color={theme.colors.field.select.enabled}>
        Access Group <MandatoryIndicator>*</MandatoryIndicator>
      </InputLabel>
      <Row>
        <RadioButton
          label="External JBT"
          checked={!groupInformation.internalAccessGroup}
          onChange={() => {
            onGroupAccessChange(!groupInformation.internalAccessGroup);
          }}
        />
        <RadioButton
          label="Internal JBT"
          checked={groupInformation.internalAccessGroup}
          onChange={() => {
            onGroupAccessChange(!groupInformation.internalAccessGroup);
          }}
        />
      </Row>
    </>
  );
};

export default GroupInfo;
