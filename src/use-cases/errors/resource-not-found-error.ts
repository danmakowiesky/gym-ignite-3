export class ResourceNotFoundError extends Error {
  constructor(){
    super('Invlaid credentials');
  }
}