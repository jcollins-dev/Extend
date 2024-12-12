// 3rd party
import React, { ReactElement, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { useTheme } from 'styled-components';
import Tooltip from 'rc-tooltip';
import { toast } from 'react-toastify';
// Components
import { PopUpCard, Loader, Typography } from 'components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import ShoppingCart from './icons/ShoppingCart.svg';
import Frame from './icons/Frame.svg';
import Publish from './icons/Publish.svg';
import upload from './icons/Upload.svg';
import pdfIcon from './icons/pdfIcon.svg';
import Calendar from './icons/Calendar.svg';
import Power_BILogo from './icons/Power_BILogo.svg';
import { Modal } from 'components';
import { Button } from 'components/Button';
import { useTranslation } from 'react-i18next';
import {
  useCreatePowerBiDataMutation,
  useUpdatePowerBiDataMutation,
  useDeletePowerBiDataMutation,
  useGetPowerBiDataByIdQuery
} from 'api';
import { CreatePowerBiMachineData } from 'types/machine-management';

interface MachineManagementPopupcardProps {
  visible: boolean;
  posX?: number;
  posY?: number;
  clickPosition?: number;
  vh?: number;
  handleClose: () => void;
  machineId: string;
  baseRef?: React.MutableRefObject<HTMLDivElement | null>;
}
const InvisibleLayer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
`;

const MtlOptionsContainer = styled.div`
  height: auto;
  width: 100%;
`;

const MtlOptionItem = styled.div`
  width: 100%;
  height: 2.5rem;
  padding: 0.6875rem 0.875rem 0.6875rem 1rem;
  display: flex;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.lightGrey1};
  }
`;

const MtlOptionLabel = styled.div`
  flex-grow: 1;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  color: ${(props) => props.theme.colors.darkGrey};
`;

const MtlOptionIcon = styled.div`
  flex-grow: 0;
  padding-right: 8px;
`;

const FormParent = styled.section`
  padding: 1rem;
  // padding-bottom: 2rem;
  // margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  width: 96%;
  margin-left: 1.438rem;
  @media (max-width: 768px) {
    padding-bottom: 6rem;
  }
