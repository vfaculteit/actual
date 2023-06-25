import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { rolloverBudget } from 'loot-core/src/client/queries';
import * as monthUtils from 'loot-core/src/shared/months';

import { colors, styles } from '../../style';
import { View, Text, Modal, Button } from '../common';
import CellValue from '../spreadsheet/CellValue';
import format from '../spreadsheet/format';
import NamespaceContext from '../spreadsheet/NamespaceContext';
import SheetValue from '../spreadsheet/SheetValue';

function BudgetSummary({ month, modalProps }) {
  const { t } = useTranslation();
  const prevMonthName = monthUtils.format(monthUtils.prevMonth(month), 'MMM');

  return (
    <Modal title={t('Budget Details')} {...modalProps} animate>
      {() => (
        <NamespaceContext.Provider value={monthUtils.sheetForMonth(month)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            <View
              style={[
                styles.text,
                {
                  fontWeight: '600',
                  textAlign: 'right',
                  marginRight: 10,
                },
              ]}
            >
              <CellValue
                binding={rolloverBudget.incomeAvailable}
                type="financial"
              />
              <CellValue
                binding={rolloverBudget.lastMonthOverspent}
                type="financial"
              />
              <CellValue
                binding={rolloverBudget.totalBudgeted}
                type="financial"
              />
              <CellValue
                binding={rolloverBudget.forNextMonth}
                type="financial"
              />
            </View>

            <View
              style={[
                styles.text,
                {
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                },
              ]}
            >
              <Text>
                <Trans>Available Funds</Trans>
              </Text>
              <Text>
                <Trans>Overspent in {prevMonthName}</Trans>
              </Text>
              <Text>
                <Trans>Budgeted</Trans>
              </Text>
              <Text>
                <Trans>For Next Month</Trans>
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <SheetValue binding={rolloverBudget.toBudget}>
              {({ value: amount }) => {
                return (
                  <>
                    <Text style={styles.text}>
                      {amount < 0
                        ? t('Overbudget') + ':'
                        : t('To budget') + ':'}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontWeight: '600',
                          fontSize: 22,
                          color: amount < 0 ? colors.r4 : colors.n1,
                        },
                      ]}
                    >
                      {format(amount, 'financial')}
                    </Text>
                  </>
                );
              }}
            </SheetValue>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 15,
            }}
          >
            <Button style={{ marginRight: 10 }} onClick={modalProps.onClose}>
              {t('Close')}
            </Button>
          </View>
        </NamespaceContext.Provider>
      )}
    </Modal>
  );
}

export default BudgetSummary;
