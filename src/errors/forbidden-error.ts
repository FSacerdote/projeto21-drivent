import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
  return {
    name: 'Forbidden',
    message: 'This action violates a business rule',
  };
}
