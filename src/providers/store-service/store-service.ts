import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IndividualDto } from './individual-dto';

@Injectable()
export class StoreServiceProvider {

  individual = new BehaviorSubject(new IndividualDto());

  constructor() {
  }

}
