import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  homeSideNavTextClass: string = "side-menu-item";

  homeSideNavIconClass: string = "side-menu-item";

  settingsSideNavTextClass: string = "side-menu-item";

  settingsSideNavIconClass: string = "side-menu-item";

  INACTIVE_MENU_CLASS = "side-menu-item";
  ACTIVE_MENU_CLASS = "side-menu-item-active";


  /**
   * change the class of the menu element passed depending on it's active state
   * 
   * @param  {"home"|""} element the nav element to change
   * @param  {boolean} active whether the element is active or not
   */
  changeClassesBasedOnActiveFlag(element: "home" | "settings", active: boolean){
    switch (element){
      case "home": {
        this.homeSideNavIconClass = active ? this.ACTIVE_MENU_CLASS : this.INACTIVE_MENU_CLASS;
        this.homeSideNavTextClass = active ? this.ACTIVE_MENU_CLASS : this.INACTIVE_MENU_CLASS;
        break;
      }
      case "settings" :{
        this.settingsSideNavIconClass = active ? this.ACTIVE_MENU_CLASS : this.INACTIVE_MENU_CLASS;
        this.settingsSideNavTextClass = active ? this.ACTIVE_MENU_CLASS : this.INACTIVE_MENU_CLASS;
        break;
      }
    }
  }


}
