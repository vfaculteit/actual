import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { colors } from '../style';

import { View, Stack, Text, Block, Modal, P, Link, Button } from './common';
import { Checkbox } from './forms';

class FatalError extends React.Component {
  state = { showError: false };

  renderSimple(error) {
    let msg;
    if (error.IDBFailure) {
      // IndexedDB wasn't able to open the database
      msg = (
        <Text>
          <Trans i18nKey="browserNoSupportIndexedDB">
            Your browser doesn’t support IndexedDB in this environment, a
            feature that Actual requires to run. This might happen if you are in
            private browsing mode. Please try a different browser or turn off
            private browsing.
          </Trans>
        </Text>
      );
    } else if (error.SharedArrayBufferMissing) {
      // SharedArrayBuffer isn't available
      msg = (
        <Text>
          <Trans i18nKey="browserNoSupportSharedArrayBuffer">
            Actual requires access to <code>SharedArrayBuffer</code> in order to
            function properly. If you’re seeing this error, either your browser
            does not support <code>SharedArrayBuffer</code>, or your server is
            not sending the appropriate headers, or you are not using HTTPS. See{' '}
            <a href="https://actualbudget.github.io/docs/Troubleshooting/SharedArrayBuffer">
              our troubleshooting documentation
            </a>{' '}
            to learn more. <SharedArrayBufferOverride />
          </Trans>
        </Text>
      );
    } else {
      // This indicates the backend failed to initialize. Show the
      // user something at least so they aren't looking at a blank
      // screen
      msg = (
        <Text>
          <Trans i18nKey="errorLoadinApp">
            There was a problem loading the app in this browser version. If this
            continues to be a problem, you can{' '}
            <a href="https://github.com/actualbudget/releases">
              download the desktop app
            </a>
            .
          </Trans>
        </Text>
      );
    }

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Stack
          style={{
            paddingBottom: 100,
            maxWidth: 500,
            color: colors.r4,
            lineHeight: '1.5em',
            fontSize: 15,
            '& a': { color: colors.r4 },
          }}
        >
          <Text>{msg}</Text>
          <Text>
            <Trans i18nKey="contactSupport">
              Please get{' '}
              <a href="https://actualbudget.github.io/docs/Contact">in touch</a>{' '}
              for support
            </Trans>
          </Text>
        </Stack>
      </View>
    );
  }

  render() {
    const { buttonText, error } = this.props;
    const { showError } = this.state;

    if (error.type === 'app-init-failure') {
      return this.renderSimple(error);
    }

    return (
      <Modal isCurrent={true} showClose={false} title="Fatal Error">
        {() => (
          <View style={{ maxWidth: 500 }}>
            <Trans i18nKey="uiErrorContactUs">
              <P>There was an unrecoverable error in the UI. Sorry!</P>
              <P>
                If this error persists, please get{' '}
                <a
                  href="https://actualbudget.github.io/docs/Contact"
                  style={{ color: colors.p4 }}
                >
                  in touch
                </a>{' '}
                so it can be investigated.
              </P>
            </Trans>
            <P>
              <Button onClick={() => window.Actual.relaunch()}>
                {buttonText}
              </Button>
            </P>
            <P isLast={true} style={{ fontSize: 11 }}>
              <Link
                onClick={() => this.setState({ showError: true })}
                style={{ color: colors.p4 }}
              >
                <Trans>Show Error</Trans>
              </Link>
              {showError && (
                <Block
                  style={{
                    marginTop: 5,
                    height: 100,
                    overflow: 'auto',
                  }}
                >
                  {error.stack}
                </Block>
              )}
            </P>
          </View>
        )}
      </Modal>
    );
  }
}
export default FatalError;

function SharedArrayBufferOverride() {
  let [expanded, setExpanded] = useState(false);
  let [understand, setUnderstand] = useState(false);
  const { t } = useTranslation();

  return expanded ? (
    <>
      <P style={{ marginTop: 10 }}>
        <Trans i18nKey="actualUsesSharedArrayBuffer">
          Actual uses <code>SharedArrayBuffer</code> to allow usage from
          multiple tabs at once and to ensure correct behavior when switching
          files. While it can run without access to{' '}
          <code>SharedArrayBuffer</code>, you may encounter data loss or notice
          multiple budget files being merged with each other.
        </Trans>
      </P>
      <label
        style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}
      >
        <Checkbox checked={understand} onChange={setUnderstand} />{' '}
        <Trans>
          I understand the risks, run Actual in the unsupported fallback mode
        </Trans>
      </label>
      <Button
        disabled={!understand}
        onClick={() => {
          window.localStorage.setItem('SharedArrayBufferOverride', 'true');
          window.location.reload();
        }}
      >
        {t('Open Actual')}
      </Button>
    </>
  ) : (
    <Link
      onClick={() => setExpanded(true)}
      style={{
        color: `inherit !important`,
        marginLeft: 5,
        border: 'none !important',
        background: 'none !important',
        padding: '0 !important',
        textDecoration: 'underline !important',
        boxShadow: 'none !important',
        display: 'inline !important',
        font: 'inherit !important',
      }}
    >
      {t('Advanced options')}
    </Link>
  );
}
