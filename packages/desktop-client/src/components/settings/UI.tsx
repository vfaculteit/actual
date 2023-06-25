import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { css, media } from 'glamor';
import type { CSSProperties } from 'glamor';

import { colors } from '../../style';
import tokens from '../../tokens';
import { View, Link } from '../common';

interface SettingProps {
  primaryAction: React.ReactNode;
  style?: CSSProperties;
  children: React.ReactNode;
}

export const Setting: React.FC<SettingProps> = ({
  primaryAction,
  style,
  children,
}) => {
  return (
    <View
      {...css([
        {
          backgroundColor: colors.n9,
          alignSelf: 'flex-start',
          alignItems: 'flex-start',
          padding: 15,
          borderRadius: 4,
          border: '1px solid ' + colors.n8,
          width: '100%',
        },
        style,
      ])}
    >
      <View
        style={{
          marginBottom: primaryAction ? 10 : 0,
          maxWidth: 500,
          lineHeight: 1.5,
          gap: 10,
        }}
      >
        {children}
      </View>
      {primaryAction || null}
    </View>
  );
};

interface AdvancedToggleProps {
  children: React.ReactNode;
}

export const AdvancedToggle: React.FC<AdvancedToggleProps> = ({ children }) => {
  let location = useLocation();
  let [expanded, setExpanded] = useState(location.hash === '#advanced');
  const { t } = useTranslation();
  return expanded ? (
    <View
      id="advanced"
      style={[
        {
          gap: 20,
          alignItems: 'flex-start',
          marginBottom: 25,
          width: '100%',
        },
        media(`(min-width: ${tokens.breakpoint_medium})`, {
          width: 'auto',
        }),
      ]}
      innerRef={el => {
        if (el && location.hash === '#advanced') {
          el.scrollIntoView(true);
        }
      }}
    >
      <View style={{ fontSize: 20, fontWeight: 500, flexShrink: 0 }}>
        {t('Advanced Settings')}
      </View>
      {children}
    </View>
  ) : (
    <Link
      id="advanced"
      onClick={() => setExpanded(true)}
      style={{
        flexShrink: 0,
        alignSelf: 'flex-start',
        color: colors.p4,
        marginBottom: 25,
      }}
    >
      {t('Show advanced settings')}
    </Link>
  );
};
