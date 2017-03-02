import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Injectable()
export class PollsService {

  constructor() { }

  createOption() {
    return new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9]{1}[a-z-A-Z0-9 ]*$/)
    ]); 
  }

  hasDuplicateEntries(options) {
    let optionsGrouped = this.groupOptions(options);
    let hasDoubleEntries = this.checkForDuplicateOptions(optionsGrouped);
    return hasDoubleEntries
  }

  groupOptions(options) {
    let optionsGrouped = {};
    for (let i = 0; i < options.value.length; i++) {
      let item = options.value[i];
      if (item !== null && item !== '') {
        item = item.toLowerCase();
        if (optionsGrouped[item]) {
          optionsGrouped[item]++;
        }
        else {
          optionsGrouped[item] = 1;
        }
      }
    }
    return optionsGrouped;
  }

  checkForDuplicateOptions(optionsGrouped) {
    let hasDoubleEntries = false;
    for (let item in optionsGrouped) {
      if (optionsGrouped[item] > 1) {
        return hasDoubleEntries = true;
      }
    }
    return hasDoubleEntries;
  }

  setupBackendUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':3000';
    }
    else {
      return window.location.origin; 
    }
  }

}