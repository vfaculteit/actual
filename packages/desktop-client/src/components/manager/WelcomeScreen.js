import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { connect } from 'react-redux';

import * as actions from 'loot-core/src/client/actions';

import { colors, styles } from '../../style';
import { View, Button, Text, P, ExternalLink } from '../common';

function WelcomeScreen({ createBudget, pushModal }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        gap: 10,
        maxWidth: 500,
        fontSize: 15,
        maxHeight: '100vh',
        marginBlock: 20,
      }}
    >
      <Text style={styles.veryLargeText}>{t('Let’s get started!')}</Text>
      <View style={{ overflowY: 'auto' }}>
        <Trans i18nKey="actualIntroMsg">
          <P>
            Actual is a personal finance tool that focuses on beautiful design
            and a slick user experience.{' '}
            <strong>Editing your data should be as fast as possible.</strong> On
            top of that, we want to provide powerful tools to allow you to do
            whatever you want with your data.
          </P>
        </Trans>
        <Trans i18nKey="actualIntroMsg2">
          <P style={{ '& a, & a:visited': { color: colors.p5 } }}>
            Currently, Actual implements budgeting based on a{' '}
            <ExternalLink
              asAnchor
              style={{ color: colors.p5 }}
              href="https://actualbudget.github.io/docs/Budgeting/howitworks"
            >
              monthly envelope system
            </ExternalLink>
            . Consider taking our{' '}
            <ExternalLink
              asAnchor
              href="https://actualbudget.github.io/docs/Getting-Started/using-actual/"
            >
              guided tour
            </ExternalLink>{' '}
            to help you get your bearings, and check out the rest of the
            documentation while you’re there to learn more about advanced
            topics.
          </P>
        </Trans>
        <Trans i18nKey="actualIntroMsg3">
          <P style={{ color: colors.n5 }}>
            Get started by importing an existing budget file from Actual or
            another budgeting app, or start fresh with an empty budget. You can
            always create or import another budget later.
          </P>
        </Trans>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        <Button onClick={() => pushModal('import')}>
          {t('Import my budget')}
        </Button>
        <Button primary onClick={createBudget}>
          {t('Start fresh')}
        </Button>
      </View>
    </View>
  );
}

export default connect(null, actions)(WelcomeScreen);
