import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useCachedAccounts } from 'loot-core/src/client/data-hooks/accounts';
import { useCachedPayees } from 'loot-core/src/client/data-hooks/payees';
import * as monthUtils from 'loot-core/src/shared/months';
import { getScheduledAmount } from 'loot-core/src/shared/schedules';
import { integerToCurrency } from 'loot-core/src/shared/util';

import DotsHorizontalTriple from '../../icons/v1/DotsHorizontalTriple';
import Check from '../../icons/v2/Check';
import { colors } from '../../style';
import { View, Text, Button, Tooltip, Menu } from '../common';
import { Table, TableHeader, Row, Field, Cell } from '../table';
import DisplayId from '../util/DisplayId';

import { StatusBadge } from './StatusBadge';

export let ROW_HEIGHT = 43;

function OverflowMenu({ schedule, status, onAction }) {
  let [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <View>
      <Button
        bare
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <DotsHorizontalTriple
          width={15}
          height={15}
          style={{ color: 'inherit', transform: 'rotateZ(90deg)' }}
        />
      </Button>
      {open && (
        <Tooltip
          position="bottom-right"
          width={150}
          style={{ padding: 0 }}
          onClose={() => setOpen(false)}
        >
          <Menu
            onMenuSelect={name => {
              onAction(name, schedule.id);
              setOpen(false);
            }}
            items={[
              status === 'due' && {
                name: 'post-transaction',
                text: t('schedules.postTransaction', 'Post transaction'),
              },
              ...(schedule.completed
                ? [{ name: 'restart', text: t('general.restart', 'Restart') }]
                : [
                    {
                      name: 'skip',
                      text: t('schedules.skipNextDate', 'Skip next date'),
                    },
                    {
                      name: 'complete',
                      text: t('general.complete', 'Complete'),
                    },
                  ]),
              { name: 'delete', text: t('general.delete', 'Delete') },
            ]}
          />
        </Tooltip>
      )}
    </View>
  );
}

