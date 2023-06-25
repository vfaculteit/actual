import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { send } from 'loot-core/src/platform/client/fetch';

import { Text, ButtonWithLoading } from '../common';

import { Setting } from './UI';

export function ResetCache() {
  let [resetting, setResetting] = useState(false);
  const { t } = useTranslation();

  async function onResetCache() {
    setResetting(true);
    await send('reset-budget-cache');
    setResetting(false);
  }

  return (
    <Setting
      primaryAction={
        <ButtonWithLoading loading={resetting} onClick={onResetCache}>
          {t('Reset budget cache')}
        </ButtonWithLoading>
      }
    >
      <Text>
        <Trans i18nKey="resetBudgetCache">
          <strong>Reset budget cache</strong> will clear all cached values for
          the budget and recalculate the entire budget. All values in the budget
          are cached for performance reasons, and if there is a bug in the cache
          you won’t see correct values. There is no danger in resetting the
          cache. Hopefully you never have to do this.
        </Trans>
      </Text>
    </Setting>
  );
}

export function ResetSync({ resetSync }) {
  let [resetting, setResetting] = useState(false);
  const { t } = useTranslation();
  async function onResetSync() {
    setResetting(true);
    await resetSync();
    setResetting(false);
  }

  return (
    <Setting
      primaryAction={
        <ButtonWithLoading loading={resetting} onClick={onResetSync}>
          {t('Reset sync')}
        </ButtonWithLoading>
      }
    >
      <Text>
        <Trans i18nKey="resetSync">
          <strong>Reset sync</strong> will remove all local data used to track
          changes for syncing, and create a fresh sync ID on the server. This
          file on other devices will have to be re-downloaded to use the new
          sync ID. Use this if there is a problem with syncing and you want to
          start fresh.
        </Trans>
      </Text>
    </Setting>
  );
}
