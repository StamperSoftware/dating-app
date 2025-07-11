import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-footer',
    imports: [
        FaIconComponent
    ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  protected readonly faGithub = faGithub;
  protected readonly faLinkedin = faLinkedin;
}
