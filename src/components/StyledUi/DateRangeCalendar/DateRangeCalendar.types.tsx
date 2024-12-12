// Helpers
import { DateRange } from 'helpers';

export interface Props {
  title?: string;
  /** The only parts of 'range' dates that are taken into account are year, month, day */
  range?: DateRange;
  /** The only parts of 'range' dates that are meaningful are year, month, day. For an
   * accurate datetime, time zones should be applied.
   */
  handleUpdate: (range: DateRange) => void;
  handleCancel: () => void;
  maxDate?: Date;
  minDate?: Date;
  /** number of days to select from
   *  example: [1, 2, 3, 5, 7] days
   */
  dayRanges?: number[];
  headline?: string;
}
