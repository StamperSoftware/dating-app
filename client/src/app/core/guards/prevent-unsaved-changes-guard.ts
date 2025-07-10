import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from "../../features/members/profile/profile";

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  
  if (component.editForm?.dirty) {
    return confirm("Unsaved changes will be lost. Do you wish to continue?")
  }
  
  return true;
};
