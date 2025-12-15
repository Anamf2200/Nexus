
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles_Key } from 'src/roles/role-decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(Roles_Key,[
        context.getHandler(),
        context.getClass()
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if(!user) throw new NotFoundException("User not found")

const rolerequred= roles.includes(user.role)
if(!rolerequred) throw new ForbiddenException("Access denied")
    return true

    }
}
