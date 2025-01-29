import { createStorageClient } from '../auth/config';
import { ListObjectsRequest } from 'oci-objectstorage/lib/request';

export const listObjects = async () => {
  const { objectStorageClient, bucketName } = createStorageClient();

  const namespace = await objectStorageClient.getNamespace({});
  const namespaceName = namespace.value;

  const listDetails: ListObjectsRequest = {
    namespaceName,
    bucketName
  };

  const response = await objectStorageClient.listObjects(listDetails);
  return response.listObjects.objects.map((obj) => obj.name);
};
