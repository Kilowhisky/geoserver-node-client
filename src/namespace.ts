import fetch from 'node-fetch';
import { getGeoServerResponseText, GeoServerResponseError } from './util/geoserver';
import AboutClient from './about'

/**
 * Client for GeoServer namespace
 *
 * @module NamespaceClient
 */
export default class NamespaceClient {
  private url: string;
  private auth: string;

  /**
   * Creates a GeoServer REST NamespaceClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  constructor (url: string, auth: string) {
    this.url = url;
    this.auth = auth;
  }

  /**
   * Returns all namespaces.
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An object describing the namespace
   */
  async getAll (): Promise<object> {
    const response = await fetch(this.url + 'namespaces.json', {
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
   * Creates a new namespace.
   *
   * @param {String} prefix Prefix of the new namespace
   * @param {String} uri Uri of the new namespace
   *
   * @throws Error if request fails
   *
   * @returns {Promise<string>} The name of the created namespace
   */
  async create (prefix: string, uri: string): Promise<string> {
    const body = {
      namespace: {
        prefix: prefix,
        uri: uri
      }
    };

    const response = await fetch(this.url + 'namespaces', {
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

    return response.text();
  }

  /**
   * Returns a namespace.
   *
   * @param {String} name Name of the namespace
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An object describing the namespace or undefined if it cannot be found
   */
  async get (name: string): Promise<object> {
    const response = await fetch(this.url + 'namespaces/' + name + '.json', {
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
   * Deletes a namespace.
   *
   * @param {String} name Name of the namespace to delete
   *
   * @throws Error if request fails
   */
  async delete (name: string) {
    const response = await fetch(this.url + 'namespaces/' + name, {
      method: 'DELETE',
      headers: {
        Authorization: this.auth
      }
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      switch (response.status) {
        case 403:
          throw new GeoServerResponseError(
            'Namespace or related Workspace is not empty (and recurse not true)',
            geoServerResponse);
        case 404:
          throw new GeoServerResponseError('Namespace doesn\'t exist', geoServerResponse);
        case 405:
          throw new GeoServerResponseError('Can\'t delete default namespace', geoServerResponse);
        default:
          throw new GeoServerResponseError('Response not recognized', geoServerResponse)
      }
    }
  }
}
