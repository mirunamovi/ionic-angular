import { Injectable } from '@angular/core';
import { SAVED_ACTIVITIES } from '../../shared/activities';
import 'leaflet-omnivore'; 
import {v4 as uuidv4} from 'uuid';
import { IActivity } from '../../shared/activity.model';

declare const omnivore: any;
declare const L: any;

const defaultCoords: number[] = [40, 80];
const defaultZoom: number = 8;



@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;

  constructor() { }

  // getActivity(id: number) {
  //   console.log(id);    
  //   console.log(SAVED_ACTIVITIES.slice(0).find(activity => activity.id == id));
  //   return SAVED_ACTIVITIES.slice(0).find(run => run.id == id);
  // }

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
    this.map = new L.Map('map', {
      center: [43.0, -79.0],
      zoom: 15,
    });
    L.control.fullscreen().addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 800);

    var activity = SAVED_ACTIVITIES.slice(0).find(run => run.id == id);

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
        console.log(activity.gpxData);
    } else {
      console.error(`Activity with ID ${id} not found.`);
    }
  }
}

