import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { colors } from '../../style';
import { View, Text, Modal, ButtonWithLoading } from '../common';

export default function DeleteMenu({ modalProps, actions, file }) {
  let [loadingState, setLoadingState] = useState(null);

  async function onDeleteCloud() {
    setLoadingState('cloud');
    await actions.deleteBudget(file.id, file.cloudFileId);
    setLoadingState(null);

    modalProps.onBack();
  }

  async function onDeleteLocal() {
    setLoadingState('local');
    await actions.deleteBudget(file.id);
    setLoadingState(null);

    modalProps.onBack();
  }

  // If the state is "broken" that means it was created by another
  // user. The current user should be able to delete the local file,
  // but not the remote one
  let isRemote = file.cloudFileId && file.state !== 'broken';
  const { t } = useTranslation();

  return (
    <Modal
      {...modalProps}
      title={t('Delete') + ' ' + file.name}
      padding={0}
      showOverlay={false}
      onClose={modalProps.onBack}
    >
      {() => (
        <View
          style={{
            padding: 15,
            paddingTop: 0,
            paddingBottom: 25,
            width: 500,
            lineHeight: '1.5em',
          }}
        >
          {isRemote && (
            <>
              <Text>
                <Trans i18nKey="thisIsAHostedFileMsg">
                  This is a <strong>hosted file</strong> which means it is
                  stored on your server to make it available for download on any
                  device. You can delete it from the server, which will also
                  remove it from all of your devices.
                </Trans>
              </Text>

              <ButtonWithLoading
                primary
                loading={loadingState === 'cloud'}
                style={{
                  backgroundColor: colors.r4,
                  alignSelf: 'center',
                  border: 0,
                  marginTop: 10,
                  padding: '10px 30px',
                  fontSize: 14,
                }}
                onClick={onDeleteCloud}
              >
                {t('Delete file from all devices')}
              </ButtonWithLoading>
            </>
          )}

          {file.id && (
            <>
              <Text style={[isRemote && { marginTop: 20 }]}>
                {isRemote ? (
                  <Text>
                    <Trans i18nKey="deleteLocalCopyMsg">
                      You can also delete just the local copy. This will remove
                      all local data and the file will be listed as available
                      for download.
                    </Trans>
                  </Text>
                ) : (
                  <Text>
                    {file.state === 'broken' ? (
                      <Text>
                        <Trans i18nKey="deleteHostedFileMsg">
                          This is a <strong>hosted file</strong> but it was
                          created by another user. You can only delete the local
                          copy.
                        </Trans>
                      </Text>
                    ) : (
                      <Text>
                        <Trans i18nKey="deleteLocalFileMsg">
                          This a <strong>local file</strong> which is not stored
                          on a server.
                        </Trans>
                      </Text>
                    )}{' '}
                    <Trans>
                      Deleting it will remove it and all of its backups
                      permanently.
                    </Trans>
                  </Text>
                )}
              </Text>

              <ButtonWithLoading
                primary={!isRemote}
                loading={loadingState === 'local'}
                style={[
                  {
                    alignSelf: 'center',
                    marginTop: 10,
                    padding: '10px 30px',
                    fontSize: 14,
                  },
                  isRemote
                    ? {
                        color: colors.r4,
                        borderColor: colors.r4,
                      }
                    : {
                        border: 0,
                        backgroundColor: colors.r4,
                      },
                ]}
                onClick={onDeleteLocal}
              >
                {t('Delete file locally')}
              </ButtonWithLoading>
            </>
          )}
        </View>
      )}
    </Modal>
  );
}
