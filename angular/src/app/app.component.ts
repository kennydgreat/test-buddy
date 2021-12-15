import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  homeSideNavTextClass: string = ""

  homeSideNavIconClass: string = ""


  changeClassesBasedOnActiveFlag(element: "home" | "", active: boolean){
    switch (element){
      case "home": {
        if(active){
          this.homeSideNavIconClass = "side-menu-item-active md-24";
          this.homeSideNavTextClass = "side-menu-item-active";
        }else{
          this.homeSideNavIconClass = "side-menu-item md-24";
          this.homeSideNavTextClass = "side-menu-item";
        }
      }
    }
  }

  homeNavMenuItemOnActiveChange(active: boolean){
    this.changeClassesBasedOnActiveFlag("home", active);
  }

}
