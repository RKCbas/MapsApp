import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;

/**
 * width: 100%
 * height: 260px
 *
 */

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniMapComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('miniMap')
  miniMap = signal<mapboxgl.Map | null>(null)

  lngLat = input.required<LngLatLike>();
  zoom = input<number>(14);

  async ngAfterViewInit() {

    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;
    // console.log(element);

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false, // Disable interaction
      pitch: 30, // Set pitch for 3D effect
      bearing: 0, // Set bearing to 0 for north orientation
    });

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#000'
    })
      .setLngLat(this.lngLat())
      .addTo(map);

    this.mapListeners(map)

  }

  mapListeners(map: mapboxgl.Map) {

    this.miniMap.set(map)
  }
}
