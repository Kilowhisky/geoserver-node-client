import fetch from 'node-fetch';
import * as fs from 'fs';
import { getGeoServerResponseText, GeoServerResponseError } from './util/geoserver';
import AboutClient from './about'

/**
 * Client for GeoServer data stores
 *
 * @module DatastoreClient
 */
export default class DatastoreClient {
  private url: string;
  private auth: string;

  /**
   * Creates a GeoServer REST DatastoreClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  constructor (url: string, auth: string) {
    this.url = url;
    this.auth = auth;
  }

  /**
   * Get all DataStores in a workspace.
   *
   * @param {String} workspace The workspace to get DataStores for
   *
   * @returns {Promise<Object>} An object containing store details
   */
  async getDataStores (workspace: string): Promise<object> {
    return this.getStores(workspace, 'datastores');
  }

  /**
   * Get all CoverageStores in a workspace.
   *
   * @param {String} workspace The workspace to get CoverageStores for
   *
   * @returns {Promise<Object>} An object containing store details
   */
  async getCoverageStores (workspace: string): Promise<object> {
    return this.getStores(workspace, 'coveragestores');
  }

  /**
   * Get all WmsStores in a workspace.
   *
   * @param {String} workspace The workspace to get WmsStores for
   *
   * @returns {Promise<Object>} An object containing store details
   */
  async getWmsStores (workspace: string): Promise<object> {
    return this.getStores(workspace, 'wmsstores');
  }

  /**
   * Get all WmtsStores in a workspace.
   *
   * @param {String} workspace The workspace to get WmtsStores for
   *
   * @returns {Promise<Object>} An object containing store details
   */
  async getWmtsStores (workspace: string): Promise<object> {
    return this.getStores(workspace, 'wmtsstores');
  }

  /**
   * Get information about various store types in a workspace.
   *
   * @param {String} workspace The workspace name
   * @param {String} storeType The type of store
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   * @private
   */
  async getStores (workspace: string, storeType: string): Promise<object> {
    const response = await fetch(this.url + 'workspaces/' + workspace + '/' + storeType + '.json', {
      method: 'GET',
      headers: {
        Authorization: this.auth
      }
    });
    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
    return response.json();
  }

  /**
   * Get specific DataStore by name in a workspace.
   *
   * @param {String} workspace The workspace to search DataStore in
   * @param {String} dataStore DataStore name
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   */
  async getDataStore (workspace: string, dataStore: string): Promise<object> {
    return this.getStore(workspace, dataStore, 'datastores');
  }

  /**
   * Get specific CoverageStore by name in a workspace.
   *
   * @param {String} workspace The workspace to search CoverageStore in
   * @param {String} covStore CoverageStore name
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   */
  async getCoverageStore (workspace: string, covStore: string): Promise<object> {
    return this.getStore(workspace, covStore, 'coveragestores');
  }

  /**
   * Get specific WmsStore by name in a workspace.
   *
   * @param {String} workspace The workspace to search WmsStore in
   * @param {String} wmsStore WmsStore name
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   *
   */
  async getWmsStore (workspace: string, wmsStore: string): Promise<object> {
    return this.getStore(workspace, wmsStore, 'wmsstores');
  }

  /**
   * Get specific WmtsStore by name in a workspace.
   *
   * @param {String} workspace The workspace to search WmtsStore in
   * @param {String} wmtsStore WmtsStore name
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   */
  async getWmtsStore (workspace: string, wmtsStore: string): Promise<object> {
    return this.getStore(workspace, wmtsStore, 'wmtsstores');
  }

