import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http: HttpClient) {

   }
   API_URL:string = 'http://localhost/api';
   getAllDepartment(): Observable<any>{
     return this._http.get(this.API_URL+'/dept/GetAllDepartment.json');
   }

   getTodoData(){
    return this._http.get(`http://localhost/api/dept/GetAllDepartment.json`)
    
  
   }

}
