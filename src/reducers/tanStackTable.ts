import { createSlice } from '@reduxjs/toolkit';

export interface tanStackTableFilterOption {
  label: string;
  value: string;
}
export const filterSlice = createSlice({
  name: 'filterData',
  initialState: [] as tanStackTableFilterOption[],
  reducers: {
    addFilterOptions: (state, action) => {
      return (state = [...action.payload]);
    }
  }
});

export default filterSlice.reducer;
