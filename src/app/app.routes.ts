import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { ProfileComponent } from './profile';
import { CollegeInfoComponent } from './college_info';
//import { angularProfileCard } from '../../components/main-profile/index';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'posts', loadChildren: './posts#PostsModule' },
  { path: 'profile', component: ProfileComponent },
  { path: 'college_info', component: CollegeInfoComponent },
  { path: '**',    component: NoContentComponent },
];
