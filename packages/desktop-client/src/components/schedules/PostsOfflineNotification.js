import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';

import { send } from 'loot-core/src/platform/client/fetch';

import { colors } from '../../style';
import { Text, P, Button, Stack } from '../common';
import { Page } from '../Page';
import DisplayId from '../util/DisplayId';

export default function PostsOfflineNotification() {
  let location = useLocation();
  let history = useHistory();

  let payees = (location.state && location.state.payees) || [];
  let plural = payees.length > 1;

  const { t } = useTranslation();

  function onClose() {
    history.goBack();
  }

  async function onPost() {
    await send('schedule/force-run-service');
    history.goBack();
  }

  return (
    <Page
      title={t('schedules.postTransactionsQuestion', 'Post transactions?')}
      modalSize="small"
    >
      <P>
        {payees.length > 0 ? (
          <Text>
            The{' '}
            {plural
              ? t('general.payees', 'payees')
              : t('general.payee', 'payee')}{' '}
            {payees.map((id, idx) => (
              <Text>
                <Text style={{ color: colors.p4 }}>
                  <DisplayId key={id} id={id} type="payees" />
                </Text>
                {idx === payees.length - 1
                  ? ' '
                  : idx === payees.length - 2
                  ? `, ${t('general.and', 'and')} `
                  : ', '}
              </Text>
            ))}
          </Text>
        ) : (
          <Text>
            {t('schedules.thereArePayeesThat', {
              count: plural,
              defaultValue: `There ${
                plural ? 'are payees ' : 'is a payee '
              } that `,
            })}
          </Text>
        )}

        <Text>
          {t('schedules.thereAreSchedulesDueToday', {
            count: plural,
            defaultValue: `${
              plural ? 'have ' : 'has '
            } schedules that are due today. Usually we
            automatically post transactions for these, but you are offline or
            syncing failed. In order to avoid duplicate transactions, we let you
            choose whether or not to create transactions for these schedules.`,
          })}
        </Text>
      </P>
      <P>
        {t(
          'schedule.otherDevicesMayHaveAlreadyCreatedTransactions',
          'Be aware that other devices may have already created these transactions. If you have multiple devices, make sure you only do this on one device or you will have duplicate transactions.',
        )}
      </P>
      <P>
        {t(
          'schedule.youCanAlwaysManuallyPostTransaction',
          'You can always manually post a transaction later for a due schedule by selecting the schedule and clicking “Post transaction” in the action menu.',
        )}
      </P>
      <Stack
        direction="row"
        justify="flex-end"
        style={{ marginTop: 20 }}
        spacing={2}
      >
        <Button onClick={onClose}>Decide later</Button>
        <Button primary onClick={onPost}>
          {t('schedules.postTransactions', 'Post transactions')}
        </Button>
      </Stack>
    </Page>
  );
}
