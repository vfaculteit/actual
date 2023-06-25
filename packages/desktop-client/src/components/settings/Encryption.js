import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { colors } from '../../style';
import { Text, Button } from '../common';
import { useServerURL } from '../ServerContext';

import { Setting } from './UI';

export default function EncryptionSettings({ prefs, pushModal }) {
  const serverURL = useServerURL();
  const missingCryptoAPI = !(window.crypto && crypto.subtle);
  const { t } = useTranslation();

  function onChangeKey() {
    pushModal('create-encryption-key', { recreate: true });
  }

  return prefs.encryptKeyId ? (
    <Setting
      primaryAction={
        <Button onClick={onChangeKey}>{t('Generate new key')}</Button>
      }
    >
      <Text>
        <Trans i18nKey="e2eEncryptionOn">
          <Text style={{ color: colors.g4, fontWeight: 600 }}>
            End-to-end Encryption is turned on.
          </Text>{' '}
          Your data is encrypted with a key that only you have before sending it
          it out to the cloud. Local data remains unencrypted so if you forget
          your password you can re-encrypt it.{' '}
          <a
            href="https://actualbudget.github.io/docs/Getting-Started/sync/#encryption"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more…
          </a>
        </Trans>
      </Text>
    </Setting>
  ) : missingCryptoAPI ? (
    <Setting primaryAction={<Button disabled>Enable encryption…</Button>}>
      <Text>
        <Trans i18nKey="e2eEncryptionNotAvalailbeHttp">
          <strong>End-to-end encryption</strong> is not available when making an
          unencrypted connection to a remote server. You’ll need to enable HTTPS
          on your server to use end-to-end encryption. This problem may also
          occur if your browser is too old to work with Actual.{' '}
          <a
            href="https://actualbudget.github.io/docs/Installing/HTTPS"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more…
          </a>
        </Trans>
      </Text>
    </Setting>
  ) : serverURL ? (
    <Setting
      primaryAction={
        <Button onClick={() => pushModal('create-encryption-key')}>
          {t('Enable encryption…')}
        </Button>
      }
    >
      <Text>
        <Trans i18nKey="e2eEncryptionNotEnabled">
          <strong>End-to-end encryption</strong> is not enabled. Any data on the
          server is still protected by the server password, but it’s not
          end-to-end encrypted which means the server owners have the ability to
          read it. If you want, you can use an additional password to encrypt
          your data on the server.{' '}
          <a
            href="https://actualbudget.github.io/docs/Getting-Started/sync/#encryption"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more…
          </a>
        </Trans>
      </Text>
    </Setting>
  ) : (
    <Setting
      primaryAction={<Button disabled>{t('Enable encryption…')}</Button>}
    >
      <Text>
        <Trans i18nKey="e2eEncryptionNotAvailableWithoutServer">
          <strong>End-to-end encryption</strong> is not available when running
          without a server. Budget files are always kept unencrypted locally,
          and encryption is only applied when sending data to a server.{' '}
          <a
            href="https://actualbudget.github.io/docs/Getting-Started/sync/#encryption"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more…
          </a>
        </Trans>
      </Text>
    </Setting>
  );
}
