import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map')
  map = signal<mapboxgl.Map | null>(null)

  async ngAfterViewInit() {

    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;
    console.log(element);

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-102.311727, 21.913748], // starting position [lng, lat]
      zoom: 14, // starting zoom

    });

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#000'
    })
      .setLngLat([-102.311727, 21.913748])
      .addTo(map);

    marker.on('dragend', (event) => console.log(event))


    this.mapListeners(map)

  }

  mapListeners(map: mapboxgl.Map){


  }

}
