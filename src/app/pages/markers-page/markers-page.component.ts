import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import mapboxgl, { LngLatLike, MapMouseEvent } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { v4 as UUIDv4 } from 'uuid'
import { JsonPipe, NgStyle } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string,
  mapboxMarker: mapboxgl.Marker
}

@Component({
  selector: 'app-markers-page',
  imports: [
    JsonPipe,
    NgStyle
  ],
  templateUrl: './markers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarkersPageComponent implements AfterViewInit {

  selectedMarker = signal('')

  divElement = viewChild<ElementRef>('map')
  map = signal<mapboxgl.Map | null>(null)
  markers = signal<Marker[]>([])

  async ngAfterViewInit() {

    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;
    // console.log(element);

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-102.311727, 21.913748], // starting position [lng, lat]
      zoom: 14, // starting zoom

    });

    // const marker = new mapboxgl.Marker({
    //   draggable: false,
    //   color: '#000'
    // })
    //   .setLngLat([-102.311727, 21.913748])
    //   .addTo(map);

    // marker.on('dragend', (event) => console.log(event))
    this.mapListeners(map)

  }

  mapListeners(map: mapboxgl.Map) {

    map.on('click', event => this.mapClick(event))

    this.map.set(map)
  }

  mapClick(event: MapMouseEvent) {

    if (!this.map()) return;

    const map = this.map()!;

    const coordinates = event.lngLat

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: color
    })
      .setLngLat(coordinates)
      .addTo(map)

    const newMarker: Marker = {
      id: UUIDv4(),
      mapboxMarker: marker
    }

    this.markers.update(markers => [newMarker, ...markers])

    // console.log(this.markers())

  }

  flyToMarker(lngLan: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLan
    })

  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    const map = this.map()!;

    marker.mapboxMarker.remove();

    this.markers.update((markers) => markers.filter((m) => m.id !== marker.id))
  }

  darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (
      0x1000000 +
      (Math.max(0, R) << 16) +
      (Math.max(0, G) << 8) +
      Math.max(0, B)
    ).toString(16).slice(1);
  }

}
