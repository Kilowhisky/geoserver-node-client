import LayerClient from './src/layer';
import StyleClient from './src/style';
import WorkspaceClient from './src/workspace';
import DatastoreClient from './src/datastore';
import ImageMosaicClient from './src/imagemosaic';
import SecurityClient from './src/security';
import SettingsClient from './src/settings';
import NamespaceClient from './src/namespace';
import AboutClient from './src/about';
import ResetReloadClient from './src/reset-reload';

export { GeoServerResponseError } from './src/util/geoserver'

/**
 * Client for GeoServer REST API.
 * Has minimal basic functionality and offers REST client instances for
 * sub-entities, like workspaces or datastores as member variables.
 *
 * @module GeoServerRestClient
 */
export class GeoServerRestClient {
  private url: string;
  private auth: string;

  layers: LayerClient;
  styles: StyleClient;
  workspaces: WorkspaceClient;
  namespaces: NamespaceClient;
  datastores: DatastoreClient;
  imagemosaics: ImageMosaicClient;
  security: SecurityClient;
  settings: SettingsClient;
  about: AboutClient;
  resetReload: ResetReloadClient;

  /**
   * Creates a GeoServerRestClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} user The user for the GeoServer REST API
   * @param {String} password The password for the GeoServer REST API
   */
  constructor (url: string, user: string, password: string) {
    this.url = url.endsWith('/') ? url : url + '/';
    this.auth = 'Basic ' + Buffer.from(user + ':' + password).toString('base64');

    /** @member {LayerClient} layers GeoServer REST client instance for layers */
    this.layers = new LayerClient(this.url, this.auth);
    /** @member {StyleClient} styles GeoServer REST client instance for styles */
    this.styles = new StyleClient(this.url, this.auth);
    /** @member {WorkspaceClient} workspaces GeoServer REST client instance for workspaces */
    this.workspaces = new WorkspaceClient(this.url, this.auth);
    /** @member {NamespaceClient} namespaces GeoServer REST client instance for namespaces */
    this.namespaces = new NamespaceClient(this.url, this.auth);
    /** @member {DatastoreClient} datastores GeoServer REST client instance for data stores */
    this.datastores = new DatastoreClient(this.url, this.auth);
    /** @member {ImageMosaicClient} imagemosaics GeoServer REST client instance for image mosaics */
    this.imagemosaics = new ImageMosaicClient(this.url, this.auth);
    /** @member {SecurityClient} security GeoServer REST client instance for security related modifications */
    this.security = new SecurityClient(this.url, this.auth);
    /** @member {SettingsClient} settings GeoServer REST client instance for settings */
    this.settings = new SettingsClient(this.url, this.auth);
    /** @member {AboutClient} about GeoServer REST client instance for about endpoint */
    this.about = new AboutClient(this.url, this.auth);
    /** @member {ResetReloadClient} about GeoServer REST client instance for reset/reload endpoints */
    this.resetReload = new ResetReloadClient(this.url, this.auth);
  }
}
