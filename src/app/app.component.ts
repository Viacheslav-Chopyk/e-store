import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'electronics-store';
}
