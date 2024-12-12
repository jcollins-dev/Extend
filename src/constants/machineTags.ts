import { BaseTagDataType } from 'types/protein';

export const INNER_DRIVE_TORQUE = 'F04_InDrv01_VFD_Trq';
export const OUTER_DRIVE_TORQUE = 'F04_OutDrv01_VFD_Trq';
export const CURRENT_RECIPE = 'ActReciepeString';
/**
 *  Aseptic
 */
export const MINIMUM_CAP_SIZE = 'minimum_cap_size';
export const MAXIMUM_CAP_SIZE = 'maximum_cap_size';
export const DISTANCE_EDGE = 'min_distance_to_edge';
export const DISTANCE_CAPS = 'min_distance_between_caps';
export const SMALL_SIZE_THRESHOLD = 'small_size_threshold';
export const LARGE_SIZE_THRESHOLD = 'large_size_threshold';
export const DISTANCE_EDGE_THRESHOLD = 'distance_edge_threshold';
export const DISTANCE_BETWEEN_THRESHOLD = 'distance_between_threshold';

export const MACHINE_TAG_DATA_TYPES = [
  { id: BaseTagDataType.Float, name: 'Float', value: BaseTagDataType.Float },
  { id: BaseTagDataType.Integer, name: 'Integer', value: BaseTagDataType.Integer },
  { id: BaseTagDataType.Boolean, name: 'Boolean', value: BaseTagDataType.Boolean },
  { id: BaseTagDataType.String, name: 'String', value: BaseTagDataType.String }
];

export const NO_SELECTION = 'No Selection';
