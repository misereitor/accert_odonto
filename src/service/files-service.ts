'use server';

import { models } from 'oci-objectstorage';
import { createStorageClient } from '../../lib/oracle/auth/config';
import { getUserByToken } from './user-service';
import { randString } from '../../util/randomString';

export const generateSignedUrl = async (fileType: string) => {
  try {
    const { objectStorageClient, bucketName } = createStorageClient();
    const namespace = await objectStorageClient.getNamespace({});
    const namespaceName = namespace.value;

    const objectName = await getPathFileByUser(fileType);
    const preSignedUrl =
      await objectStorageClient.createPreauthenticatedRequest({
        namespaceName,
        bucketName,
        createPreauthenticatedRequestDetails: {
          name: 'upload-request',
          objectName: objectName.path,
          accessType:
            models.CreatePreauthenticatedRequestDetails.AccessType.ObjectWrite,
          timeExpires: new Date(Date.now() + 36000 * 1000)
        }
      });
    const accessUri = preSignedUrl.preauthenticatedRequest.accessUri;

    // Combinar com o domínio base para obter a URL completa
    const fullUrl = `https://objectstorage.sa-saopaulo-1.oraclecloud.com${accessUri}`;
    return {
      signedUrl: fullUrl,
      filePath: objectName
    };
  } catch (error: unknown) {
    console.error('Falha ao carregar o arquivo', error);
    throw error;
  }
};

export const generateSignedDownloadUrls = async (filePath: string) => {
  try {
    const { objectStorageClient, bucketName } = createStorageClient();
    const namespace = await objectStorageClient.getNamespace({});
    const namespaceName = namespace.value;

    const preSignedUrl =
      await objectStorageClient.createPreauthenticatedRequest({
        namespaceName,
        bucketName,
        createPreauthenticatedRequestDetails: {
          name: `download-${Date.now()}`,
          objectName: filePath,
          accessType:
            models.CreatePreauthenticatedRequestDetails.AccessType.ObjectRead,
          timeExpires: new Date(Date.now() + 3600 * 24000)
        }
      });

    const fullUrl = `https://objectstorage.sa-saopaulo-1.oraclecloud.com${preSignedUrl.preauthenticatedRequest.accessUri}`;

    return fullUrl;
  } catch (error) {
    console.error('Erro ao gerar URLs de download:', error);
    throw error;
  }
};

const getPathFileByUser = async (typeFile: string) => {
  const user = await getUserByToken();
  const fileNameRandon = `${randString(30, ['a', 'z'], ['A', 'Z'], ['0', '0'])}.${typeFile}`;

  const path = `accertodonto/${user.email}/${fileNameRandon}`;
  return { path, fileNameRandon };
};
