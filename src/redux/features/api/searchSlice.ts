import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState { // `export` ekleyerek dışa aktarılıyor
  searchValue: string;
  isActive: boolean
}

const initialState: SearchState = {
  searchValue: '',
  isActive: true
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
      state.isActive = false;
    },
  },
});

export const { setSearchValue } = searchSlice.actions;
export default searchSlice.reducer;