  /**
   * Get GeoServer store by type
   *
   * @param {String} workspace The name of the workspace
   * @param {String} storeName The name of the store
   * @param {String} storeType The type of the store
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An object containing store details or undefined if it cannot be found
   * @private
   */
  async getStore (workspace: string, storeName: string, storeType: string): Promise<object> {
    const url = this.url + 'workspaces/' + workspace + '/' + storeType + '/' + storeName + '.json';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.auth
      }
    });

    if (!response.ok) {
      const grc = new AboutClient(this.url, this.auth);
      if (await grc.exists()) {
        // GeoServer exists, but requested item does not exist,  we return empty
        return;
      } else {
        // There was a general problem with GeoServer
        const geoServerResponse = await getGeoServerResponseText(response);
        throw new GeoServerResponseError(null, geoServerResponse);
      }
    }
    return response.json();
  }

  /**
   * Creates a GeoTIFF store from a file by path and publishes it as layer.
   * The GeoTIFF file has to be placed on the server, where your GeoServer
   * is running.
   *
   * @param {String} workspace The workspace to create GeoTIFF store in
   * @param {String} coverageStore The name of the new GeoTIFF store
   * @param {String} layerName The published name of the new layer
   * @param {String} layerTitle The published title of the new layer
   * @param {String} filePath The path to the GeoTIFF file on the server
   *
   * @throws Error if request fails
   *
   * @returns {Promise<String>} The successful response text
   */
  async createGeotiffFromFile (workspace: string, coverageStore: string, layerName: string, layerTitle: string, filePath: string): Promise<string> {
    const lyrTitle = layerTitle || layerName;
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const readStream = fs.createReadStream(filePath);

    let url = this.url + 'workspaces/' + workspace + '/coveragestores/' +
        coverageStore + '/file.geotiff';
    url += '?filename=' + lyrTitle + '&coverageName=' + layerName;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'image/tiff',
        'Content-length': fileSizeInBytes.toString()
      },
      body: readStream
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
    // TODO: enforce JSON response or parse XML
    return response.text();
  }

  /**
   * Creates a PostGIS based data store.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} namespaceUri The namespace URI of the workspace
   * @param {String} dataStore The data store name to be created
   * @param {String} pgHost The PostGIS DB host
   * @param {Number} pgPort The PostGIS DB port
   * @param {String} pgUser The PostGIS DB user
   * @param {String} pgPassword The PostGIS DB password
   * @param {String} pgSchema The PostGIS DB schema
   * @param {String} pgDb The PostGIS DB name
   * @param {Boolean} [exposePk] expose primary key, defaults to false
   *
   * @throws Error if request fails
   */
  async createPostgisStore (workspace: string, namespaceUri: string, dataStore: string, pgHost: string, pgPort: number, pgUser: string, pgPassword: string, pgSchema: string, pgDb: string, exposePk: boolean) {
    const body = {
      dataStore: {
        name: dataStore,
        type: 'PostGIS',
        enabled: true,
        workspace: {
          name: workspace
        },
        connectionParameters: {
          entry: [
            {
              '@key': 'dbtype',
              $: 'postgis'
            },
            {
              '@key': 'schema',
              $: pgSchema
            },
            {
              '@key': 'database',
              $: pgDb
            },
            {
              '@key': 'host',
              $: pgHost
            },
            {
              '@key': 'port',
              $: pgPort
            },
            {
              '@key': 'passwd',
              $: pgPassword
            },
            {
              '@key': 'namespace',
              $: namespaceUri
            },
            {
              '@key': 'user',
              $: pgUser
            },
            {
              '@key': 'Expose primary keys',
              $: exposePk || false
            }
          ]
        }
      }
    };

    const url = this.url + 'workspaces/' + workspace + '/datastores';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // TODO: not tested yet
    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }

  /**
   * Creates an ImageMosaic store from a zip archive with the 3 necessary files
   *   - datastore.properties
   *   - indexer.properties
   *   - timeregex.properties
   *
   * The zip archive has to be given as absolute path, so before it has to be
   * placed on the server, where your GeoServer is running.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} dataStore The data store name
   * @param {String} zipArchivePath Absolute path to zip archive with the 3 properties files
   *
   * @throws Error if request fails
   *
   * @returns {Promise<String>} The response text
   */
  async createImageMosaicStore (workspace: string, coverageStore: string, zipArchivePath: string): Promise<string> {
    const readStream = fs.createReadStream(zipArchivePath);

    const url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/file.imagemosaic';
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/zip'
      },
      body: readStream
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }

    return response.text();
  }

  /**
   * Creates a WMS based data store.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} dataStore The data store name
   * @param {String} wmsCapabilitiesUrl Base WMS capabilities URL
   *
   * @throws Error if request fails
   */
  async createWmsStore (workspace: string, dataStore: string, wmsCapabilitiesUrl: string) {
    const body = {
      wmsStore: {
        name: dataStore,
        type: 'WMS',
        capabilitiesURL: wmsCapabilitiesUrl
      }
    };

    const url = this.url + 'workspaces/' + workspace + '/wmsstores';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }

  /**
   * Creates a WMTS based data store.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} dataStore The data store name
   * @param {String} wmtsCapabilitiesUrl Base WMTS capabilities URL
   *
   * @throws Error if request fails
   */
  async createWmtsStore (workspace: string, dataStore: string, wmtsCapabilitiesUrl: string) {
    const body = {
      wmtsStore: {
        name: dataStore,
        type: 'WMTS',
        capabilitiesURL: wmtsCapabilitiesUrl
      }
    };

    const url = this.url + 'workspaces/' + workspace + '/wmtsstores';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }

  /**
   * Creates a WFS based data store.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} dataStore The data store name
   * @param {String} wfsCapabilitiesUrl WFS capabilities URL
   * @param {String} namespaceUrl URL of the GeoServer namespace
   * @param {Boolean} [useHttpConnectionPooling=true] use HTTP connection pooling for WFS connection
   *
   * @throws Error if request fails
   */
  async createWfsStore (workspace: string, dataStore: string, wfsCapabilitiesUrl: string, namespaceUrl: string, useHttpConnectionPooling = true) {
    const body = {
      dataStore: {
        name: dataStore,
        type: 'Web Feature Server (NG)',
        connectionParameters: {
          entry: [
            {
              '@key': 'WFSDataStoreFactory:GET_CAPABILITIES_URL',
              $: wfsCapabilitiesUrl
            },
            {
              '@key': 'namespace',
              $: namespaceUrl
            },
            {
              '@key': 'WFSDataStoreFactory:USE_HTTP_CONNECTION_POOLING',
              $: useHttpConnectionPooling
            }
          ]
        }
      }
    };

    const url = this.url + 'workspaces/' + workspace + '/datastores';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }

  /**
   * Deletes a data store.
   *
   * @param {String} workspace The workspace where the data store is in
   * @param {String} dataStore Name of data store (coveragestore) to delete
   * @param {String} recurse Flag to enable recursive deletion
   *
   * @throws Error if request fails
   */
  async deleteDataStore (workspace: string, dataStore: string, recurse: string) {
    let url = this.url + 'workspaces/' + workspace + '/datastores/' + dataStore;
    url += '?recurse=' + recurse;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.auth
      }
    });

    if (!response.ok) {
      // TODO: could not find status codes in the docs or via testing
      //       https://docs.geoserver.org/latest/en/api/#1.0.0/datastores.yaml
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }

  /**
   * Deletes a CoverageStore.
   *
   * @param {String} workspace The workspace where the CoverageStore is in
   * @param {String} coverageStore Name of CoverageStore to delete
   * @param {String} recurse Flag to enable recursive deletion
   *
   * @throws Error if request fails
   */
  async deleteCoverageStore (workspace: string, coverageStore: string, recurse: string) {
    let url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore;
    url += '?recurse=' + recurse;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.auth
      }
    });

    // TODO: could not test it
    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      switch (response.status) {
        case 401:
          throw new GeoServerResponseError('Deletion failed. There might be dependant objects to ' +
          'this store. Delete them first or call this with "recurse=false"', geoServerResponse);
        default:
          throw new GeoServerResponseError(null, geoServerResponse);
      }
    }
  }

  /**
   * Creates a GeoPackage store from a file placed in the geoserver_data dir.
   *
   * @param {String} workspace The WS to create the data store in
   * @param {String} dataStore The data store name
   * @param {String} gpkgPath Relative path to GeoPackage file within geoserver_data dir
   *
   * @throws Error if request fails
   */
  async createGpkgStore (workspace: string, dataStore: string, gpkgPath: string) {
    const body = {
      dataStore: {
        name: dataStore,
        type: 'GeoPackage',
        connectionParameters: {
          entry: [
            {
              '@key': 'database',
              $: `file:${gpkgPath}`
            },
            {
              '@key': 'dbtype',
              $: 'geopkg'
            }
          ]
        }
      }
    };

    const url = this.url + 'workspaces/' + workspace + '/datastores';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }
}
