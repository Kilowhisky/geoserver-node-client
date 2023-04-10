import fetch from 'node-fetch';
import { getGeoServerResponseText, GeoServerResponseError } from './util/geoserver';
import AboutClient from './about'

/**
 * Client for GeoServer workspaces
 *
 * @module WorkspaceClient
 */
export default class WorkspaceClient {
  private url: string;
  private auth: string;

  /**
   * Creates a GeoServer REST WorkspaceClient instance.
   *
   * WARNING: For most cases the 'NameSpaceClient' seems to fit better.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  constructor (url: string, auth: string) {
    this.url = url;
    this.auth = auth;
  }

  /**
   * Returns all workspaces.
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An Object describing the workspaces
   */
  async getAll (): Promise<object> {
    const response = await fetch(this.url + 'workspaces.json', {
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
   * Returns a workspace.
   *
   * @param {String} name Name of the workspace
   *
   * @throws Error if request fails
   *
   * @returns {Promise<Object>} An object describing the workspaces
   */
  async get (name: string): Promise<object> {
    const response = await fetch(this.url + 'workspaces/' + name + '.json', {
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
   * Creates a new workspace.
   *
   * @param {String} name Name of the new workspace
   *
   * @throws Error if request fails
   *
   * @returns {Promise<String>} The name of the created workspace
   */
  async create (name: string): Promise<string> {
    const body = {
      workspace: {
        name: name
      }
    };

    const response = await fetch(this.url + 'workspaces', {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      switch (response.status) {
        case 409:
          throw new GeoServerResponseError('Unable to add workspace as it already exists', geoServerResponse);
        default:
          throw new GeoServerResponseError(null, geoServerResponse);
      }
    }

    return response.text();
  }

  /**
   * Deletes a workspace.
   *
   * @param {String} name Name of the workspace to delete
   * @param {Boolean} recurse Flag to enable recursive deletion
   *
   * @throws Error if request fails
   */
  async delete (name: string, recurse: boolean) {
    const response = await fetch(this.url + 'workspaces/' + name + '?recurse=' + recurse, {
      method: 'DELETE',
      headers: {
        Authorization: this.auth
      }
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      switch (response.status) {
        case 400:
          // the docs say code 403, but apparently it is code 400
          // https://docs.geoserver.org/latest/en/api/#1.0.0/workspaces.yaml
          throw new GeoServerResponseError(
            'Workspace or related Namespace is not empty (and recurse not true)',
            geoServerResponse);
        case 404:
          throw new GeoServerResponseError('Workspace doesn\'t exist', geoServerResponse);
        default:
          throw new GeoServerResponseError(null, geoServerResponse);
      }
    }
  }
}
