import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    selectedItem: IMenuItem;
    
    constructor() {
    }

    defaultMenu: IMenuItem[] = [
        {
            name: 'Grille de Polyvalence',
            type: 'dropDown',
            icon: 'i-Bar-Chart',
            sub: [
                {
                    name: 'Grille',
                    state: '/service-evaluation/matrice',
                    type: 'link',
                    icon: 'i-Checked-User',
                },
               
            ]
        },
        {
            name: 'Service Compétence',
            description: 'Gestion des compétences et des employés',
            type: 'dropDown',
            icon: 'i-Library',
            sub: [
                {
                    name: 'Famille',
                    state: '/service-competence/familles',
                    type: 'link',
                    icon: 'i-Folder',
                },
              

                {
                    name: 'Catégories',
                    state: '/service-competence/indicateurs',
                    type: 'link',
                    icon: 'i-File-Horizontal-Text',
                },
                {
                    name: 'Competences',
                    state: '/service-competence/competences',
                    type: 'link',
                    icon: 'i-Data-Settings',
                }
            ]
        },
        {
            name: 'Service Employé',
            description: 'Gestion des employés et des postes',
            type: 'dropDown',
            icon: 'i-Administrator',
            sub: [
                {
                    name: 'Employés',
                    state: '/service-employee/employees',
                    type: 'link',
                    icon: 'i-Checked-User',
                },
                {
                    name: 'Post Competences',
                    state: '/service-evaluation/postCompetence',
                    type: 'link',
                    icon: 'i-Data-Settings',
                }
               
            ]
        }
    ];

    // sets iconMenu as default;
    menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
    // navigation component has subscribed to this Observable
    menuItems$ = this.menuItems.asObservable();

    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(menuType: string) {
    //   switch (userType) {
    //     case 'admin':
    //       this.menuItems.next(this.adminMenu);
    //       break;
    //     case 'user':
    //       this.menuItems.next(this.userMenu);
    //       break;
    //     default:
    //       this.menuItems.next(this.defaultMenu);
    //   }
    // }
}
