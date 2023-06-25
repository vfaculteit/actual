import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { Page } from '../Page';

import ManagePayeesWithData from './ManagePayeesWithData';

export function ManagePayeesPage() {
  let location = useLocation();
  const { t } = useTranslation();

  return (
    <Page title={t('Payees')}>
      <ManagePayeesWithData
        initialSelectedIds={
          location.state && location.state.selectedPayee
            ? [location.state.selectedPayee]
            : null
        }
      />
    </Page>
  );
}
