import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { send } from 'loot-core/src/platform/client/fetch';

import { colors } from '../../../style';
import { View, Text, Button } from '../../common';

import { Title } from './common';
import { ConfirmPasswordForm } from './ConfirmPasswordForm';

export default function ChangePassword() {
  const { t } = useTranslation();
  let history = useHistory();
  let [error, setError] = useState(null);
  let [msg, setMessage] = useState(null);

  function getErrorMessage(error) {
    switch (error) {
      case 'invalid-password':
        return t('Password cannot be empty');
      case 'password-match':
        return t('Passwords do not match');
      case 'network-failure':
        return t('Unable to contact the server');
      default:
        return t('Internal server error');
    }
  }

  async function onSetPassword(password) {
    setError(null);
    let { error } = await send('subscribe-change-password', { password });

    if (error) {
      setError(error);
    } else {
      setMessage(t('Password successfully changed'));
      await send('subscribe-sign-in', { password });
      history.push('/');
    }
  }

  return (
    <View style={{ maxWidth: 500, marginTop: -30 }}>
      <Title text={t('Change server password')} />
      <Text
        style={{
          fontSize: 16,
          color: colors.n2,
          lineHeight: 1.4,
        }}
      >
        <Trans i18nKey="messageChangePasswordExistingSessions">
          This will change the password for this server instance. All existing
          sessions will stay logged in.
        </Trans>
      </Text>

      {error && (
        <Text
          style={{
            marginTop: 20,
            color: colors.r4,
            borderRadius: 4,
            fontSize: 15,
          }}
        >
          {getErrorMessage(error)}
        </Text>
      )}

      {msg && (
        <Text
          style={{
            marginTop: 20,
            color: colors.g4,
            borderRadius: 4,
            fontSize: 15,
          }}
        >
          {msg}
        </Text>
      )}

      <ConfirmPasswordForm
        buttons={
          <Button
            bare
            type="button"
            style={{ fontSize: 15, marginRight: 10 }}
            onClick={() => history.push('/')}
          >
            {t('Cancel')}
          </Button>
        }
        onSetPassword={onSetPassword}
        onError={setError}
      />
    </View>
  );
}
