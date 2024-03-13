import {HttRequest,HttpResponse} from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { MissingParamError } from '../errors/missing-params-errors'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller{
    handle(httpRequest:HttRequest):HttpResponse{

        if(!httpRequest.body.name){
            return badRequest(new MissingParamError('name'))
        }

        if(!httpRequest.body.email){
            return badRequest(new MissingParamError('email'))
        }

        const requiredFields = ['name','email','password','passwordConfirmation']

        for(const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
    }
}
