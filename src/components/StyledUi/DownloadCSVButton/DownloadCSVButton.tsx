import React from 'react';
import { StyledButtonV2 } from '../elements/StyledButton';
import { convertToCSV } from '../js/convertTableDataToCsv';
import saveAs from 'file-saver';
import { useTranslation } from 'react-i18next';

export interface DownloadCSVButtonProps {
  data?: Record<string, unknown>[];
  fileName: string;
  headers?: Record<string, string>;
}
export const DownloadCSVButton = ({
  data,
  fileName,
  headers
}: DownloadCSVButtonProps): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const handleClick = () => {
    if (!data) return false;

    const csvString = convertToCSV(data, headers);
    const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    saveAs(csvBlob, fileName);
  };

  return (
    <StyledButtonV2 disabled={!data ? true : false} onClick={() => handleClick()}>
      <span className="font--capitalize">{t('download')}</span> CSV
    </StyledButtonV2>
  );
};
