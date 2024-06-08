import { BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
import { registerPlugin } from "@capacitor/core";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

export class LocationTracker {
    private locationArray: any[] = [];
    private watcherId?: string;
    public lat: number = 0;
    public lng: number = 0;
    public alt: number = 0;

    startTracking() {
        if (!this.watcherId) {
            BackgroundGeolocation.addWatcher(
                {
                    backgroundMessage: "Cancel to prevent battery drain.",
                    backgroundTitle: "Tracking You.",
                    requestPermissions: true,
                    stale: false,
                    distanceFilter: 1
                },
                (location, error) => {
                    if (error) {
                        if (error.code === "NOT_AUTHORIZED") {
                            if (window.confirm(
                                "This app needs your location, " +
                                "but does not have permission.\n\n" +
                                "Open settings now?"
                            )) {
                                BackgroundGeolocation.openSettings();
                            }
                        }
                        return console.error(error);
                    }
                    if (location) {
                        this.locationArray.push({
                            lat: location.latitude,
                            lon: location.longitude,
                            alt: location.altitude,
                            time: Date.now(),
                          });
                          console.log(location);
                    }
                }
            ).then(watcherId => {
                this.watcherId = watcherId;
            }).catch(error => {
                console.error("Error starting tracking:", error);
            });
        }
    }

    stopTracking() {
        if (this.watcherId) {
            BackgroundGeolocation.removeWatcher({ id: this.watcherId });
            this.watcherId = undefined;
        }
        const gpx = this.generateGPX(this.getLocationArray());
        return gpx;
    }

    async generateGPX(data: any[]): Promise<string>{
        const gpxStart =
          '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
          '<gpx version="1.1" creator="MapRecorder">\n' +
          '  <rte>\n' ;
        //   `<name>${title}</name>`;
        const gpxEnd = ' </rte>\n' + '</gpx>';
    
        const gpxTrackpoints = data
          .map(
            (point) =>
              `<rtept lat="${point.lat}" lon="${point.lon}"><time>${point.time}</time><ele>${point.alt}</ele></rtept>`
          )
          .join('\n');
    
        return gpxStart + gpxTrackpoints + gpxEnd;
      }
    

    getLocationArray() {
        return this.locationArray;
    }

}