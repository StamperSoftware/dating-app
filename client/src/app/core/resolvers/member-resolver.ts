import { ResolveFn } from '@angular/router';
import { inject } from "@angular/core";
import { MemberService } from "../services/member.service";
import { Member } from "../../models";
import { EMPTY } from "rxjs";

export const memberResolver: ResolveFn<Member> = (route, state) => {
  
  const memberService = inject(MemberService);
  const memberId = route.paramMap.get("id");
  
  if (!memberId) return EMPTY;
  
  return memberService.getMember(memberId);
};
