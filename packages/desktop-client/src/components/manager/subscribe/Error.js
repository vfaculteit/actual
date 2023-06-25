import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { colors } from '../../../style';
import { View, Text, Button } from '../../common';

function getErrorMessage(reason, t) {
  switch (reason) {
    case 'network-failure':
      return t(
        'Unable to access server. Make sure the configured URL for the server is accessible.',
      );
    default:
      return t('Server returned an error while checking its status.');
  }
}

export default function Error() {
  let history = useHistory();
  let location = useLocation();
  let { error } = location.state || {};
  const { t } = useTranslation();
  function onTryAgain() {
    history.push('/');
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 16,
          color: colors.n2,
          lineHeight: 1.4,
        }}
      >
        {getErrorMessage(error, t)}
      </Text>
      <Button onClick={onTryAgain} style={{ marginTop: 20 }}>
        {t('Try again')}
      </Button>
    </View>
  );
}
