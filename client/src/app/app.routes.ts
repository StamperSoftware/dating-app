import { Routes } from '@angular/router';
import { Home } from "./features/home/home";
import { MemberList } from "./features/members/list/list";
import { MemberDetail } from "./features/members/detail/detail";
import { Messages } from "./features/messages/messages";
import { Matches } from "./features/matches/matches";
import { authGuard } from "./core/guards/auth-guard";

export const routes: Routes = [
    {path:"", component:Home},
    {path:"", 
        runGuardsAndResolvers:"always",
        canActivate:[authGuard],
        children:[
            {path:"members", component:MemberList},
            {path:"member/:id", component:MemberDetail},
            {path:"matches", component:Matches, canActivate:[authGuard]},
            {path:"messages", component:Messages},
        ]
    },
    {path:"**", component:Home},
];
