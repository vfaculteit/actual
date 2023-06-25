import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { createBudget } from 'loot-core/src/client/actions/budgets';
import { loggedIn } from 'loot-core/src/client/actions/user';
import { send } from 'loot-core/src/platform/client/fetch';

import { colors } from '../../../style';
import { View, Text, Button, ButtonWithLoading } from '../../common';

import { useBootstrapped, Title, Input } from './common';

export default function Login() {
  let dispatch = useDispatch();
  let [password, setPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);
  const { t } = useTranslation();
  let { checked } = useBootstrapped();

  function getErrorMessage(error) {
    switch (error) {
      case 'invalid-password':
        return t('Invalid password');
      case 'network-failure':
        return t('Unable to contact the server');
      default:
        return t('An unknown error occurred') + `: ${error}`;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (password === '' || loading) {
      return;
    }

    setError(null);
    setLoading(true);
    let { error } = await send('subscribe-sign-in', { password });
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      dispatch(loggedIn());
    }
  }

  async function onDemo() {
    await dispatch(createBudget({ demoMode: true }));
  }

  if (!checked) {
    return null;
  }

  return (
    <View style={{ maxWidth: 450, marginTop: -30 }}>
      <Title text={t('Sign in to this Actual instance')} />
      <Text
        style={{
          fontSize: 16,
          color: colors.n2,
          lineHeight: 1.4,
        }}
      >
        <Trans i18nKey="lostPasswordServerAccessMsg">
          If you lost your password, you likely still have access to your server
          to manually reset it.
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
          {getErrorMessage(error, t)}
        </Text>
      )}

      <form
        style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}
        onSubmit={onSubmit}
      >
        <Input
          autoFocus={true}
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          style={{ flex: 1, marginRight: 10 }}
        />
        <ButtonWithLoading primary loading={loading} style={{ fontSize: 15 }}>
          {t('Sign in')}
        </ButtonWithLoading>
      </form>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
        }}
      >
        <Button
          bare
          style={{ fontSize: 15, color: colors.b4, marginLeft: 10 }}
          onClick={onDemo}
        >
          {t('Try Demo')} &rarr;
        </Button>
      </View>
    </View>
  );
}