`;

const FormContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const FormItem = styled.section`
  flex: 1 0 21%;
  padding: 0.5rem;
  .label {
    color: #323130;
    font-weight: 700;
    font-size: 0.75rem;

    sup {
      color: red;
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    flex-basis: 50%;
  }
  @media (max-width: 480px) {
    flex-basis: 100%;
  }
`;

const LabelContainer = styled.section`
  display: flex;
`;

const StyledInputField = styled.input`
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 0.063rem solid #ccc;
  border-radius: 0.4rem;
  font-size: 1rem;
  width: 100%;
`;

export const RefreshButton = styled.button`
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const Footer = styled.div<{ flexDirection?: string; bgColor?: string }>`
  background-color: transparent;
  width: 100%;
  margin-top:3rem;
  bottom: 0;
  left: 0;
  padding: 1.3125rem 1.625rem 2.5rem 2.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: revert};
  justify-content: end;
`;
export const SuccessFooter = styled.div<{ flexDirection?: string; bgColor?: string }>`
  background-color: transparent;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1.3125rem 1.625rem 2.5rem 1.375rem;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: revert};
  justify-content: end;
`;
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

export const FooterButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2rem;
  & button {
    margin-left: 1rem;
  }
  .pushtofleet {
    padding: 4px, 32px, 4px, 32px;
    border-radius: 48px;
    width: 11rem;
  }
  .cancelbutton {
    color: #0076cc;
    padding: 4px, 32px, 4px, 32px;
    border-radius: 48px;
    width: 6.688rem;
    border: 0.063rem solid #0076cc;
  }
  .closebutton {
    width: 6.25rem;
    padding: 4px, 32px, 4px, 32px;
    border-radius: 48px;
  }
`;
const AddNewReport = styled.p`
  color: #0076cc;
  cursor: pointer;
`;
export const SucessMOdal = styled.div`
  background-image: url('/assets/imgs/successbg.svg');
  width: 100%;
  height: 240.47px;
`;
const RightCircleImage = styled.div`
  height: 104.85px;
  text-align: center;
`;
export const EditButton = styled.button`
  padding: 0rem 2.5rem 0.5rem 0rem;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
`;
export const IconsElement = styled.div`
  margin-top: 2.8rem;
  margin-right: 0.3rem;
`;
export const EditUpdateButton = styled.div`
  margin-top: 0.5rem;
  margin-right: 0.3rem;
`;
const InvisibleInteractionLayer = ({
  onClose,
  posY
}: {
  onClose: () => void;
  posY: number;
}): React.ReactElement => {
  return ReactDOM.createPortal(
    <InvisibleLayer style={{ height: posY + 100 }} onClick={() => onClose()} />,
    document.body
  );
};
const defaultPowerBiData: CreatePowerBiMachineData = {
  machineId: '',
  workspaceId: '',
  reportId: '',
  machineDescription: ''
};

type machinebiPropNames = 'machineId' | 'workspaceId' | 'reportId' | 'machineDescription';

const MachineManagementPopupcard = ({
  visible,
  posX,
  posY,
  handleClose,
  baseRef,
  clickPosition,
  vh,
  machineId
}: MachineManagementPopupcardProps): ReactElement => {
  const theme = useTheme();
  const [powerBiInputData, setPowerBiInputData] =
    useState<CreatePowerBiMachineData>(defaultPowerBiData);
  const [showModal, setShowModal] = useState(false);
  const [addNewForm, setAddNewForm] = useState<boolean>(false);
  const [formToggle, setFormToggle] = useState(false);
  const [powerBiData, setPowerBiData] = useState(true);
  const [successResponse, setSuccessResponse] = useState(false);
  const [disabledEdit, setDisableEdit] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const { t } = useTranslation(['mh']);

  const [createPowerBiData] = useCreatePowerBiDataMutation();
  const [updatePowerBiData] = useUpdatePowerBiDataMutation();
  const [deletePowerBiData] = useDeletePowerBiDataMutation();

  useEffect(() => {
    if (
      powerBiInputData.workspaceId?.trim().length === 0 ||
      powerBiInputData.reportId?.trim().length === 0 ||
      powerBiInputData.machineDescription?.trim().length === 0
    ) {
      setPowerBiData(true);
    } else {
      setPowerBiData(false);
    }
  }, [powerBiInputData, powerBiData]);

  const handlePowerBIInputChange = (value: string, propName: machinebiPropNames) => {
    setPowerBiInputData({ ...powerBiInputData, [propName]: value });
    if (
      powerBiInputData.workspaceId === '' ||
      powerBiInputData.reportId === '' ||
      powerBiInputData.machineDescription === ''
    ) {
      setPowerBiData(true);
    }
    if (
      powerBiInputData.workspaceId !== '' &&
      powerBiInputData.reportId !== '' &&
      powerBiInputData.machineDescription !== ''
    ) {
      setPowerBiData(false);
    }
  };
  const resetData = () => {
    if (
      (powerBiInputData && powerBiInputData.workspaceId !== '') ||
      powerBiInputData.reportId !== '' ||
      powerBiInputData.machineDescription !== ''
    ) {
      setPowerBiInputData({
        ...powerBiInputData,
        workspaceId: '',
        reportId: '',
        machineDescription: ''
      });
      setPowerBiData(true);
    }
  };

  const closeSuceessMOdal = () => {
    setSuccessResponse(false);
    setShowModal(false);
    resetData();
  };
  const onClickFleetToDashboard = () => {
    setShowModal(false);
    setSuccessResponse(true);
  };
  const onClickUpdateEditButton = (data: CreatePowerBiMachineData) => {
    setUpdateStatus(true);
    setFormToggle(!formToggle);
    setDisableEdit(true);
    setAddNewForm(false);
    setPowerBiInputData({
      ...powerBiInputData,
      workspaceId: data.workspaceId,
      reportId: data.reportId,
      machineDescription: data.machineDescription,
      machineId: data.machineId
    });
  };

  const { data, isLoading, isError } = useGetPowerBiDataByIdQuery({
    machineId: powerBiInputData.machineId as string
  });

  useEffect(() => {
    if (powerBiInputData.machineId !== '') {
      if (data && data?.length > 0) {
        setFormToggle(true);
      } else {
        setFormToggle(false);
      }
    }
  }, [powerBiInputData.machineId, data]);

  const onSaveNewReport = async () => {
    await createPowerBiData({
      machine_id: powerBiInputData.machineId,
      workspace_id: powerBiInputData.workspaceId,
      report_id: powerBiInputData.reportId,
      machine_description: powerBiInputData.machineDescription
    })
      .unwrap()
      .then(() => {
        toast('Saved Successfully');
        setPowerBiInputData({
          ...powerBiInputData,
          workspaceId: '',
          reportId: '',
          machineDescription: ''
        });
        setAddNewForm(false);
      })
      .catch((error) => {
        if (
          error?.data?.detail === 'Duplicate record: This machine_power_bi record already exists.'
        ) {
          toast('Duplicate record: This machine_power_bi record already exists.');
        } else {
          const workspaceId = error?.data?.detail[0].loc[1] as string;
          if (workspaceId === 'workspace_id') {
            toast(`Workspace Id is not valid`);
          } else if (workspaceId === 'report_id') {
            toast(`Report Id is not valid`);
          } else {
            toast(t('problem_creating_report_view'));
          }
        }
      });
  };
  const onSaveButton = async () => {
    await createPowerBiData({
      machine_id: powerBiInputData.machineId,
      workspace_id: powerBiInputData.workspaceId,
      report_id: powerBiInputData.reportId,
      machine_description: powerBiInputData.machineDescription
    })
      .unwrap()
      .then(() => {
        toast('Saved Successfully');
        setFormToggle(!formToggle);
        setPowerBiInputData({
          ...powerBiInputData,
          workspaceId: '',
          reportId: '',
          machineDescription: ''
        });
      })
      .catch((error) => {
        if (
          error?.data?.detail === 'Duplicate record: This machine_power_bi record already exists.'
        ) {
          toast('Duplicate record: This record already exists.');
        } else {
          const workspaceId = error?.data?.detail[0].loc[1] as string;

          if (workspaceId === 'workspace_id') {
            toast(`Workspace Id is not valid`);
          } else if (workspaceId === 'report_id') {
            toast(`Report Id is not valid`);
          } else {
            toast(t('problem_creating_report_view'));
          }
        }
      });
  };
  const onUpdateButton = async () => {
    setFormToggle(true);
    await updatePowerBiData({
      machineID: powerBiInputData.machineId,
      workspaceID: powerBiInputData.workspaceId,
      reportID: powerBiInputData.reportId,
      description: powerBiInputData.machineDescription
    })
      .unwrap()
      .then(() => {
        setFormToggle(!formToggle);
        setDisableEdit(true);
      })
      .catch((error) => {
        console.warn('powwerbierror ', error);
        toast(t('problem_creating_report_view'));
      });
  };
  const onDeleteButton = async () => {
    await deletePowerBiData({
      machineID: powerBiInputData.machineId,
      workspaceID: powerBiInputData.workspaceId,
      reportID: powerBiInputData.reportId
    })
      .unwrap()
      .then(() => {
        toast('PowerBi Record Deleted Successfully');
        setFormToggle(!formToggle);
        setDisableEdit(true);
      })
      .catch((error) => {
        console.warn('powwerbierror ', error);
        toast('No record Found');
        setSuccessResponse(false);
      });
  };
  return (
    <>
      <InvisibleInteractionLayer onClose={handleClose} posY={posY ?? 0} />
      <PopUpCard
        show={visible}
        setShowFunction={handleClose}
        // Subtract 160 (i.e. almost the full 10rem width of this pop-up)
        positionX={posX ? posX - 202.96 : 0}
        positionY={
          posY && clickPosition && vh ? (clickPosition + 322 <= vh ? posY : posY - 350) : 0
        }
        widthRem={14.6}
        hideCloseButton={true}
        padChildren={false}
        baseRef={baseRef}
      >
        <MtlOptionsContainer>
          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   console.log(MtlOption.Edit, mtlId);
            // }}
          >
            <MtlOptionIcon>
              <img src={upload} />
            </MtlOptionIcon>
            <MtlOptionLabel>Upload Machine Image</MtlOptionLabel>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Edit, mtlId);
            // }}
          >
            <MtlOptionIcon>
              {/* <FontAwesomeIcon icon={faPencil} color={theme.colors.darkGrey} /> */}
              <img src={pdfIcon} />
            </MtlOptionIcon>
            <MtlOptionLabel>Upload Machine PDF</MtlOptionLabel>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Edit, mtlId);
            // }}
          >
            <MtlOptionIcon>
              <img src={ShoppingCart} />
            </MtlOptionIcon>
            <MtlOptionLabel>Review Shop by Category</MtlOptionLabel>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Edit, mtlId);
            // }}
          >
            <MtlOptionIcon>
              {/* <FontAwesomeIcon icon={faPencil} color={theme.colors.darkGrey} /> */}
              <img src={Calendar} />
            </MtlOptionIcon>
            <MtlOptionLabel>Review Maintenance Schedule</MtlOptionLabel>
          </MtlOptionItem>
          <MtlOptionItem
            role="button"
            onClick={() => {
              setShowModal(true);
              handlePowerBIInputChange(machineId, 'machineId');
            }}
          >
            <MtlOptionIcon>
              {/* <FontAwesomeIcon icon={faPencil} color={theme.colors.darkGrey} /> */}
              <img src={Power_BILogo} />
            </MtlOptionIcon>
            <MtlOptionLabel>Setup PowerBI</MtlOptionLabel>
          </MtlOptionItem>

          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Duplicate, mtlId);
            // }}
          >
            <MtlOptionIcon>
              {/* <FontAwesomeIcon icon={faCopy} color={theme.colors.darkGrey} /> */}
              <img src={Frame} />
            </MtlOptionIcon>
            <MtlOptionLabel>Review Tags</MtlOptionLabel>
          </MtlOptionItem>

          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Duplicate, mtlId);
            // }}
          >
            <MtlOptionIcon>
              {/* <FontAwesomeIcon icon={faCopy} color={theme.colors.darkGrey} /> */}
              <img src={Publish} />
            </MtlOptionIcon>
            <MtlOptionLabel>Publish to Customer</MtlOptionLabel>
          </MtlOptionItem>

          <MtlOptionItem
            role="button"
            // onClick={() => {
            //   handleOption(MtlOption.Delete, mtlId);
            // }}
          >
            <MtlOptionIcon>
              <FontAwesomeIcon icon={faTrashCan} color={theme.colors.negativeRed} />
            </MtlOptionIcon>
            <MtlOptionLabel style={{ color: theme.colors.negativeRed }}>
              Delete Machine
            </MtlOptionLabel>
          </MtlOptionItem>
        </MtlOptionsContainer>
      </PopUpCard>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        size="small_auto_height"
        title="Setup PowerBI"
      >
        {isLoading ? (
          <Loader size={40} />
        ) : isError ? (
          <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
            {t('failed_to_load_data', { ns: 'common' })}
          </Typography>
        ) : formToggle ? (
          <FormParent>
            <>
              <FormContainer>
                <FormItem>
                  <LabelContainer>
                    <p className="label">
                      {t('workspace_id') as string} <sup>*</sup>
                    </p>
                  </LabelContainer>
                </FormItem>
                <FormItem>
                  <LabelContainer>
                    <p className="label">
                      {t('report_id') as string} <sup>*</sup>
                    </p>
                  </LabelContainer>
                </FormItem>
                <FormItem>
                  <LabelContainer>
                    <p className="label">
                      {t('report_name') as string} <sup>*</sup>
                    </p>
                  </LabelContainer>
                </FormItem>
              </FormContainer>
              <div
                style={{
                  overflow: 'auto',
                  height:
                    data?.length === 1
                      ? '3.5em'
                      : data?.length === 2
                      ? '6.5em'
                      : data?.length === 3
                      ? '10.5em'
                      : data?.length === 4
                      ? '14em'
                      : '17.50em'
                }}
              >
                {data &&
                  data?.map((data: CreatePowerBiMachineData) => {
                    return (
                      <FormContainer key={data.workspaceId}>
                        <FormItem>
                          <StyledInputField
                            value={data.workspaceId}
                            type="text"
                            disabled
                            placeholder={t('workspace_id') as string}
                            // onChange={(e: { target: { value: string } }) => setAlertName(e.target.value)}
                          />
                        </FormItem>
                        <FormItem>
                          <StyledInputField
                            value={data.reportId}
                            type="text"
                            disabled
                            placeholder={t('report_id') as string}
                            // onChange={(e: { target: { value: string } }) => setAlertName(e.target.value)}
                          />
                        </FormItem>
                        <FormItem>
                          <StyledInputField
                            value={data.machineDescription}
                            type="text"
                            disabled
                            placeholder={t('report_name') as string}
                          />
                        </FormItem>
                        <EditUpdateButton>
                          <Tooltip
                            overlayClassName="information-tooltip"
                            placement="top"
                            overlay={<span>Edit</span>}
                          >
                            <EditButton onClick={() => onClickUpdateEditButton(data)}>
                              <img src="assets/imgs/icons/pencil.svg" alt="Icon" />
                            </EditButton>
                          </Tooltip>{' '}
                        </EditUpdateButton>
                      </FormContainer>
                    );
                  })}
              </div>
            </>
            {addNewForm && (
              <FormContainer>
                <FormItem>
                  <StyledInputField
                    value={powerBiInputData?.workspaceId}
                    type="text"
                    placeholder={t('workspace_id') as string}
                    onChange={(event) =>
                      handlePowerBIInputChange(event.target.value, 'workspaceId')
                    }
                  />
                </FormItem>
                <FormItem>
                  <StyledInputField
                    value={powerBiInputData?.reportId}
                    type="text"
                    placeholder={t('report_id') as string}
                    onChange={(event) => handlePowerBIInputChange(event.target.value, 'reportId')}
                  />
                </FormItem>
                <FormItem>
                  <StyledInputField
                    value={powerBiInputData?.machineDescription}
                    type="text"
                    placeholder={t('report_name') as string}
                    onChange={(event) =>
                      handlePowerBIInputChange(event.target.value, 'machineDescription')
                    }
                  />
                </FormItem>
                <EditUpdateButton>
                  <RefreshButton>
                    <img src="assets/imgs/icons/trashnew.svg" alt="Icon" />
                  </RefreshButton>
                  <RefreshButton onClick={() => onSaveNewReport()}>
                    <img src="assets/imgs/icons/save.svg" alt="Icon" />
                  </RefreshButton>
                  <RefreshButton onClick={() => resetData()}>
                    <img src="assets/imgs/icons/X.svg" alt="Icon" />
                  </RefreshButton>
                </EditUpdateButton>
              </FormContainer>
            )}
            <AddNewReport onClick={() => setAddNewForm(!addNewForm)}>+ Add New Report</AddNewReport>
            <Footer>
              <FooterButtonContainer>
                <Button
                  variant="default"
                  className="cancelbutton"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={onClickFleetToDashboard} variant="primary" className="pushtofleet">
                  Push To Dashboard
                </Button>
              </FooterButtonContainer>
            </Footer>
          </FormParent>
        ) : (
          <FormParent>
            <FormContainer>
              <FormItem>
                <LabelContainer>
                  <p className="label">
                    {t('workspace_id') as string} <sup>*</sup>
                  </p>
                </LabelContainer>
                <StyledInputField
                  value={powerBiInputData?.workspaceId}
                  type="text"
                  placeholder={t('workspace_id') as string}
                  onChange={(event) => handlePowerBIInputChange(event.target.value, 'workspaceId')}
                />
              </FormItem>
              <FormItem>
                <LabelContainer>
                  <p className="label">
                    {t('report_id') as string} <sup>*</sup>
                  </p>
                </LabelContainer>
                <StyledInputField
                  value={powerBiInputData?.reportId}
                  type="text"
                  placeholder={t('report_id') as string}
                  onChange={(event) => handlePowerBIInputChange(event.target.value, 'reportId')}
                />
              </FormItem>
              <FormItem>
                <LabelContainer>
                  <p className="label">
                    {t('report_name') as string} <sup>*</sup>
                  </p>
                </LabelContainer>
                <StyledInputField
                  value={powerBiInputData?.machineDescription}
                  type="text"
                  placeholder={t('report_name') as string}
                  onChange={(event) =>
                    handlePowerBIInputChange(event.target.value, 'machineDescription')
                  }
                />
              </FormItem>
              <IconsElement>
                {!disabledEdit ? (
                  <EditButton onClick={() => setDisableEdit(true)}>
                    {' '}
                    <img src="assets/imgs/icons/pencil.svg" alt="Icon" />
                  </EditButton>
                ) : (
                  <>
                    {' '}
                    <Tooltip
                      overlayClassName="information-tooltip"
                      placement="top"
                      overlay={<span>Delete</span>}
                    >
                      <RefreshButton
                        onClick={() => {
                          updateStatus ? onDeleteButton() : '';
                        }}
                      >
                        <img src="assets/imgs/icons/trashnew.svg" alt="Icon" />
                      </RefreshButton>
                    </Tooltip>{' '}
                    <Tooltip
                      overlayClassName="information-tooltip"
                      placement="top"
                      overlay={<span>{updateStatus ? 'Update' : 'Save'}</span>}
                    >
                      <RefreshButton
                        onClick={() => {
                          updateStatus ? onUpdateButton() : onSaveButton();
                        }}
                      >
                        <img src="assets/imgs/icons/save.svg" alt="Icon" />
                      </RefreshButton>
                    </Tooltip>{' '}
                    <Tooltip
                      overlayClassName="information-tooltip"
                      placement="top"
                      overlay={<span>Reset</span>}
                    >
                      <RefreshButton onClick={() => resetData()}>
                        <img src="assets/imgs/icons/X.svg" alt="Icon" />
                      </RefreshButton>
                    </Tooltip>{' '}
                  </>
                )}
              </IconsElement>
            </FormContainer>
            <Footer>
              <FooterButtonContainer>
                <Button
                  variant="default"
                  className="cancelbutton"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="pushtofleet" disabled>
                  Push To Dashboard
                </Button>
              </FooterButtonContainer>
            </Footer>
          </FormParent>
        )}
      </Modal>
      <Modal
        visible={successResponse}
        onClose={() => closeSuceessMOdal()}
        size="small_auto_height"
        title="Setup PowerBI"
      >
        <SucessMOdal>
          <RightCircleImage>
            <img src="assets/imgs/right-circle-pbs.svg" alt="Icon" />
            <h3>Your PowerBI Setup was successful!</h3>
          </RightCircleImage>
        </SucessMOdal>
        <SuccessFooter>
          <FooterButtonContainer>
            <Button variant="primary" className="closebutton" onClick={() => closeSuceessMOdal()}>
              Close
            </Button>
          </FooterButtonContainer>
        </SuccessFooter>
      </Modal>
    </>
  );
};

export default MachineManagementPopupcard;
