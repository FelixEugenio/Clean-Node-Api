export class ServerError extends Error {
    constructor(){
      super('')
      this.name = 'Internal Server Error'
    }
}