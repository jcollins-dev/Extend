import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DigitalEdgeType } from 'types';
import {
  ReviewMachineMtlDsdm,
  ReviewMachineMtlKdm,
  ReviewMachineMtlMqtt,
  UpdateRowValueFunc
} from 'types/machine-management';
import DeviceAccordion from './DeviceAccordion';
import ReviewMachineMtlAttrsTable from './ReviewMachineMtlAttrsTable';
import LeftChevron from 'components/HorizontalScrollButtons/LeftScrollButton';
import RightChevron from 'components/HorizontalScrollButtons/RightScrollButton';

//styling
const DeviceAccordionWrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  order: 1;
  align-self: stretch;
  gap: 1.5rem;
`;

interface ReviewMachineMtlTableProps {
  reviewMachineMtlData:
    | ReviewMachineMtlKdm[]
    | ReviewMachineMtlDsdm[]
    | ReviewMachineMtlMqtt[]
    | undefined;
  digitalEdgeType: DigitalEdgeType;
  updateReviewMachineMtlRow: UpdateRowValueFunc;
  updateReviewMachineMtlAttrsRow: UpdateRowValueFunc;
}

const ReviewMachineMtlTable: FC<ReviewMachineMtlTableProps> = ({
  reviewMachineMtlData,
  digitalEdgeType,
  updateReviewMachineMtlRow,
  updateReviewMachineMtlAttrsRow
}: ReviewMachineMtlTableProps): ReactElement => {
  const { t } = useTranslation(['mh', 'common']);
  const [showColumnOptions, setShowColumnOptions] = useState<boolean>(false);
  const triggershowColumnOptions = (): void => {
    setShowColumnOptions(true);
  };

  const [reviewTabId, setReviewTabId] = useState<string>();
  const [horizontalScrollRate, setHorizontalScrollRate] = useState<number>();

  useEffect(() => {
    setReviewTabId('reviewTagsPageTab');
    setHorizontalScrollRate(400);
  });

  const handleScrollRightReviewTable = () => {
    if (reviewTabId) {
      const eTab = document.querySelector(`div#${reviewTabId} div div table`);
      if (eTab?.parentElement) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        eTab.parentElement.scrollLeft += horizontalScrollRate!;
      }
    }
  };

  const handleScrollLeftReviewTable = () => {
    if (reviewTabId) {
      const eTab = document.querySelector(`div#${reviewTabId} div div table`);
      if (eTab?.parentElement) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        eTab.parentElement.scrollLeft -= horizontalScrollRate!;
      }
    }
  };

  return (
    <>
      <DeviceAccordionWrapper>
        {reviewMachineMtlData &&
          reviewMachineMtlData?.map((mtlData, index) => {
            return (
              <DeviceAccordion
                key={mtlData.machineTagListId}
                data={mtlData}
                digitalEdgeType={digitalEdgeType}
                onRowUpdate={updateReviewMachineMtlRow}
                name={t('rm_mtl_device', { item: index + 1 }) as string}
                triggershowColumnOptions={triggershowColumnOptions}
              >
                <LeftChevron handleScroll={handleScrollLeftReviewTable} />
                <RightChevron handleScroll={handleScrollRightReviewTable} />
                <ReviewMachineMtlAttrsTable
                  reviewMachineMtlData={mtlData}
                  digitalEdgeType={digitalEdgeType}
                  onRowUpdate={updateReviewMachineMtlAttrsRow}
                  showColumnOptions={showColumnOptions}
                  setShowcolumOptions={setShowColumnOptions}
                ></ReviewMachineMtlAttrsTable>
              </DeviceAccordion>
            );
          })}
      </DeviceAccordionWrapper>
    </>
  );
};

export default ReviewMachineMtlTable;
