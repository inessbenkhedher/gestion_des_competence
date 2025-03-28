import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';


@Component({
  selector: 'app-admin-layout-custom',
  templateUrl: './admin-layout-custom.component.html',
  styleUrls: ['./admin-layout-custom.component.scss'],

  
})
export class AdminLayoutCustomComponent implements OnInit {
    moduleLoading: boolean;

   constructor(
        public navService: NavigationService,
        public searchService: SearchService,
        private router: Router
      ) { }

       ngOnInit() {
            this.router.events.subscribe(event => {
              if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.moduleLoading = true;
              }
              if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.moduleLoading = false;
              }
            });
          }

}
