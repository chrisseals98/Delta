import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute, Router } from '@angular/router';
import { DirectoryService } from '../shared/directory-service';
import { Citizen } from '../shared/citizen';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-citizen-info',
  standalone: true,
  imports: [ MatCardModule, MatListModule, MatButtonModule, MatProgressBarModule ],
  templateUrl: './citizen-info.component.html',
  styleUrl: './citizen-info.component.css'
})
export class CitizenInfoComponent {
  citizen!: Citizen;

  constructor(private route: ActivatedRoute, private directoryService: DirectoryService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.directoryService.getCitizen(params['id']).subscribe(citizen => this.citizen = citizen);
    });
  }

  goBack() {
    this.router.navigate(["citizens"], {
      fragment: this.citizen.id.toString()
    })
  }

  getDate(epoch: string) {
    return new Date(epoch);
  }
}
