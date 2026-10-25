import { provideNzIcons } from 'ng-zorro-antd/icon';
import { APP_ICONS } from './app/icons';

// Added to every unit test's TestBed (see "providersFile" in angular.json).
export default [provideNzIcons(APP_ICONS)];
