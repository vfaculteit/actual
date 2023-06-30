import { integerToAmount, amountToInteger, currencyToAmount } from './util';

// For now, this info is duplicated from the backend. Figure out how
// to share it later.
export const TYPE_INFO = {
  date: {
    ops: ['is', 'isapprox', 'gt', 'gte', 'lt', 'lte'],
    nullable: false,
  },
  id: {
    ops: ['is', 'contains', 'oneOf'],
    nullable: true,
  },
  string: {
    ops: ['is', 'contains', 'oneOf'],
    nullable: false,
  },
  number: {
    ops: ['is', 'isapprox', 'isbetween', 'gt', 'gte', 'lt', 'lte'],
    nullable: false,
  },
  boolean: {
    ops: ['is'],
    nullable: false,
  },
};

export type FieldTypes = {
  imported_payee: string;
  payee: string;
  date: string;
  notes: string;
  amount: number;
  amountInflow: number;
  amountOutfow: number;
  category: string;
  account: string;
  cleared: boolean;
};

export const FIELD_TYPES = new Map(
  Object.entries({
    imported_payee: 'string',
    payee: 'id',
    date: 'date',
    notes: 'string',
    amount: 'number',
    amountInflow: 'number',
    amountOutfow: 'number',
    category: 'id',
    account: 'id',
    cleared: 'boolean',
  }),
);

export function mapField(field, opts, t) {
  opts = opts || {};

  switch (field) {
    case 'imported_payee':
      return t('imported payee');
    case 'account':
      return t('general.accountSmallCase');
    case 'category':
      return t('category');
    case 'date':
      return t('date');
    case 'payee':
      return t('payee');
    case 'notes':
      return t('notesSmallCase', 'notes');
    case 'amount':
      if (opts.inflow) {
        return t('amount (inflow)');
      } else if (opts.outflow) {
        return t('amount (outflow)');
      }
      return t('amount');
    case 'amount-inflow':
      return t('amount (inflow)');
    case 'amount-outflow':
      return t('amount (outflow)');
    default:
      return field;
  }
}

export function friendlyOp(op, type, t) {
  switch (op) {
    case 'oneOf':
      return t('one of');
    case 'is':
      return t('is');
    case 'isapprox':
      return t('is approx');
    case 'isbetween':
      return t('is between');
    case 'contains':
      return t('contains');
    case 'gt':
      if (type === 'date') {
        return t('is after');
      }
      return t('is greater than');
    case 'gte':
      if (type === 'date') {
        return t('is after or equals');
      }
      return t('is greater than or equals');
    case 'lt':
      if (type === 'date') {
        return t('is before');
      }
      return t('is less than');
    case 'lte':
      if (type === 'date') {
        return t('is before or equals');
      }
      return t('is less than or equals');
    case 'true':
      return t('is true');
    case 'false':
      return t('is false');
    case 'set':
      return t('set');
    case 'link-schedule':
      return t('link schedule');
    case 'and':
      return t('and');
    case 'or':
      return t('or');
    default:
      return '';
  }
}

export function deserializeField(field) {
  if (field === 'amount-inflow') {
    return { field: 'amount', options: { inflow: true } };
  } else if (field === 'amount-outflow') {
    return { field: 'amount', options: { outflow: true } };
  } else {
    return { field };
  }
}

export function getFieldError(type, t) {
  switch (type) {
    case 'date-format':
      return t('Invalid date format');
    case 'no-null':
    case 'no-empty-array':
    case 'no-empty-string':
      return t('Value cannot be empty');
    case 'not-number':
      return t('Value must be a number');
    case 'invalid-field':
      return t('Please choose a valid field for this type of rule');
    default:
      return t(
        'internalErrorContactSupport',
        'Internal error, sorry! Please get in touch https://actualbudget.github.io/docs/Contact/ for support',
      );
  }
}

export function sortNumbers(num1, num2) {
  if (num1 < num2) {
    return [num1, num2];
  }
  return [num2, num1];
}

export function parse(item) {
  switch (item.type) {
    case 'number': {
      let parsed = item.value;
      if (
        item.field === 'amount' &&
        item.op !== 'isbetween' &&
        parsed != null
      ) {
        parsed = integerToAmount(parsed);
      }
      return { ...item, value: parsed };
    }
    case 'string': {
      let parsed = item.value == null ? '' : item.value;
      return { ...item, value: parsed };
    }
    case 'boolean': {
      let parsed = item.value;
      return { ...item, value: parsed };
    }
    default:
  }

  return { ...item, error: null };
}

export function unparse({ error, inputKey, ...item }) {
  switch (item.type) {
    case 'number': {
      let unparsed = item.value;
      if (item.field === 'amount' && item.op !== 'isbetween') {
        unparsed = amountToInteger(unparsed);
      }

      return { ...item, value: unparsed };
    }
    case 'string': {
      let unparsed = item.value == null ? '' : item.value;
      return { ...item, value: unparsed };
    }
    case 'boolean': {
      let unparsed = item.value == null ? false : item.value;
      return { ...item, value: unparsed };
    }
    default:
  }

  return item;
}

export function makeValue(value, cond) {
  switch (cond.type) {
    case 'number': {
      if (cond.op !== 'isbetween') {
        return {
          ...cond,
          error: null,
          value: value ? currencyToAmount(String(value)) || 0 : 0,
        };
      }
      break;
    }
    default:
  }

  return { ...cond, error: null, value };
}

export function getApproxNumberThreshold(number) {
  return Math.round(Math.abs(number) * 0.075);
}
