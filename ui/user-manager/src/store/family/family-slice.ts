import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../generated-sources/openapi';

export interface FamilyDetails {
  members: Array<UserData>
}

const familySlice = createSlice({
  name: 'family',
  initialState: ({
    members: [] as UserData[],
  }),
  reducers: {
    setFamilyDetails: (state: FamilyDetails, action: PayloadAction<Array<UserData>>) => {
      state.members = action.payload;
    },
  },
});

export const { setFamilyDetails } = familySlice.actions;

export default familySlice.reducer;
