import { Region, SimpleAuthenticationDetailsProvider } from 'oci-common';
import { ObjectStorageClient } from 'oci-objectstorage';
import * as fs from 'fs';
import * as path from 'path';

const {
  ORACLE_TENANCY_OCID,
  ORACLE_USER_OCID,
  ORACLE_FINGERPRINT,
  ORACLE_PRIVATE_KEY_PATH,
  ORACLE_BUCKET_NAME
} = process.env;

export const createStorageClient = () => {
  if (
    !ORACLE_TENANCY_OCID ||
    !ORACLE_USER_OCID ||
    !ORACLE_FINGERPRINT ||
    !ORACLE_PRIVATE_KEY_PATH
  ) {
    throw new Error(
      'As variáveis de ambiente necessárias não estão definidas.'
    );
  }

  const privateKeyOracle = Buffer.from(
    ORACLE_PRIVATE_KEY_PATH,
    'base64'
  ).toString('utf-8');
  const privateKeyPathOracle = '/tmp/oracle_private_key.pem';
  fs.writeFileSync(privateKeyPathOracle, privateKeyOracle);

  // Carrega a chave privada
  const privateKeyPath = path.resolve(process.cwd(), privateKeyPathOracle);
  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(
      `Arquivo de chave privada não encontrado: ${privateKeyPath}`
    );
  }
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

  // Cria o provedor de autenticação
  const provider = new SimpleAuthenticationDetailsProvider(
    ORACLE_TENANCY_OCID,
    ORACLE_USER_OCID,
    ORACLE_FINGERPRINT,
    privateKey,
    null, // Opcional: Passe uma senha para a chave privada, se necessário
    Region.SA_SAOPAULO_1
  );

  // Inicializa o cliente do Object Storage
  const objectStorageClient = new ObjectStorageClient({
    authenticationDetailsProvider: provider
  });

  return { objectStorageClient, bucketName: ORACLE_BUCKET_NAME || '' };
};
