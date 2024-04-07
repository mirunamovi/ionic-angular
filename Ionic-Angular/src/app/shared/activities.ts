import { IActivity } from "./activity.model";

export const SAVED_ACTIVITIES: IActivity[] = [
  {
    "id": 1,
    "name": "Curmatura",
    "date": new Date('06/01/2022'),
    "distance": 10.2,
    "comments": "Nice Day",
    "gpxData": '../../assets/gpx/Curmatura.gpx'
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
  },
  {
    "id": 4,
    "name": "Home",
    "date": new Date('11/03/2024'),
    "distance": 0,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/home.gpx'
  },
  {
    "id": 5,
    "name": "Nagarro",
    "date": new Date('03/11/2024'),
    "distance": 0,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/nagarro.gpx'
  },
  {
    "id": 6,
    "name": "Gutanu",
    "date": new Date('04/01/2024'),
    "distance": 0,
    "comments": "Good Day",
    "gpxData": '../../assets/gpx/gutanu.gpx'
  }
]