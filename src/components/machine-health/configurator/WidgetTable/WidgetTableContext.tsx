import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

interface WidgetTableContextProps {
  isModalOpenById: string | null;
  localTableNames: {
    id: string;
    name: string;
  }[];
  localTableActive: {
    id: string;
    active: boolean;
  }[];
  localTableRows: WidgetTableDataItem[];
  modalTitle: string;
  modalType: WidgetType;
  setIsModalOpenById: Dispatch<SetStateAction<string | null>>;
  setLocalTableNames: Dispatch<
    SetStateAction<
      {
        id: string;
        name: string;
      }[]
    >
  >;
  setLocalTableActive: Dispatch<SetStateAction<{ id: string; active: boolean }[]>>;
  setLocalTableRows: Dispatch<SetStateAction<WidgetTableDataItem[]>>;
  setModalTitle: Dispatch<SetStateAction<string>>;
  setModalType: Dispatch<SetStateAction<WidgetType>>;
  setTagGroupParentId: Dispatch<SetStateAction<string | undefined>>;
  tagGroupParentId: string | undefined;
}

const WidgetTableContext = createContext<WidgetTableContextProps>({
  isModalOpenById: null,
  localTableActive: [],
  localTableNames: [],
  localTableRows: [],
  modalTitle: '',
  modalType: WidgetType.None,
  setIsModalOpenById: () => undefined,
  setLocalTableActive: () => undefined,
  setLocalTableNames: () => undefined,
  setLocalTableRows: () => undefined,
  setModalTitle: () => undefined,
  setModalType: () => undefined,
  setTagGroupParentId: () => undefined,
  tagGroupParentId: undefined
});

interface ProviderProps {
  children?: React.ReactNode;
}

export const WidgetTableProvider: React.FC = ({ children }: ProviderProps) => {
  const [isModalOpenById, setIsModalOpenById] = useState<string | null>(null);
  const [localTableActive, setLocalTableActive] = useState<{ id: string; active: boolean }[]>([]);
  const [localTableRows, setLocalTableRows] = useState<WidgetTableDataItem[]>([]);
  const [localTableNames, setLocalTableNames] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<WidgetType>(WidgetType.None);
  const [tagGroupParentId, setTagGroupParentId] = useState<string | undefined>();

  return (
    <WidgetTableContext.Provider
      value={{
        isModalOpenById,
        localTableActive,
        localTableNames,
        localTableRows,
        modalTitle,
        modalType,
        setIsModalOpenById,
        setLocalTableActive,
        setLocalTableNames,
        setLocalTableRows,
        setModalTitle,
        setModalType,
        setTagGroupParentId,
        tagGroupParentId
      }}
    >
      {children}
    </WidgetTableContext.Provider>
  );
};

export const useWidgetTableContext = (): WidgetTableContextProps => useContext(WidgetTableContext);
