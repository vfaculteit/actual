import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { savePrefs } from 'loot-core/src/client/actions';

import { colors, styles } from '../style';
import { isMobile } from '../util';

import { View, Text, Button } from './common';
import { Checkbox } from './forms';

let buttonStyle = { border: 0, fontSize: 15, padding: '10px 13px' };

export default function MobileWebMessage() {
  const hideMobileMessagePref = useSelector(state => {
    return (state.prefs.local && state.prefs.local.hideMobileMessage) || true;
  });
  const { t } = useTranslation();
  let [show, setShow] = useState(
    isMobile() &&
      !hideMobileMessagePref &&
      !document.cookie.match(/hideMobileMessage=true/),
  );
  let [requestDontRemindMe, setRequestDontRemindMe] = useState(false);

  let dispatch = useDispatch();

  function onTry() {
    setShow(false);

    if (requestDontRemindMe) {
      // remember the pref indefinitely
      dispatch(savePrefs({ hideMobileMessage: true }));
    } else {
      // Set a cookie for 5 minutes
      let d = new Date();
      d.setTime(d.getTime() + 1000 * 60 * 5);
      document.cookie =
        'hideMobileMessage=true;path=/;expires=' + d.toGMTString();
    }
  }

  if (!show) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.n1,
        color: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 6,
        zIndex: 10000,
        fontSize: 15,
        ...styles.shadowLarge,
      }}
    >
      <Text style={{ lineHeight: '1.5em' }}>
        <strong>{t('Actual features are limited on small screens.')}</strong>
        <br />
        <span>
          <Trans>
            While we work to improve this experience, you may find the full
            Actual feature set on devices with larger screens.
          </Trans>
        </span>
      </Text>

      <View
        style={{
          gap: 16,
          marginTop: 20,
          justifyContent: 'center',
        }}
      >
        <Button style={buttonStyle} onClick={onTry}>
          {t('Try it anyway')}
        </Button>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Checkbox
            id="dont_remind_me"
            checked={requestDontRemindMe}
            onChange={() => {
              setRequestDontRemindMe(!requestDontRemindMe);
            }}
          />
          <label
            htmlFor="dont_remind_me"
            style={{
              userSelect: 'none',
            }}
          >
            {t('Don’t remind me again')}
          </label>
        </View>
      </View>
    </View>
  );
}
