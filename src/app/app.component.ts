/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { PostsService } from './posts/posts.service';
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <header>
      <mat-toolbar color="primary">
        <a [routerLink]="['/']" class="logotTxt">Student Salary Explorer</a>
        <!-- <a class="links" [routerLink]="['/posts']">Posts</a> -->
      </mat-toolbar>
    </header>
    <router-outlet></router-outlet>
    <footer>
    </footer>
  `,
  providers: [PostsService]
})

export class AppComponent implements OnInit {
  public name = 'Student Salary Explorer';
  public url = 'TBD';

  constructor(
    public appState: AppState
  ) { }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }
}
