/**
 * <div *ngFor="let item of PAYMENT_ITEMS | filterBy: {STATUS:true}"> </div>
 **/
import { Pipe, Injectable } from '@angular/core';

@Pipe({
  name: 'filterBy',
  pure: false
})

@Injectable()
export class FilterPipe {

  private filterByString(filter) {
    if (filter) {
      filter = filter.toLowerCase();
    }
    return value => {
      return !filter || (value ? ('' + value).toLowerCase().indexOf(filter) !== -1 : false);
    }
  }

  private filterByBoolean(filter) {
    return value => {
      return Boolean(value) === filter;
    }
  }

  private filterByObject(filter) {
    return value => {
      for (let key in filter) {

        if (key === '$or') {
          if (!this.filterByOr(filter.$or)(this.getValue(value))) {
            return false;
          }
          continue;
        }

        let walker = value;
        let found = false;
        do {
          if (walker.hasOwnProperty(key) || Object.getOwnPropertyDescriptor(walker, key)) {
            found = true;
            break;
          }
        } while (walker = Object.getPrototypeOf(walker));

        if (!found) {
          return false;
        }

        let val = this.getValue(value[key]);
        const filterType = typeof filter[key];
        let isMatching;

        if (filterType === 'boolean') {
          isMatching = this.filterByBoolean(filter[key])(val);
        } else if (filterType === 'string') {
          isMatching = this.filterByString(filter[key])(val);
        } else if (filterType === 'object') {
          isMatching = this.filterByObject(filter[key])(val);
        } else {
          isMatching = this.filterDefault(filter[key])(val);
        }

        if (!isMatching) {
          return false;
        }
      }

      return true;
    }
  }

  /**
   * Filter value by $or
   *
   * @param filter
   * @returns {(value:any)=>boolean}
   */
  private filterByOr(filter: any[]) {
    return (value: any) => {
      let hasMatch = false;
      const length = filter.length;

      const arrayComparison = (i) => {
        return value.indexOf(filter[i]) !== -1;
      };
      const otherComparison = (i) => {
        return value === filter[i];
      };
      const comparison = Array.isArray(value) ? arrayComparison : otherComparison;

      for (let i = 0; i < length; i++) {
        if (comparison(i)) {
          hasMatch = true;
          break;
        }
      }

      return hasMatch;
    };
  }

  /**
   * Checks function's value if type is function otherwise same value
   * @param value
   * @returns {any}
   */
  private getValue(value: any) {
    return typeof value === 'function' ? value() : value;
  }

  /**
   * Defatul filterDefault function
   *
   * @param filter
   * @returns {(value:any)=>boolean}
   */
  private filterDefault(filter) {
    return value => {
      return filter === undefined || filter == value;
    }
  }

  private isNumber(value) {
    return !isNaN(parseInt(value, 10)) && isFinite(value);
  }

  transform(array: any[], filter: any): any {
    const type = typeof filter;

    if (!array) {
      return array;
    }

    if (type === 'boolean') {
      return array.filter(this.filterByBoolean(filter));
    }

    if (type === 'string') {
      if (this.isNumber(filter)) {
        return array.filter(this.filterDefault(filter));
      }

      return array.filter(this.filterByString(filter));
    }

    if (type === 'object') {
      return array.filter(this.filterByObject(filter));
    }

    if (type === 'function') {
      return array.filter(filter);
    }

    return array.filter(this.filterDefault(filter));
  }
}
