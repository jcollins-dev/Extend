import { useGetPlantsQuery } from 'api';
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject
} from 'react';
import { isEqual } from 'lodash';
import { NavFlyoutType } from 'types';
import { default as theme } from 'themes';
import { NAV_ITEMS_TO_ID } from 'constants/nav';

export enum FleetNavigationEntityType {
  ORG = 'org',
  PLANT = 'plant',
  LINE = 'line',
  MACHINE = 'machine'
}

export type EntityType = {
  type: FleetNavigationEntityType;
  id: string;
};

export type EntityLinksType = {
  [FleetNavigationEntityType.ORG]?: string | null;
  [FleetNavigationEntityType.PLANT]?: string | null;
  [FleetNavigationEntityType.LINE]?: string | null;
  [FleetNavigationEntityType.MACHINE]?: string | null;
};

export type FlyoutHighlight = {
  type?: NavFlyoutType;
  iconColor?: string;
  fontColor?: string;
  [NavFlyoutType.Fleet]?: string | null;
  [NavFlyoutType.Maintenance]?: string | null;
  [NavFlyoutType.Parts]?: string | null;
  [FleetNavigationEntityType.ORG]?: string | null;
  [FleetNavigationEntityType.PLANT]?: string | null;
  [FleetNavigationEntityType.LINE]?: string | null;
  [FleetNavigationEntityType.MACHINE]?: string | null;
};

type ContextType = {
  navId: number | undefined;
  entity: EntityType | undefined;
  entityLinks: EntityLinksType;
  showFlyout: boolean;
  setNavId: (navId: number | undefined) => void;
  updateNavIdIfNeeded: (navId: number | undefined) => void;
  setEntity: (entity: EntityType) => void;
  updateEntityIfNeeded: (entity: EntityType) => void;
  setEntityLinks: (links: EntityLinksType) => void;
  setShowFlyout: (show: boolean) => void;
  getEntityPath: (etype: FleetNavigationEntityType, eid: string) => EntityLinksType;
  getCurrentEntityPath: () => EntityLinksType;
  getFlyoutHighlight: () => FlyoutHighlight;
  entityPath: EntityLinksType;
  navFlyoutType: NavFlyoutType | undefined;
  setNavFlyoutType: (flyoutType: NavFlyoutType | undefined) => void;
  scrollRef: RefObject<HTMLDivElement> | undefined;
  setScrollRef: (scrollRef: RefObject<HTMLDivElement>) => void;
};

const defaultValue = {
  navId: undefined,
  entity: undefined,
  entityLinks: {},
  showFlyout: false,
  setNavId: () => undefined,
  updateNavIdIfNeeded: () => undefined,
  setEntity: () => undefined,
  updateEntityIfNeeded: () => undefined,
  setEntityLinks: () => undefined,
  setShowFlyout: () => undefined,
  getEntityPath: () => ({}),
  getCurrentEntityPath: () => ({}),
  getFlyoutHighlight: () => ({}),
  entityPath: {},
  navFlyoutType: undefined,
  setNavFlyoutType: () => undefined,
  scrollRef: undefined,
  setScrollRef: () => undefined
};

export const FleetNavigationContext = createContext<ContextType>(defaultValue);

export const useFleetNavigation = (): ContextType => useContext(FleetNavigationContext);

const ORG_ID_PROPERTY =
  process.env.REACT_APP_SIDENAV_ENABLE_ORG_LEVEL === 'true' ? 'orgId' : 'name';

type Props = {
  children: ReactNode;
};

