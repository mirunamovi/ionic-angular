import { Injectable } from '@angular/core';
import { SAVED_ACTIVITIES } from '../shared/activities';
import 'leaflet-omnivore'; 
import {v4 as uuidv4} from 'uuid';
import { IActivity } from '../shared/activity.model';

declare const omnivore: any;
declare const L: any;

const defaultCoords: number[] = [40, 80];
const defaultZoom: number = 8;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getActivity(id: number) {
    return SAVED_ACTIVITIES.slice(0).find(run => run.id);
  }

  // getMap(){
  //   var map = L.map('map').setView(defaultCoords, defaultZoom);

  //   map.maxZoom = 200;

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  //     maxZoom: 18
  //   }).addTo(map);
  // }

  plotActivity(id: number) {
    let myStyle = {
      "color": "#8209d9",
      "weight": 5,
      "opacity": 0.95
    };

    let map = L.map('map').setView(defaultCoords, defaultZoom);

    map.maxZoom = 200;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    var activity = SAVED_ACTIVITIES.slice(0).find(run => run.id);

    if (activity) {
      var customLayer = L.geoJson(null, {
        pointToLayer: function () {
          return null; 
        },
        style: myStyle
      });

      var gpxLayer = omnivore.gpx(activity.gpxData, null, customLayer)
        .on('ready', function () {
          map.fitBounds(gpxLayer.getBounds());
        }).addTo(map);
    } else {
      console.error(`Activity with ID ${id} not found.`);
    }
  }

  createTrack(fileName: string) {
    const gpxData = `../../assets/gpx/${fileName}.gpx`; // Assuming the GPX file is stored in the assets/gpx folder
    
    const track: IActivity = {
      id: uuidv4(),
      name: fileName,
      date: new Date('12/03/2024'),
      gpxData: gpxData // Store the path to the GPX file in the gpxData property
    };

    SAVED_ACTIVITIES.push(track); // Push the track into the SAVED_ACTIVITIES array
  }
}

