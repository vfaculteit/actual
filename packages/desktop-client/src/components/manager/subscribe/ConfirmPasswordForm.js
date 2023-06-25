import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { View, ButtonWithLoading } from '../../common';

import { Input } from './common';

export function ConfirmPasswordForm({ buttons, onSetPassword, onError }) {
  const { t } = useTranslation();
  let [password1, setPassword1] = useState('');
  let [password2, setPassword2] = useState('');
  let [showPassword, setShowPassword] = useState(false);
  let [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) {
      return;
    }

    if (password1 === password2) {
      setLoading(true);
      await onSetPassword(password1);
      setLoading(false);
    } else {
      onError('password-match');
    }
  }

  function onShowPassword(e) {
    setShowPassword(e.target.checked);
  }
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        marginTop: 30,
      }}
      onSubmit={onSubmit}
    >
      <Input
        autoFocus={true}
        placeholder={t('Password')}
        type={showPassword ? 'text' : 'password'}
        value={password1}
        onChange={e => setPassword1(e.target.value)}
        onEnter={onSubmit}
      />
      <Input
        placeholder={t('Confirm password')}
        type={showPassword ? 'text' : 'password'}
        value={password2}
        onChange={e => setPassword2(e.target.value)}
        style={{ marginTop: 10 }}
        onEnter={onSubmit}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          fontSize: 15,
          marginTop: 20,
        }}
      >
        <label style={{ userSelect: 'none' }}>
          <input type="checkbox" onChange={onShowPassword} />
          {t('Show password')}
        </label>
        <View style={{ flex: 1 }} />
        {buttons}
        <ButtonWithLoading primary loading={loading}>
          {t('OK')}
        </ButtonWithLoading>
      </View>
    </form>
  );
}
