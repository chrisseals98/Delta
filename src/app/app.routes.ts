import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CitizenTableComponent } from './citizen-table/citizen-table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: "home", redirectTo: "", pathMatch: "full"
    },
    {
        path: "", component: HomeComponent
    },
    {
        path: "citizens", component: CitizenTableComponent
    },
    {
        path: "**", component: PageNotFoundComponent
    }
];
