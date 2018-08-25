/**
 * Implementation of the Mock-Backend
 */

import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { employees } from './employees';
import { uuid } from './uuid';
import { Employee } from '../model/employee';

function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // first, get employess from the local storage or initial data array
    let data: Employee[] = JSON.parse(localStorage.getItem('employees')) || employees;

    console.log('DATA :', data);

    console.log('AM really HAPPY');

    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {

        console.log('connection.request.method :', connection.request.method);
        // wrap in timeout to simulate server api call
        setTimeout(() => {
            // get all employees
            if (connection.request.url.endsWith('/fake-backend/employees') &&
                connection.request.method === RequestMethod.Get) {
                console.log('I am here');
                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: data
                })));

                return;
            }

            // create employee
            if (connection.request.url.endsWith('/fake-backend/employees') &&
                connection.request.method === RequestMethod.Post) {
                let receivedEmployee = JSON.parse(connection.request.getBody());
                let newEmployee = Object.assign(receivedEmployee, { id: uuid.generate() });
                data[data.length] = newEmployee;

                console.log('data in post :', data);

                localStorage.setItem('employees', JSON.stringify(data));

                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: newEmployee
                })));

                return;
            }

            // update employee
            if (connection.request.url.endsWith('/fake-backend/employees') &&
                connection.request.method === RequestMethod.Put) {
                let receivedEmployee = JSON.parse(connection.request.getBody());
                let clonedEmployee = Object.assign({}, receivedEmployee);
                let employeeWasFound = false;
                // data.some((element: Employee, index: number) => {
                //     if (element.id === clonedEmployee.id) {
                //         data[index] = clonedEmployee;
                //         employeeWasFound = true;
                //         console.log('INDEX :', index);
                //         console.log('data in if CONDITION :', data);
                //         return true;
                //     }
                // });
                console.log('clonedEmployee :', clonedEmployee);
                data.forEach((element: any, index: any) => {
                    if (element.id === clonedEmployee.id) {
                        data[index] = clonedEmployee;
                        employeeWasFound = true;
                        console.log('INDEX :', index);
                        console.log('data in if CONDITION :', data);
                    }
                });

                // if(clonedEmployee) {
                //   data.push(clonedEmployee);

                //   console.log('DATA IN IF CONDITION :', data);
                //   return true;
                // }


                if (!employeeWasFound) {
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 400,
                        body: 'Employee could not be updated because was not found'
                    })));
                } else {
                    localStorage.setItem('employees', JSON.stringify(data));

                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                }

                return;
            }

            // delete employee
            if (connection.request.url.match(/\/fake-backend\/employees\/.{36}$/) &&
                connection.request.method === RequestMethod.Delete) {
                let urlParts = connection.request.url.split('/');
                console.log('urlParts :', urlParts);
                let id = urlParts[urlParts.length - 1];
                console.log('id :', id);
                let sizeBeforeDelete = data.length;
                console.log('sizeBeforeDelete :', sizeBeforeDelete);
                data = data.filter((element: Employee) => element.id !== id);

                console.log('DATA IN DELETE :', data);

                console.log('length of data :', data.length);

                if (sizeBeforeDelete === data.length) {
                    console.log('I am in 400');
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 400,
                        body: 'Employee could not be deleted because was not found'
                    })));
                } else {

                    console.log('I am not in 400 !!');
                    localStorage.setItem('employees', JSON.stringify(data));

                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200
                    })));
                }

                return;
            }

            // pass through any requests not handled above
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                    connection.mockRespond(response);
                },
                (error: any) => {
                    connection.mockError(error);
                });
        }, 500);

    });

    return new Http(backend, options);
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};