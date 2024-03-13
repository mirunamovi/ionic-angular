import { IActivity } from "./activity.model";

export const SAVED_ACTIVITIES: IActivity[] = [
  {
    "id": 1,
    "name": "Curmatura",
    "date": new Date('06/01/2022'),
    "distance": 10.2,
    "comments": "Nice Day",
    "gpxData": '../../assets/gpx/Măgura -_ Moeciu de Jos (0.4km).gpx'
  },
  {
    "id": 2,
    "name": "Predelut",
    "date": new Date('06/01/2023'),
    "distance": 10.2,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/ter pred.gpx'
  },
  {
    "id": 3,
    "name": "Saua Padinii Inchise",
    "date": new Date('12/03/2024'),
    "distance": 10.2,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/Moeciu de Jos (0.1km).gpx'
  }
]