export const FleetNavigationProvider = (props: Props): JSX.Element => {
  const [navId, setNavId] = useState<number | undefined>();
  const [entity, setEntity] = useState<EntityType>();
  const [entityLinks, setEntityLinks] = useState<EntityLinksType>({});
  const [showFlyout, setShowFlyout] = useState<boolean>(false);
  const [navFlyoutType, setNavFlyoutType] = useState<NavFlyoutType | undefined>();
  const [scrollRef, setScrollRef] = useState<RefObject<HTMLDivElement> | undefined>();

  const { data: plants } = useGetPlantsQuery();

  const organizationsByPlant = useRef<{ [pid: string]: string }>({});
  const plantsByLine = useRef<{ [lid: string]: string }>({});
  const linesByMachine = useRef<{ [mid: string]: string }>({});
  const plantsByMachine = useRef<{ [mid: string]: string }>({});
  const [entityPath, setEntityPath] = useState<EntityLinksType>({});

  const NAV_ID_TO_FLYOUT_TYPE = {
    [NAV_ITEMS_TO_ID.fleet]: NavFlyoutType.Fleet,
    [NAV_ITEMS_TO_ID.maintenance]: NavFlyoutType.Maintenance,
    [NAV_ITEMS_TO_ID.parts]: NavFlyoutType.Parts
  };

  const getCurrentEntityPath = useCallback(
    (): EntityLinksType => (entity ? getEntityPath(entity.type, entity.id) : {}),
    [entity]
  );

  useEffect(() => {
    if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
      organizationsByPlant.current = {};
      plantsByLine.current = {};
      linesByMachine.current = {};
      plantsByMachine.current = {};

      if (plants) {
        plants.forEach((p) => {
          organizationsByPlant.current[p.id] = p[ORG_ID_PROPERTY];
          p.machines.map((m) => {
            if (m.lineId) {
              linesByMachine.current[m.id] = m.lineId;
              plantsByLine.current[m.lineId] = p.id;
            } else {
              plantsByMachine.current[m.id] = p.id;
            }
          });
        });
      }
      setEntityPath(getCurrentEntityPath());
    }
  }, [getCurrentEntityPath, plants]);

  const getFlyoutHighlight = (): FlyoutHighlight => {
    const fh: FlyoutHighlight = {};
    fh.type = navFlyoutType;
    fh.fontColor = theme.colors.text.darkgray;
    fh.iconColor = theme.colors.icons.sidenav.fill;
    switch (navFlyoutType) {
      case NavFlyoutType.Fleet:
        fh[NavFlyoutType.Fleet] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.PLANT] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.MACHINE] = theme.colors.navFlyoutColors.lightBlue;
        fh.fontColor = theme.colors.text.white;
        fh.iconColor = theme.colors.text.white;
        break;
      case NavFlyoutType.Maintenance:
        fh[NavFlyoutType.Maintenance] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.PLANT] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.MACHINE] = theme.colors.navFlyoutColors.lightBlue;
        fh.fontColor = theme.colors.text.white;
        fh.iconColor = theme.colors.text.white;
        break;
      case NavFlyoutType.Parts:
        fh[NavFlyoutType.Parts] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.PLANT] = theme.colors.navFlyoutColors.primaryBlue;
        fh[FleetNavigationEntityType.MACHINE] = theme.colors.navFlyoutColors.lightBlue;
        fh.fontColor = theme.colors.text.white;
        fh.iconColor = theme.colors.text.white;
        break;
      default:
        break;
    }
    return fh;
  };

  const getEntityPath = (etype: FleetNavigationEntityType, eid: string): EntityLinksType => {
    const rv: EntityLinksType = {};
    let machineId = undefined,
      lineId = undefined,
      plantId = undefined,
      orgId = undefined;
    if (etype === FleetNavigationEntityType.MACHINE) {
      machineId = eid;
    }
    if (machineId) {
      rv[FleetNavigationEntityType.MACHINE] = machineId;
      lineId = linesByMachine.current[eid];
      if (!lineId) {
        plantId = plantsByMachine.current[eid];
      }
    } else if (etype === FleetNavigationEntityType.LINE) {
      lineId = eid;
    }
    if (lineId) {
      rv[FleetNavigationEntityType.LINE] = lineId;
      plantId = plantsByLine.current[lineId];
    } else if (etype === FleetNavigationEntityType.PLANT) {
      plantId = eid;
    }
    if (plantId) {
      rv[FleetNavigationEntityType.PLANT] = plantId;
      orgId = organizationsByPlant.current[plantId];
    } else if (etype === FleetNavigationEntityType.ORG) {
      orgId = eid;
    }
    if (orgId) {
      rv[FleetNavigationEntityType.ORG] = orgId;
    }
    return rv;
  };

  useEffect(() => {
    if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
      setEntityPath(getCurrentEntityPath());
    }
  }, [entity, getCurrentEntityPath]);

  const updateNavIdIfNeeded = (newNavId: number | undefined) => {
    if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2 && newNavId !== navId) {
      setNavId(newNavId);
      const nftype = newNavId ? NAV_ID_TO_FLYOUT_TYPE[newNavId] : undefined;
      setNavFlyoutType(nftype);
    }
  };

  const updateEntityIfNeeded = (newEntity: EntityType) => {
    if (
      parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2 &&
      !isEqual(newEntity, entity)
    ) {
      setEntity(newEntity);
    }
  };

  return (
    <FleetNavigationContext.Provider
      value={{
        entity,
        setEntity,
        updateEntityIfNeeded,
        entityLinks,
        setEntityLinks,
        navId,
        setNavId,
        updateNavIdIfNeeded,
        showFlyout,
        setShowFlyout,
        getEntityPath,
        getCurrentEntityPath,
        getFlyoutHighlight,
        entityPath,
        navFlyoutType,
        setNavFlyoutType,
        scrollRef,
        setScrollRef
      }}
    >
      {props.children}
    </FleetNavigationContext.Provider>
  );
};
