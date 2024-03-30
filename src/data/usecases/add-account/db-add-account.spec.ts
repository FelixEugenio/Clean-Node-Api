import { AccountModel, AddAccountModel, Encrypter } from "./db-account-protocols"
import { DbAddAccount } from "./db-add-account"
import { AddAccountRepository } from "./db-account-protocols"

interface SutTypes {
    sut: DbAddAccount
    encrypterStub:Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository{
        async add ( accountData: AddAccountModel): Promise<AccountModel>{
            const fakeaccount = {
                id:'valid_id',
                name:'valid_name',
                email:'valid_email@mail.com',
                password:'hashed_password'
            }
            return new Promise(resolve => resolve(fakeaccount))
        }
    }
    return new AddAccountRepositoryStub()
}


const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt ( value: string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): SutTypes =>{
      const encrypterStub = makeEncrypter()
      const addAccountRepositoryStub = makeAddAccountRepository()
      const sut = new DbAddAccount(encrypterStub,addAccountRepositoryStub)
      return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
      }
}

describe('DbAddAccount Usecase',()=>{
    test('Should Call Encrypter with correct password',async()=>{
        const {encrypterStub,sut} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
        const accountData = {
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'valid_password'
        }
       await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    // retornando uma excessao
    test('Should throw  if  Encrypter throws',async()=>{
        const {encrypterStub,sut} = makeSut()
       jest.spyOn(encrypterStub,'encrypt').mockReturnValueOnce(new Promise((resolve,reject)=> reject(new Error())))
        const accountData = {
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'valid_password'
        }
       const promise =  sut.add(accountData)
        expect(promise).rejects.toThrow()
    })

    test('Should Call AddAccountRepoository with correct values ',async()=>{
        const {addAccountRepositoryStub,sut} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub,'add')
        const accountData = {
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'valid_password'
        }
       await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'hashed_password'
        })
    })

    test('Should return an Account on sucess',async()=>{
        const {sut} = makeSut()
       
        const accountData = {
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'valid_password'
        }
     const account =   await sut.add(accountData)
        expect(account).toEqual({
            id:'valid_id',
            name:'valid_name',
            email:'valid_email@mail.com',
            password:'hashed_password'
        })
    })

})