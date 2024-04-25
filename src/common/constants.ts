import { SetMetadata } from '@nestjs/common';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
const Grade = {
  'A+': 8,
  A: 7,
  'A-': 6,
  'B+': 5,
  B: 4,
  'B-': 3,
  C: 2,
  D: 1,
  F: 0,
};
export { Grade };
export const ROLE_SERVICE = 'ROLE_SERVICE';
export const PERMISSION_SERVICE = 'PERMISSION_SERVICE';
export const USER_SERVICE = 'USER_SERVICE';
export const BATCH_SERVICE = 'BATCH_SERVICE';
export const DEGREE_SERVICE = 'DEGREE_SERVICE';
export const SEMESTER_SERVICE = 'SEMESTER_SERVICE';
export const STUDENT_SERVICE = 'STUDENT_SERVICE';
export const SUBJECT_SERVICE = 'SUBJECT_SERVICE';
export const ELIGIBILITYCRITERIA_SERVICE = 'ELIGIBILITYCRITERIA_SERVICE';
export const ELIGIBILITYCRITERIASUBJECT_SERVICE =
  'ELIGIBILITYCRITERIASUBJECT_SERVICE';
export const STUDENT_REGISTRATION_SERVICE = 'STUDENT_REGISTRATION_SERVICE';
export const CITY_SERVICE = 'CITY_SERVICE';
export const PHASE_SERVICE = 'PHASE_SERVICE';
export const PHASE_HISTORIES_SERVICE = 'PHASE_HISTORIES_SERVICE';
export const GRADE_SERVICE = 'GRADE_SERVICE';
export const EMAILTEMPALTE_SERVICE = 'EMAILTEMPLATE_SERVICE';

export const ROLES_KEY = 'roles';
export const ROLES = (roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const jwtConstants = {
  secret: 'PAK1STAN1947',
};

export const MAX_ACTIVE_BATCH = 2;
export const MAX_ACTIVE_SEMESTER = 1;

export const saltOrRounds = 10;
