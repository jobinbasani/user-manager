import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../generated-sources/openapi';

export interface FamilyDetails {
  isLoading: boolean
  members: Array<UserData>
}

const familySlice = createSlice({
  name: 'family',
  initialState: ({
    isLoading: false,
    members: [] as UserData[],
  }),
  reducers: {
    setFamilyDetails: (state: FamilyDetails, action: PayloadAction<Array<UserData>>) => {
      state.isLoading = false;
      state.members = action.payload;
    },
  },
});

export const { setFamilyDetails } = familySlice.actions;

export default familySlice.reducer;
