import { Injectable } from '@angular/core';
import { IActivity } from '../../shared/activity.model';
import { SAVED_ACTIVITIES } from '../../shared/activities';

@Injectable()
export class ActivityService {

  constructor() { }

  // getRuns():

  getActivities(): IActivity[] {
    return SAVED_ACTIVITIES.slice(0);
  }

  getTotalActivities(allActivities: IActivity[] | undefined): number {
    return allActivities ? allActivities.length : 0;
  }

  getTotalDistance(allActivities: IActivity[] | undefined): number {
    if (allActivities) {
      return allActivities.reduce((total, activity) => {
        // Check if activity.distance is defined before adding it to total
        const distance = activity.distance !== undefined ? activity.distance : 0;
        return total + distance;
      }, 0);
    } else {
      return 0;
    }
  }

  getFirstDate(allActivities: IActivity[] | undefined): Date {
    if (allActivities && allActivities.length > 0) {
      return allActivities.reduce((earliestDate, activity) => activity.date < earliestDate ? activity.date : earliestDate, allActivities[0].date);
    } else {
      return new Date();
    }
  }
}
