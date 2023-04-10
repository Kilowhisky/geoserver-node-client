import fetch from 'node-fetch';
import { GeoServerResponseError, getGeoServerResponseText } from './util/geoserver';

/**
 * Client for GeoServer "about" endpoint
 *
 * @module AboutClient
 */
export default class AboutClient {
  private url: string;
  private auth: string;

  /**
   * Creates a GeoServer REST AboutClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  constructor (url: string, auth: string) {
    this.url = url;
    this.auth = auth;
  }

  /**
   * Get the GeoServer version.
   *
   * @throws Error if request fails
   *
   * @returns {Promise<object>} The version of GeoServer
   */
  async getVersion (): Promise<object> {
    const url = this.url + 'about/version.json';
    const response = await fetch(url, {
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
   * Checks if the configured GeoServer REST connection exists.
   *
   * @returns {Promise<boolean>} If the connection exists
   */
  async exists (): Promise<boolean> {
    let versionInfo;
    try {
      versionInfo = await this.getVersion();
      return !!versionInfo
    } catch (error) {
      return false;
    }
  }
}
