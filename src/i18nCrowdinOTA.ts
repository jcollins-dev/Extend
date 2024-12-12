import OtaClient from '@crowdin/ota-client';
import { BackendModule } from 'i18next';
import { Services, TOptions, InitOptions, ReadCallback } from 'i18next';

class CrowdinBackend implements BackendModule {
  type: 'backend';
  constructor() {
    this.type = 'backend';
  }

  init(services: Services, backendOptions: TOptions, i18nextOptions: InitOptions): void {
    const dns = i18nextOptions.defaultNS ? i18nextOptions.defaultNS : 'common';
    i18nextOptions.defaultNS = dns;
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    const client = new OtaClient(process.env.REACT_APP_CROWDIN_DISTRIBUTION_HASH as string);
    client
      .listFiles()
      .then((files) => {
        files.forEach((path) => {
          const pathArray = path.split('/');
          const fileName = pathArray[pathArray.length - 1].split('.')[0].slice(0);
          if (fileName === namespace) {
            client
              .getStringsByLocale(path, language)
              .then((data) => {
                callback(null, data);
              })
              .catch((error) => console.error(error));
          }
        });
      })
      .catch((error) => console.error(error));
  }
}
export default CrowdinBackend;
