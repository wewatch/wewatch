import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as _ from "lodash-es";

import type { Activities, Activity } from "@/actions";

const initialState: Activities = [];

const slice = createSlice({
  name: "activities",
  initialState,

  reducers: {
    addActivity(state, action: PayloadAction<Activity>) {
      const activity = action.payload;

      // Need to reverse because activities are sorted
      let activities = _.reverse(state);
      activities.splice(
        _.sortedIndexBy(activities, activity, "timestamp"),
        0,
        activity,
      );
      activities = _.reverse(activities);
      return activities;
    },

    addActivities(state, action: PayloadAction<Activities>) {
      let activities = state.concat(action.payload);
      activities = _.uniqBy(activities, "timestamp");
      activities = _.orderBy(activities, "timestamp", "desc");
      return activities;
    },
  },
});

export const { addActivity, addActivities } = slice.actions;
export default slice.reducer;
