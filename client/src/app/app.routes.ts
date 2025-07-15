import { Routes } from '@angular/router';
import { Home } from "./features/home/home";
import { MemberList } from "./features/members/list/list";
import { MemberDetail } from "./features/members/detail/detail";
import { Messages } from "./features/messages/messages";
import { Matches } from "./features/matches/matches";
import { authGuard } from "./core/guards/auth-guard";
import { TestErrors } from "./features/errors/test-errors/test-errors";
import { NotFound } from "./ui/not-found/not-found";
import { ServerError } from "./ui/server-error/server-error";
import { MemberProfile } from "./features/members/detail/profile/profile";
import { MemberPhotos } from "./features/members/detail/photos/photos";
import { MemberMessages } from "./features/members/detail/messages/messages";
import { memberResolver } from "./core/resolvers/member-resolver";
import { preventUnsavedChangesGuard } from "./core/guards/prevent-unsaved-changes-guard";
import { Admin } from "./features/admin/admin";
import { adminGuard } from "./core/guards/admin-guard";

export const routes: Routes = [
    {path:"", component:Home},
    {path:"errors", component:TestErrors},
    {path:"server-error", component:ServerError},
    {path:"not-found", component:NotFound},
    {path:"", 
        runGuardsAndResolvers:"always",
        canActivate:[authGuard],
        children:[
            {path:"members", component:MemberList},
            {
                path:"members/:id", 
                resolve:{member:memberResolver},
                runGuardsAndResolvers:"always",
                component:MemberDetail,
                children:[
                    {path:"", redirectTo:'profile', pathMatch:"full"},    
                    {path:"profile", component:MemberProfile, pathMatch:"full", title:"Profile", canDeactivate:[preventUnsavedChangesGuard]},    
                    {path:"photos", component:MemberPhotos, pathMatch:"full", title:"Photos"},    
                    {path:"messages", component:MemberMessages, pathMatch:"full", title:"Messages"},    
                ]               
            },
            {path:"matches", component:Matches},
            {path:"messages", component:Messages},
            {path:"admin", component:Admin, canActivate:[adminGuard]}
        ]
    },
    {path:"**", component:NotFound},
];
