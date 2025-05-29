import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  router = inject(Router)

  routes = routes.map( route => ({
    path: route.path,
    title: `${route.title ?? 'Mapas en Angular'}`,
  })).filter( route => route.path !== '**')

  pageTitle$ = this.router.events.pipe(
    filter( event => event instanceof NavigationEnd ),
    map( event => event.url ),
    map( url => this.routes.find(route => `/${route.path}` === url)?.title ?? 'Mapas' )
  )


}
