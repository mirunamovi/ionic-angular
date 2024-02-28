import { IActivity } from "./activity.model";

export const SAVED_ACTIVITIES: IActivity[] = [
  {
    "id": 1,
    "name": "Curmatura",
    "date": new Date('06/01/2022'),
    "distance": 10.2,
    "comments": "Nice Day",
    "gpxData": '../../assets/gpx/oli2.gpx'
  },
  {
    "id": 2,
    "name": "Grind",
    "date": new Date('06/01/2023'),
    "distance": 10.2,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/ter pred.gpx'
  }
]