export function ScheduleAmountCell({ amount, op }) {
  let num = getScheduledAmount(amount);
  let str = integerToCurrency(Math.abs(num || 0));
  let isApprox = op === 'isapprox' || op === 'isbetween';

  const { t } = useTranslation();

  return (
    <Cell
      width={100}
      plain
      style={{
        textAlign: 'right',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 5px',
      }}
      name="amount"
    >
      {isApprox && (
        <View
          style={{
            textAlign: 'left',
            color: colors.n7,
            lineHeight: '1em',
            marginRight: 10,
          }}
          title={t('general.approximatelyWithAmounttt', {
            amount: str,
            defaultValue:
              (isApprox ? 'Approximately {{amount}}' : '{{amount}}') + str,
          })}
        >
          ~
        </View>
      )}
      <Text
        style={{
          flex: 1,
          color: num > 0 ? colors.g5 : null,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={t('general.approximatelyWithAmounttt', {
          amount: str,
          defaultValue: isApprox ? 'Approximately {{amount}}' : '{{amount}}',
        })}
      >
        {num > 0 ? `+${str}` : `${str}`}
      </Text>
    </Cell>
  );
}

export function SchedulesTable({
  schedules,
  statuses,
  filter,
  minimal,
  allowCompleted,
  style,
  onSelect,
  onAction,
  tableStyle,
}) {
  const { t } = useTranslation();

  let dateFormat = useSelector(state => {
    return state.prefs.local.dateFormat || 'MM/dd/yyyy';
  });

  let [showCompleted, setShowCompleted] = useState(false);

  let payees = useCachedPayees();
  let accounts = useCachedAccounts();

  let filteredSchedules = useMemo(() => {
    if (!filter) {
      return schedules;
    }
    const filterIncludes = str =>
      str
        ? str.toLowerCase().includes(filter.toLowerCase()) ||
          filter.toLowerCase().includes(str.toLowerCase())
        : false;

    return schedules.filter(schedule => {
      let payee = payees.find(p => schedule._payee === p.id);
      let account = accounts.find(a => schedule._account === a.id);
      let amount = getScheduledAmount(schedule._amount);
      let amountStr =
        (schedule._amountOp === 'isapprox' || schedule._amountOp === 'isbetween'
          ? '~'
          : '') +
        (amount > 0 ? '+' : '') +
        integerToCurrency(Math.abs(amount || 0));
      let dateStr = schedule.next_date
        ? monthUtils.format(schedule.next_date, dateFormat)
        : null;

      return (
        filterIncludes(payee && payee.name) ||
        filterIncludes(account && account.name) ||
        filterIncludes(amountStr) ||
        filterIncludes(statuses.get(schedule.id)) ||
        filterIncludes(dateStr)
      );
    });
  }, [schedules, filter, statuses]);

  let items = useMemo(() => {
    if (!allowCompleted) {
      return filteredSchedules.filter(s => !s.completed);
    }
    if (showCompleted) {
      return filteredSchedules;
    }
    let arr = filteredSchedules.filter(s => !s.completed);
    if (filteredSchedules.find(s => s.completed)) {
      arr.push({ type: 'show-completed' });
    }
    return arr;
  }, [filteredSchedules, showCompleted, allowCompleted]);

  function renderSchedule({ item }) {
    return (
      <Row
        height={ROW_HEIGHT}
        inset={15}
        backgroundColor="transparent"
        onClick={() => onSelect(item.id)}
        style={{
          cursor: 'pointer',
          backgroundColor: 'white',
          ':hover': { backgroundColor: colors.hover },
        }}
      >
        <Field width="flex" name="name">
          <Text
            style={item.name == null ? { color: colors.n8 } : null}
            title={item.name ? item.name : ''}
          >
            {item.name ? item.name : t('general.none', 'None')}
          </Text>
        </Field>
        <Field width="flex" name="payee">
          <DisplayId type="payees" id={item._payee} />
        </Field>
        <Field width="flex" name="account">
          <DisplayId type="accounts" id={item._account} />
        </Field>
        <Field width={120} name="date">
          {item.next_date
            ? monthUtils.format(item.next_date, dateFormat)
            : null}
        </Field>
        <Field width={120} name="status" style={{ alignItems: 'flex-start' }}>
          <StatusBadge status={statuses.get(item.id)} />
        </Field>
        <ScheduleAmountCell
          width={80}
          amount={item._amount}
          op={item._amountOp}
        />
        {!minimal && (
          <Field width={120} style={{ textAlign: 'center' }}>
            {item._date && item._date.frequency && (
              <Check style={{ width: 13, height: 13 }} />
            )}
          </Field>
        )}
        {!minimal && (
          <Field width={40} name="actions">
            <OverflowMenu
              schedule={item}
              status={statuses.get(item.id)}
              onAction={onAction}
            />
          </Field>
        )}
      </Row>
    );
  }

  function renderItem({ item }) {
    if (item.type === 'show-completed') {
      return (
        <Row
          height={ROW_HEIGHT}
          inset={15}
          backgroundColor="transparent"
          style={{
            cursor: 'pointer',
            backgroundColor: 'white',
            ':hover': { backgroundColor: colors.hover },
          }}
          onClick={() => setShowCompleted(true)}
        >
          <Field
            width="flex"
            style={{
              fontStyle: 'italic',
              textAlign: 'center',
              color: colors.n6,
            }}
          >
            {t('schedules.showCompletedSchedules', 'Show completed schedules')}
          </Field>
        </Row>
      );
    }
    return renderSchedule({ item });
  }

  return (
    <View style={[{ flex: 1 }, tableStyle]}>
      <TableHeader height={ROW_HEIGHT} inset={15} version="v2">
        <Field width="flex">{t('general.name', 'Name')}</Field>
        <Field width="flex">{t('general.payee_one', 'Payee')}</Field>
        <Field width="flex">{t('general.account_one', 'Account')}</Field>
        <Field width={120}>{t('schedules.nextDate', 'Next date')}</Field>
        <Field width={120}>{t('general.status', 'Status')}</Field>
        <Field width={100} style={{ textAlign: 'center' }}>
          {t('general.amount', 'Amount')}
        </Field>
        {!minimal && (
          <Field width={120} style={{ textAlign: 'center' }}>
            {t('general.recurring', 'Recurring')}
          </Field>
        )}
        {!minimal && <Field width={40}></Field>}
      </TableHeader>
      <Table
        rowHeight={ROW_HEIGHT}
        backgroundColor="transparent"
        version="v2"
        style={[{ flex: 1, backgroundColor: 'transparent' }, style]}
        items={items}
        renderItem={renderItem}
        renderEmpty={filter ? t('No matching schedules') : t('No schedules')}
        allowPopupsEscape={items.length < 6}
      />
    </View>
  );
}
